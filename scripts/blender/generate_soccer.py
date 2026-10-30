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
    mat_chrome, mat_steel, mat_gold, mat_screen
)

OUTPUT_SOCCER_DIR = r"C:\Users\alessandro\Desktop\ENGLISH\assets\models\soccer"

def build_stylized_player(name, x, y, jersey_mat, shorts_mat, socks_mat, dorsal="10", is_gk=False):
    mat_skin = get_material("Player_Skin_Tone", base_color=(0.84, 0.65, 0.50, 1.0), roughness=0.55)
    mat_hair = get_material("Player_Hair_Cut", base_color=(0.10, 0.08, 0.06, 1.0), roughness=0.8)
    mat_boots = get_material("Cleat_Black", base_color=(0.08, 0.08, 0.09, 1.0), roughness=0.3)
    mat_studs = mat_gold()
    mat_white = get_material("Trim_White", base_color=(0.98, 0.98, 0.98, 1.0), roughness=0.4)
    mat_gloves = get_material("GK_Gloves_Volt", base_color=(0.15, 0.95, 0.10, 1.0), roughness=0.35)

    parts = []

    # 1. Torso & Athletic V-Neck
    torso = create_box(f"{name}_tor", (x, y, 1.25), (0.44, 0.25, 0.52), jersey_mat, bevel=0.02)
    collar = create_torus(f"{name}_col", (x, y, 1.50), 0.10, 0.015, mat_white)
    # Dorsal in relief on the back
    dorsal_plate = create_box(f"{name}_dor", (x, y + 0.13, 1.30), (0.16, 0.01, 0.20), mat_white)
    parts.extend([torso, collar, dorsal_plate])

    # 2. Neck & Head with modern sculpted haircut & ears
    neck = create_cylinder(f"{name}_nk", (x, y, 1.56), 0.065, 0.12, mat_skin)
    head = create_sphere(f"{name}_hd", (x, y, 1.72), 0.145, mat_skin, scale=(0.95, 1.05, 1.15))
    hair = create_sphere(f"{name}_hr", (x, y - 0.02, 1.78), 0.15, mat_hair, scale=(1.02, 1.06, 0.75))
    ear_l = create_sphere(f"{name}_el", (x - 0.14, y, 1.72), 0.025, mat_skin)
    ear_r = create_sphere(f"{name}_er", (x + 0.14, y, 1.72), 0.025, mat_skin)
    parts.extend([neck, head, hair, ear_l, ear_r])

    # 3. Arms, Elbows, Forearms, Hands/Gloves
    arm_l = create_cylinder(f"{name}_al", (x - 0.30, y, 1.28), 0.055, 0.30, jersey_mat)
    arm_r = create_cylinder(f"{name}_ar", (x + 0.30, y, 1.28), 0.055, 0.30, jersey_mat)
    fore_l = create_cylinder(f"{name}_fl", (x - 0.30, y, 1.02), 0.048, 0.26, mat_skin)
    fore_r = create_cylinder(f"{name}_fr", (x + 0.30, y, 1.02), 0.048, 0.26, mat_skin)
    h_mat = mat_gloves if is_gk else mat_skin
    h_sc = (1.35, 1.35, 1.35) if is_gk else (1.0, 1.0, 1.0)
    hand_l = create_sphere(f"{name}_hl", (x - 0.30, y, 0.86), 0.055, h_mat, scale=h_sc)
    hand_r = create_sphere(f"{name}_hr", (x + 0.30, y, 0.86), 0.055, h_mat, scale=h_sc)
    parts.extend([arm_l, arm_r, fore_l, fore_r, hand_l, hand_r])

    # 4. Athletic Shorts & Side Trim
    shorts = create_box(f"{name}_sh", (x, y, 0.90), (0.42, 0.24, 0.26), shorts_mat, bevel=0.02)
    s_trim_l = create_box(f"{name}_stl", (x - 0.215, y, 0.90), (0.01, 0.245, 0.26), mat_white)
    s_trim_r = create_box(f"{name}_str", (x + 0.215, y, 0.90), (0.01, 0.245, 0.26), mat_white)
    parts.extend([shorts, s_trim_l, s_trim_r])

    # 5. Muscular Legs & Knee-High Socks
    leg_l = create_cylinder(f"{name}_ll", (x - 0.13, y, 0.56), 0.068, 0.52, socks_mat)
    leg_r = create_cylinder(f"{name}_lr", (x + 0.13, y, 0.56), 0.068, 0.52, socks_mat)
    parts.extend([leg_l, leg_r])

    # 6. Cleats / Boots with Molded Studs
    boot_l = create_box(f"{name}_bl", (x - 0.13, y + 0.05, 0.08), (0.095, 0.24, 0.08), mat_boots, bevel=0.015)
    boot_r = create_box(f"{name}_br", (x + 0.13, y + 0.05, 0.08), (0.095, 0.24, 0.08), mat_boots, bevel=0.015)
    for sx in [-0.03, 0.03]:
        for sy in [-0.06, 0.06]:
            st_l = create_cylinder(f"{name}_stl_{sx}_{sy}", (x - 0.13 + sx, y + 0.05 + sy, 0.02), 0.01, 0.025, mat_studs)
            st_r = create_cylinder(f"{name}_str_{sx}_{sy}", (x + 0.13 + sx, y + 0.05 + sy, 0.02), 0.01, 0.025, mat_studs)
            parts.extend([st_l, st_r])
    parts.extend([boot_l, boot_r])

    return join_as_named_object(parts, name)

def build_soccer():
    reset_scene()
    print("Building MasterGoal 3D: Stadium & Players AAA Pack...")

    # Materials
    mat_grass_dark = get_material("Pitch_Grass_Dark", base_color=(0.10, 0.42, 0.12, 1.0), roughness=0.85)
    mat_grass_light = get_material("Pitch_Grass_Light", base_color=(0.15, 0.52, 0.18, 1.0), roughness=0.85)
    mat_line = get_material("Chalk_White_Lines", base_color=(0.98, 0.98, 0.98, 1.0), roughness=0.45)
    mat_post = get_material("Tubular_Goalposts", base_color=(0.98, 0.98, 0.98, 1.0), metallic=0.35, roughness=0.2)
    mat_net = get_material("Net_Mesh_Translucent", base_color=(0.92, 0.94, 0.96, 1.0), roughness=0.8, alpha=0.6)
    mat_flag_cloth = get_material("Flag_Pennant_Red", base_color=(0.95, 0.15, 0.15, 1.0), roughness=0.5)

    # 1. Soccer_Stadium_Pitch (Alternating mowed lawn stripes, relief chalk lines, goals, corner flags, floodlights)
    pitch_parts = []
    
    # Alternating green lawn stripes (Y axis from -11 to +11, 10 stripes)
    stripe_w = 2.2
    for i in range(-5, 6):
        mat_stripe = mat_grass_light if i % 2 == 0 else mat_grass_dark
        s = create_box(f"pt_st_{i}", (0, i * stripe_w, -0.05), (15.0, stripe_w, 0.10), mat_stripe, bevel=0.0)
        pitch_parts.append(s)

    # Boundary & Infield White Chalk Lines
    line_top = create_box("pt_lt", (0, 10.0, 0.015), (14.0, 0.08, 0.03), mat_line)
    line_bot = create_box("pt_lb", (0, -10.0, 0.015), (14.0, 0.08, 0.03), mat_line)
    line_l = create_box("pt_ll", (-7.0, 0, 0.015), (0.08, 20.0, 0.03), mat_line)
    line_r = create_box("pt_lr", (7.0, 0, 0.015), (0.08, 20.0, 0.03), mat_line)
    line_mid = create_box("pt_lm", (0, 0, 0.015), (14.0, 0.08, 0.03), mat_line)
    circle_mid = create_torus("pt_cm", (0, 0, 0.015), 2.0, 0.04, mat_line)
    spot_mid = create_cylinder("pt_sm", (0, 0, 0.015), 0.12, 0.03, mat_line)

    # Penalty Boxes & Penalty Spots
    box_home = create_box("pt_bxh", (0, -8.2, 0.015), (6.5, 3.6, 0.025), mat_line, bevel=0.0)
    box_away = create_box("pt_bxa", (0, 8.2, 0.015), (6.5, 3.6, 0.025), mat_line, bevel=0.0)
    spot_home = create_cylinder("pt_sph", (0, -7.2, 0.015), 0.10, 0.03, mat_line)
    spot_away = create_cylinder("pt_spa", (0, 7.2, 0.015), 0.10, 0.03, mat_line)

    pitch_parts.extend([
        line_top, line_bot, line_l, line_r, line_mid, circle_mid, spot_mid,
        box_home, box_away, spot_home, spot_away
    ])

    # Goalpost Home (Tubular posts, crossbar, net cage)
    gh_pl = create_cylinder("gh_pl", (-2.0, -10.0, 1.05), 0.055, 2.1, mat_post)
    gh_pr = create_cylinder("gh_pr", (2.0, -10.0, 1.05), 0.055, 2.1, mat_post)
    gh_bar = create_cylinder("gh_br", (0, -10.0, 2.10), 0.055, 4.0, mat_post, rotation=(0, math.radians(90), 0))
    gh_net = create_box("gh_nt", (0, -10.5, 1.05), (4.0, 1.0, 2.1), mat_net)

    # Goalpost Away
    ga_pl = create_cylinder("ga_pl", (-2.0, 10.0, 1.05), 0.055, 2.1, mat_post)
    ga_pr = create_cylinder("ga_pr", (2.0, 10.0, 1.05), 0.055, 2.1, mat_post)
    ga_bar = create_cylinder("ga_br", (0, 10.0, 2.10), 0.055, 4.0, mat_post, rotation=(0, math.radians(90), 0))
    ga_net = create_box("ga_nt", (0, 10.5, 1.05), (4.0, 1.0, 2.1), mat_net)

    pitch_parts.extend([gh_pl, gh_pr, gh_bar, gh_net, ga_pl, ga_pr, ga_bar, ga_net])

    # 4 Corner Flags
    for f_idx, (fx, fy) in enumerate([(-7.0, -10.0), (7.0, -10.0), (-7.0, 10.0), (7.0, 10.0)]):
        fp = create_cylinder(f"cf_p_{f_idx}", (fx, fy, 0.5), 0.016, 1.0, mat_line)
        fc = create_box(f"cf_c_{f_idx}", (fx + (0.16 if fx > 0 else -0.16), fy, 0.90), (0.28, 0.01, 0.18), mat_flag_cloth)
        pitch_parts.extend([fp, fc])

    # 4 Stadium Floodlight Towers
    for fl_idx, (lx, ly) in enumerate([(-8.2, -11.0), (8.2, -11.0), (-8.2, 11.0), (8.2, 11.0)]):
        mast = create_cylinder(f"fl_m_{fl_idx}", (lx, ly, 3.0), 0.09, 6.0, mat_steel())
        bank = create_box(f"fl_bk_{fl_idx}", (lx, ly, 6.1), (0.9, 0.35, 0.6), mat_steel())
        lamp = create_box(f"fl_lp_{fl_idx}", (lx, ly + (0.16 if ly < 0 else -0.16), 6.1), (0.85, 0.05, 0.55), mat_screen((1.0, 1.0, 1.0, 1.0), 5.0, "Flood_LED"))
        pitch_parts.extend([mast, bank, lamp])

    join_as_named_object(pitch_parts, "Soccer_Stadium_Pitch")

    # 2. Soccer_Ball_Pro (Multi-panel official match ball, gold & obsidian accents)
    mat_b_white = get_material("Ball_Hex_White", base_color=(0.98, 0.98, 0.98, 1.0), roughness=0.18, coat_weight=0.5)
    mat_b_black = get_material("Ball_Pent_Black", base_color=(0.08, 0.08, 0.09, 1.0), roughness=0.25)
    mat_b_gold = mat_gold()

    ball_core = create_sphere("sb_cr", (0, 0, 0.25), 0.24, mat_b_white)
    b_p1 = create_sphere("sb_p1", (0, 0, 0.47), 0.075, mat_b_black)
    b_p2 = create_sphere("sb_p2", (0, 0, 0.03), 0.075, mat_b_black)
    b_p3 = create_sphere("sb_p3", (0.21, 0, 0.25), 0.075, mat_b_gold)
    b_p4 = create_sphere("sb_p4", (-0.21, 0, 0.25), 0.075, mat_b_gold)
    b_p5 = create_sphere("sb_p5", (0, 0.21, 0.25), 0.075, mat_b_black)
    b_p6 = create_sphere("sb_p6", (0, -0.21, 0.25), 0.075, mat_b_black)
    join_as_named_object([ball_core, b_p1, b_p2, b_p3, b_p4, b_p5, b_p6], "Soccer_Ball_Pro")

    # 3. Player_Home (Forward in attack zone, Royal Blue kit)
    mat_home_j = get_material("Kit_Home_Blue_Jersey", base_color=(0.06, 0.32, 0.88, 1.0), roughness=0.45)
    mat_home_sh = get_material("Kit_Home_White_Shorts", base_color=(0.97, 0.97, 0.97, 1.0), roughness=0.45)
    mat_home_sk = get_material("Kit_Home_Blue_Socks", base_color=(0.06, 0.32, 0.88, 1.0), roughness=0.45)
    build_stylized_player("Player_Home", -1.8, -2.5, mat_home_j, mat_home_sh, mat_home_sk, dorsal="10", is_gk=False)

    # 4. Player_Away (Defender in counter position, Crimson & Black kit)
    mat_away_j = get_material("Kit_Away_Red_Jersey", base_color=(0.88, 0.08, 0.12, 1.0), roughness=0.45)
    mat_away_sh = get_material("Kit_Away_Black_Shorts", base_color=(0.09, 0.09, 0.10, 1.0), roughness=0.45)
    mat_away_sk = get_material("Kit_Away_Red_Socks", base_color=(0.88, 0.08, 0.12, 1.0), roughness=0.45)
    build_stylized_player("Player_Away", 1.8, 2.5, mat_away_j, mat_away_sh, mat_away_sk, dorsal="7", is_gk=False)

    # 5. Goalkeeper_Pro (Near Home goal, Neon Yellow-Green Volt kit)
    mat_gk_j = get_material("Kit_GK_Volt_Jersey", base_color=(0.82, 0.96, 0.08, 1.0), roughness=0.4)
    mat_gk_sh = get_material("Kit_GK_Black_Shorts", base_color=(0.09, 0.09, 0.10, 1.0), roughness=0.45)
    mat_gk_sk = get_material("Kit_GK_Volt_Socks", base_color=(0.82, 0.96, 0.08, 1.0), roughness=0.4)
    build_stylized_player("Goalkeeper_Pro", 0, -9.2, mat_gk_j, mat_gk_sh, mat_gk_sk, dorsal="1", is_gk=True)

    export_glb(os.path.join(OUTPUT_SOCCER_DIR, "soccer_pack.glb"))
    print("MASTERGOAL 3D PACK BUILT AND EXPORTED SUCCESSFULLY!")

if __name__ == "__main__":
    build_soccer()
