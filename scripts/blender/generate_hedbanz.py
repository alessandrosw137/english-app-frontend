import bpy
import math
import os
import sys

script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)

from core import (
    reset_scene, get_material, create_box, create_cylinder, 
    create_sphere, create_torus, join_objects, export_glb, apply_bevel_and_normals
)

OUTPUT_HEDBANZ_DIR = r"C:\Users\alessandro\Desktop\ENGLISH\assets\models\hedbanz"

def build_hedbanz():
    reset_scene()
    print("Building Hedbanz 3D Assets: Hedbanz Pack...")

    # Materials
    mat_band = get_material("Headband_Polymer", base_color=(0.12, 0.45, 0.95, 1.0), roughness=0.35)
    mat_clip = get_material("Clip_Chrome", base_color=(0.90, 0.92, 0.95, 1.0), metallic=0.9, roughness=0.15)
    mat_card_gold = get_material("Card_Gold_Frame", base_color=(0.95, 0.82, 0.22, 1.0), metallic=0.95, roughness=0.15)
    mat_card_face = get_material("Card_Front_Face", base_color=(0.98, 0.98, 0.98, 1.0), roughness=0.3)
    mat_card_qmark = get_material("Card_Question_Cyan", base_color=(0.05, 0.70, 0.90, 1.0), emission=(0.1, 0.8, 1.0, 1.0), emission_strength=2.0)
    mat_wood = get_material("Hourglass_Mahogany", base_color=(0.32, 0.16, 0.10, 1.0), roughness=0.45)
    mat_brass = get_material("Hourglass_Brass", base_color=(0.92, 0.78, 0.30, 1.0), metallic=0.95, roughness=0.18)
    mat_glass = get_material("Hourglass_Glass", base_color=(0.95, 0.98, 1.0, 1.0), roughness=0.03, transmission=0.96, ior=1.52)
    mat_sand = get_material("Golden_Sand", base_color=(0.95, 0.80, 0.35, 1.0), roughness=0.85)

    # 1. Avatar_Headband_Pro
    # Sized to fit around player's head (torus segment)
    hb_ring = create_torus("hb_r", (0, 0, 0.5), 0.24, 0.022, mat_band)
    hb_clip_base = create_box("hb_cb", (0, 0.25, 0.5), (0.08, 0.03, 0.06), mat_clip, bevel=0.005)
    hb_slot_f = create_box("hb_sf", (0, 0.265, 0.52), (0.07, 0.008, 0.05), mat_clip)
    join_objects("Avatar_Headband_Pro", [hb_ring, hb_clip_base, hb_slot_f])

    # 2. Mystery_Card_3D
    # Beveled card with gold frame and question mark / graphic face
    mc_frame = create_box("mc_fr", (0, 0.28, 0.68), (0.24, 0.008, 0.34), mat_card_gold, bevel=0.006)
    mc_face_f = create_box("mc_ff", (0, 0.285, 0.68), (0.21, 0.003, 0.31), mat_card_face)
    mc_face_b = create_box("mc_fb", (0, 0.275, 0.68), (0.21, 0.003, 0.31), mat_card_face)
    mc_qmark = create_sphere("mc_qm", (0, 0.288, 0.68), 0.045, mat_card_qmark, scale=(1.0, 0.2, 1.4))
    join_objects("Mystery_Card_3D", [mc_frame, mc_face_f, mc_face_b, mc_qmark])

    # 3. Game_Timer_Hourglass
    # Top & bottom circular wood plates, 3 brass columns, glass bulb with sand
    hg_base = create_cylinder("hg_b", (0.5, 0, 0.02), 0.12, 0.04, mat_wood)
    hg_top = create_cylinder("hg_t", (0.5, 0, 0.38), 0.12, 0.04, mat_wood)
    
    # 3 Brass Pillars
    p1 = create_cylinder("hg_p1", (0.5 + 0.09 * math.cos(0), 0.09 * math.sin(0), 0.20), 0.008, 0.34, mat_brass)
    p2 = create_cylinder("hg_p2", (0.5 + 0.09 * math.cos(2.094), 0.09 * math.sin(2.094), 0.20), 0.008, 0.34, mat_brass)
    p3 = create_cylinder("hg_p3", (0.5 + 0.09 * math.cos(4.188), 0.09 * math.sin(4.188), 0.20), 0.008, 0.34, mat_brass)

    # Glass bulbs (top bulb & bottom bulb converging in center)
    b_bot = create_sphere("hg_bb", (0.5, 0, 0.12), 0.075, mat_glass, scale=(1.0, 1.0, 1.2))
    b_top = create_sphere("hg_bt", (0.5, 0, 0.28), 0.075, mat_glass, scale=(1.0, 1.0, 1.2))
    b_sand_bot = create_sphere("hg_sb", (0.5, 0, 0.09), 0.065, mat_sand, scale=(1.0, 1.0, 0.7))
    b_sand_top = create_sphere("hg_st", (0.5, 0, 0.25), 0.045, mat_sand, scale=(1.0, 1.0, 0.6))
    b_stream = create_cylinder("hg_sm", (0.5, 0, 0.20), 0.004, 0.12, mat_sand)

    join_objects("Game_Timer_Hourglass", [hg_base, hg_top, p1, p2, p3, b_bot, b_top, b_sand_bot, b_sand_top, b_stream])

    export_glb(os.path.join(OUTPUT_HEDBANZ_DIR, "hedbanz_pack.glb"))
    print("HEDBANZ ASSETS EXPORTED SUCCESSFULLY!")

if __name__ == "__main__":
    build_hedbanz()
