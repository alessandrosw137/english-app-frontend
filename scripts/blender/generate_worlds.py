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
    mat_terracotta, mat_screen, build_diorama_room
)

OUTPUT_WORLDS_DIR = r"C:\Users\alessandro\Desktop\ENGLISH\assets\models\worlds"

# ==============================================================================
# WORLD 1: HOUSE.GLB (Modern Living & Kitchen Diorama)
# ==============================================================================
def build_house():
    reset_scene()
    print("Building World: House & Kitchen Studio...")
    
    # 1. Diorama Architecture (Floor, L-Walls, Baseboards, Large Window)
    build_diorama_room(
        "House", 
        floor_size=(9.0, 9.0), 
        wall_height=3.4, 
        floor_mat=mat_warm_wood(),
        wall_mat=get_material("House_Wall", base_color=(0.91, 0.90, 0.88, 1.0), roughness=0.65),
        baseboard_mat=mat_dark_walnut(),
        has_window=True
    )

    # Architectural Kitchen Island Counter (L-shaped)
    cnt_top = create_box("cnt_t", (-2.6, 2.6, 0.92), (3.6, 1.2, 0.08), mat_black_marble())
    cnt_base = create_box("cnt_b", (-2.6, 2.6, 0.44), (3.4, 1.0, 0.88), mat_dark_walnut())
    join_as_named_object([cnt_top, cnt_base], "Kitchen_Counter")

    # Coffee Table & Living Room Rug
    rug = create_box("lv_rug", (1.6, -0.6, 0.01), (2.8, 2.2, 0.02), get_material("Rug_Cream", base_color=(0.88, 0.85, 0.80, 1.0), roughness=0.9))
    tbl_t = create_box("lv_tt", (1.6, -0.6, 0.45), (1.6, 1.0, 0.05), mat_warm_wood())
    tbl_l1 = create_cylinder("lv_tl1", (0.9, -1.0, 0.22), 0.03, 0.44, mat_dark_walnut())
    tbl_l2 = create_cylinder("lv_tl2", (2.3, -1.0, 0.22), 0.03, 0.44, mat_dark_walnut())
    tbl_l3 = create_cylinder("lv_tl3", (0.9, -0.2, 0.22), 0.03, 0.44, mat_dark_walnut())
    tbl_l4 = create_cylinder("lv_tl4", (2.3, -0.2, 0.22), 0.03, 0.44, mat_dark_walnut())
    join_as_named_object([rug, tbl_t, tbl_l1, tbl_l2, tbl_l3, tbl_l4], "Living_Table")

    # Bathroom Vanity on side wall
    van_b = create_box("vn_b", (-3.6, 0.2, 0.44), (0.9, 1.4, 0.88), mat_dark_walnut())
    van_t = create_box("vn_t", (-3.6, 0.2, 0.92), (0.95, 1.45, 0.08), mat_black_marble())
    join_as_named_object([van_b, van_t], "Bathroom_Vanity")

    sink_b = create_box("sk_b", (-3.6, 0.2, 0.98), (0.55, 0.85, 0.16), mat_porcelain())
    sink_f = create_cylinder("sk_f", (-3.9, 0.2, 1.15), 0.02, 0.25, mat_chrome(), rotation=(0, math.radians(20), 0))
    join_as_named_object([sink_b, sink_f], "Sink_Basin")

    # --- INTERACTIVE ASSETS ---

    # 1. Microwave
    mw_body = create_box("mw_b", (-3.6, 2.6, 1.20), (0.68, 0.44, 0.38), mat_steel())
    mw_frame = create_box("mw_fr", (-3.6, 2.37, 1.20), (0.46, 0.02, 0.32), get_material("Matte_Black_Frame", base_color=(0.1, 0.1, 0.1, 1.0), roughness=0.5))
    mw_glass = create_box("mw_gl", (-3.6, 2.36, 1.20), (0.38, 0.01, 0.24), mat_glass())
    mw_plate = create_cylinder("mw_pl", (-3.6, 2.50, 1.06), 0.14, 0.015, mat_glass())
    mw_handle = create_cylinder("mw_h", (-3.80, 2.34, 1.20), 0.014, 0.26, mat_chrome(), rotation=(math.radians(90), 0, 0))
    mw_panel = create_box("mw_p", (-3.30, 2.37, 1.20), (0.16, 0.02, 0.32), mat_steel())
    mw_screen = create_box("mw_sc", (-3.30, 2.35, 1.28), (0.12, 0.01, 0.06), mat_screen(color=(0.1, 1.0, 0.3, 1.0), strength=3.0, name="LED_Green"))
    mw_btn1 = create_box("mw_bt1", (-3.30, 2.35, 1.18), (0.10, 0.008, 0.03), mat_chrome())
    mw_btn2 = create_box("mw_bt2", (-3.30, 2.35, 1.13), (0.10, 0.008, 0.03), mat_chrome())
    join_as_named_object([mw_body, mw_frame, mw_glass, mw_plate, mw_handle, mw_panel, mw_screen, mw_btn1, mw_btn2], "Microwave")

    # 2. Blender
    bl_base = create_cylinder("bl_b", (-2.8, 2.6, 1.08), 0.14, 0.22, mat_steel())
    bl_dial = create_cylinder("bl_d", (-2.8, 2.45, 1.08), 0.035, 0.03, mat_chrome(), rotation=(math.radians(90), 0, 0))
    bl_b1 = create_sphere("bl_b1", (-2.74, 2.46, 1.04), 0.012, mat_screen((1.0, 0.2, 0.2, 1.0), 2.0, "Btn_Red"))
    bl_b2 = create_sphere("bl_b2", (-2.86, 2.46, 1.04), 0.012, mat_screen((0.2, 0.8, 1.0, 1.0), 2.0, "Btn_Blue"))
    bl_jug = create_cylinder("bl_j", (-2.8, 2.6, 1.38), 0.12, 0.38, mat_glass(), vertices=8)
    bl_liquid = create_cylinder("bl_lq", (-2.8, 2.6, 1.34), 0.11, 0.26, get_material("Juice_Orange", base_color=(0.95, 0.45, 0.05, 1.0), roughness=0.2, transmission=0.4))
    bl_blade = create_box("bl_bld", (-2.8, 2.6, 1.21), (0.10, 0.10, 0.01), mat_steel())
    bl_lid = create_cylinder("bl_l", (-2.8, 2.6, 1.58), 0.13, 0.04, mat_dark_walnut())
    bl_cap = create_cylinder("bl_c", (-2.8, 2.6, 1.62), 0.045, 0.05, mat_glass())
    bl_handle = create_torus("bl_h", (-2.68, 2.6, 1.38), 0.08, 0.018, mat_dark_walnut(), rotation=(0, math.radians(90), 0))
    join_as_named_object([bl_base, bl_dial, bl_b1, bl_b2, bl_jug, bl_liquid, bl_blade, bl_lid, bl_cap, bl_handle], "Blender")

    # 3. Toaster
    to_body = create_box("to_b", (-2.0, 2.6, 1.07), (0.36, 0.22, 0.24), mat_chrome(), bevel=0.02)
    to_slot1 = create_box("to_s1", (-2.0, 2.54, 1.18), (0.24, 0.03, 0.02), mat_dark_walnut())
    to_slot2 = create_box("to_s2", (-2.0, 2.66, 1.18), (0.24, 0.03, 0.02), mat_dark_walnut())
    to_bread1 = create_box("to_br1", (-2.0, 2.54, 1.22), (0.20, 0.025, 0.12), get_material("Toast_Crust", base_color=(0.72, 0.48, 0.22, 1.0), roughness=0.85), bevel=0.01)
    to_bread2 = create_box("to_br2", (-2.0, 2.66, 1.22), (0.20, 0.025, 0.12), get_material("Toast_Crust", base_color=(0.72, 0.48, 0.22, 1.0), roughness=0.85), bevel=0.01)
    to_lever = create_cylinder("to_lv", (-2.20, 2.6, 1.06), 0.015, 0.08, mat_steel(), rotation=(0, math.radians(90), 0))
    to_dial = create_cylinder("to_dl", (-2.0, 2.48, 1.02), 0.025, 0.02, mat_steel(), rotation=(math.radians(90), 0, 0))
    join_as_named_object([to_body, to_slot1, to_slot2, to_bread1, to_bread2, to_lever, to_dial], "Toaster")

    # 4. Coffee_Maker
    cf_base = create_box("cf_b", (-1.3, 2.6, 0.98), (0.34, 0.36, 0.08), mat_steel())
    cf_plate = create_cylinder("cf_pl", (-1.3, 2.52, 1.025), 0.10, 0.01, get_material("HotPlate", base_color=(0.15, 0.15, 0.15, 1.0), roughness=0.3))
    cf_back = create_box("cf_bk", (-1.3, 2.72, 1.22), (0.30, 0.12, 0.44), mat_steel())
    cf_tank = create_cylinder("cf_tk", (-1.3, 2.72, 1.24), 0.10, 0.38, mat_glass())
    cf_head = create_box("cf_hd", (-1.3, 2.54, 1.44), (0.30, 0.26, 0.08), mat_steel())
    cf_carafe = create_sphere("cf_cr", (-1.3, 2.52, 1.15), 0.11, mat_glass(), scale=(1.0, 1.0, 1.2))
    cf_coffee = create_sphere("cf_co", (-1.3, 2.52, 1.12), 0.095, get_material("Dark_Coffee", base_color=(0.12, 0.06, 0.03, 1.0), roughness=0.15, transmission=0.4))
    cf_handle = create_torus("cf_h", (-1.3, 2.40, 1.15), 0.07, 0.015, mat_dark_walnut())
    cf_light = create_sphere("cf_led", (-1.16, 2.45, 0.98), 0.014, mat_screen((1.0, 0.1, 0.1, 1.0), 3.0, "LED_Red"))
    join_as_named_object([cf_base, cf_plate, cf_back, cf_tank, cf_head, cf_carafe, cf_coffee, cf_handle, cf_light], "Coffee_Maker")

    # 5. Refrigerator
    rf_body = create_box("rf_b", (-4.2, 2.5, 1.15), (0.95, 0.90, 2.20), mat_steel())
    rf_door_l = create_box("rf_dl", (-4.44, 2.03, 1.45), (0.45, 0.04, 1.45), mat_steel(), bevel=0.015)
    rf_door_r = create_box("rf_dr", (-3.96, 2.03, 1.45), (0.45, 0.04, 1.45), mat_steel(), bevel=0.015)
    rf_freezer = create_box("rf_fz", (-4.2, 2.03, 0.40), (0.93, 0.04, 0.65), mat_steel(), bevel=0.015)
    rf_disp_cav = create_box("rf_dc", (-4.44, 2.00, 1.45), (0.22, 0.03, 0.32), get_material("Dispenser_Cavity", base_color=(0.12, 0.12, 0.14, 1.0), roughness=0.4))
    rf_disp_scr = create_box("rf_ds", (-4.44, 1.99, 1.55), (0.16, 0.01, 0.06), mat_screen((0.2, 0.7, 1.0, 1.0), 2.5, "Disp_Screen"))
    rf_hl = create_cylinder("rf_hl", (-4.24, 1.98, 1.45), 0.016, 0.90, mat_chrome())
    rf_hr = create_cylinder("rf_hr", (-4.16, 1.98, 1.45), 0.016, 0.90, mat_chrome())
    rf_hf = create_cylinder("rf_hf", (-4.20, 1.98, 0.68), 0.016, 0.65, mat_chrome(), rotation=(0, math.radians(90), 0))
    join_as_named_object([rf_body, rf_door_l, rf_door_r, rf_freezer, rf_disp_cav, rf_disp_scr, rf_hl, rf_hr, rf_hf], "Refrigerator")

    # 6. Sofa
    sf_wood = create_box("sf_w", (1.6, -2.2, 0.22), (2.5, 0.95, 0.28), mat_warm_wood(), bevel=0.015)
    sf_leg1 = create_cylinder("sf_l1", (0.5, -2.6, 0.10), 0.035, 0.20, mat_dark_walnut(), rotation=(math.radians(10), math.radians(-10), 0))
    sf_leg2 = create_cylinder("sf_l2", (2.7, -2.6, 0.10), 0.035, 0.20, mat_dark_walnut(), rotation=(math.radians(10), math.radians(10), 0))
    sf_leg3 = create_cylinder("sf_l3", (0.5, -1.8, 0.10), 0.035, 0.20, mat_dark_walnut(), rotation=(math.radians(-10), math.radians(-10), 0))
    sf_leg4 = create_cylinder("sf_l4", (2.7, -1.8, 0.10), 0.035, 0.20, mat_dark_walnut(), rotation=(math.radians(-10), math.radians(10), 0))
    mat_sofa_fab = get_material("Sofa_Navy", base_color=(0.18, 0.25, 0.38, 1.0), roughness=0.85)
    sf_seat1 = create_box("sf_s1", (0.9, -2.1, 0.50), (0.72, 0.78, 0.24), mat_sofa_fab, bevel=0.035)
    sf_seat2 = create_box("sf_s2", (1.6, -2.1, 0.50), (0.72, 0.78, 0.24), mat_sofa_fab, bevel=0.035)
    sf_seat3 = create_box("sf_s3", (2.3, -2.1, 0.50), (0.72, 0.78, 0.24), mat_sofa_fab, bevel=0.035)
    sf_back1 = create_box("sf_bk1", (0.9, -2.55, 0.85), (0.72, 0.22, 0.55), mat_sofa_fab, bevel=0.035)
    sf_back2 = create_box("sf_bk2", (1.6, -2.55, 0.85), (0.72, 0.22, 0.55), mat_sofa_fab, bevel=0.035)
    sf_back3 = create_box("sf_bk3", (2.3, -2.55, 0.85), (0.72, 0.22, 0.55), mat_sofa_fab, bevel=0.035)
    sf_arm_l = create_box("sf_al", (0.42, -2.1, 0.65), (0.24, 0.92, 0.45), mat_sofa_fab, bevel=0.03)
    sf_arm_r = create_box("sf_ar", (2.78, -2.1, 0.65), (0.24, 0.92, 0.45), mat_sofa_fab, bevel=0.03)
    mat_pillow = get_material("Pillow_Amber", base_color=(0.88, 0.62, 0.15, 1.0), roughness=0.7)
    sf_pil1 = create_box("sf_p1", (0.70, -2.3, 0.72), (0.36, 0.18, 0.36), mat_pillow, bevel=0.03, rotation=(0, 0, math.radians(18)))
    sf_pil2 = create_box("sf_p2", (2.50, -2.3, 0.72), (0.36, 0.18, 0.36), mat_pillow, bevel=0.03, rotation=(0, 0, math.radians(-18)))
    join_as_named_object([sf_wood, sf_leg1, sf_leg2, sf_leg3, sf_leg4, sf_seat1, sf_seat2, sf_seat3, sf_back1, sf_back2, sf_back3, sf_arm_l, sf_arm_r, sf_pil1, sf_pil2], "Sofa")

    # 7. Laptop
    lp_base = create_box("lp_b", (1.4, -0.6, 0.485), (0.38, 0.28, 0.016), mat_steel(), bevel=0.005)
    lp_keydeck = create_box("lp_kd", (1.4, -0.56, 0.495), (0.34, 0.15, 0.006), get_material("Keydeck", base_color=(0.12, 0.12, 0.12, 1.0), roughness=0.5))
    lp_trackpad = create_box("lp_tp", (1.4, -0.68, 0.494), (0.13, 0.08, 0.003), mat_chrome())
    lp_hinge = create_cylinder("lp_hg", (1.4, -0.46, 0.498), 0.008, 0.34, mat_steel(), rotation=(0, math.radians(90), 0))
    lp_screen_lid = create_box("lp_sl", (1.4, -0.38, 0.62), (0.38, 0.012, 0.26), mat_steel(), bevel=0.005, rotation=(math.radians(-25), 0, 0))
    lp_screen_disp = create_box("lp_sd", (1.4, -0.385, 0.62), (0.35, 0.004, 0.23), mat_screen((0.15, 0.65, 1.0, 1.0), 3.0, "Code_IDE_Glow"), rotation=(math.radians(-25), 0, 0))
    join_as_named_object([lp_base, lp_keydeck, lp_trackpad, lp_hinge, lp_screen_lid, lp_screen_disp], "Laptop")

    # 8. Remote_Control
    rc_body = create_box("rc_b", (2.0, -0.6, 0.485), (0.075, 0.24, 0.022), get_material("Remote_Matte", base_color=(0.12, 0.12, 0.13, 1.0), roughness=0.6), bevel=0.006)
    rc_pwr = create_cylinder("rc_pwr", (1.98, -0.50, 0.498), 0.009, 0.008, mat_screen((1.0, 0.1, 0.1, 1.0), 2.5, "Remote_Red"))
    rc_dpad = create_cylinder("rc_dp", (2.0, -0.56, 0.498), 0.025, 0.006, mat_chrome())
    rc_vol = create_box("rc_v", (1.98, -0.63, 0.498), (0.014, 0.035, 0.006), mat_steel())
    rc_ch = create_box("rc_c", (2.02, -0.63, 0.498), (0.014, 0.035, 0.006), mat_steel())
    rc_led = create_sphere("rc_ir", (2.0, -0.478, 0.485), 0.005, mat_screen((0.8, 0.1, 1.0, 1.0), 2.0, "IR_LED"))
    join_as_named_object([rc_body, rc_pwr, rc_dpad, rc_vol, rc_ch, rc_led], "Remote_Control")

    # 9. Toothbrush
    tb_handle_w = create_cylinder("tb_hw", (-3.85, 0.35, 1.05), 0.012, 0.22, mat_porcelain(), rotation=(0, math.radians(12), 0))
    tb_grip = create_cylinder("tb_gp", (-3.85, 0.35, 1.02), 0.0135, 0.11, mat_screen((0.1, 0.8, 0.9, 1.0), 1.0, "TB_Cyan"), rotation=(0, math.radians(12), 0))
    tb_head = create_box("tb_hd", (-3.80, 0.35, 1.18), (0.018, 0.016, 0.055), mat_porcelain())
    tb_bristle1 = create_box("tb_br1", (-3.79, 0.34, 1.18), (0.008, 0.006, 0.045), mat_screen((0.1, 0.5, 1.0, 1.0), 1.5, "Bristle_Blue"))
    tb_bristle2 = create_box("tb_br2", (-3.79, 0.36, 1.18), (0.008, 0.006, 0.045), mat_porcelain())
    join_as_named_object([tb_handle_w, tb_grip, tb_head, tb_bristle1, tb_bristle2], "Toothbrush")

    # 10. Soap_Dispenser
    sd_bottle = create_cylinder("sd_bt", (-3.35, 0.35, 1.04), 0.055, 0.18, get_material("Soap_Glass_Trans", base_color=(0.95, 0.98, 0.95, 1.0), roughness=0.1, transmission=0.75, ior=1.48))
    sd_soap = create_cylinder("sd_sp", (-3.35, 0.35, 1.01), 0.050, 0.14, get_material("Liquid_Soap_Amber", base_color=(0.95, 0.75, 0.20, 1.0), roughness=0.2, transmission=0.6))
    sd_tube = create_cylinder("sd_tb", (-3.35, 0.35, 1.04), 0.005, 0.16, mat_chrome())
    sd_collar = create_cylinder("sd_cl", (-3.35, 0.35, 1.14), 0.022, 0.03, mat_chrome())
    sd_pump = create_cylinder("sd_pm", (-3.35, 0.35, 1.18), 0.012, 0.05, mat_chrome())
    sd_spout = create_box("sd_spt", (-3.35, 0.32, 1.20), (0.014, 0.05, 0.014), mat_chrome())
    join_as_named_object([sd_bottle, sd_soap, sd_tube, sd_collar, sd_pump, sd_spout], "Soap_Dispenser")

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "house.glb"))

# ==============================================================================
# WORLD 2: SUPERMARKET.GLB (Market Diorama & POS Cashier Station)
# ==============================================================================
def build_supermarket():
    reset_scene()
    print("Building World: Supermarket & Grocery Store...")

    build_diorama_room(
        "Supermarket", 
        floor_size=(10.0, 10.0), 
        wall_height=3.6, 
        floor_mat=get_material("Market_Tiles", base_color=(0.85, 0.86, 0.88, 1.0), roughness=0.22),
        wall_mat=get_material("Market_Wall", base_color=(0.95, 0.96, 0.97, 1.0), roughness=0.5),
        baseboard_mat=mat_steel(),
        has_window=False
    )

    # 1. Gondola_Aisle (Double-sided commercial steel shelving)
    gn_base = create_box("gn_b", (-2.2, 0, 0.12), (1.5, 4.4, 0.24), mat_steel())
    gn_spine = create_box("gn_sp", (-2.2, 0, 1.2), (0.16, 4.4, 2.2), mat_steel())
    sh_parts = [gn_base, gn_spine]
    for z in [0.55, 0.95, 1.35, 1.75]:
        sh_l = create_box(f"gn_sl_{z}", (-2.6, 0, z), (0.65, 4.3, 0.04), mat_steel(), bevel=0.005)
        sh_r = create_box(f"gn_sr_{z}", (-1.8, 0, z), (0.65, 4.3, 0.04), mat_steel(), bevel=0.005)
        rail_l = create_box(f"gn_rl_{z}", (-2.93, 0, z), (0.02, 4.3, 0.035), mat_screen((0.9, 0.1, 0.1, 1.0), 1.0, "Rail_Red"))
        rail_r = create_box(f"gn_rr_{z}", (-1.47, 0, z), (0.02, 4.3, 0.035), mat_screen((0.1, 0.4, 0.9, 1.0), 1.0, "Rail_Blue"))
        sh_parts.extend([sh_l, sh_r, rail_l, rail_r])
    top_sign = create_box("gn_sgn", (-2.2, 0, 2.45), (0.9, 2.0, 0.30), mat_screen((0.05, 0.65, 0.85, 1.0), 2.5, "Aisle_Sign"))
    sh_parts.append(top_sign)
    join_as_named_object(sh_parts, "Gondola_Aisle")

    # 2. Cereal_Box (Triple pack with distinct flavors)
    mat_cf = get_material("Corn_Flakes_Gold", base_color=(0.95, 0.72, 0.12, 1.0), roughness=0.45)
    mat_cc = get_material("Choco_Crunch_Brn", base_color=(0.45, 0.25, 0.12, 1.0), roughness=0.5)
    mat_hr = get_material("Honey_Rings_Blue", base_color=(0.15, 0.45, 0.85, 1.0), roughness=0.45)
    
    cb1 = create_box("cb_1", (-1.8, 1.4, 1.48), (0.09, 0.25, 0.36), mat_cf, bevel=0.008)
    cb1_b = create_box("cb_1b", (-1.75, 1.4, 1.58), (0.01, 0.23, 0.08), mat_screen((0.9, 0.1, 0.1, 1.0), 1.5, "CF_Banner"))
    cb2 = create_box("cb_2", (-1.8, 1.1, 1.48), (0.09, 0.25, 0.36), mat_cc, bevel=0.008)
    cb2_b = create_box("cb_2b", (-1.75, 1.1, 1.58), (0.01, 0.23, 0.08), mat_screen((0.95, 0.85, 0.2, 1.0), 1.5, "CC_Banner"))
    cb3 = create_box("cb_3", (-1.8, 0.8, 1.48), (0.09, 0.25, 0.36), mat_hr, bevel=0.008)
    cb3_b = create_box("cb_3b", (-1.75, 0.8, 1.58), (0.01, 0.23, 0.08), mat_screen((0.95, 0.95, 0.95, 1.0), 1.5, "HR_Banner"))
    join_as_named_object([cb1, cb1_b, cb2, cb2_b, cb3, cb3_b], "Cereal_Box")

    # 3. Mayonnaise (Fluted jar, ivory cream, royal blue screw cap, label)
    my_jar = create_cylinder("my_j", (-1.8, 0.3, 1.44), 0.075, 0.18, get_material("Mayo_Cream", base_color=(0.96, 0.95, 0.88, 1.0), roughness=0.25, coat_weight=0.3))
    my_cap = create_cylinder("my_c", (-1.8, 0.3, 1.54), 0.078, 0.035, get_material("Royal_Blue_Cap", base_color=(0.06, 0.25, 0.85, 1.0), roughness=0.3))
    my_lbl = create_cylinder("my_l", (-1.8, 0.3, 1.44), 0.076, 0.11, get_material("Mayo_Label", base_color=(0.95, 0.85, 0.15, 1.0), roughness=0.4))
    join_as_named_object([my_jar, my_cap, my_lbl], "Mayonnaise")

    # 4. Table_Cream (Tetra Brik carton with top folded ears and red brand band)
    tc_brik = create_box("tc_b", (-1.8, -0.2, 1.43), (0.08, 0.15, 0.16), mat_porcelain(), bevel=0.006)
    tc_band = create_box("tc_bd", (-1.8, -0.2, 1.43), (0.082, 0.152, 0.06), mat_screen((0.85, 0.08, 0.10, 1.0), 1.0, "MediaCrema_Red"))
    tc_cap = create_cylinder("tc_c", (-1.8, -0.2, 1.52), 0.02, 0.02, mat_porcelain())
    join_as_named_object([tc_brik, tc_band, tc_cap], "Table_Cream")

    # 5. Milk_Carton (Tall gable-top carton with peaked roof and cap)
    mc_body = create_box("mc_b", (-1.8, -0.7, 1.46), (0.11, 0.11, 0.24), get_material("Milk_Blue", base_color=(0.15, 0.50, 0.95, 1.0), roughness=0.4), bevel=0.006)
    mc_gable = create_box("mc_g", (-1.8, -0.7, 1.60), (0.11, 0.07, 0.07), mat_porcelain(), rotation=(0, 0, math.radians(45)))
    mc_cap = create_cylinder("mc_c", (-1.77, -0.68, 1.62), 0.016, 0.02, mat_porcelain(), rotation=(math.radians(45), 0, 0))
    join_as_named_object([mc_body, mc_gable, mc_cap], "Milk_Carton")

    # 6. Egg_Carton (Open pulp carton with 6 individual eggs)
    ec_tray = create_box("ec_tr", (-1.8, -1.3, 1.40), (0.26, 0.38, 0.06), get_material("Egg_Pulp", base_color=(0.76, 0.70, 0.60, 1.0), roughness=0.9), bevel=0.01)
    egg_parts = [ec_tray]
    for ex in [-0.07, 0.07]:
        for ey in [-0.12, 0, 0.12]:
            eg = create_sphere(f"eg_{ex}_{ey}", (-1.8 + ex, -1.3 + ey, 1.43), 0.032, get_material("Egg_Shell", base_color=(0.88, 0.72, 0.55, 1.0), roughness=0.55), scale=(0.95, 0.95, 1.25))
            egg_parts.append(eg)
    join_as_named_object(egg_parts, "Egg_Carton")

    # 7. Canned_Tuna (Low aluminum can with pull-tab ring and label)
    tu_can = create_cylinder("tu_c", (-1.8, 1.4, 1.02), 0.065, 0.055, mat_steel())
    tu_lbl = create_cylinder("tu_l", (-1.8, 1.4, 1.02), 0.066, 0.04, get_material("Tuna_Label", base_color=(0.08, 0.35, 0.85, 1.0), roughness=0.4))
    tu_ring = create_torus("tu_r", (-1.8, 1.4, 1.05), 0.018, 0.003, mat_chrome())
    join_as_named_object([tu_can, tu_lbl, tu_ring], "Canned_Tuna")

    # 8. Sliced_Bread (Loaf with marked slices and plastic tie clip)
    br_loaf = create_box("br_lf", (-1.8, 0.8, 1.04), (0.15, 0.36, 0.15), get_material("Loaf_Bread", base_color=(0.82, 0.58, 0.30, 1.0), roughness=0.85), bevel=0.02)
    br_tie = create_torus("br_te", (-1.8, 1.0, 1.04), 0.035, 0.008, mat_screen((0.1, 0.4, 0.9, 1.0), 1.0, "Tie_Clip"))
    join_as_named_object([br_loaf, br_tie], "Sliced_Bread")

    # 9. Ketchup (Curved red bottle, long neck, white flip-top cap)
    kt_body = create_cylinder("kt_b", (-1.8, 0.2, 1.04), 0.052, 0.18, get_material("Ketchup_Bottle", base_color=(0.85, 0.08, 0.06, 1.0), roughness=0.22, coat_weight=0.4))
    kt_neck = create_cylinder("kt_n", (-1.8, 0.2, 1.15), 0.025, 0.07, get_material("Ketchup_Bottle", base_color=(0.85, 0.08, 0.06, 1.0), roughness=0.22))
    kt_cap = create_cylinder("kt_c", (-1.8, 0.2, 1.20), 0.028, 0.035, mat_porcelain())
    join_as_named_object([kt_body, kt_neck, kt_cap], "Ketchup")

    # 10. Cooking_Oil (Golden translucent bottle with molded handle and yellow cap)
    ol_body = create_cylinder("ol_b", (-1.8, -0.4, 1.07), 0.06, 0.24, get_material("Oil_Liquid", base_color=(0.95, 0.78, 0.15, 1.0), roughness=0.15, transmission=0.8, ior=1.47))
    ol_cap = create_cylinder("ol_c", (-1.8, -0.4, 1.21), 0.028, 0.035, get_material("Oil_Cap_Yellow", base_color=(0.95, 0.85, 0.05, 1.0), roughness=0.3))
    ol_hnd = create_torus("ol_h", (-1.74, -0.4, 1.07), 0.045, 0.012, get_material("Oil_Liquid", base_color=(0.95, 0.78, 0.15, 1.0), roughness=0.15, transmission=0.8), rotation=(0, math.radians(90), 0))
    join_as_named_object([ol_body, ol_cap, ol_hnd], "Cooking_Oil")

    # 11. Checkout_Counter (L-shaped counter with conveyor belt & steel rub rails)
    co_base = create_box("co_b", (2.0, 0, 0.44), (1.4, 3.8, 0.88), mat_steel())
    co_belt = create_box("co_bl", (1.9, -0.3, 0.89), (0.75, 2.6, 0.04), get_material("Rubber_Belt", base_color=(0.14, 0.14, 0.15, 1.0), roughness=0.7))
    co_rail_l = create_cylinder("co_rl", (1.5, -0.3, 0.94), 0.02, 2.7, mat_chrome(), rotation=(math.radians(90), 0, 0))
    co_rail_r = create_cylinder("co_rr", (2.3, -0.3, 0.94), 0.02, 2.7, mat_chrome(), rotation=(math.radians(90), 0, 0))
    join_as_named_object([co_base, co_belt, co_rail_l, co_rail_r], "Checkout_Counter")

    # 12. Cash_Register (Drawer, swivel mount, tilted touchscreen POS monitor)
    cr_drawer = create_box("cr_d", (2.0, 1.2, 0.94), (0.46, 0.46, 0.10), mat_steel())
    cr_pole = create_cylinder("cr_p", (2.0, 1.35, 1.08), 0.03, 0.20, mat_steel())
    cr_screen = create_box("cr_sc", (2.0, 1.30, 1.26), (0.36, 0.03, 0.25), mat_steel(), rotation=(math.radians(-20), 0, 0))
    cr_disp = create_box("cr_dp", (2.0, 1.28, 1.26), (0.33, 0.008, 0.22), mat_screen((0.1, 0.85, 0.4, 1.0), 3.0, "POS_Checkout_UI"), rotation=(math.radians(-20), 0, 0))
    cr_prt = create_box("cr_pr", (1.75, 1.35, 0.98), (0.14, 0.18, 0.10), get_material("Printer_Black", base_color=(0.1, 0.1, 0.12, 1.0), roughness=0.5))
    join_as_named_object([cr_drawer, cr_pole, cr_screen, cr_disp, cr_prt], "Cash_Register")

    # 13. Barcode_Scanner (Desktop cradle with handheld laser gun)
    bs_base = create_cylinder("bs_b", (2.35, 0.7, 0.92), 0.07, 0.04, mat_steel())
    bs_gun = create_box("bs_g", (2.35, 0.7, 1.04), (0.08, 0.18, 0.15), get_material("Scanner_Grey", base_color=(0.2, 0.22, 0.25, 1.0), roughness=0.4), bevel=0.01)
    bs_laser = create_box("bs_l", (2.35, 0.60, 1.08), (0.05, 0.01, 0.04), mat_screen((1.0, 0.1, 0.1, 1.0), 3.5, "Laser_Window"))
    join_as_named_object([bs_base, bs_gun, bs_laser], "Barcode_Scanner")

    # 14. Card_Reader (PIN Pad terminal on stand)
    crd_stand = create_cylinder("crd_st", (1.55, 0.8, 0.94), 0.02, 0.12, mat_steel())
    crd_term = create_box("crd_t", (1.55, 0.8, 1.04), (0.13, 0.22, 0.07), mat_steel(), bevel=0.008, rotation=(math.radians(25), 0, 0))
    crd_disp = create_box("crd_d", (1.55, 0.84, 1.08), (0.10, 0.08, 0.008), mat_screen((0.15, 0.95, 0.3, 1.0), 2.5, "EMV_Screen"), rotation=(math.radians(25), 0, 0))
    crd_slot = create_box("crd_sl", (1.55, 0.70, 0.99), (0.09, 0.02, 0.006), get_material("Slot_Black", base_color=(0.05, 0.05, 0.05, 1.0), roughness=0.6))
    join_as_named_object([crd_stand, crd_term, crd_disp, crd_slot], "Card_Reader")

    # 15. Shopping_Cart (Wire basket, child seat flap, tubular handlebar, wheels)
    sc_chassis = create_box("sc_ch", (2.0, -1.4, 0.22), (0.65, 0.95, 0.12), mat_chrome())
    sc_basket = create_box("sc_bk", (2.0, -1.4, 0.65), (0.68, 0.95, 0.48), mat_steel(), bevel=0.02)
    sc_seat = create_box("sc_st", (2.0, -1.0, 0.62), (0.45, 0.22, 0.03), get_material("Seat_Red", base_color=(0.88, 0.12, 0.12, 1.0), roughness=0.5))
    sc_handle = create_cylinder("sc_h", (2.0, -0.85, 0.92), 0.018, 0.65, get_material("Handle_Red", base_color=(0.88, 0.12, 0.12, 1.0), roughness=0.4), rotation=(0, math.radians(90), 0))
    wh_parts = [sc_chassis, sc_basket, sc_seat, sc_handle]
    for wx, wy in [(-0.3, -0.4), (0.3, -0.4), (-0.3, 0.4), (0.3, 0.4)]:
        wh = create_cylinder(f"sc_w_{wx}_{wy}", (2.0 + wx, -1.4 + wy, 0.10), 0.055, 0.035, mat_steel(), rotation=(math.radians(90), 0, 0))
        wh_parts.append(wh)
    join_as_named_object(wh_parts, "Shopping_Cart")

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "supermarket.glb"))

# ==============================================================================
# WORLD 3: RESTAURANT.GLB (Fine Dining Bistro Diorama)
# ==============================================================================
def build_restaurant():
    reset_scene()
    print("Building World: Gourmet Restaurant...")

    build_diorama_room(
        "Restaurant", 
        floor_size=(9.0, 9.0), 
        wall_height=3.4, 
        floor_mat=mat_dark_walnut(),
        wall_mat=get_material("Rest_Wainscot", base_color=(0.18, 0.10, 0.08, 1.0), roughness=0.4),
        baseboard_mat=mat_gold(),
        has_window=True
    )

    # Credenza / Buffet Bar Counter on side
    bar_b = create_box("bar_b", (-2.6, 0, 0.45), (1.1, 2.6, 0.9), mat_dark_walnut())
    bar_t = create_box("bar_t", (-2.6, 0, 0.93), (1.15, 2.7, 0.06), mat_black_marble())
    join_as_named_object([bar_b, bar_t], "Bar_Credenza")

    # 1. Dining_Table (Draped tablecloth, red runner, upholstered dining chairs)
    tbl_base = create_cylinder("tbl_b", (0.5, 0, 0.04), 0.48, 0.08, mat_dark_walnut())
    tbl_col = create_cylinder("tbl_c", (0.5, 0, 0.40), 0.09, 0.72, mat_dark_walnut())
    tbl_top = create_cylinder("tbl_t", (0.5, 0, 0.76), 0.92, 0.04, mat_porcelain())
    tbl_cloth = create_cylinder("tbl_cl", (0.5, 0, 0.52), 0.90, 0.48, get_material("Linen_White", base_color=(0.96, 0.96, 0.96, 1.0), roughness=0.85))
    tbl_runner = create_box("tbl_rn", (0.5, 0, 0.785), (0.42, 1.84, 0.005), mat_velvet_red())
    
    # Chairs
    chr1_s = create_box("ch1_s", (0.5, -1.2, 0.46), (0.48, 0.48, 0.08), mat_velvet_red())
    chr1_b = create_box("ch1_b", (0.5, -1.4, 0.85), (0.48, 0.08, 0.70), mat_velvet_red())
    chr2_s = create_box("ch2_s", (0.5, 1.2, 0.46), (0.48, 0.48, 0.08), mat_velvet_red())
    chr2_b = create_box("ch2_b", (0.5, 1.4, 0.85), (0.48, 0.08, 0.70), mat_velvet_red())
    join_as_named_object([tbl_base, tbl_col, tbl_top, tbl_cloth, tbl_runner, chr1_s, chr1_b, chr2_s, chr2_b], "Dining_Table")

    # 2. Main_Course (Porcelain plate, seared ribeye steak, asparagus, puree)
    pl_plate = create_cylinder("pl_p", (0.5, 0, 0.80), 0.24, 0.025, mat_porcelain())
    pl_rim = create_torus("pl_r", (0.5, 0, 0.81), 0.23, 0.008, mat_gold())
    pl_steak = create_box("pl_st", (0.46, -0.02, 0.825), (0.16, 0.12, 0.038), get_material("Steak_Seared", base_color=(0.35, 0.18, 0.12, 1.0), roughness=0.35), bevel=0.012)
    pl_grill1 = create_box("pl_g1", (0.46, -0.02, 0.845), (0.14, 0.01, 0.004), get_material("Char_Marks", base_color=(0.10, 0.05, 0.02, 1.0), roughness=0.5))
    pl_puree = create_sphere("pl_pu", (0.58, 0.06, 0.825), 0.045, get_material("Golden_Puree", base_color=(0.95, 0.88, 0.50, 1.0), roughness=0.5), scale=(1.2, 1.0, 0.5))
    pl_asp1 = create_cylinder("pl_as1", (0.46, 0.08, 0.825), 0.008, 0.14, get_material("Asparagus_Grn", base_color=(0.18, 0.55, 0.12, 1.0), roughness=0.4), rotation=(0, math.radians(90), 0))
    pl_asp2 = create_cylinder("pl_as2", (0.46, 0.10, 0.825), 0.008, 0.14, get_material("Asparagus_Grn", base_color=(0.18, 0.55, 0.12, 1.0), roughness=0.4), rotation=(0, math.radians(90), 0))
    join_as_named_object([pl_plate, pl_rim, pl_steak, pl_grill1, pl_puree, pl_asp1, pl_asp2], "Main_Course")

    # 3. Cutlery: Fork, Knife, Spoon (With 4 distinct tines, sharp blade, concave bowl)
    fk_handle = create_cylinder("fk_h", (0.15, 0, 0.795), 0.008, 0.20, mat_chrome(), rotation=(math.radians(90), 0, 0))
    fk_t1 = create_cylinder("fk_t1", (0.138, 0.12, 0.795), 0.002, 0.06, mat_chrome(), rotation=(math.radians(90), 0, 0))
    fk_t2 = create_cylinder("fk_t2", (0.146, 0.12, 0.795), 0.002, 0.06, mat_chrome(), rotation=(math.radians(90), 0, 0))
    fk_t3 = create_cylinder("fk_t3", (0.154, 0.12, 0.795), 0.002, 0.06, mat_chrome(), rotation=(math.radians(90), 0, 0))
    fk_t4 = create_cylinder("fk_t4", (0.162, 0.12, 0.795), 0.002, 0.06, mat_chrome(), rotation=(math.radians(90), 0, 0))
    join_as_named_object([fk_handle, fk_t1, fk_t2, fk_t3, fk_t4], "Fork")

    kn_handle = create_cylinder("kn_h", (0.85, 0, 0.795), 0.009, 0.18, mat_dark_walnut(), rotation=(math.radians(90), 0, 0))
    kn_blade = create_box("kn_b", (0.85, 0.12, 0.798), (0.004, 0.10, 0.024), mat_chrome())
    join_as_named_object([kn_handle, kn_blade], "Knife")

    sp_handle = create_cylinder("sp_h", (0.94, 0, 0.795), 0.008, 0.18, mat_chrome(), rotation=(math.radians(90), 0, 0))
    sp_bowl = create_sphere("sp_b", (0.94, 0.11, 0.795), 0.026, mat_chrome(), scale=(0.85, 1.4, 0.4))
    join_as_named_object([sp_handle, sp_bowl], "Spoon")

    # 4. Wine_Glass (Stem, circular base, crystal chalice, ruby wine with meniscus)
    wg_base = create_cylinder("wg_b", (0.75, 0.32, 0.795), 0.05, 0.008, mat_glass())
    wg_stem = create_cylinder("wg_s", (0.75, 0.32, 0.88), 0.006, 0.16, mat_glass())
    wg_bowl = create_sphere("wg_bw", (0.75, 0.32, 0.99), 0.055, mat_glass(), scale=(1.0, 1.0, 1.4))
    wg_wine = create_sphere("wg_wn", (0.75, 0.32, 0.97), 0.048, get_material("Ruby_Wine", base_color=(0.48, 0.02, 0.08, 1.0), roughness=0.08, transmission=0.82, ior=1.36), scale=(0.95, 0.95, 1.0))
    join_as_named_object([wg_base, wg_stem, wg_bowl, wg_wine], "Wine_Glass")

    # 5. Napkin (Standing pyramid fold with gold ring)
    np_pyramid = create_cylinder("np_p", (0.05, 0, 0.85), 0.08, 0.14, get_material("Napkin_Linen", base_color=(0.95, 0.95, 0.95, 1.0), roughness=0.8), vertices=4, rotation=(0, 0, math.radians(45)))
    np_ring = create_torus("np_r", (0.05, 0, 0.80), 0.045, 0.008, mat_gold())
    join_as_named_object([np_pyramid, np_ring], "Napkin")

    # 6. Menu (Leather booklet with gold corners and parchment pages)
    mn_cover = create_box("mn_c", (0.32, 0.42, 0.80), (0.22, 0.30, 0.02), get_material("Leather_Burgundy", base_color=(0.28, 0.06, 0.08, 1.0), roughness=0.5), bevel=0.006)
    mn_gold1 = create_box("mn_g1", (0.22, 0.55, 0.812), (0.04, 0.04, 0.004), mat_gold())
    mn_gold2 = create_box("mn_g2", (0.42, 0.55, 0.812), (0.04, 0.04, 0.004), mat_gold())
    mn_page = create_box("mn_pg", (0.32, 0.42, 0.813), (0.18, 0.24, 0.004), get_material("Parchment_Cream", base_color=(0.95, 0.92, 0.85, 1.0), roughness=0.7))
    join_as_named_object([mn_cover, mn_gold1, mn_gold2, mn_page], "Menu")

    # 7. Salt_Pepper_Shakers (Glass shakers, fluted facets, chrome perforated caps)
    shk_base = create_box("shk_bs", (0.5, 0.36, 0.795), (0.16, 0.09, 0.015), mat_dark_walnut())
    s_jar = create_cylinder("s_j", (0.45, 0.36, 0.84), 0.026, 0.08, mat_glass(), vertices=8)
    s_cap = create_cylinder("s_c", (0.45, 0.36, 0.89), 0.028, 0.025, mat_chrome())
    p_jar = create_cylinder("p_j", (0.55, 0.36, 0.84), 0.026, 0.08, mat_glass(), vertices=8)
    p_cap = create_cylinder("p_c", (0.55, 0.36, 0.89), 0.028, 0.025, mat_steel())
    join_as_named_object([shk_base, s_jar, s_cap, p_jar, p_cap], "Salt_Pepper_Shakers")

    # 8. Olive_Oil (Antique green cruet bottle with stainless steel pour spout)
    oo_btl = create_cylinder("oo_b", (0.5, 0.50, 0.86), 0.042, 0.16, get_material("Olive_Glass", base_color=(0.18, 0.35, 0.12, 1.0), roughness=0.15, transmission=0.82))
    oo_oil = create_cylinder("oo_o", (0.5, 0.50, 0.84), 0.038, 0.12, get_material("EVOO_Liquid", base_color=(0.65, 0.75, 0.12, 1.0), roughness=0.15, transmission=0.7))
    oo_neck = create_cylinder("oo_n", (0.5, 0.50, 0.97), 0.016, 0.07, mat_glass())
    oo_spout = create_cylinder("oo_sp", (0.5, 0.50, 1.03), 0.007, 0.06, mat_chrome(), rotation=(0, math.radians(15), 0))
    join_as_named_object([oo_btl, oo_oil, oo_neck, oo_spout], "Olive_Oil")

    # 9. Espresso_Machine (Dual-group commercial machine, steam wands, cups, gauges)
    em_body = create_box("em_b", (-2.6, 0, 1.25), (0.75, 1.05, 0.58), mat_steel())
    em_gauge = create_cylinder("em_gg", (-2.22, 0, 1.38), 0.035, 0.02, mat_gold(), rotation=(0, math.radians(90), 0))
    em_group1 = create_cylinder("em_g1", (-2.24, -0.22, 1.10), 0.045, 0.08, mat_chrome())
    em_handle1 = create_cylinder("em_h1", (-2.06, -0.22, 1.10), 0.015, 0.18, mat_dark_walnut(), rotation=(0, math.radians(90), 0))
    em_group2 = create_cylinder("em_g2", (-2.24, 0.22, 1.10), 0.045, 0.08, mat_chrome())
    em_handle2 = create_cylinder("em_h2", (-2.06, 0.22, 1.10), 0.015, 0.18, mat_dark_walnut(), rotation=(0, math.radians(90), 0))
    em_wand = create_cylinder("em_wd", (-2.24, 0.42, 1.12), 0.008, 0.20, mat_chrome(), rotation=(0, math.radians(25), 0))
    cup1 = create_cylinder("em_c1", (-2.6, -0.20, 1.58), 0.04, 0.05, mat_porcelain())
    cup2 = create_cylinder("em_c2", (-2.6, 0.20, 1.58), 0.04, 0.05, mat_porcelain())
    join_as_named_object([em_body, em_gauge, em_group1, em_handle1, em_group2, em_handle2, em_wand, cup1, cup2], "Espresso_Machine")

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "restaurant.glb"))

# ==============================================================================
# WORLD 4: HOTEL.GLB (5-Star Luxury Lobby & Suite Diorama)
# ==============================================================================
def build_hotel():
    reset_scene()
    print("Building World: Grand Luxury Hotel...")

    build_diorama_room(
        "Hotel", 
        floor_size=(10.0, 10.0), 
        wall_height=3.6, 
        floor_mat=get_material("Crema_Marfil", base_color=(0.94, 0.92, 0.88, 1.0), roughness=0.12, coat_weight=0.5),
        wall_mat=mat_dark_walnut(),
        baseboard_mat=mat_gold(),
        has_window=False
    )

    # 1. Reception_Desk (Curved black marble, gold veining, warm underglow LED)
    rd_base = create_box("rd_b", (0, 2.8, 0.55), (4.0, 1.1, 1.1), mat_black_marble(), bevel=0.03)
    rd_led = create_box("rd_ld", (0, 2.24, 0.04), (3.9, 0.02, 0.04), mat_screen((1.0, 0.85, 0.4, 1.0), 3.5, "Desk_Warm_LED"))
    rd_top = create_box("rd_t", (0, 2.8, 1.13), (4.1, 1.2, 0.06), mat_gold())
    join_as_named_object([rd_base, rd_led, rd_top], "Reception_Desk")

    # 2. Bellhop_Bell (Stepped base, polished gold dome, spring pin)
    bb_base = create_cylinder("bb_b", (0.7, 2.4, 1.18), 0.065, 0.025, mat_black_marble())
    bb_dome = create_sphere("bb_d", (0.7, 2.4, 1.20), 0.052, mat_gold(), scale=(1.0, 1.0, 0.65))
    bb_pin = create_cylinder("bb_p", (0.7, 2.4, 1.24), 0.009, 0.035, mat_chrome())
    join_as_named_object([bb_base, bb_dome, bb_pin], "Bellhop_Bell")

    # 3. Room_Keycard (Gold & pearl-white smart card with microchip)
    kc_card = create_box("kc_c", (-0.5, 2.4, 1.175), (0.10, 0.16, 0.006), mat_porcelain(), bevel=0.004)
    kc_chip = create_box("kc_ch", (-0.5, 2.42, 1.182), (0.032, 0.028, 0.002), mat_gold())
    kc_stripe = create_box("kc_st", (-0.5, 2.34, 1.182), (0.09, 0.02, 0.002), mat_dark_walnut())
    join_as_named_object([kc_card, kc_chip, kc_stripe], "Room_Keycard")

    # 4. Passport (Navy blue leather booklet with gold crest)
    pp_cover = create_box("pp_c", (-0.85, 2.4, 1.175), (0.14, 0.19, 0.018), get_material("Passport_Navy", base_color=(0.06, 0.12, 0.28, 1.0), roughness=0.55), bevel=0.006)
    pp_crest = create_box("pp_cr", (-0.85, 2.4, 1.186), (0.07, 0.08, 0.003), mat_gold())
    join_as_named_object([pp_cover, pp_crest], "Passport")

    # 5. Luggage_Cart (Brass birdcage trolley with red carpet & rubber bumper)
    lc_base = create_box("lc_b", (-2.8, 0.8, 0.14), (0.95, 1.55, 0.10), mat_velvet_red(), bevel=0.015)
    lc_bumper = create_box("lc_bm", (-2.8, 0.8, 0.12), (0.99, 1.59, 0.04), get_material("Bumper_Black", base_color=(0.08, 0.08, 0.08, 1.0), roughness=0.6))
    lc_arch1 = create_cylinder("lc_a1", (-2.8, 0.8, 1.10), 0.025, 1.8, mat_gold())
    lc_arch_top = create_torus("lc_at", (-2.8, 0.8, 2.00), 0.42, 0.025, mat_gold(), rotation=(0, math.radians(90), 0))
    wh_parts = [lc_base, lc_bumper, lc_arch1, lc_arch_top]
    for lx, ly in [(-0.4, -0.6), (0.4, -0.6), (-0.4, 0.6), (0.4, 0.6)]:
        w = create_cylinder(f"lc_w_{lx}_{ly}", (-2.8 + lx, 0.8 + ly, 0.08), 0.06, 0.04, mat_gold(), rotation=(math.radians(90), 0, 0))
        wh_parts.append(w)
    join_as_named_object(wh_parts, "Luggage_Cart")

    # 6. Suitcase (Hard-shell spinner luggage, TSA lock, telescoping handle)
    sc_body = create_box("sc_b", (-2.8, 0.8, 0.56), (0.35, 0.65, 0.68), get_material("Polycarb_Grey", base_color=(0.20, 0.22, 0.26, 1.0), roughness=0.3), bevel=0.025)
    sc_zipper = create_box("sc_z", (-2.8, 0.8, 0.56), (0.356, 0.656, 0.02), mat_steel())
    sc_handle = create_cylinder("sc_h", (-2.8, 0.8, 1.05), 0.016, 0.32, mat_steel(), rotation=(0, math.radians(90), 0))
    sc_grip = create_box("sc_gp", (-2.8, 0.8, 1.22), (0.04, 0.22, 0.03), mat_dark_walnut())
    join_as_named_object([sc_body, sc_zipper, sc_handle, sc_grip], "Suitcase")

    # 7. Elevator (Bronze doors, luminous floor indicator screen "FL 14 ▲")
    el_arch = create_box("el_ar", (3.6, 0, 1.7), (0.40, 2.4, 3.4), mat_steel())
    el_door_l = create_box("el_dl", (3.44, -0.52, 1.4), (0.06, 0.95, 2.8), get_material("Brushed_Bronze", base_color=(0.55, 0.42, 0.32, 1.0), metallic=0.9, roughness=0.25))
    el_door_r = create_box("el_dr", (3.44, 0.52, 1.4), (0.06, 0.95, 2.8), get_material("Brushed_Bronze", base_color=(0.55, 0.42, 0.32, 1.0), metallic=0.9, roughness=0.25))
    el_disp = create_box("el_dp", (3.42, 0, 3.0), (0.02, 0.55, 0.22), mat_screen((1.0, 0.75, 0.15, 1.0), 3.5, "Elevator_Display"))
    join_as_named_object([el_arch, el_door_l, el_door_r, el_disp], "Elevator")

    # 8. Safe_Box (Steel safe, heavy door, keypad, 3-spoke turn wheel)
    sf_body = create_box("sf_b", (-3.2, 2.8, 0.45), (0.55, 0.55, 0.50), mat_steel(), bevel=0.015)
    sf_door = create_box("sf_d", (-2.91, 2.8, 0.45), (0.04, 0.46, 0.42), mat_steel())
    sf_keypad = create_box("sf_kp", (-2.88, 2.72, 0.45), (0.02, 0.12, 0.16), get_material("Safe_Keypad", base_color=(0.08, 0.08, 0.08, 1.0), roughness=0.6))
    sf_wheel = create_torus("sf_wh", (-2.88, 2.88, 0.45), 0.055, 0.012, mat_chrome(), rotation=(0, math.radians(90), 0))
    join_as_named_object([sf_body, sf_door, sf_keypad, sf_wheel], "Safe_Box")

    # 9. King_Bed (High tufted headboard, mattress, duvet, folded runner, 4 pillows)
    kb_frame = create_box("kb_fr", (0, -2.5, 0.25), (2.4, 2.6, 0.45), mat_dark_walnut())
    kb_headboard = create_box("kb_hb", (0, -3.75, 1.2), (2.5, 0.18, 1.8), mat_velvet_red(), bevel=0.04)
    kb_mat = create_box("kb_mt", (0, -2.4, 0.60), (2.2, 2.4, 0.38), mat_porcelain(), bevel=0.04)
    kb_runner = create_box("kb_rn", (0, -1.5, 0.80), (2.22, 0.55, 0.02), mat_velvet_red())
    kb_p1 = create_box("kb_p1", (-0.6, -3.2, 0.85), (0.70, 0.45, 0.18), mat_porcelain(), bevel=0.035)
    kb_p2 = create_box("kb_p2", (0.6, -3.2, 0.85), (0.70, 0.45, 0.18), mat_porcelain(), bevel=0.035)
    kb_p3 = create_box("kb_p3", (-0.6, -3.0, 0.90), (0.65, 0.40, 0.16), mat_porcelain(), bevel=0.035)
    kb_p4 = create_box("kb_p4", (0.6, -3.0, 0.90), (0.65, 0.40, 0.16), mat_porcelain(), bevel=0.035)
    join_as_named_object([kb_frame, kb_headboard, kb_mat, kb_runner, kb_p1, kb_p2, kb_p3, kb_p4], "King_Bed")

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "hotel.glb"))

# ==============================================================================
# WORLD 5: DATING.GLB (Night Bistro Terrace & Romantic Candelabra)
# ==============================================================================
def build_dating():
    reset_scene()
    print("Building World: Romantic Terrace Date...")

    build_diorama_room(
        "Dating", 
        floor_size=(9.0, 9.0), 
        wall_height=2.8, 
        floor_mat=get_material("Terrace_Cobblestone", base_color=(0.28, 0.28, 0.30, 1.0), roughness=0.55),
        wall_mat=get_material("Night_Terrace_Wall", base_color=(0.18, 0.20, 0.24, 1.0), roughness=0.7),
        baseboard_mat=mat_dark_walnut(),
        has_window=False
    )

    # Terrace Balustrade Railing
    bal_rail = create_box("bal_rl", (0, -4.4, 0.95), (9.0, 0.12, 0.10), mat_steel())
    bal_spindles = [bal_rail]
    for bx in range(-40, 41, 10):
        sp = create_cylinder(f"bal_sp_{bx}", (bx/10, -4.4, 0.45), 0.025, 0.90, mat_steel())
        bal_spindles.append(sp)
    join_as_named_object(bal_spindles, "Terrace_Railing")

    # 1. Bistro_Table (Cast iron pedestal, round Carrera marble top, bistro chairs)
    bt_base = create_torus("bt_bs", (0, 0, 0.06), 0.38, 0.035, mat_steel())
    bt_pole = create_cylinder("bt_pl", (0, 0, 0.38), 0.045, 0.72, mat_steel())
    bt_top = create_cylinder("bt_tp", (0, 0, 0.76), 0.68, 0.045, mat_porcelain())
    bt_rim = create_torus("bt_rm", (0, 0, 0.76), 0.68, 0.012, mat_gold())
    # 2 Bistro chairs with curved backrests
    ch1_s = create_cylinder("ch1_s", (0, -0.9, 0.45), 0.24, 0.04, mat_dark_walnut())
    ch1_b = create_torus("ch1_b", (0, -1.1, 0.80), 0.22, 0.02, mat_steel(), rotation=(math.radians(90), 0, 0))
    ch2_s = create_cylinder("ch2_s", (0, 0.9, 0.45), 0.24, 0.04, mat_dark_walnut())
    ch2_b = create_torus("ch2_b", (0, 1.1, 0.80), 0.22, 0.02, mat_steel(), rotation=(math.radians(90), 0, 0))
    join_as_named_object([bt_base, bt_pole, bt_top, bt_rim, ch1_s, ch1_b, ch2_s, ch2_b], "Bistro_Table")

    # 2. Candle (3-arm golden candelabrum, beeswax candles, warm flames)
    cd_base = create_cylinder("cd_b", (0, 0, 0.79), 0.065, 0.025, mat_gold())
    cd_stem = create_cylinder("cd_s", (0, 0, 0.92), 0.015, 0.24, mat_gold())
    cd_parts = [cd_base, cd_stem]
    for ox in [-0.08, 0, 0.08]:
        wx = create_cylinder(f"cd_wx_{ox}", (ox, 0, 1.10), 0.014, 0.16, get_material("Beeswax", base_color=(0.96, 0.94, 0.88, 1.0), roughness=0.4))
        fl = create_sphere(f"cd_fl_{ox}", (ox, 0, 1.20), 0.016, mat_screen((1.0, 0.65, 0.10, 1.0), 4.5, "Flame_Emission"), scale=(0.7, 0.7, 1.6))
        cd_parts.extend([wx, fl])
    join_as_named_object(cd_parts, "Candle")

    # 3. Champagne_Bottle (Green glass bottle, golden foil neck, ice bucket with ice cubes)
    cb_bucket = create_cylinder("cb_bkt", (0.36, 0.16, 0.86), 0.12, 0.20, mat_chrome())
    cb_ice = create_cylinder("cb_ice", (0.36, 0.16, 0.94), 0.11, 0.04, mat_glass())
    cb_bottle = create_cylinder("cb_btl", (0.36, 0.16, 1.02), 0.045, 0.30, get_material("Dark_Champ_Glass", base_color=(0.10, 0.28, 0.12, 1.0), roughness=0.1, transmission=0.85), rotation=(0, math.radians(12), 0))
    cb_foil = create_cylinder("cb_fol", (0.38, 0.16, 1.18), 0.022, 0.07, mat_gold(), rotation=(0, math.radians(12), 0))
    join_as_named_object([cb_bucket, cb_ice, cb_bottle, cb_foil], "Champagne_Bottle")

    # 4. Bouquet_of_Roses (Glass vase, water, green stems, 7 blooming red roses)
    bq_vase = create_cylinder("bq_vs", (-0.36, 0.16, 0.86), 0.065, 0.18, mat_glass())
    bq_water = create_cylinder("bq_wt", (-0.36, 0.16, 0.84), 0.060, 0.12, get_material("Vase_Water", base_color=(0.3, 0.7, 0.9, 1.0), roughness=0.05, transmission=0.92))
    bq_parts = [bq_vase, bq_water]
    mat_rose = get_material("Rose_Crimson", base_color=(0.82, 0.04, 0.10, 1.0), roughness=0.55)
    for i, (rx, ry) in enumerate([(-0.04, -0.04), (0.04, -0.04), (-0.04, 0.04), (0.04, 0.04), (0, 0), (0, 0.05), (0, -0.05)]):
        rs = create_sphere(f"bq_r_{i}", (-0.36 + rx, 0.16 + ry, 1.00), 0.038, mat_rose, scale=(1.0, 1.0, 1.2))
        bq_parts.append(rs)
    join_as_named_object(bq_parts, "Bouquet_of_Roses")

    # 5. Violin (Arched body, f-holes, fingerboard, bridge, 4 tuning pegs, violin bow)
    vn_body = create_cylinder("vn_b", (-1.4, -0.6, 0.75), 0.18, 0.065, get_material("Violin_Maple", base_color=(0.58, 0.32, 0.10, 1.0), roughness=0.22, coat_weight=0.5), scale=(0.75, 1.35, 1.0))
    vn_neck = create_box("vn_nk", (-1.4, -0.25, 0.76), (0.035, 0.38, 0.028), mat_dark_walnut())
    vn_scroll = create_sphere("vn_sc", (-1.4, -0.04, 0.78), 0.032, mat_dark_walnut())
    vn_bridge = create_box("vn_br", (-1.4, -0.62, 0.80), (0.08, 0.012, 0.03), mat_warm_wood())
    vn_bow = create_cylinder("vn_bw", (-1.25, -0.42, 0.78), 0.006, 0.72, mat_steel(), rotation=(math.radians(75), 0, 0))
    join_as_named_object([vn_body, vn_neck, vn_scroll, vn_bridge, vn_bow], "Violin")

    # 6. Ring_Box (Velvet box open at 90 deg, ring bed, gold ring with faceted diamond)
    rb_base = create_box("rb_bs", (0.16, -0.24, 0.795), (0.08, 0.08, 0.04), mat_velvet_red(), bevel=0.008)
    rb_lid = create_box("rb_ld", (0.16, -0.29, 0.85), (0.08, 0.08, 0.02), mat_velvet_red(), bevel=0.008, rotation=(math.radians(-75), 0, 0))
    rb_bed = create_box("rb_bd", (0.16, -0.24, 0.81), (0.07, 0.07, 0.015), mat_porcelain())
    rb_ring = create_torus("rb_rg", (0.16, -0.24, 0.825), 0.016, 0.003, mat_gold(), rotation=(math.radians(90), 0, 0))
    rb_diamond = create_sphere("rb_dm", (0.16, -0.24, 0.842), 0.009, get_material("Faceted_Diamond", base_color=(0.98, 0.99, 1.0, 1.0), roughness=0.01, transmission=0.99, ior=2.42))
    join_as_named_object([rb_base, rb_lid, rb_bed, rb_ring, rb_diamond], "Ring_Box")

    # 7. Chocolate_Fondant (Molten lava cake, powdered sugar, strawberry on plate)
    cf_plate = create_cylinder("cf_p", (-0.16, -0.24, 0.785), 0.13, 0.02, mat_porcelain())
    cf_cake = create_cylinder("cf_ck", (-0.16, -0.24, 0.82), 0.06, 0.05, get_material("Fondant_Choc", base_color=(0.18, 0.10, 0.06, 1.0), roughness=0.35))
    cf_berry = create_sphere("cf_br", (-0.11, -0.21, 0.83), 0.022, mat_velvet_red(), scale=(0.85, 0.85, 1.25))
    join_as_named_object([cf_plate, cf_cake, cf_berry], "Chocolate_Fondant")

    # 8. Wine_List (Slim wine booklet with gold ribbon)
    wl_menu = create_box("wl_m", (0.35, -0.24, 0.79), (0.15, 0.24, 0.018), mat_velvet_red(), bevel=0.005)
    wl_ribbon = create_box("wl_rb", (0.35, -0.24, 0.80), (0.02, 0.26, 0.004), mat_gold())
    join_as_named_object([wl_menu, wl_ribbon], "Wine_List")

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "dating.glb"))

# ==============================================================================
# WORLD 6: GARDEN.GLB (Botanical Garden & Park Diorama)
# ==============================================================================
def build_garden():
    reset_scene()
    print("Building World: Botanical Garden...")

    build_diorama_room(
        "Garden", 
        floor_size=(10.0, 10.0), 
        wall_height=2.6, 
        floor_mat=get_material("Garden_Grass", base_color=(0.16, 0.45, 0.14, 1.0), roughness=0.85),
        wall_mat=get_material("Garden_Trellis", base_color=(0.45, 0.32, 0.20, 1.0), roughness=0.6),
        baseboard_mat=mat_dark_walnut(),
        has_window=False
    )

    # 1. Stone_Fountain (3-tier classical fountain with cascading water pools)
    ft_p1 = create_cylinder("ft_p1", (0, 0, 0.22), 1.6, 0.44, get_material("Limestone", base_color=(0.65, 0.64, 0.62, 1.0), roughness=0.65))
    ft_w1 = create_cylinder("ft_w1", (0, 0, 0.38), 1.48, 0.06, mat_glass())
    ft_ped1 = create_cylinder("ft_pd1", (0, 0, 0.65), 0.36, 0.65, get_material("Limestone", base_color=(0.65, 0.64, 0.62, 1.0), roughness=0.65))
    ft_p2 = create_cylinder("ft_p2", (0, 0, 1.05), 0.95, 0.24, get_material("Limestone", base_color=(0.65, 0.64, 0.62, 1.0), roughness=0.65))
    ft_w2 = create_cylinder("ft_w2", (0, 0, 1.13), 0.85, 0.05, mat_glass())
    ft_ped2 = create_cylinder("ft_pd2", (0, 0, 1.35), 0.22, 0.45, get_material("Limestone", base_color=(0.65, 0.64, 0.62, 1.0), roughness=0.65))
    ft_p3 = create_cylinder("ft_p3", (0, 0, 1.62), 0.50, 0.16, get_material("Limestone", base_color=(0.65, 0.64, 0.62, 1.0), roughness=0.65))
    ft_finial = create_sphere("ft_fn", (0, 0, 1.82), 0.16, mat_gold(), scale=(0.85, 0.85, 1.35))
    join_as_named_object([ft_p1, ft_w1, ft_ped1, ft_p2, ft_w2, ft_ped2, ft_p3, ft_finial], "Stone_Fountain")

    # 2. Watering_Can (Emerald green body, arched handle, long spout, brass rosette)
    wc_body = create_cylinder("wc_b", (2.8, 1.2, 0.26), 0.17, 0.42, get_material("British_Racing_Grn", base_color=(0.08, 0.35, 0.18, 1.0), metallic=0.4, roughness=0.3))
    wc_spout = create_cylinder("wc_s", (3.05, 1.2, 0.40), 0.028, 0.42, get_material("British_Racing_Grn", base_color=(0.08, 0.35, 0.18, 1.0), metallic=0.4, roughness=0.3), rotation=(0, math.radians(-42), 0))
    wc_rose = create_sphere("wc_r", (3.24, 1.2, 0.56), 0.055, mat_gold())
    wc_arch = create_torus("wc_ar", (2.62, 1.2, 0.42), 0.19, 0.02, get_material("British_Racing_Grn", base_color=(0.08, 0.35, 0.18, 1.0), metallic=0.4, roughness=0.3))
    join_as_named_object([wc_body, wc_spout, wc_rose, wc_arch], "Watering_Can")

    # 3. Wheelbarrow (Steel red tub, pneumatic tire with rim, support legs, handles)
    wb_tub = create_box("wb_tb", (2.6, -1.8, 0.52), (0.80, 1.15, 0.38), mat_velvet_red(), bevel=0.035)
    wb_tire = create_cylinder("wb_tr", (2.6, -2.6, 0.24), 0.24, 0.09, get_material("Tire_Black", base_color=(0.10, 0.10, 0.10, 1.0), roughness=0.7), rotation=(0, math.radians(90), 0))
    wb_rim = create_cylinder("wb_rm", (2.6, -2.6, 0.24), 0.14, 0.095, mat_steel(), rotation=(0, math.radians(90), 0))
    wb_h1 = create_cylinder("wb_h1", (2.25, -1.2, 0.45), 0.022, 1.3, mat_warm_wood(), rotation=(math.radians(16), 0, 0))
    wb_h2 = create_cylinder("wb_h2", (2.95, -1.2, 0.45), 0.022, 1.3, mat_warm_wood(), rotation=(math.radians(16), 0, 0))
    join_as_named_object([wb_tub, wb_tire, wb_rim, wb_h1, wb_h2], "Wheelbarrow")

    # 4. Flower_Pot (Terracotta pot, soil, colorful blooming flowers)
    fp_pot = create_cylinder("fp_pt", (-2.4, 1.2, 0.24), 0.24, 0.44, mat_terracotta())
    fp_rim = create_torus("fp_rm", (-2.4, 1.2, 0.44), 0.25, 0.03, mat_terracotta())
    fp_soil = create_cylinder("fp_sl", (-2.4, 1.2, 0.42), 0.22, 0.04, get_material("Dark_Soil", base_color=(0.15, 0.10, 0.06, 1.0), roughness=0.9))
    fp_flw1 = create_sphere("fp_f1", (-2.4, 1.2, 0.58), 0.18, get_material("Petunia_Pink", base_color=(0.95, 0.22, 0.65, 1.0), roughness=0.5))
    fp_flw2 = create_sphere("fp_f2", (-2.32, 1.28, 0.64), 0.14, get_material("Petunia_Yellow", base_color=(0.95, 0.85, 0.10, 1.0), roughness=0.5))
    join_as_named_object([fp_pot, fp_rim, fp_soil, fp_flw1, fp_flw2], "Flower_Pot")

    # 5. Pruning_Shears (Crossing bypass steel blades, center pivot bolt, red handles)
    ps_b1 = create_box("ps_b1", (-1.8, 2.4, 0.05), (0.028, 0.14, 0.008), mat_steel())
    ps_b2 = create_box("ps_b2", (-1.8, 2.4, 0.05), (0.028, 0.14, 0.008), mat_steel(), rotation=(0, 0, math.radians(28)))
    ps_pivot = create_cylinder("ps_pv", (-1.8, 2.36, 0.05), 0.012, 0.02, mat_chrome())
    ps_h1 = create_cylinder("ps_h1", (-1.84, 2.22, 0.05), 0.016, 0.20, mat_velvet_red())
    ps_h2 = create_cylinder("ps_h2", (-1.76, 2.22, 0.05), 0.016, 0.20, mat_velvet_red())
    join_as_named_object([ps_b1, ps_b2, ps_pivot, ps_h1, ps_h2], "Pruning_Shears")

    # 6. Garden_Trowel (Concave steel blade, wooden handle, brass ferrule)
    gt_blade = create_sphere("gt_b", (-2.4, 2.4, 0.07), 0.065, mat_steel(), scale=(0.55, 1.85, 0.35))
    gt_shank = create_cylinder("gt_s", (-2.4, 2.26, 0.07), 0.012, 0.06, mat_chrome(), rotation=(math.radians(90), 0, 0))
    gt_ferrule = create_cylinder("gt_fr", (-2.4, 2.21, 0.07), 0.018, 0.02, mat_gold(), rotation=(math.radians(90), 0, 0))
    gt_handle = create_cylinder("gt_h", (-2.4, 2.11, 0.07), 0.018, 0.18, mat_warm_wood(), rotation=(math.radians(90), 0, 0))
    join_as_named_object([gt_blade, gt_shank, gt_ferrule, gt_handle], "Garden_Trowel")

    # 7. Birdhouse (Cedar post, pitched shingle roof, round hole, perch)
    bh_post = create_cylinder("bh_p", (-3.0, -1.8, 0.85), 0.045, 1.7, mat_dark_walnut())
    bh_box = create_box("bh_bx", (-3.0, -1.8, 1.82), (0.38, 0.38, 0.48), mat_warm_wood())
    bh_roof = create_box("bh_rf", (-3.0, -1.8, 2.12), (0.48, 0.48, 0.08), mat_terracotta(), rotation=(0, math.radians(25), 0))
    bh_perch = create_cylinder("bh_pr", (-2.8, -1.8, 1.76), 0.012, 0.10, mat_dark_walnut(), rotation=(0, math.radians(90), 0))
    join_as_named_object([bh_post, bh_box, bh_roof, bh_perch], "Birdhouse")

    # 8. Picnic_Basket (Wicker weave hamper, dual split lids, gingham cloth lining)
    pb_basket = create_box("pb_bk", (1.4, 2.2, 0.22), (0.45, 0.65, 0.35), get_material("Wicker_Weave", base_color=(0.72, 0.55, 0.35, 1.0), roughness=0.75), bevel=0.035)
    pb_cloth = create_box("pb_cl", (1.4, 2.2, 0.38), (0.47, 0.40, 0.06), get_material("Gingham_Check", base_color=(0.95, 0.95, 0.95, 1.0), roughness=0.8))
    pb_handle = create_torus("pb_h", (1.4, 2.2, 0.46), 0.24, 0.02, mat_dark_walnut())
    join_as_named_object([pb_basket, pb_cloth, pb_handle], "Picnic_Basket")

    # 9. Garden_Lantern (Solar cap, glass panes, glowing filament core)
    gl_base = create_box("gl_b", (-1.4, -2.6, 0.10), (0.26, 0.26, 0.15), mat_steel())
    gl_glass = create_box("gl_gl", (-1.4, -2.6, 0.45), (0.22, 0.22, 0.52), mat_glass())
    gl_light = create_sphere("gl_lt", (-1.4, -2.6, 0.45), 0.07, mat_screen((1.0, 0.80, 0.35, 1.0), 4.0, "Lantern_Filament"))
    gl_cap = create_box("gl_cp", (-1.4, -2.6, 0.74), (0.28, 0.28, 0.09), mat_steel())
    join_as_named_object([gl_base, gl_glass, gl_light, gl_cap], "Garden_Lantern")

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "garden.glb"))

# ==============================================================================
# WORLD 7: SPACE.GLB (Orbital Space Station & Observatory Diorama)
# ==============================================================================
def build_space():
    reset_scene()
    print("Building World: Orbital Space Station...")

    build_diorama_room(
        "Space", 
        floor_size=(10.0, 10.0), 
        wall_height=3.6, 
        floor_mat=get_material("Station_Hex_Floor", base_color=(0.14, 0.16, 0.20, 1.0), metallic=0.75, roughness=0.35),
        wall_mat=mat_steel(),
        baseboard_mat=mat_screen((0.0, 0.8, 1.0, 1.0), 2.0, "Cyan_Glow_Strip"),
        has_window=True
    )

    # 1. Control_Console (Curved ergonomic command desk, 3 holographic tilted screens, joysticks)
    cc_base = create_box("cc_b", (0, 2.8, 0.50), (3.8, 1.3, 0.95), mat_steel(), bevel=0.03)
    cc_s1 = create_box("cc_s1", (-1.0, 2.7, 1.25), (0.80, 0.05, 0.45), mat_screen((0.0, 0.85, 1.0, 1.0), 3.5, "Console_Telemetry"), rotation=(math.radians(-22), 0, 0))
    cc_s2 = create_box("cc_s2", (0, 2.7, 1.28), (0.90, 0.05, 0.50), mat_screen((0.1, 1.0, 0.35, 1.0), 3.5, "Console_Radar"), rotation=(math.radians(-22), 0, 0))
    cc_s3 = create_box("cc_s3", (1.0, 2.7, 1.25), (0.80, 0.05, 0.45), mat_screen((1.0, 0.65, 0.10, 1.0), 3.5, "Console_StarChart"), rotation=(math.radians(-22), 0, 0))
    cc_joy1 = create_cylinder("cc_j1", (-0.5, 2.4, 1.04), 0.015, 0.12, mat_chrome())
    cc_joy2 = create_cylinder("cc_j2", (0.5, 2.4, 1.04), 0.015, 0.12, mat_chrome())
    join_as_named_object([cc_base, cc_s1, cc_s2, cc_s3, cc_joy1, cc_joy2], "Control_Console")

    # 2. Astronaut_Helmet (White composite shell, 24k gold reflective sun visor, spotlights)
    ah_shell = create_sphere("ah_sh", (-1.4, 0, 0.95), 0.25, mat_porcelain())
    ah_ring = create_torus("ah_rg", (-1.4, 0, 0.72), 0.22, 0.03, mat_steel())
    ah_visor = create_sphere("ah_vs", (-1.4, -0.09, 0.95), 0.20, mat_gold(), scale=(1.08, 0.88, 0.98))
    ah_light_l = create_cylinder("ah_ll", (-1.64, 0, 0.95), 0.02, 0.05, mat_screen((1.0, 1.0, 1.0, 1.0), 4.0, "Helmet_Light_L"), rotation=(0, math.radians(90), 0))
    ah_light_r = create_cylinder("ah_lr", (-1.16, 0, 0.95), 0.02, 0.05, mat_screen((1.0, 1.0, 1.0, 1.0), 4.0, "Helmet_Light_R"), rotation=(0, math.radians(90), 0))
    join_as_named_object([ah_shell, ah_ring, ah_visor, ah_light_l, ah_light_r], "Astronaut_Helmet")

    # 3. Oxygen_Tank (Dual PLSS cylinder pack, carbon wrap, valves, pressure meter)
    ot_c1 = create_cylinder("ot_1", (-2.2, 0, 0.58), 0.12, 0.75, mat_porcelain())
    ot_c2 = create_cylinder("ot_2", (-1.9, 0, 0.58), 0.12, 0.75, mat_porcelain())
    ot_stripe1 = create_cylinder("ot_s1", (-2.2, 0, 0.58), 0.122, 0.15, mat_screen((1.0, 0.5, 0.05, 1.0), 1.5, "Tank_Orange"))
    ot_stripe2 = create_cylinder("ot_s2", (-1.9, 0, 0.58), 0.122, 0.15, mat_screen((1.0, 0.5, 0.05, 1.0), 1.5, "Tank_Orange"))
    ot_man = create_box("ot_m", (-2.05, 0, 0.98), (0.42, 0.18, 0.10), mat_steel())
    ot_valve = create_cylinder("ot_v", (-2.05, 0.08, 1.04), 0.025, 0.03, mat_velvet_red())
    ot_gauge = create_cylinder("ot_g", (-2.05, -0.09, 0.98), 0.03, 0.02, mat_chrome(), rotation=(math.radians(90), 0, 0))
    join_as_named_object([ot_c1, ot_c2, ot_stripe1, ot_stripe2, ot_man, ot_valve, ot_gauge], "Oxygen_Tank")

    # 4. Robotic_Arm (Rotating base, articulated links with pistons, 3-finger gripper)
    ra_base = create_cylinder("ra_b", (2.0, 0, 0.14), 0.28, 0.26, mat_steel())
    ra_joint1 = create_sphere("ra_j1", (2.0, 0, 0.38), 0.12, mat_steel())
    ra_link1 = create_cylinder("ra_l1", (2.1, 0, 0.75), 0.065, 0.75, get_material("Industrial_Yellow", base_color=(0.95, 0.80, 0.08, 1.0), roughness=0.35), rotation=(0, math.radians(22), 0))
    ra_joint2 = create_sphere("ra_j2", (2.26, 0, 1.15), 0.10, mat_steel())
    ra_link2 = create_cylinder("ra_l2", (2.42, 0, 1.50), 0.055, 0.75, get_material("Industrial_Yellow", base_color=(0.95, 0.80, 0.08, 1.0), roughness=0.35), rotation=(0, math.radians(-32), 0))
    ra_wrist = create_cylinder("ra_w", (2.60, 0, 1.88), 0.05, 0.10, mat_steel())
    ra_f1 = create_box("ra_f1", (2.60, -0.04, 1.98), (0.02, 0.02, 0.10), mat_steel())
    ra_f2 = create_box("ra_f2", (2.60, 0.04, 1.98), (0.02, 0.02, 0.10), mat_steel())
    join_as_named_object([ra_base, ra_joint1, ra_link1, ra_joint2, ra_link2, ra_wrist, ra_f1, ra_f2], "Robotic_Arm")

    # 5. Space_Telescope (Gold foil insulated tube, primary mirror, solar wings)
    st_tube = create_cylinder("st_t", (0, -2.0, 1.4), 0.32, 1.5, mat_gold(), rotation=(math.radians(35), 0, 0))
    st_lens = create_cylinder("st_l", (0, -1.45, 1.85), 0.30, 0.06, get_material("Mirror_Optic", base_color=(0.1, 0.5, 0.9, 1.0), metallic=0.98, roughness=0.02), rotation=(math.radians(35), 0, 0))
    st_mount = create_cylinder("st_m", (0, -2.0, 0.55), 0.09, 1.1, mat_steel())
    st_wing_l = create_box("st_wl", (-0.95, -2.0, 1.4), (1.1, 0.03, 0.55), get_material("Solar_Blue", base_color=(0.04, 0.10, 0.38, 1.0), metallic=0.9, roughness=0.15))
    st_wing_r = create_box("st_wr", (0.95, -2.0, 1.4), (1.1, 0.03, 0.55), get_material("Solar_Blue", base_color=(0.04, 0.10, 0.38, 1.0), metallic=0.9, roughness=0.15))
    join_as_named_object([st_tube, st_lens, st_mount, st_wing_l, st_wing_r], "Space_Telescope")

    # 6. Hydroponic_Pod (Cylindrical chamber, glass dome, purple grow LED, flourishing crops)
    hp_base = create_cylinder("hp_b", (-2.8, -2.0, 0.22), 0.48, 0.44, mat_steel())
    hp_dome = create_cylinder("hp_d", (-2.8, -2.0, 0.90), 0.45, 0.92, mat_glass())
    hp_light = create_cylinder("hp_lt", (-2.8, -2.0, 1.38), 0.42, 0.06, mat_screen((0.85, 0.05, 0.95, 1.0), 4.5, "Grow_LED_Purple"))
    hp_plant1 = create_sphere("hp_p1", (-2.8, -2.0, 0.65), 0.26, get_material("Bio_Green", base_color=(0.12, 0.78, 0.22, 1.0), roughness=0.5))
    hp_plant2 = create_sphere("hp_p2", (-2.8, -2.0, 0.92), 0.20, get_material("Bio_Green", base_color=(0.12, 0.78, 0.22, 1.0), roughness=0.5))
    join_as_named_object([hp_base, hp_dome, hp_light, hp_plant1, hp_plant2], "Hydroponic_Pod")

    # 7. Airlock_Door (Heavy circular pressure hatch, hazard border, 4-spoke wheel lock)
    ad_frame = create_cylinder("ad_fr", (3.4, 2.5, 1.6), 1.25, 0.30, mat_steel(), rotation=(0, math.radians(90), 0))
    ad_hazard = create_torus("ad_hz", (3.24, 2.5, 1.6), 1.15, 0.04, get_material("Hazard_Yellow", base_color=(0.95, 0.85, 0.05, 1.0), roughness=0.4), rotation=(0, math.radians(90), 0))
    ad_door = create_cylinder("ad_dr", (3.22, 2.5, 1.6), 1.05, 0.15, mat_steel(), rotation=(0, math.radians(90), 0))
    ad_win = create_cylinder("ad_wn", (3.14, 2.5, 1.8), 0.22, 0.04, mat_glass(), rotation=(0, math.radians(90), 0))
    ad_wheel = create_torus("ad_wh", (3.12, 2.5, 1.4), 0.24, 0.035, mat_velvet_red(), rotation=(0, math.radians(90), 0))
    ad_led = create_sphere("ad_ld", (3.14, 2.5, 2.3), 0.045, mat_screen((0.1, 1.0, 0.3, 1.0), 3.5, "Airlock_Status_LED"))
    join_as_named_object([ad_frame, ad_hazard, ad_door, ad_win, ad_wheel, ad_led], "Airlock_Door")

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "space.glb"))

def main():
    build_house()
    build_supermarket()
    build_restaurant()
    build_hotel()
    build_dating()
    build_garden()
    build_space()
    print("ALL 7 AAA WORLDS BUILT AND EXPORTED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
