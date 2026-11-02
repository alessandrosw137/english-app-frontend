# -*- coding: utf-8 -*-
"""
Updates js/world3d_dictionaries.js and js/culinary_databank.js
with 640+ Phrasal Verbs A-Z, 130+ Colloquial Mexican Expressions,
and 50+ Visual Light Adjectives, plus Mexican Culinary Techniques.
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
m_vis = re.search(r'const VISUAL_LIGHT_VOCABULARY = (\[.*?\]);\s*\n\s*//\s*Catálogo unificado', w3d_content, re.DOTALL)
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
new_vis_str = "const VISUAL_LIGHT_VOCABULARY = " + format_js_array(merged_visual, indent=1) + ";\n\n  // Catálogo unificado"

updated_w3d = re.sub(r'const PHRASAL_VERBS_A_Z = \[.*?\];\s*\n\s*// 2\.', new_pv_str, w3d_content, flags=re.DOTALL)
updated_w3d = re.sub(r'const COLLOQUIAL_VOCABULARY = \[.*?\];\s*\n\s*// 3\.', new_col_str, updated_w3d, flags=re.DOTALL)
updated_w3d = re.sub(r'const VISUAL_LIGHT_VOCABULARY = \[.*?\];\s*\n\s*//\s*Catálogo unificado', new_vis_str, updated_w3d, flags=re.DOTALL)

w3d_path.write_text(updated_w3d, encoding="utf-8")
print(f"js/world3d_dictionaries.js actualizado con {len(merged_phrasals)} Phrasal Verbs, {len(merged_colloquial)} Coloquiales, y {len(merged_visual)} Visuales.")

# 2. UPDATE js/culinary_databank.js
cul_path = Path("js/culinary_databank.js")
cul_content = cul_path.read_text(encoding="utf-8")

m_cul = re.search(r'const culinaryVerbsAndSlang = (\[.*?\]);\s*\n\s*const recipes =', cul_content, re.DOTALL)
if not m_cul:
    raise ValueError("No se pudo encontrar culinaryVerbsAndSlang en culinary_databank.js")

existing_cul = json.loads(m_cul.group(1))

MEXICAN_CULINARY_SLANG = [
    {
        "id": "tech_tatemar",
        "termEn": "Charring (Tatemar)",
        "termEs": "Tatemar",
        "ipa": "/tɑː.teˈmɑːr/",
        "category": "Mexican Culinary Techniques",
        "categoryEs": "Técnicas Culinarias Mexicanas",
        "contextEn": "Pre-Hispanic dry roasting technique on a clay comal until skins are blistered and charred black.",
        "contextEs": "Técnica prehispánica de asar chiles, jitomates y cebollas al comal seco hasta quemar la piel.",
        "exampleDialogueEn": "“Tatemar the serrano peppers on the screaming-hot comal before pulsing in the molcajete.”",
        "exampleDialogueEs": "“¡Tatemar bien los chiles serranos en el comal al rojo vivo antes de martajarlos en el molcajete!”",
        "audioPrompt": "Tatemar, pre-Hispanic dry roasting on a screaming-hot comal."
    },
    {
        "id": "tech_torear_chiles",
        "termEn": "Chili Blistering (Torear Chiles)",
        "termEs": "Torear Chiles",
        "ipa": "/toʊ.reˈɑːr ˈtʃiː.les/",
        "category": "Mexican Culinary Techniques",
        "categoryEs": "Técnicas Culinarias Mexicanas",
        "contextEn": "Rolling and pan-frying fresh chilis with coarse sea salt and lime until softened and spicy.",
        "contextEs": "Frotar y freír chiles cuaresmeños o toreados en manteca con jugo de limón y sal de grano.",
        "exampleDialogueEn": "“Torear these chiles güeros in lard with sea salt for the taco feast!”",
        "exampleDialogueEs": "“¡Torear estos chiles güeros con manteca y sal de grano para acompañar los tacos de cecina!”",
        "audioPrompt": "Torear Chiles, blistering fresh peppers with coarse salt and lime."
    },
    {
        "id": "tech_acitronar",
        "termEn": "Translucent Sautéing (Acitronar)",
        "termEs": "Acitronar",
        "ipa": "/ɑː.si.troʊˈnɑːr/",
        "category": "Mexican Culinary Techniques",
        "categoryEs": "Técnicas Culinarias Mexicanas",
        "contextEn": "Sweating diced onions and garlic in hot fat until glass-like, translucent and sweet.",
        "contextEs": "Freír cebolla picada y ajo en manteca o aceite hasta que queden transparentes y suaves sin dorar.",
        "exampleDialogueEn": "“Acitronar the finely diced white onion until completely translucent before pouring the pureed tomatoes.”",
        "exampleDialogueEs": "“¡Acitronar la cebolla finamente picada hasta que quede transparente antes de vaciar el caldillo!”",
        "audioPrompt": "Acitronar, sweating onions and garlic until translucent and sweet."
    },
    {
        "id": "tech_desflemar",
        "termEn": "Brine De-bittering (Desflemar)",
        "termEs": "Desflemar",
        "ipa": "/des.fleˈmɑːr/",
        "category": "Mexican Culinary Techniques",
        "categoryEs": "Técnicas Culinarias Mexicanas",
        "contextEn": "Soaking sliced onions or pungent chilis in salted water or vinegar to mellow their aggressive bite.",
        "contextEs": "Poner la cebolla morada o los chiles manzano en agua con sal o vinagre para suavizar su picor y acidez.",
        "exampleDialogueEn": "“Desflemar the purple onions with lime juice and oregano for the cochinita pibil garnish.”",
        "exampleDialogueEs": "“¡Desflemar la cebolla morada con limón y orégano para acompañar la cochinita pibil!”",
        "audioPrompt": "Desflemar, soaking pungent onions or chilis in acidulated brine."
    },
    {
        "id": "tech_molcajete_grinding",
        "termEn": "Volcanic Mortar Grinding (Martajar)",
        "termEs": "Martajar en Molcajete",
        "ipa": "/mɑːr.tɑːˈhɑːr/",
        "category": "Mexican Culinary Techniques",
        "categoryEs": "Técnicas Culinarias Mexicanas",
        "contextEn": "Crushing roasted ingredients with the basalt pestle (tejolote) for an authentic coarse, rustic salsa texture.",
        "contextEs": "Triturar ingredientes asados con el tejolote de piedra volcánica para obtener una salsa martajada rústica.",
        "exampleDialogueEn": "“Martajar the charred garlic and rock salt first, then crush the blistered roma tomatoes.”",
        "exampleDialogueEs": "“¡Martajar el ajo asado y la sal de grano primero, luego aplastar los jitomates tatemados!”",
        "audioPrompt": "Martajar en Molcajete, rustic volcanic basalt mortar grinding."
    },
    {
        "id": "slang_en_camote",
        "termEn": "In the Weeds (En Camote)",
        "termEs": "Estar en Camote",
        "ipa": "/esˈtɑːr en kɑːˈmoʊ.te/",
        "category": "Kitchen Line Slang",
        "categoryEs": "Jerga de Línea de Cocina",
        "contextEn": "When a station is completely slammed and overwhelmed with overlapping orders during the rush.",
        "contextEs": "Estar hasta el cuello de comandas acumuladas durante el servicio pico de la comida.",
        "exampleDialogueEn": "“The sauté station is completely in the weeds; hop on and help them plate the enchiladas!”",
        "exampleDialogueEs": "“¡La estación de sartenes está en camote; métete a tirarles paro a emplatar las enchiladas!”",
        "audioPrompt": "Estar en Camote, completely slammed with orders during peak dinner rush."
    },
    {
        "id": "slang_la_comanda",
        "termEn": "The Order Ticket (La Comanda)",
        "termEs": "La Comanda",
        "ipa": "/lɑː koʊˈmɑːn.dɑː/",
        "category": "Kitchen Line Slang",
        "categoryEs": "Jerga de Línea de Cocina",
        "contextEn": "The printed kitchen order ticket detailing table number, guest counts, and coursed dish modifications.",
        "contextEs": "El boleto impreso con la orden de los comensales, número de mesa y especificaciones del cliente.",
        "exampleDialogueEn": "“Pick up table four's comanda! Two ribeyes medium-rare and one sea bass!”",
        "exampleDialogueEs": "“¡Canten la comanda de la mesa cuatro! ¡Dos ribeyes al punto y un robalo a la plancha!”",
        "audioPrompt": "La Comanda, the printed kitchen order ticket directing line flow."
    },
    {
        "id": "slang_ponerse_la_del_puebla",
        "termEn": "Step Up and Share (Ponerse la del Puebla)",
        "termEs": "Ponerse la del Puebla",
        "ipa": "/poʊˈner.se lɑː del ˈpwe.blɑː/",
        "category": "Kitchen Line Slang",
        "categoryEs": "Jerga de Línea de Cocina",
        "contextEn": "Teamwork slang meaning stepping up to take half the heavy prep load or sharing station tips.",
        "contextEs": "Jerga de compañerismo en cocina: cooperar al 50% con la talacha pesada de la preparación.",
        "exampleDialogueEn": "“Ponte la del Puebla and peel half of these fifty pounds of Yukon gold potatoes with me.”",
        "exampleDialogueEs": "“¡Ponte la del Puebla y ayúdame a pelar la mitad de este costal de papas de volada!”",
        "audioPrompt": "Ponerse la del Puebla, stepping up to split heavy kitchen prep fifty-fifty."
    }
]

# Merge into culinaryVerbsAndSlang
cul_map = {x["id"]: x for x in existing_cul}
for x in MEXICAN_CULINARY_SLANG:
    cul_map[x["id"]] = x

merged_cul = list(cul_map.values())

def format_cul_array(items, indent=2):
    lines = ["[\n"]
    for i, it in enumerate(items):
        lines.append("  " * indent + "{\n")
        lines.append("  " * indent + f'  "id": {json.dumps(it["id"], ensure_ascii=False)},\n')
        lines.append("  " * indent + f'  "termEn": {json.dumps(it["termEn"], ensure_ascii=False)},\n')
        lines.append("  " * indent + f'  "termEs": {json.dumps(it["termEs"], ensure_ascii=False)},\n')
        lines.append("  " * indent + f'  "ipa": {json.dumps(it["ipa"], ensure_ascii=False)},\n')
        lines.append("  " * indent + f'  "category": {json.dumps(it["category"], ensure_ascii=False)},\n')
        lines.append("  " * indent + f'  "categoryEs": {json.dumps(it["categoryEs"], ensure_ascii=False)},\n')
        lines.append("  " * indent + f'  "contextEn": {json.dumps(it["contextEn"], ensure_ascii=False)},\n')
        lines.append("  " * indent + f'  "contextEs": {json.dumps(it["contextEs"], ensure_ascii=False)},\n')
        lines.append("  " * indent + f'  "exampleDialogueEn": {json.dumps(it["exampleDialogueEn"], ensure_ascii=False)},\n')
        lines.append("  " * indent + f'  "exampleDialogueEs": {json.dumps(it["exampleDialogueEs"], ensure_ascii=False)},\n')
        lines.append("  " * indent + f'  "audioPrompt": {json.dumps(it["audioPrompt"], ensure_ascii=False)}\n')
        if i < len(items) - 1:
            lines.append("  " * indent + "},\n")
        else:
            lines.append("  " * indent + "}\n")
    lines.append("  " * (indent - 1) + "]")
    return "".join(lines)

new_cul_str = "const culinaryVerbsAndSlang = " + format_cul_array(merged_cul, indent=1) + ";\n\n  const recipes ="
updated_cul = re.sub(r'const culinaryVerbsAndSlang = \[.*?\];\s*\n\s*const recipes =', new_cul_str, cul_content, flags=re.DOTALL)

cul_path.write_text(updated_cul, encoding="utf-8")
print(f"js/culinary_databank.js actualizado exitosamente con {len(merged_cul)} términos culinarios.")
