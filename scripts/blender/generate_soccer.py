import bpy
import math
import os
import sys

script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)

from core import (
    reset_scene, get_material, create_box, create_cylinder, create_cone,
    create_sphere, create_torus, create_lathe_profile, create_soft_cushion,
    create_curved_tube, join_as_named_object, export_glb, place_on_surface,
    mat_chrome, mat_steel, mat_dark_steel, mat_gold, mat_porcelain, mat_screen
)

OUTPUT_SOCCER_DIR = os.path.abspath(os.path.join(script_dir, "..", "..", "assets", "models", "soccer"))


def build_stylized_player(name, x, y, jersey_mat, shorts_mat, socks_mat, dorsal="10", is_gk=False):
    """Builds an athletic sculpted 3D footballer with subdivided jersey/shorts, lathe legs & contoured cleats."""
    mat_skin = get_material("Athlete_Skin_Tone", base_color=(0.82, 0.63, 0.48, 1.0), roughness=0.52)
    mat_hair = get_material("Athlete_Hair_Espresso", base_color=(0.11, 0.08, 0.06, 1.0), roughness=0.76)
    mat_boots = get_material("Pro_Cleat_Obsidian", base_color=(0.10, 0.11, 0.13, 1.0), roughness=0.28, coat_weight=0.35)
    mat_studs = mat_gold()
    mat_white = mat_porcelain()
    mat_gloves = get_material("GK_Pro_Latex_Gold", base_color=(0.88, 0.74, 0.22, 1.0), roughness=0.38)

    parts = []

    # 1. Sculpted Athletic Torso & Collar (using create_soft_cushion for organic jersey drape)
    torso = create_soft_cushion((0.43, 0.24, 0.52), bevel_width=0.045, subdiv=2,
                                name=f"{name}_tor", location=(x, y, 1.25),
                                material=jersey_mat, puff=0.14)
    collar = create_torus(f"{name}_col", (x, y, 1.51), 0.088, 0.016, mat_white, scale=(1.05, 0.92, 1.0))
    crest = create_cylinder(f"{name}_crs", (x - 0.10, y - 0.132, 1.38), 0.028, 0.008, mat_gold(),
                            rotation=(math.radians(90), 0, 0))
    dorsal_plate = create_box(f"{name}_dor", (x, y + 0.134, 1.30), (0.15, 0.010, 0.19), mat_white, bevel=0.003)
    parts.extend([torso, collar, crest, dorsal_plate])

    # 2. Neck, Sculpted Head, Modern Haircut & Ears
    neck = create_cylinder(f"{name}_nk", (x, y, 1.56), 0.060, 0.12, mat_skin)
    head = create_sphere(f"{name}_hd", (x, y, 1.72), 0.142, mat_skin, scale=(0.94, 1.04, 1.14))
    hair_crown = create_soft_cushion((0.27, 0.29, 0.14), bevel_width=0.035, subdiv=2,
                                     name=f"{name}_hrc", location=(x, y + 0.01, 1.81),
                                     material=mat_hair, puff=0.22)
    ear_l = create_sphere(f"{name}_el", (x - 0.136, y, 1.72), 0.024, mat_skin, scale=(0.65, 0.9, 1.15))
    ear_r = create_sphere(f"{name}_er", (x + 0.136, y, 1.72), 0.024, mat_skin, scale=(0.65, 0.9, 1.15))
    parts.extend([neck, head, hair_crown, ear_l, ear_r])

    # 3. Sleeves, Tapered Forearms & Hands / GK Gloves
    for side, sx_s in (("l", -1.0), ("r", 1.0)):
        ax = x + sx_s * 0.285
        sleeve = create_cone(f"{name}_sl_{side}", (ax, y, 1.38), 0.062, 0.072, 0.22, jersey_mat,
                             rotation=(0, math.radians(sx_s * -8), 0))
        fore = create_cone(f"{name}_fr_{side}", (ax + sx_s * 0.02, y - 0.01, 1.10), 0.044, 0.056, 0.34, mat_skin,
                           rotation=(math.radians(6), math.radians(sx_s * -5), 0))
        h_mat = mat_gloves if is_gk else mat_skin
        h_size = (0.10, 0.12, 0.13) if is_gk else (0.075, 0.085, 0.095)
        hand = create_soft_cushion(h_size, bevel_width=0.02, subdiv=2, name=f"{name}_hn_{side}",
                                   location=(ax + sx_s * 0.03, y - 0.02, 0.90), material=h_mat, puff=0.16)
        parts.extend([sleeve, fore, hand])

    # 4. Athletic Shorts with Piped Side Stripes
    shorts = create_soft_cushion((0.40, 0.23, 0.25), bevel_width=0.035, subdiv=2,
                                 name=f"{name}_sh", location=(x, y, 0.90),
                                 material=shorts_mat, puff=0.12)
    leg_cuff_l = create_cylinder(f"{name}_scl", (x - 0.125, y, 0.77), 0.086, 0.08, shorts_mat)
    leg_cuff_r = create_cylinder(f"{name}_scr", (x + 0.125, y, 0.77), 0.086, 0.08, shorts_mat)
    s_trim_l = create_box(f"{name}_stl", (x - 0.205, y, 0.90), (0.012, 0.16, 0.22), mat_white, bevel=0.003)
    s_trim_r = create_box(f"{name}_str", (x + 0.205, y, 0.90), (0.012, 0.16, 0.22), mat_white, bevel=0.003)
    parts.extend([shorts, leg_cuff_l, leg_cuff_r, s_trim_l, s_trim_r])

    # 5. Lathe-Turned Muscular Legs / Knee-High Socks & Contoured Cleats with Studs
    leg_prof = [
        (0.052, 0.09, 'sharp'), (0.050, 0.18), (0.068, 0.36),
        (0.062, 0.50), (0.072, 0.62), (0.075, 0.74, 'sharp')
    ]
    for side, lx_o in (("l", -0.125), ("r", 0.125)):
        lx = x + lx_o
        leg_mesh = create_lathe_profile(leg_prof, segments=24, name=f"{name}_lg_{side}",
                                        material=socks_mat, location=(lx, y, 0.0))
        sock_band = create_torus(f"{name}_sb_{side}", (lx, y, 0.56), 0.064, 0.007, mat_white)
        boot = create_soft_cushion((0.098, 0.235, 0.082), bevel_width=0.022, subdiv=2,
                                   name=f"{name}_bt_{side}", location=(lx, y - 0.045, 0.052),
                                   material=mat_boots, puff=0.12, crown_arch=0.012)
        parts.extend([leg_mesh, sock_band, boot])
        for sx in (-0.028, 0.028):
            for sy in (-0.10, -0.04, 0.03):
                stud = create_cone(f"{name}_std_{side}_{sx}_{sy}", (lx + sx, y + sy, 0.009),
                                   0.007, 0.010, 0.018, mat_studs)
                parts.append(stud)

    player = join_as_named_object(parts, name)
    place_on_surface(player, x, y, 0.0)
    return player


def build_soccer():
    reset_scene()
    print("Building MasterGoal 3D: Tactical Stadium & Sculpted Athletes Pack...")

    # Harmonious Studio Stadium Materials (zero harsh neon)
    mat_grass_dark = get_material("Pitch_Turf_Emerald", base_color=(0.11, 0.40, 0.14, 1.0), roughness=0.84)
    mat_grass_light = get_material("Pitch_Turf_Mowed", base_color=(0.16, 0.49, 0.19, 1.0), roughness=0.84)
    mat_surround = get_material("Stadium_Track_Slate", base_color=(0.17, 0.19, 0.22, 1.0), roughness=0.65)
    mat_line = get_material("Pitch_Chalk_White", base_color=(0.96, 0.96, 0.95, 1.0), roughness=0.46)
    mat_post = get_material("Goalpost_Powder_White", base_color=(0.96, 0.97, 0.98, 1.0), metallic=0.30, roughness=0.20)
    mat_net = get_material("Goal_Net_Translucent", base_color=(0.92, 0.94, 0.96, 0.46), roughness=0.75, alpha=0.46)
    mat_flag_cloth = get_material("Corner_Pennant_Crimson", base_color=(0.82, 0.18, 0.16, 1.0), roughness=0.52)

    # 1. Soccer_Stadium_Pitch (Mowed turf stripes, true 8cm chalk lines including penalty boxes, goals & floodlights)
    pitch_parts = []
    sub_surround = create_box("pt_sur", (0, 0, -0.065), (17.2, 23.4, 0.09), mat_surround, bevel=0.01)
    pitch_parts.append(sub_surround)

    stripe_w = 2.0
    for i in range(-5, 6):
        mat_stripe = mat_grass_light if i % 2 == 0 else mat_grass_dark
        s = create_box(f"pt_st_{i}", (0, i * stripe_w, -0.015), (15.0, stripe_w - 0.004, 0.03), mat_stripe, bevel=0.003)
        pitch_parts.append(s)

    # Crisp 8cm Boundary & Infield Chalk Lines (Z top = 0.012m)
    lw = 0.08
    lz, lh = 0.006, 0.012
    pitch_parts.extend([
        create_box("pt_lt", (0, 10.0, lz), (14.08, lw, lh), mat_line, bevel=0.002),
        create_box("pt_lb", (0, -10.0, lz), (14.08, lw, lh), mat_line, bevel=0.002),
        create_box("pt_ll", (-7.0, 0, lz), (lw, 20.08, lh), mat_line, bevel=0.002),
        create_box("pt_lr", (7.0, 0, lz), (lw, 20.08, lh), mat_line, bevel=0.002),
        create_box("pt_lm", (0, 0, lz), (14.0, lw, lh), mat_line, bevel=0.002),
        create_torus("pt_cm", (0, 0, lz), 2.0, 0.038, mat_line, major_segments=48, minor_segments=12),
        create_cylinder("pt_sm", (0, 0, lz), 0.11, lh, mat_line),
    ])

    # Authentic Hollow 18-Yard Penalty Area & 6-Yard Goal Box Chalk Lines (showing green turf inside!)
    for side_s, sgn in (("h", -1.0), ("a", 1.0)):
        gy = sgn * 10.0
        py_edge = sgn * 6.4
        py_mid = (gy + py_edge) * 0.5
        # 18-yard box lines (width 6.6m, depth 3.6m)
        pitch_parts.extend([
            create_box(f"pb_f_{side_s}", (0, py_edge, lz), (6.68, lw, lh), mat_line, bevel=0.002),
            create_box(f"pb_l_{side_s}", (-3.30, py_mid, lz), (lw, 3.60, lh), mat_line, bevel=0.002),
            create_box(f"pb_r_{side_s}", (3.30, py_mid, lz), (lw, 3.60, lh), mat_line, bevel=0.002),
            create_cylinder(f"pb_sp_{side_s}", (0, sgn * 7.4, lz), 0.09, lh, mat_line),
        ])
        # 6-yard goal area lines (width 3.2m, depth 1.2m)
        sy_edge = sgn * 8.8
        sy_mid = (gy + sy_edge) * 0.5
        pitch_parts.extend([
            create_box(f"gb_f_{side_s}", (0, sy_edge, lz), (3.28, lw, lh), mat_line, bevel=0.002),
            create_box(f"gb_l_{side_s}", (-1.60, sy_mid, lz), (lw, 1.20, lh), mat_line, bevel=0.002),
            create_box(f"gb_r_{side_s}", (1.60, sy_mid, lz), (lw, 1.20, lh), mat_line, bevel=0.002),
        ])

    # Pro Tubular Goalposts with Curved Rear Net Stanchions & Translucent Netting
    for side_s, sgn in (("h", -1.0), ("a", 1.0)):
        gy = sgn * 10.0
        ny_back = sgn * 11.05
        pl = create_cylinder(f"gl_pl_{side_s}", (-2.0, gy, 1.05), 0.055, 2.10, mat_post)
        pr = create_cylinder(f"gl_pr_{side_s}", (2.0, gy, 1.05), 0.055, 2.10, mat_post)
        bar = create_cylinder(f"gl_br_{side_s}", (0, gy, 2.10), 0.055, 4.10, mat_post, rotation=(0, math.radians(90), 0))
        st_l = create_curved_tube(
            f"gl_sl_{side_s}", [(-2.0, gy, 2.08), (-2.0, ny_back, 1.95), (-2.0, ny_back, 0.02)],
            radius=0.032, material=mat_steel()
        )
        st_r = create_curved_tube(
            f"gl_sr_{side_s}", [(2.0, gy, 2.08), (2.0, ny_back, 1.95), (2.0, ny_back, 0.02)],
            radius=0.032, material=mat_steel()
        )
        net_b = create_box(f"gl_nb_{side_s}", (0, ny_back, 1.02), (3.96, 0.02, 2.00), mat_net, bevel=0.0)
        net_t = create_box(f"gl_nt_{side_s}", (0, (gy + ny_back) * 0.5, 2.03), (3.96, 1.04, 0.02), mat_net, bevel=0.0)
        net_l = create_box(f"gl_nl_{side_s}", (-1.99, (gy + ny_back) * 0.5, 1.02), (0.02, 1.04, 2.00), mat_net, bevel=0.0)
        net_r = create_box(f"gl_nr_{side_s}", (1.99, (gy + ny_back) * 0.5, 1.02), (0.02, 1.04, 2.00), mat_net, bevel=0.0)
        pitch_parts.extend([pl, pr, bar, st_l, st_r, net_b, net_t, net_l, net_r])

    # 4 Corner Flags & 4 Angled Stadium Floodlight Towers
    for f_idx, (fx, fy) in enumerate(((-7.0, -10.0), (7.0, -10.0), (-7.0, 10.0), (7.0, 10.0))):
        fp = create_cylinder(f"cf_p_{f_idx}", (fx, fy, 0.52), 0.016, 1.04, mat_line)
        fc = create_soft_cushion((0.26, 0.012, 0.17), bevel_width=0.004, subdiv=1, name=f"cf_c_{f_idx}",
                                 location=(fx + (0.14 if fx > 0 else -0.14), fy, 0.92),
                                 material=mat_flag_cloth, puff=0.10)
        pitch_parts.extend([fp, fc])

    mat_flood_led = mat_screen((0.96, 0.95, 0.90, 1.0), 2.0, "Stadium_Floodlight_Warm")
    for fl_idx, (lx, ly) in enumerate(((-8.1, -11.1), (8.1, -11.1), (-8.1, 11.1), (8.1, 11.1))):
        base_f = create_cylinder(f"fl_bs_{fl_idx}", (lx, ly, 0.15), 0.24, 0.30, mat_dark_steel(), vertices=8)
        mast = create_cone(f"fl_m_{fl_idx}", (lx, ly, 3.15), 0.13, 0.075, 5.80, mat_steel())
        bank = create_box(f"fl_bk_{fl_idx}", (lx, ly, 6.15), (0.96, 0.32, 0.62), mat_dark_steel(),
                          rotation=(math.radians(18 if ly > 0 else -18), 0, 0), bevel=0.012)
        lamp = create_box(f"fl_lp_{fl_idx}", (lx, ly + (0.15 if ly < 0 else -0.15), 6.12),
                          (0.86, 0.04, 0.52), mat_flood_led,
                          rotation=(math.radians(18 if ly > 0 else -18), 0, 0), bevel=0.004)
        pitch_parts.extend([base_f, mast, bank, lamp])

    join_as_named_object(pitch_parts, "Soccer_Stadium_Pitch")

    # 2. Soccer_Ball_Pro (High-detail multi-panel tournament match ball at Z=0.0..0.48m)
    mat_b_white = get_material("MatchBall_Pearl_White", base_color=(0.97, 0.97, 0.96, 1.0), roughness=0.18, coat_weight=0.45)
    mat_b_obsidian = get_material("MatchBall_Obsidian_Panel", base_color=(0.10, 0.12, 0.15, 1.0), roughness=0.26)
    mat_b_gold = mat_gold()

    ball_parts = [create_sphere("sb_core", (0, 0, 0.24), 0.238, mat_b_white, segments=36, rings=24)]
    # 12 Icosahedral Pentagon Patches distributed uniformly across the sphere
    phi = (1.0 + math.sqrt(5.0)) * 0.5
    ico_dirs = [
        (0, 1, phi), (0, -1, phi), (0, 1, -phi), (0, -1, -phi),
        (1, phi, 0), (-1, phi, 0), (1, -phi, 0), (-1, -phi, 0),
        (phi, 0, 1), (-phi, 0, 1), (phi, 0, -1), (-phi, 0, -1),
    ]
    for pi, (dx, dy, dz) in enumerate(ico_dirs):
        ln = math.sqrt(dx * dx + dy * dy + dz * dz)
        nx, ny, nz = dx / ln, dy / ln, dz / ln
        p_mat = mat_b_gold if (pi % 3 == 0) else mat_b_obsidian
        patch = create_sphere(f"sb_pt_{pi}", (nx * 0.192, ny * 0.192, 0.24 + nz * 0.192),
                              0.078, p_mat, segments=20, rings=12)
        ball_parts.append(patch)
    ball = join_as_named_object(ball_parts, "Soccer_Ball_Pro")
    place_on_surface(ball, 0.0, 0.0, 0.0)

    # 3. Player_Home (Forward #10 in Royal Blue & Porcelain White Kit)
    mat_home_j = get_material("Kit_Home_Royal_Blue", base_color=(0.10, 0.34, 0.78, 1.0), roughness=0.46)
    mat_home_sh = mat_porcelain()
    build_stylized_player("Player_Home", -1.8, -2.5, mat_home_j, mat_home_sh, mat_home_j, dorsal="10", is_gk=False)

    # 4. Player_Away (Defender #7 in Crimson Bordeaux & Obsidian Kit)
    mat_away_j = get_material("Kit_Away_Crimson", base_color=(0.74, 0.12, 0.16, 1.0), roughness=0.46)
    mat_away_sh = get_material("Kit_Away_Obsidian", base_color=(0.11, 0.12, 0.14, 1.0), roughness=0.48)
    build_stylized_player("Player_Away", 1.8, 2.5, mat_away_j, mat_away_sh, mat_away_j, dorsal="7", is_gk=False)

    # 5. Goalkeeper_Pro (Keeper #1 in Emerald-Gold Studio Kit, zero harsh neon)
    mat_gk_j = get_material("Kit_GK_Emerald_Gold", base_color=(0.18, 0.62, 0.42, 1.0), roughness=0.44)
    mat_gk_sh = get_material("Kit_GK_Obsidian", base_color=(0.11, 0.12, 0.14, 1.0), roughness=0.48)
    build_stylized_player("Goalkeeper_Pro", 0.0, -9.2, mat_gk_j, mat_gk_sh, mat_gk_j, dorsal="1", is_gk=True)

    export_glb(os.path.join(OUTPUT_SOCCER_DIR, "soccer_pack.glb"))
    print("MASTERGOAL 3D PACK BUILT AND EXPORTED SUCCESSFULLY!")


if __name__ == "__main__":
    build_soccer()
