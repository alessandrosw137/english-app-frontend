import bpy
import math
import os
import sys

script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)

from core import (
    reset_scene, get_material, create_box, create_cylinder, create_sphere,
    create_torus, create_lathe_profile, create_soft_cushion, create_curved_tube,
    join_as_named_object, export_glb, place_on_surface,
    mat_chrome, mat_steel, mat_dark_steel, mat_gold, mat_glass,
    mat_porcelain, mat_dark_walnut, mat_screen
)

OUTPUT_HEDBANZ_DIR = os.path.abspath(os.path.join(script_dir, "..", "..", "assets", "models", "hedbanz"))


def build_hedbanz():
    reset_scene()
    print("Building Hedbanz 3D: Studio Party Game Pack (Lathe Hourglass & Sculpted Headband)...")

    # Harmonious Studio PBR Materials
    mat_band_poly = get_material("Headband_Royal_Blue", base_color=(0.14, 0.38, 0.78, 1.0),
                                 roughness=0.28, coat_weight=0.35)
    mat_pad_foam = get_material("Forehead_Comfort_Foam", base_color=(0.15, 0.16, 0.19, 1.0), roughness=0.82)
    mat_card_gold = mat_gold()
    mat_card_face = mat_porcelain()
    mat_card_navy = get_material("Card_Border_Navy", base_color=(0.12, 0.22, 0.42, 1.0), roughness=0.36)
    mat_qmark_glow = mat_screen((0.18, 0.72, 0.92, 1.0), 1.8, "QMark_Studio_Glow")
    mat_sand_gold = get_material("Hourglass_Fine_Sand", base_color=(0.88, 0.74, 0.38, 1.0), roughness=0.78)

    # 1. Avatar_Headband_Pro (Ergonomic oval headband, plush forehead cushion & spring card clip)
    hb_ring = create_torus("hb_rg", (0, 0, 0.55), 0.26, 0.022, mat_band_poly,
                           major_segments=48, minor_segments=18, scale=(0.94, 1.06, 1.0))
    hb_pad = create_soft_cushion((0.15, 0.024, 0.058), bevel_width=0.008, subdiv=2, name="hb_pd",
                                 location=(0, 0.252, 0.55), material=mat_pad_foam, puff=0.15)
    hb_dock = create_box("hb_dk", (0, 0.282, 0.555), (0.105, 0.032, 0.082), mat_dark_steel(), bevel=0.007)
    hb_clip = create_curved_tube(
        "hb_cl",
        [(-0.048, 0.298, 0.535), (-0.042, 0.304, 0.605), (0.0, 0.306, 0.615),
         (0.042, 0.304, 0.605), (0.048, 0.298, 0.535)],
        radius=0.006, material=mat_chrome()
    )
    hb_badge = create_cylinder("hb_bg", (0, 0.302, 0.555), 0.018, 0.008, mat_card_gold,
                               rotation=(math.radians(90), 0, 0))
    join_as_named_object([hb_ring, hb_pad, hb_dock, hb_clip, hb_badge], "Avatar_Headband_Pro")

    # 2. Mystery_Card_3D (Multi-layer beveled gold-trimmed card with sculpted 3D "?" emblem)
    mc_frame = create_box("mc_fr", (0, 0.30, 0.79), (0.285, 0.014, 0.405), mat_card_gold, bevel=0.010)
    mc_inlay_f = create_box("mc_if", (0, 0.307, 0.79), (0.258, 0.003, 0.378), mat_card_navy, bevel=0.004)
    mc_face_f = create_box("mc_ff", (0, 0.309, 0.79), (0.236, 0.003, 0.356), mat_card_face, bevel=0.003)
    mc_face_b = create_box("mc_fb", (0, 0.292, 0.79), (0.252, 0.003, 0.372), mat_card_face, bevel=0.003)

    # Sculpted 3D Question Mark ("?") via swept curve + sphere dot
    qm_curve = create_curved_tube(
        "qm_cv",
        [(-0.045, 0.315, 0.845), (-0.032, 0.315, 0.892), (0.015, 0.315, 0.900),
         (0.048, 0.315, 0.870), (0.036, 0.315, 0.825), (0.002, 0.315, 0.795),
         (0.000, 0.315, 0.748)],
        radius=0.014, material=mat_qmark_glow
    )
    qm_dot = create_sphere("qm_dt", (0.0, 0.315, 0.695), 0.018, mat_qmark_glow)
    join_as_named_object([mc_frame, mc_inlay_f, mc_face_f, mc_face_b, qm_curve, qm_dot], "Mystery_Card_3D")

    # 3. Game_Timer_Hourglass (Lathe-turned walnut caps, 3 turned brass balusters & continuous double-bulb crystal glass)
    hg_parts = []
    cx_h, cy_h = 0.60, 0.0
    # Lathe-turned molded walnut bottom & top plinths
    hg_base = create_lathe_profile([
        (0.150, 0.000, 'sharp'), (0.152, 0.016), (0.136, 0.030),
        (0.142, 0.044, 'sharp'), (0.118, 0.052, 'sharp')
    ], segments=36, name="hg_bs", material=mat_dark_walnut(), location=(cx_h, cy_h, 0.0))
    hg_top = create_lathe_profile([
        (0.118, 0.428, 'sharp'), (0.142, 0.436, 'sharp'), (0.136, 0.450),
        (0.152, 0.464), (0.150, 0.480, 'sharp')
    ], segments=36, name="hg_tp", material=mat_dark_walnut(), location=(cx_h, cy_h, 0.0))
    hg_ring_b = create_torus("hg_rb", (cx_h, cy_h, 0.050), 0.118, 0.007, mat_card_gold)
    hg_ring_t = create_torus("hg_rt", (cx_h, cy_h, 0.430), 0.118, 0.007, mat_card_gold)
    hg_parts.extend([hg_base, hg_top, hg_ring_b, hg_ring_t])

    # 3 Lathe-turned brass balusters around the crystal bulbs
    baluster_prof = [
        (0.015, 0.050, 'sharp'), (0.011, 0.095), (0.018, 0.165),
        (0.011, 0.240), (0.018, 0.315), (0.011, 0.385), (0.015, 0.430, 'sharp')
    ]
    for bi, ang in enumerate((0.0, 2.0 * math.pi / 3.0, 4.0 * math.pi / 3.0)):
        bx = cx_h + 0.112 * math.cos(ang)
        by = cy_h + 0.112 * math.sin(ang)
        bal = create_lathe_profile(baluster_prof, segments=20, name=f"hg_bl_{bi}",
                                   material=mat_card_gold, location=(bx, by, 0.0))
        finial = create_sphere(f"hg_fn_{bi}", (bx, by, 0.490), 0.014, mat_card_gold)
        hg_parts.extend([bal, finial])

    # Seamless continuous double-bulb crystal glass hourglass via create_lathe_profile!
    glass_bulb_prof = [
        (0.000, 0.054, 'sharp'), (0.068, 0.058), (0.088, 0.125),
        (0.068, 0.192), (0.014, 0.232), (0.011, 0.240),
        (0.014, 0.248), (0.068, 0.288), (0.088, 0.355),
        (0.068, 0.422), (0.000, 0.426, 'sharp')
    ]
    hg_glass = create_lathe_profile(glass_bulb_prof, segments=36, name="hg_gl",
                                    material=mat_glass(), location=(cx_h, cy_h, 0.0), smooth_steps=1)

    # Lathe-turned golden sand dune at bottom + draining funnel cone at top + fine falling stream
    sand_bot = create_lathe_profile([
        (0.000, 0.058, 'sharp'), (0.064, 0.062), (0.078, 0.105),
        (0.042, 0.135), (0.008, 0.158), (0.000, 0.162)
    ], segments=28, name="hg_sb", material=mat_sand_gold, location=(cx_h, cy_h, 0.0))
    sand_top = create_lathe_profile([
        (0.005, 0.246, 'sharp'), (0.046, 0.285), (0.068, 0.322, 'sharp'),
        (0.025, 0.312), (0.000, 0.306, 'sharp')
    ], segments=28, name="hg_st", material=mat_sand_gold, location=(cx_h, cy_h, 0.0), cap_ends=False)
    sand_stream = create_cylinder("hg_sm", (cx_h, cy_h, 0.202), 0.0035, 0.095, mat_sand_gold)

    hg_parts.extend([hg_glass, sand_bot, sand_top, sand_stream])
    hourglass = join_as_named_object(hg_parts, "Game_Timer_Hourglass")
    place_on_surface(hourglass, cx_h, cy_h, 0.0)

    export_glb(os.path.join(OUTPUT_HEDBANZ_DIR, "hedbanz_pack.glb"))
    print("HEDBANZ 3D PACK BUILT AND EXPORTED SUCCESSFULLY!")


if __name__ == "__main__":
    build_hedbanz()
