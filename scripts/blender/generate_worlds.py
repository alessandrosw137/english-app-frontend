import bpy
import bmesh
import mathutils
import math
import os
import sys

script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)

from core import (
    reset_scene, get_material, create_box, create_cylinder, create_cone,
    create_sphere, create_torus, create_lathe_profile, create_soft_cushion,
    create_curved_tube, create_curved_handle, create_recessed_box,
    create_framed_glass_door, create_appliance_chassis, create_draped_tablecloth,
    join_as_named_object, export_glb, place_on_surface, get_object_bounds,
    add_bounds_anchor, build_isometric_room, set_smooth_normals,
    mat_chrome, mat_steel, mat_dark_steel, mat_gold, mat_bronze, mat_copper,
    mat_glass, mat_tinted_glass, mat_water, mat_porcelain, mat_white_quartz,
    mat_warm_wood, mat_light_oak, mat_dark_walnut, mat_parquet, mat_black_marble,
    mat_travertine, mat_burgundy_rug, mat_woven_beige, mat_linen_white,
    mat_navy_fabric, mat_cognac_leather, mat_commercial_tile,
    mat_sci_fi_metal, mat_grass_natural, mat_stone_path,
    mat_velvet_red, mat_terracotta, mat_screen
)

OUTPUT_WORLDS_DIR = os.path.abspath(os.path.join(script_dir, "..", "..", "assets", "models", "worlds"))


# ==============================================================================
# SHARED HIGH-CRAFT COMPONENT HELPERS (CRYSTAL GLASSWARE, BOTTLES, PLATES, TREES)
# ==============================================================================
def build_crystal_wine_glass(prefix, offset=(0, 0, 0), with_wine=True, wine_mat=None):
    """Builds a lathe-turned hollow crystal Bordeaux wine glass with ruby wine meniscus."""
    ox, oy, oz = offset
    # Hollow revolved profile: base foot -> drawn stem -> outer tulip bowl -> rim -> inner bowl
    glass_prof = [
        (0.000, 0.000, 'sharp'),
        (0.040, 0.000, 'sharp'),
        (0.040, 0.004),
        (0.012, 0.012),
        (0.0045, 0.025),
        (0.0042, 0.095),
        (0.009, 0.112),
        (0.036, 0.132),
        (0.048, 0.162),
        (0.045, 0.198),
        (0.041, 0.222, 'sharp'),
        (0.039, 0.222, 'sharp'),
        (0.043, 0.196),
        (0.045, 0.162),
        (0.033, 0.135),
        (0.000, 0.118, 'sharp')
    ]
    g_obj = create_lathe_profile(
        glass_prof, segments=32, name=f"{prefix}_glass",
        material=mat_glass(), location=(ox, oy, oz), smooth_steps=1, cap_ends=False
    )
    parts = [g_obj]
    if with_wine:
        w_mat = wine_mat or get_material("Ruby_Red_Wine", (0.36, 0.03, 0.07, 0.88),
                                         roughness=0.10, transmission=0.45, alpha=0.88)
        wine_prof = [
            (0.000, 0.120, 'sharp'),
            (0.031, 0.136),
            (0.043, 0.162),
            (0.042, 0.174, 'sharp'),
            (0.000, 0.173, 'sharp')
        ]
        w_obj = create_lathe_profile(
            wine_prof, segments=28, name=f"{prefix}_wine",
            material=w_mat, location=(ox, oy, oz), smooth_steps=1, cap_ends=False
        )
        parts.append(w_obj)
    return parts


def build_gourmet_plate(prefix, radius=0.165, offset=(0, 0, 0), material=None):
    """Lathe-turned wide-rim porcelain restaurant dinner/dessert plate with foot ring and well."""
    ox, oy, oz = offset
    r = radius
    prof = [
        (0.000, 0.002, 'sharp'),
        (r * 0.56, 0.002, 'sharp'),
        (r * 0.60, 0.000, 'sharp'),
        (r * 0.64, 0.000, 'sharp'),
        (r * 0.74, 0.009),
        (r * 0.98, 0.021),
        (r * 1.00, 0.024, 'sharp'),
        (r * 0.96, 0.025, 'sharp'),
        (r * 0.70, 0.013),
        (r * 0.60, 0.007),
        (0.000, 0.006, 'sharp')
    ]
    return create_lathe_profile(
        prof, segments=36, name=f"{prefix}_plate",
        material=material or mat_porcelain(), location=(ox, oy, oz),
        smooth_steps=1, cap_ends=False
    )


def build_gable_milk_carton(prefix, offset=(0, 0, 0), accent_color=(0.14, 0.46, 0.80, 1.0)):
    """Builds a true gable-top (pitched roof) dairy milk carton with top seal fin and screw cap."""
    ox, oy, oz = offset
    w, d = 0.088, 0.088
    body_h = 0.175
    roof_h = 0.048
    fin_h = 0.016

    # Main carton body + colored dairy wrap band
    body = create_box(f"{prefix}_bd", (ox, oy, oz + body_h * 0.5), (w, d, body_h), mat_porcelain(), bevel=0.004)
    band = create_box(f"{prefix}_bn", (ox, oy, oz + body_h * 0.52), (w + 0.002, d + 0.002, body_h * 0.42),
                      get_material(f"{prefix}_Mat", accent_color, roughness=0.38), bevel=0.003)

    # Pitched gable roof prism via bmesh
    bm = bmesh.new()
    hw, hd = w * 0.5, d * 0.5
    z0 = body_h
    z1 = body_h + roof_h
    v_bl = bm.verts.new((-hw, -hd, z0))
    v_br = bm.verts.new((hw, -hd, z0))
    v_fr = bm.verts.new((hw, hd, z0))
    v_fl = bm.verts.new((-hw, hd, z0))
    v_rl = bm.verts.new((-hw, 0.0, z1))
    v_rr = bm.verts.new((hw, 0.0, z1))
    bm.faces.new((v_bl, v_fl, v_fr, v_br))
    bm.faces.new((v_bl, v_br, v_rr, v_rl))
    bm.faces.new((v_fr, v_fl, v_rl, v_rr))
    bm.faces.new((v_bl, v_rl, v_fl))
    bm.faces.new((v_br, v_fr, v_rr))
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    m_roof = bpy.data.meshes.new(f"{prefix}_roof")
    bm.to_mesh(m_roof)
    bm.free()
    roof_obj = bpy.data.objects.new(f"{prefix}_roof", m_roof)
    bpy.context.collection.objects.link(roof_obj)
    roof_obj.location = (ox, oy, oz)
    roof_obj.data.materials.append(get_material(f"{prefix}_Mat", accent_color, roughness=0.38))
    set_smooth_normals(roof_obj, auto_angle_deg=35.0)

    # Top heat-seal ridge fin & angled pour spout cap
    fin = create_box(f"{prefix}_fn", (ox, oy, oz + z1 + fin_h * 0.5), (w, 0.006, fin_h), mat_porcelain(), bevel=0.002)
    cap = create_cylinder(f"{prefix}_cp", (ox, oy - hd * 0.46, oz + z0 + roof_h * 0.55),
                          0.015, 0.016, get_material(f"{prefix}_Cap", accent_color, roughness=0.3),
                          rotation=(math.radians(42), 0, 0))
    return [body, band, roof_obj, fin, cap]


# ==============================================================================
# WORLD 1: HOUSE.GLB
# L-Kitchen with White Quartz & Gooseneck Sink + Detailed Appliances + Plush Living + Study + Bath
# ==============================================================================
def build_house():
    reset_scene()
    print("Building World 1: House & Kitchen (Studio Isometric Diorama)...")
    add_bounds_anchor(radius_x=8.0, radius_y=7.0)

    # 1. Architectural Room Diorama + Overhead Kitchen Wall Cabinets (environment)
    diorama = build_isometric_room(
        "House",
        floor_size=(16.0, 14.0),
        floor_mat=mat_warm_wood(),
        wall_mat=get_material("House_WallMat", base_color=(0.93, 0.92, 0.89, 1.0), roughness=0.58),
        baseboard_mat=mat_dark_walnut(),
        north_y=6.0,
        west_x=-7.0,
        wall_height=3.6,
        has_window=True,
        window_pos=(-2.6, 6.0, 2.05),
        window_size=(3.0, 1.65),
        rug_config=(-3.3, -1.8, 4.5, 3.7, mat_woven_beige(), False),
        floor_style='planks',
        add_sconces=True
    )
    # Add architectural upper wall cabinets & living room wall shelf into House_Diorama
    up_cab_l = create_box("h_uc1", (-5.4, 5.66, 2.45), (2.2, 0.38, 0.78), mat_dark_walnut(), bevel=0.01)
    up_cab_d1 = create_box("h_ucd1", (-5.95, 5.46, 2.45), (1.02, 0.03, 0.72), mat_light_oak(), bevel=0.006)
    up_cab_d2 = create_box("h_ucd2", (-4.85, 5.46, 2.45), (1.02, 0.03, 0.72), mat_light_oak(), bevel=0.006)
    pendant_cord = create_cylinder("h_pc", (-3.3, -2.5, 3.15), 0.008, 0.90, mat_dark_steel())
    pendant_shade = create_lathe_profile(
        [(0.02, 0.18), (0.14, 0.14), (0.24, 0.0, 'sharp'), (0.23, 0.0, 'sharp'), (0.13, 0.13), (0.0, 0.17)],
        segments=28, name="h_ps", material=mat_gold(), location=(-3.3, -2.5, 2.55), cap_ends=False
    )
    join_as_named_object([diorama, up_cab_l, up_cab_d1, up_cab_d2, pendant_cord, pendant_shade], "House_Diorama")

    # --- NORTHWEST QUADRANT: L-SHAPED KITCHEN COUNTER (top_z = 0.90m) ---
    kc_parts = []
    # North run cabinetry (X: -6.85 .. -1.45, center X=-4.15, Y=5.40, depth=0.86m)
    kc_toe_n = create_box("kc_tn", (-4.15, 5.42, 0.05), (5.32, 0.76, 0.10), mat_dark_steel(), bevel=0.004)
    kc_cab_n = create_box("kc_cn", (-4.15, 5.40, 0.475), (5.38, 0.84, 0.75), mat_dark_walnut(), bevel=0.01)
    kc_qtz_n = create_box("kc_qn", (-4.15, 5.39, 0.875), (5.42, 0.88, 0.05), mat_white_quartz(), bevel=0.008)
    kc_bs_n = create_box("kc_bsn", (-4.15, 5.81, 0.96), (5.42, 0.03, 0.12), mat_white_quartz(), bevel=0.004)
    kc_parts.extend([kc_toe_n, kc_cab_n, kc_qtz_n, kc_bs_n])

    # Shaker doors & curved handles along North run
    for dx in (-5.3, -4.3, -3.3, -2.3):
        dr = create_box(f"kc_dr_{dx}", (dx, 4.97, 0.46), (0.92, 0.025, 0.68), mat_warm_wood(), bevel=0.006)
        hd = create_curved_handle(f"kc_hd_{dx}", (dx, 4.955, 0.72), length=0.18, standoff=0.024, axis='X', facing='-Y')
        kc_parts.extend([dr, hd])

    # West L-return wing with SUNKEN SINK & GOOSENECK FAUCET (X=-6.42, Y: 2.25..4.95, center Y=3.60)
    kc_toe_w = create_box("kc_tw", (-6.44, 3.60, 0.05), (0.76, 2.66, 0.10), mat_dark_steel(), bevel=0.004)
    kc_cab_w = create_box("kc_cw", (-6.42, 3.60, 0.475), (0.84, 2.70, 0.75), mat_dark_walnut(), bevel=0.01)
    # Countertop flanking the sunken sink at Y=3.60
    kc_qw_n = create_box("kc_qwn", (-6.41, 4.52, 0.875), (0.88, 0.86, 0.05), mat_white_quartz(), bevel=0.008)
    kc_qw_s = create_box("kc_qws", (-6.41, 2.68, 0.875), (0.88, 0.86, 0.05), mat_white_quartz(), bevel=0.008)
    # Physically recessed stainless steel sink basin (Z top at 0.90m, sunken 0.18m deep!)
    sink_basin = create_recessed_box(
        "kc_sink", (-6.41, 3.60, 0.80), (0.88, 0.98, 0.20),
        cavity_face='+Z', margin=(0.12, 0.12), cavity_depth=0.17,
        outer_mat=mat_white_quartz(), inner_mat=mat_steel(), bevel=0.008
    )
    sink_drain = create_cylinder("kc_drn", (-6.41, 3.60, 0.735), 0.038, 0.008, mat_chrome())
    # Curved Swan-Neck Gooseneck Chrome Faucet + Dual Mixer Levers
    faucet_base = create_cylinder("kc_fb", (-6.74, 3.60, 0.92), 0.028, 0.04, mat_chrome())
    faucet_neck = create_curved_tube(
        "kc_fneck",
        [(-6.74, 3.60, 0.93), (-6.74, 3.60, 1.15), (-6.64, 3.60, 1.24),
         (-6.48, 3.60, 1.20), (-6.45, 3.60, 1.08)],
        radius=0.013, material=mat_chrome()
    )
    faucet_aerator = create_cylinder("kc_faer", (-6.45, 3.60, 1.07), 0.016, 0.022, mat_chrome())
    faucet_lev_l = create_cylinder("kc_fll", (-6.74, 3.48, 0.93), 0.008, 0.07, mat_chrome(), rotation=(math.radians(90), 0, 0))
    faucet_lev_r = create_cylinder("kc_flr", (-6.74, 3.72, 0.93), 0.008, 0.07, mat_chrome(), rotation=(math.radians(90), 0, 0))
    kc_parts.extend([kc_toe_w, kc_cab_w, kc_qw_n, kc_qw_s, sink_basin, sink_drain,
                     faucet_base, faucet_neck, faucet_aerator, faucet_lev_l, faucet_lev_r])
    for dy in (2.8, 3.6, 4.4):
        dr_w = create_box(f"kc_drw_{dy}", (-5.99, dy, 0.46), (0.025, 0.76, 0.68), mat_warm_wood(), bevel=0.006)
        hd_w = create_curved_handle(f"kc_hdw_{dy}", (-5.975, dy, 0.72), length=0.16, standoff=0.024, axis='Y', facing='+X')
        kc_parts.extend([dr_w, hd_w])
    join_as_named_object(kc_parts, "Kitchen_Counter")

    # 1. Microwave (on North counter Z = 0.90m, at X=-5.35, Y=5.32)
    mw_parts = create_appliance_chassis(
        "Microwave", (0.58, 0.38, 0.33),
        body_mat=mat_steel(), inner_mat=mat_dark_steel(),
        cavity_face='-Y', cavity_margin=0.032, cavity_depth=0.14,
        doors=[{
            'center': (-0.08, -0.188, 0.17), 'size': (0.37, 0.022, 0.27),
            'mat': mat_dark_steel(), 'glass': True, 'frame_w': 0.038
        }],
        handles=[{
            'center': (0.08, -0.20, 0.17), 'length': 0.21, 'standoff': 0.028,
            'radius': 0.008, 'axis': 'Z', 'facing': '-Y', 'mat': mat_chrome()
        }],
        screens=[{
            'center': (0.20, -0.192, 0.25), 'size': (0.10, 0.008, 0.042),
            'color': (0.22, 0.85, 0.62, 1.0), 'strength': 1.6
        }],
        knobs=[{
            'center': (0.20, -0.198, 0.105), 'radius': 0.020, 'depth': 0.016, 'mat': mat_chrome()
        }],
        vents=[{
            'start': (-0.292, -0.06, 0.12), 'step': (0, 0, 0.022), 'count': 6,
            'slot_size': (0.006, 0.18, 0.007)
        }],
        feet_height=0.014
    )
    # Interior glass turntable & keypad buttons
    mw_plate = create_cylinder("mw_tt", (-0.08, -0.10, 0.065), 0.11, 0.008, mat_glass())
    mw_panel_bg = create_box("mw_pbg", (0.20, -0.188, 0.17), (0.14, 0.014, 0.27), mat_dark_steel(), bevel=0.004)
    mw_parts.extend([mw_plate, mw_panel_bg])
    for br in range(3):
        for bc in range(2):
            btn = create_box(f"mw_bt_{br}_{bc}", (0.175 + bc * 0.05, -0.196, 0.155 + br * 0.024),
                             (0.036, 0.005, 0.014), mat_chrome(), bevel=0.002)
            mw_parts.append(btn)
    mw = join_as_named_object(mw_parts, "Microwave")
    place_on_surface(mw, -5.35, 5.32, 0.90)

    # 2. Blender (on North counter Z = 0.90m, at X=-4.25, Y=5.32)
    bl_base = create_lathe_profile([
        (0.115, 0.000, 'sharp'), (0.118, 0.018), (0.102, 0.085),
        (0.092, 0.165), (0.098, 0.185, 'sharp'), (0.072, 0.195, 'sharp')
    ], segments=32, name="bl_base", material=mat_steel())
    bl_collar = create_cylinder("bl_col", (0, 0, 0.205), 0.078, 0.026, mat_dark_steel())
    bl_dial = create_cylinder("bl_dl", (0, -0.106, 0.095), 0.026, 0.022, mat_chrome(), rotation=(math.radians(90), 0, 0))
    # Contoured hollow glass pitcher + tropical smoothie inside
    bl_jug = create_lathe_profile([
        (0.070, 0.215, 'sharp'), (0.082, 0.28), (0.102, 0.42), (0.110, 0.51, 'sharp'),
        (0.104, 0.51, 'sharp'), (0.096, 0.42), (0.076, 0.28), (0.000, 0.225, 'sharp')
    ], segments=12, name="bl_jug", material=mat_glass(), smooth_steps=0, cap_ends=False)
    bl_smoothie = create_lathe_profile([
        (0.000, 0.228, 'sharp'), (0.073, 0.232), (0.092, 0.40), (0.060, 0.39), (0.000, 0.375)
    ], segments=24, name="bl_liq", material=get_material("Mango_Smoothie", (0.92, 0.52, 0.14, 1.0), roughness=0.28))
    bl_lid = create_lathe_profile([
        (0.102, 0.505, 'sharp'), (0.114, 0.515), (0.112, 0.535, 'sharp'), (0.036, 0.542, 'sharp')
    ], segments=28, name="bl_lid", material=mat_dark_steel())
    bl_cap = create_cylinder("bl_cap", (0, 0, 0.558), 0.032, 0.032, mat_glass())
    bl_handle = create_curved_tube(
        "bl_hnd", [(0.104, 0, 0.48), (0.165, 0, 0.47), (0.168, 0, 0.35), (0.155, 0, 0.27), (0.085, 0, 0.26)],
        radius=0.013, material=mat_dark_steel()
    )
    bl = join_as_named_object([bl_base, bl_collar, bl_dial, bl_jug, bl_smoothie, bl_lid, bl_cap, bl_handle], "Blender")
    place_on_surface(bl, -4.25, 5.32, 0.90)

    # 3. Toaster (on North counter Z = 0.90m, at X=-3.25, Y=5.32)
    to_chassis = create_recessed_box(
        "to_ch", (0, 0, 0.115), (0.31, 0.21, 0.20),
        cavity_face='+Z', margin=(0.045, 0.042), cavity_depth=0.08,
        outer_mat=mat_chrome(), inner_mat=mat_dark_steel(), bevel=0.026
    )
    to_base = create_box("to_bs", (0, 0, 0.014), (0.315, 0.215, 0.024), mat_dark_steel(), bevel=0.006)
    to_div = create_box("to_dv", (0, 0, 0.175), (0.22, 0.024, 0.07), mat_chrome(), bevel=0.005)
    # 2 organic arched golden-brown toast slices peeking out
    mat_toast = get_material("Golden_Toast", (0.76, 0.53, 0.26, 1.0), roughness=0.82)
    to_slice1 = create_soft_cushion((0.15, 0.024, 0.12), bevel_width=0.008, subdiv=2, name="to_s1",
                                    location=(0, -0.042, 0.215), material=mat_toast, crown_arch=0.018)
    to_slice2 = create_soft_cushion((0.15, 0.024, 0.12), bevel_width=0.008, subdiv=2, name="to_s2",
                                    location=(0, 0.042, 0.215), material=mat_toast, crown_arch=0.018)
    to_lever_slot = create_box("to_ls", (0.156, 0, 0.12), (0.006, 0.014, 0.11), mat_dark_steel(), bevel=0.001)
    to_lever = create_box("to_lv", (0.172, 0, 0.10), (0.032, 0.036, 0.016), mat_dark_walnut(), bevel=0.005)
    to_knob = create_cylinder("to_kb", (0.08, -0.11, 0.065), 0.020, 0.018, mat_gold(), rotation=(math.radians(90), 0, 0))
    to = join_as_named_object([to_chassis, to_base, to_div, to_slice1, to_slice2, to_lever_slot, to_lever, to_knob], "Toaster")
    place_on_surface(to, -3.25, 5.32, 0.90)

    # 4. Coffee_Maker (on North counter Z = 0.90m, at X=-2.20, Y=5.32)
    cf_base = create_box("cf_bs", (0, 0, 0.025), (0.26, 0.32, 0.05), mat_dark_steel(), bevel=0.010)
    cf_hotplate = create_cylinder("cf_hp", (0, -0.065, 0.053), 0.088, 0.008, mat_steel())
    cf_tower = create_box("cf_tw", (0, 0.095, 0.22), (0.24, 0.12, 0.36), mat_steel(), bevel=0.014)
    cf_tank = create_box("cf_tk", (0, 0.135, 0.24), (0.22, 0.05, 0.30), mat_tinted_glass("Water_Tank", (0.65, 0.85, 0.96), 0.42), bevel=0.008)
    cf_head = create_box("cf_hd", (0, -0.02, 0.385), (0.23, 0.24, 0.085), mat_dark_steel(), bevel=0.015)
    cf_filter = create_cone("cf_fl", (0, -0.065, 0.315), 0.065, 0.082, 0.09, mat_steel())
    # Lathe-turned glass coffee carafe + rich coffee + handle
    cf_carafe = create_lathe_profile([
        (0.072, 0.058, 'sharp'), (0.094, 0.11), (0.092, 0.18),
        (0.070, 0.235, 'sharp'), (0.066, 0.235, 'sharp'),
        (0.088, 0.18), (0.089, 0.11), (0.000, 0.063, 'sharp')
    ], segments=28, name="cf_crf", material=mat_glass(), location=(0, -0.065, 0), cap_ends=False)
    cf_coffee = create_lathe_profile([
        (0.000, 0.065, 'sharp'), (0.086, 0.11), (0.084, 0.165, 'sharp'), (0.000, 0.165, 'sharp')
    ], segments=24, name="cf_cof", material=get_material("Dark_Roast_Coffee", (0.11, 0.05, 0.02, 1.0), roughness=0.14),
        location=(0, -0.065, 0), cap_ends=False)
    cf_lid = create_cylinder("cf_ld", (0, -0.065, 0.242), 0.073, 0.016, mat_dark_steel())
    cf_hnd = create_curved_tube(
        "cf_hnd", [(0, -0.14, 0.23), (0, -0.20, 0.21), (0, -0.205, 0.13), (0, -0.155, 0.09)],
        radius=0.011, material=mat_dark_steel()
    )
    cf_scr = create_box("cf_sc", (0.07, -0.142, 0.385), (0.06, 0.006, 0.028),
                        mat_screen((0.25, 0.80, 0.65, 1.0), 1.5, "CF_Clock"), bevel=0.002)
    cf = join_as_named_object([cf_base, cf_hotplate, cf_tower, cf_tank, cf_head, cf_filter,
                               cf_carafe, cf_coffee, cf_lid, cf_hnd, cf_scr], "Coffee_Maker")
    place_on_surface(cf, -2.20, 5.32, 0.90)

    # 5. Refrigerator (French-Door stainless steel at X=-0.82, Y=5.35, Z=0.0)
    rf_parts = create_appliance_chassis(
        "Refrigerator", (0.96, 0.82, 2.04),
        body_mat=mat_dark_steel(), inner_mat=mat_dark_steel(),
        cavity_face='-Y', cavity_margin=0.03, cavity_depth=0.0,
        doors=[
            {'center': (-0.238, -0.422, 1.33), 'size': (0.465, 0.042, 1.34), 'mat': mat_steel(), 'bevel': 0.012},
            {'center': (0.238, -0.422, 1.33), 'size': (0.465, 0.042, 1.34), 'mat': mat_steel(), 'bevel': 0.012},
            {'center': (0.0, -0.422, 0.34), 'size': (0.945, 0.042, 0.58), 'mat': mat_steel(), 'bevel': 0.012},
        ],
        handles=[
            {'center': (-0.045, -0.445, 1.32), 'length': 0.78, 'standoff': 0.038, 'radius': 0.012, 'axis': 'Z', 'facing': '-Y'},
            {'center': (0.045, -0.445, 1.32), 'length': 0.78, 'standoff': 0.038, 'radius': 0.012, 'axis': 'Z', 'facing': '-Y'},
            {'center': (0.0, -0.445, 0.54), 'length': 0.68, 'standoff': 0.038, 'radius': 0.012, 'axis': 'X', 'facing': '-Y'},
        ],
        screens=[{
            'center': (-0.24, -0.446, 1.44), 'size': (0.13, 0.006, 0.045),
            'color': (0.24, 0.72, 0.92, 1.0), 'strength': 1.4
        }],
        vents=[{
            'start': (-0.32, -0.415, 0.035), 'step': (0.12, 0, 0), 'count': 6,
            'slot_size': (0.08, 0.01, 0.008)
        }],
        feet_height=0.02
    )
    # Recessed water/ice dispenser alcove in left French door
    rf_alcove = create_recessed_box(
        "rf_alc", (-0.24, -0.432, 1.26), (0.21, 0.035, 0.28),
        cavity_face='-Y', margin=(0.022, 0.022), cavity_depth=0.026,
        outer_mat=mat_dark_steel(), inner_mat=mat_dark_steel(), bevel=0.005
    )
    rf_paddle = create_box("rf_pad", (-0.24, -0.422, 1.24), (0.07, 0.008, 0.10), mat_chrome(), bevel=0.003)
    rf_parts.extend([rf_alcove, rf_paddle])
    rf = join_as_named_object(rf_parts, "Refrigerator")
    place_on_surface(rf, -0.82, 5.35, 0.0)

    # --- SOUTHWEST QUADRANT: PLUSH LIVING ROOM ---
    # 6. Sofa (3-seater upholstered sofa with subdivided organic cushions at X=-3.3, Y=-0.95, Z=0.0)
    sf_parts = []
    sf_frame = create_box("sf_fr", (0, 0, 0.16), (2.42, 0.92, 0.14), mat_dark_walnut(), bevel=0.012)
    sf_deck = create_box("sf_dk", (0, 0.02, 0.25), (2.36, 0.88, 0.10), mat_navy_fabric(), bevel=0.015)
    sf_back_shell = create_box("sf_bs", (0, 0.39, 0.56), (2.42, 0.14, 0.58), mat_navy_fabric(), bevel=0.025)
    sf_parts.extend([sf_frame, sf_deck, sf_back_shell])
    # 4 splayed walnut legs with brass caps
    for lx in (-1.08, 1.08):
        for ly in (-0.36, 0.36):
            leg = create_cone(f"sf_lg_{lx}_{ly}", (lx, ly, 0.055), 0.018, 0.030, 0.11, mat_dark_walnut())
            cap = create_cylinder(f"sf_cp_{lx}_{ly}", (lx, ly, 0.012), 0.019, 0.024, mat_gold())
            sf_parts.extend([leg, cap])
    # 3 organic seat cushions + 3 angled back cushions + 2 padded armrests + 2 accent pillows
    for i, cx in enumerate((-0.72, 0.0, 0.72)):
        sc = create_soft_cushion((0.71, 0.76, 0.17), bevel_width=0.035, subdiv=2,
                                 name=f"sf_sc_{i}", location=(cx, -0.03, 0.37),
                                 material=mat_navy_fabric(), puff=0.15)
        bc = create_soft_cushion((0.70, 0.19, 0.42), bevel_width=0.035, subdiv=2,
                                 name=f"sf_bc_{i}", location=(cx, 0.25, 0.63),
                                 rotation=(math.radians(10), 0, 0),
                                 material=mat_navy_fabric(), puff=0.16)
        sf_parts.extend([sc, bc])
    for side, ax in (("l", -1.16), ("r", 1.16)):
        arm = create_soft_cushion((0.22, 0.90, 0.38), bevel_width=0.035, subdiv=2,
                                  name=f"sf_arm_{side}", location=(ax, 0.0, 0.43),
                                  material=mat_navy_fabric(), puff=0.12)
        sf_parts.append(arm)
    pil_l = create_soft_cushion((0.36, 0.14, 0.34), bevel_width=0.03, subdiv=2, name="sf_pl",
                                location=(-0.92, 0.08, 0.56), rotation=(math.radians(14), math.radians(18), math.radians(-12)),
                                material=mat_terracotta(), puff=0.18)
    pil_r = create_soft_cushion((0.36, 0.14, 0.34), bevel_width=0.03, subdiv=2, name="sf_pr",
                                location=(0.92, 0.08, 0.56), rotation=(math.radians(14), math.radians(-18), math.radians(12)),
                                material=mat_woven_beige(), puff=0.18)
    sf_parts.extend([pil_l, pil_r])
    sf = join_as_named_object(sf_parts, "Sofa", location=(-3.3, -0.95, 0.0))
    place_on_surface(sf, -3.3, -0.95, 0.0)

    # 7. Living_Table (Mid-century coffee table with top strictly at Z = 0.45m)
    lt_parts = []
    lt_top = create_box("lt_tp", (0, 0, 0.43), (1.36, 0.74, 0.04), mat_warm_wood(), bevel=0.014)
    lt_shelf = create_box("lt_sh", (0, 0, 0.18), (1.10, 0.54, 0.022), mat_dark_walnut(), bevel=0.006)
    lt_parts.extend([lt_top, lt_shelf])
    for lx in (-0.56, 0.56):
        for ly in (-0.27, 0.27):
            leg = create_cone(f"lt_lg_{lx}_{ly}", (lx, ly, 0.21), 0.016, 0.028, 0.42, mat_dark_walnut())
            lt_parts.append(leg)
    lt = join_as_named_object(lt_parts, "Living_Table")
    place_on_surface(lt, -3.3, -2.65, 0.0)

    # 8. Remote_Control (on Living_Table Z = 0.45m)
    rm_body = create_box("rm_b", (0, 0, 0.010), (0.056, 0.185, 0.018), mat_dark_steel(), bevel=0.007)
    rm_ring = create_torus("rm_rg", (0, 0.02, 0.020), 0.016, 0.0035, mat_chrome())
    rm_ok = create_cylinder("rm_ok", (0, 0.02, 0.020), 0.007, 0.005, mat_steel())
    rm_pwr = create_cylinder("rm_pw", (-0.014, 0.070, 0.020), 0.0055, 0.005, mat_velvet_red())
    rm_vol = create_box("rm_vl", (-0.012, -0.032, 0.020), (0.011, 0.032, 0.005), mat_chrome(), bevel=0.002)
    rm_ch = create_box("rm_ch", (0.012, -0.032, 0.020), (0.011, 0.032, 0.005), mat_chrome(), bevel=0.002)
    rm = join_as_named_object([rm_body, rm_ring, rm_ok, rm_pwr, rm_vol, rm_ch], "Remote_Control")
    place_on_surface(rm, -3.3, -2.65, 0.45)

    # --- NORTHEAST QUADRANT: STUDY DESK, ERGONOMIC CHAIR & LAPTOP ---
    # 9. Study_Desk (Desk top at Z = 0.76m + Ergonomic Swivel Chair)
    dk_parts = []
    dk_top = create_box("dk_tp", (0, 0, 0.74), (1.56, 0.78, 0.04), mat_warm_wood(), bevel=0.010)
    dk_leg_l = create_box("dk_ll", (-0.70, 0, 0.36), (0.05, 0.70, 0.72), mat_dark_steel(), bevel=0.006)
    dk_ped = create_box("dk_pd", (0.50, 0, 0.36), (0.44, 0.70, 0.72), mat_dark_walnut(), bevel=0.008)
    dk_parts.extend([dk_top, dk_leg_l, dk_ped])
    for di, dz in enumerate((0.16, 0.37, 0.58)):
        drw = create_box(f"dk_dr_{di}", (0.50, -0.358, dz), (0.40, 0.02, 0.18), mat_warm_wood(), bevel=0.005)
        hnd = create_curved_handle(f"dk_hd_{di}", (0.50, -0.37, dz), length=0.14, standoff=0.02, axis='X', facing='-Y')
        dk_parts.extend([drw, hnd])
    # Ergonomic Swivel Chair at (X=-0.12, Y=-0.72) facing +Y (toward desk)
    cx_c, cy_c = -0.12, -0.72
    ch_cyl = create_cylinder("ch_cy", (cx_c, cy_c, 0.24), 0.026, 0.34, mat_chrome())
    dk_parts.append(ch_cyl)
    for si in range(5):
        ang = (2.0 * math.pi * si) / 5.0
        leg_a = create_curved_tube(
            f"ch_st_{si}",
            [(cx_c, cy_c, 0.09), (cx_c + 0.27 * math.cos(ang), cy_c + 0.27 * math.sin(ang), 0.055)],
            radius=0.014, material=mat_chrome()
        )
        whl = create_cylinder(f"ch_wh_{si}", (cx_c + 0.27 * math.cos(ang), cy_c + 0.27 * math.sin(ang), 0.028),
                              0.026, 0.022, mat_dark_steel(), rotation=(0, math.radians(90), ang))
        dk_parts.extend([leg_a, whl])
    ch_seat = create_soft_cushion((0.50, 0.48, 0.09), bevel_width=0.025, subdiv=2, name="ch_st",
                                  location=(cx_c, cy_c, 0.45), material=mat_dark_steel(), puff=0.12)
    ch_back = create_soft_cushion((0.46, 0.08, 0.54), bevel_width=0.025, subdiv=2, name="ch_bk",
                                  location=(cx_c, cy_c - 0.22, 0.76), rotation=(math.radians(-8), 0, 0),
                                  material=mat_dark_steel(), puff=0.12)
    ch_arm_l = create_curved_tube("ch_al", [(cx_c - 0.25, cy_c - 0.16, 0.45), (cx_c - 0.27, cy_c - 0.16, 0.62),
                                            (cx_c - 0.27, cy_c + 0.10, 0.62), (cx_c - 0.25, cy_c + 0.10, 0.45)],
                                  radius=0.013, material=mat_dark_steel())
    ch_arm_r = create_curved_tube("ch_ar", [(cx_c + 0.25, cy_c - 0.16, 0.45), (cx_c + 0.27, cy_c - 0.16, 0.62),
                                            (cx_c + 0.27, cy_c + 0.10, 0.62), (cx_c + 0.25, cy_c + 0.10, 0.45)],
                                  radius=0.013, material=mat_dark_steel())
    dk_parts.extend([ch_seat, ch_back, ch_arm_l, ch_arm_r])
    dk = join_as_named_object(dk_parts, "Study_Desk")
    place_on_surface(dk, 4.4, 4.65, 0.0)

    # 10. Laptop (on Study_Desk tabletop Z = 0.76m)
    lp_base = create_recessed_box(
        "lp_bs", (0, 0, 0.008), (0.35, 0.24, 0.014),
        cavity_face='+Z', margin=(0.032, 0.055), cavity_depth=0.003,
        outer_mat=mat_steel(), inner_mat=mat_dark_steel(), bevel=0.004
    )
    lp_pad = create_box("lp_pd", (0, -0.072, 0.0155), (0.105, 0.062, 0.002), mat_chrome(), bevel=0.001)
    lp_hinge = create_cylinder("lp_hg", (0, 0.112, 0.016), 0.006, 0.28, mat_dark_steel(), rotation=(0, math.radians(90), 0))
    lp_lid = create_box("lp_ld", (0, 0.152, 0.125), (0.35, 0.009, 0.23), mat_steel(),
                        rotation=(math.radians(-18), 0, 0), bevel=0.004)
    lp_bezel = create_box("lp_bz", (0, 0.147, 0.125), (0.338, 0.003, 0.218), mat_dark_steel(),
                          rotation=(math.radians(-18), 0, 0), bevel=0.002)
    lp_scr = create_box("lp_sc", (0, 0.145, 0.125), (0.320, 0.002, 0.198),
                        mat_screen((0.18, 0.62, 0.88, 1.0), 1.6, "Laptop_UI"),
                        rotation=(math.radians(-18), 0, 0), bevel=0.001)
    lp_parts = [lp_base, lp_pad, lp_hinge, lp_lid, lp_bezel, lp_scr]
    for kr in range(4):
        krow = create_box(f"lp_kr_{kr}", (0, -0.005 + kr * 0.024, 0.0145), (0.275, 0.017, 0.003), mat_dark_steel(), bevel=0.001)
        lp_parts.append(krow)
    lp = join_as_named_object(lp_parts, "Laptop")
    place_on_surface(lp, 4.28, 4.92, 0.76)

    # 11. House_Bed (Plush upholstered double bed at X=4.6, Y=0.35, Z=0.0)
    hb_parts = []
    hb_frame = create_box("hb_fr", (0, 0, 0.18), (1.96, 2.16, 0.24), mat_warm_wood(), bevel=0.012)
    hb_head = create_box("hb_hd", (0, 1.05, 0.66), (2.04, 0.12, 1.02), mat_dark_walnut(), bevel=0.016)
    hb_mat = create_soft_cushion((1.84, 2.04, 0.24), bevel_width=0.04, subdiv=2, name="hb_mt",
                                 location=(0, 0, 0.40), material=mat_linen_white(), puff=0.10)
    hb_duvet = create_soft_cushion((1.88, 1.50, 0.14), bevel_width=0.04, subdiv=2, name="hb_dv",
                                   location=(0, -0.25, 0.51), material=get_material("Sage_Duvet", (0.38, 0.49, 0.43, 1.0), roughness=0.80, sheen_weight=0.35), puff=0.15)
    hb_p1 = create_soft_cushion((0.64, 0.40, 0.14), bevel_width=0.03, subdiv=2, name="hb_p1",
                                location=(-0.48, 0.74, 0.58), rotation=(math.radians(10), 0, 0), material=mat_linen_white(), puff=0.18)
    hb_p2 = create_soft_cushion((0.64, 0.40, 0.14), bevel_width=0.03, subdiv=2, name="hb_p2",
                                location=(0.48, 0.74, 0.58), rotation=(math.radians(10), 0, 0), material=mat_linen_white(), puff=0.18)
    hb_parts.extend([hb_frame, hb_head, hb_mat, hb_duvet, hb_p1, hb_p2])
    for lx in (-0.88, 0.88):
        for ly in (-0.98, 0.98):
            hb_parts.append(create_cylinder(f"hb_lg_{lx}_{ly}", (lx, ly, 0.04), 0.035, 0.08, mat_dark_walnut()))
    bed_unit = join_as_named_object(hb_parts, "House_Bed")
    place_on_surface(bed_unit, 4.6, 0.35, 0.0)

    # --- SOUTHEAST QUADRANT: BATHROOM VANITY WITH MIRROR & TOILETRIES (countertop Z = 0.86m) ---
    # 12. Bathroom_Vanity (X=4.8, Y=-4.25, Z=0.0, facing South -Y toward camera!)
    bv_parts = []
    bv_toe = create_box("bv_to", (0, 0.02, 0.05), (1.52, 0.62, 0.10), mat_dark_steel(), bevel=0.004)
    bv_cab = create_box("bv_cb", (0, 0, 0.455), (1.60, 0.68, 0.71), mat_dark_walnut(), bevel=0.010)
    # Countertop at Z = 0.86m with sunken porcelain basin in center
    bv_qt_l = create_box("bv_ql", (-0.58, 0, 0.835), (0.50, 0.72, 0.05), mat_white_quartz(), bevel=0.008)
    bv_qt_r = create_box("bv_qr", (0.58, 0, 0.835), (0.50, 0.72, 0.05), mat_white_quartz(), bevel=0.008)
    bv_sink = create_recessed_box(
        "bv_snk", (0, 0, 0.78), (0.68, 0.72, 0.16),
        cavity_face='+Z', margin=(0.09, 0.11), cavity_depth=0.13,
        outer_mat=mat_white_quartz(), inner_mat=mat_porcelain(), bevel=0.010
    )
    bv_faucet = create_curved_tube(
        "bv_fc", [(0, 0.25, 0.86), (0, 0.25, 1.03), (0, 0.14, 1.08), (0, 0.09, 0.99)],
        radius=0.011, material=mat_chrome()
    )
    bv_dr_l = create_box("bv_dl", (-0.40, -0.35, 0.45), (0.74, 0.024, 0.64), mat_warm_wood(), bevel=0.006)
    bv_dr_r = create_box("bv_dr", (0.40, -0.35, 0.45), (0.74, 0.024, 0.64), mat_warm_wood(), bevel=0.006)
    bv_hd_l = create_curved_handle("bv_hl", (-0.08, -0.365, 0.52), length=0.16, standoff=0.022, axis='Z', facing='-Y', material=mat_gold())
    bv_hd_r = create_curved_handle("bv_hr", (0.08, -0.365, 0.52), length=0.16, standoff=0.022, axis='Z', facing='-Y', material=mat_gold())
    # Framed Architectural Vanity Mirror mounted along back edge (Y = +0.34, facing -Y!)
    bv_m_back = create_box("bv_mb", (0, 0.34, 1.38), (1.36, 0.035, 1.02), mat_gold(), bevel=0.010)
    bv_m_glass = create_box("bv_mg", (0, 0.32, 1.38), (1.26, 0.010, 0.92),
                            get_material("Mirror_Silver", (0.86, 0.91, 0.95, 1.0), metallic=0.96, roughness=0.04), bevel=0.003)
    bv_parts.extend([bv_toe, bv_cab, bv_qt_l, bv_qt_r, bv_sink, bv_faucet,
                     bv_dr_l, bv_dr_r, bv_hd_l, bv_hd_r, bv_m_back, bv_m_glass])
    vanity = join_as_named_object(bv_parts, "Bathroom_Vanity")
    place_on_surface(vanity, 4.8, -4.25, 0.0)

    # 13. Soap_Dispenser (on Bathroom_Vanity Z = 0.86m, at X=5.32, Y=-4.30)
    sd_jar = create_lathe_profile([
        (0.036, 0.000, 'sharp'), (0.046, 0.025), (0.045, 0.095),
        (0.022, 0.128), (0.020, 0.142, 'sharp')
    ], segments=28, name="sd_jr", material=mat_tinted_glass("Amber_Bottle", (0.78, 0.48, 0.14), 0.78))
    sd_collar = create_cylinder("sd_cl", (0, 0, 0.150), 0.021, 0.018, mat_chrome())
    sd_spout = create_curved_tube(
        "sd_sp", [(0, 0, 0.158), (0, 0, 0.186), (0, -0.022, 0.190), (0, -0.046, 0.178)],
        radius=0.005, material=mat_chrome()
    )
    sd = join_as_named_object([sd_jar, sd_collar, sd_spout], "Soap_Dispenser")
    place_on_surface(sd, 5.32, -4.30, 0.86)

    # 14. Toothbrush (Lathe-turned ceramic tumbler + ergonomic toothbrush at X=4.22, Y=-4.30, Z=0.86)
    tb_cup = create_lathe_profile([
        (0.030, 0.000, 'sharp'), (0.038, 0.055), (0.042, 0.105, 'sharp'),
        (0.038, 0.105, 'sharp'), (0.034, 0.055), (0.000, 0.008, 'sharp')
    ], segments=28, name="tb_cp", material=mat_porcelain(), cap_ends=False)
    tb_stem = create_curved_tube(
        "tb_st", [(0, 0.005, 0.02), (0.012, -0.008, 0.12), (0.018, -0.016, 0.195)],
        radius=0.0065, material=get_material("Sage_Teal_Grip", (0.16, 0.56, 0.58, 1.0), roughness=0.38)
    )
    tb_head = create_box("tb_hd", (0.019, -0.018, 0.208), (0.012, 0.008, 0.028), mat_porcelain(), bevel=0.003)
    tb_bris = create_box("tb_br", (0.019, -0.025, 0.208), (0.010, 0.009, 0.024),
                         get_material("Soft_Bristles", (0.85, 0.95, 0.98, 1.0), roughness=0.5), bevel=0.002)
    tb = join_as_named_object([tb_cup, tb_stem, tb_head, tb_bris], "Toothbrush")
    place_on_surface(tb, 4.22, -4.30, 0.86)

    # 15. Shampoo_Bottle (Contoured lathe bottle at X=5.54, Y=-4.24, Z=0.86)
    sb_body = create_lathe_profile([
        (0.032, 0.000, 'sharp'), (0.042, 0.04), (0.040, 0.14),
        (0.022, 0.178), (0.018, 0.192, 'sharp')
    ], segments=28, name="sb_bd",
        material=get_material("Botanical_Shampoo", (0.18, 0.40, 0.30, 1.0), roughness=0.32),
        scale=(1.22, 0.78, 1.0))
    sb_lbl = create_cylinder("sb_lb", (0, 0, 0.095), 0.041, 0.075, mat_linen_white(), scale=(1.23, 0.79, 1.0), bevel=0.0)
    sb_cap = create_cylinder("sb_cp", (0, 0, 0.204), 0.019, 0.024, mat_gold())
    sb = join_as_named_object([sb_body, sb_lbl, sb_cap], "Shampoo_Bottle")
    place_on_surface(sb, 5.54, -4.24, 0.86)

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "house.glb"))
    print("WORLD 1 (HOUSE) EXPORTED SUCCESSFULLY!\n")


# ==============================================================================
# WORLD 2: SUPERMARKET.GLB
# 3 Commercial 4-Tier Gondolas with Price Rails + Serial Products + POS Checkout + Wire Cart
# ==============================================================================
def build_supermarket():
    reset_scene()
    print("Building World 2: Supermarket (4-Tier Price-Rail Gondolas & Turned Groceries)...")
    add_bounds_anchor(radius_x=8.0, radius_y=7.0)

    # 1. Grouted Porcelain Tile Diorama
    build_isometric_room(
        "Supermarket",
        floor_size=(16.0, 14.0),
        floor_mat=mat_commercial_tile(),
        wall_mat=get_material("Market_Wall", base_color=(0.93, 0.94, 0.95, 1.0), roughness=0.48),
        baseboard_mat=mat_steel(),
        north_y=6.0,
        west_x=-7.0,
        wall_height=3.6,
        has_window=True,
        window_pos=(-1.8, 6.0, 2.15),
        window_size=(4.2, 1.65),
        floor_style='tiles',
        add_sconces=True
    )

    # 2. Gondola_Aisle: 3 Double-Sided Commercial Gondolas with 4 Tiers & Price Tag Rails!
    # Shelf top surfaces strictly at Z = 0.32m, 0.78m, 1.24m, 1.70m
    mat_gondola_body = get_material("Gondola_Cream_Steel", (0.88, 0.89, 0.90, 1.0), metallic=0.35, roughness=0.38)
    mat_price_rail = get_material("Price_Rail_Emerald", (0.14, 0.45, 0.30, 1.0), roughness=0.35)

    def create_gondola_unit(prefix, cx, cy):
        gp = []
        g_len = 4.20
        # Slotted uprights + slatwall center spine
        spine = create_box(f"{prefix}_sp", (cx, cy, 0.95), (0.07, g_len, 1.90), mat_gondola_body, bevel=0.006)
        gp.append(spine)
        for uy in (-2.04, 0.0, 2.04):
            post = create_box(f"{prefix}_up_{uy}", (cx, cy + uy, 0.96), (0.11, 0.06, 1.92), mat_dark_steel(), bevel=0.004)
            gp.append(post)
        # Tier 1 Base Kickplate & Deck (top strictly at Z = 0.32m)
        kick_l = create_box(f"{prefix}_kl", (cx - 0.31, cy, 0.145), (0.52, g_len, 0.29), mat_dark_steel(), bevel=0.004)
        kick_r = create_box(f"{prefix}_kr", (cx + 0.31, cy, 0.145), (0.52, g_len, 0.29), mat_dark_steel(), bevel=0.004)
        deck_l = create_box(f"{prefix}_dl", (cx - 0.33, cy, 0.305), (0.58, g_len, 0.03), mat_gondola_body, bevel=0.004)
        deck_r = create_box(f"{prefix}_dr", (cx + 0.33, cy, 0.305), (0.58, g_len, 0.03), mat_gondola_body, bevel=0.004)
        gp.extend([kick_l, kick_r, deck_l, deck_r])
        # Price rails on Tier 1
        gp.append(create_box(f"{prefix}_pr1l", (cx - 0.625, cy, 0.305), (0.012, g_len, 0.034), mat_price_rail,
                             rotation=(0, math.radians(-15), 0), bevel=0.002))
        gp.append(create_box(f"{prefix}_pr1r", (cx + 0.625, cy, 0.305), (0.012, g_len, 0.034), mat_price_rail,
                             rotation=(0, math.radians(15), 0), bevel=0.002))

        # Upper 3 Shelf Tiers: top surfaces strictly at Z = 0.78m, 1.24m, 1.70m
        for sz in (0.78, 1.24, 1.70):
            sl = create_box(f"{prefix}_sl_{sz}", (cx - 0.31, cy, sz - 0.015), (0.54, g_len, 0.03), mat_gondola_body, bevel=0.004)
            sr = create_box(f"{prefix}_sr_{sz}", (cx + 0.31, cy, sz - 0.015), (0.54, g_len, 0.03), mat_gondola_body, bevel=0.004)
            pr_l = create_box(f"{prefix}_prl_{sz}", (cx - 0.585, cy, sz - 0.016), (0.012, g_len, 0.034), mat_price_rail,
                              rotation=(0, math.radians(-15), 0), bevel=0.002)
            pr_r = create_box(f"{prefix}_prr_{sz}", (cx + 0.585, cy, sz - 0.016), (0.012, g_len, 0.034), mat_price_rail,
                              rotation=(0, math.radians(15), 0), bevel=0.002)
            gp.extend([sl, sr, pr_l, pr_r])
        return gp

    g_all = []
    g_all.extend(create_gondola_unit("G1", -4.2, 1.3))
    g_all.extend(create_gondola_unit("G2", -1.0, 1.3))
    g_all.extend(create_gondola_unit("G3", 2.2, 1.3))
    join_as_named_object(g_all, "Gondola_Aisle")

    # --- GONDOLA 1 PRODUCTS (East face X = -3.86) ---
    # 1. Cereal_Box (Tier 4: Z = 1.70m) - Series of 4 detailed cereal boxes
    cb_parts = []
    c_palettes = [
        ("Honey_Oats", (0.88, 0.62, 0.16, 1.0)),
        ("Cocoa_Crisp", (0.34, 0.19, 0.11, 1.0)),
        ("Berry_Crunch", (0.20, 0.42, 0.72, 1.0)),
        ("Maple_Flakes", (0.76, 0.34, 0.18, 1.0)),
    ]
    for i, (cn, col) in enumerate(c_palettes):
        oy = (i - 1.5) * 0.20
        bx = create_box(f"cb_b_{i}", (0, oy, 0.145), (0.075, 0.175, 0.28), get_material(cn, col, roughness=0.40), bevel=0.005)
        flap = create_box(f"cb_f_{i}", (0, oy, 0.288), (0.071, 0.171, 0.008), mat_porcelain(), bevel=0.002)
        bowl = create_cylinder(f"cb_bw_{i}", (0.039, oy, 0.10), 0.045, 0.005, mat_porcelain(), rotation=(0, math.radians(90), 0))
        cb_parts.extend([bx, flap, bowl])
    cb = join_as_named_object(cb_parts, "Cereal_Box")
    place_on_surface(cb, -3.86, 2.25, 1.70)

    # 2. Sliced_Bread (Tier 3: Z = 1.24m) - 3 organic baker's crown loaves with clips
    br_parts = []
    mat_loaf = get_material("Artisan_Bread_Crust", (0.82, 0.61, 0.34, 1.0), roughness=0.68)
    for i in range(3):
        oy = (i - 1.0) * 0.28
        loaf = create_soft_cushion((0.24, 0.13, 0.12), bevel_width=0.018, subdiv=2,
                                   name=f"br_lf_{i}", location=(0, oy, 0.068),
                                   material=mat_loaf, puff=0.12, crown_arch=0.024)
        neck = create_cone(f"br_nk_{i}", (0.135, oy, 0.055), 0.014, 0.036, 0.045,
                           mat_tinted_glass("Bread_Wrap", (0.95, 0.94, 0.90), 0.45), rotation=(0, math.radians(-90), 0))
        clip = create_box(f"br_cl_{i}", (0.125, oy, 0.062), (0.006, 0.026, 0.026), mat_velvet_red(), bevel=0.002)
        br_parts.extend([loaf, neck, clip])
    bread = join_as_named_object(br_parts, "Sliced_Bread")
    place_on_surface(bread, -3.86, 1.30, 1.24)

    # 3. Egg_Carton (Tier 2: Z = 0.78m) - Open pulp carton with 6 lathe-turned ovoid eggs!
    eg_parts = []
    mat_pulp = get_material("Molded_Egg_Pulp", (0.68, 0.62, 0.53, 1.0), roughness=0.88)
    mat_egg = get_material("Farm_Brown_Egg", (0.84, 0.65, 0.47, 1.0), roughness=0.48)
    eg_tray = create_recessed_box(
        "eg_tr", (0, 0, 0.024), (0.18, 0.27, 0.046),
        cavity_face='+Z', margin=(0.014, 0.014), cavity_depth=0.024,
        outer_mat=mat_pulp, inner_mat=mat_pulp, bevel=0.006
    )
    eg_lid = create_box("eg_ld", (-0.105, 0, 0.105), (0.175, 0.268, 0.022), mat_pulp,
                        rotation=(0, math.radians(-68), 0), bevel=0.006)
    eg_parts.extend([eg_tray, eg_lid])
    egg_prof = [
        (0.000, 0.000), (0.018, 0.008), (0.023, 0.024),
        (0.020, 0.044), (0.012, 0.058), (0.000, 0.064)
    ]
    for ex in (-0.042, 0.042):
        for ey in (-0.082, 0.0, 0.082):
            egg = create_lathe_profile(egg_prof, segments=24, name=f"egg_{ex}_{ey}",
                                       material=mat_egg, location=(ex, ey, 0.018), smooth_steps=1, cap_ends=False)
            eg_parts.append(egg)
    eg = join_as_named_object(eg_parts, "Egg_Carton")
    place_on_surface(eg, -3.84, 0.15, 0.78)

    # 4. Milk_Carton (Tier 1: Z = 0.32m) - Series of 4 Gable-Top Pitched-Roof Cartons
    mk_parts = []
    mk_cols = [
        (0.14, 0.46, 0.82, 1.0),
        (0.14, 0.46, 0.82, 1.0),
        (0.22, 0.56, 0.38, 1.0),
        (0.72, 0.22, 0.22, 1.0),
    ]
    for i, mcol in enumerate(mk_cols):
        mk_parts.extend(build_gable_milk_carton(f"mk_{i}", offset=(0, (i - 1.5) * 0.14, 0), accent_color=mcol))
    milk = join_as_named_object(mk_parts, "Milk_Carton")
    place_on_surface(milk, -3.86, 1.25, 0.32)

    # --- GONDOLA 2 PRODUCTS (East face X = -0.66) ---
    # 5. Mayonnaise (Tier 3: Z = 1.24m) - Series of 3 lathe-turned curved glass jars
    my_parts = []
    mat_mayo = get_material("Creamy_Mayo", (0.96, 0.94, 0.84, 1.0), roughness=0.28, coat_weight=0.35)
    mat_mayo_lbl = get_material("Mayo_Navy_Label", (0.10, 0.24, 0.54, 1.0), roughness=0.38)
    for i in range(3):
        oy = (i - 1.0) * 0.15
        jar = create_lathe_profile([
            (0.038, 0.000, 'sharp'), (0.048, 0.022), (0.044, 0.075),
            (0.050, 0.115), (0.038, 0.142), (0.040, 0.152, 'sharp')
        ], segments=28, name=f"my_j_{i}", material=mat_mayo, location=(0, oy, 0))
        lbl = create_cylinder(f"my_lb_{i}", (0, oy, 0.076), 0.0465, 0.056, mat_mayo_lbl, bevel=0.0)
        lid = create_cylinder(f"my_ld_{i}", (0, oy, 0.160), 0.042, 0.020, mat_gold(), bevel=0.004)
        my_parts.extend([jar, lbl, lid])
    mayo = join_as_named_object(my_parts, "Mayonnaise")
    place_on_surface(mayo, -0.66, 2.15, 1.24)

    # 6. Table_Cream (Tier 2: Z = 0.78m) - Series of 3 lathe-turned flared dairy cups
    tc_parts = []
    mat_cream = get_material("Dairy_Cream_Cup", (0.97, 0.96, 0.92, 1.0), roughness=0.26)
    for i in range(3):
        oy = (i - 1.0) * 0.14
        cup = create_lathe_profile([
            (0.030, 0.000, 'sharp'), (0.034, 0.04), (0.043, 0.112),
            (0.047, 0.118, 'sharp'), (0.045, 0.123, 'sharp')
        ], segments=28, name=f"tc_c_{i}", material=mat_cream, location=(0, oy, 0))
        band = create_cone(f"tc_b_{i}", (0, oy, 0.068), 0.036, 0.041, 0.048,
                           get_material("Cream_Gold_Band", (0.20, 0.48, 0.72, 1.0), roughness=0.4), bevel=0.0)
        foil = create_cylinder(f"tc_f_{i}", (0, oy, 0.124), 0.045, 0.003, mat_gold(), bevel=0.001)
        tc_parts.extend([cup, band, foil])
    cream = join_as_named_object(tc_parts, "Table_Cream")
    place_on_surface(cream, -0.66, 0.65, 0.78)

    # 7. Canned_Tuna (Tier 1: Z = 0.32m) - Pyramid stack of 5 lathe-turned cans with pull-tabs
    tuna_parts = []
    mat_tuna_lbl = get_material("Ocean_Tuna_Label", (0.12, 0.38, 0.68, 1.0), roughness=0.42)
    can_offsets = [(0, -0.15, 0.0), (0, 0.0, 0.0), (0, 0.15, 0.0), (0, -0.075, 0.056), (0, 0.075, 0.056)]
    for idx, (cx, cy, cz) in enumerate(can_offsets):
        can = create_lathe_profile([
            (0.048, 0.000, 'sharp'), (0.052, 0.003, 'sharp'), (0.050, 0.006, 'sharp'),
            (0.050, 0.050, 'sharp'), (0.052, 0.053, 'sharp'), (0.048, 0.056, 'sharp')
        ], segments=28, name=f"tn_c_{idx}", material=mat_steel(), location=(cx, cy, cz), smooth_steps=0)
        lbl = create_cylinder(f"tn_l_{idx}", (cx, cy, cz + 0.028), 0.0506, 0.038, mat_tuna_lbl, bevel=0.0)
        tab = create_torus(f"tn_t_{idx}", (cx + 0.015, cy, cz + 0.057), 0.010, 0.002, mat_chrome())
        tuna_parts.extend([can, lbl, tab])
    tuna = join_as_named_object(tuna_parts, "Canned_Tuna")
    place_on_surface(tuna, -0.66, 1.40, 0.32)

    # --- GONDOLA 3 PRODUCTS (East face X = +2.54) ---
    # 8. Ketchup (Tier 3: Z = 1.24m) - Series of 3 lathe-turned long-neck ketchup bottles
    kt_parts = []
    mat_ketchup = get_material("Rich_Tomato_Ketchup", (0.68, 0.09, 0.08, 1.0), roughness=0.22, coat_weight=0.45)
    for i in range(3):
        oy = (i - 1.0) * 0.14
        btl = create_lathe_profile([
            (0.034, 0.000, 'sharp'), (0.040, 0.025), (0.039, 0.105),
            (0.022, 0.148), (0.017, 0.195), (0.019, 0.205, 'sharp')
        ], segments=24, name=f"kt_b_{i}", material=mat_ketchup, location=(0, oy, 0))
        collar = create_cylinder(f"kt_nl_{i}", (0, oy, 0.165), 0.0195, 0.026, mat_linen_white(), bevel=0.0)
        lbl = create_cylinder(f"kt_lb_{i}", (0, oy, 0.068), 0.0402, 0.048, mat_linen_white(), bevel=0.0)
        cap = create_cylinder(f"kt_cp_{i}", (0, oy, 0.217), 0.019, 0.024, mat_porcelain(), bevel=0.004)
        kt_parts.extend([btl, collar, lbl, cap])
    ketchup = join_as_named_object(kt_parts, "Ketchup")
    place_on_surface(ketchup, 2.54, 2.10, 1.24)

    # 9. Cooking_Oil (Tier 2: Z = 0.78m) - Series of 3 lathe-turned waist-grip golden oil bottles
    oil_parts = []
    mat_oil = get_material("Golden_Olive_Sunflower_Oil", (0.88, 0.71, 0.16, 0.85),
                           roughness=0.12, transmission=0.65, alpha=0.85)
    mat_oil_cap = get_material("Emerald_Pour_Cap", (0.14, 0.48, 0.24, 1.0), roughness=0.35)
    for i in range(3):
        oy = (i - 1.0) * 0.15
        btl = create_lathe_profile([
            (0.038, 0.000, 'sharp'), (0.043, 0.045), (0.034, 0.095),
            (0.043, 0.148), (0.020, 0.192), (0.018, 0.215, 'sharp')
        ], segments=28, name=f"ol_b_{i}", material=mat_oil, location=(0, oy, 0))
        cap = create_cylinder(f"ol_c_{i}", (0, oy, 0.228), 0.019, 0.026, mat_oil_cap, bevel=0.003)
        oil_parts.extend([btl, cap])
    oil = join_as_named_object(oil_parts, "Cooking_Oil")
    place_on_surface(oil, 2.54, 0.70, 0.78)

    # --- CHECKOUT LANE ZONE (X = 5.0, Y = -2.3, top_z = 0.90m) ---
    # 10. Checkout_Counter (Conveyor belt + stainless bagging deck, top strictly at Z = 0.90m)
    cc_base = create_box("cc_bs", (0, 0, 0.425), (1.36, 2.65, 0.85), mat_steel(), bevel=0.012)
    cc_trim = create_box("cc_tr", (-0.69, 0, 0.425), (0.03, 2.55, 0.76), mat_dark_steel(), bevel=0.005)
    cc_deck = create_box("cc_dk", (0.36, 0, 0.875), (0.64, 2.68, 0.05), mat_steel(), bevel=0.008)
    cc_belt_bed = create_box("cc_bb", (-0.32, 0, 0.870), (0.72, 2.68, 0.04), mat_chrome(), bevel=0.006)
    cc_belt = create_box("cc_bl", (-0.32, 0, 0.893), (0.64, 2.48, 0.014),
                         get_material("Conveyor_Rubber_Black", (0.09, 0.09, 0.10, 1.0), roughness=0.72), bevel=0.003)
    cc_div = create_box("cc_dv", (-0.32, 0.45, 0.915), (0.60, 0.035, 0.03), mat_gold(), bevel=0.004)
    checkout = join_as_named_object([cc_base, cc_trim, cc_deck, cc_belt_bed, cc_belt, cc_div], "Checkout_Counter")
    place_on_surface(checkout, 5.0, -2.3, 0.0)

    # 11. Cash_Register (POS terminal on Checkout_Counter Z = 0.90m, at X=5.32, Y=-1.35)
    cr_parts = create_appliance_chassis(
        "Cash_Register", (0.40, 0.38, 0.11),
        body_mat=mat_dark_steel(), inner_mat=mat_chrome(),
        cavity_face='-Y', cavity_margin=0.02, cavity_depth=0.0,
        doors=[{'center': (0, -0.195, 0.055), 'size': (0.37, 0.015, 0.085), 'mat': mat_steel(), 'bevel': 0.005}],
        feet_height=0.008
    )
    cr_neck = create_cylinder("cr_nk", (0, 0.04, 0.18), 0.028, 0.16, mat_chrome())
    cr_mon = create_box("cr_mn", (0, -0.02, 0.29), (0.32, 0.026, 0.21), mat_dark_steel(),
                        rotation=(math.radians(24), 0, 0), bevel=0.006)
    cr_scr = create_box("cr_sc", (0, -0.034, 0.295), (0.29, 0.004, 0.18),
                        mat_screen((0.20, 0.76, 0.56, 1.0), 1.5, "POS_Screen"),
                        rotation=(math.radians(24), 0, 0), bevel=0.001)
    cr_printer = create_box("cr_pr", (0.14, 0.11, 0.155), (0.11, 0.13, 0.09), mat_dark_steel(), bevel=0.008)
    cr_receipt = create_box("cr_rc", (0.14, 0.11, 0.215), (0.075, 0.004, 0.05), mat_porcelain(),
                            rotation=(math.radians(-18), 0, 0), bevel=0.001)
    cr_parts.extend([cr_neck, cr_mon, cr_scr, cr_printer, cr_receipt])
    cr = join_as_named_object(cr_parts, "Cash_Register")
    place_on_surface(cr, 5.32, -1.35, 0.90)

    # 12. Barcode_Scanner (on Checkout_Counter Z = 0.90m, at X=5.12, Y=-2.25)
    bs_dock = create_lathe_profile([
        (0.062, 0.000, 'sharp'), (0.065, 0.015), (0.042, 0.048, 'sharp')
    ], segments=28, name="bs_dk", material=mat_dark_steel())
    bs_stem = create_curved_tube(
        "bs_st", [(0, 0.01, 0.04), (0, 0.03, 0.11), (0, 0.0, 0.175)],
        radius=0.016, material=mat_dark_steel()
    )
    bs_head = create_box("bs_hd", (0, -0.035, 0.185), (0.068, 0.105, 0.052), mat_steel(),
                         rotation=(math.radians(22), 0, 0), bevel=0.010)
    bs_win = create_box("bs_wn", (0, -0.088, 0.205), (0.054, 0.006, 0.034),
                        mat_screen((0.88, 0.18, 0.18, 1.0), 1.6, "Scanner_Beam"),
                        rotation=(math.radians(22), 0, 0), bevel=0.002)
    bs = join_as_named_object([bs_dock, bs_stem, bs_head, bs_win], "Barcode_Scanner")
    place_on_surface(bs, 5.12, -2.25, 0.90)

    # 13. Card_Reader (on Checkout_Counter Z = 0.90m, at X=5.30, Y=-3.05)
    cd_base = create_cylinder("cd_bs", (0, 0, 0.01), 0.048, 0.02, mat_dark_steel())
    cd_pole = create_cylinder("cd_pl", (0, 0, 0.065), 0.016, 0.10, mat_chrome())
    cd_body = create_box("cd_bd", (0, 0, 0.145), (0.105, 0.185, 0.038), mat_dark_steel(),
                         rotation=(math.radians(34), 0, 0), bevel=0.008)
    cd_scr = create_box("cd_sc", (0, -0.032, 0.178), (0.082, 0.068, 0.004),
                        mat_screen((0.22, 0.68, 0.92, 1.0), 1.5, "NFC_Screen"),
                        rotation=(math.radians(34), 0, 0), bevel=0.001)
    cd_pad = create_box("cd_pd", (0, 0.038, 0.132), (0.080, 0.072, 0.005), mat_steel(),
                        rotation=(math.radians(34), 0, 0), bevel=0.002)
    card_reader = join_as_named_object([cd_base, cd_pole, cd_body, cd_scr, cd_pad], "Card_Reader")
    place_on_surface(card_reader, 5.30, -3.05, 0.90)

    # 14. Shopping_Cart (Tubular wire-grid supermarket cart with wheels at X=-3.7, Y=-4.0, Z=0.0)
    sc_parts = []
    # Lower tubular chassis & 4 caster wheels
    chassis_tube = create_curved_tube(
        "sc_chs",
        [(-0.24, -0.34, 0.15), (-0.24, 0.36, 0.15), (0.24, 0.36, 0.15), (0.24, -0.34, 0.15),
         (0.24, -0.38, 0.88), (-0.24, -0.38, 0.88), (-0.24, -0.34, 0.15)],
        radius=0.013, material=mat_chrome()
    )
    sc_parts.append(chassis_tube)
    for wx in (-0.23, 0.23):
        for wy in (-0.30, 0.32):
            fork = create_box(f"sc_fk_{wx}_{wy}", (wx, wy, 0.105), (0.032, 0.045, 0.07), mat_steel(), bevel=0.004)
            whl = create_cylinder(f"sc_wh_{wx}_{wy}", (wx, wy, 0.055), 0.055, 0.026, mat_dark_steel(),
                                  rotation=(0, math.radians(90), 0))
            hub = create_cylinder(f"sc_hb_{wx}_{wy}", (wx, wy, 0.055), 0.022, 0.030, mat_chrome(),
                                  rotation=(0, math.radians(90), 0))
            sc_parts.extend([fork, whl, hub])

    # Open Wire-Grid Basket: 4 horizontal wire rings + vertical ribs + floor wires
    ring_heights = [(0.42, 0.24, 0.34), (0.56, 0.255, 0.36), (0.70, 0.27, 0.38), (0.84, 0.285, 0.40)]
    for ri, (rz, rx, ry) in enumerate(ring_heights):
        ring = create_curved_tube(
            f"sc_rg_{ri}",
            [(-rx, -ry, rz), (rx, -ry, rz), (rx, ry, rz), (-rx, ry, rz)],
            radius=0.008 if ri == 3 else 0.0055, material=mat_chrome(), closed=True
        )
        sc_parts.append(ring)
    # Vertical wire ribs around basket sides & front
    for vx in (-0.24, -0.12, 0.0, 0.12, 0.24):
        rib_f = create_cylinder(f"sc_rbf_{vx}", (vx, 0.37, 0.63), 0.004, 0.43, mat_chrome(),
                                rotation=(math.radians(-8), 0, 0))
        rib_b = create_cylinder(f"sc_rbb_{vx}", (vx, -0.37, 0.63), 0.004, 0.43, mat_chrome(),
                                rotation=(math.radians(8), 0, 0))
        wire_bot = create_cylinder(f"sc_wb_{vx}", (vx, 0.0, 0.42), 0.004, 0.68, mat_chrome(),
                                   rotation=(math.radians(90), 0, 0))
        sc_parts.extend([rib_f, rib_b, wire_bot])
    for vy in (-0.24, -0.10, 0.04, 0.18, 0.30):
        rib_l = create_cylinder(f"sc_rbl_{vy}", (-0.26, vy, 0.63), 0.004, 0.43, mat_chrome(),
                                rotation=(0, math.radians(-6), 0))
        rib_r = create_cylinder(f"sc_rbr_{vy}", (0.26, vy, 0.63), 0.004, 0.43, mat_chrome(),
                                rotation=(0, math.radians(6), 0))
        sc_parts.extend([rib_l, rib_r])
    # Ergonomic push handle & child seat flap
    handle_bar = create_cylinder("sc_hnd", (0, -0.45, 0.92), 0.017, 0.54, mat_velvet_red(),
                                 rotation=(0, math.radians(90), 0))
    child_seat = create_box("sc_cs", (0, -0.26, 0.68), (0.36, 0.018, 0.24), mat_velvet_red(),
                            rotation=(math.radians(16), 0, 0), bevel=0.005)
    sc_parts.extend([handle_bar, child_seat])
    cart = join_as_named_object(sc_parts, "Shopping_Cart")
    place_on_surface(cart, -3.7, -4.0, 0.0)

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "supermarket.glb"))
    print("WORLD 2 (SUPERMARKET) EXPORTED SUCCESSFULLY!\n")


# ==============================================================================
# WORLD 3: RESTAURANT.GLB
# Warm Parquet & Bordeaux Rug + Dual-Group Espresso Bar + 4 Draped Bistro Tables (Z=0.78m)
# ==============================================================================
def build_restaurant():
    reset_scene()
    print("Building World 3: Gourmet Bistro & Restaurant (Lathe Tableware & Draped Linen)...")
    add_bounds_anchor(radius_x=8.0, radius_y=7.0)

    # 1. Warm Parquet Floor & Deep Bordeaux Burgundy Rug (#4a1525 - Zero Fuchsia/Hot-Pink)
    build_isometric_room(
        "Restaurant",
        floor_size=(16.0, 14.0),
        floor_mat=mat_parquet(),
        wall_mat=get_material("Bistro_Cream_Wall", base_color=(0.94, 0.91, 0.87, 1.0), roughness=0.55),
        baseboard_mat=mat_dark_walnut(),
        north_y=6.0,
        west_x=-7.0,
        wall_height=3.6,
        has_window=True,
        window_pos=(0.0, 6.0, 2.05),
        window_size=(3.8, 1.75),
        rug_config=(0.0, -0.85, 9.6, 7.5, mat_burgundy_rug(), False),
        floor_style='parquet',
        wainscot=True,
        add_sconces=True
    )

    # 2. Bar_Credenza (Chef's Walnut & Nero Marble Bar at X=0, Y=4.55, top_z = 0.95m)
    bc_parts = []
    bc_plinth = create_box("bc_pl", (0, 4.55, 0.05), (5.10, 0.80, 0.10), mat_dark_steel(), bevel=0.005)
    bc_body = create_box("bc_bd", (0, 4.55, 0.50), (5.20, 0.88, 0.80), mat_dark_walnut(), bevel=0.012)
    bc_top = create_box("bc_tp", (0, 4.55, 0.925), (5.34, 0.96, 0.05), mat_black_marble(), bevel=0.008)
    bc_footrail = create_cylinder("bc_fr", (0, 3.98, 0.16), 0.018, 4.90, mat_gold(), rotation=(0, math.radians(90), 0))
    bc_parts.extend([bc_plinth, bc_body, bc_top, bc_footrail])
    for px in (-1.8, -0.6, 0.6, 1.8):
        pnl = create_box(f"bc_pn_{px}", (px, 4.10, 0.50), (0.98, 0.025, 0.64), mat_warm_wood(), bevel=0.008)
        brk = create_cylinder(f"bc_bk_{px}", (px, 4.04, 0.16), 0.012, 0.14, mat_gold(), rotation=(math.radians(90), 0, 0))
        bc_parts.extend([pnl, brk])
    join_as_named_object(bc_parts, "Bar_Credenza")

    # 3. Espresso_Machine (Commercial Dual-Group Barista Machine on bar Z = 0.95m)
    em_parts = create_appliance_chassis(
        "Espresso_Machine", (0.70, 0.46, 0.48),
        body_mat=mat_steel(), inner_mat=mat_dark_steel(),
        cavity_face='-Y', cavity_margin=0.045, cavity_depth=0.14,
        knobs=[
            {'center': (-0.28, -0.235, 0.39), 'radius': 0.022, 'depth': 0.020, 'mat': mat_dark_walnut()},
            {'center': (0.28, -0.235, 0.39), 'radius': 0.022, 'depth': 0.020, 'mat': mat_dark_walnut()},
        ],
        vents=[{
            'start': (-0.352, -0.10, 0.16), 'step': (0, 0, 0.026), 'count': 6,
            'slot_size': (0.006, 0.22, 0.008)
        }],
        feet_height=0.018
    )
    em_drip = create_box("em_dr", (0, -0.18, 0.042), (0.62, 0.18, 0.045), mat_chrome(), bevel=0.006)
    em_rail = create_curved_tube(
        "em_rl", [(-0.31, -0.16, 0.51), (-0.31, 0.18, 0.51), (0.31, 0.18, 0.51), (0.31, -0.16, 0.51)],
        radius=0.007, material=mat_chrome()
    )
    em_gauge = create_cylinder("em_gg", (0, -0.232, 0.39), 0.032, 0.016, mat_gold(), rotation=(math.radians(90), 0, 0))
    em_gface = create_cylinder("em_gf", (0, -0.241, 0.39), 0.026, 0.004, mat_porcelain(), rotation=(math.radians(90), 0, 0))
    em_parts.extend([em_drip, em_rail, em_gauge, em_gface])
    # Dual brew groups, angled walnut portafilters, steam wands & porcelain cups on top
    for side, gx in (("l", -0.15), ("r", 0.15)):
        grp = create_cylinder(f"em_gp_{side}", (gx, -0.16, 0.29), 0.044, 0.075, mat_chrome())
        spout = create_cylinder(f"em_sp_{side}", (gx, -0.16, 0.24), 0.018, 0.035, mat_gold())
        pf_hnd = create_cone(f"em_pf_{side}", (gx, -0.27, 0.255), 0.011, 0.018, 0.16, mat_dark_walnut(),
                             rotation=(math.radians(82), 0, math.radians(-10 if gx < 0 else 10)))
        wand = create_curved_tube(
            f"em_wd_{side}",
            [(gx * 1.75, -0.16, 0.32), (gx * 1.9, -0.20, 0.22), (gx * 1.8, -0.19, 0.11)],
            radius=0.0055, material=mat_chrome()
        )
        cup = create_lathe_profile([
            (0.020, 0.0, 'sharp'), (0.030, 0.048, 'sharp'),
            (0.027, 0.048, 'sharp'), (0.017, 0.005, 'sharp'), (0.0, 0.005, 'sharp')
        ], segments=20, name=f"em_cp_{side}", material=mat_porcelain(), location=(gx, 0.02, 0.48), cap_ends=False)
        em_parts.extend([grp, spout, pf_hnd, wand, cup])
    espresso = join_as_named_object(em_parts, "Espresso_Machine")
    place_on_surface(espresso, -0.90, 4.52, 0.95)

    # 4. Olive_Oil (Lathe-turned Mediterranean cruet bottle on bar Z = 0.95m)
    oo_glass = create_lathe_profile([
        (0.038, 0.000, 'sharp'), (0.052, 0.038), (0.048, 0.092),
        (0.020, 0.148), (0.016, 0.195), (0.019, 0.205, 'sharp')
    ], segments=28, name="oo_gl",
        material=get_material("Extra_Virgin_Olive_Oil", (0.62, 0.66, 0.14, 0.86),
                              roughness=0.10, transmission=0.65, alpha=0.86))
    oo_loop = create_curved_tube(
        "oo_lp", [(0.018, 0, 0.18), (0.056, 0, 0.165), (0.062, 0, 0.115), (0.046, 0, 0.085)],
        radius=0.0055, material=mat_glass()
    )
    oo_cork = create_cylinder("oo_ck", (0, 0, 0.214), 0.015, 0.020, mat_gold())
    oo_spout = create_curved_tube(
        "oo_sp", [(0, 0, 0.222), (0, -0.008, 0.246), (0, -0.026, 0.258)],
        radius=0.0038, material=mat_chrome()
    )
    olive_oil = join_as_named_object([oo_glass, oo_loop, oo_cork, oo_spout], "Olive_Oil")
    place_on_surface(olive_oil, 0.90, 4.52, 0.95)

    # 5. Dining_Table: 4 Round Bistro Tables with Draped Linen Tablecloths (strictly top_z = 0.78m) & Chairs
    table_coords = [(-3.2, -2.5), (3.2, -2.5), (-3.2, 0.85), (3.2, 0.85)]
    table_objs = []
    for i, (tx, ty) in enumerate(table_coords):
        ped = create_lathe_profile([
            (0.32, 0.000, 'sharp'), (0.31, 0.025), (0.12, 0.065),
            (0.055, 0.18), (0.072, 0.38), (0.052, 0.68), (0.24, 0.74, 'sharp')
        ], segments=28, name=f"dt_ped_{i}", material=mat_dark_walnut(), location=(tx, ty, 0.0))
        wood_top = create_cylinder(f"dt_wt_{i}", (tx, ty, 0.755), 0.73, 0.03, mat_warm_wood())
        cloth = create_draped_tablecloth(f"dt_cl_{i}", (tx, ty), top_z=0.78,
                                         table_radius=0.74, drop_height=0.23, pleats=16,
                                         material=mat_linen_white())
        table_objs.extend([ped, wood_top, cloth])

        # 2 Upholstered Bistro Chairs per table (East and West so tabletop is 100% unobstructed from South camera!)
        for side_s, dx in (("w", -0.96), ("e", 0.96)):
            ch_x = tx + dx
            seat = create_soft_cushion((0.44, 0.44, 0.07), bevel_width=0.02, subdiv=2,
                                       name=f"dt_cs_{i}_{side_s}", location=(ch_x, ty, 0.45),
                                       material=mat_burgundy_rug(), puff=0.14)
            back = create_soft_cushion((0.07, 0.42, 0.42), bevel_width=0.02, subdiv=2,
                                       name=f"dt_cb_{i}_{side_s}",
                                       location=(ch_x + (-0.20 if dx < 0 else 0.20), ty, 0.72),
                                       material=mat_burgundy_rug(), puff=0.14)
            table_objs.extend([seat, back])
            for lx_o in (-0.17, 0.17):
                for ly_o in (-0.17, 0.17):
                    lg = create_cone(f"dt_clg_{i}_{side_s}_{lx_o}_{ly_o}",
                                     (ch_x + lx_o, ty + ly_o, 0.21), 0.012, 0.020, 0.42, mat_dark_walnut())
                    table_objs.append(lg)
    join_as_named_object(table_objs, "Dining_Table")

    # --- TABLE 1 (-3.2, -2.5): GOURMET PLACE SETTING AT EXACT Z = 0.78m ---
    # 6. Main_Course (Lathe-turned plate + organic filet mignon steak + mashed potato puré + 3 asparagus)
    mc_plate = build_gourmet_plate("mc", radius=0.165)
    mc_steak = create_soft_cushion(
        (0.115, 0.082, 0.028), bevel_width=0.010, subdiv=2, name="mc_stk",
        location=(-0.025, -0.015, 0.022), rotation=(0, 0, math.radians(15)),
        material=get_material("Seared_Filet_Steak", (0.27, 0.11, 0.07, 1.0), roughness=0.52), puff=0.16
    )
    mc_butter = create_cylinder("mc_bt", (-0.025, -0.015, 0.040), 0.016, 0.008,
                                get_material("Herb_Butter_Pat", (0.93, 0.87, 0.48, 1.0), roughness=0.30))
    mc_puree = create_lathe_profile([
        (0.044, 0.008, 'sharp'), (0.042, 0.022), (0.028, 0.036), (0.010, 0.042), (0.000, 0.038)
    ], segments=24, name="mc_pur",
        material=get_material("Mashed_Potato_Puree", (0.95, 0.91, 0.78, 1.0), roughness=0.65),
        location=(0.052, 0.032, 0.0))
    mc_parts = [mc_plate, mc_steak, mc_butter, mc_puree]
    mat_asp = get_material("Tender_Asparagus", (0.20, 0.48, 0.16, 1.0), roughness=0.48)
    for ai in range(3):
        ay = -0.068 + ai * 0.016
        spear = create_cone(f"mc_asp_{ai}", (0.015, ay, 0.016), 0.0065, 0.0035, 0.125, mat_asp,
                            rotation=(0, math.radians(88), math.radians(12)))
        mc_parts.append(spear)
    main_course = join_as_named_object(mc_parts, "Main_Course")
    place_on_surface(main_course, -3.20, -2.50, 0.78)

    # 7. Fork (Sculpted silver dinner fork with 4 distinct tines on left of plate, Z = 0.78m)
    fk_hnd = create_box("fk_hd", (0, -0.048, 0.005), (0.014, 0.105, 0.004), mat_chrome(), bevel=0.002)
    fk_neck = create_box("fk_nk", (0, 0.016, 0.005), (0.010, 0.030, 0.004), mat_chrome(), bevel=0.002)
    fk_bar = create_box("fk_br", (0, 0.033, 0.005), (0.025, 0.008, 0.004), mat_chrome(), bevel=0.002)
    fk_parts = [fk_hnd, fk_neck, fk_bar]
    for ti, tx_o in enumerate((-0.009, -0.003, 0.003, 0.009)):
        tine = create_cone(f"fk_tn_{ti}", (tx_o, 0.060, 0.005), 0.0022, 0.0009, 0.048, mat_chrome(),
                           rotation=(math.radians(-90), 0, 0))
        fk_parts.append(tine)
    fork = join_as_named_object(fk_parts, "Fork")
    place_on_surface(fork, -3.43, -2.50, 0.78)

    # 8. Knife (Riveted dark walnut handle + bolster + tapered steel blade, Z = 0.78m)
    kn_hnd = create_box("kn_hd", (0, -0.055, 0.007), (0.015, 0.105, 0.012), mat_dark_walnut(), bevel=0.004)
    kn_bol = create_cylinder("kn_bl", (0, 0.002, 0.007), 0.008, 0.014, mat_chrome(), rotation=(math.radians(90), 0, 0))
    kn_bld = create_box("kn_bd", (0, 0.062, 0.007), (0.0028, 0.112, 0.016), mat_steel(), bevel=0.001)
    knife = join_as_named_object([kn_hnd, kn_bol, kn_bld], "Knife")
    place_on_surface(knife, -2.97, -2.50, 0.78)

    # 9. Spoon (Contoured handle + oval concave spoon bowl, Z = 0.78m)
    sp_hnd = create_box("sp_hd", (0, -0.048, 0.005), (0.013, 0.105, 0.004), mat_chrome(), bevel=0.002)
    sp_bowl = create_lathe_profile([
        (0.000, 0.000, 'sharp'), (0.017, 0.004), (0.020, 0.009, 'sharp'),
        (0.018, 0.009, 'sharp'), (0.014, 0.004), (0.000, 0.002, 'sharp')
    ], segments=24, name="sp_bw", material=mat_chrome(), location=(0, 0.036, 0.001),
        scale=(0.88, 1.45, 1.0), cap_ends=False)
    spoon = join_as_named_object([sp_hnd, sp_bowl], "Spoon")
    place_on_surface(spoon, -2.87, -2.50, 0.78)

    # 10. Wine_Glass (Lathe-turned crystal Bordeaux wine glass with ruby wine at Z = 0.78m)
    wg = join_as_named_object(build_crystal_wine_glass("rest_wg", with_wine=True), "Wine_Glass")
    place_on_surface(wg, -3.00, -2.24, 0.78)

    # 11. Napkin (Folded soft linen napkin with brushed gold ring at Z = 0.78m)
    np_fold = create_soft_cushion((0.085, 0.175, 0.026), bevel_width=0.008, subdiv=2, name="np_fl",
                                  material=mat_linen_white(), puff=0.14)
    np_ring = create_torus("np_rg", (0, 0, 0.015), 0.028, 0.005, mat_gold(),
                           rotation=(math.radians(90), 0, 0), scale=(1.45, 0.72, 1.0))
    napkin = join_as_named_object([np_fold, np_ring], "Napkin")
    place_on_surface(napkin, -3.55, -2.50, 0.78)

    # --- TABLE 2 (+3.2, -2.5): MENU & SALT/PEPPER SHAKERS AT EXACT Z = 0.78m ---
    # 12. Menu (Open standing leather-bound gourmet menu folder)
    mat_leather_menu = get_material("Bordeaux_Menu_Leather", (0.32, 0.08, 0.11, 1.0), roughness=0.45)
    mn_l = create_box("mn_l", (-0.075, 0, 0.13), (0.16, 0.010, 0.25), mat_leather_menu,
                      rotation=(math.radians(10), 0, math.radians(22)), bevel=0.003)
    mn_r = create_box("mn_r", (0.075, 0, 0.13), (0.16, 0.010, 0.25), mat_leather_menu,
                      rotation=(math.radians(10), 0, math.radians(-22)), bevel=0.003)
    mn_pl = create_box("mn_pl", (-0.072, -0.006, 0.13), (0.14, 0.004, 0.225), mat_linen_white(),
                       rotation=(math.radians(10), 0, math.radians(22)), bevel=0.001)
    mn_pr = create_box("mn_pr", (0.072, -0.006, 0.13), (0.14, 0.004, 0.225), mat_linen_white(),
                       rotation=(math.radians(10), 0, math.radians(-22)), bevel=0.001)
    mn_crest = create_cylinder("mn_cr", (0.072, -0.010, 0.17), 0.020, 0.004, mat_gold(),
                               rotation=(math.radians(100), 0, math.radians(-22)))
    menu = join_as_named_object([mn_l, mn_r, mn_pl, mn_pr, mn_crest], "Menu")
    place_on_surface(menu, 3.20, -2.55, 0.78)

    # 13. Salt_Pepper_Shakers (Lathe-turned glass shakers on walnut caddy at Z = 0.78m)
    sp_tray = create_box("sp_tr", (0, 0, 0.006), (0.13, 0.075, 0.012), mat_dark_walnut(), bevel=0.004)
    sp_parts = [sp_tray]
    for sx, sname, fill_mat, cap_m in (
        (-0.034, "salt", mat_porcelain(), mat_chrome()),
        (0.034, "pepp", get_material("Ground_Pepper", (0.20, 0.17, 0.15, 1.0), roughness=0.8), mat_gold())
    ):
        jar = create_lathe_profile([
            (0.019, 0.012, 'sharp'), (0.024, 0.032), (0.020, 0.078), (0.016, 0.088, 'sharp')
        ], segments=20, name=f"sh_{sname}", material=fill_mat, location=(sx, 0, 0))
        cap = create_lathe_profile([
            (0.017, 0.088, 'sharp'), (0.018, 0.098), (0.011, 0.108), (0.000, 0.111)
        ], segments=20, name=f"shc_{sname}", material=cap_m, location=(sx, 0, 0))
        sp_parts.extend([jar, cap])
    shakers = join_as_named_object(sp_parts, "Salt_Pepper_Shakers")
    place_on_surface(shakers, 3.20, -2.20, 0.78)

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "restaurant.glb"))
    print("WORLD 3 (RESTAURANT) EXPORTED SUCCESSFULLY!\n")


# ==============================================================================
# WORLD 4: HOTEL.GLB
# Imperial Veined Marble & Walnut Lobby + Concierge Desk (Z=1.05m) + Birdcage Cart + Clutter-Free King Suite
# ==============================================================================
def build_hotel():
    reset_scene()
    print("Building World 4: Luxury Hotel Lobby & Presidential Suite...")
    add_bounds_anchor(radius_x=8.0, radius_y=7.0)

    # 1. Imperial Marble & Walnut Wainscoted Diorama + Safe Credenza Pedestal
    diorama = build_isometric_room(
        "Hotel",
        floor_size=(16.0, 14.0),
        floor_mat=mat_black_marble(),
        wall_mat=mat_travertine(),
        baseboard_mat=mat_dark_walnut(),
        north_y=6.0,
        west_x=-7.0,
        wall_height=3.7,
        has_window=True,
        window_pos=(2.8, 6.0, 2.10),
        window_size=(3.6, 1.80),
        rug_config=(3.0, 0.9, 5.4, 4.8, mat_burgundy_rug(), False),
        floor_style='marble',
        wainscot=True,
        add_sconces=True
    )
    # Architectural walnut suite credenza pedestal at (5.35, -3.65) top_z=0.52m to hold Safe_Box cleanly
    cred_base = create_box("ht_crd_b", (5.35, -3.65, 0.04), (0.86, 0.56, 0.08), mat_gold(), bevel=0.005)
    cred_body = create_box("ht_crd_c", (5.35, -3.65, 0.27), (0.90, 0.60, 0.38), mat_dark_walnut(), bevel=0.010)
    cred_top = create_box("ht_crd_t", (5.35, -3.65, 0.49), (0.94, 0.64, 0.06), mat_black_marble(), bevel=0.008)
    # Lobby brass crest emblem behind concierge desk on North wall
    crest_ring = create_torus("ht_crs_r", (-3.1, 5.84, 2.45), 0.38, 0.022, mat_gold(), rotation=(math.radians(90), 0, 0))
    crest_plate = create_cylinder("ht_crs_p", (-3.1, 5.85, 2.45), 0.34, 0.018, mat_dark_walnut(), rotation=(math.radians(90), 0, 0))
    join_as_named_object([diorama, cred_base, cred_body, cred_top, crest_ring, crest_plate], "Hotel_Diorama")

    # 2. Reception_Desk (Concierge Walnut, Fluted Brass & Nero Marble Desk at X=-3.1, Y=4.35, top_z = 1.05m)
    rd_parts = []
    rd_plinth = create_box("rd_pl", (0, 0, 0.05), (3.44, 0.84, 0.10), mat_gold(), bevel=0.005)
    rd_core = create_box("rd_cr", (0, 0, 0.545), (3.50, 0.90, 0.89), mat_dark_walnut(), bevel=0.012)
    rd_panel = create_box("rd_pn", (0, -0.455, 0.545), (3.16, 0.03, 0.72), mat_warm_wood(), bevel=0.008)
    rd_top = create_box("rd_tp", (0, 0, 1.02), (3.64, 1.02, 0.06), mat_black_marble(), bevel=0.010)
    rd_parts.extend([rd_plinth, rd_core, rd_panel, rd_top])
    # Architectural vertical brass flutes along concierge front
    for fx in [(-1.40 + i * 0.28) for i in range(11)]:
        flute = create_cylinder(f"rd_fl_{fx:.2f}", (fx, -0.475, 0.545), 0.014, 0.70, mat_gold())
        rd_parts.append(flute)
    r_desk = join_as_named_object(rd_parts, "Reception_Desk")
    place_on_surface(r_desk, -3.10, 4.35, 0.0)

    # 3. Bellhop_Bell (Lathe-turned polished gold service bell on Reception_Desk Z = 1.05m)
    bb_base = create_lathe_profile([
        (0.068, 0.000, 'sharp'), (0.066, 0.012), (0.054, 0.020, 'sharp')
    ], segments=32, name="bb_bs", material=mat_black_marble())
    bb_dome = create_lathe_profile([
        (0.056, 0.018, 'sharp'), (0.055, 0.036), (0.046, 0.062),
        (0.026, 0.080), (0.008, 0.086, 'sharp')
    ], segments=32, name="bb_dm", material=mat_gold())
    bb_pin = create_cylinder("bb_pn", (0, 0, 0.094), 0.005, 0.018, mat_chrome())
    bb_btn = create_cylinder("bb_bt", (0, 0, 0.105), 0.015, 0.007, mat_gold())
    bell = join_as_named_object([bb_base, bb_dome, bb_pin, bb_btn], "Bellhop_Bell")
    place_on_surface(bell, -3.95, 4.18, 1.05)

    # 4. Room_Keycard (Presentation holder + gold RFID keycard with EMV chip on Z = 1.05m)
    kc_folder = create_box("kc_fl", (0, 0, 0.004), (0.135, 0.095, 0.008), mat_burgundy_rug(), bevel=0.002)
    kc_card = create_box("kc_cd", (0.018, -0.010, 0.010), (0.110, 0.070, 0.004), mat_gold(),
                         rotation=(0, 0, math.radians(-14)), bevel=0.002)
    kc_chip = create_box("kc_ch", (-0.012, -0.014, 0.013), (0.018, 0.015, 0.002), mat_chrome(),
                         rotation=(0, 0, math.radians(-14)), bevel=0.001)
    kc_stripe = create_box("kc_st", (0.018, 0.008, 0.013), (0.104, 0.012, 0.0015), mat_dark_steel(),
                           rotation=(0, 0, math.radians(-14)), bevel=0.0005)
    keycard = join_as_named_object([kc_folder, kc_card, kc_chip, kc_stripe], "Room_Keycard")
    place_on_surface(keycard, -3.10, 4.15, 1.05)

    # 5. Passport (Navy leather passport with cream paper block, gold crest & boarding pass on Z = 1.05m)
    pp_bot = create_box("pp_bt", (0, 0, 0.003), (0.125, 0.175, 0.005), mat_navy_fabric(), bevel=0.002)
    pp_pages = create_box("pp_pg", (0.002, 0, 0.012), (0.118, 0.168, 0.014), mat_linen_white(), bevel=0.002)
    pp_top = create_box("pp_tp", (0, 0, 0.021), (0.125, 0.175, 0.005), mat_navy_fabric(), bevel=0.002)
    pp_crest = create_cylinder("pp_cr", (0, 0.015, 0.0245), 0.024, 0.002, mat_gold())
    pp_pass = create_box("pp_bp", (0.028, 0.055, 0.013), (0.085, 0.11, 0.002), mat_porcelain(),
                         rotation=(0, 0, math.radians(-18)), bevel=0.001)
    passport = join_as_named_object([pp_bot, pp_pages, pp_top, pp_crest, pp_pass], "Passport")
    place_on_surface(passport, -2.22, 4.18, 1.05)

    # 6. Elevator (Art-Deco Architectural Bronze Bi-Parting Elevator on West Wall X=-6.58, Y=1.05, Z=0.0)
    ev_surround = create_recessed_box(
        "ev_sr", (0, 0, 1.32), (0.34, 1.88, 2.64),
        cavity_face='+X', margin=(0.16, 0.14), cavity_depth=0.12,
        outer_mat=mat_black_marble(), inner_mat=mat_dark_steel(), bevel=0.012
    )
    ev_arch = create_box("ev_ar", (0.16, 0, 2.52), (0.06, 1.62, 0.20), mat_gold(), bevel=0.008)
    ev_disp_bg = create_box("ev_dbg", (0.195, 0, 2.52), (0.02, 0.42, 0.12), mat_dark_steel(), bevel=0.004)
    ev_disp = create_box("ev_dp", (0.206, 0, 2.52), (0.006, 0.36, 0.085),
                         mat_screen((0.92, 0.68, 0.24, 1.0), 1.6, "Elevator_Floor_LED"), bevel=0.002)
    ev_door_l = create_box("ev_dl", (0.09, -0.37, 1.18), (0.04, 0.72, 2.34), mat_bronze(), bevel=0.008)
    ev_door_r = create_box("ev_dr", (0.09, 0.37, 1.18), (0.04, 0.72, 2.34), mat_bronze(), bevel=0.008)
    ev_trim_l = create_box("ev_tl", (0.115, -0.37, 1.18), (0.01, 0.52, 1.92), mat_gold(), bevel=0.003)
    ev_trim_r = create_box("ev_tr", (0.115, 0.37, 1.18), (0.01, 0.52, 1.92), mat_gold(), bevel=0.003)
    ev_call_pl = create_box("ev_cp", (0.175, -0.84, 1.12), (0.02, 0.09, 0.18), mat_gold(), bevel=0.004)
    ev_btn_u = create_cylinder("ev_bu", (0.188, -0.84, 1.15), 0.014, 0.008,
                               mat_screen((0.95, 0.78, 0.32, 1.0), 1.4, "Elev_Btn"), rotation=(0, math.radians(90), 0))
    ev_btn_d = create_cylinder("ev_bd", (0.188, -0.84, 1.09), 0.014, 0.008, mat_chrome(), rotation=(0, math.radians(90), 0))
    elevator = join_as_named_object([ev_surround, ev_arch, ev_disp_bg, ev_disp, ev_door_l, ev_door_r,
                                     ev_trim_l, ev_trim_r, ev_call_pl, ev_btn_u, ev_btn_d], "Elevator")
    place_on_surface(elevator, -6.68, 1.05, 0.0)

    # 7. Luggage_Cart (Golden Curved Tubular Birdcage Bellhop Trolley, deck top strictly at Z = 0.22m!)
    lc_parts = []
    # Bumper base (Z: 0.13..0.19) + Bordeaux carpet deck (Z: 0.19..0.22 -> exact top_z = 0.22m!)
    lc_bumper = create_box("lc_bm", (0, 0, 0.16), (1.18, 0.72, 0.06), mat_dark_steel(), bevel=0.018)
    lc_brass_rim = create_box("lc_br", (0, 0, 0.175), (1.14, 0.68, 0.04), mat_gold(), bevel=0.010)
    lc_carpet = create_box("lc_cp", (0, 0, 0.205), (1.08, 0.62, 0.03), mat_burgundy_rug(), bevel=0.006)
    lc_parts.extend([lc_bumper, lc_brass_rim, lc_carpet])
    # 4 Heavy-duty caster wheels (touching Z = 0.0)
    for wx in (-0.44, 0.44):
        for wy in (-0.24, 0.24):
            fork = create_box(f"lc_fk_{wx}_{wy}", (wx, wy, 0.105), (0.04, 0.05, 0.06), mat_gold(), bevel=0.004)
            whl = create_cylinder(f"lc_wh_{wx}_{wy}", (wx, wy, 0.055), 0.055, 0.030, mat_dark_steel(),
                                  rotation=(math.radians(90), 0, 0))
            hub = create_cylinder(f"lc_hb_{wx}_{wy}", (wx, wy, 0.055), 0.024, 0.034, mat_gold(),
                                  rotation=(math.radians(90), 0, 0))
            lc_parts.extend([fork, whl, hub])
    # Sweeping Golden Birdcage Arches + Crossbar + Lathe Crown Finial
    arch_front = create_curved_tube(
        "lc_af",
        [(-0.50, -0.27, 0.21), (-0.50, -0.27, 1.28), (-0.34, -0.18, 1.66),
         (0.0, 0.0, 1.78), (0.34, -0.18, 1.66), (0.50, -0.27, 1.28), (0.50, -0.27, 0.21)],
        radius=0.019, material=mat_gold()
    )
    arch_back = create_curved_tube(
        "lc_ab",
        [(-0.50, 0.27, 0.21), (-0.50, 0.27, 1.28), (-0.34, 0.18, 1.66),
         (0.0, 0.0, 1.78), (0.34, 0.18, 1.66), (0.50, 0.27, 1.28), (0.50, 0.27, 0.21)],
        radius=0.019, material=mat_gold()
    )
    garment_bar = create_cylinder("lc_gb", (0, 0, 1.56), 0.014, 0.80, mat_gold(), rotation=(0, math.radians(90), 0))
    finial = create_lathe_profile([
        (0.045, 1.76, 'sharp'), (0.052, 1.79), (0.025, 1.83), (0.042, 1.87), (0.016, 1.92), (0.000, 1.95)
    ], segments=24, name="lc_fn", material=mat_gold())
    lc_parts.extend([arch_front, arch_back, garment_bar, finial])
    l_cart = join_as_named_object(lc_parts, "Luggage_Cart")
    place_on_surface(l_cart, -3.35, -2.15, 0.0)

    # 8. Suitcase (Ribbed Luxury Hardshell Suitcase resting strictly on Luggage_Cart deck Z = 0.22m!)
    mat_case = get_material("Champagne_Polycarbonate_Case", (0.20, 0.26, 0.34, 1.0), metallic=0.35, roughness=0.28)
    su_parts = []
    su_shell = create_box("su_sh", (0, 0, 0.31), (0.46, 0.27, 0.54), mat_case, bevel=0.026)
    su_zip = create_box("su_zp", (0, 0, 0.31), (0.468, 0.018, 0.546), mat_gold(), bevel=0.004)
    su_parts.extend([su_shell, su_zip])
    # Horizontal structural ribs across front & back
    for rz in (0.16, 0.26, 0.36, 0.46):
        rib = create_box(f"su_rb_{rz}", (0, 0, rz), (0.40, 0.278, 0.016), mat_case, bevel=0.005)
        su_parts.append(rib)
    # Cognac leather corner protectors & straps
    for sx in (-0.14, 0.14):
        strap = create_box(f"su_st_{sx}", (sx, 0, 0.31), (0.032, 0.282, 0.548), mat_cognac_leather(), bevel=0.004)
        su_parts.append(strap)
    # 4 Spinner wheels at bottom + telescopic pull handle
    for wx in (-0.17, 0.17):
        for wy in (-0.09, 0.09):
            sw = create_cylinder(f"su_wh_{wx}_{wy}", (wx, wy, 0.022), 0.022, 0.020, mat_dark_steel(),
                                 rotation=(math.radians(90), 0, 0))
            su_parts.append(sw)
    su_t1 = create_cylinder("su_t1", (-0.09, 0.08, 0.68), 0.008, 0.24, mat_chrome())
    su_t2 = create_cylinder("su_t2", (0.09, 0.08, 0.68), 0.008, 0.24, mat_chrome())
    su_grip = create_box("su_gp", (0, 0.08, 0.80), (0.21, 0.026, 0.024), mat_cognac_leather(), bevel=0.006)
    su_parts.extend([su_t1, su_t2, su_grip])
    suitcase = join_as_named_object(su_parts, "Suitcase")
    place_on_surface(suitcase, -3.35, -2.15, 0.22)

    # 9. King_Bed (Presidential Suite King Bed at X=3.0, Y=1.25, Z=0.0 - 100% CLUTTER-FREE ON TOP!)
    kb_parts = []
    kb_plinth = create_box("kb_pl", (0, 0, 0.06), (2.28, 2.26, 0.12), mat_dark_walnut(), bevel=0.008)
    kb_frame = create_box("kb_fr", (0, 0, 0.20), (2.42, 2.38, 0.18), mat_warm_wood(), bevel=0.015)
    kb_trim = create_box("kb_tr", (0, 0, 0.13), (2.44, 2.40, 0.025), mat_gold(), bevel=0.004)
    # Grand vertical-channel tufted velvet/boucle headboard
    kb_hb_back = create_box("kb_hbb", (0, 1.16, 0.78), (2.86, 0.10, 1.38), mat_dark_walnut(), bevel=0.014)
    kb_parts.extend([kb_plinth, kb_frame, kb_trim, kb_hb_back])
    for ci in range(7):
        cx_p = -1.14 + ci * 0.38
        chan = create_soft_cushion((0.36, 0.11, 1.16), bevel_width=0.025, subdiv=2,
                                   name=f"kb_hc_{ci}", location=(cx_p, 1.09, 0.80),
                                   material=mat_woven_beige(), puff=0.14)
        kb_parts.append(chan)
    # Plush organic mattress, tailored ivory duvet, Bordeaux silk foot runner & 4 plump pillows (ZERO foreign items!)
    kb_matt = create_soft_cushion((2.26, 2.22, 0.28), bevel_width=0.045, subdiv=2, name="kb_mt",
                                  location=(0, -0.02, 0.42), material=mat_linen_white(), puff=0.10)
    kb_duvet = create_soft_cushion((2.30, 1.56, 0.16), bevel_width=0.045, subdiv=2, name="kb_dv",
                                   location=(0, -0.32, 0.55), material=mat_porcelain(), puff=0.14)
    kb_runner = create_soft_cushion((2.32, 0.52, 0.08), bevel_width=0.025, subdiv=2, name="kb_rn",
                                    location=(0, -0.76, 0.62), material=mat_burgundy_rug(), puff=0.10)
    kb_parts.extend([kb_matt, kb_duvet, kb_runner])
    for px_i, px_o in enumerate((-0.58, 0.58)):
        p_back = create_soft_cushion((0.82, 0.36, 0.18), bevel_width=0.035, subdiv=2,
                                     name=f"kb_pb_{px_i}", location=(px_o, 0.82, 0.66),
                                     rotation=(math.radians(16), 0, 0), material=mat_linen_white(), puff=0.18)
        p_front = create_soft_cushion((0.68, 0.32, 0.15), bevel_width=0.030, subdiv=2,
                                      name=f"kb_pf_{px_i}", location=(px_o, 0.58, 0.63),
                                      rotation=(math.radians(10), 0, 0), material=mat_woven_beige(), puff=0.18)
        kb_parts.extend([p_back, p_front])
    king_bed = join_as_named_object(kb_parts, "King_Bed")
    place_on_surface(king_bed, 3.00, 1.25, 0.0)

    # 10. Safe_Box (Digital Electronic Hotel Safe resting on suite credenza at Z = 0.52m)
    sf_parts = create_appliance_chassis(
        "Safe_Box", (0.56, 0.44, 0.42),
        body_mat=mat_dark_steel(), inner_mat=mat_steel(),
        cavity_face='-Y', cavity_margin=0.035, cavity_depth=0.04,
        doors=[{
            'center': (0, -0.212, 0.215), 'size': (0.48, 0.032, 0.34),
            'mat': get_material("Safe_Gunmetal_Door", (0.23, 0.25, 0.29, 1.0), metallic=0.78, roughness=0.28),
            'bevel': 0.008
        }],
        screens=[{
            'center': (0.11, -0.232, 0.295), 'size': (0.13, 0.006, 0.042),
            'color': (0.20, 0.82, 0.58, 1.0), 'strength': 1.6
        }],
        knobs=[{
            'center': (-0.12, -0.236, 0.215), 'radius': 0.034, 'depth': 0.022, 'mat': mat_gold()
        }],
        feet_height=0.012
    )
    # 3-Spoke Vault Spin Handle & Numeric Keypad Matrix + External Hinges
    for sa in (0, 120, 240):
        rad = math.radians(sa)
        spoke = create_cylinder(f"sf_sp_{sa}", (-0.12 + 0.035 * math.cos(rad), -0.248, 0.215 + 0.035 * math.sin(rad)),
                                0.006, 0.055, mat_chrome(), rotation=(0, math.radians(90 - sa), 0))
        sf_parts.append(spoke)
    for kr in range(4):
        for kc_i in range(3):
            kp = create_box(f"sf_kp_{kr}_{kc_i}", (0.072 + kc_i * 0.036, -0.232, 0.145 + kr * 0.028),
                            (0.026, 0.006, 0.018), mat_chrome(), bevel=0.002)
            sf_parts.append(kp)
    for hz in (0.11, 0.31):
        hinge = create_cylinder(f"sf_hg_{hz}", (0.245, -0.222, hz), 0.012, 0.055, mat_steel())
        sf_parts.append(hinge)
    safe = join_as_named_object(sf_parts, "Safe_Box")
    place_on_surface(safe, 5.35, -3.65, 0.52)

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "hotel.glb"))
    print("WORLD 4 (HOTEL) EXPORTED SUCCESSFULLY!\n")


# ==============================================================================
# WORLD 5: DATING.GLB
# Nocturnal Stone Terrace with Wrought-Iron Balustrade & Post Lanterns + Romantic Bistro Table (Z=0.78m)
# ==============================================================================
def build_dating():
    reset_scene()
    print("Building World 5: Romantic Nocturnal Terrace (Wrought-Iron Railing, Violin & Lathe Crystal)...")
    add_bounds_anchor(radius_x=8.0, radius_y=7.0)

    # 1. Nocturnal Stone Terrace Diorama with Wrought-Iron Balustrade & Warm Post Lanterns
    mat_slate_tile = get_material("Terrace_Evening_Slate", (0.24, 0.25, 0.29, 1.0), roughness=0.42, coat_weight=0.18)
    mat_iron = get_material("Wrought_Iron_Black", (0.11, 0.12, 0.14, 1.0), metallic=0.75, roughness=0.36)
    mat_parapet_stone = get_material("Limestone_Parapet", (0.64, 0.61, 0.56, 1.0), roughness=0.62)

    dio_parts = []
    # Grouted dark slate terrace pavers (top strictly at Z = 0.0)
    sub_pl = create_box("dt_sub", (0, 0, -0.08), (16.0, 14.0, 0.14), mat_dark_steel(), bevel=0.006)
    grout = create_box("dt_grt", (0, 0, -0.012), (16.0, 14.0, 0.010),
                       get_material("Slate_Mortar", (0.16, 0.17, 0.19, 1.0), roughness=0.75), bevel=0.0)
    dio_parts.extend([sub_pl, grout])
    nx, ny = 10, 8
    tw, th = 16.0 / nx, 14.0 / ny
    for ix in range(nx):
        for iy in range(ny):
            tx = -8.0 + (ix + 0.5) * tw
            ty = -7.0 + (iy + 0.5) * th
            dio_parts.append(create_box(f"dt_pv_{ix}_{iy}", (tx, ty, -0.005),
                                        (tw - 0.014, th - 0.014, 0.010), mat_slate_tile, bevel=0.003, segments=2))

    # Circular Bordeaux Burgundy Rug under Bistro Table
    dio_parts.append(create_cylinder("dt_rug_b", (0.0, -0.4, 0.005), 2.55, 0.010, mat_gold(), vertices=48, bevel=0.003))
    dio_parts.append(create_cylinder("dt_rug", (0.0, -0.4, 0.009), 2.48, 0.012, mat_burgundy_rug(), vertices=48, bevel=0.004))

    # Low Stone Parapet Curb + Wrought-Iron Balustrade Railing along North (Y=5.8) and West (X=-6.8)
    ny_r, wx_r = 5.8, -6.8
    dio_parts.append(create_box("dt_curb_n", (0.6, ny_r, 0.14), (14.8, 0.34, 0.28), mat_parapet_stone, bevel=0.012))
    dio_parts.append(create_box("dt_curb_w", (wx_r, -0.6, 0.14), (0.34, 12.8, 0.28), mat_parapet_stone, bevel=0.012))
    # Top & bottom wrought-iron rails
    dio_parts.append(create_box("dt_rl_nt", (0.6, ny_r, 1.08), (14.6, 0.06, 0.045), mat_iron, bevel=0.008))
    dio_parts.append(create_box("dt_rl_nb", (0.6, ny_r, 0.34), (14.6, 0.05, 0.035), mat_iron, bevel=0.005))
    dio_parts.append(create_box("dt_rl_wt", (wx_r, -0.6, 1.08), (0.06, 12.6, 0.045), mat_iron, bevel=0.008))
    dio_parts.append(create_box("dt_rl_wb", (wx_r, -0.6, 0.34), (0.05, 12.6, 0.035), mat_iron, bevel=0.005))

    # Wrought-iron vertical balusters & ornamental scroll rings
    for bx in [(-6.4 + i * 0.45) for i in range(32)]:
        dio_parts.append(create_cylinder(f"dt_bn_{bx:.2f}", (bx, ny_r, 0.71), 0.012, 0.72, mat_iron, vertices=12))
        if int(round((bx + 6.4) / 0.45)) % 3 == 0:
            dio_parts.append(create_torus(f"dt_sn_{bx:.2f}", (bx + 0.22, ny_r, 0.71), 0.11, 0.010, mat_gold(),
                                          major_segments=20, minor_segments=8, rotation=(math.radians(90), 0, 0)))
    for by in [(-6.6 + i * 0.45) for i in range(28)]:
        dio_parts.append(create_cylinder(f"dt_bw_{by:.2f}", (wx_r, by, 0.71), 0.012, 0.72, mat_iron, vertices=12))
        if int(round((by + 6.6) / 0.45)) % 3 == 0:
            dio_parts.append(create_torus(f"dt_sw_{by:.2f}", (wx_r, by + 0.22, 0.71), 0.11, 0.010, mat_gold(),
                                          major_segments=20, minor_segments=8, rotation=(0, math.radians(90), 0)))

    # Stone Pillars + 6 Warm Terrace Post Lanterns along Perimeter
    mat_lantern_glow = mat_screen((0.98, 0.78, 0.44, 1.0), 1.9, "Terrace_Lantern_Bulb")
    pillar_coords = [(-6.8, 5.8), (-2.2, 5.8), (2.4, 5.8), (7.2, 5.8), (-6.8, 1.2), (-6.8, -3.6)]
    for pi, (px, py) in enumerate(pillar_coords):
        pier = create_box(f"dt_pr_{pi}", (px, py, 0.58), (0.48, 0.48, 1.16), mat_parapet_stone, bevel=0.015)
        cap = create_box(f"dt_pc_{pi}", (px, py, 1.19), (0.56, 0.56, 0.07), mat_parapet_stone, bevel=0.010)
        pole = create_cylinder(f"dt_lp_{pi}", (px, py, 1.52), 0.026, 0.62, mat_iron)
        l_base = create_cone(f"dt_lb_{pi}", (px, py, 1.85), 0.05, 0.11, 0.06, mat_iron)
        l_glass = create_cone(f"dt_lg_{pi}", (px, py, 2.00), 0.095, 0.125, 0.24,
                              mat_tinted_glass("Lantern_Amber_Glass", (0.98, 0.85, 0.58), 0.42), vertices=6)
        l_bulb = create_sphere(f"dt_bl_{pi}", (px, py, 1.99), 0.052, mat_lantern_glow, segments=16, rings=12)
        l_roof = create_cone(f"dt_lr_{pi}", (px, py, 2.18), 0.16, 0.015, 0.14, mat_iron, vertices=6)
        dio_parts.extend([pier, cap, pole, l_base, l_glass, l_bulb, l_roof])

    join_as_named_object(dio_parts, "Dating_Diorama")

    # 2. Bistro_Table (Central Romantic Table at X=0.0, Y=-0.4, tabletop strictly at Z = 0.78m + 2 Wrought-Iron Chairs)
    bt_parts = []
    bt_ped = create_lathe_profile([
        (0.36, 0.000, 'sharp'), (0.34, 0.030), (0.14, 0.085),
        (0.062, 0.22), (0.088, 0.42), (0.056, 0.68), (0.28, 0.745, 'sharp')
    ], segments=32, name="bt_ped", material=mat_iron, location=(0.0, -0.4, 0.0))
    bt_rim = create_cylinder("bt_rm", (0.0, -0.4, 0.758), 0.84, 0.036, mat_gold(), vertices=48, bevel=0.006)
    bt_top = create_cylinder("bt_tp", (0.0, -0.4, 0.762), 0.815, 0.036, mat_white_quartz(), vertices=48, bevel=0.006)
    bt_parts.extend([bt_ped, bt_rim, bt_top])

    # 2 Romantic Wrought-Iron & Velvet Bistro Chairs (West X=-1.12, East X=+1.12)
    for side, dx in (("w", -1.12), ("e", 1.12)):
        cx_c = dx
        cy_c = -0.4
        seat = create_soft_cushion((0.46, 0.46, 0.075), bevel_width=0.022, subdiv=2,
                                   name=f"bt_cs_{side}", location=(cx_c, cy_c, 0.46),
                                   material=mat_velvet_red(), puff=0.15)
        back_arch = create_curved_tube(
            f"bt_ba_{side}",
            [(cx_c + (-0.21 if dx < 0 else 0.21), cy_c - 0.20, 0.46),
             (cx_c + (-0.24 if dx < 0 else 0.24), cy_c - 0.18, 0.86),
             (cx_c + (-0.25 if dx < 0 else 0.25), cy_c, 0.96),
             (cx_c + (-0.24 if dx < 0 else 0.24), cy_c + 0.18, 0.86),
             (cx_c + (-0.21 if dx < 0 else 0.21), cy_c + 0.20, 0.46)],
            radius=0.012, material=mat_iron
        )
        scroll = create_torus(f"bt_sc_{side}", (cx_c + (-0.23 if dx < 0 else 0.23), cy_c, 0.72),
                              0.11, 0.009, mat_gold(), rotation=(0, math.radians(90), 0))
        bt_parts.extend([seat, back_arch, scroll])
        for lx_o in (-0.18, 0.18):
            for ly_o in (-0.18, 0.18):
                bt_parts.append(create_cone(f"bt_lg_{side}_{lx_o}_{ly_o}",
                                            (cx_c + lx_o, cy_c + ly_o, 0.22), 0.011, 0.018, 0.44, mat_iron))
    join_as_named_object(bt_parts, "Bistro_Table")

    # --- ROMANTIC TABLETOP ITEMS STRICTLY AT Z = 0.78m ---
    # 3. Candle (Lathe-turned antique brass candelabra holder + ivory taper candle + warm flame)
    cd_holder = create_lathe_profile([
        (0.058, 0.000, 'sharp'), (0.056, 0.010), (0.022, 0.024),
        (0.014, 0.065), (0.028, 0.095), (0.014, 0.125),
        (0.042, 0.140, 'sharp'), (0.024, 0.145), (0.022, 0.168, 'sharp')
    ], segments=32, name="cd_hl", material=mat_gold())
    cd_wax = create_lathe_profile([
        (0.016, 0.162, 'sharp'), (0.015, 0.285), (0.011, 0.296), (0.000, 0.292)
    ], segments=24, name="cd_wx", material=mat_linen_white())
    cd_wick = create_cylinder("cd_wk", (0, 0, 0.300), 0.0018, 0.014, mat_dark_steel())
    cd_flame = create_lathe_profile([
        (0.000, 0.304), (0.008, 0.314), (0.006, 0.328), (0.000, 0.342)
    ], segments=20, name="cd_fl",
        material=mat_screen((0.98, 0.74, 0.24, 1.0), 2.1, "Candle_Flame_Warm"), cap_ends=False)
    candle = join_as_named_object([cd_holder, cd_wax, cd_wick, cd_flame], "Candle")
    place_on_surface(candle, -0.24, -0.22, 0.78)

    # 4. Chocolate_Fondant (Lathe porcelain dessert plate + molten chocolate lava cake + gelato + berry)
    cf_plate = build_gourmet_plate("cf_pl", radius=0.13)
    cf_cake = create_lathe_profile([
        (0.046, 0.007, 'sharp'), (0.048, 0.026), (0.042, 0.052), (0.022, 0.056), (0.000, 0.050)
    ], segments=28, name="cf_ck",
        material=get_material("Dark_Cocoa_Cake", (0.16, 0.07, 0.04, 1.0), roughness=0.62))
    cf_lava = create_lathe_profile([
        (0.054, 0.008, 'sharp'), (0.049, 0.028), (0.044, 0.053), (0.000, 0.054)
    ], segments=24, name="cf_lv",
        material=get_material("Molten_Ganache", (0.11, 0.04, 0.02, 1.0), roughness=0.14, coat_weight=0.55),
        scale=(1.08, 0.92, 1.0))
    cf_gelato = create_sphere("cf_gl", (0.0, 0.0, 0.068), 0.023,
                              get_material("Vanilla_Bean_Gelato", (0.97, 0.94, 0.84, 1.0), roughness=0.45),
                              scale=(1.0, 1.0, 0.85))
    cf_berry = create_sphere("cf_br", (0.012, -0.008, 0.088), 0.010, mat_velvet_red())
    fondant = join_as_named_object([cf_plate, cf_cake, cf_lava, cf_gelato, cf_berry], "Chocolate_Fondant")
    place_on_surface(fondant, -0.32, -0.62, 0.78)

    # 5. Ring_Box (Open crimson velvet proposal box with 18k gold solitaire diamond ring on Z = 0.78m)
    rb_base = create_recessed_box(
        "rb_bs", (0, 0, 0.018), (0.068, 0.068, 0.036),
        cavity_face='+Z', margin=(0.007, 0.007), cavity_depth=0.016,
        outer_mat=mat_velvet_red(), inner_mat=mat_linen_white(), bevel=0.006
    )
    rb_cushion = create_soft_cushion((0.052, 0.052, 0.014), bevel_width=0.004, subdiv=2, name="rb_cs",
                                     location=(0, 0, 0.024), material=mat_linen_white(), puff=0.12)
    rb_lid = create_recessed_box(
        "rb_ld", (0, 0.044, 0.056), (0.068, 0.066, 0.026),
        cavity_face='-Z', margin=(0.007, 0.007), cavity_depth=0.012,
        outer_mat=mat_velvet_red(), inner_mat=mat_linen_white(), bevel=0.006
    )
    rb_lid.rotation_euler = (math.radians(-74), 0, 0)
    rb_band = create_torus("rb_rg", (0, -0.002, 0.038), 0.013, 0.0024, mat_gold(),
                           rotation=(math.radians(82), 0, 0))
    rb_diamond = create_lathe_profile([
        (0.000, 0.047, 'sharp'), (0.0075, 0.054, 'sharp'), (0.0052, 0.058, 'sharp'), (0.000, 0.058, 'sharp')
    ], segments=10, name="rb_dm",
        material=get_material("Brilliant_Diamond", (0.94, 0.97, 1.0, 0.75), roughness=0.02,
                              transmission=0.92, ior=2.42, alpha=0.75),
        location=(0, -0.002, 0), smooth_steps=0, cap_ends=False)
    ring_box = join_as_named_object([rb_base, rb_cushion, rb_lid, rb_band, rb_diamond], "Ring_Box")
    place_on_surface(ring_box, 0.24, -0.64, 0.78)

    # 6. Wine_List (Sommelier Cognac Leather & Gold Folio on Tabletop Brass Easel, Z = 0.78m)
    wl_stand = create_curved_tube(
        "wl_st", [(-0.07, 0.06, 0.005), (-0.07, -0.05, 0.005), (0.0, 0.04, 0.16),
                  (0.07, -0.05, 0.005), (0.07, 0.06, 0.005)],
        radius=0.004, material=mat_gold()
    )
    wl_cover = create_box("wl_cv", (0, -0.008, 0.115), (0.17, 0.012, 0.23), mat_cognac_leather(),
                          rotation=(math.radians(22), 0, math.radians(-16)), bevel=0.004)
    wl_page = create_box("wl_pg", (0, -0.015, 0.116), (0.148, 0.004, 0.205), mat_linen_white(),
                         rotation=(math.radians(22), 0, math.radians(-16)), bevel=0.001)
    wl_medallion = create_cylinder("wl_md", (-0.004, -0.022, 0.142), 0.022, 0.003, mat_gold(),
                                   rotation=(math.radians(112), 0, math.radians(-16)))
    wine_list = join_as_named_object([wl_stand, wl_cover, wl_page, wl_medallion], "Wine_List")
    place_on_surface(wine_list, 0.48, -0.28, 0.78)

    # 7. Wine_Glasses (Pair of Lathe-Turned Crystal Glasses for Two on Z = 0.78m)
    mat_rose_champ = get_material("Sparkling_Rose_Champagne", (0.86, 0.62, 0.38, 0.82),
                                  roughness=0.08, transmission=0.65, alpha=0.82)
    wg_pair = []
    wg_pair.extend(build_crystal_wine_glass("dt_wg1", offset=(-0.065, -0.02, 0.0), with_wine=True, wine_mat=mat_rose_champ))
    wg_pair.extend(build_crystal_wine_glass("dt_wg2", offset=(0.065, 0.025, 0.0), with_wine=True, wine_mat=mat_rose_champ))
    w_glasses = join_as_named_object(wg_pair, "Wine_Glasses")
    place_on_surface(w_glasses, -0.02, -0.46, 0.78)

    # 8. Bouquet_of_Roses (Lathe Fluted Crystal Vase + Stems + 9 Layered Soft-Cushion Roses on Z = 0.78m)
    bq_parts = []
    bq_vase = create_lathe_profile([
        (0.052, 0.000, 'sharp'), (0.044, 0.022), (0.066, 0.095),
        (0.042, 0.165), (0.058, 0.215, 'sharp'), (0.053, 0.215, 'sharp'),
        (0.038, 0.165), (0.060, 0.095), (0.000, 0.015, 'sharp')
    ], segments=32, name="bq_vs", material=mat_porcelain(), cap_ends=False)
    bq_gold_band = create_torus("bq_gb", (0, 0, 0.165), 0.043, 0.004, mat_gold())
    bq_parts.extend([bq_vase, bq_gold_band])

    mat_stem = get_material("Rose_Stem_Green", (0.14, 0.38, 0.16, 1.0), roughness=0.55)
    mat_rose_crimson = get_material("Velvet_Crimson_Rose", (0.58, 0.06, 0.12, 1.0), roughness=0.62, sheen_weight=0.45)
    mat_rose_blush = get_material("Warm_Ivory_Rose", (0.93, 0.84, 0.78, 1.0), roughness=0.60, sheen_weight=0.40)

    rose_heads = [
        (0.00, 0.00, 0.31, 0.0, 0.0, mat_rose_crimson),
        (-0.055, -0.035, 0.275, 18, -22, mat_rose_crimson),
        (0.055, -0.035, 0.275, 18, 22, mat_rose_blush),
        (-0.065, 0.038, 0.280, -16, -24, mat_rose_blush),
        (0.065, 0.038, 0.280, -16, 24, mat_rose_crimson),
        (0.00, -0.068, 0.258, 26, 0, mat_rose_crimson),
        (0.00, 0.068, 0.265, -24, 0, mat_rose_crimson),
        (-0.035, 0.00, 0.295, 6, -14, mat_rose_crimson),
        (0.035, 0.00, 0.295, 6, 14, mat_rose_blush),
    ]
    for ri, (rx, ry, rz, rx_deg, ry_deg, r_mat) in enumerate(rose_heads):
        stem = create_curved_tube(
            f"bq_st_{ri}", [(0, 0, 0.08), (rx * 0.45, ry * 0.45, 0.19), (rx, ry, rz - 0.015)],
            radius=0.004, material=mat_stem
        )
        calyx = create_cone(f"bq_cx_{ri}", (rx, ry, rz - 0.012), 0.016, 0.004, 0.018, mat_stem,
                            rotation=(math.radians(rx_deg + 180), math.radians(ry_deg), 0))
        # Outer & inner sculpted petal whorls via create_soft_cushion
        w_outer = create_soft_cushion(
            (0.046, 0.044, 0.034), bevel_width=0.010, subdiv=2, name=f"bq_ro_{ri}",
            location=(rx, ry, rz + 0.006),
            rotation=(math.radians(rx_deg), math.radians(ry_deg), math.radians(ri * 37)),
            material=r_mat, puff=0.18
        )
        w_inner = create_soft_cushion(
            (0.030, 0.028, 0.032), bevel_width=0.008, subdiv=2, name=f"bq_ri_{ri}",
            location=(rx, ry, rz + 0.014),
            rotation=(math.radians(rx_deg), math.radians(ry_deg), math.radians(ri * 37 + 45)),
            material=r_mat, puff=0.20
        )
        bq_parts.extend([stem, calyx, w_outer, w_inner])
    # Foliage leaves around vase rim
    for li in range(6):
        la = (2.0 * math.pi * li) / 6.0
        leaf = create_soft_cushion(
            (0.048, 0.024, 0.006), bevel_width=0.002, subdiv=1, name=f"bq_lf_{li}",
            location=(0.068 * math.cos(la), 0.068 * math.sin(la), 0.232),
            rotation=(math.radians(24 * math.sin(la)), math.radians(-24 * math.cos(la)), la),
            material=mat_stem, puff=0.10
        )
        bq_parts.append(leaf)
    bouquet = join_as_named_object(bq_parts, "Bouquet_of_Roses")
    place_on_surface(bouquet, 0.16, -0.08, 0.78)

    # 9. Champagne_Bottle (Tripod Silver Ice-Bucket Stand + Lathe Emerald Champagne Bottle at X=-1.45, Y=0.35, Z=0.0)
    ch_parts = []
    # Tripod stand legs + ring
    ch_ring = create_torus("ch_rg", (0, 0, 0.62), 0.135, 0.010, mat_chrome())
    ch_parts.append(ch_ring)
    for li in range(3):
        ang = (2.0 * math.pi * li) / 3.0 + 0.4
        leg = create_curved_tube(
            f"ch_lg_{li}",
            [(0.13 * math.cos(ang), 0.13 * math.sin(ang), 0.62),
             (0.08 * math.cos(ang), 0.08 * math.sin(ang), 0.34),
             (0.22 * math.cos(ang), 0.22 * math.sin(ang), 0.01)],
            radius=0.011, material=mat_chrome()
        )
        ch_parts.append(leg)
    # Lathe-turned silver champagne bucket + side ring handles + ice bed
    bucket = create_lathe_profile([
        (0.092, 0.48, 'sharp'), (0.105, 0.56), (0.138, 0.71),
        (0.152, 0.74, 'sharp'), (0.145, 0.74, 'sharp'),
        (0.132, 0.71), (0.098, 0.56), (0.000, 0.495, 'sharp')
    ], segments=32, name="ch_bk", material=mat_chrome(), cap_ends=False)
    hnd_l = create_torus("ch_hl", (-0.152, 0, 0.68), 0.026, 0.005, mat_gold(), rotation=(math.radians(90), 0, 0))
    hnd_r = create_torus("ch_hr", (0.152, 0, 0.68), 0.026, 0.005, mat_gold(), rotation=(math.radians(90), 0, 0))
    ice_bed = create_cylinder("ch_ic", (0, 0, 0.69), 0.126, 0.04, mat_glass())
    ch_parts.extend([bucket, hnd_l, hnd_r, ice_bed])
    # Lathe-turned Emerald Green Champagne Bottle angled inside ice bucket
    mat_champ_green = get_material("Vintage_Champagne_Glass", (0.06, 0.24, 0.11, 0.92),
                                   roughness=0.10, coat_weight=0.50, alpha=0.92)
    btl_rot = (math.radians(14), math.radians(10), 0)
    champ_btl = create_lathe_profile([
        (0.048, 0.000, 'sharp'), (0.050, 0.135), (0.044, 0.195),
        (0.022, 0.265), (0.017, 0.335), (0.021, 0.348, 'sharp')
    ], segments=32, name="ch_btl", material=mat_champ_green, location=(0, 0, 0.60), rotation=btl_rot)
    champ_foil = create_lathe_profile([
        (0.024, 0.255, 'sharp'), (0.0185, 0.335), (0.0225, 0.352), (0.019, 0.365), (0.000, 0.368)
    ], segments=28, name="ch_fl", material=mat_gold(), location=(0, 0, 0.60), rotation=btl_rot)
    champ_lbl = create_cylinder("ch_lb", (0.016, -0.022, 0.70), 0.0508, 0.068, mat_linen_white(),
                                rotation=btl_rot, bevel=0.0)
    ch_parts.extend([champ_btl, champ_foil, champ_lbl])
    champagne = join_as_named_object(ch_parts, "Champagne_Bottle")
    place_on_surface(champagne, -1.48, 0.32, 0.0)

    # 10. Violin (Detailed Figure-8 Acoustic Violin + Bow on Wrought-Iron Musician's Stand at X=2.35, Y=1.35, Z=0.0)
    vl_parts = []
    mat_spruce = get_material("Stradivari_Amber_Maple", (0.58, 0.25, 0.09, 1.0), roughness=0.22, coat_weight=0.65)
    mat_ebony = get_material("Violin_Ebony", (0.08, 0.08, 0.09, 1.0), roughness=0.28)

    # Tripod instrument stand
    vl_pole = create_cylinder("vl_pl", (0, 0, 0.44), 0.014, 0.78, mat_iron)
    vl_cradle = create_curved_tube(
        "vl_crd", [(-0.11, -0.06, 0.56), (-0.11, 0.02, 0.54), (0.0, 0.04, 0.54),
                   (0.11, 0.02, 0.54), (0.11, -0.06, 0.56)],
        radius=0.007, material=mat_gold()
    )
    vl_neck_yoke = create_torus("vl_yk", (0, 0.02, 0.94), 0.032, 0.006, mat_gold())
    vl_parts.extend([vl_pole, vl_cradle, vl_neck_yoke])
    for li in range(3):
        ang = (2.0 * math.pi * li) / 3.0 + 0.5
        leg = create_curved_tube(
            f"vl_sl_{li}",
            [(0, 0, 0.16), (0.24 * math.cos(ang), 0.24 * math.sin(ang), 0.01)],
            radius=0.010, material=mat_iron
        )
        vl_parts.append(leg)

    # Sculpted Figure-8 Violin Body (tilted slightly back on stand, facing South-West toward camera)
    # Lower bout + Waist bridge + Upper bout constructed with arched organic cushions for authentic violin belly arch!
    v_tilt = (math.radians(12), 0, 0)
    bout_low = create_soft_cushion((0.22, 0.046, 0.20), bevel_width=0.022, subdiv=2, name="vl_bl",
                                   location=(0, -0.02, 0.65), rotation=v_tilt, material=mat_spruce, puff=0.16)
    waist = create_soft_cushion((0.125, 0.044, 0.12), bevel_width=0.016, subdiv=2, name="vl_ws",
                                location=(0, -0.032, 0.75), rotation=v_tilt, material=mat_spruce, puff=0.14)
    bout_up = create_soft_cushion((0.175, 0.044, 0.16), bevel_width=0.020, subdiv=2, name="vl_bu",
                                  location=(0, -0.046, 0.84), rotation=v_tilt, material=mat_spruce, puff=0.16)
    # Neck, Ebony Fingerboard, Pegbox & Carved Spiral Scroll
    v_neck = create_box("vl_nk", (0, -0.072, 1.02), (0.026, 0.022, 0.26), mat_spruce, rotation=v_tilt, bevel=0.006)
    v_fboard = create_box("vl_fb", (0, -0.086, 0.96), (0.030, 0.008, 0.34), mat_ebony, rotation=v_tilt, bevel=0.003)
    v_scroll = create_torus("vl_sc", (0, -0.102, 1.17), 0.018, 0.009, mat_spruce, rotation=(0, math.radians(90), 0))
    # Tuning pegs, maple bridge, ebony tailpiece, chinrest & f-holes
    v_bridge = create_box("vl_br", (0, -0.062, 0.73), (0.046, 0.005, 0.028), mat_light_oak(), rotation=v_tilt, bevel=0.001)
    v_tail = create_cone("vl_tl", (0, -0.048, 0.63), 0.008, 0.022, 0.12, mat_ebony,
                         rotation=(math.radians(12), 0, 0), scale=(1.0, 0.35, 1.0))
    v_chin = create_soft_cushion((0.068, 0.022, 0.052), bevel_width=0.008, subdiv=1, name="vl_ch",
                                 location=(-0.055, -0.042, 0.60), rotation=v_tilt, material=mat_ebony, puff=0.12)
    f_hole_l = create_curved_tube("vl_fl", [(-0.048, -0.056, 0.70), (-0.042, -0.058, 0.74), (-0.050, -0.060, 0.78)],
                                  radius=0.0028, material=mat_ebony)
    f_hole_r = create_curved_tube("vl_fr", [(0.048, -0.056, 0.70), (0.042, -0.058, 0.74), (0.050, -0.060, 0.78)],
                                  radius=0.0028, material=mat_ebony)
    vl_parts.extend([bout_low, waist, bout_up, v_neck, v_fboard, v_scroll,
                     v_bridge, v_tail, v_chin, f_hole_l, f_hole_r])
    for pi, pz in enumerate((1.11, 1.14)):
        peg = create_cylinder(f"vl_pg_{pi}", (0.024 if pi == 0 else -0.024, -0.098, pz),
                              0.004, 0.055, mat_ebony, rotation=(0, math.radians(90), 0))
        vl_parts.append(peg)
    # 4 Fine Steel Violin Strings
    for si, sx in enumerate((-0.011, -0.0037, 0.0037, 0.011)):
        st = create_curved_tube(
            f"vl_str_{si}",
            [(sx * 0.7, -0.048, 0.64), (sx, -0.072, 0.73), (sx * 0.65, -0.100, 1.11)],
            radius=0.0012, material=mat_chrome()
        )
        vl_parts.append(st)
    # Violin Bow resting diagonally across stand
    bow_stick = create_curved_tube(
        "vl_bw", [(-0.22, -0.09, 0.56), (0.0, -0.105, 0.79), (0.21, -0.11, 1.04)],
        radius=0.0045, material=mat_spruce
    )
    bow_hair = create_curved_tube(
        "vl_bh", [(-0.21, -0.082, 0.55), (0.20, -0.102, 1.03)],
        radius=0.0022, material=mat_linen_white()
    )
    vl_parts.extend([bow_stick, bow_hair])
    violin = join_as_named_object(vl_parts, "Violin")
    place_on_surface(violin, 2.35, 1.35, 0.0)

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "dating.glb"))
    print("WORLD 5 (DATING) EXPORTED SUCCESSFULLY!\n")


# ==============================================================================
# WORLD 6: GARDEN.GLB
# Botanical Lawn + Winding Flagstone Path + White Pointed-Picket Fence + Organic Trees + Lathe Fountain
# ==============================================================================
def _build_organic_tree(prefix, tx, ty, scale_f=1.0):
    """Builds a natural multi-branch botanical tree with curved trunk & subdivided foliage clouds."""
    parts = []
    mat_bark = get_material("Botanical_Oak_Bark", (0.34, 0.22, 0.14, 1.0), roughness=0.86)
    mat_leaf_a = get_material("Canopy_Forest_Green", (0.16, 0.42, 0.18, 1.0), roughness=0.78)
    mat_leaf_b = get_material("Canopy_Olive_Sage", (0.24, 0.50, 0.22, 1.0), roughness=0.76)

    # Flared root trunk + 3 curved limbs
    trunk = create_curved_tube(
        f"{prefix}_trk",
        [(tx, ty, 0.0), (tx + 0.06 * scale_f, ty - 0.04 * scale_f, 0.65 * scale_f),
         (tx - 0.04 * scale_f, ty + 0.03 * scale_f, 1.35 * scale_f),
         (tx, ty, 1.85 * scale_f)],
        radius=0.14 * scale_f, material=mat_bark
    )
    b_left = create_curved_tube(
        f"{prefix}_bl",
        [(tx, ty, 1.20 * scale_f), (tx - 0.35 * scale_f, ty - 0.15 * scale_f, 1.65 * scale_f),
         (tx - 0.58 * scale_f, ty - 0.22 * scale_f, 1.98 * scale_f)],
        radius=0.075 * scale_f, material=mat_bark
    )
    b_right = create_curved_tube(
        f"{prefix}_br",
        [(tx, ty, 1.28 * scale_f), (tx + 0.38 * scale_f, ty + 0.18 * scale_f, 1.72 * scale_f),
         (tx + 0.56 * scale_f, ty + 0.25 * scale_f, 2.02 * scale_f)],
        radius=0.070 * scale_f, material=mat_bark
    )
    parts.extend([trunk, b_left, b_right])

    # Layered organic subdivided foliage cushions (zero raw spheres/cones)
    crowns = [
        ((0.0, 0.0, 2.28), (1.35, 1.25, 0.88), (4, -6, 12), mat_leaf_a),
        ((-0.55, -0.22, 2.05), (0.98, 0.92, 0.72), (-8, 10, 35), mat_leaf_b),
        ((0.55, 0.22, 2.08), (1.02, 0.94, 0.74), (10, -8, -25), mat_leaf_b),
        ((0.12, -0.42, 2.14), (0.92, 0.86, 0.68), (12, 6, 50), mat_leaf_a),
        ((-0.15, 0.44, 2.16), (0.95, 0.88, 0.70), (-10, -10, -40), mat_leaf_a),
    ]
    for ci, ((ox, oy, oz), (sx, sy, sz), (rx, ry, rz), l_mat) in enumerate(crowns):
        cloud = create_soft_cushion(
            (sx * scale_f, sy * scale_f, sz * scale_f),
            bevel_width=0.08 * scale_f, subdiv=2, name=f"{prefix}_cr_{ci}",
            location=(tx + ox * scale_f, ty + oy * scale_f, oz * scale_f),
            rotation=(math.radians(rx), math.radians(ry), math.radians(rz)),
            material=l_mat, puff=0.20
        )
        parts.append(cloud)
    return parts


def build_garden():
    reset_scene()
    print("Building World 6: Botanical Garden & Park (Lathe Fountain, Picket Fence & Organic Trees)...")
    add_bounds_anchor(radius_x=8.0, radius_y=7.0)

    # 1. Garden_Diorama: Lawn + Winding Limestone Pavers + White Pointed-Picket Fence + 3 Organic Trees
    gd_parts = []
    mat_soil = get_material("Rich_Garden_Loam", (0.24, 0.16, 0.11, 1.0), roughness=0.92)
    mat_fence = get_material("Painted_White_Cedar", (0.95, 0.94, 0.91, 1.0), roughness=0.46)

    earth_plinth = create_box("gd_pl", (0, 0, -0.09), (16.0, 14.0, 0.15), mat_soil, bevel=0.008)
    lawn = create_box("gd_lwn", (0, 0, -0.008), (16.0, 14.0, 0.016), mat_grass_natural(), bevel=0.004)
    # Mulch beds along North & West fences with limestone edging
    bed_n = create_box("gd_bdn", (0.5, 5.25, 0.012), (14.6, 1.10, 0.024), mat_soil, bevel=0.008)
    curb_n = create_box("gd_cbn", (0.5, 4.68, 0.03), (14.6, 0.12, 0.06), mat_stone_path(), bevel=0.012)
    bed_w = create_box("gd_bdw", (-6.25, -0.5, 0.012), (1.10, 11.6, 0.024), mat_soil, bevel=0.008)
    curb_w = create_box("gd_cbw", (-5.68, -0.5, 0.03), (0.12, 11.6, 0.06), mat_stone_path(), bevel=0.012)
    gd_parts.extend([earth_plinth, lawn, bed_n, curb_n, bed_w, curb_w])

    # Winding Flagstone Stepping-Stone Path across the lawn
    stepping_stones = [
        (-3.6, -5.2, 0.92, 0.68, 12), (-2.8, -4.1, 0.86, 0.64, -18),
        (-2.0, -3.0, 0.94, 0.70, 8),  (-1.3, -1.9, 0.88, 0.66, 22),
        (-0.4,  0.4, 3.10, 3.10, 0),  # Circular plaza ring under Stone_Fountain
        ( 1.3,  0.7, 0.88, 0.66, -10), (2.3,  1.0, 0.92, 0.68, 14),
        ( 0.3, -1.6, 0.84, 0.62, -24), (0.8, -2.7, 0.88, 0.64, 15),
    ]
    for si, (sx, sy, sw, sd, sang) in enumerate(stepping_stones):
        if sw > 2.5:
            plaza = create_cylinder(f"gd_pz_{si}", (sx, sy, 0.008), sw * 0.5, 0.016,
                                    mat_stone_path(), vertices=36, bevel=0.005)
            gd_parts.append(plaza)
        else:
            st = create_cylinder(f"gd_st_{si}", (sx, sy, 0.010), sw * 0.5, 0.020,
                                 mat_stone_path(), vertices=7, bevel=0.006,
                                 rotation=(0, 0, math.radians(sang)), scale=(1.0, sd / sw, 1.0))
            gd_parts.append(st)

    # Crisp White Pointed-Picket Fence along North (Y = 5.85) and West (X = -6.85)
    ny_f, wx_f = 5.85, -6.85
    # Horizontal rails
    gd_parts.append(create_box("gd_fr_nt", (0.55, ny_f + 0.03, 0.86), (14.8, 0.045, 0.07), mat_fence, bevel=0.005))
    gd_parts.append(create_box("gd_fr_nb", (0.55, ny_f + 0.03, 0.28), (14.8, 0.045, 0.07), mat_fence, bevel=0.005))
    gd_parts.append(create_box("gd_fr_wt", (wx_f - 0.03, -0.55, 0.86), (0.045, 12.8, 0.07), mat_fence, bevel=0.005))
    gd_parts.append(create_box("gd_fr_wb", (wx_f - 0.03, -0.55, 0.28), (0.045, 12.8, 0.07), mat_fence, bevel=0.005))

    def _add_picket(name_p, px, py, along_x=True):
        w_p = (0.085, 0.024, 0.98) if along_x else (0.024, 0.085, 0.98)
        slat = create_box(f"{name_p}_s", (px, py, 0.51), w_p, mat_fence, bevel=0.003)
        tip = create_cone(f"{name_p}_t", (px, py, 1.045), 0.058, 0.004, 0.09, mat_fence, vertices=4,
                          rotation=(0, 0, math.radians(45)),
                          scale=(1.0, 0.35, 1.0) if along_x else (0.35, 1.0, 1.0))
        return [slat, tip]

    for i in range(62):
        px = -6.70 + i * 0.235
        gd_parts.extend(_add_picket(f"pk_n_{i}", px, ny_f, along_x=True))
    for i in range(54):
        py = -6.80 + i * 0.235
        gd_parts.extend(_add_picket(f"pk_w_{i}", wx_f, py, along_x=False))
    for pi, (post_x, post_y) in enumerate([(-6.85, 5.85), (-2.0, 5.85), (2.8, 5.85), (7.6, 5.85), (-6.85, 1.2), (-6.85, -3.6)]):
        pst = create_box(f"gd_fp_{pi}", (post_x, post_y, 0.58), (0.14, 0.14, 1.16), mat_fence, bevel=0.008)
        cap = create_sphere(f"gd_fc_{pi}", (post_x, post_y, 1.21), 0.065, mat_fence)
        gd_parts.extend([pst, cap])

    # 3 Organic Multi-Canopy Botanical Trees
    gd_parts.extend(_build_organic_tree("tree_nw", -5.85, 4.95, scale_f=1.12))
    gd_parts.extend(_build_organic_tree("tree_nc", 0.45, 5.05, scale_f=0.98))
    gd_parts.extend(_build_organic_tree("tree_ne", 6.15, 4.85, scale_f=1.08))

    join_as_named_object(gd_parts, "Garden_Diorama")

    # 2. Stone_Fountain (3-Tier Sculpted Limestone Lathe Fountain with Crystal Water at X=-0.4, Y=0.4, Z=0.0)
    ft_parts = []
    mat_carved_stone = get_material("Carved_Travertine_Stone", (0.82, 0.79, 0.73, 1.0), roughness=0.56)
    # Lower pool basin (hollow lathe profile) + lower water surface
    pool_prof = [
        (0.000, 0.000, 'sharp'), (1.16, 0.000, 'sharp'), (1.22, 0.06),
        (1.18, 0.34), (1.25, 0.38, 'sharp'), (1.24, 0.42, 'sharp'),
        (1.10, 0.42, 'sharp'), (1.08, 0.12, 'sharp'), (0.000, 0.12, 'sharp')
    ]
    ft_pool = create_lathe_profile(pool_prof, segments=36, name="ft_pl", material=mat_carved_stone, cap_ends=False)
    ft_w1 = create_cylinder("ft_w1", (0, 0, 0.34), 1.09, 0.04, mat_water(), vertices=36, bevel=0.0)
    # Central turned baluster pedestal + Mid & Upper Bowls + Finial
    ft_col = create_lathe_profile([
        (0.36, 0.12, 'sharp'), (0.32, 0.24), (0.20, 0.46), (0.26, 0.64),
        (0.18, 0.84), (0.68, 0.94), (0.72, 1.04, 'sharp'), (0.64, 1.04, 'sharp'),
        (0.58, 0.96), (0.16, 0.95), (0.14, 1.24), (0.19, 1.38),
        (0.42, 1.48), (0.45, 1.56, 'sharp'), (0.39, 1.56, 'sharp'),
        (0.34, 1.50), (0.11, 1.49), (0.09, 1.72), (0.13, 1.82),
        (0.06, 1.94), (0.00, 1.99)
    ], segments=32, name="ft_cl", material=mat_carved_stone)
    ft_w2 = create_cylinder("ft_w2", (0, 0, 1.00), 0.63, 0.03, mat_water(), vertices=32, bevel=0.0)
    ft_w3 = create_cylinder("ft_w3", (0, 0, 1.52), 0.38, 0.025, mat_water(), vertices=28, bevel=0.0)
    ft_parts.extend([ft_pool, ft_w1, ft_col, ft_w2, ft_w3])
    fountain = join_as_named_object(ft_parts, "Stone_Fountain")
    place_on_surface(fountain, -0.40, 0.40, 0.0)

    # 3. Watering_Can (Heritage Sage-Green Galvanized Watering Can with Brass Rose at X=-2.45, Y=-1.15, Z=0.0)
    mat_can_green = get_material("Heritage_Sage_Enamel", (0.18, 0.42, 0.30, 1.0), metallic=0.45, roughness=0.34)
    wc_body = create_lathe_profile([
        (0.115, 0.000, 'sharp'), (0.122, 0.015), (0.108, 0.255),
        (0.114, 0.268, 'sharp'), (0.105, 0.268, 'sharp'),
        (0.098, 0.23), (0.000, 0.015, 'sharp')
    ], segments=28, name="wc_bd", material=mat_can_green, scale=(1.15, 0.88, 1.0), cap_ends=False)
    wc_water = create_cylinder("wc_wt", (0, 0, 0.19), 0.098, 0.02, mat_water(), scale=(1.12, 0.85, 1.0))
    wc_arch = create_curved_tube(
        "wc_ar", [(-0.11, 0, 0.25), (-0.09, 0, 0.38), (0.02, 0, 0.40), (0.11, 0, 0.25)],
        radius=0.010, material=mat_can_green
    )
    wc_rear_h = create_curved_tube(
        "wc_rh", [(-0.12, 0, 0.23), (-0.21, 0, 0.21), (-0.21, 0, 0.09), (-0.12, 0, 0.06)],
        radius=0.010, material=mat_can_green
    )
    wc_spout = create_curved_tube(
        "wc_sp", [(0.11, 0, 0.06), (0.22, 0, 0.16), (0.31, 0, 0.29)],
        radius=0.015, material=mat_can_green
    )
    wc_rose = create_lathe_profile([
        (0.016, 0.000, 'sharp'), (0.044, 0.036), (0.046, 0.046, 'sharp'), (0.000, 0.052)
    ], segments=24, name="wc_rs", material=mat_gold(),
        location=(0.31, 0, 0.29), rotation=(0, math.radians(44), 0))
    w_can = join_as_named_object([wc_body, wc_water, wc_arch, wc_rear_h, wc_spout, wc_rose], "Watering_Can")
    place_on_surface(w_can, -2.45, -1.15, 0.0)

    # 4. Wheelbarrow (Contoured Steel Tray + Loam Soil + Pneumatic Wheel + Ash Handles at X=-4.35, Y=-1.95, Z=0.0)
    wb_parts = []
    mat_wb_tray = get_material("Wheelbarrow_Forest_Steel", (0.14, 0.36, 0.22, 1.0), metallic=0.55, roughness=0.36)
    wb_tray = create_recessed_box(
        "wb_tr", (0.05, 0, 0.39), (0.86, 0.58, 0.28),
        cavity_face='+Z', margin=(0.04, 0.04), cavity_depth=0.20,
        outer_mat=mat_wb_tray, inner_mat=mat_wb_tray, bevel=0.025
    )
    wb_tray.rotation_euler = (0, math.radians(-8), 0)
    wb_soil = create_soft_cushion((0.72, 0.46, 0.12), bevel_width=0.03, subdiv=2, name="wb_sl",
                                  location=(0.05, 0, 0.43), material=mat_soil, puff=0.22)
    # Front rubber tire + brass/steel hub at X = +0.52, Z = 0.18 (touching Z = 0.0!)
    wb_tire = create_torus("wb_wh", (0.52, 0, 0.18), 0.14, 0.042,
                           get_material("Tire_Rubber", (0.11, 0.11, 0.12, 1.0), roughness=0.82),
                           rotation=(math.radians(90), 0, 0))
    wb_hub = create_cylinder("wb_hb", (0.52, 0, 0.18), 0.105, 0.035, mat_gold(), rotation=(math.radians(90), 0, 0))
    wb_axle = create_cylinder("wb_ax", (0.52, 0, 0.18), 0.016, 0.22, mat_steel(), rotation=(math.radians(90), 0, 0))
    wb_parts.extend([wb_tray, wb_soil, wb_tire, wb_hub, wb_axle])
    # Twin ash-wood handles & curved steel support legs touching Z = 0.0
    for sy_s in (-0.20, 0.20):
        beam = create_curved_tube(
            f"wb_bm_{sy_s}",
            [(-0.66, sy_s * 1.25, 0.44), (-0.15, sy_s, 0.28), (0.52, sy_s * 0.42, 0.18)],
            radius=0.020, material=mat_light_oak()
        )
        leg = create_curved_tube(
            f"wb_lg_{sy_s}",
            [(-0.28, sy_s, 0.30), (-0.30, sy_s, 0.015), (-0.14, sy_s, 0.015), (-0.10, sy_s, 0.26)],
            radius=0.014, material=mat_dark_steel()
        )
        wb_parts.extend([beam, leg])
    wheelbarrow = join_as_named_object(wb_parts, "Wheelbarrow")
    place_on_surface(wheelbarrow, -4.35, -1.95, 0.0)

    # 5. Flower_Pot (Cluster of 3 Artisanal Lathe-Turned Terracotta Planters with Matte Flowers at X=-2.25, Y=2.85, Z=0.0)
    fp_parts = []
    pot_configs = [
        (0.00, 0.00, 1.00, get_material("Bloom_Coral_Terracotta", (0.84, 0.38, 0.28, 1.0), roughness=0.68)),
        (-0.34, -0.18, 0.80, get_material("Bloom_Botanical_Lavender", (0.54, 0.44, 0.72, 1.0), roughness=0.68)),
        (0.32, -0.14, 0.86, get_material("Bloom_Marigold_Gold", (0.88, 0.64, 0.18, 1.0), roughness=0.66)),
    ]
    mat_foliage = get_material("Planter_Leaf_Green", (0.18, 0.46, 0.20, 1.0), roughness=0.68)
    for pi, (px, py, sc, b_mat) in enumerate(pot_configs):
        pot = create_lathe_profile([
            (0.115 * sc, 0.000, 'sharp'), (0.145 * sc, 0.18 * sc), (0.168 * sc, 0.31 * sc, 'sharp'),
            (0.185 * sc, 0.32 * sc, 'sharp'), (0.185 * sc, 0.37 * sc, 'sharp'),
            (0.158 * sc, 0.37 * sc, 'sharp'), (0.140 * sc, 0.30 * sc), (0.000, 0.30 * sc, 'sharp')
        ], segments=28, name=f"fp_pt_{pi}", material=mat_terracotta(), location=(px, py, 0), cap_ends=False)
        soil_d = create_cylinder(f"fp_sl_{pi}", (px, py, 0.32 * sc), 0.152 * sc, 0.03 * sc, mat_soil)
        bush = create_soft_cushion((0.28 * sc, 0.28 * sc, 0.16 * sc), bevel_width=0.03 * sc, subdiv=2,
                                   name=f"fp_bs_{pi}", location=(px, py, 0.40 * sc), material=mat_foliage, puff=0.18)
        fp_parts.extend([pot, soil_d, bush])
        for bi in range(5):
            ba = (2.0 * math.pi * bi) / 5.0 + pi
            bx_o = px + (0.08 * sc * math.cos(ba) if bi < 4 else 0.0)
            by_o = py + (0.08 * sc * math.sin(ba) if bi < 4 else 0.0)
            bz_o = (0.48 if bi < 4 else 0.52) * sc
            bloom = create_soft_cushion((0.075 * sc, 0.075 * sc, 0.055 * sc), bevel_width=0.015 * sc, subdiv=2,
                                        name=f"fp_bl_{pi}_{bi}", location=(bx_o, by_o, bz_o),
                                        rotation=(0, 0, ba), material=b_mat, puff=0.20)
            fp_parts.append(bloom)
    flower_pot = join_as_named_object(fp_parts, "Flower_Pot")
    place_on_surface(flower_pot, -2.25, 2.85, 0.0)

    # 6. Garden_Pergola_Table (Open-Span Cedar Pergola + Slatted Teak Table with top STRICTLY at Z = 0.78m!)
    gp_parts = []
    gx_c, gy_c = 3.45, 1.25
    # 4 Wide Cedar Pergola Corner Posts (wide enough so central table Z=0.78m is 100% unobstructed)
    for px_o in (-1.35, 1.35):
        for py_o in (-1.10, 1.10):
            base_s = create_box(f"gp_pb_{px_o}_{py_o}", (gx_c + px_o, gy_c + py_o, 0.05),
                                (0.20, 0.20, 0.10), mat_stone_path(), bevel=0.008)
            post = create_box(f"gp_ps_{px_o}_{py_o}", (gx_c + px_o, gy_c + py_o, 1.32),
                              (0.13, 0.13, 2.44), mat_warm_wood(), bevel=0.008)
            gp_parts.extend([base_s, post])
    # Overhead Pergola Beams & Cross Rafters at Z = 2.58m..2.68m
    for py_o in (-1.10, 1.10):
        beam = create_box(f"gp_bm_{py_o}", (gx_c, gy_c + py_o, 2.58), (3.10, 0.11, 0.14), mat_dark_walnut(), bevel=0.008)
        gp_parts.append(beam)
    for rx_i in range(7):
        rx_o = -1.26 + rx_i * 0.42
        rafter = create_box(f"gp_rf_{rx_i}", (gx_c + rx_o, gy_c, 2.69), (0.065, 2.64, 0.09), mat_warm_wood(), bevel=0.006)
        gp_parts.append(rafter)

    # Slatted Teak Garden Table centered at (3.45, 1.25) with tabletop top surface STRICTLY at Z = 0.78m!
    # Apron frame (Z: 0.69..0.745) + 5 Teak Slats (Z center = 0.7625, height = 0.035 -> top_z = 0.780m!)
    apron = create_box("gp_ap", (gx_c, gy_c, 0.715), (1.48, 0.86, 0.055), mat_dark_walnut(), bevel=0.006)
    gp_parts.append(apron)
    for si in range(5):
        sy_o = -0.36 + si * 0.18
        slat = create_box(f"gp_sl_{si}", (gx_c, gy_c + sy_o, 0.7625), (1.58, 0.168, 0.035), mat_light_oak(), bevel=0.005)
        gp_parts.append(slat)
    for lx_o in (-0.68, 0.68):
        for ly_o in (-0.38, 0.38):
            t_leg = create_box(f"gp_tl_{lx_o}_{ly_o}", (gx_c + lx_o, gy_c + ly_o, 0.37),
                               (0.075, 0.075, 0.74), mat_dark_walnut(), bevel=0.006)
            gp_parts.append(t_leg)
    join_as_named_object(gp_parts, "Garden_Pergola_Table")

    # 7. Pruning_Shears (Ergonomic Bypass Secateurs resting strictly on table Z = 0.78m!)
    ps_grip1 = create_curved_tube(
        "ps_g1", [(-0.045, -0.10, 0.012), (-0.025, -0.04, 0.012), (-0.006, 0.015, 0.012)],
        radius=0.010, material=mat_terracotta()
    )
    ps_grip2 = create_curved_tube(
        "ps_g2", [(0.045, -0.10, 0.012), (0.025, -0.04, 0.012), (0.006, 0.015, 0.012)],
        radius=0.010, material=mat_terracotta()
    )
    ps_pivot = create_cylinder("ps_pv", (0, 0.022, 0.013), 0.012, 0.016, mat_gold())
    ps_spring = create_cylinder("ps_sp", (0, -0.032, 0.012), 0.005, 0.036, mat_chrome(), rotation=(0, math.radians(90), 0))
    ps_blade1 = create_box("ps_b1", (-0.008, 0.068, 0.014), (0.018, 0.082, 0.004), mat_chrome(),
                           rotation=(0, 0, math.radians(-12)), bevel=0.001)
    ps_blade2 = create_box("ps_b2", (0.008, 0.064, 0.010), (0.016, 0.074, 0.004), mat_dark_steel(),
                           rotation=(0, 0, math.radians(10)), bevel=0.001)
    shears = join_as_named_object([ps_grip1, ps_grip2, ps_pivot, ps_spring, ps_blade1, ps_blade2], "Pruning_Shears")
    place_on_surface(shears, 3.16, 1.16, 0.78)

    # 8. Garden_Trowel (Lathe Ash-Wood Handle + Brass Ferrule + Concave Scoop Blade on table Z = 0.78m!)
    gt_handle = create_lathe_profile([
        (0.000, -0.14), (0.015, -0.125), (0.018, -0.075), (0.013, -0.020), (0.014, 0.000, 'sharp')
    ], segments=24, name="gt_hd", material=mat_warm_wood(), rotation=(math.radians(-90), 0, 0))
    gt_ferrule = create_cylinder("gt_fr", (0, 0.010, 0.0), 0.0145, 0.022, mat_gold(), rotation=(math.radians(90), 0, 0))
    gt_tang = create_curved_tube("gt_tg", [(0, 0.020, 0.0), (0, 0.048, -0.008), (0, 0.068, -0.004)],
                                 radius=0.0055, material=mat_chrome())
    gt_scoop = create_lathe_profile([
        (0.000, 0.000), (0.028, 0.006), (0.036, 0.016, 'sharp'),
        (0.033, 0.016, 'sharp'), (0.024, 0.008), (0.000, 0.003)
    ], segments=24, name="gt_sc", material=mat_steel(), location=(0, 0.125, -0.008),
        scale=(0.95, 1.85, 0.85), cap_ends=False)
    trowel = join_as_named_object([gt_handle, gt_ferrule, gt_tang, gt_scoop], "Garden_Trowel")
    place_on_surface(trowel, 3.74, 1.20, 0.78)

    # 9. Birdhouse (Handcrafted Cedar Cabin Birdhouse on Timber Post at X=-4.85, Y=3.25, Z=0.0)
    bh_post = create_box("bh_ps", (0, 0, 0.68), (0.10, 0.10, 1.36), mat_dark_walnut(), bevel=0.008)
    bh_plinth = create_box("bh_pl", (0, 0, 0.04), (0.24, 0.24, 0.08), mat_stone_path(), bevel=0.008)
    bh_platform = create_box("bh_pf", (0, 0, 1.37), (0.36, 0.38, 0.03), mat_dark_walnut(), bevel=0.005)
    # Cabin body with recessed circular entrance hole facing -Y
    bh_cabin = create_box("bh_cb", (0, 0, 1.53), (0.28, 0.30, 0.30), mat_light_oak(), bevel=0.008)
    bh_hole_ring = create_torus("bh_hr", (0, -0.152, 1.54), 0.042, 0.007, mat_gold(), rotation=(math.radians(90), 0, 0))
    bh_hole_dark = create_cylinder("bh_hd", (0, -0.148, 1.54), 0.038, 0.012, mat_dark_steel(), rotation=(math.radians(90), 0, 0))
    bh_perch = create_cylinder("bh_pr", (0, -0.19, 1.46), 0.008, 0.09, mat_warm_wood(), rotation=(math.radians(90), 0, 0))
    # Pitched Cedar Roof slopes
    bh_roof_l = create_box("bh_rl", (-0.105, 0, 1.73), (0.25, 0.38, 0.028), mat_terracotta(),
                           rotation=(0, math.radians(-34), 0), bevel=0.004)
    bh_roof_r = create_box("bh_rr", (0.105, 0, 1.73), (0.25, 0.38, 0.028), mat_terracotta(),
                           rotation=(0, math.radians(34), 0), bevel=0.004)
    bh_ridge = create_cylinder("bh_rg", (0, 0, 1.805), 0.018, 0.39, mat_gold(), rotation=(math.radians(90), 0, 0))
    birdhouse = join_as_named_object([bh_post, bh_plinth, bh_platform, bh_cabin, bh_hole_ring,
                                      bh_hole_dark, bh_perch, bh_roof_l, bh_roof_r, bh_ridge], "Birdhouse")
    place_on_surface(birdhouse, -4.85, 3.25, 0.0)

    # 10. Picnic_Basket (Woven Willow Wicker Hamper with Split Lids, Leather Straps & Handle at X=2.45, Y=-2.85, Z=0.0)
    pb_parts = []
    mat_wicker = get_material("Honey_Willow_Wicker", (0.70, 0.50, 0.28, 1.0), roughness=0.68)
    pb_core = create_box("pb_cr", (0, 0, 0.14), (0.50, 0.34, 0.26), mat_wicker, bevel=0.022)
    pb_parts.append(pb_core)
    # Horizontal woven wicker bands
    for wz in (0.06, 0.12, 0.18, 0.24):
        band = create_box(f"pb_wb_{wz}", (0, 0, wz), (0.514, 0.354, 0.022), mat_light_oak(), bevel=0.006)
        pb_parts.append(band)
    # Split hinged lids (one slightly propped open showing red/ivory gingham cloth!)
    pb_cloth = create_soft_cushion((0.46, 0.30, 0.04), bevel_width=0.01, subdiv=1, name="pb_cl",
                                   location=(0, 0, 0.27), material=mat_linen_white(), puff=0.12)
    pb_lid_l = create_box("pb_ll", (-0.128, 0, 0.29), (0.245, 0.36, 0.028), mat_wicker, bevel=0.008)
    pb_lid_r = create_box("pb_lr", (0.132, 0, 0.315), (0.245, 0.36, 0.028), mat_wicker,
                          rotation=(0, math.radians(-14), 0), bevel=0.008)
    pb_strap_l = create_box("pb_sl", (-0.13, 0, 0.285), (0.032, 0.372, 0.042), mat_cognac_leather(), bevel=0.004)
    pb_buckle = create_box("pb_bk", (-0.13, -0.188, 0.26), (0.040, 0.008, 0.036), mat_gold(), bevel=0.002)
    pb_handle = create_curved_tube(
        "pb_hd", [(0, -0.175, 0.27), (0, -0.14, 0.44), (0, 0.0, 0.48), (0, 0.14, 0.44), (0, 0.175, 0.27)],
        radius=0.013, material=mat_wicker
    )
    pb_parts.extend([pb_cloth, pb_lid_l, pb_lid_r, pb_strap_l, pb_buckle, pb_handle])
    picnic = join_as_named_object(pb_parts, "Picnic_Basket")
    place_on_surface(picnic, 2.45, -2.85, 0.0)

    # 11. Garden_Lantern (Victorian Wrought-Iron & Warm Amber Path Lantern at X=0.95, Y=-3.35, Z=0.0)
    mat_iron_g = get_material("Botanical_Cast_Iron", (0.13, 0.15, 0.14, 1.0), metallic=0.72, roughness=0.38)
    gl_plinth = create_box("gl_pl", (0, 0, 0.06), (0.34, 0.34, 0.12), mat_stone_path(), bevel=0.012)
    gl_post = create_lathe_profile([
        (0.11, 0.12, 'sharp'), (0.09, 0.22), (0.045, 0.36), (0.038, 0.92), (0.075, 1.02, 'sharp')
    ], segments=24, name="gl_ps", material=mat_iron_g)
    gl_glass = create_cone("gl_gl", (0, 0, 1.18), 0.105, 0.145, 0.30,
                           mat_tinted_glass("Garden_Lantern_Glass", (0.96, 0.86, 0.62), 0.40), vertices=6)
    gl_core = create_lathe_profile([
        (0.00, 1.10), (0.032, 1.16), (0.026, 1.23), (0.00, 1.27)
    ], segments=18, name="gl_cr",
        material=mat_screen((0.98, 0.78, 0.38, 1.0), 1.9, "Garden_Lantern_Glow"), cap_ends=False)
    gl_cap = create_cone("gl_cp", (0, 0, 1.39), 0.19, 0.02, 0.14, mat_iron_g, vertices=6)
    gl_ring = create_torus("gl_rg", (0, 0, 1.49), 0.028, 0.006, mat_gold(), rotation=(math.radians(90), 0, 0))
    gl_parts = [gl_plinth, gl_post, gl_glass, gl_core, gl_cap, gl_ring]
    for si in range(6):
        sa = (2.0 * math.pi * si) / 6.0
        strut = create_curved_tube(
            f"gl_st_{si}",
            [(0.102 * math.cos(sa), 0.102 * math.sin(sa), 1.03),
             (0.142 * math.cos(sa), 0.142 * math.sin(sa), 1.33)],
            radius=0.006, material=mat_iron_g
        )
        gl_parts.append(strut)
    lantern = join_as_named_object(gl_parts, "Garden_Lantern")
    place_on_surface(lantern, 0.95, -3.35, 0.0)

    export_glb(os.path.join(OUTPUT_WORLDS_DIR, "garden.glb"))
    print("WORLD 6 (GARDEN) EXPORTED SUCCESSFULLY!\n")


# ==============================================================================
# WORLD 7: SPACE.GLB
# Orbital Titanium Observatory + Cosmic Bay Window + 3-Bay Console + Octagonal Airlock + Bio-Dome
# ==============================================================================
def build_space():
    reset_scene()
    print("Building World 7: Orbital Space Station (Titanium Bulkheads, Cosmic Bay & Octagonal Airlock)...")
    add_bounds_anchor(radius_x=8.0, radius_y=7.0)

    # 1. Space_Diorama: Beveled Titanium Deck + Ribbed Orbital Bulkheads + Cosmic Panorama Window
    mat_hull_white = get_material("Orbital_Composite_White", (0.86, 0.88, 0.91, 1.0), metallic=0.22, roughness=0.34)
    mat_titanium = mat_sci_fi_metal()
    mat_ochre_accent = get_material("Aero_Amber_Trim", (0.84, 0.56, 0.16, 1.0), metallic=0.35, roughness=0.35)

    diorama = build_isometric_room(
        "Space",
        floor_size=(16.0, 14.0),
        floor_mat=mat_titanium,
        wall_mat=mat_hull_white,
        baseboard_mat=mat_dark_steel(),
        north_y=6.0,
        west_x=-7.0,
        wall_height=3.7,
        has_window=True,
        window_pos=(0.3, 6.0, 2.05),
        window_size=(5.2, 1.85),
        floor_style='scifi',
        add_sconces=False
    )
    sp_env = [diorama]
    # Structural Bulkhead Ribs & Overhead Conduit Pipes along North and West walls
    for rx in (-5.6, -3.4, 3.6, 6.2):
        rib = create_box(f"sp_rbn_{rx}", (rx, 5.78, 1.85), (0.18, 0.22, 3.66), mat_dark_steel(), bevel=0.012)
        gusset = create_box(f"sp_gsn_{rx}", (rx, 5.55, 3.35), (0.16, 0.55, 0.45), mat_titanium,
                            rotation=(math.radians(32), 0, 0), bevel=0.010)
        sp_env.extend([rib, gusset])
    for ry in (-5.2, -2.2, 0.8, 5.2):
        rib_w = create_box(f"sp_rbw_{ry}", (-6.78, ry, 1.85), (0.22, 0.18, 3.66), mat_dark_steel(), bevel=0.012)
        sp_env.append(rib_w)
    # Deep-Space Cosmic Backdrop outside North Observation Bay (Y = 6.36) with Earth/Planet Rim & Stars
    mat_cosmos = get_material("Deep_Space_Void", (0.02, 0.03, 0.06, 1.0), roughness=0.90)
    cosmos_bg = create_box("sp_cos", (0.3, 6.38, 2.05), (5.8, 0.04, 2.35), mat_cosmos, bevel=0.0)
    planet_arc = create_sphere("sp_pln", (1.6, 6.35, 1.35), 1.05,
                               get_material("Orbital_Earth_Horizon", (0.14, 0.42, 0.76, 1.0), roughness=0.55,
                                            emission=(0.10, 0.35, 0.72, 1.0), emission_strength=0.45),
                               scale=(1.6, 0.06, 0.85))
    sp_env.extend([cosmos_bg, planet_arc])
    star_mat = mat_screen((0.92, 0.95, 1.0, 1.0), 1.8, "Star_Pinpoint")
    for si, (sx, sz) in enumerate([(-1.8, 2.6), (-1.1, 2.1), (-0.4, 2.75), (0.6, 2.55), (1.9, 2.7), (-1.5, 1.55)]):
        sp_env.append(create_sphere(f"sp_st_{si}", (sx, 6.34, sz), 0.018, star_mat, segments=8, rings=6))
    # Subtle recessed warm-white ceiling strip sconces
    sp_env.append(create_box("sp_lt_n", (0.3, 5.72, 3.55), (12.0, 0.06, 0.04),
                             mat_screen((0.86, 0.92, 0.98, 1.0), 1.4, "Deck_Strip_Light"), bevel=0.004))
    join_as_named_object(sp_env, "Space_Diorama")

    # 2. Control_Console (Curved 3-Bay Orbital Command Desk + 3 Holographic Telemetry Monitors at X=-0.5, Y=2.25, Z=0.0)
    cc_parts = create_appliance_chassis(
        "Control_Console", (1.65, 0.82, 0.86),
        body_mat=mat_hull_white, inner_mat=mat_dark_steel(),
        cavity_face='-Y', cavity_margin=0.06, cavity_depth=0.08,
        knobs=[
            {'center': (-0.45, -0.415, 0.56), 'radius': 0.026, 'depth': 0.020, 'mat': mat_ochre_accent},
            {'center': (0.45, -0.415, 0.56), 'radius': 0.026, 'depth': 0.020, 'mat': mat_chrome()},
        ],
        vents=[{
            'start': (-0.60, -0.412, 0.20), 'step': (0.24, 0, 0), 'count': 6,
            'slot_size': (0.16, 0.01, 0.014)
        }],
        feet_height=0.04
    )
    # Angled Left & Right Wing Console Bays for wrap-around cockpit geometry
    for side, sgn in (("l", -1.0), ("r", 1.0)):
        wing = create_box(f"cc_wg_{side}", (sgn * 1.12, -0.22, 0.45), (0.82, 0.74, 0.82),
                          mat_hull_white, rotation=(0, 0, math.radians(sgn * 26)), bevel=0.016)
        w_top = create_box(f"cc_wt_{side}", (sgn * 1.12, -0.22, 0.87), (0.86, 0.78, 0.04),
                           mat_dark_steel(), rotation=(0, 0, math.radians(sgn * 26)), bevel=0.008)
        cc_parts.extend([wing, w_top])
    cc_desk_top = create_box("cc_dt", (0, 0, 0.87), (1.70, 0.86, 0.04), mat_dark_steel(), bevel=0.008)
    # Throttle Quadrant, Joystick & Illuminated Keypads on Console Surface
    cc_joy_base = create_cylinder("cc_jb", (0.42, -0.12, 0.90), 0.055, 0.025, mat_titanium)
    cc_joy_stick = create_curved_tube("cc_js", [(0.42, -0.12, 0.91), (0.42, -0.15, 1.04)], radius=0.014, material=mat_dark_steel())
    cc_pad_l = create_box("cc_pl", (-0.38, -0.14, 0.895), (0.42, 0.22, 0.014),
                          mat_screen((0.20, 0.68, 0.86, 1.0), 1.3, "Console_Keypad"), bevel=0.003)
    cc_parts.extend([cc_desk_top, cc_joy_base, cc_joy_stick, cc_pad_l])

    # 3 Framed Holographic Telemetry Displays (Center, Left angled, Right angled)
    mon_specs = [
        (0.0, 0.16, 1.24, 0.76, 0.44, 0.0, (0.18, 0.68, 0.88, 1.0)),
        (-0.88, -0.02, 1.20, 0.58, 0.38, -24.0, (0.20, 0.78, 0.56, 1.0)),
        (0.88, -0.02, 1.20, 0.58, 0.38, 24.0, (0.88, 0.64, 0.22, 1.0)),
    ]
    for mi, (mx, my, mz, mw, mh, mang, mcol) in enumerate(mon_specs):
        arm = create_cylinder(f"cc_ma_{mi}", (mx, my + 0.04, 1.02), 0.024, 0.30, mat_chrome())
        frame = create_box(f"cc_mf_{mi}", (mx, my, mz), (mw, 0.032, mh), mat_dark_steel(),
                           rotation=(math.radians(10), 0, math.radians(mang)), bevel=0.008)
        scr = create_box(f"cc_ms_{mi}", (mx - 0.015 * math.sin(math.radians(mang)), my - 0.018, mz),
                         (mw - 0.04, 0.008, mh - 0.04),
                         mat_screen(mcol, 1.5, f"Telemetry_Scr_{mi}"),
                         rotation=(math.radians(10), 0, math.radians(mang)), bevel=0.002)
        cc_parts.extend([arm, frame, scr])
    console = join_as_named_object(cc_parts, "Control_Console")
    place_on_surface(console, -0.45, 2.25, 0.0)

    # 3. Astronaut_Helmet (EVA Pressure Helmet with Curved 24k Gold Solar Visor on Display Pedestal at X=-4.65, Y=2.95, Z=0.0)
    ah_parts = []
    # Beveled Titanium Display Pedestal (top at Z = 0.90m)
    ped_base = create_cylinder("ah_pb", (0, 0, 0.04), 0.32, 0.08, mat_dark_steel(), vertices=8, bevel=0.008)
    ped_col = create_box("ah_pc", (0, 0, 0.46), (0.34, 0.34, 0.78), mat_titanium, bevel=0.016)
    ped_cap = create_box("ah_pt", (0, 0, 0.88), (0.44, 0.44, 0.05), mat_hull_white, bevel=0.008)
    ah_parts.extend([ped_base, ped_col, ped_cap])
    # Anodized Neck Disconnect Ring + Contoured White EVA Shell + Curved Gold Bubble Visor + Side Headlamps
    neck_ring = create_lathe_profile([
        (0.175, 0.905, 'sharp'), (0.185, 0.925), (0.165, 0.955, 'sharp'), (0.145, 0.955, 'sharp'), (0.000, 0.915, 'sharp')
    ], segments=32, name="ah_nr",
        material=get_material("Anodized_Aero_Blue", (0.16, 0.38, 0.68, 1.0), metallic=0.82, roughness=0.26))
    eva_shell = create_sphere("ah_sh", (0, 0.015, 1.14), 0.215, mat_hull_white, scale=(0.98, 1.06, 1.08))
    sun_hood = create_sphere("ah_hd", (0, 0.00, 1.19), 0.224, mat_hull_white, scale=(1.0, 0.95, 0.65))
    gold_visor = create_sphere(
        "ah_vs", (0, -0.048, 1.135), 0.192,
        get_material("EVA_Gold_Solar_Visor", (0.90, 0.72, 0.28, 1.0), metallic=0.94, roughness=0.09, coat_weight=0.5),
        scale=(0.92, 0.95, 0.92)
    )
    ah_parts.extend([neck_ring, eva_shell, sun_hood, gold_visor])
    for sx in (-0.215, 0.215):
        pod = create_box(f"ah_pd_{sx}", (sx, -0.01, 1.14), (0.045, 0.12, 0.085), mat_dark_steel(), bevel=0.008)
        lens = create_cylinder(f"ah_ln_{sx}", (sx, -0.075, 1.14), 0.018, 0.014,
                               mat_screen((0.92, 0.94, 0.98, 1.0), 1.4, "EVA_Lamp"), rotation=(math.radians(90), 0, 0))
        ah_parts.extend([pod, lens])
    helmet = join_as_named_object(ah_parts, "Astronaut_Helmet")
    place_on_surface(helmet, -4.65, 2.95, 0.0)

    # 4. Oxygen_Tank (Twin Lathe-Domed Cryogenic O2 Cylinders in Containment Rack with Manifold Valves at X=-5.55, Y=-0.55, Z=0.0)
    ox_parts = []
    # Heavy steel floor cradle & dual tank clamp brackets
    ox_base = create_box("ox_bs", (0, 0, 0.04), (0.86, 0.46, 0.08), mat_dark_steel(), bevel=0.008)
    ox_frame_l = create_box("ox_fl", (-0.39, 0.14, 0.66), (0.05, 0.06, 1.22), mat_dark_steel(), bevel=0.006)
    ox_frame_r = create_box("ox_fr", (0.39, 0.14, 0.66), (0.05, 0.06, 1.22), mat_dark_steel(), bevel=0.006)
    ox_clamp_1 = create_box("ox_c1", (0, 0, 0.45), (0.82, 0.36, 0.05), mat_titanium, bevel=0.008)
    ox_clamp_2 = create_box("ox_c2", (0, 0, 0.92), (0.82, 0.36, 0.05), mat_titanium, bevel=0.008)
    ox_parts.extend([ox_base, ox_frame_l, ox_frame_r, ox_clamp_1, ox_clamp_2])
    # Twin lathe-turned high-pressure O2 tanks + brass regulator valves + dial gauges
    tank_prof = [
        (0.125, 0.08, 'sharp'), (0.148, 0.14), (0.148, 1.06),
        (0.115, 1.18), (0.042, 1.24), (0.036, 1.30, 'sharp')
    ]
    for ti, tx_o in enumerate((-0.20, 0.20)):
        t_obj = create_lathe_profile(tank_prof, segments=32, name=f"ox_tk_{ti}",
                                     material=mat_hull_white, location=(tx_o, 0, 0))
        stripe = create_cylinder(f"ox_st_{ti}", (tx_o, 0, 0.72), 0.150, 0.14, mat_ochre_accent, bevel=0.0)
        valve = create_cylinder(f"ox_vl_{ti}", (tx_o, 0, 1.33), 0.028, 0.06, mat_gold())
        wheel = create_torus(f"ox_wh_{ti}", (tx_o, 0, 1.38), 0.044, 0.008, mat_velvet_red())
        gauge = create_cylinder(f"ox_gg_{ti}", (tx_o, -0.055, 1.33), 0.026, 0.018, mat_chrome(),
                                rotation=(math.radians(90), 0, 0))
        ox_parts.extend([t_obj, stripe, valve, wheel, gauge])
    manifold = create_curved_tube(
        "ox_mf", [(-0.20, 0.02, 1.33), (-0.10, 0.08, 1.38), (0.10, 0.08, 1.38), (0.20, 0.02, 1.33)],
        radius=0.012, material=mat_chrome()
    )
    ox_parts.append(manifold)
    o2_tank = join_as_named_object(ox_parts, "Oxygen_Tank")
    place_on_surface(o2_tank, -5.55, -0.55, 0.0)

    # 5. Robotic_Arm (Articulated 6-DOF Orbital Manipulator Arm with 3-Finger Grapple Claw at X=4.45, Y=3.25, Z=0.0)
    ra_parts = []
    ra_turret = create_lathe_profile([
        (0.42, 0.000, 'sharp'), (0.40, 0.06), (0.28, 0.14), (0.26, 0.28, 'sharp')
    ], segments=32, name="ra_tr", material=mat_dark_steel())
    ra_shoulder = create_cylinder("ra_sh", (0, 0, 0.34), 0.14, 0.28, mat_ochre_accent, rotation=(0, math.radians(90), 0))
    # Lower Boom angled upward & forward
    ra_boom1 = create_box("ra_b1", (0, -0.22, 0.82), (0.16, 0.16, 1.02), mat_hull_white,
                          rotation=(math.radians(24), 0, 0), bevel=0.018)
    ra_piston = create_cylinder("ra_ps", (0, -0.05, 0.68), 0.036, 0.62, mat_chrome(),
                                rotation=(math.radians(14), 0, 0))
    # Servo Elbow Drum + Forearm Boom + Hydraulic Cable Conduit
    ra_elbow = create_cylinder("ra_el", (0, -0.44, 1.28), 0.12, 0.24, mat_ochre_accent, rotation=(0, math.radians(90), 0))
    ra_boom2 = create_box("ra_b2", (-0.28, -0.68, 1.52), (0.13, 0.82, 0.13), mat_hull_white,
                          rotation=(math.radians(-22), 0, math.radians(28)), bevel=0.015)
    ra_cable = create_curved_tube(
        "ra_cb", [(0.10, -0.08, 0.38), (0.12, -0.42, 1.28), (-0.36, -0.84, 1.62)],
        radius=0.015, material=mat_dark_steel()
    )
    # Wrist Gimbal & 3-Finger Precision Grapple Claw
    wx_c, wy_c, wz_c = -0.48, -0.96, 1.66
    ra_wrist = create_cylinder("ra_wr", (wx_c, wy_c, wz_c), 0.085, 0.10, mat_titanium,
                               rotation=(math.radians(65), 0, math.radians(28)))
    ra_parts.extend([ra_turret, ra_shoulder, ra_boom1, ra_piston, ra_elbow, ra_boom2, ra_cable, ra_wrist])
    for fi in range(3):
        fa = (2.0 * math.pi * fi) / 3.0
        fx_o = 0.075 * math.cos(fa)
        fz_o = 0.075 * math.sin(fa)
        finger = create_curved_tube(
            f"ra_fg_{fi}",
            [(wx_c + fx_o, wy_c - 0.04, wz_c + fz_o),
             (wx_c + fx_o * 1.45, wy_c - 0.15, wz_c + fz_o * 1.45),
             (wx_c + fx_o * 0.45, wy_c - 0.26, wz_c + fz_o * 0.45)],
            radius=0.014, material=mat_chrome()
        )
        ra_parts.append(finger)
    robo_arm = join_as_named_object(ra_parts, "Robotic_Arm")
    place_on_surface(robo_arm, 4.45, 3.25, 0.0)

    # 6. Space_Telescope (Gold-Foil MLI Deep-Space Observatory Telescope on Gimbal Tripod at X=4.25, Y=-1.15, Z=0.0)
    st_parts = []
    # Damped 3-Leg Titanium Tripod + Azimuth Mount
    st_hub = create_cylinder("st_hb", (0, 0, 0.82), 0.13, 0.12, mat_dark_steel())
    st_yoke_b = create_box("st_yb", (0, 0, 0.92), (0.50, 0.14, 0.06), mat_titanium, bevel=0.008)
    st_yoke_l = create_box("st_yl", (-0.23, 0, 1.12), (0.06, 0.14, 0.38), mat_titanium, bevel=0.008)
    st_yoke_r = create_box("st_yr", (0.23, 0, 1.12), (0.06, 0.14, 0.38), mat_titanium, bevel=0.008)
    st_parts.extend([st_hub, st_yoke_b, st_yoke_l, st_yoke_r])
    for li in range(3):
        la = (2.0 * math.pi * li) / 3.0 + 0.52
        leg = create_curved_tube(
            f"st_lg_{li}",
            [(0.10 * math.cos(la), 0.10 * math.sin(la), 0.80),
             (0.52 * math.cos(la), 0.52 * math.sin(la), 0.02)],
            radius=0.024, material=mat_dark_steel()
        )
        pad = create_cylinder(f"st_pd_{li}", (0.52 * math.cos(la), 0.52 * math.sin(la), 0.015), 0.055, 0.03, mat_titanium)
        st_parts.extend([leg, pad])
    # Multi-Stage Lathe Optical Tube aimed upward toward North-East cosmos!
    tel_rot = (math.radians(-56), 0, math.radians(-22))
    ota = create_lathe_profile([
        (0.165, -0.45, 'sharp'), (0.185, -0.40), (0.185, -0.05, 'sharp'),
        (0.195, 0.00), (0.195, 0.55), (0.215, 0.60, 'sharp'),
        (0.215, 0.65, 'sharp'), (0.185, 0.65, 'sharp'),
        (0.180, 0.12), (0.000, 0.12, 'sharp')
    ], segments=32, name="st_ota", material=mat_hull_white,
        location=(0, 0, 1.24), rotation=tel_rot, cap_ends=False)
    mli_rear = create_cylinder("st_ml", (0, 0, 1.24), 0.190, 0.34, mat_gold(), rotation=tel_rot)
    lens_mirror = create_cylinder("st_mr", (0, 0, 1.24), 0.176, 0.04,
                                  get_material("Primary_Optic_Mirror", (0.20, 0.56, 0.86, 1.0), metallic=0.95, roughness=0.04),
                                  rotation=tel_rot)
    finder = create_cylinder("st_fn", (0.21, 0.05, 1.32), 0.032, 0.42, mat_dark_steel(), rotation=tel_rot)
    st_parts.extend([ota, mli_rear, lens_mirror, finder])
    telescope = join_as_named_object(st_parts, "Space_Telescope")
    place_on_surface(telescope, 4.25, -1.15, 0.0)

    # 7. Hydroponic_Pod (Cylindrical Glass Bio-Dome with 3 Botanical Tiers & Soft Grow Column at X=-3.45, Y=-3.05, Z=0.0)
    hp_parts = []
    # Lathe-turned Titanium Nutrient Reservoir Base & Upper Ventilation Dome
    hp_base = create_lathe_profile([
        (0.56, 0.000, 'sharp'), (0.58, 0.08), (0.50, 0.24), (0.54, 0.32, 'sharp')
    ], segments=36, name="hp_bs", material=mat_titanium)
    hp_cap = create_lathe_profile([
        (0.54, 1.72, 'sharp'), (0.56, 1.80), (0.42, 1.94), (0.18, 2.02), (0.00, 2.04)
    ], segments=36, name="hp_cp", material=mat_hull_white)
    # 360-degree Curved Glass Bio-Chamber + Soft Studio Grow-Light Core (zero harsh neon)
    hp_glass = create_cylinder("hp_gl", (0, 0, 1.02), 0.51, 1.40, mat_glass(), vertices=36, bevel=0.0)
    hp_core = create_cylinder("hp_cr", (0, 0, 1.02), 0.048, 1.38,
                              mat_screen((0.68, 0.56, 0.88, 1.0), 1.4, "Botanical_Grow_Core"), vertices=20)
    hp_parts.extend([hp_base, hp_cap, hp_glass, hp_core])
    # 4 External Titanium Structural Struts
    for si in range(4):
        sa = math.radians(45 + si * 90)
        strut = create_box(f"hp_st_{si}", (0.53 * math.cos(sa), 0.53 * math.sin(sa), 1.02),
                           (0.045, 0.045, 1.44), mat_dark_steel(), rotation=(0, 0, sa), bevel=0.006)
        hp_parts.append(strut)
    # 3 Circular Hydroponic Trays with Lush Leafy Greens inside the Glass Pod!
    mat_hydro_leaf = get_material("Hydroponic_Basil_Green", (0.20, 0.54, 0.24, 1.0), roughness=0.58)
    for ti, tz in enumerate((0.54, 0.98, 1.40)):
        tray = create_torus(f"hp_tr_{ti}", (0, 0, tz), 0.30, 0.08, mat_steel(), major_segments=28, minor_segments=12)
        hp_parts.append(tray)
        for pi in range(8):
            pa = (2.0 * math.pi * pi) / 8.0 + ti * 0.4
            plant = create_soft_cushion(
                (0.13, 0.11, 0.09), bevel_width=0.02, subdiv=2, name=f"hp_pl_{ti}_{pi}",
                location=(0.30 * math.cos(pa), 0.30 * math.sin(pa), tz + 0.075),
                rotation=(0, 0, pa), material=mat_hydro_leaf, puff=0.22
            )
            hp_parts.append(plant)
    hydro_pod = join_as_named_object(hp_parts, "Hydroponic_Pod")
    place_on_surface(hydro_pod, -3.45, -3.05, 0.0)

    # 8. Airlock_Door (Heavy Octagonal Pressure Bulkhead Hatch + Porthole + 4-Spoke Handwheel on West Wall X=-6.64, Y=3.05, Z=0.0)
    ad_parts = []
    # Genuine 8-sided Octagonal Bulkhead Frame & Recessed Octagonal Hatch Door facing +X!
    oct_rot = (math.radians(22.5), math.radians(90), 0)
    ad_frame = create_cylinder("ad_fr", (0, 0, 1.26), 1.18, 0.26, mat_dark_steel(),
                               vertices=8, bevel=0.018, rotation=oct_rot)
    ad_door = create_cylinder("ad_dr", (0.08, 0, 1.26), 0.98, 0.16, mat_hull_white,
                              vertices=8, bevel=0.016, rotation=oct_rot)
    ad_threshold = create_box("ad_th", (0.06, 0, 0.07), (0.38, 1.85, 0.14), mat_titanium, bevel=0.012)
    # Circular Quartz Porthole Window + Amber Status Beacon above
    ad_port_rim = create_torus("ad_pr", (0.17, 0, 1.54), 0.20, 0.028, mat_titanium, rotation=(0, math.radians(90), 0))
    ad_port_gl = create_cylinder("ad_pg", (0.16, 0, 1.54), 0.19, 0.02,
                                 mat_tinted_glass("Airlock_Quartz", (0.16, 0.38, 0.56), 0.65),
                                 rotation=(0, math.radians(90), 0))
    ad_beacon = create_box("ad_bc", (0.16, 0, 2.32), (0.04, 0.38, 0.08),
                           mat_screen((0.92, 0.62, 0.18, 1.0), 1.5, "Airlock_Status"), bevel=0.005)
    # Central Spindle & 4-Spoke Chrome Pressure Handwheel + 4 Perimeter Locking Dogs
    ad_spindle = create_cylinder("ad_sp", (0.21, 0, 1.02), 0.042, 0.14, mat_dark_steel(), rotation=(0, math.radians(90), 0))
    ad_wheel = create_torus("ad_wh", (0.27, 0, 1.02), 0.18, 0.020, mat_chrome(), rotation=(0, math.radians(90), 0))
    ad_parts.extend([ad_frame, ad_door, ad_threshold, ad_port_rim, ad_port_gl, ad_beacon, ad_spindle, ad_wheel])
    for sa in (0, 45, 90, 135):
        if sa in (0, 90):
            spoke = create_cylinder(f"ad_wk_{sa}", (0.27, 0, 1.02), 0.012, 0.35, mat_chrome(),
                                    rotation=(math.radians(sa), 0, 0))
            ad_parts.append(spoke)
    for da in (45, 135, 225, 315):
        rad = math.radians(da)
        dog = create_box(f"ad_dg_{da}", (0.16, 0.94 * math.cos(rad), 1.26 + 0.94 * math.sin(rad)),
                         (0.08, 0.18, 0.09), mat_ochre_accent, rotation=(math.radians(-da), 0, 0), bevel=0.008)
        ad_parts.append(dog)
    airlock = join_as_named_object(ad_parts, "Airlock_Door")
    place_on_surface(airlock, -6.64, 3.05, 0.0)

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
    print("=== ALL 7 STUDIO ISOMETRIC WORLDS BUILT & EXPORTED SUCCESSFULLY! ===")
