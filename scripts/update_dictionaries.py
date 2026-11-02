# -*- coding: utf-8 -*-
"""
Merges and updates js/world3d_dictionaries.js and js/culinary_databank.js
with 640+ Phrasal Verbs A-Z, 130+ Colloquial Mexican Expressions,
and 50+ Visual Light Adjectives.
"""

import json
import os
import re
import sys
from pathlib import Path

sys.path.append(str(Path(__file__).parent))
import dictionary_data
import additional_data

# Combine all phrasals
all_phrasals_input = dictionary_data.EXPANDED_PHRASAL_VERBS + additional_data.ADDITIONAL_PHRASALS
all_colloquial_input = dictionary_data.EXPANDED_COLLOQUIAL_VOCABULARY + additional_data.ADDITIONAL_COLLOQUIAL
all_visual_input = dictionary_data.EXPANDED_VISUAL_LIGHT + additional_data.ADDITIONAL_VISUAL_LIGHT

# 1. READ js/world3d_dictionaries.js
w3d_path = Path("js/world3d_dictionaries.js")
w3d_content = w3d_path.read_text(encoding="utf-8")

# Extract existing PHRASAL_VERBS_A_Z
m_pv = re.search(r'const PHRASAL_VERBS_A_Z = (\[.*?\]);\s*\n\s*// 2\.', w3d_content, re.DOTALL)
if not m_pv:
    raise ValueError("No se pudo encontrar PHRASAL_VERBS_A_Z en world3d_dictionaries.js")

existing_phrasals = json.loads(m_pv.group(1))

# Extract existing COLLOQUIAL_VOCABULARY
m_col = re.search(r'const COLLOQUIAL_VOCABULARY = (\[.*?\]);\s*\n\s*// 3\.', w3d_content, re.DOTALL)
if not m_col:
    raise ValueError("No se pudo encontrar COLLOQUIAL_VOCABULARY en world3d_dictionaries.js")

existing_colloquial = json.loads(m_col.group(1))

# Extract existing VISUAL_LIGHT_VOCABULARY
m_vis = re.search(r'const VISUAL_LIGHT_VOCABULARY = (\[.*?\]);\s*\n\s*// 4\.', w3d_content, re.DOTALL)
if not m_vis:
    raise ValueError("No se pudo encontrar VISUAL_LIGHT_VOCABULARY en world3d_dictionaries.js")

existing_visual = json.loads(m_vis.group(1))

# Merge Phrasal Verbs
phrasal_map = {}
for item in existing_phrasals:
    phrasal_map[item["term"].strip().lower()] = item
for item in all_phrasals_input:
    k = item["term"].strip().lower()
    if k not in phrasal_map:
        phrasal_map[k] = item

merged_phrasals = list(phrasal_map.values())
merged_phrasals.sort(key=lambda x: x["term"].lower())

# Merge Colloquial
colloquial_map = {}
for item in existing_colloquial:
    colloquial_map[item["term"].strip().lower()] = item
for item in all_colloquial_input:
    k = item["term"].strip().lower()
    if k not in colloquial_map:
        colloquial_map[k] = item

merged_colloquial = list(colloquial_map.values())
merged_colloquial.sort(key=lambda x: x["term"].lower())

# Merge Visual Light
visual_map = {}
for item in existing_visual:
    visual_map[item["term"].strip().lower()] = item
for item in all_visual_input:
    k = item["term"].strip().lower()
    if k not in visual_map:
        visual_map[k] = item

merged_visual = list(visual_map.values())
merged_visual.sort(key=lambda x: x["term"].lower())

print(f"Total Phrasal Verbs: {len(merged_phrasals)}")
print(f"Total Colloquial: {len(merged_colloquial)}")
print(f"Total Visual Light: {len(merged_visual)}")

# Helper to format json array with nice indentation
def format_js_array(items, indent=2):
    lines = ["[\n"]
    for i, it in enumerate(items):
        lines.append("  " * indent + "{\n")
        lines.append("  " * indent + f'  "term": {json.dumps(it["term"], ensure_ascii=False)},\n')
        lines.append("  " * indent + f'  "pron": {json.dumps(it["pron"], ensure_ascii=False)},\n')
        lines.append("  " * indent + f'  "meaning": {json.dumps(it["meaning"], ensure_ascii=False)},\n')
        lines.append("  " * indent + f'  "example": {json.dumps(it["example"], ensure_ascii=False)}\n')
        if i < len(items) - 1:
            lines.append("  " * indent + "},\n")
        else:
            lines.append("  " * indent + "}\n")
    lines.append("  " * (indent - 1) + "]")
    return "".join(lines)

new_pv_str = "const PHRASAL_VERBS_A_Z = " + format_js_array(merged_phrasals, indent=1) + ";\n\n  // 2."
new_col_str = "const COLLOQUIAL_VOCABULARY = " + format_js_array(merged_colloquial, indent=1) + ";\n\n  // 3."
new_vis_str = "const VISUAL_LIGHT_VOCABULARY = " + format_js_array(merged_visual, indent=1) + ";\n\n  // 4."

updated_w3d = re.sub(r'const PHRASAL_VERBS_A_Z = \[.*?\];\s*\n\s*// 2\.', new_pv_str, w3d_content, flags=re.DOTALL)
updated_w3d = re.sub(r'const COLLOQUIAL_VOCABULARY = \[.*?\];\s*\n\s*// 3\.', new_col_str, updated_w3d, flags=re.DOTALL)
updated_w3d = re.sub(r'const VISUAL_LIGHT_VOCABULARY = \[.*?\];\s*\n\s*// 4\.', new_vis_str, updated_w3d, flags=re.DOTALL)

w3d_path.write_text(updated_w3d, encoding="utf-8")
print(f"js/world3d_dictionaries.js actualizado exitosamente ({len(updated_w3d)} caracteres).")
