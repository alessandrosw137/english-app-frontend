# -*- coding: utf-8 -*-
"""
MASTERENG MASSIVE DICTIONARY EXPANSION & KOKORO TTS AUDIO GENERATOR
EXPANSIÓN A-Z EXTREMA: Phrasal Verbs A-Z (600+), Modismos y Slang Mexicano (150+), y Adjetivos de Luz (120+)
"""

import json
import os
import re
import sys
import time
import shutil
from pathlib import Path

# Paths
BASE_DIR = Path("C:/Users/alessandro/Desktop/ENGLISH")
DICT_PATH = BASE_DIR / "js" / "world3d_dictionaries.js"
CULINARY_PATH = BASE_DIR / "js" / "culinary_databank.js"

KOKORO_MODEL = Path("C:/Users/alessandro/Kokoro-TTS/kokoro-tts/models/kokoro-v1.0.onnx")
KOKORO_VOICES = Path("C:/Users/alessandro/Kokoro-TTS/kokoro-tts/models/voices-v1.0.bin")

OUTPUT_DIRS = [
    BASE_DIR / "audio" / "vocab",
    BASE_DIR / "public" / "audio" / "vocab",
    BASE_DIR / "app" / "src" / "main" / "assets" / "audio" / "vocab"
]

for d in OUTPUT_DIRS:
    d.mkdir(parents=True, exist_ok=True)

print("Iniciando generación de datos masivos...")
