import os
import re
import sys
import time
import shutil
from pathlib import Path
import soundfile as sf
from kokoro_tts import Kokoro

# Rutas de Kokoro TTS
KOKORO_MODEL = Path("C:/Users/alessandro/Kokoro-TTS/kokoro-tts/models/kokoro-v1.0.onnx")
KOKORO_VOICES = Path("C:/Users/alessandro/Kokoro-TTS/kokoro-tts/models/voices-v1.0.bin")

OUTPUT_DIRS = [
    Path("public/audio/vocab"),
    Path("audio/vocab"),
    Path("app/src/main/assets/audio/vocab")
]

for d in OUTPUT_DIRS:
    d.mkdir(parents=True, exist_ok=True)

# 1. Extraer mapeo de vocabulario
vocab_to_keys = {} # text_to_speak -> set of filenames (without .wav)

def register_item(key, text):
    if not key or not text:
        return
    clean_key = re.sub(r'[^a-z0-9_-]', '_', key.lower().strip()).strip('_')
    # Quitar slashes en texto: ej "Sofa / Couch" -> "Sofa"
    clean_text = text.split("/")[0].strip()
    if not clean_key or not clean_text:
        return
    if clean_text not in vocab_to_keys:
        vocab_to_keys[clean_text] = set()
    vocab_to_keys[clean_text].add(clean_key)
    # También clave directa del texto en minúsculas (ej. "Sun" -> "sun")
    direct_key = re.sub(r'[^a-z0-9_-]', '_', clean_text.lower()).strip('_')
    if direct_key:
        vocab_to_keys[clean_text].add(direct_key)

# A) World 3D
w3d_path = Path("js/world3d.js")
if w3d_path.exists():
    content = w3d_path.read_text(encoding="utf-8")
    for m in re.finditer(r'"id"\s*:\s*"([^"]+)"\s*,\s*"en"\s*:\s*"([^"]+)"', content):
        register_item(m.group(1), m.group(2))

# B) Culinary Databank
cul_path = Path("js/culinary_databank.js")
if cul_path.exists():
    content = cul_path.read_text(encoding="utf-8")
    for m in re.finditer(r'"id"\s*:\s*"([^"]+)"[^{}]*"nameEn"\s*:\s*"([^"]+)"', content):
        register_item(m.group(1), m.group(2))
    for m in re.finditer(r'"id"\s*:\s*"([^"]+)"[^{}]*"termEn"\s*:\s*"([^"]+)"', content):
        register_item(m.group(1), m.group(2))

# C) Palabras esenciales obligatorias requeridas por el usuario
essential_words = [
    ("sun", "Sun"),
    ("earth", "Earth"),
    ("knife", "Knife"),
    ("onion", "Onion"),
    ("refrigerator", "Refrigerator"),
    ("potato", "Potato"),
    ("juice", "Juice"),
    ("peach", "Peach"),
    ("peanut", "Peanut"),
    ("leek", "Leek"),
    ("pen", "Pen"),
    ("straw", "Straw"),
    ("bathtub", "Bathtub"),
    ("computer", "Computer"),
    ("car", "Car"),
    ("phone", "Phone"),
    ("cellphone", "Cellphone")
]
for k, t in essential_words:
    register_item(k, t)

print(f"Total de textos únicos a sintetizar con Kokoro TTS: {len(vocab_to_keys)}")
total_files_expected = sum(len(keys) for keys in vocab_to_keys.values())
print(f"Total de archivos .wav mapeados: {total_files_expected}")

# 2. Cargar modelo Kokoro ONNX
print(f"Cargando modelo Kokoro TTS ({KOKORO_MODEL.name})...")
t_load = time.time()
tts = Kokoro(str(KOKORO_MODEL), str(KOKORO_VOICES))
print(f"Modelo cargado en {time.time() - t_load:.2f}s.")

primary_dir = OUTPUT_DIRS[0]

# 3. Síntesis y guardado
generados = 0
omitidos = 0
errores = 0

start_time = time.time()
for idx, (text_to_speak, keys) in enumerate(vocab_to_keys.items(), 1):
    # Verificar si todas las claves ya existen en primary_dir
    missing_keys = [k for k in keys if not (primary_dir / f"{k}.wav").exists() or (primary_dir / f"{k}.wav").stat().st_size < 1000]
    
    if not missing_keys:
        omitidos += len(keys)
        continue

    try:
        # Generar audio con voz "af_sarah", idioma "en-us", velocidad 1.0
        samples, sample_rate = tts.create(
            text=text_to_speak,
            voice="af_sarah",
            speed=1.0,
            lang="en-us",
            trim=True
        )
        
        # Guardar la primera clave faltante
        first_key = missing_keys[0]
        first_file = primary_dir / f"{first_key}.wav"
        sf.write(str(first_file), samples, sample_rate)
        generados += 1
        
        # Copiar a las demás claves faltantes del mismo texto
        for other_key in missing_keys[1:]:
            other_file = primary_dir / f"{other_key}.wav"
            shutil.copyfile(first_file, other_file)
            generados += 1

        if idx % 50 == 0 or idx == len(vocab_to_keys):
            elapsed = time.time() - start_time
            print(f"[{idx}/{len(vocab_to_keys)}] Generados: {generados}, Omitidos existentes: {omitidos} ({elapsed:.1f}s transcurridos)")

    except Exception as e:
        print(f"Error generando '{text_to_speak}': {e}")
        errores += 1

# 4. Replicar a las otras carpetas de salida (audio/vocab y app/src/main/assets/audio/vocab)
print("Replicando archivos de audio a carpetas tri-directorio...")
for filename in primary_dir.glob("*.wav"):
    for other_dir in OUTPUT_DIRS[1:]:
        dest = other_dir / filename.name
        if not dest.exists() or dest.stat().st_size != filename.stat().st_size:
            shutil.copyfile(filename, dest)

print(f"Proceso finalizado con éxito: {generados} generados, {omitidos} ya existían, {errores} errores.")
print(f"Tiempo total: {time.time() - start_time:.2f}s")
