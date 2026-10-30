import bpy
import mathutils
import math
import os
import sys

script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)

from core import (
    reset_scene, get_material, create_box, create_cylinder, 
    create_sphere, create_torus, join_as_named_object, export_glb,
    place_on_surface, add_bounds_anchor, build_isometric_room,
    mat_chrome, mat_steel, mat_gold, mat_glass, mat_porcelain,
    mat_warm_wood, mat_dark_walnut, mat_parquet, mat_black_marble,
    mat_burgundy_rug, mat_woven_beige, mat_commercial_tile,
    mat_sci_fi_metal, mat_grass_natural, mat_stone_path,
    mat_velvet_red, mat_terracotta, mat_screen
)

OUTPUT_WORLDS_DIR = r"C:\Users\alessandro\Desktop\ENGLISH\assets\models\worlds"

# ==============================================================================
# WORLD 1: HOUSE.GLB
# 4 Quadrants: Northwest Kitchen, Southwest Living, Northeast Study, Southeast Bath
# ==============================================================================
def build_house():
    reset_scene()
    print("Building World 1: House & Kitchen (4 Quadrants AAA Layout)...")
    add_bounds_anchor(radius_x=8.0, radius_y=7.0)

    # 1. Base Room (16m x 14m, North wall at Y=6.0, West wall at X=-7.0, soft beige rug in living area)
    build_isometric_room(
        "House",
        floor_size=(16.0, 14.0),
        floor_mat=mat_warm_wood(),
        wall_mat=get_material("House_WallMat", base_color=(0.92, 0.91, 0.89, 1.0), roughness=0.6),
        baseboard_mat=mat_dark_walnut(),
        north_y=6.0,
        west_x=-7.0,
        wall_height=3.6,
        has_window=True,
        window_pos=(-2.0, 6.0, 2.0),
        window_size=(3.2, 1.8),
        rug_config=(-3.2, -2.0, 4.4, 3.6, mat_woven_beige(), False)
    )

    # --- CUADRANTE NOROESTE (X: -6.5 a -1.0, Y: +1.5 a +5.5): COCINA INTEGRAL ---
    # Kitchen Counter in L along North wall
    kc_base = create_box("kc_b", (-3.8, 4.8, 0.42), (5.2, 0.90, 0.84), mat_dark_walnut())
    kc_top = create_box("kc_t", (-3.8, 4.8, 0.87), (5.3, 0.95, 0.06), mat_black_marble())
    join_as_named_object([kc_base, kc_top], "Kitchen_Counter")

    # Microwave (X=-5.2, Y=+4.8, on counter Z=0.90)
    mw_body = create_box("mw_b", (0, 0, 0.17), (0.60, 0.38, 0.34), mat_steel())
    mw_door = create_box("mw_dr", (-0.08, -0.18, 0.17), (0.38, 0.02, 0.28), get_material("Frame_Black", (0.1, 0.1, 0.1, 1.0), roughness=0.5))
    mw_glass = create_box("mw_gl", (-0.08, -0.185, 0.17), (0.32, 0.01, 0.22), mat_glass())
    mw_handle = create_cylinder("mw_h", (0.14, -0.20, 0.17), 0.012, 0.22, mat_chrome(), rotation=(math.radians(90), 0, 0))
    mw_panel = create_box("mw_p", (0.21, -0.18, 0.17), (0.14, 0.02, 0.28), mat_steel())
    mw_screen = create_box("mw_sc", (0.21, -0.185, 0.24), (0.10, 0.005, 0.05), mat_screen((0.1, 1.0, 0.3, 1.0), 3.0, "LED_Grn"))
    mw_btn1 = create_box("mw_b1", (0.21, -0.185, 0.16), (0.08, 0.005, 0.025), mat_chrome())
    mw_btn2 = create_box("mw_b2", (0.21, -0.185, 0.11), (0.08, 0.005, 0.025), mat_chrome())
    mw = join_as_named_object([mw_body, mw_door, mw_glass, mw_handle, mw_panel, mw_screen, mw_btn1, mw_btn2], "Microwave")
    place_on_surface(mw, -5.2, 4.8, 0.90)

    # Blender (X=-4.1, Y=+4.8, on counter Z=0.90)
    bl_base = create_cylinder("bl_b", (0, 0, 0.10), 0.12, 0.20, mat_steel())
    bl_dial = create_cylinder("bl_d", (0, -0.12, 0.10), 0.03, 0.03, mat_chrome(), rotation=(math.radians(90), 0, 0))
    bl_b1 = create_sphere("bl_b1", (-0.05, -0.11, 0.06), 0.010, mat_screen((1.0, 0.2, 0.2, 1.0), 2.0, "B_Red"))
    bl_b2 = create_sphere("bl_b2", (0.05, -0.11, 0.06), 0.010, mat_screen((0.2, 0.8, 1.0, 1.0), 2.0, "B_Blue"))
    bl_jug = create_cylinder("bl_j", (0, 0, 0.36), 0.11, 0.34, mat_glass(), vertices=8)
    bl_liq = create_cylinder("bl_lq", (0, 0, 0.32), 0.10, 0.24, get_material("Orange_Juice", (0.95, 0.45, 0.05, 1.0), roughness=0.2, transmission=0.4))
    bl_lid = create_cylinder("bl_l", (0, 0, 0.54), 0.12, 0.035, mat_dark_walnut())
    bl_cap = create_cylinder("bl_c", (0, 0, 0.57), 0.04, 0.04, mat_glass())
    bl_handle = create_torus("bl_h", (0.10, 0, 0.36), 0.07, 0.016, mat_dark_walnut(), rotation=(0, math.radians(90), 0))
    bl = join_as_named_object([bl_base, bl_dial, bl_b1, bl_b2, bl_jug, bl_liq, bl_lid, bl_cap, bl_handle], "Blender")
    place_on_surface(bl, -4.1, 4.8, 0.90)

    # Toaster (X=-3.1, Y=+4.8, on counter Z=0.90)
    to_body = create_box("to_b", (0, 0, 0.11), (0.32, 0.20, 0.22), mat_chrome(), bevel=0.015)
    to_slot1 = create_box("to_s1", (0, -0.05, 0.21), (0.22, 0.025, 0.02), mat_dark_walnut())
    to_slot2 = create_box("to_s2", (0, 0.05, 0.21), (0.22, 0.025, 0.02), mat_dark_walnut())
    to_toast1 = create_box("to_t1", (0, -0.05, 0.24), (0.18, 0.02, 0.10), get_material("Toast_Crust", (0.72, 0.48, 0.22, 1.0), roughness=0.85))
    to_toast2 = create_box("to_t2", (0, 0.05, 0.24), (0.18, 0.02, 0.10), get_material("Toast_Crust", (0.72, 0.48, 0.22, 1.0), roughness=0.85))
    to_lever = create_cylinder("to_lv", (-0.17, 0, 0.10), 0.012, 0.06, mat_steel(), rotation=(0, math.radians(90), 0))
    to_dial = create_cylinder("to_dl", (0, -0.11, 0.06), 0.022, 0.018, mat_steel(), rotation=(math.radians(90), 0, 0))
    to = join_as_named_object([to_body, to_slot1, to_slot2, to_toast1, to_toast2, to_lever, to_dial], "Toaster")
    place_on_surface(to, -3.1, 4.8, 0.90)

    # Coffee_Maker (X=-2.1, Y=+4.8, on counter Z=0.90)
    cf_base = create_box("cf_b", (0, 0, 0.04), (0.30, 0.32, 0.08), mat_steel())
    cf_plate = create_cylinder("cf_pl", (0, -0.06, 0.085), 0.09, 0.01, get_material("HotPlate", (0.15, 0.15, 0.15, 1.0), roughness=0.3))
    cf_back = create_box("cf_bk", (0, 0.10, 0.24), (0.26, 0.12, 0.40), mat_steel())
    cf_tank = create_cylinder("cf_tk", (0, 0.10, 0.25), 0.09, 0.34, mat_glass())
    cf_head = create_box("cf_hd", (0, -0.05, 0.42), (0.26, 0.24, 0.08), mat_steel())
    cf_carafe = create_sphere("cf_cr", (0, -0.06, 0.19), 0.095, mat_glass(), scale=(1.0, 1.0, 1.2))
    cf_coffee = create_sphere("cf_co", (0, -0.06, 0.16), 0.082, get_material("Dark_Coffee", (0.12, 0.06, 0.03, 1.0), roughness=0.15, transmission=0.4))
    cf_handle = create_torus("cf_h", (0, -0.16, 0.19), 0.06, 0.014, mat_dark_walnut())
    cf_led = create_sphere("cf_led", (0.12, -0.14, 0.04), 0.012, mat_screen((1.0, 0.1, 0.1, 1.0), 3.0, "LED_Red"))
    cf = join_as_named_object([cf_base, cf_plate, cf_back, cf_tank, cf_head, cf_carafe, cf_coffee, cf_handle, cf_led], "Coffee_Maker")
    place_on_surface(cf, -2.1, 4.8, 0.90)

    # Refrigerator (X=-6.2, Y=+3.2, on floor Z=0)
    rf_body = create_box("rf_b", (0, 0, 1.0), (0.92, 0.82, 2.0), mat_steel(), bevel=0.015)
    rf_dl = create_box("rf_dl", (-0.23, -0.42, 1.28), (0.43, 0.03, 1.35), mat_steel(), bevel=0.01)
    rf_dr = create_box("rf_dr", (0.23, -0.42, 1.28), (0.43, 0.03, 1.35), mat_steel(), bevel=0.01)
    rf_fz = create_box("rf_fz", (0, -0.42, 0.32), (0.89, 0.03, 0.58), mat_steel(), bevel=0.01)
    rf_disp = create_box("rf_dp", (-0.23, -0.44, 1.28), (0.20, 0.02, 0.28), get_material("Disp_Black", (0.1, 0.1, 0.12, 1.0)))
    rf_scr = create_box("rf_sc", (-0.23, -0.445, 1.38), (0.14, 0.005, 0.05), mat_screen((0.2, 0.7, 1.0, 1.0), 2.5, "Disp_Scr"))
    rf_hl = create_cylinder("rf_hl", (-0.04, -0.45, 1.28), 0.015, 0.80, mat_chrome())
    rf_hr = create_cylinder("rf_hr", (0.04, -0.45, 1.28), 0.015, 0.80, mat_chrome())
    rf_hf = create_cylinder("rf_hf", (0, -0.45, 0.56), 0.015, 0.60, mat_chrome(), rotation=(0, math.radians(90), 0))
    rf = join_as_named_object([rf_body, rf_dl, rf_dr, rf_fz, rf_disp, rf_scr, rf_hl, rf_hr, rf_hf], "Refrigerator")
    place_on_surface(rf, -6.2, 3.2, 0.0)

    # --- CUADRANTE SUROESTE (X: -6.0 a -0.5, Y: -4.5 a +0.5): SALA DE ESTAR ---
    # Sofa (X=-3.2, Y=-1.2, Z=0) facing South
    sf_base = create_box("sf_b", (0, 0, 0.16), (2.4, 0.88, 0.24), mat_dark_walnut())
    sf_cush1 = create_box("sf_c1", (-0.72, 0.02, 0.35), (0.68, 0.78, 0.18), mat_velvet_red())
    sf_cush2 = create_box("sf_c2", (0.0, 0.02, 0.35), (0.68, 0.78, 0.18), mat_velvet_red())
    sf_cush3 = create_box("sf_c3", (0.72, 0.02, 0.35), (0.68, 0.78, 0.18), mat_velvet_red())
    sf_back = create_box("sf_bk", (0, 0.35, 0.62), (2.4, 0.22, 0.64), mat_velvet_red())
    sf_arml = create_box("sf_al", (-1.22, 0.02, 0.44), (0.22, 0.88, 0.42), mat_velvet_red())
    sf_armr = create_box("sf_ar", (1.22, 0.02, 0.44), (0.22, 0.88, 0.42), mat_velvet_red())
    sf = join_as_named_object([sf_base, sf_cush1, sf_cush2, sf_cush3, sf_back, sf_arml, sf_armr], "Sofa")
    place_on_surface(sf, -3.2, -1.2, 0.0)

    # Living_Table (X=-3.2, Y=-2.8, Z=0, height 0.45m)
    lt_top = create_box("lt_t", (0, 0, 0.43), (1.40, 0.75, 0.04), mat_warm_wood())
    lt_l1 = create_cylinder("lt_l1", (-0.60, -0.30, 0.21), 0.025, 0.42, mat_dark_walnut())
    lt_l2 = create_cylinder("lt_l2", (0.60, -0.30, 0.21), 0.025, 0.42, mat_dark_walnut())
    lt_l3 = create_cylinder("lt_l3", (-0.60, 0.30, 0.21), 0.025, 0.42, mat_dark_walnut())
    lt_l4 = create_cylinder("lt_l4", (0.60, 0.30, 0.21), 0.025, 0.42, mat_dark_walnut())
    lt = join_as_named_object([lt_top, lt_l1, lt_l2, lt_l3, lt_l4], "Living_Table")
    place_on_surface(lt, -3.2, -2.8, 0.0)

    # Remote_Control (on coffee table Z=0.45m)
    rm_body = create_box("rm_b", (0, 0, 0.01), (0.065, 0.18, 0.018), get_material("Remote_Black", (0.08, 0.08, 0.10, 1.0), roughness=0.35), bevel=0.004)
    rm_pwr = create_sphere("rm_p", (0, 0.065, 0.02), 0.008, mat_screen((1.0, 0.15, 0.15, 1.0), 2.5, "Btn_Pwr"))
    rm_pad = create_torus("rm_pd", (0, 0.02, 0.02), 0.018, 0.004, mat_steel())
    rm_b1 = create_box("rm_b1", (-0.015, -0.03, 0.02), (0.016, 0.012, 0.004), mat_chrome())
    rm_b2 = create_box("rm_b2", (0.015, -0.03, 0.02), (0.016, 0.012, 0.004), mat_chrome())
    rm = join_as_named_object([rm_body, rm_pwr, rm_pad, rm_b1, rm_b2], "Remote_Control")
    place_on_surface(rm, -3.2, -2.8, 0.45)

    # --- CUADRANTE NORESTE (X: +1.0 a +6.5, Y: +1.5 a +5.5): ESTUDIO & RECÁMARA ---
    # Study Desk (X=+4.5, Y=+4.6, surface at Z=0.76m)
    dk_top = create_box("dk_t", (0, 0, 0.74), (1.50, 0.80, 0.04), mat_warm_wood())
    dk_l1 = create_box("dk_l1", (-0.68, 0, 0.36), (0.06, 0.72, 0.72), mat_dark_walnut())
    dk_l2 = create_box("dk_l2", (0.68, 0, 0.36), (0.06, 0.72, 0.72), mat_dark_walnut())
    # Office chair
    ch_seat = create_box("ch_s", (0, -0.65, 0.48), (0.50, 0.48, 0.08), mat_steel())
    ch_back = create_box("ch_bk", (0, -0.85, 0.78), (0.46, 0.06, 0.52), mat_steel())
    ch_pole = create_cylinder("ch_p", (0, -0.65, 0.24), 0.03, 0.48, mat_chrome())
    dk = join_as_named_object([dk_top, dk_l1, dk_l2, ch_seat, ch_back, ch_pole], "Study_Desk")
    place_on_surface(dk, 4.5, 4.6, 0.0)

    # Laptop (open on desk Z=0.76m)
    lp_base = create_box("lp_bs", (0, 0, 0.008), (0.34, 0.24, 0.014), mat_steel(), bevel=0.004)
    lp_kbd = create_box("lp_kb", (0, 0.03, 0.016), (0.28, 0.12, 0.004), get_material("Keyb_Dark", (0.1, 0.1, 0.1, 1.0)))
    lp_pad = create_box("lp_pd", (0, -0.065, 0.016), (0.10, 0.06, 0.003), mat_chrome())
    lp_lid = create_box("lp_ld", (0, 0.11, 0.12), (0.34, 0.012, 0.22), mat_steel(), rotation=(math.radians(20), 0, 0), bevel=0.004)
    lp_scr = create_box("lp_sc", (0, 0.105, 0.12), (0.31, 0.004, 0.19), mat_screen((0.08, 0.65, 0.95, 1.0), 3.0, "OS_Screen"), rotation=(math.radians(20), 0, 0))
    lp = join_as_named_object([lp_base, lp_kbd, lp_pad, lp_lid, lp_scr], "Laptop")
    place_on_surface(lp, 4.5, 4.6, 0.76)

    # Bed and Wardrobe in bedroom zone (X=+4.5, Y=-1.0, Z=0) - totally uncluttered
    bd_frame = create_box("bd_f", (0, 0, 0.20), (2.0, 2.2, 0.36), mat_warm_wood())
    bd_mattress = create_box("bd_m", (0, 0, 0.44), (1.9, 2.1, 0.24), mat_porcelain())
    bd_headboard = create_box("bd_h", (0, 1.05, 0.72), (2.1, 0.16, 0.90), mat_dark_walnut())
    bd_pill1 = create_box("bd_p1", (-0.50, 0.75, 0.60), (0.60, 0.40, 0.12), mat_porcelain())
    bd_pill2 = create_box("bd_p2", (0.50, 0.75, 0.60), (0.60, 0.40, 0.12), mat_porcelain())
    bd_wardrobe = create_box("bd_w", (1.7, 0, 1.10), (0.80, 1.80, 2.20), mat_dark_walnut())
    bed_unit = join_as_named_object([bd_frame, bd_mattress, bd_headboard, bd_pill1, bd_pill2, bd_wardrobe], "House_Bed")
    place_on_surface(bed_unit, 4.5, -1.0, 0.0)

    # --- CUADRANTE SURESTE (X: +1.5 a +6.5, Y: -5.0 a -2.0): TOCADOR DE BAÑO ---
    # Bathroom Vanity with Sink Basin (X=+5.2, Y=-4.0, height 0.86m)
    bv_cabinet = create_box("bv_c", (0, 0, 0.40), (1.60, 0.70, 0.80), mat_dark_walnut())
    bv_top = create_box("bv_t", (0, 0, 0.83), (1.65, 0.75, 0.06), mat_black_marble())
    # Sink basin
    sk_basin = create_box("sk_b", (0, 0, 0.88), (0.65, 0.45, 0.14), mat_porcelain())
    sk_faucet = create_cylinder("sk_f", (0, 0.18, 1.02), 0.016, 0.22, mat_chrome(), rotation=(0, math.radians(20), 0))
    vanity = join_as_named_object([bv_cabinet, bv_top, sk_basin, sk_faucet], "Bathroom_Vanity")
    place_on_surface(vanity, 5.2, -4.0, 0.0)

    # Soap_Dispenser (on vanity Z=0.86m, at X=5.6, Y=-4.0)
    sd_bottle = create_cylinder("sd_b", (0, 0, 0.07), 0.045, 0.14, mat_glass())
    sd_liquid = create_cylinder("sd_lq", (0, 0, 0.06), 0.041, 0.11, get_material("Amber_Soap", (0.92, 0.65, 0.20, 1.0), roughness=0.2, transmission=0.6))
    sd_cap = create_cylinder("sd_cp", (0, 0, 0.145), 0.022, 0.02, mat_chrome())
    sd_pump = create_cylinder("sd_p", (0, 0, 0.17), 0.010, 0.04, mat_chrome())
    sd_nozzle = create_cylinder("sd_nz", (0, -0.025, 0.185), 0.006, 0.05, mat_chrome(), rotation=(math.radians(90), 0, 0))
    sd = join_as_named_object([sd_bottle, sd_liquid, sd_cap, sd_pump, sd_nozzle], "Soap_Dispenser")
    place_on_surface(sd, 5.7, -4.0, 0.86)

    # Toothbrush (on vanity Z=0.86m, at X=4.7, Y=-4.0)
    tb_cup = create_cylinder("tb_c", (0, 0, 0.05), 0.038, 0.10, mat_porcelain())
    tb_handle = create_cylinder("tb_h", (0, 0, 0.13), 0.010, 0.18, get_material("Teal_Grip", (0.1, 0.65, 0.7, 1.0), roughness=0.4))
    tb_head = create_box("tb_hd", (0, 0, 0.23), (0.012, 0.010, 0.024), mat_porcelain())
    tb_bristle = create_box("tb_br", (0, -0.008, 0.23), (0.010, 0.006, 0.020), mat_screen((0.3, 0.9, 1.0, 1.0), 1.0, "Bristles"))
    tb = join_as_named_object([tb_cup, tb_handle, tb_head, tb_bristle], "Toothbrush")
    place_on_surface(tb, 4.7, -4.0, 0.86)

    # Shampoo_Bottle (on vanity Z=0.86m, at X=5.2, Y=-3.7)
    sb_body = create_box("sb_b", (0, 0, 0.10), (0.08, 0.05, 0.20), get_material("Shampoo_Bottle_Mat", (0.15, 0.45, 0.35, 1.0), roughness=0.3), bevel=0.012)
    sb_cap = create_cylinder("sb_cp", (0, 0, 0.215), 0.018, 0.03, mat_gold())
    sb = join_as_named_object([sb_body, sb_cap], "Shampoo_Bottle")
    place_on_surface(sb, 5.2, -3.7, 0.86)

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "house.glb"))
    print("WORLD 1 (HOUSE) EXPORTED SUCCESSFULLY!\n")


# ==============================================================================
# WORLD 2: SUPERMARKET.GLB
# 3 Central Gondola Aisles with 4 Tiers + Front-Right Checkout Counter + Shopping Carts
# ==============================================================================
def build_supermarket():
    reset_scene()
    print("Building World 2: Supermarket (Gondola Aisles & Checkout AAA Layout)...")
    add_bounds_anchor(radius_x=8.0, radius_y=7.0)

    # 1. Base Room (16m x 14m, North wall at Y=6.0, West wall at X=-7.0, polished commercial tile floor)
    build_isometric_room(
        "Supermarket",
        floor_size=(16.0, 14.0),
        floor_mat=mat_commercial_tile(),
        wall_mat=get_material("Market_WallMat", base_color=(0.93, 0.94, 0.96, 1.0), roughness=0.5),
        baseboard_mat=mat_steel(),
        north_y=6.0,
        west_x=-7.0,
        wall_height=3.6,
        has_window=True,
        window_pos=(-2.0, 6.0, 2.2),
        window_size=(4.0, 1.6)
    )

    # Helper: build a realistic double-sided commercial supermarket gondola
    def create_gondola(name, center_x, center_y):
        g_parts = []
        # Main uprights & backpanel
        bp = create_box(f"{name}_bp", (center_x, center_y, 0.95), (0.08, 4.2, 1.90), mat_steel())
        base_l = create_box(f"{name}_bsl", (center_x - 0.35, center_y, 0.16), (0.60, 4.2, 0.32), mat_steel())
        base_r = create_box(f"{name}_bsr", (center_x + 0.35, center_y, 0.16), (0.60, 4.2, 0.32), mat_steel())
        g_parts.extend([bp, base_l, base_r])
        # 3 upper shelf levels: Z = 0.80, 1.25, 1.70
        for sz in [0.80, 1.25, 1.70]:
            sl = create_box(f"{name}_sl_{sz}", (center_x - 0.32, center_y, sz - 0.02), (0.55, 4.2, 0.04), mat_steel())
            sr = create_box(f"{name}_sr_{sz}", (center_x + 0.32, center_y, sz - 0.02), (0.55, 4.2, 0.04), mat_steel())
            g_parts.extend([sl, sr])
        return join_as_named_object(g_parts, name)

    # 3 Gondolas at X = -4.0, -1.0, +2.0, Y = +1.0
    g1 = create_gondola("Gondola_Aisle_1", -4.0, 1.0)
    g2 = create_gondola("Gondola_Aisle_2", -1.0, 1.0)
    g3 = create_gondola("Gondola_Aisle_3", 2.0, 1.0)
    join_as_named_object([g1, g2, g3], "Gondola_Aisle")

    # --- GONDOLA 1 (X = -4.0): DESAYUNOS Y PANADERÍA ---
    # Cereal_Box (shelf tier Z = 1.25m)
    c_boxes = []
    c_colors = [
        ("Cereal_Honey", (0.95, 0.65, 0.12, 1.0)),
        ("Cereal_Choco", (0.35, 0.18, 0.10, 1.0)),
        ("Cereal_Blueberry", (0.15, 0.45, 0.85, 1.0))
    ]
    for i, (cname, col) in enumerate(c_colors):
        b = create_box(f"cb_{i}", (0, 0, 0.15), (0.16, 0.08, 0.28), get_material(cname, col, roughness=0.4), bevel=0.005)
        top = create_box(f"cbt_{i}", (0, 0, 0.295), (0.156, 0.076, 0.01), mat_porcelain())
        c_boxes.extend([b, top])
    cb = join_as_named_object(c_boxes, "Cereal_Box")
    place_on_surface(cb, -3.8, 1.8, 1.25)

    # Sliced_Bread (shelf tier Z = 0.80m)
    br_parts = []
    for i in range(2):
        b = create_box(f"br_{i}", (0, (i - 0.5) * 0.30, 0.08), (0.22, 0.12, 0.13), get_material("Bread_Bag", (0.88, 0.72, 0.48, 1.0), roughness=0.5), bevel=0.018)
        clip = create_box(f"brc_{i}", (0.12, (i - 0.5) * 0.30, 0.08), (0.015, 0.03, 0.03), mat_screen((1.0, 0.2, 0.2, 1.0), 1.0, "Clip_Red"))
        br_parts.extend([b, clip])
    bread = join_as_named_object(br_parts, "Sliced_Bread")
    place_on_surface(bread, -3.8, 0.4, 0.80)

    # Egg_Carton (shelf tier Z = 0.80m)
    eg_carton = create_box("eg_c", (0, 0, 0.035), (0.26, 0.16, 0.07), get_material("Egg_Pulp", (0.65, 0.60, 0.52, 1.0), roughness=0.9), bevel=0.008)
    eggs = []
    for ex in [-0.08, 0.0, 0.08]:
        for ey in [-0.04, 0.04]:
            egg = create_sphere(f"eg_{ex}_{ey}", (ex, ey, 0.07), 0.023, get_material("Egg_Brown", (0.82, 0.62, 0.44, 1.0), roughness=0.6), scale=(1.0, 1.0, 1.25))
            eggs.append(egg)
    eg = join_as_named_object([eg_carton] + eggs, "Egg_Carton")
    place_on_surface(eg, -3.8, -0.6, 0.80)

    # Milk_Carton (shelf tier Z = 0.35m)
    mk_parts = []
    for i in range(3):
        mk_b = create_box(f"mk_b_{i}", (0, (i - 1) * 0.16, 0.10), (0.09, 0.09, 0.20), mat_porcelain(), bevel=0.006)
        mk_r = create_box(f"mk_r_{i}", (0, (i - 1) * 0.16, 0.21), (0.088, 0.088, 0.04), get_material("Dairy_Blue", (0.1, 0.5, 0.9, 1.0), roughness=0.4), bevel=0.01)
        mk_parts.extend([mk_b, mk_r])
    milk = join_as_named_object(mk_parts, "Milk_Carton")
    place_on_surface(milk, -3.8, 1.0, 0.35)

    # --- GONDOLA 2 (X = -1.0): ABARROTES Y CONDIMENTOS ---
    # Mayonnaise (shelf tier Z = 1.25m)
    my_parts = []
    for i in range(2):
        my_j = create_cylinder(f"my_j_{i}", (0, (i - 0.5) * 0.18, 0.07), 0.05, 0.13, mat_glass())
        my_fl = create_cylinder(f"my_fl_{i}", (0, (i - 0.5) * 0.18, 0.06), 0.046, 0.11, get_material("Mayo_Cream", (0.96, 0.94, 0.85, 1.0), roughness=0.3))
        my_ld = create_cylinder(f"my_ld_{i}", (0, (i - 0.5) * 0.18, 0.14), 0.048, 0.02, mat_gold())
        my_parts.extend([my_j, my_fl, my_ld])
    mayo = join_as_named_object(my_parts, "Mayonnaise")
    place_on_surface(mayo, -0.8, 1.6, 1.25)

    # Table_Cream (shelf tier Z = 1.25m)
    tc_parts = []
    for i in range(2):
        tc_b = create_cylinder(f"tc_b_{i}", (0, (i - 0.5) * 0.16, 0.06), 0.04, 0.12, mat_glass())
        tc_cr = create_cylinder(f"tc_cr_{i}", (0, (i - 0.5) * 0.16, 0.05), 0.037, 0.10, get_material("Cream_Rich", (0.98, 0.97, 0.92, 1.0), roughness=0.25))
        tc_cp = create_cylinder(f"tc_cp_{i}", (0, (i - 0.5) * 0.16, 0.125), 0.028, 0.018, mat_gold())
        tc_parts.extend([tc_b, tc_cr, tc_cp])
    cream = join_as_named_object(tc_parts, "Table_Cream")
    place_on_surface(cream, -0.8, 0.6, 1.25)

    # Ketchup (shelf tier Z = 0.80m)
    kt_parts = []
    for i in range(2):
        kt_b = create_cylinder(f"kt_b_{i}", (0, (i - 0.5) * 0.15, 0.09), 0.038, 0.17, get_material("Ketchup_Red", (0.85, 0.08, 0.08, 1.0), roughness=0.35))
        kt_cp = create_cylinder(f"kt_cp_{i}", (0, (i - 0.5) * 0.15, 0.185), 0.017, 0.03, mat_porcelain())
        kt_parts.extend([kt_b, kt_cp])
    ketchup = join_as_named_object(kt_parts, "Ketchup")
    place_on_surface(ketchup, -0.8, 1.6, 0.80)

    # Cooking_Oil (shelf tier Z = 0.80m)
    oil_parts = []
    for i in range(2):
        oil_b = create_cylinder(f"oil_b_{i}", (0, (i - 0.5) * 0.16, 0.11), 0.04, 0.21, mat_glass())
        oil_lq = create_cylinder(f"oil_lq_{i}", (0, (i - 0.5) * 0.16, 0.09), 0.037, 0.17, get_material("Golden_Oil", (0.95, 0.82, 0.15, 1.0), roughness=0.15, transmission=0.6))
        oil_cp = create_cylinder(f"oil_cp_{i}", (0, (i - 0.5) * 0.16, 0.225), 0.019, 0.025, get_material("Cap_Green", (0.1, 0.6, 0.2, 1.0), roughness=0.4))
        oil_parts.extend([oil_b, oil_lq, oil_cp])
    oil = join_as_named_object(oil_parts, "Cooking_Oil")
    place_on_surface(oil, -0.8, 0.6, 0.80)

    # Canned_Tuna (shelf tier Z = 0.35m)
    tuna_parts = []
    for i in range(3):
        cn1 = create_cylinder(f"cn1_{i}", (0, (i - 1) * 0.16, 0.035), 0.055, 0.06, mat_steel())
        cn2 = create_cylinder(f"cn2_{i}", (0, (i - 1) * 0.16, 0.095), 0.055, 0.06, mat_steel())
        lbl = create_cylinder(f"cnl_{i}", (0, (i - 1) * 0.16, 0.065), 0.056, 0.10, get_material("Tuna_Label", (0.1, 0.4, 0.85, 1.0), roughness=0.5))
        tuna_parts.extend([cn1, cn2, lbl])
    tuna = join_as_named_object(tuna_parts, "Canned_Tuna")
    place_on_surface(tuna, -0.8, 1.0, 0.35)

    # --- ZONA DE CAJAS (X = +4.8, Y = -2.2, Z = 0): CHECKOUT COUNTER ---
    # Checkout_Counter (Height Z = 0.92m)
    cc_base = create_box("cc_bs", (0, 0, 0.43), (1.40, 2.60, 0.86), mat_steel())
    cc_belt = create_box("cc_bl", (-0.15, 0, 0.89), (0.75, 2.50, 0.04), mat_dark_walnut())
    cc_deck = create_box("cc_dk", (0.40, 0, 0.90), (0.45, 2.60, 0.06), mat_steel())
    checkout = join_as_named_object([cc_base, cc_belt, cc_deck], "Checkout_Counter")
    place_on_surface(checkout, 4.8, -2.2, 0.0)

    # Cash_Register (on counter Z = 0.92m, at X=4.8, Y=-1.4)
    cr_drawer = create_box("cr_dw", (0, 0, 0.06), (0.42, 0.40, 0.12), mat_steel(), bevel=0.01)
    cr_body = create_box("cr_bd", (0, 0.05, 0.18), (0.34, 0.26, 0.14), mat_steel(), bevel=0.01)
    cr_screen = create_box("cr_sc", (0, -0.06, 0.30), (0.28, 0.02, 0.18), mat_steel(), rotation=(math.radians(25), 0, 0), bevel=0.005)
    cr_disp = create_box("cr_ds", (0, -0.07, 0.30), (0.25, 0.005, 0.15), mat_screen((0.1, 0.9, 0.4, 1.0), 3.0, "POS_UI"), rotation=(math.radians(25), 0, 0))
    cr_prt = create_box("cr_pr", (0.12, 0.08, 0.26), (0.08, 0.08, 0.04), mat_dark_walnut())
    cr = join_as_named_object([cr_drawer, cr_body, cr_screen, cr_disp, cr_prt], "Cash_Register")
    place_on_surface(cr, 4.8, -1.4, 0.92)

    # Barcode_Scanner (on counter Z = 0.92m, at X=4.8, Y=-2.2)
    bs_cradle = create_box("bs_c", (0, 0, 0.03), (0.12, 0.14, 0.06), mat_dark_walnut(), bevel=0.006)
    bs_head = create_box("bs_h", (0, -0.02, 0.14), (0.065, 0.11, 0.06), mat_steel(), rotation=(math.radians(30), 0, 0), bevel=0.008)
    bs_lens = create_box("bs_l", (0, -0.075, 0.165), (0.05, 0.005, 0.04), mat_screen((1.0, 0.1, 0.1, 1.0), 2.5, "Laser_Red"), rotation=(math.radians(30), 0, 0))
    bs_grip = create_cylinder("bs_g", (0, 0.02, 0.08), 0.018, 0.10, mat_dark_walnut(), rotation=(math.radians(-20), 0, 0))
    bs = join_as_named_object([bs_cradle, bs_head, bs_lens, bs_grip], "Barcode_Scanner")
    place_on_surface(bs, 4.8, -2.2, 0.92)

    # Card_Reader (on counter Z = 0.92m, at X=4.8, Y=-2.9)
    ct_stand = create_cylinder("ct_st", (0, 0, 0.05), 0.022, 0.10, mat_steel())
    ct_body = create_box("ct_b", (0, 0, 0.13), (0.11, 0.18, 0.045), mat_dark_walnut(), rotation=(math.radians(35), 0, 0), bevel=0.006)
    ct_scr = create_box("ct_sc", (0, -0.02, 0.16), (0.085, 0.06, 0.005), mat_screen((0.2, 0.7, 1.0, 1.0), 2.5, "POS_Pay"), rotation=(math.radians(35), 0, 0))
    ct_pad = create_box("ct_pd", (0, 0.04, 0.12), (0.085, 0.07, 0.005), mat_steel(), rotation=(math.radians(35), 0, 0))
    cr_reader = join_as_named_object([ct_stand, ct_body, ct_scr, ct_pad], "Card_Reader")
    place_on_surface(cr_reader, 4.8, -2.9, 0.92)

    # Shopping_Cart (parked in entrance lane X=-3.5 and -4.5, Y=-3.8)
    def create_single_cart(name, cx, cy):
        parts = []
        base = create_box(f"{name}_fr", (cx, cy, 0.18), (0.54, 0.72, 0.05), mat_steel())
        parts.append(base)
        for wx in [-0.22, 0.22]:
            for wy in [-0.28, 0.28]:
                wh = create_cylinder(f"{name}_w_{wx}_{wy}", (cx + wx, cy + wy, 0.06), 0.055, 0.025, mat_dark_walnut(), rotation=(0, math.radians(90), 0))
                parts.append(wh)
        b_bot = create_box(f"{name}_bb", (cx, cy, 0.42), (0.52, 0.70, 0.02), mat_chrome())
        b_f = create_box(f"{name}_bf", (cx, cy + 0.35, 0.65), (0.52, 0.02, 0.46), mat_chrome())
        b_b = create_box(f"{name}_bk", (cx, cy - 0.35, 0.65), (0.52, 0.02, 0.46), mat_chrome())
        b_l = create_box(f"{name}_bl", (cx - 0.26, cy, 0.65), (0.02, 0.70, 0.46), mat_chrome())
        b_r = create_box(f"{name}_br", (cx + 0.26, cy, 0.65), (0.02, 0.70, 0.46), mat_chrome())
        hnd = create_cylinder(f"{name}_h", (cx, cy - 0.42, 0.92), 0.018, 0.54, mat_velvet_red(), rotation=(0, math.radians(90), 0))
        parts.extend([b_bot, b_f, b_b, b_l, b_r, hnd])
        return join_as_named_object(parts, name)

    sc1 = create_single_cart("Cart_1", -3.5, -3.8)
    sc2 = create_single_cart("Cart_2", -4.5, -3.8)
    join_as_named_object([sc1, sc2], "Shopping_Cart")

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "supermarket.glb"))
    print("WORLD 2 (SUPERMARKET) EXPORTED SUCCESSFULLY!\n")


# ==============================================================================
# WORLD 3: RESTAURANT.GLB
# Chef Bar at Back + 4 Round Clothed Tables + Tableware strictly ON tables (Z=0.78m)
# ==============================================================================
def build_restaurant():
    reset_scene()
    print("Building World 3: Gourmet Bistro & Restaurant (Zero Hot-Pink, Strict Tabletop Placement)...")
    add_bounds_anchor(radius_x=8.0, radius_y=7.0)

    # 1. Base Room (16m x 14m, North wall at Y=6.0, West wall at X=-7.0, Herringbone parquet & dark burgundy rug #4a1525)
    build_isometric_room(
        "Restaurant",
        floor_size=(16.0, 14.0),
        floor_mat=mat_parquet(),
        wall_mat=get_material("Bistro_WallMat", base_color=(0.94, 0.92, 0.89, 1.0), roughness=0.55),
        baseboard_mat=mat_dark_walnut(),
        north_y=6.0,
        west_x=-7.0,
        wall_height=3.6,
        has_window=True,
        window_pos=(0, 6.0, 2.0),
        window_size=(3.6, 1.8),
        rug_config=(0, -0.8, 9.6, 7.6, mat_burgundy_rug(), False)
    )

    # 2. Barra de Chef al Fondo (Bar_Credenza at X=0, Y=+4.5, Z=0, height 0.95m)
    bc_base = create_box("bc_b", (0, 4.5, 0.44), (5.2, 0.90, 0.88), mat_dark_walnut())
    bc_top = create_box("bc_t", (0, 4.5, 0.92), (5.3, 0.95, 0.06), mat_black_marble())
    join_as_named_object([bc_base, bc_top], "Bar_Credenza")

    # Espresso_Machine (on bar Z = 0.95m, at X=-0.8, Y=+4.5)
    em_body = create_box("em_b", (0, 0, 0.26), (0.68, 0.48, 0.50), mat_steel())
    em_rail = create_box("em_rl", (0, 0, 0.52), (0.64, 0.44, 0.03), mat_chrome(), bevel=0.005)
    em_c1 = create_cylinder("em_c1", (-0.16, 0, 0.56), 0.035, 0.05, mat_porcelain())
    em_c2 = create_cylinder("em_c2", (0.16, 0, 0.56), 0.035, 0.05, mat_porcelain())
    em_g1 = create_cylinder("em_g1", (-0.14, -0.26, 0.22), 0.038, 0.06, mat_chrome())
    em_g2 = create_cylinder("em_g2", (0.14, -0.26, 0.22), 0.038, 0.06, mat_chrome())
    em_pf1 = create_cylinder("em_pf1", (-0.14, -0.36, 0.20), 0.014, 0.15, mat_dark_walnut(), rotation=(math.radians(90), 0, 0))
    em_pf2 = create_cylinder("em_pf2", (0.14, -0.36, 0.20), 0.014, 0.15, mat_dark_walnut(), rotation=(math.radians(90), 0, 0))
    em_drip = create_box("em_dp", (0, -0.24, 0.05), (0.64, 0.20, 0.04), mat_steel())
    em_gauge = create_cylinder("em_gg", (0, -0.25, 0.38), 0.032, 0.02, mat_gold(), rotation=(math.radians(90), 0, 0))
    espresso = join_as_named_object([em_body, em_rail, em_c1, em_c2, em_g1, em_g2, em_pf1, em_pf2, em_drip, em_gauge], "Espresso_Machine")
    place_on_surface(espresso, -0.8, 4.5, 0.95)

    # Olive_Oil (on bar Z = 0.95m, at X=+0.8, Y=+4.5)
    oo_flask = create_sphere("oo_f", (0, 0, 0.06), 0.042, mat_glass(), scale=(1.0, 1.0, 1.3))
    oo_neck = create_cylinder("oo_n", (0, 0, 0.13), 0.014, 0.06, mat_glass())
    oo_spout = create_cylinder("oo_s", (0, -0.01, 0.17), 0.005, 0.04, mat_steel(), rotation=(math.radians(35), 0, 0))
    olive_oil = join_as_named_object([oo_flask, oo_neck, oo_spout], "Olive_Oil")
    place_on_surface(olive_oil, 0.8, 4.5, 0.95)

    # 3. 4 Round Clothed Tables (Dining_Table at (-3.2, -2.5), (+3.2, -2.5), (-3.2, +0.8), (+3.2, +0.8))
    table_coords = [(-3.2, -2.5), (3.2, -2.5), (-3.2, 0.8), (3.2, 0.8)]
    table_objs = []
    for i, (tx, ty) in enumerate(table_coords):
        tb_leg = create_cylinder(f"dt_l_{i}", (tx, ty, 0.38), 0.06, 0.74, mat_dark_walnut())
        tb_base = create_cylinder(f"dt_b_{i}", (tx, ty, 0.02), 0.38, 0.04, mat_steel())
        tb_top = create_cylinder(f"dt_t_{i}", (tx, ty, 0.76), 0.75, 0.04, mat_warm_wood())
        tb_cloth = create_cylinder(f"dt_c_{i}", (tx, ty, 0.70), 0.78, 0.16, mat_porcelain())
        table_objs.extend([tb_leg, tb_base, tb_top, tb_cloth])
        # 2 chairs per table
        for cy in [-0.85, 0.85]:
            ch_s = create_box(f"dt_ch_s_{i}_{cy}", (tx, ty + cy, 0.44), (0.44, 0.44, 0.06), mat_burgundy_rug())
            ch_b = create_box(f"dt_ch_b_{i}_{cy}", (tx, ty + cy + (0.20 if cy > 0 else -0.20), 0.72), (0.44, 0.05, 0.52), mat_burgundy_rug())
            ch_l = create_cylinder(f"dt_ch_l_{i}_{cy}", (tx, ty + cy, 0.22), 0.02, 0.44, mat_dark_walnut())
            table_objs.extend([ch_s, ch_b, ch_l])
    join_as_named_object(table_objs, "Dining_Table")

    # --- TABLE 1 (X = -3.2, Y = -2.5): MAIN COURSE PLACE SETTING (Z = 0.78m) ---
    # Main_Course (Plate with grilled steak and asparagus)
    pl_dish = create_cylinder("mc_pl", (0, 0, 0.012), 0.16, 0.022, mat_porcelain())
    pl_steak = create_box("mc_stk", (0, 0, 0.032), (0.14, 0.10, 0.024), get_material("Grilled_Steak", (0.28, 0.12, 0.08, 1.0), roughness=0.6), bevel=0.008)
    pl_butter = create_box("mc_btr", (0, 0, 0.048), (0.028, 0.028, 0.014), get_material("Herb_Butter", (0.92, 0.92, 0.50, 1.0), roughness=0.3))
    pl_asp1 = create_cylinder("mc_as1", (-0.04, -0.07, 0.028), 0.007, 0.12, get_material("Asparagus", (0.15, 0.45, 0.12, 1.0), roughness=0.5), rotation=(0, math.radians(90), 0))
    pl_asp2 = create_cylinder("mc_as2", (0.04, -0.07, 0.028), 0.007, 0.12, get_material("Asparagus", (0.15, 0.45, 0.12, 1.0), roughness=0.5), rotation=(0, math.radians(90), 0))
    main_course = join_as_named_object([pl_dish, pl_steak, pl_butter, pl_asp1, pl_asp2], "Main_Course")
    place_on_surface(main_course, -3.2, -2.5, 0.78)

    # Fork (left of plate)
    fk_handle = create_cylinder("fk_h", (0, 0, 0.006), 0.006, 0.16, mat_chrome(), rotation=(math.radians(90), 0, 0))
    fk_tines = create_box("fk_t", (0, 0.09, 0.006), (0.024, 0.04, 0.003), mat_chrome())
    fork = join_as_named_object([fk_handle, fk_tines], "Fork")
    place_on_surface(fork, -3.42, -2.5, 0.78)

    # Knife (right of plate)
    kn_handle = create_cylinder("kn_h", (0, 0, 0.006), 0.007, 0.14, mat_dark_walnut(), rotation=(math.radians(90), 0, 0))
    kn_blade = create_box("kn_b", (0, 0.09, 0.008), (0.003, 0.10, 0.018), mat_steel())
    knife = join_as_named_object([kn_handle, kn_blade], "Knife")
    place_on_surface(knife, -2.98, -2.5, 0.78)

    # Spoon (right of knife)
    sp_handle = create_cylinder("sp_h", (0, 0, 0.006), 0.006, 0.15, mat_chrome(), rotation=(math.radians(90), 0, 0))
    sp_bowl = create_sphere("sp_b", (0, 0.09, 0.006), 0.018, mat_chrome(), scale=(1.2, 1.6, 0.4))
    spoon = join_as_named_object([sp_handle, sp_bowl], "Spoon")
    place_on_surface(spoon, -2.88, -2.5, 0.78)

    # Wine_Glass (top right of plate)
    wg_base = create_cylinder("wg_bs", (0, 0, 0.005), 0.042, 0.008, mat_glass())
    wg_stem = create_cylinder("wg_st", (0, 0, 0.08), 0.005, 0.15, mat_glass())
    wg_bowl = create_sphere("wg_bw", (0, 0, 0.19), 0.048, mat_glass(), scale=(1.0, 1.0, 1.5))
    wg_wine = create_sphere("wg_wn", (0, 0, 0.17), 0.042, mat_velvet_red(), scale=(0.95, 0.95, 1.1))
    wine_glass = join_as_named_object([wg_base, wg_stem, wg_bowl, wg_wine], "Wine_Glass")
    place_on_surface(wine_glass, -3.00, -2.30, 0.78)

    # Napkin (folded on left)
    npk = create_box("npk_f", (0, 0, 0.035), (0.12, 0.12, 0.07), mat_porcelain(), bevel=0.015)
    napkin = join_as_named_object([npk], "Napkin")
    place_on_surface(napkin, -3.55, -2.5, 0.78)

    # --- TABLE 2 (X = +3.2, Y = -2.5): MENU & CONDIMENTS (Z = 0.78m) ---
    # Menu (open leather menu card)
    mn_cov = create_box("mn_cv", (0, 0, 0.012), (0.24, 0.32, 0.016), get_material("Menu_Leather", (0.35, 0.08, 0.10, 1.0), roughness=0.5), bevel=0.006)
    mn_pag = create_box("mn_pg", (0, 0, 0.016), (0.22, 0.30, 0.012), mat_porcelain())
    mn_gold = create_box("mn_gd", (0, 0, 0.022), (0.05, 0.05, 0.003), mat_gold())
    menu = join_as_named_object([mn_cov, mn_pag, mn_gold], "Menu")
    place_on_surface(menu, 3.2, -2.5, 0.78)

    # Salt_Pepper_Shakers (on table Z=0.78m)
    s_jar = create_cylinder("s_j", (-0.035, 0, 0.045), 0.022, 0.08, mat_glass())
    s_lid = create_cylinder("s_l", (-0.035, 0, 0.09), 0.023, 0.018, mat_steel())
    p_jar = create_cylinder("p_j", (0.035, 0, 0.045), 0.022, 0.08, mat_glass())
    p_lid = create_cylinder("p_l", (0.035, 0, 0.09), 0.023, 0.018, mat_dark_walnut())
    shakers = join_as_named_object([s_jar, s_lid, p_jar, p_lid], "Salt_Pepper_Shakers")
    place_on_surface(shakers, 3.2, -2.30, 0.78)

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "restaurant.glb"))
    print("WORLD 3 (RESTAURANT) EXPORTED SUCCESSFULLY!\n")


# ==============================================================================
# WORLD 4: HOTEL.GLB
# Curved Reception Desk + Elevator + Luggage Cart with Suitcase + King Bed (Zero Clutter) + Safe Box
# ==============================================================================
def build_hotel():
    reset_scene()
    print("Building World 4: Luxury Hotel Lobby & Suite (Zero Overlaps, Zero Neon Pink)...")
    add_bounds_anchor(radius_x=8.0, radius_y=7.0)

    # 1. Base Room (16m x 14m, North wall at Y=6.0, West wall at X=-7.0, black marble floor & dark burgundy rug #581c28)
    build_isometric_room(
        "Hotel",
        floor_size=(16.0, 14.0),
        floor_mat=mat_black_marble(),
        wall_mat=get_material("Hotel_WallMat", base_color=(0.95, 0.94, 0.92, 1.0), roughness=0.5),
        baseboard_mat=mat_gold(),
        north_y=6.0,
        west_x=-7.0,
        wall_height=3.6,
        has_window=True,
        window_pos=(-2.0, 6.0, 2.2),
        window_size=(3.6, 1.8),
        rug_config=(0, 0.5, 7.6, 5.6, mat_burgundy_rug(), False)
    )

    # 2. Reception_Desk (Central-North X=0, Y=+3.8, Z=0, height 1.05m)
    rd_base = create_box("rd_b", (0, 3.8, 0.50), (4.2, 0.90, 1.00), mat_dark_walnut())
    rd_top = create_box("rd_t", (0, 3.8, 1.02), (4.3, 0.95, 0.06), mat_black_marble())
    rd_trim = create_box("rd_tr", (0, 3.35, 0.50), (4.25, 0.04, 0.96), mat_gold())
    join_as_named_object([rd_base, rd_top, rd_trim], "Reception_Desk")

    # Bellhop_Bell (on reception desk Z=1.05m, at X=0.6, Y=+3.8)
    bb_base = create_cylinder("bb_bs", (0, 0, 0.015), 0.075, 0.03, mat_dark_walnut())
    bb_dome = create_sphere("bb_dm", (0, 0, 0.055), 0.065, mat_gold(), scale=(1.0, 1.0, 0.6))
    bb_pin = create_cylinder("bb_pn", (0, 0, 0.105), 0.008, 0.035, mat_gold())
    bb_btn = create_cylinder("bb_bt", (0, 0, 0.125), 0.018, 0.012, mat_gold())
    bell = join_as_named_object([bb_base, bb_dome, bb_pin, bb_btn], "Bellhop_Bell")
    place_on_surface(bell, 0.6, 3.8, 1.05)

    # Room_Keycard (on reception desk Z=1.05m, at X=-0.6, Y=+3.8)
    rk_sleeve = create_box("rk_sl", (0, 0, 0.005), (0.12, 0.18, 0.008), get_material("Sleeve_Navy", (0.05, 0.10, 0.25, 1.0), roughness=0.5))
    rk_card = create_box("rk_cd", (0, 0.02, 0.010), (0.095, 0.15, 0.006), mat_gold())
    keycard = join_as_named_object([rk_sleeve, rk_card], "Room_Keycard")
    place_on_surface(keycard, -0.6, 3.8, 1.05)

    # Passport (on reception desk Z=1.05m, at X=0.0, Y=+3.8)
    ps_book = create_box("ps_bk", (0, 0, 0.008), (0.13, 0.19, 0.015), get_material("Passport_Blue", (0.06, 0.12, 0.28, 1.0), roughness=0.4))
    ps_gold = create_box("ps_gd", (0, 0, 0.016), (0.045, 0.045, 0.002), mat_gold())
    passport = join_as_named_object([ps_book, ps_gold], "Passport")
    place_on_surface(passport, 0.0, 3.8, 1.05)

    # 3. Elevator (Back-Right wall X=+4.0, Y=+5.6, Z=0)
    el_frame = create_box("el_fr", (4.0, 5.6, 1.45), (1.65, 0.15, 2.85), mat_gold(), bevel=0.02)
    el_door_l = create_box("el_dl", (3.64, 5.57, 1.40), (0.68, 0.04, 2.70), mat_steel(), bevel=0.01)
    el_door_r = create_box("el_dr", (4.36, 5.57, 1.40), (0.68, 0.04, 2.70), mat_steel(), bevel=0.01)
    el_screen = create_box("el_sc", (4.0, 5.52, 2.65), (0.24, 0.01, 0.10), mat_screen((0.95, 0.75, 0.1, 1.0), 3.0, "Floor_5"))
    join_as_named_object([el_frame, el_door_l, el_door_r, el_screen], "Elevator")

    # 4. Luggage_Cart (Right zone X=+3.8, Y=-0.5, Z=0)
    lc_parts = []
    lc_base = create_box("lc_bs", (0, 0, 0.14), (0.75, 1.25, 0.08), mat_burgundy_rug(), bevel=0.01)
    lc_parts.append(lc_base)
    for wx in [-0.32, 0.32]:
        for wy in [-0.52, 0.52]:
            wh = create_cylinder(f"lc_w_{wx}_{wy}", (wx, wy, 0.07), 0.065, 0.035, mat_dark_walnut(), rotation=(0, math.radians(90), 0))
            lc_parts.append(wh)
    p1 = create_cylinder("lc_p1", (-0.34, -0.56, 0.95), 0.022, 1.60, mat_gold())
    p2 = create_cylinder("lc_p2", (0.34, -0.56, 0.95), 0.022, 1.60, mat_gold())
    p3 = create_cylinder("lc_p3", (-0.34, 0.56, 0.95), 0.022, 1.60, mat_gold())
    p4 = create_cylinder("lc_p4", (0.34, 0.56, 0.95), 0.022, 1.60, mat_gold())
    arch = create_torus("lc_ar", (0, 0, 1.75), 0.55, 0.022, mat_gold(), rotation=(0, math.radians(90), 0))
    rail_top = create_cylinder("lc_rt", (0, 0, 1.68), 0.020, 1.15, mat_gold(), rotation=(math.radians(90), 0, 0))
    lc_parts.extend([p1, p2, p3, p4, arch, rail_top])
    luggage_cart = join_as_named_object(lc_parts, "Luggage_Cart")
    place_on_surface(luggage_cart, 3.8, -0.5, 0.0)

    # Suitcase (resting cleanly ON the cart platform Z=0.22m)
    sc_body = create_box("sc_bd", (0, 0, 0.35), (0.32, 0.50, 0.65), get_material("Suitcase_Navy", (0.08, 0.16, 0.32, 1.0), roughness=0.35), bevel=0.025)
    sc_handle = create_cylinder("sc_h", (0, 0, 0.72), 0.014, 0.20, mat_chrome(), rotation=(0, math.radians(90), 0))
    sc_parts = [sc_body, sc_handle]
    for wx in [-0.13, 0.13]:
        for wy in [-0.20, 0.20]:
            w = create_sphere(f"sc_w_{wx}_{wy}", (wx, wy, 0.03), 0.025, mat_dark_walnut())
            sc_parts.append(w)
    suitcase = join_as_named_object(sc_parts, "Suitcase")
    place_on_surface(suitcase, 3.8, -0.5, 0.22)

    # 5. King_Bed (Suite zone left X=-4.2, Y=-1.0, Z=0) - COMPLETELY CLEAN (NO CLUTTER ON BED!)
    kb_frame = create_box("kb_fr", (0, 0, 0.22), (2.4, 2.3, 0.38), mat_dark_walnut())
    kb_mattress = create_box("kb_mat", (0, 0, 0.46), (2.3, 2.2, 0.26), mat_porcelain())
    kb_headboard = create_box("kb_hb", (0, 1.10, 0.82), (2.5, 0.18, 1.10), mat_burgundy_rug())
    kb_p1 = create_box("kb_p1", (-0.60, 0.80, 0.63), (0.65, 0.42, 0.14), mat_porcelain())
    kb_p2 = create_box("kb_p2", (0.60, 0.80, 0.63), (0.65, 0.42, 0.14), mat_porcelain())
    kb_runner = create_box("kb_rn", (0, -0.70, 0.595), (2.32, 0.48, 0.02), mat_gold())
    king_bed = join_as_named_object([kb_frame, kb_mattress, kb_headboard, kb_p1, kb_p2, kb_runner], "King_Bed")
    place_on_surface(king_bed, -4.2, -1.0, 0.0)

    # 6. Safe_Box with Credenza Stand beside bed (at X=-6.0, Y=+1.8, Z=0)
    cr_stand = create_box("sf_st", (0, 0, 0.32), (0.80, 0.80, 0.64), mat_dark_walnut())
    sf_body = create_box("sf_b", (0, 0, 0.88), (0.50, 0.44, 0.48), mat_steel(), bevel=0.015)
    sf_door = create_box("sf_d", (0, -0.23, 0.88), (0.44, 0.03, 0.42), mat_steel(), bevel=0.01)
    sf_pad = create_box("sf_pd", (-0.09, -0.25, 0.90), (0.10, 0.01, 0.12), mat_dark_walnut())
    sf_dial = create_cylinder("sf_dl", (0.09, -0.26, 0.90), 0.040, 0.03, mat_chrome(), rotation=(math.radians(90), 0, 0))
    safe = join_as_named_object([cr_stand, sf_body, sf_door, sf_pad, sf_dial], "Safe_Box")
    place_on_surface(safe, -6.0, 1.8, 0.0)

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "hotel.glb"))
    print("WORLD 4 (HOTEL) EXPORTED SUCCESSFULLY!\n")


# ==============================================================================
# WORLD 5: DATING.GLB
# Romantic Terrace + Bistro Table (Z=0.78m) + Candle, Fondant, Ring Box, Wine
# ==============================================================================
def build_dating():
    reset_scene()
    print("Building World 5: Romantic Date & Terrace (All On Bistro Table Z=0.78m)...")
    add_bounds_anchor(radius_x=8.0, radius_y=7.0)

    # 1. Base Room / Terrace (Dark cut-stone floor, circular burgundy rug #4a1525, perimeter railing with warm lanterns)
    build_isometric_room(
        "Dating",
        floor_size=(16.0, 14.0),
        floor_mat=mat_stone_path(),
        wall_mat=get_material("Terrace_WallMat", base_color=(0.28, 0.28, 0.30, 1.0), roughness=0.7),
        baseboard_mat=mat_steel(),
        north_y=6.0,
        west_x=-7.0,
        wall_height=3.6,
        has_window=False,
        rug_config=(0, 0, 4.8, 4.8, mat_burgundy_rug(), True)
    )

    # 2. Bistro_Table in center (X=0, Y=0, Z=0, table height Z=0.78m) with 2 elegant chairs
    bt_leg = create_cylinder("bt_l", (0, 0, 0.38), 0.05, 0.74, mat_steel())
    bt_base = create_cylinder("bt_b", (0, 0, 0.02), 0.34, 0.04, mat_steel())
    bt_top = create_cylinder("bt_t", (0, 0, 0.77), 0.65, 0.03, mat_black_marble())
    # 2 Parisian bistro chairs (North and South)
    ch_n_s = create_box("ch_ns", (0, 0.75, 0.44), (0.42, 0.42, 0.05), mat_burgundy_rug())
    ch_n_b = create_box("ch_nb", (0, 0.92, 0.72), (0.42, 0.05, 0.52), mat_burgundy_rug())
    ch_n_l = create_cylinder("ch_nl", (0, 0.75, 0.22), 0.018, 0.44, mat_steel())
    ch_s_s = create_box("ch_ss", (0, -0.75, 0.44), (0.42, 0.42, 0.05), mat_burgundy_rug())
    ch_s_b = create_box("ch_sb", (0, -0.92, 0.72), (0.42, 0.05, 0.52), mat_burgundy_rug())
    ch_s_l = create_cylinder("ch_sl", (0, -0.75, 0.22), 0.018, 0.44, mat_steel())
    join_as_named_object([bt_leg, bt_base, bt_top, ch_n_s, ch_n_b, ch_n_l, ch_s_s, ch_s_b, ch_s_l], "Bistro_Table")

    # --- ITEMS ON BISTRO TABLE (Z = 0.78m) ---
    # Candle (Golden candelabra with warm flame in center)
    c_base = create_cylinder("c_bs", (0, 0, 0.015), 0.06, 0.03, mat_gold())
    c_stem = create_cylinder("c_st", (0, 0, 0.08), 0.014, 0.12, mat_gold())
    c_wax = create_cylinder("c_wx", (0, 0, 0.16), 0.022, 0.08, get_material("Beeswax", (0.95, 0.92, 0.82, 1.0), roughness=0.4))
    c_flame = create_sphere("c_fl", (0, 0, 0.22), 0.015, mat_screen((1.0, 0.65, 0.15, 1.0), 4.5, "Flame_Gold"), scale=(0.7, 0.7, 1.5))
    candle = join_as_named_object([c_base, c_stem, c_wax, c_flame], "Candle")
    place_on_surface(candle, 0.0, 0.0, 0.78)

    # Chocolate_Fondant (porcelain plate with lava cake at X=+0.22, Y=-0.18)
    cf_plate = create_cylinder("cf_pl", (0, 0, 0.008), 0.11, 0.015, mat_porcelain())
    cf_cake = create_cylinder("cf_ck", (0, 0, 0.035), 0.055, 0.045, get_material("Dark_Chocolate", (0.15, 0.08, 0.05, 1.0), roughness=0.6))
    cf_lava = create_sphere("cf_lv", (0, -0.03, 0.02), 0.022, get_material("Lava_Glaze", (0.10, 0.05, 0.03, 1.0), roughness=0.2))
    cf_berry = create_sphere("cf_by", (0.045, 0.035, 0.024), 0.014, mat_velvet_red())
    fondant = join_as_named_object([cf_plate, cf_cake, cf_lava, cf_berry], "Chocolate_Fondant")
    place_on_surface(fondant, 0.22, -0.18, 0.78)

    # Ring_Box (navy velvet box with diamond ring at X=-0.16, Y=+0.16)
    rb_base = create_box("rb_bs", (0, 0, 0.02), (0.065, 0.065, 0.038), get_material("Velvet_Navy_Box", (0.05, 0.08, 0.22, 1.0), roughness=0.85), bevel=0.005)
    rb_lid = create_box("rb_ld", (0, 0.03, 0.06), (0.065, 0.065, 0.018), get_material("Velvet_Navy_Box", (0.05, 0.08, 0.22, 1.0), roughness=0.85), rotation=(math.radians(-70), 0, 0), bevel=0.005)
    rb_ring = create_torus("rb_rg", (0, 0, 0.042), 0.012, 0.003, mat_gold(), rotation=(math.radians(90), 0, 0))
    rb_gem = create_sphere("rb_gm", (0, 0, 0.056), 0.006, mat_glass())
    ring_box = join_as_named_object([rb_base, rb_lid, rb_ring, rb_gem], "Ring_Box")
    place_on_surface(ring_box, -0.16, 0.16, 0.78)

    # Wine_List (card at X=-0.25, Y=-0.16)
    wl_b = create_box("wl_b", (0, 0, 0.01), (0.16, 0.24, 0.015), get_material("WineList_Red", (0.42, 0.08, 0.12, 1.0), roughness=0.4), bevel=0.005)
    wl_c = create_box("wl_c", (0, 0, 0.018), (0.03, 0.03, 0.002), mat_gold())
    wine_list = join_as_named_object([wl_b, wl_c], "Wine_List")
    place_on_surface(wine_list, -0.25, -0.16, 0.78)

    # Wine_Glasses (pair of crystal glasses at X=+0.18, Y=+0.18)
    parts_wg = []
    for dx, dy in [(-0.06, 0), (0.06, 0)]:
        bs = create_cylinder(f"wg_b_{dx}", (dx, dy, 0.005), 0.036, 0.006, mat_glass())
        st = create_cylinder(f"wg_s_{dx}", (dx, dy, 0.07), 0.004, 0.13, mat_glass())
        bw = create_sphere(f"wg_w_{dx}", (dx, dy, 0.16), 0.042, mat_glass(), scale=(1.0, 1.0, 1.4))
        wn = create_sphere(f"wg_wn_{dx}", (dx, dy, 0.14), 0.036, mat_velvet_red(), scale=(0.95, 0.95, 1.1))
        parts_wg.extend([bs, st, bw, wn])
    wine_glasses = join_as_named_object(parts_wg, "Wine_Glasses")
    place_on_surface(wine_glasses, 0.18, 0.18, 0.78)

    # Bouquet_of_Roses (on table at X=+0.35, Y=+0.15)
    bq_vase = create_cylinder("bq_vs", (0, 0, 0.10), 0.05, 0.20, mat_porcelain())
    bq_parts = [bq_vase]
    for angle in [0, 1.047, 2.094, 3.141, 4.188, 5.235]:
        rx = 0.04 * math.cos(angle)
        ry = 0.04 * math.sin(angle)
        rose = create_sphere(f"bq_r_{angle}", (rx, ry, 0.22), 0.03, mat_velvet_red(), scale=(1.0, 1.0, 0.8))
        bq_parts.append(rose)
    roses = join_as_named_object(bq_parts, "Bouquet_of_Roses")
    place_on_surface(roses, 0.35, 0.15, 0.78)

    # Champagne_Bottle (on ice bucket pedestal beside table at X=-1.4, Y=+0.6, Z=0)
    cp_stand_b = create_cylinder("cp_sb", (0, 0, 0.02), 0.18, 0.04, mat_chrome())
    cp_pole = create_cylinder("cp_pl", (0, 0, 0.42), 0.024, 0.80, mat_chrome())
    cp_bucket = create_cylinder("cp_bk", (0, 0, 0.92), 0.14, 0.24, mat_steel())
    cp_ice = create_cylinder("cp_ic", (0, 0, 0.98), 0.13, 0.06, mat_glass())
    cp_bot = create_cylinder("cp_bt", (0, 0, 1.10), 0.048, 0.28, get_material("Champagne_Glass_Green", (0.08, 0.25, 0.12, 1.0), roughness=0.2, transmission=0.5), rotation=(0, math.radians(15), 0))
    cp_neck = create_cylinder("cp_nk", (0.02, 0, 1.28), 0.018, 0.12, mat_gold(), rotation=(0, math.radians(15), 0))
    champagne = join_as_named_object([cp_stand_b, cp_pole, cp_bucket, cp_ice, cp_bot, cp_neck], "Champagne_Bottle")
    place_on_surface(champagne, -1.4, 0.6, 0.0)

    # Violin (on side music stand at X=-3.0, Y=+1.5, Z=0)
    vn_tripod = create_cylinder("vn_tr", (0, 0, 0.02), 0.22, 0.04, mat_steel())
    vn_mast = create_cylinder("vn_ms", (0, 0, 0.50), 0.018, 0.96, mat_steel())
    vn_body1 = create_sphere("vn_b1", (0, 0, 0.96), 0.09, mat_warm_wood(), scale=(1.2, 0.8, 1.4))
    vn_body2 = create_sphere("vn_b2", (0, 0, 1.10), 0.075, mat_warm_wood(), scale=(1.1, 0.7, 1.3))
    vn_neck = create_cylinder("vn_nk", (0, 0, 1.25), 0.015, 0.24, mat_dark_walnut())
    vn_scroll = create_torus("vn_sc", (0, 0, 1.38), 0.025, 0.008, mat_dark_walnut())
    vn_bow = create_cylinder("vn_bw", (0.12, 0, 1.05), 0.006, 0.70, mat_dark_walnut(), rotation=(0, math.radians(15), 0))
    violin = join_as_named_object([vn_tripod, vn_mast, vn_body1, vn_body2, vn_neck, vn_scroll, vn_bow], "Violin")
    place_on_surface(violin, -3.0, 1.5, 0.0)

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "dating.glb"))
    print("WORLD 5 (DATING) EXPORTED SUCCESSFULLY!\n")


# ==============================================================================
# WORLD 6: GARDEN.GLB
# Botanical Garden: Natural Grass, Flagstone Path, Fountain, Pergola with Tools, Bench
# ==============================================================================
def build_garden():
    reset_scene()
    print("Building World 6: Botanical Garden & Park (Realistic Landscape & Pergola)...")
    add_bounds_anchor(radius_x=8.0, radius_y=7.0)

    # 1. Base Landscape (16m x 14m natural lawn, stone path, perimeter picket fence)
    diorama_parts = []
    flr = create_box("Garden_Floor", (0, 0, -0.02), (16.0, 14.0, 0.04), mat_grass_natural())
    diorama_parts.append(flr)
    # Winding flagstone path
    for py in [-5.0, -3.5, -2.0, -0.5, 1.0, 2.5, 4.0]:
        px = 0.5 * math.sin(py * 0.8)
        stone = create_cylinder(f"path_{py}", (px, py, 0.005), 0.42, 0.01, mat_stone_path(), vertices=16)
        diorama_parts.append(stone)
    # White picket fence on North wall (Y=6.0) and West wall (X=-7.0)
    for fx in range(-7, 8, 2):
        post = create_box(f"pf_n_{fx}", (fx, 6.0, 0.60), (0.12, 0.12, 1.20), mat_porcelain())
        rail = create_box(f"pr_n_{fx}", (fx + 0.5, 6.0, 0.50), (1.8, 0.05, 0.10), mat_porcelain())
        diorama_parts.extend([post, rail])
    for fy in range(-6, 7, 2):
        post = create_box(f"pf_w_{fy}", (-7.0, fy, 0.60), (0.12, 0.12, 1.20), mat_porcelain())
        rail = create_box(f"pr_w_{fy}", (-7.0, fy + 0.5, 0.50), (0.05, 1.8, 0.10), mat_porcelain())
        diorama_parts.extend([post, rail])
    join_as_named_object(diorama_parts, "Garden_Diorama")

    # 2. Stone_Fountain (X=+3.8, Y=-1.2, Z=0)
    mat_stone = get_material("Limestone_Fountain", (0.82, 0.80, 0.76, 1.0), roughness=0.7)
    ft_base = create_cylinder("ft_bs", (0, 0, 0.12), 1.10, 0.24, mat_stone)
    ft_ped = create_cylinder("ft_pd", (0, 0, 0.50), 0.32, 0.60, mat_stone)
    ft_bowl = create_cylinder("ft_bw", (0, 0, 0.85), 0.75, 0.18, mat_stone)
    ft_water = create_cylinder("ft_wt", (0, 0, 0.89), 0.70, 0.04, mat_glass())
    ft_spout = create_sphere("ft_sp", (0, 0, 1.05), 0.14, mat_stone)
    fountain = join_as_named_object([ft_base, ft_ped, ft_bowl, ft_water, ft_spout], "Stone_Fountain")
    place_on_surface(fountain, 3.8, -1.2, 0.0)

    # 3. Pergola & Outdoor Table (X=+1.5, Y=+2.8, Z=0, table surface height Z=0.78m)
    pg_table = create_box("pg_tb", (1.5, 2.8, 0.76), (1.40, 0.80, 0.04), mat_warm_wood())
    pg_l1 = create_cylinder("pg_l1", (0.9, 2.5, 0.38), 0.03, 0.74, mat_dark_walnut())
    pg_l2 = create_cylinder("pg_l2", (2.1, 2.5, 0.38), 0.03, 0.74, mat_dark_walnut())
    pg_l3 = create_cylinder("pg_l3", (0.9, 3.1, 0.38), 0.03, 0.74, mat_dark_walnut())
    pg_l4 = create_cylinder("pg_l4", (2.1, 3.1, 0.38), 0.03, 0.74, mat_dark_walnut())
    join_as_named_object([pg_table, pg_l1, pg_l2, pg_l3, pg_l4], "Garden_Pergola_Table")

    # Pruning_Shears (on table Z=0.78m at X=1.3, Y=2.8)
    ps_b1 = create_cylinder("ps_b1", (0, 0.04, 0.01), 0.008, 0.10, mat_steel(), rotation=(math.radians(90), 0, 0))
    ps_h1 = create_cylinder("ps_h1", (-0.02, -0.06, 0.01), 0.012, 0.12, mat_velvet_red(), rotation=(math.radians(75), 0, 0))
    ps_h2 = create_cylinder("ps_h2", (0.02, -0.06, 0.01), 0.012, 0.12, mat_velvet_red(), rotation=(math.radians(105), 0, 0))
    shears = join_as_named_object([ps_b1, ps_h1, ps_h2], "Pruning_Shears")
    place_on_surface(shears, 1.3, 2.8, 0.78)

    # Garden_Trowel (on table Z=0.78m at X=1.7, Y=2.8)
    gt_blade = create_cylinder("gt_b", (0, 0.08, 0.01), 0.035, 0.14, mat_steel(), rotation=(math.radians(90), 0, 0), scale=(1.0, 0.35, 1.0))
    gt_shank = create_cylinder("gt_s", (0, 0, 0.015), 0.008, 0.06, mat_steel(), rotation=(math.radians(90), 0, 0))
    gt_handle = create_cylinder("gt_h", (0, -0.08, 0.015), 0.016, 0.13, mat_warm_wood(), rotation=(math.radians(90), 0, 0))
    trowel = join_as_named_object([gt_blade, gt_shank, gt_handle], "Garden_Trowel")
    place_on_surface(trowel, 1.7, 2.8, 0.78)

    # 4. Park Bench & Picnic_Basket (X=-3.2, Y=+1.2, Z=0)
    pb_body = create_box("pb_b", (0, 0, 0.16), (0.42, 0.28, 0.26), get_material("Wicker", (0.75, 0.55, 0.32, 1.0), roughness=0.8), bevel=0.015)
    pb_l1 = create_box("pb_l1", (-0.10, 0, 0.30), (0.20, 0.29, 0.02), mat_warm_wood())
    pb_l2 = create_box("pb_l2", (0.10, 0, 0.30), (0.20, 0.29, 0.02), mat_warm_wood())
    pb_handle = create_torus("pb_h", (0, 0, 0.36), 0.14, 0.016, mat_warm_wood(), rotation=(0, math.radians(90), 0))
    basket = join_as_named_object([pb_body, pb_l1, pb_l2, pb_handle], "Picnic_Basket")
    place_on_surface(basket, -2.2, 1.2, 0.0)

    # 5. Watering_Can (X=-2.2, Y=-2.2, Z=0)
    wc_body = create_cylinder("wc_b", (0, 0, 0.16), 0.14, 0.32, get_material("Can_Green", (0.12, 0.42, 0.22, 1.0), roughness=0.45))
    wc_spout = create_cylinder("wc_s", (0.14, 0, 0.25), 0.022, 0.34, get_material("Can_Green", (0.12, 0.42, 0.22, 1.0), roughness=0.45), rotation=(0, math.radians(45), 0))
    wc_rose = create_sphere("wc_r", (0.28, 0, 0.38), 0.045, mat_gold(), scale=(1.0, 1.0, 0.5))
    wc_handle = create_torus("wc_h", (0, 0, 0.36), 0.15, 0.018, get_material("Can_Green", (0.12, 0.42, 0.22, 1.0), roughness=0.45), rotation=(0, math.radians(90), 0))
    watering_can = join_as_named_object([wc_body, wc_spout, wc_rose, wc_handle], "Watering_Can")
    place_on_surface(watering_can, -2.2, -2.2, 0.0)

    # 6. Wheelbarrow (X=+2.0, Y=-3.5, Z=0)
    wb_tray = create_box("wb_tr", (0, 0, 0.36), (0.64, 0.85, 0.26), mat_velvet_red(), bevel=0.02)
    wb_wheel = create_cylinder("wb_wh", (0, 0.48, 0.18), 0.18, 0.07, mat_dark_walnut(), rotation=(0, math.radians(90), 0))
    wb_h1 = create_cylinder("wb_h1", (-0.25, -0.52, 0.32), 0.024, 0.55, mat_warm_wood(), rotation=(math.radians(35), 0, 0))
    wb_h2 = create_cylinder("wb_h2", (0.25, -0.52, 0.32), 0.024, 0.55, mat_warm_wood(), rotation=(math.radians(35), 0, 0))
    wb_leg1 = create_cylinder("wb_l1", (-0.22, -0.15, 0.15), 0.018, 0.28, mat_steel())
    wb_leg2 = create_cylinder("wb_l2", (0.22, -0.15, 0.15), 0.018, 0.28, mat_steel())
    wheelbarrow = join_as_named_object([wb_tray, wb_wheel, wb_h1, wb_h2, wb_leg1, wb_leg2], "Wheelbarrow")
    place_on_surface(wheelbarrow, 2.0, -3.5, 0.0)

    # 7. Flower_Pot (X=-5.0, Y=-1.0, Z=0)
    fp_pot = create_cylinder("fp_pt", (0, 0, 0.22), 0.24, 0.44, mat_terracotta())
    fp_rim = create_cylinder("fp_rm", (0, 0, 0.42), 0.26, 0.06, mat_terracotta())
    fp_soil = create_cylinder("fp_sl", (0, 0, 0.41), 0.23, 0.03, get_material("Fertile_Soil", (0.18, 0.12, 0.08, 1.0), roughness=0.9))
    fp_flowers = []
    for angle in [0, 1.25, 2.5, 3.75, 5.0]:
        fx = 0.12 * math.cos(angle)
        fy = 0.12 * math.sin(angle)
        fl = create_sphere(f"fp_fl_{angle}", (fx, fy, 0.52), 0.06, mat_screen((0.95, 0.2, 0.5, 1.0), 1.5, "Geranium"))
        fp_flowers.append(fl)
    flower_pot = join_as_named_object([fp_pot, fp_rim, fp_soil] + fp_flowers, "Flower_Pot")
    place_on_surface(flower_pot, -5.0, -1.0, 0.0)

    # 8. Birdhouse (X=-5.2, Y=+2.5, Z=0)
    bh_post = create_cylinder("bh_p", (0, 0, 0.75), 0.045, 1.50, mat_warm_wood())
    bh_box = create_box("bh_bx", (0, 0, 1.65), (0.26, 0.26, 0.32), mat_dark_walnut(), bevel=0.01)
    bh_roof = create_box("bh_rf", (0, 0, 1.84), (0.32, 0.32, 0.06), mat_velvet_red(), bevel=0.01)
    bh_hole = create_cylinder("bh_h", (0, -0.13, 1.68), 0.038, 0.02, get_material("Cavity", (0.02, 0.02, 0.02, 1.0)), rotation=(math.radians(90), 0, 0))
    bh_perch = create_cylinder("bh_pr", (0, -0.17, 1.60), 0.010, 0.08, mat_warm_wood(), rotation=(math.radians(90), 0, 0))
    birdhouse = join_as_named_object([bh_post, bh_box, bh_roof, bh_hole, bh_perch], "Birdhouse")
    place_on_surface(birdhouse, -5.2, 2.5, 0.0)

    # 9. Garden_Lantern (X=+0.5, Y=-1.0, Z=0)
    gl_post = create_cylinder("gl_p", (0, 0, 0.65), 0.038, 1.30, mat_steel())
    gl_head = create_box("gl_h", (0, 0, 1.40), (0.22, 0.22, 0.30), mat_steel(), bevel=0.01)
    gl_glass = create_box("gl_gl", (0, 0, 1.40), (0.18, 0.18, 0.26), mat_screen((1.0, 0.75, 0.25, 1.0), 3.0, "Amber_Lantern"))
    gl_cap = create_cylinder("gl_c", (0, 0, 1.58), 0.16, 0.08, mat_steel(), vertices=4, rotation=(0, 0, math.radians(45)))
    lantern = join_as_named_object([gl_post, gl_head, gl_glass, gl_cap], "Garden_Lantern")
    place_on_surface(lantern, 0.5, -1.0, 0.0)

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "garden.glb"))
    print("WORLD 6 (GARDEN) EXPORTED SUCCESSFULLY!\n")


# ==============================================================================
# WORLD 7: SPACE.GLB
# Orbital Sci-Fi Deck (Zero Rockets Cutting Floor) + Control Console + Helmet + Telescope
# ==============================================================================
def build_space():
    reset_scene()
    print("Building World 7: Orbital Space Station (Zero Rocket Floor Collisions)...")
    add_bounds_anchor(radius_x=8.0, radius_y=7.0)

    # 1. Base Sci-Fi Station (16m x 14m metal deck, panoramic viewing bay window)
    build_isometric_room(
        "Space",
        floor_size=(16.0, 14.0),
        floor_mat=mat_sci_fi_metal(),
        wall_mat=get_material("Station_Bulkhead", (0.20, 0.22, 0.26, 1.0), metallic=0.6, roughness=0.4),
        baseboard_mat=mat_steel(),
        north_y=6.0,
        west_x=-7.0,
        wall_height=3.6,
        has_window=True,
        window_pos=(0, 6.0, 2.0),
        window_size=(4.8, 2.0)
    )

    # 2. Control_Console (Curved telemetry console at X=0, Y=+2.8, Z=0)
    cc_base = create_box("cc_b", (0, 0, 0.45), (1.60, 0.75, 0.90), mat_steel(), bevel=0.015)
    cc_top = create_box("cc_t", (0, 0, 0.93), (1.65, 0.80, 0.06), mat_black_marble())
    cc_screen1 = create_box("cc_s1", (-0.40, -0.10, 1.20), (0.55, 0.03, 0.38), mat_screen((0.1, 0.85, 1.0, 1.0), 3.5, "Telemetry_HUD"), rotation=(math.radians(20), 0, 0))
    cc_screen2 = create_box("cc_s2", (0.40, -0.10, 1.20), (0.55, 0.03, 0.38), mat_screen((0.1, 1.0, 0.4, 1.0), 3.5, "Radar_HUD"), rotation=(math.radians(20), 0, 0))
    console = join_as_named_object([cc_base, cc_top, cc_screen1, cc_screen2], "Control_Console")
    place_on_surface(console, 0.0, 2.8, 0.0)

    # 3. Astronaut_Helmet on pedestal (at X=-3.5, Y=+0.8, Z=0)
    ah_ped = create_cylinder("ah_pd", (0, 0, 0.45), 0.22, 0.90, mat_steel())
    ah_shell = create_sphere("ah_sh", (0, 0, 1.10), 0.18, mat_porcelain(), scale=(1.05, 1.15, 1.1))
    ah_visor = create_sphere("ah_vs", (0, -0.06, 1.11), 0.145, mat_gold(), scale=(1.02, 1.15, 0.9))
    ah_ring = create_torus("ah_rg", (0, 0, 0.93), 0.14, 0.022, mat_steel())
    helmet = join_as_named_object([ah_ped, ah_shell, ah_visor, ah_ring], "Astronaut_Helmet")
    place_on_surface(helmet, -3.5, 0.8, 0.0)

    # 4. Oxygen_Tank (Mounted on left wall bracket at X=-5.8, Y=+1.5, Z=0)
    t1 = create_cylinder("ot_t1", (-0.14, 0, 0.65), 0.12, 0.90, mat_porcelain())
    c1_t = create_sphere("ot_c1t", (-0.14, 0, 1.10), 0.12, mat_porcelain())
    c1_b = create_sphere("ot_c1b", (-0.14, 0, 0.20), 0.12, mat_porcelain())
    t2 = create_cylinder("ot_t2", (0.14, 0, 0.65), 0.12, 0.90, mat_porcelain())
    c2_t = create_sphere("ot_c2t", (0.14, 0, 1.10), 0.12, mat_porcelain())
    c2_b = create_sphere("ot_c2b", (0.14, 0, 0.20), 0.12, mat_porcelain())
    ot_pipe = create_torus("ot_pp", (0, 0, 1.18), 0.14, 0.016, mat_chrome())
    oxygen = join_as_named_object([t1, c1_t, c1_b, t2, c2_t, c2_b, ot_pipe], "Oxygen_Tank")
    place_on_surface(oxygen, -5.8, 1.5, 0.0)

    # 5. Robotic_Arm (X=+4.2, Y=+2.2, Z=0)
    ra_base = create_cylinder("ra_bs", (0, 0, 0.15), 0.28, 0.30, mat_steel())
    ra_seg1 = create_cylinder("ra_s1", (0, 0, 0.85), 0.08, 1.10, mat_porcelain(), rotation=(math.radians(25), 0, 0))
    ra_knuckle = create_sphere("ra_kn", (0, 0.24, 1.35), 0.12, mat_steel())
    ra_seg2 = create_cylinder("ra_s2", (0, 0.45, 1.85), 0.07, 0.95, mat_porcelain(), rotation=(math.radians(-35), 0, 0))
    ra_claw = create_torus("ra_cl", (0, 0.65, 2.25), 0.09, 0.018, mat_steel())
    arm = join_as_named_object([ra_base, ra_seg1, ra_knuckle, ra_seg2, ra_claw], "Robotic_Arm")
    place_on_surface(arm, 4.2, 2.2, 0.0)

    # 6. Space_Telescope (Observation bay X=0, Y=-1.2, Z=0)
    st_tripod = create_cylinder("st_tr", (0, 0, 0.45), 0.03, 0.90, mat_steel(), rotation=(math.radians(15), 0, 0))
    st_mount = create_cylinder("st_mt", (0, 0, 0.95), 0.10, 0.15, mat_steel())
    st_body = create_cylinder("st_bd", (0, 0, 1.25), 0.18, 0.90, mat_gold(), rotation=(math.radians(40), 0, 0))
    st_shade = create_cylinder("st_sh", (0, -0.32, 1.52), 0.20, 0.22, mat_steel(), rotation=(math.radians(40), 0, 0))
    telescope = join_as_named_object([st_tripod, st_mount, st_body, st_shade], "Space_Telescope")
    place_on_surface(telescope, 0.0, -1.2, 0.0)

    # 7. Hydroponic_Pod (X=+4.2, Y=-1.8, Z=0)
    hp_base = create_cylinder("hp_bs", (0, 0, 0.20), 0.42, 0.40, mat_steel())
    hp_glass = create_cylinder("hp_gl", (0, 0, 1.05), 0.38, 1.30, mat_glass())
    hp_cap = create_cylinder("hp_cp", (0, 0, 1.75), 0.42, 0.15, mat_steel())
    hp_light = create_cylinder("hp_lt", (0, 0, 1.05), 0.04, 1.25, mat_screen((0.95, 0.1, 0.7, 1.0), 3.5, "Grow_Light"))
    hp_plant = create_sphere("hp_pl", (0, 0, 0.80), 0.28, get_material("Bio_Green", (0.1, 0.8, 0.2, 1.0), roughness=0.5))
    pod = join_as_named_object([hp_base, hp_glass, hp_cap, hp_light, hp_plant], "Hydroponic_Pod")
    place_on_surface(pod, 4.2, -1.8, 0.0)

    # 8. Airlock_Door (Left wall X=-6.2, Y=-2.0, Z=0)
    al_frame = create_cylinder("al_fr", (0, 0, 1.40), 1.15, 0.20, mat_steel(), rotation=(math.radians(90), 0, 0))
    al_door = create_cylinder("al_dr", (0, 0.04, 1.40), 1.00, 0.12, get_material("Hazard_Yellow", (0.95, 0.78, 0.08, 1.0), roughness=0.4), rotation=(math.radians(90), 0, 0))
    al_wheel = create_torus("al_wh", (0, -0.08, 1.40), 0.28, 0.035, mat_chrome(), rotation=(math.radians(90), 0, 0))
    airlock = join_as_named_object([al_frame, al_door, al_wheel], "Airlock_Door")
    place_on_surface(airlock, -6.2, -2.0, 0.0)

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "space.glb"))
    print("WORLD 7 (SPACE) EXPORTED SUCCESSFULLY!\n")


if __name__ == "__main__":
    build_house()
    build_supermarket()
    build_restaurant()
    build_hotel()
    build_dating()
    build_garden()
    build_space()
