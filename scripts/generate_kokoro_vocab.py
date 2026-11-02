# -*- coding: utf-8 -*-
"""
MASTERENG MASSIVE KOKORO TTS VOCABULARY GENERATOR
Sintetiza de forma masiva todos los audios en en-us con voz af_sarah
para Phrasal Verbs A-Z (640+), Vocabulario Coloquial (130+),
Vocabulario Visual / Adjetivos (50+), y Databank Culinario (350+).
"""

import os
import re
import sys
import time
import json
import shutil
from pathlib import Path
import soundfile as sf
from kokoro_tts import Kokoro

# Model paths
KOKORO_MODEL = Path("C:/Users/alessandro/Kokoro-TTS/kokoro-tts/models/kokoro-v1.0.onnx")
KOKORO_VOICES = Path("C:/Users/alessandro/Kokoro-TTS/kokoro-tts/models/voices-v1.0.bin")

OUTPUT_DIRS = [
    Path("public/audio/vocab"),
    Path("audio/vocab"),
    Path("app/src/main/assets/audio/vocab"),
    Path("ENGLISH-/audio/vocab")
]

for d in OUTPUT_DIRS:
    d.mkdir(parents=True, exist_ok=True)

vocab_to_keys = {} # text_to_speak -> set of filenames (without .wav)

def register_item(key, text):
    if not key or not text:
        return
    clean_key = re.sub(r'[^a-z0-9_-]', '_', key.lower().strip()).strip('_')
    clean_key = re.sub(r'_+', '_', clean_key)
    clean_text = text.split("/")[0].strip()
    if not clean_key or not clean_text:
        return
    if clean_text not in vocab_to_keys:
        vocab_to_keys[clean_text] = set()
    vocab_to_keys[clean_text].add(clean_key)
    direct_key = re.sub(r'[^a-z0-9_-]', '_', clean_text.lower().strip()).strip('_')
    direct_key = re.sub(r'_+', '_', direct_key)
    if direct_key:
        vocab_to_keys[clean_text].add(direct_key)

# 1. Cargar js/world3d_dictionaries.js
dict_path = Path("js/world3d_dictionaries.js")
if dict_path.exists():
    content = dict_path.read_text(encoding="utf-8")
    for section_pattern in [
        r'const PHRASAL_VERBS_A_Z = (\[.*?\]);\s*\n\s*// 2\.',
        r'const COLLOQUIAL_VOCABULARY = (\[.*?\]);\s*\n\s*// 3\.',
        r'const VISUAL_LIGHT_VOCABULARY = (\[.*?\]);\s*\n\s*//\s*Catálogo unificado'
    ]:
        m = re.search(section_pattern, content, re.DOTALL)
        if m:
            try:
                items = json.loads(m.group(1))
                for item in items:
                    term = item.get("term", "").strip()
                    if term:
                        clean_id = re.sub(r'[^a-z0-9_-]', '_', term.lower()).strip('_')
                        register_item(clean_id, term)
            except Exception as e:
                print(f"Aviso parseando sección: {e}")

# 2. Cargar js/culinary_databank.js
cul_path = Path("js/culinary_databank.js")
if cul_path.exists():
    content = cul_path.read_text(encoding="utf-8")
    for m in re.finditer(r'"id"\s*:\s*"([^"]+)"[^{}]*"nameEn"\s*:\s*"([^"]+)"', content):
        register_item(m.group(1), m.group(2))
    for m in re.finditer(r'"id"\s*:\s*"([^"]+)"[^{}]*"termEn"\s*:\s*"([^"]+)"', content):
        register_item(m.group(1), m.group(2))

# 3. Cargar js/world3d.js
w3d_path = Path("js/world3d.js")
if w3d_path.exists():
    content = w3d_path.read_text(encoding="utf-8")
    for m in re.finditer(r'"id"\s*:\s*"([^"]+)"\s*,\s*"en"\s*:\s*"([^"]+)"', content):
        register_item(m.group(1), m.group(2))

print(f"Total de textos únicos a sintetizar con Kokoro TTS: {len(vocab_to_keys)}")
total_files_expected = sum(len(keys) for keys in vocab_to_keys.values())
print(f"Total de archivos .wav mapeados: {total_files_expected}")

# 4. Cargar modelo Kokoro ONNX
print(f"Cargando modelo Kokoro TTS ({KOKORO_MODEL.name})...")
t_load = time.time()
tts = Kokoro(str(KOKORO_MODEL), str(KOKORO_VOICES))
print(f"Modelo cargado en {time.time() - t_load:.2f}s.")

primary_dir = OUTPUT_DIRS[0]

# 5. Síntesis y guardado
generados = 0
omitidos = 0
errores = 0

start_time = time.time()
for idx, (text_to_speak, keys) in enumerate(vocab_to_keys.items(), 1):
    missing_keys = [k for k in keys if not (primary_dir / f"{k}.wav").exists() or (primary_dir / f"{k}.wav").stat().st_size < 1000]
    
    if not missing_keys:
        omitidos += len(keys)
        continue

    try:
        samples, sample_rate = tts.create(
            text=text_to_speak,
            voice="af_sarah",
            speed=1.0,
            lang="en-us",
            trim=True
        )
        
        first_key = missing_keys[0]
        first_file = primary_dir / f"{first_key}.wav"
        sf.write(str(first_file), samples, sample_rate)
        generados += 1
        
        for other_key in missing_keys[1:]:
            other_file = primary_dir / f"{other_key}.wav"
            shutil.copyfile(first_file, other_file)
            generados += 1

        if generados % 25 == 0 or idx == len(vocab_to_keys):
            elapsed = time.time() - start_time
            print(f"[{idx}/{len(vocab_to_keys)}] Generados: {generados}, Omitidos: {omitidos} ({elapsed:.1f}s)")

    except Exception as e:
        print(f"Error generando '{text_to_speak}': {e}")
        errores += 1

# 6. Replicar a todas las carpetas destino
print("Replicando archivos de audio a todas las carpetas tri-directorio...")
all_wavs = list(primary_dir.glob("*.wav"))
print(f"Total de archivos WAV en carpeta principal: {len(all_wavs)}")

for other_dir in OUTPUT_DIRS[1:]:
    rep_count = 0
    for wav_file in all_wavs:
        dest = other_dir / wav_file.name
        if not dest.exists() or dest.stat().st_size != wav_file.stat().st_size:
            shutil.copyfile(wav_file, dest)
            rep_count += 1
    print(f"Sincronizados {rep_count} archivos hacia {other_dir}")

print(f"Proceso finalizado con éxito: {generados} generados, {omitidos} ya existían, {errores} errores.")
print(f"Tiempo total: {time.time() - start_time:.2f}s")
