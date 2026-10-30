import bpy
import math
import os
import sys

# Ensure current script folder is on sys.path
script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)

from core import (
    reset_scene, get_material, create_box, create_cylinder, 
    create_sphere, create_torus, join_objects, export_glb, apply_bevel_and_normals
)

OUTPUT_WORLDS_DIR = r"C:\Users\alessandro\Desktop\ENGLISH\assets\models\worlds"

# ==============================================================================
# WORLD 1: HOUSE.GLB
# ==============================================================================
def build_house():
    reset_scene()
    print("Building World: House...")
    
    # Common Materials
    mat_floor = get_material("Wood_Floor", base_color=(0.55, 0.40, 0.28, 1.0), roughness=0.35)
    mat_counter = get_material("Granite_Counter", base_color=(0.20, 0.22, 0.25, 1.0), roughness=0.2, metallic=0.1)
    mat_steel = get_material("Brushed_Steel", base_color=(0.78, 0.80, 0.82, 1.0), metallic=0.92, roughness=0.22)
    mat_chrome = get_material("Polished_Chrome", base_color=(0.95, 0.95, 0.96, 1.0), metallic=0.98, roughness=0.08)
    mat_glass = get_material("Clear_Glass", base_color=(0.9, 0.95, 1.0, 1.0), roughness=0.05, transmission=0.95, ior=1.52)
    mat_dark_glass = get_material("Dark_Glass", base_color=(0.1, 0.12, 0.15, 1.0), roughness=0.1, transmission=0.8, ior=1.5)
    mat_plastic_blk = get_material("Matte_Black", base_color=(0.08, 0.08, 0.09, 1.0), roughness=0.6)
    mat_screen = get_material("Screen_Glow", base_color=(0.1, 0.6, 0.9, 1.0), emission=(0.1, 0.7, 1.0, 1.0), emission_strength=2.5)
    mat_led_red = get_material("LED_Red", base_color=(1.0, 0.1, 0.1, 1.0), emission=(1.0, 0.05, 0.05, 1.0), emission_strength=3.0)
    mat_fabric = get_material("Sofa_Fabric", base_color=(0.28, 0.38, 0.52, 1.0), roughness=0.85)
    mat_cushion_gold = get_material("Cushion_Gold", base_color=(0.85, 0.65, 0.25, 1.0), roughness=0.75)
    mat_wood = get_material("Dark_Wood", base_color=(0.30, 0.18, 0.10, 1.0), roughness=0.45)
    mat_ceramic = get_material("White_Ceramic", base_color=(0.95, 0.95, 0.95, 1.0), roughness=0.15)
    mat_toast = get_material("Toast_Bread", base_color=(0.75, 0.52, 0.28, 1.0), roughness=0.8)

    # 1. Architectural Base
    create_box("Room_Floor", (0, 0, -0.05), (10.0, 10.0, 0.1), mat_floor, bevel=0.0)
    create_box("Kitchen_Counter", (-2.5, 2.5, 0.45), (3.6, 1.0, 0.9), mat_counter)
    create_box("Living_Table", (1.5, -0.5, 0.25), (1.6, 1.0, 0.5), mat_wood)

    # 2. Microwave
    mw_body = create_box("mw_b", (-3.5, 2.5, 1.15), (0.65, 0.42, 0.38), mat_steel)
    mw_door = create_box("mw_d", (-3.5, 2.30, 1.15), (0.42, 0.02, 0.30), mat_dark_glass)
    mw_handle = create_cylinder("mw_h", (-3.70, 2.27, 1.15), 0.012, 0.26, mat_chrome, rotation=(math.radians(90), 0, 0))
    mw_panel = create_box("mw_p", (-3.25, 2.30, 1.15), (0.16, 0.02, 0.30), mat_plastic_blk)
    mw_led = create_box("mw_l", (-3.25, 2.28, 1.25), (0.12, 0.01, 0.05), mat_screen)
    join_objects("Microwave", [mw_body, mw_door, mw_handle, mw_panel, mw_led])

    # 3. Blender
    bl_base = create_cylinder("bl_b", (-2.7, 2.5, 1.02), 0.12, 0.20, mat_steel)
    bl_knob = create_cylinder("bl_k", (-2.7, 2.37, 1.02), 0.03, 0.03, mat_chrome, rotation=(math.radians(90), 0, 0))
    bl_jar = create_cylinder("bl_j", (-2.7, 2.5, 1.30), 0.10, 0.36, mat_glass)
    bl_lid = create_cylinder("bl_l", (-2.7, 2.5, 1.50), 0.11, 0.04, mat_plastic_blk)
    bl_handle = create_torus("bl_h", (-2.59, 2.5, 1.30), 0.07, 0.015, mat_plastic_blk, rotation=(0, math.radians(90), 0))
    join_objects("Blender", [bl_base, bl_knob, bl_jar, bl_lid, bl_handle])

    # 4. Toaster
    to_body = create_box("to_b", (-2.0, 2.5, 1.03), (0.34, 0.20, 0.24), mat_chrome)
    to_lever = create_box("to_l", (-2.18, 2.5, 1.03), (0.04, 0.03, 0.03), mat_plastic_blk)
    to_toast1 = create_box("to_t1", (-2.0, 2.45, 1.16), (0.16, 0.03, 0.12), mat_toast)
    to_toast2 = create_box("to_t2", (-2.0, 2.55, 1.16), (0.16, 0.03, 0.12), mat_toast)
    join_objects("Toaster", [to_body, to_lever, to_toast1, to_toast2])

    # 5. Coffee_Maker
    cf_base = create_box("cf_b", (-1.4, 2.5, 0.95), (0.30, 0.32, 0.10), mat_plastic_blk)
    cf_col = create_box("cf_c", (-1.4, 2.62, 1.15), (0.28, 0.10, 0.38), mat_steel)
    cf_top = create_box("cf_t", (-1.4, 2.5, 1.36), (0.28, 0.30, 0.08), mat_plastic_blk)
    cf_pot = create_sphere("cf_p", (-1.4, 2.44, 1.08), 0.10, mat_glass, scale=(1.0, 1.0, 1.2))
    cf_pothandle = create_torus("cf_ph", (-1.4, 2.33, 1.08), 0.06, 0.012, mat_plastic_blk)
    cf_light = create_sphere("cf_led", (-1.3, 2.34, 0.95), 0.012, mat_led_red)
    join_objects("Coffee_Maker", [cf_base, cf_col, cf_top, cf_pot, cf_pothandle, cf_light])

    # 6. Refrigerator
    rf_body = create_box("rf_b", (-4.3, 2.5, 1.05), (0.90, 0.85, 2.10), mat_steel)
    rf_door_l = create_box("rf_dl", (-4.52, 2.06, 1.35), (0.42, 0.03, 1.40), mat_steel)
    rf_door_r = create_box("rf_dr", (-4.08, 2.06, 1.35), (0.42, 0.03, 1.40), mat_steel)
    rf_dispenser = create_box("rf_disp", (-4.52, 2.04, 1.40), (0.20, 0.02, 0.28), mat_plastic_blk)
    rf_disp_led = create_box("rf_dled", (-4.52, 2.03, 1.50), (0.12, 0.01, 0.04), mat_screen)
    rf_freezer = create_box("rf_fz", (-4.3, 2.06, 0.35), (0.86, 0.03, 0.62), mat_steel)
    rf_hl = create_cylinder("rf_hl", (-4.34, 2.03, 1.35), 0.015, 0.80, mat_chrome)
    rf_hr = create_cylinder("rf_hr", (-4.26, 2.03, 1.35), 0.015, 0.80, mat_chrome)
    join_objects("Refrigerator", [rf_body, rf_door_l, rf_door_r, rf_dispenser, rf_disp_led, rf_freezer, rf_hl, rf_hr])

    # 7. Sofa
    sofa_base = create_box("sf_b", (1.5, -2.2, 0.25), (2.4, 0.95, 0.35), mat_wood)
    sofa_seat1 = create_box("sf_s1", (0.8, -2.1, 0.50), (0.70, 0.75, 0.22), mat_fabric, bevel=0.03)
    sofa_seat2 = create_box("sf_s2", (1.5, -2.1, 0.50), (0.70, 0.75, 0.22), mat_fabric, bevel=0.03)
    sofa_seat3 = create_box("sf_s3", (2.2, -2.1, 0.50), (0.70, 0.75, 0.22), mat_fabric, bevel=0.03)
    sofa_back = create_box("sf_bk", (1.5, -2.60, 0.80), (2.4, 0.24, 0.65), mat_fabric, bevel=0.03)
    sofa_arm_l = create_box("sf_al", (0.35, -2.1, 0.62), (0.25, 0.90, 0.45), mat_fabric, bevel=0.02)
    sofa_arm_r = create_box("sf_ar", (2.65, -2.1, 0.62), (0.25, 0.90, 0.45), mat_fabric, bevel=0.02)
    sofa_pillow1 = create_box("sf_p1", (0.65, -2.3, 0.70), (0.35, 0.15, 0.35), mat_cushion_gold, bevel=0.03, rotation=(0, 0, math.radians(15)))
    sofa_pillow2 = create_box("sf_p2", (2.35, -2.3, 0.70), (0.35, 0.15, 0.35), mat_cushion_gold, bevel=0.03, rotation=(0, 0, math.radians(-15)))
    join_objects("Sofa", [sofa_base, sofa_seat1, sofa_seat2, sofa_seat3, sofa_back, sofa_arm_l, sofa_arm_r, sofa_pillow1, sofa_pillow2])

    # 8. Laptop
    lp_base = create_box("lp_b", (1.2, -0.5, 0.52), (0.36, 0.26, 0.015), mat_steel)
    lp_keys = create_box("lp_k", (1.2, -0.47, 0.53), (0.32, 0.14, 0.005), mat_plastic_blk)
    lp_track = create_box("lp_t", (1.2, -0.58, 0.53), (0.12, 0.07, 0.003), mat_chrome)
    lp_screen_lid = create_box("lp_sl", (1.2, -0.37, 0.64), (0.36, 0.012, 0.24), mat_steel, rotation=(math.radians(-25), 0, 0))
    lp_display = create_box("lp_disp", (1.2, -0.375, 0.64), (0.34, 0.005, 0.22), mat_screen, rotation=(math.radians(-25), 0, 0))
    join_objects("Laptop", [lp_base, lp_keys, lp_track, lp_screen_lid, lp_display])

    # 9. Remote_Control
    rc_body = create_box("rc_b", (1.8, -0.5, 0.52), (0.07, 0.22, 0.022), mat_plastic_blk, bevel=0.008)
    rc_pwr = create_cylinder("rc_pwr", (1.78, -0.42, 0.535), 0.008, 0.006, mat_led_red)
    rc_dpad = create_cylinder("rc_dp", (1.8, -0.47, 0.535), 0.022, 0.005, mat_chrome)
    rc_btn1 = create_box("rc_b1", (1.78, -0.54, 0.535), (0.015, 0.03, 0.004), mat_steel)
    rc_btn2 = create_box("rc_b2", (1.82, -0.54, 0.535), (0.015, 0.03, 0.004), mat_steel)
    join_objects("Remote_Control", [rc_body, rc_pwr, rc_dpad, rc_btn1, rc_btn2])

    # 10. Bathroom Vanity on side
    create_box("Bathroom_Vanity", (-0.5, 2.5, 0.45), (1.4, 0.8, 0.9), mat_wood)
    create_box("Sink_Basin", (-0.5, 2.5, 0.88), (0.70, 0.50, 0.15), mat_ceramic)

    # 11. Toothbrush
    tb_handle = create_cylinder("tb_h", (-0.75, 2.35, 1.05), 0.010, 0.22, mat_chrome, rotation=(0, math.radians(15), 0))
    tb_grip = create_cylinder("tb_g", (-0.75, 2.35, 1.02), 0.012, 0.10, mat_screen, rotation=(0, math.radians(15), 0))
    tb_head = create_box("tb_hd", (-0.71, 2.35, 1.18), (0.016, 0.014, 0.05), mat_ceramic)
    join_objects("Toothbrush", [tb_handle, tb_grip, tb_head])

    # 12. Soap_Dispenser
    sd_bottle = create_cylinder("sd_b", (-0.25, 2.35, 1.00), 0.05, 0.16, mat_ceramic)
    sd_pump = create_cylinder("sd_p", (-0.25, 2.35, 1.11), 0.015, 0.06, mat_chrome)
    sd_nozzle = create_box("sd_n", (-0.25, 2.32, 1.13), (0.015, 0.05, 0.015), mat_chrome)
    join_objects("Soap_Dispenser", [sd_bottle, sd_pump, sd_nozzle])

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "house.glb"))

# ==============================================================================
# WORLD 2: SUPERMARKET.GLB
# ==============================================================================
def build_supermarket():
    reset_scene()
    print("Building World: Supermarket...")

    mat_floor = get_material("Supermarket_Tiles", base_color=(0.85, 0.86, 0.88, 1.0), roughness=0.25)
    mat_shelf = get_material("Gondola_Metal", base_color=(0.82, 0.84, 0.85, 1.0), metallic=0.7, roughness=0.3)
    mat_cereal_box = get_material("Cereal_Art", base_color=(0.95, 0.70, 0.10, 1.0), roughness=0.45)
    mat_cereal_red = get_material("Cereal_Banner", base_color=(0.88, 0.15, 0.12, 1.0), roughness=0.45)
    mat_mayo_jar = get_material("Mayo_Jar", base_color=(0.96, 0.95, 0.88, 1.0), roughness=0.25, transmission=0.4)
    mat_mayo_blue = get_material("Mayo_Cap_Blue", base_color=(0.08, 0.32, 0.85, 1.0), roughness=0.35)
    mat_cream = get_material("Cream_Carton", base_color=(0.98, 0.95, 0.90, 1.0), roughness=0.4)
    mat_milk = get_material("Milk_Carton_Blue", base_color=(0.20, 0.55, 0.95, 1.0), roughness=0.4)
    mat_egg_carton = get_material("Egg_Pulp", base_color=(0.78, 0.73, 0.65, 1.0), roughness=0.9)
    mat_tuna = get_material("Tuna_Can", base_color=(0.70, 0.75, 0.80, 1.0), metallic=0.9, roughness=0.2)
    mat_tuna_label = get_material("Tuna_Blue", base_color=(0.10, 0.35, 0.75, 1.0), roughness=0.4)
    mat_bread = get_material("Bread_Crust", base_color=(0.82, 0.60, 0.32, 1.0), roughness=0.85)
    mat_ketchup = get_material("Ketchup_Red", base_color=(0.85, 0.08, 0.05, 1.0), roughness=0.25)
    mat_oil = get_material("Cooking_Oil_Gold", base_color=(0.92, 0.75, 0.15, 1.0), roughness=0.15, transmission=0.7)
    mat_counter = get_material("Checkout_Belt", base_color=(0.15, 0.15, 0.16, 1.0), roughness=0.5)
    mat_screen = get_material("POS_Screen", base_color=(0.1, 0.8, 0.3, 1.0), emission=(0.1, 0.9, 0.4, 1.0), emission_strength=2.2)
    mat_chrome = get_material("Cart_Steel", base_color=(0.92, 0.92, 0.94, 1.0), metallic=0.95, roughness=0.15)
    mat_cart_red = get_material("Cart_Plastic_Red", base_color=(0.9, 0.12, 0.12, 1.0), roughness=0.4)

    # Architectural floor
    create_box("Supermarket_Floor", (0, 0, -0.05), (12.0, 12.0, 0.1), mat_floor, bevel=0.0)

    # 1. Gondola_Aisle
    gn_base = create_box("gn_b", (-2.0, 0, 0.1), (1.4, 4.0, 0.2), mat_shelf)
    gn_wall = create_box("gn_w", (-2.0, 0, 1.1), (0.15, 4.0, 2.0), mat_shelf)
    gn_sh1 = create_box("gn_s1", (-2.0, 0, 0.6), (1.2, 3.9, 0.04), mat_shelf)
    gn_sh2 = create_box("gn_s2", (-2.0, 0, 1.1), (1.2, 3.9, 0.04), mat_shelf)
    gn_sh3 = create_box("gn_s3", (-2.0, 0, 1.6), (1.2, 3.9, 0.04), mat_shelf)
    join_objects("Gondola_Aisle", [gn_base, gn_wall, gn_sh1, gn_sh2, gn_sh3])

    # 2. Cereal_Box
    cb_box = create_box("cb_b", (-1.7, 1.2, 1.25), (0.10, 0.26, 0.36), mat_cereal_box, bevel=0.01)
    cb_banner = create_box("cb_bn", (-1.65, 1.2, 1.35), (0.01, 0.24, 0.10), mat_cereal_red)
    join_objects("Cereal_Box", [cb_box, cb_banner])

    # 3. Mayonnaise
    my_jar = create_cylinder("my_j", (-1.7, 0.7, 1.20), 0.065, 0.16, mat_mayo_jar)
    my_cap = create_cylinder("my_c", (-1.7, 0.7, 1.29), 0.068, 0.03, mat_mayo_blue)
    join_objects("Mayonnaise", [my_jar, my_cap])

    # 4. Table_Cream
    tc_carton = create_box("tc_c", (-1.7, 0.2, 1.18), (0.08, 0.14, 0.14), mat_cream, bevel=0.008)
    tc_cap = create_cylinder("tc_cp", (-1.7, 0.2, 1.26), 0.02, 0.02, mat_cereal_red)
    join_objects("Table_Cream", [tc_carton, tc_cap])

    # 5. Milk_Carton
    mc_body = create_box("mc_b", (-1.7, -0.3, 1.22), (0.10, 0.10, 0.22), mat_milk, bevel=0.008)
    mc_gable = create_box("mc_g", (-1.7, -0.3, 1.35), (0.10, 0.06, 0.06), mat_cream, rotation=(0, 0, math.radians(45)))
    join_objects("Milk_Carton", [mc_body, mc_gable])

    # 6. Egg_Carton
    ec_body = create_box("ec_b", (-1.7, -0.8, 1.15), (0.24, 0.36, 0.09), mat_egg_carton, bevel=0.012)
    join_objects("Egg_Carton", [ec_body])

    # 7. Canned_Tuna
    tu_can = create_cylinder("tu_c", (-1.7, -1.3, 1.14), 0.06, 0.06, mat_tuna)
    tu_label = create_cylinder("tu_l", (-1.7, -1.3, 1.14), 0.061, 0.045, mat_tuna_label)
    join_objects("Canned_Tuna", [tu_can, tu_label])

    # 8. Sliced_Bread
    br_body = create_box("br_b", (-1.7, 1.2, 0.72), (0.14, 0.32, 0.14), mat_bread, bevel=0.02)
    br_tie = create_torus("br_t", (-1.7, 1.38, 0.72), 0.03, 0.008, mat_mayo_blue)
    join_objects("Sliced_Bread", [br_body, br_tie])

    # 9. Ketchup
    kt_body = create_cylinder("kt_b", (-1.7, 0.7, 0.72), 0.05, 0.20, mat_ketchup)
    kt_cap = create_cylinder("kt_c", (-1.7, 0.7, 0.83), 0.022, 0.04, mat_cream)
    join_objects("Ketchup", [kt_body, kt_cap])

    # 10. Cooking_Oil
    ol_bot = create_cylinder("ol_b", (-1.7, 0.2, 0.74), 0.055, 0.24, mat_oil)
    ol_cap = create_cylinder("ol_c", (-1.7, 0.2, 0.87), 0.025, 0.03, mat_cereal_box)
    join_objects("Cooking_Oil", [ol_bot, ol_cap])

    # 11. Checkout Counter
    create_box("Checkout_Counter", (1.8, 0, 0.45), (1.2, 3.2, 0.9), mat_counter)

    # 12. Cash_Register
    cr_drawer = create_box("cr_d", (1.8, -0.6, 0.94), (0.42, 0.44, 0.10), mat_shelf)
    cr_keypad = create_box("cr_k", (1.8, -0.55, 1.02), (0.32, 0.24, 0.06), mat_counter, rotation=(math.radians(20), 0, 0))
    cr_screen = create_box("cr_s", (1.8, -0.38, 1.18), (0.34, 0.03, 0.22), mat_shelf, rotation=(math.radians(-15), 0, 0))
    cr_display = create_box("cr_dp", (1.8, -0.395, 1.18), (0.30, 0.01, 0.18), mat_screen, rotation=(math.radians(-15), 0, 0))
    join_objects("Cash_Register", [cr_drawer, cr_keypad, cr_screen, cr_display])

    # 13. Barcode_Scanner
    bs_base = create_box("bs_b", (2.1, -0.1, 0.93), (0.10, 0.12, 0.06), mat_counter)
    bs_gun = create_box("bs_g", (2.1, -0.1, 1.03), (0.07, 0.16, 0.14), mat_cart_red, bevel=0.01)
    bs_laser = create_box("bs_l", (2.1, -0.18, 1.06), (0.04, 0.01, 0.03), mat_screen)
    join_objects("Barcode_Scanner", [bs_base, bs_gun, bs_laser])

    # 14. Card_Reader
    crd_body = create_box("crd_b", (1.5, 0.3, 0.96), (0.12, 0.20, 0.08), mat_counter, rotation=(math.radians(20), 0, 0))
    crd_scr = create_box("crd_s", (1.5, 0.34, 1.01), (0.09, 0.07, 0.01), mat_screen, rotation=(math.radians(20), 0, 0))
    join_objects("Card_Reader", [crd_body, crd_scr])

    # 15. Shopping_Cart
    sc_basket = create_box("sc_bk", (1.8, 1.5, 0.70), (0.65, 0.85, 0.45), mat_chrome, bevel=0.02)
    sc_handle = create_cylinder("sc_h", (1.8, 1.95, 0.95), 0.018, 0.60, mat_cart_red, rotation=(0, math.radians(90), 0))
    sc_wheel1 = create_cylinder("sc_w1", (1.55, 1.15, 0.10), 0.06, 0.04, mat_counter, rotation=(math.radians(90), 0, 0))
    sc_wheel2 = create_cylinder("sc_w2", (2.05, 1.15, 0.10), 0.06, 0.04, mat_counter, rotation=(math.radians(90), 0, 0))
    sc_wheel3 = create_cylinder("sc_w3", (1.55, 1.85, 0.10), 0.06, 0.04, mat_counter, rotation=(math.radians(90), 0, 0))
    sc_wheel4 = create_cylinder("sc_w4", (2.05, 1.85, 0.10), 0.06, 0.04, mat_counter, rotation=(math.radians(90), 0, 0))
    join_objects("Shopping_Cart", [sc_basket, sc_handle, sc_wheel1, sc_wheel2, sc_wheel3, sc_wheel4])

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "supermarket.glb"))

# ==============================================================================
# WORLD 3: RESTAURANT.GLB
# ==============================================================================
def build_restaurant():
    reset_scene()
    print("Building World: Restaurant...")

    mat_floor = get_material("Restaurant_Parquet", base_color=(0.35, 0.22, 0.14, 1.0), roughness=0.3)
    mat_cloth = get_material("Table_Linen", base_color=(0.95, 0.94, 0.92, 1.0), roughness=0.8)
    mat_porcelain = get_material("Fine_Porcelain", base_color=(0.98, 0.98, 0.98, 1.0), roughness=0.1)
    mat_steak = get_material("Gourmet_Steak", base_color=(0.38, 0.18, 0.12, 1.0), roughness=0.6)
    mat_silver = get_material("Silverware", base_color=(0.95, 0.95, 0.96, 1.0), metallic=0.98, roughness=0.08)
    mat_crystal = get_material("Crystal_Glass", base_color=(0.98, 0.99, 1.0, 1.0), roughness=0.02, transmission=0.98, ior=1.54)
    mat_redwine = get_material("Red_Wine", base_color=(0.45, 0.02, 0.06, 1.0), roughness=0.1, transmission=0.75, ior=1.36)
    mat_leather = get_material("Menu_Leather", base_color=(0.18, 0.08, 0.05, 1.0), roughness=0.5)
    mat_gold_stamp = get_material("Gold_Foil", base_color=(0.95, 0.80, 0.20, 1.0), metallic=0.95, roughness=0.2)
    mat_oil = get_material("EVOO_Olive_Oil", base_color=(0.58, 0.65, 0.15, 1.0), roughness=0.15, transmission=0.85)
    mat_espresso_steel = get_material("Espresso_Chrome", base_color=(0.88, 0.90, 0.92, 1.0), metallic=0.95, roughness=0.12)
    mat_wood = get_material("Walnut_Wood", base_color=(0.28, 0.16, 0.08, 1.0), roughness=0.4)

    create_box("Restaurant_Floor", (0, 0, -0.05), (10.0, 10.0, 0.1), mat_floor, bevel=0.0)

    # 1. Dressed Dining Table & Chairs
    tbl_top = create_cylinder("tbl_t", (0, 0, 0.74), 0.85, 0.05, mat_cloth)
    tbl_cloth = create_cylinder("tbl_cl", (0, 0, 0.50), 0.83, 0.45, mat_cloth)
    tbl_leg = create_cylinder("tbl_l", (0, 0, 0.36), 0.08, 0.72, mat_wood)
    tbl_base = create_cylinder("tbl_b", (0, 0, 0.02), 0.42, 0.04, mat_silver)
    join_objects("Dining_Table", [tbl_top, tbl_cloth, tbl_leg, tbl_base])

    # 2. Main_Course
    pl_rim = create_cylinder("pl_r", (0, 0, 0.77), 0.22, 0.02, mat_porcelain)
    pl_food = create_box("pl_f", (0, 0, 0.79), (0.16, 0.11, 0.035), mat_steak, bevel=0.015)
    pl_garnish = create_sphere("pl_g", (0.06, 0.06, 0.80), 0.025, mat_oil)
    join_objects("Main_Course", [pl_rim, pl_food, pl_garnish])

    # 3. Cutlery: Fork, Knife, Spoon
    fk_handle = create_box("fk_h", (-0.30, 0, 0.77), (0.025, 0.22, 0.008), mat_silver)
    fk_tines = create_box("fk_t", (-0.30, 0.12, 0.77), (0.032, 0.06, 0.006), mat_silver)
    join_objects("Fork", [fk_handle, fk_tines])

    kn_handle = create_box("kn_h", (0.30, 0, 0.77), (0.025, 0.22, 0.008), mat_silver)
    kn_blade = create_box("kn_b", (0.30, 0.13, 0.77), (0.022, 0.08, 0.004), mat_silver)
    join_objects("Knife", [kn_handle, kn_blade])

    sp_handle = create_box("sp_h", (0.38, 0, 0.77), (0.022, 0.20, 0.008), mat_silver)
    sp_bowl = create_sphere("sp_b", (0.38, 0.12, 0.77), 0.028, mat_silver, scale=(0.8, 1.4, 0.4))
    join_objects("Spoon", [sp_handle, sp_bowl])

    # 4. Wine_Glass
    wg_base = create_cylinder("wg_b", (0.22, 0.28, 0.77), 0.045, 0.008, mat_crystal)
    wg_stem = create_cylinder("wg_s", (0.22, 0.28, 0.84), 0.006, 0.14, mat_crystal)
    wg_bowl = create_sphere("wg_bw", (0.22, 0.28, 0.94), 0.048, mat_crystal, scale=(1.0, 1.0, 1.4))
    wg_wine = create_sphere("wg_wn", (0.22, 0.28, 0.92), 0.042, mat_redwine, scale=(0.95, 0.95, 1.0))
    join_objects("Wine_Glass", [wg_base, wg_stem, wg_bowl, wg_wine])

    # 5. Napkin
    np_folded = create_box("np_f", (-0.45, 0, 0.78), (0.12, 0.22, 0.04), mat_cloth, bevel=0.015)
    join_objects("Napkin", [np_folded])

    # 6. Menu
    mn_cover = create_box("mn_c", (-0.18, 0.35, 0.78), (0.18, 0.26, 0.025), mat_leather, bevel=0.006)
    mn_gold = create_box("mn_g", (-0.18, 0.35, 0.795), (0.12, 0.14, 0.004), mat_gold_stamp)
    join_objects("Menu", [mn_cover, mn_gold])

    # 7. Salt_Pepper_Shakers
    shk_salt = create_cylinder("shk_s", (0.05, 0.32, 0.81), 0.025, 0.08, mat_crystal)
    shk_salt_cap = create_cylinder("shk_sc", (0.05, 0.32, 0.85), 0.026, 0.02, mat_silver)
    shk_pep = create_cylinder("shk_p", (-0.05, 0.32, 0.81), 0.025, 0.08, mat_crystal)
    shk_pep_cap = create_cylinder("shk_pc", (-0.05, 0.32, 0.85), 0.026, 0.02, mat_leather)
    join_objects("Salt_Pepper_Shakers", [shk_salt, shk_salt_cap, shk_pep, shk_pep_cap])

    # 8. Olive_Oil
    oo_cruet = create_cylinder("oo_c", (0, 0.44, 0.83), 0.038, 0.16, mat_oil)
    oo_neck = create_cylinder("oo_n", (0, 0.44, 0.93), 0.014, 0.06, mat_crystal)
    oo_spout = create_cylinder("oo_s", (0, 0.44, 0.97), 0.006, 0.04, mat_silver)
    join_objects("Olive_Oil", [oo_cruet, oo_neck, oo_spout])

    # 9. Espresso_Machine on Side Credenza
    create_box("Bar_Credenza", (-2.4, 0, 0.45), (1.0, 2.2, 0.9), mat_wood)
    em_body = create_box("em_b", (-2.4, 0, 1.20), (0.65, 0.85, 0.55), mat_espresso_steel)
    em_group1 = create_cylinder("em_g1", (-2.15, -0.2, 1.05), 0.04, 0.08, mat_silver)
    em_handle1 = create_cylinder("em_h1", (-2.0, -0.2, 1.05), 0.014, 0.18, mat_leather, rotation=(0, math.radians(90), 0))
    em_group2 = create_cylinder("em_g2", (-2.15, 0.2, 1.05), 0.04, 0.08, mat_silver)
    em_handle2 = create_cylinder("em_h2", (-2.0, 0.2, 1.05), 0.014, 0.18, mat_leather, rotation=(0, math.radians(90), 0))
    em_gauge = create_cylinder("em_gg", (-2.14, 0, 1.30), 0.03, 0.02, mat_gold_stamp, rotation=(0, math.radians(90), 0))
    join_objects("Espresso_Machine", [em_body, em_group1, em_handle1, em_group2, em_handle2, em_gauge])

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "restaurant.glb"))

# ==============================================================================
# WORLD 4: HOTEL.GLB
# ==============================================================================
def build_hotel():
    reset_scene()
    print("Building World: Hotel...")

    mat_floor = get_material("Hotel_Marble_Tile", base_color=(0.92, 0.90, 0.88, 1.0), roughness=0.15)
    mat_marble_desk = get_material("Calacatta_Gold", base_color=(0.96, 0.95, 0.93, 1.0), roughness=0.12)
    mat_brass = get_material("Polished_Brass", base_color=(0.95, 0.82, 0.35, 1.0), metallic=0.95, roughness=0.15)
    mat_gold = get_material("Luxury_Gold", base_color=(0.98, 0.85, 0.28, 1.0), metallic=0.98, roughness=0.10)
    mat_navy = get_material("Passport_Navy", base_color=(0.08, 0.14, 0.28, 1.0), roughness=0.6)
    mat_carpet_red = get_material("Velvet_Red", base_color=(0.65, 0.08, 0.12, 1.0), roughness=0.85)
    mat_leather_suit = get_material("Suitcase_Leather", base_color=(0.42, 0.24, 0.14, 1.0), roughness=0.4)
    mat_elevator_bronze = get_material("Brushed_Bronze", base_color=(0.58, 0.45, 0.35, 1.0), metallic=0.9, roughness=0.25)
    mat_screen = get_material("Digital_Display", base_color=(0.1, 0.8, 1.0, 1.0), emission=(0.2, 0.8, 1.0, 1.0), emission_strength=2.5)
    mat_steel = get_material("Safe_Steel", base_color=(0.25, 0.27, 0.30, 1.0), metallic=0.85, roughness=0.35)
    mat_bed_wood = get_material("Walnut_Headboard", base_color=(0.22, 0.12, 0.06, 1.0), roughness=0.4)
    mat_linen_white = get_material("Linen_White", base_color=(0.98, 0.98, 0.98, 1.0), roughness=0.75)

    create_box("Hotel_Lobby_Floor", (0, 0, -0.05), (12.0, 12.0, 0.1), mat_floor, bevel=0.0)

    # 1. Reception_Desk
    rd_base = create_box("rd_b", (0, 2.5, 0.55), (3.6, 1.1, 1.1), mat_marble_desk)
    rd_trim = create_box("rd_t", (0, 2.5, 1.12), (3.7, 1.15, 0.05), mat_brass)
    join_objects("Reception_Desk", [rd_base, rd_trim])

    # 2. Bellhop_Bell
    bb_base = create_cylinder("bb_b", (0.6, 2.1, 1.16), 0.06, 0.02, mat_brass)
    bb_dome = create_sphere("bb_d", (0.6, 2.1, 1.18), 0.045, mat_gold, scale=(1.0, 1.0, 0.6))
    bb_pin = create_cylinder("bb_p", (0.6, 2.1, 1.22), 0.008, 0.03, mat_brass)
    join_objects("Bellhop_Bell", [bb_base, bb_dome, bb_pin])

    # 3. Room_Keycard
    kc_card = create_box("kc_c", (-0.4, 2.1, 1.16), (0.09, 0.14, 0.005), mat_gold, bevel=0.004)
    kc_chip = create_box("kc_ch", (-0.4, 2.12, 1.165), (0.03, 0.025, 0.002), mat_brass)
    join_objects("Room_Keycard", [kc_card, kc_chip])

    # 4. Passport
    pp_cover = create_box("pp_c", (-0.7, 2.1, 1.16), (0.13, 0.18, 0.015), mat_navy, bevel=0.005)
    pp_crest = create_box("pp_cr", (-0.7, 2.1, 1.17), (0.06, 0.07, 0.002), mat_gold)
    join_objects("Passport", [pp_cover, pp_crest])

    # 5. Luggage_Cart & Suitcase
    lc_base = create_box("lc_b", (-2.5, 0.5, 0.12), (0.85, 1.4, 0.10), mat_carpet_red)
    lc_frame1 = create_cylinder("lc_f1", (-2.5, 0.5, 1.0), 0.02, 1.7, mat_brass)
    lc_top_arch = create_torus("lc_ta", (-2.5, 0.5, 1.85), 0.35, 0.02, mat_brass, rotation=(0, math.radians(90), 0))
    sc_body = create_box("sc_b", (-2.5, 0.5, 0.45), (0.32, 0.60, 0.55), mat_leather_suit, bevel=0.02)
    sc_handle = create_cylinder("sc_h", (-2.5, 0.5, 0.78), 0.014, 0.25, mat_brass, rotation=(0, math.radians(90), 0))
    join_objects("Luggage_Cart", [lc_base, lc_frame1, lc_top_arch])
    join_objects("Suitcase", [sc_body, sc_handle])

    # 6. Elevator
    el_frame = create_box("el_f", (3.2, 0, 1.6), (0.3, 2.2, 3.2), mat_elevator_bronze)
    el_door_l = create_box("el_dl", (3.08, -0.45, 1.3), (0.05, 0.85, 2.6), mat_steel)
    el_door_r = create_box("el_dr", (3.08, 0.45, 1.3), (0.05, 0.85, 2.6), mat_steel)
    el_screen = create_box("el_s", (3.06, 0, 2.8), (0.02, 0.4, 0.18), mat_screen)
    join_objects("Elevator", [el_frame, el_door_l, el_door_r, el_screen])

    # 7. Safe_Box
    sf_body = create_box("sf_b", (-2.8, 2.5, 0.4), (0.50, 0.48, 0.44), mat_steel)
    sf_door = create_box("sf_d", (-2.54, 2.5, 0.4), (0.04, 0.42, 0.38), mat_steel)
    sf_keypad = create_box("sf_k", (-2.51, 2.45, 0.4), (0.02, 0.10, 0.14), mat_brass)
    sf_wheel = create_cylinder("sf_w", (-2.51, 2.58, 0.4), 0.04, 0.03, mat_brass, rotation=(0, math.radians(90), 0))
    join_objects("Safe_Box", [sf_body, sf_door, sf_keypad, sf_wheel])

    # 8. King_Bed in Suite Corner
    kb_frame = create_box("kb_f", (0, -2.4, 0.25), (2.2, 2.4, 0.45), mat_bed_wood)
    kb_headboard = create_box("kb_h", (0, -3.55, 1.0), (2.3, 0.15, 1.6), mat_carpet_red, bevel=0.03)
    kb_mattress = create_box("kb_m", (0, -2.3, 0.58), (2.0, 2.2, 0.35), mat_linen_white, bevel=0.04)
    kb_pillow1 = create_box("kb_p1", (-0.55, -3.1, 0.82), (0.65, 0.42, 0.16), mat_linen_white, bevel=0.03)
    kb_pillow2 = create_box("kb_p2", (0.55, -3.1, 0.82), (0.65, 0.42, 0.16), mat_linen_white, bevel=0.03)
    join_objects("King_Bed", [kb_frame, kb_headboard, kb_mattress, kb_pillow1, kb_pillow2])

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "hotel.glb"))

# ==============================================================================
# WORLD 5: DATING.GLB
# ==============================================================================
def build_dating():
    reset_scene()
    print("Building World: Romantic Dating...")

    mat_terrace = get_material("Terrace_Stone", base_color=(0.25, 0.26, 0.28, 1.0), roughness=0.5)
    mat_iron = get_material("Wrought_Iron", base_color=(0.12, 0.12, 0.14, 1.0), metallic=0.85, roughness=0.35)
    mat_wood = get_material("Mahogany_Bistro", base_color=(0.32, 0.15, 0.10, 1.0), roughness=0.3)
    mat_candle_wax = get_material("Ivory_Wax", base_color=(0.96, 0.94, 0.88, 1.0), roughness=0.4)
    mat_flame = get_material("Candle_Flame", base_color=(1.0, 0.65, 0.15, 1.0), emission=(1.0, 0.6, 0.1, 1.0), emission_strength=4.0)
    mat_silver = get_material("Silver_Bucket", base_color=(0.95, 0.95, 0.96, 1.0), metallic=0.98, roughness=0.1)
    mat_champ_glass = get_material("Champagne_Glass", base_color=(0.15, 0.35, 0.18, 1.0), roughness=0.1, transmission=0.8)
    mat_gold_foil = get_material("Gold_Foil_Wrap", base_color=(0.95, 0.82, 0.28, 1.0), metallic=0.96, roughness=0.15)
    mat_rose_red = get_material("Rose_Petal", base_color=(0.78, 0.04, 0.10, 1.0), roughness=0.6)
    mat_rose_leaf = get_material("Rose_Leaf", base_color=(0.12, 0.42, 0.15, 1.0), roughness=0.5)
    mat_violin_wood = get_material("Violin_Spruce", base_color=(0.62, 0.35, 0.12, 1.0), roughness=0.25)
    mat_ebony = get_material("Violin_Ebony", base_color=(0.06, 0.06, 0.07, 1.0), roughness=0.3)
    mat_velvet = get_material("Royal_Blue_Velvet", base_color=(0.05, 0.12, 0.38, 1.0), roughness=0.8)
    mat_diamond = get_material("Diamond_Gem", base_color=(0.98, 0.99, 1.0, 1.0), roughness=0.01, transmission=0.99, ior=2.42)
    mat_choc = get_material("Dark_Chocolate", base_color=(0.18, 0.10, 0.06, 1.0), roughness=0.35)
    mat_plate = get_material("Porcelain_Plate", base_color=(0.98, 0.98, 0.98, 1.0), roughness=0.1)
    mat_wine_leather = get_material("Wine_List_Leather", base_color=(0.35, 0.05, 0.10, 1.0), roughness=0.5)

    create_box("Romantic_Terrace_Floor", (0, 0, -0.05), (10.0, 10.0, 0.1), mat_terrace, bevel=0.0)

    # 1. Bistro_Table
    bt_top = create_cylinder("bt_t", (0, 0, 0.74), 0.65, 0.04, mat_wood)
    bt_pole = create_cylinder("bt_p", (0, 0, 0.36), 0.04, 0.72, mat_iron)
    bt_legs = create_torus("bt_l", (0, 0, 0.05), 0.35, 0.03, mat_iron)
    join_objects("Bistro_Table", [bt_top, bt_pole, bt_legs])

    # 2. Candle (Triple Candelabrum)
    cd_base = create_cylinder("cd_b", (0, 0, 0.77), 0.06, 0.02, mat_silver)
    cd_stalk = create_cylinder("cd_st", (0, 0, 0.88), 0.015, 0.20, mat_silver)
    cd_wax = create_cylinder("cd_wx", (0, 0, 1.04), 0.016, 0.14, mat_candle_wax)
    cd_flame = create_sphere("cd_fl", (0, 0, 1.13), 0.015, mat_flame, scale=(0.8, 0.8, 1.5))
    join_objects("Candle", [cd_base, cd_stalk, cd_wax, cd_flame])

    # 3. Champagne_Bottle & Ice Bucket
    cb_bucket = create_cylinder("cb_bkt", (0.35, 0.15, 0.84), 0.11, 0.18, mat_silver)
    cb_bottle = create_cylinder("cb_btl", (0.35, 0.15, 0.96), 0.042, 0.28, mat_champ_glass)
    cb_foil = create_cylinder("cb_fol", (0.35, 0.15, 1.11), 0.022, 0.06, mat_gold_foil)
    join_objects("Champagne_Bottle", [cb_bucket, cb_bottle, cb_foil])

    # 4. Bouquet_of_Roses
    bq_stem = create_cylinder("bq_st", (-0.35, 0.15, 0.78), 0.05, 0.25, mat_rose_leaf, rotation=(0, math.radians(45), 0))
    bq_r1 = create_sphere("bq_r1", (-0.38, 0.15, 0.88), 0.045, mat_rose_red)
    bq_r2 = create_sphere("bq_r2", (-0.33, 0.18, 0.89), 0.042, mat_rose_red)
    bq_r3 = create_sphere("bq_r3", (-0.32, 0.12, 0.87), 0.044, mat_rose_red)
    join_objects("Bouquet_of_Roses", [bq_stem, bq_r1, bq_r2, bq_r3])

    # 5. Violin
    vn_body = create_cylinder("vn_b", (-1.2, -0.6, 0.75), 0.18, 0.06, mat_violin_wood, scale=(0.7, 1.4, 1.0))
    vn_neck = create_box("vn_n", (-1.2, -0.25, 0.76), (0.035, 0.35, 0.03), mat_ebony)
    vn_scroll = create_sphere("vn_sc", (-1.2, -0.05, 0.77), 0.03, mat_violin_wood)
    vn_bow = create_cylinder("vn_bw", (-1.05, -0.4, 0.76), 0.006, 0.70, mat_violin_wood, rotation=(math.radians(80), 0, 0))
    join_objects("Violin", [vn_body, vn_neck, vn_scroll, vn_bow])

    # 6. Ring_Box
    rb_box = create_box("rb_b", (0.15, -0.22, 0.78), (0.07, 0.07, 0.04), mat_velvet, bevel=0.008)
    rb_lid = create_box("rb_l", (0.15, -0.26, 0.83), (0.07, 0.07, 0.02), mat_velvet, rotation=(math.radians(-65), 0, 0))
    rb_gem = create_sphere("rb_gm", (0.15, -0.22, 0.81), 0.012, mat_diamond)
    join_objects("Ring_Box", [rb_box, rb_lid, rb_gem])

    # 7. Chocolate_Fondant
    cf_plate = create_cylinder("cf_p", (-0.15, -0.22, 0.77), 0.12, 0.015, mat_plate)
    cf_cake = create_cylinder("cf_ck", (-0.15, -0.22, 0.80), 0.055, 0.045, mat_choc)
    cf_straw = create_sphere("cf_st", (-0.10, -0.20, 0.80), 0.02, mat_rose_red, scale=(0.8, 0.8, 1.2))
    join_objects("Chocolate_Fondant", [cf_plate, cf_cake, cf_straw])

    # 8. Wine_List
    wl_menu = create_box("wl_m", (0.35, -0.22, 0.775), (0.14, 0.22, 0.018), mat_wine_leather, bevel=0.005)
    join_objects("Wine_List", [wl_menu])

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "dating.glb"))

# ==============================================================================
# WORLD 6: GARDEN.GLB
# ==============================================================================
def build_garden():
    reset_scene()
    print("Building World: Botanical Garden...")

    mat_lawn = get_material("Garden_Grass", base_color=(0.18, 0.48, 0.15, 1.0), roughness=0.85)
    mat_zinc = get_material("Galvanized_Zinc", base_color=(0.72, 0.75, 0.76, 1.0), metallic=0.75, roughness=0.35)
    mat_brass = get_material("Garden_Brass", base_color=(0.92, 0.78, 0.32, 1.0), metallic=0.92, roughness=0.2)
    mat_steel_dark = get_material("Dark_Steel", base_color=(0.20, 0.22, 0.24, 1.0), metallic=0.8, roughness=0.4)
    mat_rubber = get_material("Tire_Rubber", base_color=(0.08, 0.08, 0.09, 1.0), roughness=0.7)
    mat_wood = get_material("Garden_Ash_Wood", base_color=(0.52, 0.36, 0.22, 1.0), roughness=0.6)
    mat_terracotta = get_material("Terracotta_Clay", base_color=(0.78, 0.38, 0.22, 1.0), roughness=0.75)
    mat_flowers = get_material("Blooming_Petals", base_color=(0.95, 0.25, 0.55, 1.0), roughness=0.5)
    mat_red_vinyl = get_material("Red_Vinyl_Grip", base_color=(0.88, 0.12, 0.12, 1.0), roughness=0.45)
    mat_wicker = get_material("Woven_Wicker", base_color=(0.68, 0.52, 0.35, 1.0), roughness=0.7)
    mat_stone = get_material("Carved_Stone", base_color=(0.60, 0.62, 0.64, 1.0), roughness=0.65)
    mat_water = get_material("Fountain_Water", base_color=(0.25, 0.65, 0.85, 1.0), roughness=0.08, transmission=0.9, ior=1.33)
    mat_warm_led = get_material("Lantern_Glow", base_color=(1.0, 0.8, 0.4, 1.0), emission=(1.0, 0.75, 0.35, 1.0), emission_strength=3.5)

    create_box("Garden_Lawn_Floor", (0, 0, -0.05), (14.0, 14.0, 0.1), mat_lawn, bevel=0.0)

    # 1. Central Stone Fountain
    ft_pool = create_cylinder("ft_p", (0, 0, 0.20), 1.6, 0.40, mat_stone)
    ft_water = create_cylinder("ft_w", (0, 0, 0.32), 1.48, 0.05, mat_water)
    ft_pedestal = create_cylinder("ft_pd", (0, 0, 0.65), 0.35, 0.70, mat_stone)
    ft_tier2 = create_cylinder("ft_t2", (0, 0, 1.05), 0.85, 0.20, mat_stone)
    ft_finial = create_sphere("ft_fn", (0, 0, 1.35), 0.18, mat_stone)
    join_objects("Stone_Fountain", [ft_pool, ft_water, ft_pedestal, ft_tier2, ft_finial])

    # 2. Watering_Can
    wc_body = create_cylinder("wc_b", (2.5, 1.0, 0.22), 0.16, 0.38, mat_zinc)
    wc_spout = create_cylinder("wc_s", (2.7, 1.0, 0.35), 0.025, 0.35, mat_zinc, rotation=(0, math.radians(-45), 0))
    wc_rose = create_sphere("wc_r", (2.85, 1.0, 0.50), 0.045, mat_brass)
    wc_handle = create_torus("wc_h", (2.35, 1.0, 0.35), 0.16, 0.018, mat_zinc)
    join_objects("Watering_Can", [wc_body, wc_spout, wc_rose, wc_handle])

    # 3. Wheelbarrow
    wb_tray = create_box("wb_t", (2.5, -1.8, 0.45), (0.75, 1.1, 0.35), mat_steel_dark, bevel=0.03)
    wb_wheel = create_cylinder("wb_w", (2.5, -2.5, 0.22), 0.22, 0.08, mat_rubber, rotation=(0, math.radians(90), 0))
    wb_h1 = create_cylinder("wb_h1", (2.2, -1.2, 0.40), 0.02, 1.2, mat_wood, rotation=(math.radians(15), 0, 0))
    wb_h2 = create_cylinder("wb_h2", (2.8, -1.2, 0.40), 0.02, 1.2, mat_wood, rotation=(math.radians(15), 0, 0))
    join_objects("Wheelbarrow", [wb_tray, wb_wheel, wb_h1, wb_h2])

    # 4. Flower_Pot
    fp_pot = create_cylinder("fp_p", (-2.2, 1.2, 0.22), 0.22, 0.40, mat_terracotta)
    fp_rim = create_torus("fp_r", (-2.2, 1.2, 0.40), 0.23, 0.025, mat_terracotta)
    fp_flw = create_sphere("fp_fl", (-2.2, 1.2, 0.52), 0.20, mat_flowers)
    join_objects("Flower_Pot", [fp_pot, fp_rim, fp_flw])

    # 5. Pruning_Shears
    ps_b1 = create_box("ps_b1", (-1.8, 2.2, 0.05), (0.025, 0.12, 0.008), mat_zinc)
    ps_b2 = create_box("ps_b2", (-1.8, 2.2, 0.05), (0.025, 0.12, 0.008), mat_zinc, rotation=(0, 0, math.radians(25)))
    ps_h1 = create_cylinder("ps_h1", (-1.83, 2.05, 0.05), 0.014, 0.18, mat_red_vinyl)
    ps_h2 = create_cylinder("ps_h2", (-1.77, 2.05, 0.05), 0.014, 0.18, mat_red_vinyl)
    join_objects("Pruning_Shears", [ps_b1, ps_b2, ps_h1, ps_h2])

    # 6. Garden_Trowel
    gt_blade = create_sphere("gt_b", (-2.4, 2.2, 0.06), 0.06, mat_zinc, scale=(0.5, 1.8, 0.3))
    gt_handle = create_cylinder("gt_h", (-2.4, 2.02, 0.06), 0.016, 0.16, mat_wood, rotation=(math.radians(90), 0, 0))
    join_objects("Garden_Trowel", [gt_blade, gt_handle])

    # 7. Birdhouse
    bh_post = create_cylinder("bh_p", (-2.8, -1.8, 0.75), 0.04, 1.5, mat_wood)
    bh_box = create_box("bh_b", (-2.8, -1.8, 1.65), (0.35, 0.35, 0.45), mat_wood)
    bh_roof = create_box("bh_r", (-2.8, -1.8, 1.95), (0.44, 0.44, 0.06), mat_terracotta, rotation=(0, math.radians(25), 0))
    join_objects("Birdhouse", [bh_post, bh_box, bh_roof])

    # 8. Picnic_Basket
    pb_basket = create_box("pb_b", (1.2, 2.2, 0.18), (0.42, 0.60, 0.32), mat_wicker, bevel=0.03)
    pb_handle = create_torus("pb_h", (1.2, 2.2, 0.38), 0.22, 0.018, mat_wood)
    join_objects("Picnic_Basket", [pb_basket, pb_handle])

    # 9. Garden_Lantern
    gl_base = create_box("gl_b", (-1.2, -2.4, 0.08), (0.24, 0.24, 0.12), mat_steel_dark)
    gl_glass = create_box("gl_g", (-1.2, -2.4, 0.40), (0.20, 0.20, 0.48), mat_steel_dark)
    gl_light = create_sphere("gl_l", (-1.2, -2.4, 0.40), 0.06, mat_warm_led)
    gl_cap = create_box("gl_c", (-1.2, -2.4, 0.68), (0.26, 0.26, 0.08), mat_steel_dark)
    join_objects("Garden_Lantern", [gl_base, gl_glass, gl_light, gl_cap])

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "garden.glb"))

# ==============================================================================
# WORLD 7: SPACE.GLB
# ==============================================================================
def build_space():
    reset_scene()
    print("Building World: Space Station...")

    mat_deck = get_material("Station_Composite", base_color=(0.14, 0.16, 0.19, 1.0), metallic=0.7, roughness=0.35)
    mat_console_dark = get_material("Console_Black", base_color=(0.08, 0.09, 0.11, 1.0), metallic=0.8, roughness=0.25)
    mat_screen_cyan = get_material("SciFi_Display_Cyan", base_color=(0.0, 0.8, 1.0, 1.0), emission=(0.1, 0.85, 1.0, 1.0), emission_strength=3.2)
    mat_screen_radar = get_material("SciFi_Radar_Green", base_color=(0.1, 1.0, 0.4, 1.0), emission=(0.1, 1.0, 0.3, 1.0), emission_strength=3.0)
    mat_suit_white = get_material("EVA_Fabric_White", base_color=(0.92, 0.94, 0.96, 1.0), roughness=0.4)
    mat_gold_visor = get_material("Gold_Visor", base_color=(1.0, 0.84, 0.15, 1.0), metallic=0.98, roughness=0.04)
    mat_tank_carbon = get_material("Carbon_Fiber", base_color=(0.12, 0.13, 0.15, 1.0), metallic=0.4, roughness=0.3)
    mat_hazard_yellow = get_material("Hazard_Yellow", base_color=(0.95, 0.80, 0.05, 1.0), roughness=0.4)
    mat_solar_blue = get_material("Solar_Photovoltaic", base_color=(0.05, 0.10, 0.35, 1.0), metallic=0.9, roughness=0.1)
    mat_grow_purple = get_material("Grow_LED_Purple", base_color=(0.85, 0.1, 0.95, 1.0), emission=(0.85, 0.1, 0.95, 1.0), emission_strength=4.0)
    mat_hydro_glass = get_material("Chamber_Glass", base_color=(0.9, 0.95, 1.0, 1.0), roughness=0.05, transmission=0.92)
    mat_plant_green = get_material("Space_Sprouts", base_color=(0.15, 0.75, 0.25, 1.0), roughness=0.6)
    mat_airlock_titanium = get_material("Airlock_Titanium", base_color=(0.42, 0.46, 0.50, 1.0), metallic=0.88, roughness=0.22)
    mat_airlock_wheel = get_material("Airlock_Wheel_Red", base_color=(0.85, 0.10, 0.10, 1.0), roughness=0.35)

    create_box("Station_Deck_Floor", (0, 0, -0.05), (14.0, 14.0, 0.1), mat_deck, bevel=0.0)

    # 1. Control_Console
    cc_base = create_box("cc_b", (0, 2.5, 0.45), (3.4, 1.2, 0.9), mat_console_dark)
    cc_screen1 = create_box("cc_s1", (-0.9, 2.4, 1.15), (0.75, 0.05, 0.42), mat_screen_cyan, rotation=(math.radians(-20), 0, 0))
    cc_screen2 = create_box("cc_s2", (0, 2.4, 1.18), (0.85, 0.05, 0.46), mat_screen_radar, rotation=(math.radians(-20), 0, 0))
    cc_screen3 = create_box("cc_s3", (0.9, 2.4, 1.15), (0.75, 0.05, 0.42), mat_screen_cyan, rotation=(math.radians(-20), 0, 0))
    join_objects("Control_Console", [cc_base, cc_screen1, cc_screen2, cc_screen3])

    # 2. Astronaut_Helmet
    ah_shell = create_sphere("ah_sh", (-1.2, 0, 0.85), 0.22, mat_suit_white)
    ah_visor = create_sphere("ah_vs", (-1.2, -0.08, 0.85), 0.18, mat_gold_visor, scale=(1.05, 0.85, 0.95))
    ah_ring = create_torus("ah_rg", (-1.2, 0, 0.65), 0.20, 0.025, mat_hazard_yellow)
    join_objects("Astronaut_Helmet", [ah_shell, ah_visor, ah_ring])

    # 3. Oxygen_Tank
    ot_t1 = create_cylinder("ot_1", (-1.8, 0, 0.50), 0.11, 0.70, mat_tank_carbon)
    ot_t2 = create_cylinder("ot_2", (-1.55, 0, 0.50), 0.11, 0.70, mat_tank_carbon)
    ot_manifold = create_box("ot_m", (-1.68, 0, 0.88), (0.35, 0.15, 0.10), mat_hazard_yellow)
    join_objects("Oxygen_Tank", [ot_t1, ot_t2, ot_manifold])

    # 4. Robotic_Arm
    ra_base = create_cylinder("ra_b", (1.8, 0, 0.12), 0.25, 0.24, mat_console_dark)
    ra_seg1 = create_cylinder("ra_s1", (1.8, 0, 0.55), 0.06, 0.70, mat_hazard_yellow, rotation=(0, math.radians(25), 0))
    ra_joint = create_sphere("ra_j", (2.0, 0, 0.90), 0.09, mat_console_dark)
    ra_seg2 = create_cylinder("ra_s2", (2.2, 0, 1.25), 0.05, 0.70, mat_hazard_yellow, rotation=(0, math.radians(-35), 0))
    ra_claw = create_box("ra_c", (2.4, 0, 1.60), (0.12, 0.16, 0.12), mat_console_dark)
    join_objects("Robotic_Arm", [ra_base, ra_seg1, ra_joint, ra_seg2, ra_claw])

    # 5. Space_Telescope
    st_tube = create_cylinder("st_t", (0, -1.8, 1.2), 0.28, 1.4, mat_console_dark, rotation=(math.radians(35), 0, 0))
    st_lens = create_cylinder("st_l", (0, -1.25, 1.6), 0.27, 0.05, mat_gold_visor, rotation=(math.radians(35), 0, 0))
    st_wing_l = create_box("st_wl", (-0.8, -1.8, 1.2), (0.9, 0.02, 0.5), mat_solar_blue)
    st_wing_r = create_box("st_wr", (0.8, -1.8, 1.2), (0.9, 0.02, 0.5), mat_solar_blue)
    st_mount = create_cylinder("st_m", (0, -1.8, 0.45), 0.08, 0.9, mat_console_dark)
    join_objects("Space_Telescope", [st_tube, st_lens, st_wing_l, st_wing_r, st_mount])

    # 6. Hydroponic_Pod
    hp_base = create_cylinder("hp_b", (-2.6, -1.8, 0.20), 0.45, 0.40, mat_console_dark)
    hp_dome = create_cylinder("hp_d", (-2.6, -1.8, 0.85), 0.42, 0.90, mat_hydro_glass)
    hp_plant = create_sphere("hp_pl", (-2.6, -1.8, 0.60), 0.28, mat_plant_green)
    hp_light = create_cylinder("hp_l", (-2.6, -1.8, 1.30), 0.38, 0.06, mat_grow_purple)
    join_objects("Hydroponic_Pod", [hp_base, hp_dome, hp_plant, hp_light])

    # 7. Airlock_Door
    ad_frame = create_box("ad_f", (3.2, 2.5, 1.5), (0.35, 2.0, 3.0), mat_airlock_titanium)
    ad_door = create_box("ad_d", (3.15, 2.5, 1.4), (0.12, 1.6, 2.6), mat_airlock_titanium, bevel=0.03)
    ad_wheel = create_torus("ad_w", (3.08, 2.5, 1.4), 0.25, 0.03, mat_airlock_wheel, rotation=(0, math.radians(90), 0))
    ad_status = create_sphere("ad_st", (3.08, 2.5, 2.4), 0.04, mat_screen_radar)
    join_objects("Airlock_Door", [ad_frame, ad_door, ad_wheel, ad_status])

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "space.glb"))

def main():
    build_house()
    build_supermarket()
    build_restaurant()
    build_hotel()
    build_dating()
    build_garden()
    build_space()
    print("ALL 7 WORLDS EXPORTED SUCCESSFULLY!")

if __name__ == "__main__":
    main()
