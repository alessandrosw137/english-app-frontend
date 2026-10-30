import bpy
import math
import os
import sys

script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)

from core import (
    reset_scene, get_material, create_box, create_cylinder, 
    create_sphere, create_torus, join_as_named_object, export_glb,
    mat_chrome, mat_steel, mat_gold, mat_glass, mat_porcelain,
    mat_dark_walnut, mat_screen
)

OUTPUT_HEDBANZ_DIR = r"C:\Users\alessandro\Desktop\ENGLISH\assets\models\hedbanz"

def build_hedbanz():
    reset_scene()
    print("Building Hedbanz 3D: Party Game AAA Pack...")

    # Materials
    mat_band_poly = get_material("Headband_Polymer_Blue", base_color=(0.10, 0.42, 0.95, 1.0), roughness=0.32, coat_weight=0.4)
    mat_pad_foam = get_material("Forehead_Foam", base_color=(0.12, 0.12, 0.14, 1.0), roughness=0.85)
    mat_card_gold = mat_gold()
    mat_card_face = mat_porcelain()
    mat_qmark_glow = mat_screen((0.1, 0.85, 1.0, 1.0), 4.0, "QMark_Glow")
    mat_sand_gold = get_material("Golden_Hourglass_Sand", base_color=(0.95, 0.82, 0.35, 1.0), roughness=0.85)

    # 1. Avatar_Headband_Pro (Curved ergonomic ring, front dock clip, forehead cushion)
    hb_ring = create_torus("hb_rg", (0, 0, 0.55), 0.26, 0.024, mat_band_poly)
    hb_dock = create_box("hb_dk", (0, 0.27, 0.55), (0.09, 0.035, 0.08), mat_steel(), bevel=0.006)
    hb_slot_f = create_box("hb_sf", (0, 0.288, 0.58), (0.08, 0.009, 0.07), mat_chrome())
    hb_pad = create_box("hb_pd", (0, 0.24, 0.55), (0.12, 0.018, 0.05), mat_pad_foam, bevel=0.005)
    join_as_named_object([hb_ring, hb_dock, hb_slot_f, hb_pad], "Avatar_Headband_Pro")

    # 2. Mystery_Card_3D (Beveled card, gold frame, front white face, 3D glowing "?" mark)
    mc_frame = create_box("mc_fr", (0, 0.30, 0.78), (0.28, 0.010, 0.40), mat_card_gold, bevel=0.008)
    mc_face_f = create_box("mc_ff", (0, 0.306, 0.78), (0.24, 0.003, 0.36), mat_card_face)
    mc_face_b = create_box("mc_fb", (0, 0.294, 0.78), (0.24, 0.003, 0.36), mat_card_face)
    
    # 3D Question Mark ("?")
    qm_dot = create_sphere("qm_dt", (0, 0.312, 0.67), 0.018, mat_qmark_glow)
    qm_hook = create_torus("qm_hk", (0, 0.312, 0.83), 0.045, 0.014, mat_qmark_glow, rotation=(math.radians(90), 0, 0))
    qm_stem = create_cylinder("qm_st", (0, 0.312, 0.74), 0.013, 0.06, mat_qmark_glow)
    join_as_named_object([mc_frame, mc_face_f, mc_face_b, qm_dot, qm_hook, qm_stem], "Mystery_Card_3D")

    # 3. Game_Timer_Hourglass (Turned mahogany plates, 3 fluted brass pillars, glass bulbs with sand)
    hg_base = create_cylinder("hg_b", (0.6, 0, 0.03), 0.14, 0.05, mat_dark_walnut())
    hg_top = create_cylinder("hg_t", (0.6, 0, 0.45), 0.14, 0.05, mat_dark_walnut())
    hg_rim_b = create_torus("hg_rb", (0.6, 0, 0.04), 0.13, 0.012, mat_gold())
    hg_rim_t = create_torus("hg_rt", (0.6, 0, 0.44), 0.13, 0.012, mat_gold())

    hg_parts = [hg_base, hg_top, hg_rim_b, hg_rim_t]

    # 3 Fluted brass columns
    for a in [0.0, 2.0944, 4.1888]:
        col_x = 0.6 + 0.10 * math.cos(a)
        col_y = 0.10 * math.sin(a)
        col = create_cylinder(f"hg_col_{a}", (col_x, col_y, 0.24), 0.010, 0.38, mat_gold())
        hg_parts.append(col)

    # Double glass bulb with slender neck
    b_bot = create_sphere("hg_bb", (0.6, 0, 0.14), 0.082, mat_glass(), scale=(1.0, 1.0, 1.25))
    b_top = create_sphere("hg_bt", (0.6, 0, 0.34), 0.082, mat_glass(), scale=(1.0, 1.0, 1.25))
    b_neck = create_cylinder("hg_nk", (0.6, 0, 0.24), 0.018, 0.06, mat_glass())

    # Golden Sand piles
    sand_bot = create_sphere("hg_sb", (0.6, 0, 0.11), 0.072, mat_sand_gold, scale=(1.0, 1.0, 0.75))
    sand_top = create_sphere("hg_st", (0.6, 0, 0.31), 0.052, mat_sand_gold, scale=(1.0, 1.0, 0.65))
    sand_stream = create_cylinder("hg_sm", (0.6, 0, 0.24), 0.005, 0.16, mat_sand_gold)

    hg_parts.extend([b_bot, b_top, b_neck, sand_bot, sand_top, sand_stream])
    join_as_named_object(hg_parts, "Game_Timer_Hourglass")

    export_glb(os.path.join(OUTPUT_HEDBANZ_DIR, "hedbanz_pack.glb"))
    print("HEDBANZ 3D PACK BUILT AND EXPORTED SUCCESSFULLY!")

if __name__ == "__main__":
    build_hedbanz()
