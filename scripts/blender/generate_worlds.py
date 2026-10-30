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
    mat_warm_wood, mat_dark_walnut, mat_black_marble, mat_velvet_red,
    mat_terracotta, mat_screen, add_bounds_anchor
)

OUTPUT_WORLDS_DIR = r"C:\Users\alessandro\Desktop\ENGLISH\assets\models\worlds"

# ==============================================================================
# WORLD 1: HOUSE.GLB
# Exact spatial synergy with WORLD_TOUR_SCENARIOS.house
# Coordinate conversion: x_blender = x_three, y_blender = -z_three, z_blender = y_three
# ==============================================================================
def build_house():
    reset_scene()
    print("Building World: House & Kitchen (Spatial Synergy Pack)...")
    add_bounds_anchor(radius=12.0)

    # 1. Microwave on kitchen counter (Three.js: [-2.2, 0.95, -5.5] -> Blender: (-2.2, 5.5, 0.95))
    x, y, z = -2.2, 5.5, 0.95
    mw_body = create_box("mw_b", (x, y, z + 0.18), (0.60, 0.38, 0.34), mat_steel())
    mw_frame = create_box("mw_fr", (x - 0.08, y - 0.18, z + 0.18), (0.40, 0.02, 0.28), get_material("Matte_Black_Frame", (0.1, 0.1, 0.1, 1.0), roughness=0.5))
    mw_glass = create_box("mw_gl", (x - 0.08, y - 0.185, z + 0.18), (0.34, 0.01, 0.22), mat_glass())
    mw_plate = create_cylinder("mw_pl", (x - 0.08, y, z + 0.04), 0.12, 0.015, mat_glass())
    mw_handle = create_cylinder("mw_h", (x + 0.14, y - 0.20, z + 0.18), 0.014, 0.22, mat_chrome(), rotation=(math.radians(90), 0, 0))
    mw_panel = create_box("mw_p", (x + 0.21, y - 0.18, z + 0.18), (0.14, 0.02, 0.28), mat_steel())
    mw_screen = create_box("mw_sc", (x + 0.21, y - 0.185, z + 0.25), (0.10, 0.01, 0.05), mat_screen(color=(0.1, 1.0, 0.3, 1.0), strength=3.0, name="LED_Green"))
    mw_btn1 = create_box("mw_bt1", (x + 0.21, y - 0.185, z + 0.17), (0.08, 0.008, 0.025), mat_chrome())
    mw_btn2 = create_box("mw_bt2", (x + 0.21, y - 0.185, z + 0.12), (0.08, 0.008, 0.025), mat_chrome())
    join_as_named_object([mw_body, mw_frame, mw_glass, mw_plate, mw_handle, mw_panel, mw_screen, mw_btn1, mw_btn2], "Microwave")

    # 2. Blender on kitchen counter (Three.js: [-2.6, 0.95, -5.2] -> Blender: (-2.6, 5.2, 0.95))
    x, y, z = -2.6, 5.2, 0.95
    bl_base = create_cylinder("bl_b", (x, y, z + 0.10), 0.12, 0.20, mat_steel())
    bl_dial = create_cylinder("bl_d", (x, y - 0.12, z + 0.10), 0.03, 0.03, mat_chrome(), rotation=(math.radians(90), 0, 0))
    bl_b1 = create_sphere("bl_b1", (x - 0.05, y - 0.11, z + 0.06), 0.010, mat_screen((1.0, 0.2, 0.2, 1.0), 2.0, "Btn_Red"))
    bl_b2 = create_sphere("bl_b2", (x + 0.05, y - 0.11, z + 0.06), 0.010, mat_screen((0.2, 0.8, 1.0, 1.0), 2.0, "Btn_Blue"))
    bl_jug = create_cylinder("bl_j", (x, y, z + 0.36), 0.11, 0.34, mat_glass(), vertices=8)
    bl_liquid = create_cylinder("bl_lq", (x, y, z + 0.32), 0.10, 0.24, get_material("Juice_Orange", (0.95, 0.45, 0.05, 1.0), roughness=0.2, transmission=0.4))
    bl_blade = create_box("bl_bld", (x, y, z + 0.21), (0.08, 0.08, 0.01), mat_steel())
    bl_lid = create_cylinder("bl_l", (x, y, z + 0.54), 0.12, 0.035, mat_dark_walnut())
    bl_cap = create_cylinder("bl_c", (x, y, z + 0.57), 0.04, 0.04, mat_glass())
    bl_handle = create_torus("bl_h", (x + 0.10, y, z + 0.36), 0.07, 0.016, mat_dark_walnut(), rotation=(0, math.radians(90), 0))
    join_as_named_object([bl_base, bl_dial, bl_b1, bl_b2, bl_jug, bl_liquid, bl_blade, bl_lid, bl_cap, bl_handle], "Blender")

    # 3. Coffee_Maker on kitchen counter (Three.js: [-0.6, 0.95, -5.5] -> Blender: (-0.6, 5.5, 0.95))
    x, y, z = -0.6, 5.5, 0.95
    cf_base = create_box("cf_b", (x, y, z + 0.04), (0.30, 0.32, 0.08), mat_steel())
    cf_plate = create_cylinder("cf_pl", (x, y - 0.06, z + 0.085), 0.09, 0.01, get_material("HotPlate", (0.15, 0.15, 0.15, 1.0), roughness=0.3))
    cf_back = create_box("cf_bk", (x, y + 0.10, z + 0.24), (0.26, 0.12, 0.40), mat_steel())
    cf_tank = create_cylinder("cf_tk", (x, y + 0.10, z + 0.25), 0.09, 0.34, mat_glass())
    cf_head = create_box("cf_hd", (x, y - 0.05, z + 0.42), (0.26, 0.24, 0.08), mat_steel())
    cf_carafe = create_sphere("cf_cr", (x, y - 0.06, z + 0.19), 0.095, mat_glass(), scale=(1.0, 1.0, 1.2))
    cf_coffee = create_sphere("cf_co", (x, y - 0.06, z + 0.16), 0.082, get_material("Dark_Coffee", (0.12, 0.06, 0.03, 1.0), roughness=0.15, transmission=0.4))
    cf_handle = create_torus("cf_h", (x, y - 0.16, z + 0.19), 0.06, 0.014, mat_dark_walnut())
    cf_light = create_sphere("cf_led", (x + 0.12, y - 0.14, z + 0.04), 0.012, mat_screen((1.0, 0.1, 0.1, 1.0), 3.0, "LED_Red"))
    join_as_named_object([cf_base, cf_plate, cf_back, cf_tank, cf_head, cf_carafe, cf_coffee, cf_handle, cf_light], "Coffee_Maker")

    # 4. Toaster on kitchen counter (Three.js: [-0.2, 0.95, -5.5] -> Blender: (-0.2, 5.5, 0.95))
    x, y, z = -0.2, 5.5, 0.95
    to_body = create_box("to_b", (x, y, z + 0.11), (0.32, 0.20, 0.22), mat_chrome(), bevel=0.018)
    to_slot1 = create_box("to_s1", (x, y - 0.05, z + 0.21), (0.22, 0.025, 0.02), mat_dark_walnut())
    to_slot2 = create_box("to_s2", (x, y + 0.05, z + 0.21), (0.22, 0.025, 0.02), mat_dark_walnut())
    to_bread1 = create_box("to_br1", (x, y - 0.05, z + 0.24), (0.18, 0.02, 0.10), get_material("Toast_Crust", (0.72, 0.48, 0.22, 1.0), roughness=0.85), bevel=0.01)
    to_bread2 = create_box("to_br2", (x, y + 0.05, z + 0.24), (0.18, 0.02, 0.10), get_material("Toast_Crust", (0.72, 0.48, 0.22, 1.0), roughness=0.85), bevel=0.01)
    to_lever = create_cylinder("to_lv", (x - 0.17, y, z + 0.10), 0.012, 0.06, mat_steel(), rotation=(0, math.radians(90), 0))
    to_dial = create_cylinder("to_dl", (x, y - 0.11, z + 0.06), 0.022, 0.018, mat_steel(), rotation=(math.radians(90), 0, 0))
    join_as_named_object([to_body, to_slot1, to_slot2, to_bread1, to_bread2, to_lever, to_dial], "Toaster")

    # 5. Refrigerator against kitchen wall (Three.js: [-1.4, 0.22, -5.8] -> Blender: (-1.4, 5.8, 0.22))
    x, y, z = -1.4, 5.8, 0.22
    rf_body = create_box("rf_b", (x, y, z + 1.0), (0.92, 0.82, 2.0), mat_steel())
    rf_door_l = create_box("rf_dl", (x - 0.23, y - 0.42, z + 1.28), (0.43, 0.03, 1.35), mat_steel(), bevel=0.015)
    rf_door_r = create_box("rf_dr", (x + 0.23, y - 0.42, z + 1.28), (0.43, 0.03, 1.35), mat_steel(), bevel=0.015)
    rf_freezer = create_box("rf_fz", (x, y - 0.42, z + 0.32), (0.89, 0.03, 0.58), mat_steel(), bevel=0.015)
    rf_disp_cav = create_box("rf_dc", (x - 0.23, y - 0.44, z + 1.28), (0.20, 0.02, 0.28), get_material("Dispenser_Cavity", (0.12, 0.12, 0.14, 1.0), roughness=0.4))
    rf_disp_scr = create_box("rf_ds", (x - 0.23, y - 0.445, z + 1.38), (0.14, 0.01, 0.05), mat_screen((0.2, 0.7, 1.0, 1.0), 2.5, "Disp_Screen"))
    rf_hl = create_cylinder("rf_hl", (x - 0.04, y - 0.45, z + 1.28), 0.015, 0.80, mat_chrome())
    rf_hr = create_cylinder("rf_hr", (x + 0.04, y - 0.45, z + 1.28), 0.015, 0.80, mat_chrome())
    rf_hf = create_cylinder("rf_hf", (x, y - 0.45, z + 0.56), 0.015, 0.60, mat_chrome(), rotation=(0, math.radians(90), 0))
    join_as_named_object([rf_body, rf_door_l, rf_door_r, rf_freezer, rf_disp_cav, rf_disp_scr, rf_hl, rf_hr, rf_hf], "Refrigerator")

    # 6. Remote_Control on coffee table (Three.js: [-3.35, 0.68, -1.95] -> Blender: (-3.35, 1.95, 0.68))
    x, y, z = -3.35, 1.95, 0.68
    rm_body = create_box("rm_b", (x, y, z + 0.01), (0.065, 0.18, 0.018), get_material("Remote_Body", (0.08, 0.08, 0.10, 1.0), roughness=0.35), bevel=0.005)
    rm_pwr = create_sphere("rm_p", (x, y + 0.065, z + 0.02), 0.008, mat_screen((1.0, 0.15, 0.15, 1.0), 2.5, "Btn_Pwr"))
    rm_pad = create_torus("rm_pd", (x, y + 0.02, z + 0.02), 0.018, 0.004, mat_steel())
    rm_btn1 = create_box("rm_b1", (x - 0.015, y - 0.03, z + 0.02), (0.016, 0.012, 0.004), mat_chrome())
    rm_btn2 = create_box("rm_b2", (x + 0.015, y - 0.03, z + 0.02), (0.016, 0.012, 0.004), mat_chrome())
    rm_app1 = create_box("rm_a1", (x - 0.015, y - 0.06, z + 0.02), (0.018, 0.008, 0.004), mat_screen((0.9, 0.1, 0.1, 1.0), 2.0, "App_Net"))
    rm_app2 = create_box("rm_a2", (x + 0.015, y - 0.06, z + 0.02), (0.018, 0.008, 0.004), mat_screen((0.1, 0.6, 1.0, 1.0), 2.0, "App_Pri"))
    join_as_named_object([rm_body, rm_pwr, rm_pad, rm_btn1, rm_btn2, rm_app1, rm_app2], "Remote_Control")

    # 7. Laptop on study desk (Three.js: [3.25, 0.98, -3.42] -> Blender: (3.25, 3.42, 0.98))
    x, y, z = 3.25, 3.42, 0.98
    lp_base = create_box("lp_bs", (x, y, z + 0.007), (0.34, 0.24, 0.014), mat_steel(), bevel=0.004)
    lp_kbd = create_box("lp_kb", (x, y + 0.03, z + 0.015), (0.28, 0.12, 0.004), get_material("Keyboard_Chiclet", (0.08, 0.08, 0.09, 1.0), roughness=0.6))
    lp_pad = create_box("lp_pd", (x, y - 0.065, z + 0.015), (0.11, 0.07, 0.003), mat_chrome())
    lp_lid = create_box("lp_ld", (x, y + 0.11, z + 0.12), (0.34, 0.012, 0.22), mat_steel(), rotation=(math.radians(20), 0, 0), bevel=0.004)
    lp_scr = create_box("lp_sc", (x, y + 0.105, z + 0.12), (0.31, 0.004, 0.19), mat_screen((0.08, 0.65, 0.95, 1.0), 3.0, "Screen_UI"), rotation=(math.radians(20), 0, 0))
    join_as_named_object([lp_base, lp_kbd, lp_pad, lp_lid, lp_scr], "Laptop")

    # 8. Toothbrush in bathroom (Three.js: [-2.1, 1.14, -3.85] -> Blender: (-2.1, 3.85, 1.14))
    x, y, z = -2.1, 3.85, 1.14
    tb_base = create_cylinder("tb_bs", (x, y, z + 0.015), 0.035, 0.03, mat_porcelain())
    tb_handle = create_cylinder("tb_h", (x, y, z + 0.11), 0.013, 0.18, get_material("Teal_Rubber", (0.1, 0.65, 0.7, 1.0), roughness=0.4))
    tb_neck = create_cylinder("tb_nk", (x, y, z + 0.21), 0.006, 0.06, mat_porcelain())
    tb_head = create_box("tb_hd", (x, y - 0.005, z + 0.245), (0.012, 0.010, 0.024), mat_porcelain(), bevel=0.002)
    tb_bristles = create_box("tb_br", (x, y - 0.012, z + 0.245), (0.010, 0.006, 0.020), mat_screen((0.3, 0.9, 1.0, 1.0), 1.0, "Bristles_Blue"))
    join_as_named_object([tb_base, tb_handle, tb_neck, tb_head, tb_bristles], "Toothbrush")

    # 9. Soap_Dispenser in bathroom (Three.js: [-1.8, 1.14, -3.85] -> Blender: (-1.8, 3.85, 1.14))
    x, y, z = -1.8, 3.85, 1.14
    sd_bottle = create_cylinder("sd_b", (x, y, z + 0.07), 0.045, 0.14, mat_glass())
    sd_liquid = create_cylinder("sd_lq", (x, y, z + 0.06), 0.041, 0.11, get_material("Liquid_Soap_Amber", (0.92, 0.65, 0.20, 1.0), roughness=0.2, transmission=0.6))
    sd_cap = create_cylinder("sd_cp", (x, y, z + 0.145), 0.022, 0.02, mat_chrome())
    sd_pump = create_cylinder("sd_p", (x, y, z + 0.17), 0.010, 0.04, mat_chrome())
    sd_nozzle = create_cylinder("sd_nz", (x, y - 0.025, z + 0.185), 0.006, 0.05, mat_chrome(), rotation=(math.radians(90), 0, 0))
    join_as_named_object([sd_bottle, sd_liquid, sd_cap, sd_pump, sd_nozzle], "Soap_Dispenser")

    # 10. Shampoo_Bottle in bathroom (Three.js: [-2.4, 1.14, -3.85] -> Blender: (-2.4, 3.85, 1.14))
    x, y, z = -2.4, 3.85, 1.14
    sb_body = create_box("sb_b", (x, y, z + 0.10), (0.07, 0.045, 0.20), get_material("Shampoo_Bottle_Mat", (0.15, 0.45, 0.35, 1.0), roughness=0.3), bevel=0.012)
    sb_cap = create_cylinder("sb_cp", (x, y, z + 0.215), 0.016, 0.03, mat_gold())
    join_as_named_object([sb_body, sb_cap], "Shampoo_Bottle")

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "house.glb"))
    print("WORLD 1 (HOUSE) BUILT SUCCESSFULLY!")


# ==============================================================================
# WORLD 2: SUPERMARKET.GLB
# Exact spatial synergy with WORLD_TOUR_SCENARIOS.supermarket
# ==============================================================================
def build_supermarket():
    reset_scene()
    print("Building World: Supermarket (Spatial Synergy Pack)...")
    add_bounds_anchor(radius=10.0)

    # 1. Cash_Register on checkout counter (Three.js: [3.2, 1.08, 2.8] -> Blender: (3.2, -2.8, 1.08))
    x, y, z = 3.2, -2.8, 1.08
    cr_drawer = create_box("cr_dw", (x, y, z + 0.06), (0.42, 0.40, 0.12), mat_steel(), bevel=0.01)
    cr_body = create_box("cr_bd", (x, y + 0.05, z + 0.18), (0.34, 0.26, 0.14), mat_steel(), bevel=0.01)
    cr_screen = create_box("cr_sc", (x, y - 0.06, z + 0.30), (0.28, 0.02, 0.18), mat_steel(), rotation=(math.radians(25), 0, 0), bevel=0.005)
    cr_disp = create_box("cr_ds", (x, y - 0.07, z + 0.30), (0.25, 0.005, 0.15), mat_screen((0.1, 0.9, 0.4, 1.0), 3.0, "POS_UI"), rotation=(math.radians(25), 0, 0))
    cr_prt = create_box("cr_pr", (x + 0.12, y + 0.08, z + 0.26), (0.08, 0.08, 0.04), mat_dark_walnut())
    cr_paper = create_box("cr_pp", (x + 0.12, y + 0.08, z + 0.30), (0.06, 0.002, 0.06), mat_porcelain())
    join_as_named_object([cr_drawer, cr_body, cr_screen, cr_disp, cr_prt, cr_paper], "Cash_Register")

    # 2. Barcode_Scanner on checkout counter (Three.js: [2.1, 1.08, 3.0] -> Blender: (2.1, -3.0, 1.08))
    x, y, z = 2.1, -3.0, 1.08
    bs_cradle = create_box("bs_c", (x, y, z + 0.03), (0.12, 0.14, 0.06), mat_dark_walnut(), bevel=0.006)
    bs_head = create_box("bs_h", (x, y - 0.02, z + 0.14), (0.065, 0.11, 0.06), mat_steel(), rotation=(math.radians(30), 0, 0), bevel=0.008)
    bs_lens = create_box("bs_l", (x, y - 0.075, z + 0.165), (0.05, 0.005, 0.04), mat_screen((1.0, 0.1, 0.1, 1.0), 2.5, "Laser_Red"), rotation=(math.radians(30), 0, 0))
    bs_grip = create_cylinder("bs_g", (x, y + 0.02, z + 0.08), 0.018, 0.10, mat_dark_walnut(), rotation=(math.radians(-20), 0, 0))
    join_as_named_object([bs_cradle, bs_head, bs_lens, bs_grip], "Barcode_Scanner")

    # 3. Card_Reader on checkout counter (Three.js: [3.4, 1.15, 2.4] -> Blender: (3.4, -2.4, 1.15))
    x, y, z = 3.4, -2.4, 1.15
    ct_stand = create_cylinder("ct_st", (x, y, z + 0.05), 0.022, 0.10, mat_steel())
    ct_body = create_box("ct_b", (x, y, z + 0.13), (0.11, 0.18, 0.045), mat_dark_walnut(), rotation=(math.radians(35), 0, 0), bevel=0.006)
    ct_scr = create_box("ct_sc", (x, y - 0.02, z + 0.16), (0.085, 0.06, 0.005), mat_screen((0.2, 0.7, 1.0, 1.0), 2.5, "POS_Pay"), rotation=(math.radians(35), 0, 0))
    ct_pad = create_box("ct_pd", (x, y + 0.04, z + 0.12), (0.085, 0.07, 0.005), mat_steel(), rotation=(math.radians(35), 0, 0))
    join_as_named_object([ct_stand, ct_body, ct_scr, ct_pad], "Card_Reader")

    # 4. Shopping_Cart near checkout (Three.js: [-2.8, 0, 3.2] -> Blender: (-2.8, -3.2, 0))
    x, y, z = -2.8, -3.2, 0
    sc_parts = []
    # Frame & Wheels
    sc_frame = create_box("sc_fr", (x, y, z + 0.18), (0.54, 0.72, 0.05), mat_steel(), bevel=0.01)
    sc_parts.append(sc_frame)
    for wx in [-0.22, 0.22]:
        for wy in [-0.28, 0.28]:
            wh = create_cylinder(f"sc_w_{wx}_{wy}", (x + wx, y + wy, z + 0.06), 0.055, 0.025, mat_dark_walnut(), rotation=(0, math.radians(90), 0))
            sc_parts.append(wh)
    # Wire basket
    b_bot = create_box("sc_bb", (x, y, z + 0.42), (0.52, 0.70, 0.02), mat_chrome())
    b_f = create_box("sc_bf", (x, y + 0.35, z + 0.65), (0.52, 0.02, 0.46), mat_chrome())
    b_b = create_box("sc_bk", (x, y - 0.35, z + 0.65), (0.52, 0.02, 0.46), mat_chrome())
    b_l = create_box("sc_bl", (x - 0.26, y, z + 0.65), (0.02, 0.70, 0.46), mat_chrome())
    b_r = create_box("sc_br", (x + 0.26, y, z + 0.65), (0.02, 0.70, 0.46), mat_chrome())
    handle = create_cylinder("sc_h", (x, y - 0.42, z + 0.92), 0.018, 0.54, mat_velvet_red(), rotation=(0, math.radians(90), 0))
    sc_parts.extend([b_bot, b_f, b_b, b_l, b_r, handle])
    join_as_named_object(sc_parts, "Shopping_Cart")

    # 5. Cereal_Box on grocery shelf (Three.js: [1.8, 1.0, -2.2] -> Blender: (1.8, 2.2, 1.0))
    x, y, z = 1.8, 2.2, 1.0
    cb_box = create_box("cb_bx", (x, y, z + 0.16), (0.18, 0.07, 0.28), get_material("Cereal_GoldenFlakes", (0.95, 0.65, 0.12, 1.0), roughness=0.4), bevel=0.006)
    cb_top = create_box("cb_tp", (x, y, z + 0.305), (0.176, 0.066, 0.01), mat_porcelain())
    join_as_named_object([cb_box, cb_top], "Cereal_Box")

    # 6. Canned_Tuna on shelf (Three.js: [-0.5, 1.0, -2.5] -> Blender: (-0.5, 2.5, 1.0))
    x, y, z = -0.5, 2.5, 1.0
    cn1 = create_cylinder("cn_1", (x, y, z + 0.035), 0.055, 0.06, mat_steel())
    cn2 = create_cylinder("cn_2", (x, y, z + 0.095), 0.055, 0.06, mat_steel())
    lbl1 = create_cylinder("cn_lb1", (x, y, z + 0.035), 0.056, 0.045, get_material("Tuna_Label", (0.1, 0.4, 0.85, 1.0), roughness=0.5))
    lbl2 = create_cylinder("cn_lb2", (x, y, z + 0.095), 0.056, 0.045, get_material("Tuna_Label", (0.1, 0.4, 0.85, 1.0), roughness=0.5))
    join_as_named_object([cn1, cn2, lbl1, lbl2], "Canned_Tuna")

    # 7. Mayonnaise on shelf (Three.js: [-0.2, 1.15, -2.2] -> Blender: (-0.2, 2.2, 1.15))
    x, y, z = -0.2, 2.2, 1.15
    my_jar = create_cylinder("my_j", (x, y, z + 0.07), 0.048, 0.12, mat_glass())
    my_fill = create_cylinder("my_fl", (x, y, z + 0.06), 0.044, 0.10, get_material("Mayo_Cream", (0.96, 0.94, 0.85, 1.0), roughness=0.3))
    my_lid = create_cylinder("my_ld", (x, y, z + 0.135), 0.046, 0.02, mat_gold())
    join_as_named_object([my_jar, my_fill, my_lid], "Mayonnaise")

    # 8. Sliced_Bread on bakery counter (Three.js: [-1.5, 1.08, -3.9] -> Blender: (-1.5, 3.9, 1.08))
    x, y, z = -1.5, 3.9, 1.08
    br_loaf = create_box("br_lf", (x, y, z + 0.07), (0.24, 0.11, 0.12), get_material("Bread_Bag", (0.88, 0.72, 0.48, 1.0), roughness=0.5), bevel=0.02)
    br_clip = create_box("br_cl", (x + 0.13, y, z + 0.07), (0.015, 0.03, 0.03), mat_screen((1.0, 0.2, 0.2, 1.0), 1.0, "Bread_Clip"))
    join_as_named_object([br_loaf, br_clip], "Sliced_Bread")

    # 9. Milk_Carton in dairy (Three.js: [1.7, 1.15, -4.1] -> Blender: (1.7, 4.1, 1.15))
    x, y, z = 1.7, 4.1, 1.15
    mk_body = create_box("mk_b", (x, y, z + 0.10), (0.08, 0.08, 0.18), mat_porcelain(), bevel=0.005)
    mk_roof = create_box("mk_r", (x, y, z + 0.21), (0.078, 0.078, 0.04), get_material("Dairy_Blue", (0.1, 0.5, 0.9, 1.0), roughness=0.4), bevel=0.01)
    mk_cap = create_cylinder("mk_c", (x + 0.02, y + 0.02, z + 0.235), 0.014, 0.015, mat_porcelain())
    join_as_named_object([mk_body, mk_roof, mk_cap], "Milk_Carton")

    # 10. Table_Cream in dairy (Three.js: [2.2, 1.15, -4.1] -> Blender: (2.2, 4.1, 1.15))
    x, y, z = 2.2, 4.1, 1.15
    tc_bottle = create_cylinder("tc_b", (x, y, z + 0.06), 0.038, 0.11, mat_glass())
    tc_cream = create_cylinder("tc_cr", (x, y, z + 0.05), 0.035, 0.09, get_material("Cream_Rich", (0.98, 0.97, 0.92, 1.0), roughness=0.25))
    tc_cap = create_cylinder("tc_c", (x, y, z + 0.12), 0.026, 0.018, mat_gold())
    join_as_named_object([tc_bottle, tc_cream, tc_cap], "Table_Cream")

    # 11. Egg_Carton in dairy (Three.js: [2.6, 1.15, -4.1] -> Blender: (2.6, 4.1, 1.15))
    x, y, z = 2.6, 4.1, 1.15
    eg_carton = create_box("eg_c", (x, y, z + 0.035), (0.24, 0.15, 0.06), get_material("Molded_Pulp", (0.65, 0.60, 0.52, 1.0), roughness=0.9), bevel=0.008)
    eggs = []
    for ex in [-0.08, 0.0, 0.08]:
        for ey in [-0.04, 0.04]:
            egg = create_sphere(f"eg_{ex}_{ey}", (x + ex, y + ey, z + 0.065), 0.022, get_material("Egg_Brown", (0.82, 0.62, 0.44, 1.0), roughness=0.6), scale=(1.0, 1.0, 1.25))
            eggs.append(egg)
    join_as_named_object([eg_carton] + eggs, "Egg_Carton")

    # 12. Ketchup on shelf (Three.js: [0.3, 1.15, -2.2] -> Blender: (0.3, 2.2, 1.15))
    x, y, z = 0.3, 2.2, 1.15
    kt_body = create_cylinder("kt_b", (x, y, z + 0.09), 0.036, 0.16, get_material("Ketchup_Red", (0.85, 0.08, 0.08, 1.0), roughness=0.35))
    kt_cap = create_cylinder("kt_c", (x, y, z + 0.185), 0.016, 0.03, mat_porcelain())
    join_as_named_object([kt_body, kt_cap], "Ketchup")

    # 13. Cooking_Oil on shelf (Three.js: [0.9, 1.15, -2.2] -> Blender: (0.9, 2.2, 1.15))
    x, y, z = 0.9, 2.2, 1.15
    oil_bot = create_cylinder("oil_b", (x, y, z + 0.11), 0.038, 0.20, mat_glass())
    oil_liq = create_cylinder("oil_lq", (x, y, z + 0.09), 0.035, 0.16, get_material("Golden_Oil", (0.95, 0.82, 0.15, 1.0), roughness=0.15, transmission=0.6))
    oil_cap = create_cylinder("oil_c", (x, y, z + 0.22), 0.018, 0.025, get_material("Cap_Green", (0.1, 0.6, 0.2, 1.0), roughness=0.4))
    join_as_named_object([oil_bot, oil_liq, oil_cap], "Cooking_Oil")

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "supermarket.glb"))
    print("WORLD 2 (SUPERMARKET) BUILT SUCCESSFULLY!")


# ==============================================================================
# WORLD 3: RESTAURANT.GLB
# Exact spatial synergy with WORLD_TOUR_SCENARIOS.restaurant
# ==============================================================================
def build_restaurant():
    reset_scene()
    print("Building World: Restaurant & Gastronomy (Spatial Synergy Pack)...")
    add_bounds_anchor(radius=10.0)

    # 1. Main_Course on dining table (Three.js: [-0.4, 0.98, 0.65] -> Blender: (-0.4, -0.65, 0.98))
    x, y, z = -0.4, -0.65, 0.98
    pl_dish = create_cylinder("mc_pl", (x, y, z + 0.012), 0.16, 0.022, mat_porcelain())
    pl_steak = create_box("mc_stk", (x, y, z + 0.032), (0.14, 0.10, 0.024), get_material("Grilled_Steak", (0.28, 0.12, 0.08, 1.0), roughness=0.6), bevel=0.008)
    pl_butter = create_box("mc_btr", (x, y, z + 0.048), (0.028, 0.028, 0.014), get_material("Herb_Butter", (0.92, 0.92, 0.50, 1.0), roughness=0.3))
    pl_asp1 = create_cylinder("mc_as1", (x - 0.04, y - 0.07, z + 0.028), 0.007, 0.12, get_material("Asparagus_Green", (0.15, 0.45, 0.12, 1.0), roughness=0.5), rotation=(0, math.radians(90), 0))
    pl_asp2 = create_cylinder("mc_as2", (x + 0.04, y - 0.07, z + 0.028), 0.007, 0.12, get_material("Asparagus_Green", (0.15, 0.45, 0.12, 1.0), roughness=0.5), rotation=(0, math.radians(90), 0))
    join_as_named_object([pl_dish, pl_steak, pl_butter, pl_asp1, pl_asp2], "Main_Course")

    # 2. Fork on table (Three.js: [-0.82, 0.98, 0.85] -> Blender: (-0.82, -0.85, 0.98))
    x, y, z = -0.82, -0.85, 0.98
    fk_handle = create_cylinder("fk_h", (x, y, z + 0.006), 0.006, 0.16, mat_chrome(), rotation=(math.radians(90), 0, 0))
    fk_tines = create_box("fk_t", (x, y + 0.09, z + 0.006), (0.024, 0.04, 0.003), mat_chrome())
    join_as_named_object([fk_handle, fk_tines], "Fork")

    # 3. Knife on table (Three.js: [-0.6, 0.98, 0.75] -> Blender: (-0.6, -0.75, 0.98))
    x, y, z = -0.6, -0.75, 0.98
    kn_handle = create_cylinder("kn_h", (x, y, z + 0.006), 0.007, 0.14, mat_dark_walnut(), rotation=(math.radians(90), 0, 0))
    kn_blade = create_box("kn_b", (x, y + 0.09, z + 0.008), (0.003, 0.10, 0.018), mat_steel())
    join_as_named_object([kn_handle, kn_blade], "Knife")

    # 4. Spoon on table (Three.js: [0.82, 0.98, 0.85] -> Blender: (0.82, -0.85, 0.98))
    x, y, z = 0.82, -0.85, 0.98
    sp_handle = create_cylinder("sp_h", (x, y, z + 0.006), 0.006, 0.15, mat_chrome(), rotation=(math.radians(90), 0, 0))
    sp_bowl = create_sphere("sp_b", (x, y + 0.09, z + 0.006), 0.018, mat_chrome(), scale=(1.2, 1.6, 0.4))
    join_as_named_object([sp_handle, sp_bowl], "Spoon")

    # 5. Wine_Glass on table (Three.js: [0.28, 1.02, 1.18] -> Blender: (0.28, -1.18, 0.98))
    x, y, z = 0.28, -1.18, 0.98
    wg_base = create_cylinder("wg_bs", (x, y, z + 0.005), 0.042, 0.008, mat_glass())
    wg_stem = create_cylinder("wg_st", (x, y, z + 0.08), 0.005, 0.15, mat_glass())
    wg_bowl = create_sphere("wg_bw", (x, y, z + 0.19), 0.048, mat_glass(), scale=(1.0, 1.0, 1.5))
    wg_wine = create_sphere("wg_wn", (x, y, z + 0.17), 0.042, mat_velvet_red(), scale=(0.95, 0.95, 1.1))
    join_as_named_object([wg_base, wg_stem, wg_bowl, wg_wine], "Wine_Glass")

    # 6. Napkin on table (Three.js: [0.75, 0.98, 0.85] -> Blender: (0.75, -0.85, 0.98))
    x, y, z = 0.75, -0.85, 0.98
    npk = create_box("npk_f", (x, y, z + 0.035), (0.12, 0.12, 0.07), mat_porcelain(), bevel=0.015)
    join_as_named_object([npk], "Napkin")

    # 7. Menu on table (Three.js: [-0.55, 0.98, 1.15] -> Blender: (-0.55, -1.15, 0.98))
    x, y, z = -0.55, -1.15, 0.98
    mn_cover = create_box("mn_cv", (x, y, z + 0.012), (0.18, 0.26, 0.018), get_material("Menu_Leather", (0.35, 0.08, 0.10, 1.0), roughness=0.5), bevel=0.006)
    mn_pages = create_box("mn_pg", (x, y, z + 0.015), (0.16, 0.24, 0.014), mat_porcelain())
    mn_gold = create_box("mn_gd", (x, y, z + 0.022), (0.04, 0.04, 0.004), mat_gold())
    join_as_named_object([mn_cover, mn_pages, mn_gold], "Menu")

    # 8. Salt_Pepper_Shakers on table (Three.js: [0, 0.98, 0.95] -> Blender: (0, -0.95, 0.98))
    x, y, z = 0, -0.95, 0.98
    s_jar = create_cylinder("s_j", (x - 0.035, y, z + 0.045), 0.022, 0.08, mat_glass())
    s_lid = create_cylinder("s_l", (x - 0.035, y, z + 0.09), 0.023, 0.018, mat_steel())
    p_jar = create_cylinder("p_j", (x + 0.035, y, z + 0.045), 0.022, 0.08, mat_glass())
    p_lid = create_cylinder("p_l", (x + 0.035, y, z + 0.09), 0.023, 0.018, mat_dark_walnut())
    join_as_named_object([s_jar, s_lid, p_jar, p_lid], "Salt_Pepper_Shakers")

    # 9. Olive_Oil on table (Three.js: [0.22, 0.98, 0.82] -> Blender: (0.22, -0.82, 0.98))
    x, y, z = 0.22, -0.82, 0.98
    oo_flask = create_sphere("oo_f", (x, y, z + 0.06), 0.042, mat_glass(), scale=(1.0, 1.0, 1.3))
    oo_neck = create_cylinder("oo_n", (x, y, z + 0.13), 0.014, 0.06, mat_glass())
    oo_spout = create_cylinder("oo_s", (x, y - 0.01, z + 0.17), 0.005, 0.04, mat_steel(), rotation=(math.radians(35), 0, 0))
    join_as_named_object([oo_flask, oo_neck, oo_spout], "Olive_Oil")

    # 10. Espresso_Machine on bar counter (Three.js: [3.2, 0.95, -3.8] -> Blender: (3.2, 3.8, 0.95))
    x, y, z = 3.2, 3.8, 0.95
    em_body = create_box("em_b", (x, y, z + 0.26), (0.68, 0.48, 0.50), mat_steel())
    em_rail = create_box("em_rl", (x, y, z + 0.52), (0.64, 0.44, 0.03), mat_chrome(), bevel=0.005)
    em_cup1 = create_cylinder("em_c1", (x - 0.16, y, z + 0.56), 0.035, 0.05, mat_porcelain())
    em_cup2 = create_cylinder("em_c2", (x + 0.16, y, z + 0.56), 0.035, 0.05, mat_porcelain())
    em_gh1 = create_cylinder("em_g1", (x - 0.14, y - 0.26, z + 0.22), 0.038, 0.06, mat_chrome())
    em_gh2 = create_cylinder("em_g2", (x + 0.14, y - 0.26, z + 0.22), 0.038, 0.06, mat_chrome())
    em_pf1 = create_cylinder("em_pf1", (x - 0.14, y - 0.36, z + 0.20), 0.014, 0.15, mat_dark_walnut(), rotation=(math.radians(90), 0, 0))
    em_pf2 = create_cylinder("em_pf2", (x + 0.14, y - 0.36, z + 0.20), 0.014, 0.15, mat_dark_walnut(), rotation=(math.radians(90), 0, 0))
    em_drip = create_box("em_dp", (x, y - 0.24, z + 0.05), (0.64, 0.20, 0.04), mat_steel())
    em_gauge = create_cylinder("em_gg", (x, y - 0.25, z + 0.38), 0.032, 0.02, mat_gold(), rotation=(math.radians(90), 0, 0))
    join_as_named_object([em_body, em_rail, em_cup1, em_cup2, em_gh1, em_gh2, em_pf1, em_pf2, em_drip, em_gauge], "Espresso_Machine")

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "restaurant.glb"))
    print("WORLD 3 (RESTAURANT) BUILT SUCCESSFULLY!")


# ==============================================================================
# WORLD 4: HOTEL.GLB
# Exact spatial synergy with WORLD_TOUR_SCENARIOS.hotel
# ==============================================================================
def build_hotel():
    reset_scene()
    print("Building World: Grand Luxury Hotel (Spatial Synergy Pack)...")
    add_bounds_anchor(radius=10.0)

    # 1. Bellhop_Bell on reception desk (Three.js: [0.65, 1.12, -3.1] -> Blender: (0.65, 3.1, 1.12))
    x, y, z = 0.65, 3.1, 1.12
    bb_base = create_cylinder("bb_bs", (x, y, z + 0.015), 0.075, 0.03, mat_dark_walnut())
    bb_dome = create_sphere("bb_dm", (x, y, z + 0.055), 0.065, mat_gold(), scale=(1.0, 1.0, 0.6))
    bb_pin = create_cylinder("bb_pn", (x, y, z + 0.105), 0.008, 0.035, mat_gold())
    bb_btn = create_cylinder("bb_bt", (x, y, z + 0.125), 0.018, 0.012, mat_gold())
    join_as_named_object([bb_base, bb_dome, bb_pin, bb_btn], "Bellhop_Bell")

    # 2. Room_Keycard on reception desk (Three.js: [-0.8, 1.12, -3.1] -> Blender: (-0.8, 3.1, 1.12))
    x, y, z = -0.8, 3.1, 1.12
    rk_sleeve = create_box("rk_sl", (x, y, z + 0.005), (0.12, 0.18, 0.008), get_material("Sleeve_Navy", (0.05, 0.10, 0.25, 1.0), roughness=0.5), bevel=0.004)
    rk_card = create_box("rk_cd", (x, y + 0.02, z + 0.010), (0.095, 0.15, 0.006), mat_gold(), bevel=0.004)
    join_as_named_object([rk_sleeve, rk_card], "Room_Keycard")

    # 3. Passport on reception desk (Three.js: [0.05, 1.12, -3.05] -> Blender: (0.05, 3.05, 1.12))
    x, y, z = 0.05, 3.05, 1.12
    ps_book = create_box("ps_bk", (x, y, z + 0.008), (0.13, 0.19, 0.015), get_material("Passport_Blue", (0.06, 0.12, 0.28, 1.0), roughness=0.4), bevel=0.004)
    ps_gold = create_box("ps_gd", (x, y, z + 0.016), (0.045, 0.045, 0.002), mat_gold())
    join_as_named_object([ps_book, ps_gold], "Passport")

    # 4. Luggage_Cart in lobby (Three.js: [3.8, 0, 1.2] -> Blender: (3.8, -1.2, 0))
    x, y, z = 3.8, -1.2, 0
    lc_parts = []
    lc_base = create_box("lc_bs", (x, y, z + 0.14), (0.75, 1.25, 0.08), mat_velvet_red(), bevel=0.01)
    lc_parts.append(lc_base)
    for wx in [-0.32, 0.32]:
        for wy in [-0.52, 0.52]:
            wh = create_cylinder(f"lc_w_{wx}_{wy}", (x + wx, y + wy, z + 0.07), 0.065, 0.035, mat_dark_walnut(), rotation=(0, math.radians(90), 0))
            lc_parts.append(wh)
    # Birdcage brass tubular frame
    p1 = create_cylinder("lc_p1", (x - 0.34, y - 0.56, z + 0.95), 0.022, 1.60, mat_gold())
    p2 = create_cylinder("lc_p2", (x + 0.34, y - 0.56, z + 0.95), 0.022, 1.60, mat_gold())
    p3 = create_cylinder("lc_p3", (x - 0.34, y + 0.56, z + 0.95), 0.022, 1.60, mat_gold())
    p4 = create_cylinder("lc_p4", (x + 0.34, y + 0.56, z + 0.95), 0.022, 1.60, mat_gold())
    arch = create_torus("lc_ar", (x, y, z + 1.75), 0.55, 0.022, mat_gold(), rotation=(0, math.radians(90), 0))
    rail_top = create_cylinder("lc_rt", (x, y, z + 1.68), 0.020, 1.15, mat_gold(), rotation=(math.radians(90), 0, 0))
    lc_parts.extend([p1, p2, p3, p4, arch, rail_top])
    join_as_named_object(lc_parts, "Luggage_Cart")

    # 5. Suitcase on luggage cart (Three.js: [2.5, 0, 2.4] -> Blender: (2.5, -2.4, 0))
    x, y, z = 2.5, -2.4, 0
    sc_body = create_box("sc_bd", (x, y, z + 0.38), (0.34, 0.52, 0.68), get_material("Suitcase_Poly", (0.12, 0.32, 0.65, 1.0), roughness=0.35), bevel=0.025)
    sc_handle = create_cylinder("sc_h", (x, y, z + 0.76), 0.014, 0.20, mat_chrome(), rotation=(0, math.radians(90), 0))
    sc_parts = [sc_body, sc_handle]
    for wx in [-0.14, 0.14]:
        for wy in [-0.22, 0.22]:
            w = create_sphere(f"sc_w_{wx}_{wy}", (x + wx, y + wy, z + 0.03), 0.028, mat_dark_walnut())
            sc_parts.append(w)
    join_as_named_object(sc_parts, "Suitcase")

    # 6. Elevator door frame (Three.js: [5.2, 0, -3.8] -> Blender: (5.2, 3.8, 0))
    x, y, z = 5.2, 3.8, 0
    el_frame = create_box("el_fr", (x, y, z + 1.45), (1.65, 0.15, 2.85), mat_gold(), bevel=0.02)
    el_door_l = create_box("el_dl", (x - 0.36, y - 0.03, z + 1.40), (0.68, 0.04, 2.70), mat_steel(), bevel=0.01)
    el_door_r = create_box("el_dr", (x + 0.36, y - 0.03, z + 1.40), (0.68, 0.04, 2.70), mat_steel(), bevel=0.01)
    el_screen = create_box("el_sc", (x, y - 0.08, z + 2.65), (0.24, 0.01, 0.10), mat_screen((0.95, 0.75, 0.1, 1.0), 3.0, "Floor_5"))
    el_btn = create_box("el_bt", (x + 0.88, y - 0.08, z + 1.25), (0.08, 0.01, 0.16), mat_steel())
    join_as_named_object([el_frame, el_door_l, el_door_r, el_screen, el_btn], "Elevator")

    # 7. Safe_Box in room (Three.js: [-5.2, 0, -1.5] -> Blender: (-5.2, 1.5, 0))
    x, y, z = -5.2, 1.5, 0
    sf_body = create_box("sf_b", (x, y, z + 0.30), (0.54, 0.48, 0.58), mat_steel(), bevel=0.015)
    sf_door = create_box("sf_d", (x, y - 0.25, z + 0.30), (0.48, 0.03, 0.52), mat_steel(), bevel=0.01)
    sf_pad = create_box("sf_pd", (x - 0.10, y - 0.27, z + 0.32), (0.12, 0.01, 0.14), mat_dark_walnut())
    sf_dial = create_cylinder("sf_dl", (x + 0.10, y - 0.28, z + 0.32), 0.045, 0.03, mat_chrome(), rotation=(math.radians(90), 0, 0))
    join_as_named_object([sf_body, sf_door, sf_pad, sf_dial], "Safe_Box")

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "hotel.glb"))
    print("WORLD 4 (HOTEL) BUILT SUCCESSFULLY!")


# ==============================================================================
# WORLD 5: DATING.GLB
# Exact spatial synergy with WORLD_TOUR_SCENARIOS.dating
# ==============================================================================
def build_dating():
    reset_scene()
    print("Building World: Romantic Dating Bistro (Spatial Synergy Pack)...")
    add_bounds_anchor(radius=10.0)

    # 1. Candle on center table (Three.js: [0, 0.99, 0] -> Blender: (0, 0, 0.99))
    x, y, z = 0, 0, 0.99
    c_glass = create_cylinder("c_gl", (x, y, z + 0.075), 0.055, 0.14, mat_glass())
    c_wax = create_cylinder("c_wx", (x, y, z + 0.055), 0.045, 0.10, get_material("Beeswax_Ivory", (0.95, 0.92, 0.82, 1.0), roughness=0.4))
    c_flame = create_sphere("c_fl", (x, y, z + 0.13), 0.014, mat_screen((1.0, 0.65, 0.15, 1.0), 4.5, "Flame_Gold"), scale=(0.7, 0.7, 1.5))
    join_as_named_object([c_glass, c_wax, c_flame], "Candle")

    # 2. Wine_Glasses on table (Three.js: [0.26, 0.99, 0.26] -> Blender: (0.26, -0.26, 0.99))
    x, y, z = 0.26, -0.26, 0.99
    parts_wg = []
    for dx, dy in [(-0.06, 0), (0.06, 0)]:
        bs = create_cylinder(f"wg_b_{dx}", (x + dx, y + dy, z + 0.005), 0.036, 0.006, mat_glass())
        st = create_cylinder(f"wg_s_{dx}", (x + dx, y + dy, z + 0.07), 0.004, 0.13, mat_glass())
        bw = create_sphere(f"wg_w_{dx}", (x + dx, y + dy, z + 0.16), 0.042, mat_glass(), scale=(1.0, 1.0, 1.4))
        wn = create_sphere(f"wg_wn_{dx}", (x + dx, y + dy, z + 0.14), 0.036, mat_velvet_red(), scale=(0.95, 0.95, 1.1))
        parts_wg.extend([bs, st, bw, wn])
    join_as_named_object(parts_wg, "Wine_Glasses")

    # 3. Wine_List on table (Three.js: [-0.34, 0.99, 0.28] -> Blender: (-0.34, -0.28, 0.99))
    x, y, z = -0.34, -0.28, 0.99
    wl_b = create_box("wl_b", (x, y, z + 0.01), (0.16, 0.24, 0.015), get_material("WineList_Red", (0.42, 0.08, 0.12, 1.0), roughness=0.4), bevel=0.005)
    wl_c = create_box("wl_c", (x, y, z + 0.018), (0.03, 0.03, 0.002), mat_gold())
    join_as_named_object([wl_b, wl_c], "Wine_List")

    # 4. Bouquet_of_Roses on table (Three.js: [0, 0.99, -0.32] -> Blender: (0, 0.32, 0.99))
    x, y, z = 0, 0.32, 0.99
    bq_vase = create_cylinder("bq_vs", (x, y, z + 0.10), 0.06, 0.20, mat_porcelain())
    bq_parts = [bq_vase]
    for angle in [0, 1.047, 2.094, 3.141, 4.188, 5.235]:
        rx = x + 0.045 * math.cos(angle)
        ry = y + 0.045 * math.sin(angle)
        rose = create_sphere(f"bq_r_{angle}", (rx, ry, z + 0.22), 0.032, mat_velvet_red(), scale=(1.0, 1.0, 0.8))
        bq_parts.append(rose)
    rose_ctr = create_sphere("bq_rc", (x, y, z + 0.245), 0.036, mat_velvet_red())
    bq_parts.append(rose_ctr)
    join_as_named_object(bq_parts, "Bouquet_of_Roses")

    # 5. Chocolate_Fondant on table (Three.js: [0.24, 0.99, -0.26] -> Blender: (0.24, 0.26, 0.99))
    x, y, z = 0.24, 0.26, 0.99
    cf_plate = create_cylinder("cf_pl", (x, y, z + 0.008), 0.11, 0.015, mat_porcelain())
    cf_cake = create_cylinder("cf_ck", (x, y, z + 0.035), 0.055, 0.045, get_material("Dark_Chocolate", (0.15, 0.08, 0.05, 1.0), roughness=0.6))
    cf_lava = create_sphere("cf_lv", (x, y - 0.03, z + 0.02), 0.022, get_material("Lava_Glaze", (0.10, 0.05, 0.03, 1.0), roughness=0.2))
    cf_berry = create_sphere("cf_by", (x + 0.045, y + 0.035, z + 0.024), 0.014, mat_velvet_red())
    join_as_named_object([cf_plate, cf_cake, cf_lava, cf_berry], "Chocolate_Fondant")

    # 6. Ring_Box on table (Three.js: [-0.14, 0.99, 0.12] -> Blender: (-0.14, -0.12, 0.99))
    x, y, z = -0.14, -0.12, 0.99
    rb_base = create_box("rb_bs", (x, y, z + 0.02), (0.065, 0.065, 0.038), get_material("Velvet_Navy_Box", (0.05, 0.08, 0.22, 1.0), roughness=0.85), bevel=0.005)
    rb_lid = create_box("rb_ld", (x, y + 0.03, z + 0.06), (0.065, 0.065, 0.018), get_material("Velvet_Navy_Box", (0.05, 0.08, 0.22, 1.0), roughness=0.85), rotation=(math.radians(-70), 0, 0), bevel=0.005)
    rb_ring = create_torus("rb_rg", (x, y, z + 0.042), 0.012, 0.003, mat_gold(), rotation=(math.radians(90), 0, 0))
    rb_gem = create_sphere("rb_gm", (x, y, z + 0.056), 0.006, mat_glass())
    join_as_named_object([rb_base, rb_lid, rb_ring, rb_gem], "Ring_Box")

    # 7. Champagne_Bottle in ice bucket stand (Three.js: [-2.15, 0, -1.25] -> Blender: (-2.15, 1.25, 0))
    x, y, z = -2.15, 1.25, 0
    cp_stand_b = create_cylinder("cp_sb", (x, y, z + 0.02), 0.18, 0.04, mat_chrome())
    cp_pole = create_cylinder("cp_pl", (x, y, z + 0.42), 0.024, 0.80, mat_chrome())
    cp_bucket = create_cylinder("cp_bk", (x, y, z + 0.92), 0.14, 0.24, mat_steel())
    cp_ice = create_cylinder("cp_ic", (x, y, z + 0.98), 0.13, 0.06, mat_glass())
    cp_bot = create_cylinder("cp_bt", (x, y, z + 1.10), 0.048, 0.28, get_material("Champagne_Glass_Green", (0.08, 0.25, 0.12, 1.0), roughness=0.2, transmission=0.5), rotation=(0, math.radians(15), 0))
    cp_neck = create_cylinder("cp_nk", (x + 0.02, y, z + 1.28), 0.018, 0.12, mat_gold(), rotation=(0, math.radians(15), 0))
    join_as_named_object([cp_stand_b, cp_pole, cp_bucket, cp_ice, cp_bot, cp_neck], "Champagne_Bottle")

    # 8. Violin on music stand (Three.js: [-3.4, 0, -2.2] -> Blender: (-3.4, 2.2, 0))
    x, y, z = -3.4, 2.2, 0
    vn_tripod = create_cylinder("vn_tr", (x, y, z + 0.02), 0.22, 0.04, mat_steel())
    vn_mast = create_cylinder("vn_ms", (x, y, z + 0.50), 0.018, 0.96, mat_steel())
    vn_body1 = create_sphere("vn_b1", (x, y, z + 0.96), 0.09, mat_warm_wood(), scale=(1.2, 0.8, 1.4))
    vn_body2 = create_sphere("vn_b2", (x, y, z + 1.10), 0.075, mat_warm_wood(), scale=(1.1, 0.7, 1.3))
    vn_neck = create_cylinder("vn_nk", (x, y, z + 1.25), 0.015, 0.24, mat_dark_walnut())
    vn_scroll = create_torus("vn_sc", (x, y, z + 1.38), 0.025, 0.008, mat_dark_walnut())
    vn_bow = create_cylinder("vn_bw", (x + 0.12, y, z + 1.05), 0.006, 0.70, mat_dark_walnut(), rotation=(0, math.radians(15), 0))
    join_as_named_object([vn_tripod, vn_mast, vn_body1, vn_body2, vn_neck, vn_scroll, vn_bow], "Violin")

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "dating.glb"))
    print("WORLD 5 (DATING) BUILT SUCCESSFULLY!")


# ==============================================================================
# WORLD 6: GARDEN.GLB
# Exact spatial synergy with WORLD_TOUR_SCENARIOS.garden
# ==============================================================================
def build_garden():
    reset_scene()
    print("Building World: Botanical Garden (Spatial Synergy Pack)...")
    add_bounds_anchor(radius=18.0)

    # 1. Stone_Fountain (Three.js: [6.4, 0, 11.2] -> Blender: (6.4, -11.2, 0))
    x, y, z = 6.4, -11.2, 0
    mat_stone = get_material("Limestone_Fountain", (0.82, 0.80, 0.76, 1.0), roughness=0.7)
    ft_base = create_cylinder("ft_bs", (x, y, z + 0.12), 1.10, 0.24, mat_stone)
    ft_ped = create_cylinder("ft_pd", (x, y, z + 0.50), 0.32, 0.60, mat_stone)
    ft_bowl = create_cylinder("ft_bw", (x, y, z + 0.85), 0.75, 0.18, mat_stone)
    ft_water = create_cylinder("ft_wt", (x, y, z + 0.89), 0.70, 0.04, mat_glass())
    ft_spout = create_sphere("ft_sp", (x, y, z + 1.05), 0.14, mat_stone)
    join_as_named_object([ft_base, ft_ped, ft_bowl, ft_water, ft_spout], "Stone_Fountain")

    # 2. Watering_Can (Three.js: [-3.2, 0, 11.4] -> Blender: (-3.2, -11.4, 0))
    x, y, z = -3.2, -11.4, 0
    mat_can = get_material("Watering_Can_Green", (0.12, 0.42, 0.22, 1.0), roughness=0.45)
    wc_body = create_cylinder("wc_b", (x, y, z + 0.16), 0.14, 0.32, mat_can)
    wc_spout = create_cylinder("wc_s", (x + 0.14, y, z + 0.25), 0.022, 0.34, mat_can, rotation=(0, math.radians(45), 0))
    wc_rose = create_sphere("wc_r", (x + 0.28, y, z + 0.38), 0.045, mat_gold(), scale=(1.0, 1.0, 0.5))
    wc_handle = create_torus("wc_h", (x, y, z + 0.36), 0.15, 0.018, mat_can, rotation=(0, math.radians(90), 0))
    join_as_named_object([wc_body, wc_spout, wc_rose, wc_handle], "Watering_Can")

    # 3. Wheelbarrow (Three.js: [3.2, 0, 13.6] -> Blender: (3.2, -13.6, 0))
    x, y, z = 3.2, -13.6, 0
    mat_wb_tray = get_material("Wheelbarrow_Red", (0.85, 0.15, 0.15, 1.0), roughness=0.4)
    wb_tray = create_box("wb_tr", (x, y, z + 0.36), (0.64, 0.85, 0.26), mat_wb_tray, bevel=0.02)
    wb_wheel = create_cylinder("wb_wh", (x, y + 0.48, z + 0.18), 0.18, 0.07, mat_dark_walnut(), rotation=(0, math.radians(90), 0))
    wb_h1 = create_cylinder("wb_h1", (x - 0.25, y - 0.52, z + 0.32), 0.024, 0.55, mat_warm_wood(), rotation=(math.radians(35), 0, 0))
    wb_h2 = create_cylinder("wb_h2", (x + 0.25, y - 0.52, z + 0.32), 0.024, 0.55, mat_warm_wood(), rotation=(math.radians(35), 0, 0))
    wb_leg1 = create_cylinder("wb_l1", (x - 0.22, y - 0.15, z + 0.15), 0.018, 0.28, mat_steel())
    wb_leg2 = create_cylinder("wb_l2", (x + 0.22, y - 0.15, z + 0.15), 0.018, 0.28, mat_steel())
    join_as_named_object([wb_tray, wb_wheel, wb_h1, wb_h2, wb_leg1, wb_leg2], "Wheelbarrow")

    # 4. Flower_Pot (Three.js: [1.2, 0, 6.8] -> Blender: (1.2, -6.8, 0))
    x, y, z = 1.2, -6.8, 0
    fp_pot = create_cylinder("fp_pt", (x, y, z + 0.22), 0.24, 0.44, mat_terracotta())
    fp_rim = create_cylinder("fp_rm", (x, y, z + 0.42), 0.26, 0.06, mat_terracotta())
    fp_soil = create_cylinder("fp_sl", (x, y, z + 0.41), 0.23, 0.03, get_material("Fertile_Soil", (0.18, 0.12, 0.08, 1.0), roughness=0.9))
    fp_flowers = []
    for angle in [0, 1.25, 2.5, 3.75, 5.0]:
        fx = x + 0.12 * math.cos(angle)
        fy = y + 0.12 * math.sin(angle)
        fl = create_sphere(f"fp_fl_{angle}", (fx, fy, z + 0.52), 0.06, mat_screen((0.95, 0.2, 0.5, 1.0), 1.5, "Geranium_Pink"))
        fp_flowers.append(fl)
    join_as_named_object([fp_pot, fp_rim, fp_soil] + fp_flowers, "Flower_Pot")

    # 5. Pruning_Shears (Three.js: [1.8, 0.8, 7.2] -> Blender: (1.8, -7.2, 0.8))
    x, y, z = 1.8, -7.2, 0.8
    ps_b1 = create_cylinder("ps_b1", (x, y + 0.04, z + 0.01), 0.008, 0.10, mat_steel(), rotation=(math.radians(90), 0, 0))
    ps_h1 = create_cylinder("ps_h1", (x - 0.02, y - 0.06, z + 0.01), 0.012, 0.12, mat_velvet_red(), rotation=(math.radians(75), 0, 0))
    ps_h2 = create_cylinder("ps_h2", (x + 0.02, y - 0.06, z + 0.01), 0.012, 0.12, mat_velvet_red(), rotation=(math.radians(105), 0, 0))
    join_as_named_object([ps_b1, ps_h1, ps_h2], "Pruning_Shears")

    # 6. Garden_Trowel (Three.js: [0.6, 0.8, 7.2] -> Blender: (0.6, -7.2, 0.8))
    x, y, z = 0.6, -7.2, 0.8
    gt_blade = create_cylinder("gt_b", (x, y + 0.08, z + 0.01), 0.035, 0.14, mat_steel(), rotation=(math.radians(90), 0, 0), scale=(1.0, 0.35, 1.0))
    gt_shank = create_cylinder("gt_s", (x, y, z + 0.015), 0.008, 0.06, mat_steel(), rotation=(math.radians(90), 0, 0))
    gt_handle = create_cylinder("gt_h", (x, y - 0.08, z + 0.015), 0.016, 0.13, mat_warm_wood(), rotation=(math.radians(90), 0, 0))
    join_as_named_object([gt_blade, gt_shank, gt_handle], "Garden_Trowel")

    # 7. Picnic_Basket (Three.js: [-3.8, 0, 8.2] -> Blender: (-3.8, -8.2, 0))
    x, y, z = -3.8, -8.2, 0
    pb_body = create_box("pb_b", (x, y, z + 0.16), (0.42, 0.28, 0.26), get_material("Wicker_Weave", (0.75, 0.55, 0.32, 1.0), roughness=0.8), bevel=0.015)
    pb_lid1 = create_box("pb_l1", (x - 0.10, y, z + 0.30), (0.20, 0.29, 0.02), mat_warm_wood(), bevel=0.005)
    pb_lid2 = create_box("pb_l2", (x + 0.10, y, z + 0.30), (0.20, 0.29, 0.02), mat_warm_wood(), bevel=0.005)
    pb_handle = create_torus("pb_h", (x, y, z + 0.36), 0.14, 0.016, mat_warm_wood(), rotation=(0, math.radians(90), 0))
    join_as_named_object([pb_body, pb_lid1, pb_lid2, pb_handle], "Picnic_Basket")

    # 8. Garden_Lantern (Three.js: [2.8, 0, 7.6] -> Blender: (2.8, -7.6, 0))
    x, y, z = 2.8, -7.6, 0
    gl_post = create_cylinder("gl_p", (x, y, z + 0.65), 0.038, 1.30, mat_steel())
    gl_head = create_box("gl_h", (x, y, z + 1.40), (0.22, 0.22, 0.30), mat_steel(), bevel=0.01)
    gl_glass = create_box("gl_gl", (x, y, z + 1.40), (0.18, 0.18, 0.26), mat_screen((1.0, 0.75, 0.25, 1.0), 3.0, "Amber_Glow"))
    gl_cap = create_cylinder("gl_c", (x, y, z + 1.58), 0.16, 0.08, mat_steel(), vertices=4, rotation=(0, 0, math.radians(45)))
    join_as_named_object([gl_post, gl_head, gl_glass, gl_cap], "Garden_Lantern")

    # 9. Birdhouse (Three.js: [-6.8, 0, 10.2] -> Blender: (-6.8, -10.2, 0))
    x, y, z = -6.8, -10.2, 0
    bh_post = create_cylinder("bh_p", (x, y, z + 0.75), 0.045, 1.50, mat_warm_wood())
    bh_box = create_box("bh_bx", (x, y, z + 1.65), (0.26, 0.26, 0.32), mat_dark_walnut(), bevel=0.01)
    bh_roof = create_box("bh_rf", (x, y, z + 1.84), (0.32, 0.32, 0.06), mat_velvet_red(), bevel=0.01)
    bh_hole = create_cylinder("bh_h", (x, y - 0.13, z + 1.68), 0.038, 0.02, get_material("Cavity_Black", (0.02, 0.02, 0.02, 1.0)), rotation=(math.radians(90), 0, 0))
    bh_perch = create_cylinder("bh_pr", (x, y - 0.17, z + 1.60), 0.010, 0.08, mat_warm_wood(), rotation=(math.radians(90), 0, 0))
    join_as_named_object([bh_post, bh_box, bh_roof, bh_hole, bh_perch], "Birdhouse")

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "garden.glb"))
    print("WORLD 6 (GARDEN) BUILT SUCCESSFULLY!")


# ==============================================================================
# WORLD 7: SPACE.GLB
# Exact spatial synergy with WORLD_TOUR_SCENARIOS.space
# ==============================================================================
def build_space():
    reset_scene()
    print("Building World: Orbital Deep Space (Spatial Synergy Pack)...")
    add_bounds_anchor(radius=16.0)

    # 1. Control_Console (Three.js: [-1.5, 1.2, 6.2] -> Blender: (-1.5, -6.2, 0))
    x, y, z = -1.5, -6.2, 0
    cc_base = create_box("cc_b", (x, y, z + 0.45), (1.40, 0.65, 0.90), mat_steel(), bevel=0.015)
    cc_top = create_box("cc_t", (x, y, z + 0.93), (1.45, 0.70, 0.06), mat_black_marble())
    cc_screen1 = create_box("cc_s1", (x - 0.35, y - 0.10, z + 1.20), (0.50, 0.03, 0.35), mat_screen((0.1, 0.85, 1.0, 1.0), 3.5, "Console_Telemetry"), rotation=(math.radians(20), 0, 0))
    cc_screen2 = create_box("cc_s2", (x + 0.35, y - 0.10, z + 1.20), (0.50, 0.03, 0.35), mat_screen((0.1, 1.0, 0.4, 1.0), 3.5, "Console_Radar"), rotation=(math.radians(20), 0, 0))
    join_as_named_object([cc_base, cc_top, cc_screen1, cc_screen2], "Control_Console")

    # 2. Astronaut_Helmet on console (Three.js: [1.5, 1.4, 6.2] -> Blender: (1.5, -6.2, 1.2))
    x, y, z = 1.5, -6.2, 1.2
    ah_shell = create_sphere("ah_sh", (x, y, z + 0.20), 0.18, mat_porcelain(), scale=(1.05, 1.15, 1.1))
    ah_visor = create_sphere("ah_vs", (x, y - 0.06, z + 0.21), 0.145, mat_gold(), scale=(1.02, 1.15, 0.9))
    ah_ring = create_torus("ah_rg", (x, y, z + 0.03), 0.14, 0.022, mat_steel())
    join_as_named_object([ah_shell, ah_visor, ah_ring], "Astronaut_Helmet")

    # 3. Oxygen_Tank (Three.js: [-3.2, 1.2, 6.5] -> Blender: (-3.2, -6.5, 0))
    x, y, z = -3.2, -6.5, 0
    t1 = create_cylinder("ot_t1", (x - 0.14, y, z + 0.65), 0.12, 0.90, mat_porcelain())
    c1_t = create_sphere("ot_c1t", (x - 0.14, y, z + 1.10), 0.12, mat_porcelain())
    c1_b = create_sphere("ot_c1b", (x - 0.14, y, z + 0.20), 0.12, mat_porcelain())
    t2 = create_cylinder("ot_t2", (x + 0.14, y, z + 0.65), 0.12, 0.90, mat_porcelain())
    c2_t = create_sphere("ot_c2t", (x + 0.14, y, z + 1.10), 0.12, mat_porcelain())
    c2_b = create_sphere("ot_c2b", (x + 0.14, y, z + 0.20), 0.12, mat_porcelain())
    ot_pipe = create_torus("ot_pp", (x, y, z + 1.18), 0.14, 0.016, mat_chrome())
    join_as_named_object([t1, c1_t, c1_b, t2, c2_t, c2_b, ot_pipe], "Oxygen_Tank")

    # 4. Robotic_Arm (Three.js: [3.6, 2.8, 4.8] -> Blender: (3.6, -4.8, 0))
    x, y, z = 3.6, -4.8, 0
    ra_base = create_cylinder("ra_bs", (x, y, z + 0.15), 0.28, 0.30, mat_steel())
    ra_seg1 = create_cylinder("ra_s1", (x, y, z + 0.85), 0.08, 1.10, mat_porcelain(), rotation=(math.radians(25), 0, 0))
    ra_knuckle = create_sphere("ra_kn", (x, y + 0.24, z + 1.35), 0.12, mat_steel())
    ra_seg2 = create_cylinder("ra_s2", (x, y + 0.45, z + 1.85), 0.07, 0.95, mat_porcelain(), rotation=(math.radians(-35), 0, 0))
    ra_claw = create_torus("ra_cl", (x, y + 0.65, z + 2.25), 0.09, 0.018, mat_steel())
    join_as_named_object([ra_base, ra_seg1, ra_knuckle, ra_seg2, ra_claw], "Robotic_Arm")

    # 5. Hydroponic_Pod (Three.js: [-4.8, 1.5, 3.2] -> Blender: (-4.8, -3.2, 0))
    x, y, z = -4.8, -3.2, 0
    hp_base = create_cylinder("hp_bs", (x, y, z + 0.20), 0.42, 0.40, mat_steel())
    hp_glass = create_cylinder("hp_gl", (x, y, z + 1.05), 0.38, 1.30, mat_glass())
    hp_cap = create_cylinder("hp_cp", (x, y, z + 1.75), 0.42, 0.15, mat_steel())
    hp_light = create_cylinder("hp_lt", (x, y, z + 1.05), 0.04, 1.25, mat_screen((0.95, 0.1, 0.7, 1.0), 3.5, "Grow_Light"))
    hp_plant = create_sphere("hp_pl", (x, y, z + 0.80), 0.28, get_material("Bio_Green", (0.1, 0.8, 0.2, 1.0), roughness=0.5))
    join_as_named_object([hp_base, hp_glass, hp_cap, hp_light, hp_plant], "Hydroponic_Pod")

    # 6. Airlock_Door (Three.js: [0, 1.8, 7.8] -> Blender: (0, -7.8, 0))
    x, y, z = 0, -7.8, 0
    al_frame = create_cylinder("al_fr", (x, y, z + 1.40), 1.15, 0.20, mat_steel(), rotation=(math.radians(90), 0, 0))
    al_door = create_cylinder("al_dr", (x, y + 0.04, z + 1.40), 1.00, 0.12, get_material("Hazard_Yellow", (0.95, 0.78, 0.08, 1.0), roughness=0.4), rotation=(math.radians(90), 0, 0))
    al_wheel = create_torus("al_wh", (x, y - 0.08, z + 1.40), 0.28, 0.035, mat_chrome(), rotation=(math.radians(90), 0, 0))
    join_as_named_object([al_frame, al_door, al_wheel], "Airlock_Door")

    # 7. Space_Telescope in orbit (Three.js: [-7.5, 3.8, -4.2] -> Blender: (-7.5, 4.2, 3.8))
    x, y, z = -7.5, 4.2, 3.8
    st_body = create_cylinder("st_bd", (x, y, z), 0.32, 1.40, mat_gold(), rotation=(math.radians(45), 0, 0))
    st_shade = create_cylinder("st_sh", (x, y - 0.55, z - 0.55), 0.34, 0.30, mat_steel(), rotation=(math.radians(45), 0, 0))
    st_wing_l = create_box("st_wl", (x - 0.85, y, z), (0.90, 0.35, 0.03), mat_screen((0.1, 0.3, 0.9, 1.0), 2.5, "Solar_Cell"))
    st_wing_r = create_box("st_wr", (x + 0.85, y, z), (0.90, 0.35, 0.03), mat_screen((0.1, 0.3, 0.9, 1.0), 2.5, "Solar_Cell"))
    join_as_named_object([st_body, st_shade, st_wing_l, st_wing_r], "Space_Telescope")

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "space.glb"))
    print("WORLD 7 (SPACE) BUILT SUCCESSFULLY!")


if __name__ == "__main__":
    build_house()
    build_supermarket()
    build_restaurant()
    build_hotel()
    build_dating()
    build_garden()
    build_space()
