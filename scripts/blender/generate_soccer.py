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

OUTPUT_SOCCER_DIR = r"C:\Users\alessandro\Desktop\ENGLISH\assets\models\soccer"

def build_player(name, x, y, jersey_mat, shorts_mat, socks_mat, is_gk=False):
    mat_skin = get_material("Player_Skin", base_color=(0.82, 0.62, 0.48, 1.0), roughness=0.6)
    mat_hair = get_material("Player_Hair", base_color=(0.12, 0.08, 0.05, 1.0), roughness=0.8)
    mat_boots = get_material("Football_Boots", base_color=(0.10, 0.10, 0.12, 1.0), roughness=0.3)
    mat_studs = get_material("Boot_Studs", base_color=(0.95, 0.85, 0.20, 1.0), metallic=0.9, roughness=0.2)
    mat_gloves = get_material("GK_Gloves_Neon", base_color=(0.20, 0.95, 0.15, 1.0), roughness=0.4)

    # 1. Torso
    torso = create_box(f"{name}_t", (x, y, 1.25), (0.42, 0.24, 0.50), jersey_mat, bevel=0.02)
    
    # 2. Head & Hair
    neck = create_cylinder(f"{name}_nk", (x, y, 1.55), 0.06, 0.10, mat_skin)
    head = create_sphere(f"{name}_hd", (x, y, 1.70), 0.14, mat_skin, scale=(0.95, 1.05, 1.1))
    hair = create_sphere(f"{name}_hr", (x, y - 0.02, 1.76), 0.145, mat_hair, scale=(1.0, 1.05, 0.7))

    # 3. Arms & Hands / Gloves
    arm_l = create_cylinder(f"{name}_al", (x - 0.28, y, 1.25), 0.055, 0.45, jersey_mat)
    arm_r = create_cylinder(f"{name}_ar", (x + 0.28, y, 1.25), 0.055, 0.45, jersey_mat)
    hand_mat = mat_gloves if is_gk else mat_skin
    hand_scale = (1.3, 1.3, 1.3) if is_gk else (1.0, 1.0, 1.0)
    hand_l = create_sphere(f"{name}_hl", (x - 0.28, y, 0.98), 0.06, hand_mat, scale=hand_scale)
    hand_r = create_sphere(f"{name}_hr", (x + 0.28, y, 0.98), 0.06, hand_mat, scale=hand_scale)

    # 4. Shorts & Pelvis
    shorts = create_box(f"{name}_sh", (x, y, 0.90), (0.40, 0.23, 0.24), shorts_mat, bevel=0.02)

    # 5. Legs & Socks
    leg_l = create_cylinder(f"{name}_ll", (x - 0.12, y, 0.55), 0.065, 0.50, socks_mat)
    leg_r = create_cylinder(f"{name}_lr", (x + 0.12, y, 0.55), 0.065, 0.50, socks_mat)

    # 6. Cleats / Boots with Studs
    boot_l = create_box(f"{name}_bl", (x - 0.12, y + 0.04, 0.08), (0.09, 0.22, 0.08), mat_boots, bevel=0.015)
    boot_r = create_box(f"{name}_br", (x + 0.12, y + 0.04, 0.08), (0.09, 0.22, 0.08), mat_boots, bevel=0.015)
    stud1 = create_cylinder(f"{name}_st1", (x - 0.12, y, 0.02), 0.012, 0.02, mat_studs)
    stud2 = create_cylinder(f"{name}_st2", (x + 0.12, y, 0.02), 0.012, 0.02, mat_studs)

    objs = [torso, neck, head, hair, arm_l, arm_r, hand_l, hand_r, shorts, leg_l, leg_r, boot_l, boot_r, stud1, stud2]
    return join_objects(name, objs)

def build_soccer():
    reset_scene()
    print("Building Soccer Assets: MasterGoal 3D...")

    mat_pitch = get_material("Pitch_Grass", base_color=(0.14, 0.48, 0.16, 1.0), roughness=0.8)
    mat_white_line = get_material("Pitch_Lines", base_color=(0.98, 0.98, 0.98, 1.0), roughness=0.5)
    mat_post = get_material("Goal_Posts", base_color=(0.98, 0.98, 0.98, 1.0), metallic=0.4, roughness=0.2)
    mat_net = get_material("Goal_Net", base_color=(0.85, 0.88, 0.90, 1.0), roughness=0.9, alpha=0.7)
    mat_flag = get_material("Corner_Flag_Yellow", base_color=(0.95, 0.85, 0.10, 1.0), roughness=0.6)
    mat_mast = get_material("Floodlight_Steel", base_color=(0.40, 0.42, 0.45, 1.0), metallic=0.9, roughness=0.3)
    mat_lamp = get_material("Floodlight_Emissive", base_color=(1.0, 1.0, 1.0, 1.0), emission=(1.0, 1.0, 1.0, 1.0), emission_strength=5.0)

    # Ball Materials
    mat_ball_white = get_material("Ball_White", base_color=(0.98, 0.98, 0.98, 1.0), roughness=0.2)
    mat_ball_black = get_material("Ball_Black", base_color=(0.10, 0.10, 0.12, 1.0), roughness=0.3)
    mat_ball_gold = get_material("Ball_Gold", base_color=(0.95, 0.82, 0.25, 1.0), metallic=0.95, roughness=0.15)

    # Team Kits
    mat_home_jersey = get_material("Kit_Home_Blue", base_color=(0.08, 0.35, 0.88, 1.0), roughness=0.5)
    mat_home_shorts = get_material("Kit_Home_White", base_color=(0.96, 0.96, 0.96, 1.0), roughness=0.5)
    mat_home_socks = get_material("Kit_Home_Socks", base_color=(0.08, 0.35, 0.88, 1.0), roughness=0.5)

    mat_away_jersey = get_material("Kit_Away_Red", base_color=(0.88, 0.10, 0.12, 1.0), roughness=0.5)
    mat_away_shorts = get_material("Kit_Away_Black", base_color=(0.10, 0.10, 0.12, 1.0), roughness=0.5)
    mat_away_socks = get_material("Kit_Away_Socks", base_color=(0.88, 0.10, 0.12, 1.0), roughness=0.5)

    mat_gk_jersey = get_material("Kit_GK_Neon", base_color=(0.85, 0.95, 0.10, 1.0), roughness=0.4)
    mat_gk_shorts = get_material("Kit_GK_Black", base_color=(0.10, 0.10, 0.12, 1.0), roughness=0.5)
    mat_gk_socks = get_material("Kit_GK_Neon", base_color=(0.85, 0.95, 0.10, 1.0), roughness=0.4)

    # 1. Stadium Pitch
    pitch = create_box("pt_main", (0, 0, -0.05), (14.0, 20.0, 0.1), mat_pitch, bevel=0.0)
    line_center = create_box("pt_lc", (0, 0, 0.01), (13.0, 0.08, 0.02), mat_white_line)
    circle_center = create_torus("pt_cc", (0, 0, 0.01), 1.8, 0.04, mat_white_line)
    
    # Goalpost Home (Bottom, Y = -9.0)
    gh_l = create_cylinder("gh_l", (-1.8, -9.0, 0.9), 0.05, 1.8, mat_post)
    gh_r = create_cylinder("gh_r", (1.8, -9.0, 0.9), 0.05, 1.8, mat_post)
    gh_c = create_cylinder("gh_c", (0, -9.0, 1.8), 0.05, 3.6, mat_post, rotation=(0, math.radians(90), 0))
    gh_net = create_box("gh_net", (0, -9.4, 0.9), (3.6, 0.8, 1.8), mat_net)

    # Goalpost Away (Top, Y = 9.0)
    ga_l = create_cylinder("ga_l", (-1.8, 9.0, 0.9), 0.05, 1.8, mat_post)
    ga_r = create_cylinder("ga_r", (1.8, 9.0, 0.9), 0.05, 1.8, mat_post)
    ga_c = create_cylinder("ga_c", (0, 9.0, 1.8), 0.05, 3.6, mat_post, rotation=(0, math.radians(90), 0))
    ga_net = create_box("ga_net", (0, 9.4, 0.9), (3.6, 0.8, 1.8), mat_net)

    # 4 Corner Flags
    fl1 = create_cylinder("fl1", (-6.0, -9.0, 0.4), 0.015, 0.8, mat_white_line)
    fl1_b = create_box("fl1_b", (-5.9, -9.0, 0.75), (0.20, 0.02, 0.15), mat_flag)
    fl2 = create_cylinder("fl2", (6.0, -9.0, 0.4), 0.015, 0.8, mat_white_line)
    fl2_b = create_box("fl2_b", (6.1, -9.0, 0.75), (0.20, 0.02, 0.15), mat_flag)
    fl3 = create_cylinder("fl3", (-6.0, 9.0, 0.4), 0.015, 0.8, mat_white_line)
    fl3_b = create_box("fl3_b", (-5.9, 9.0, 0.75), (0.20, 0.02, 0.15), mat_flag)
    fl4 = create_cylinder("fl4", (6.0, 9.0, 0.4), 0.015, 0.8, mat_white_line)
    fl4_b = create_box("fl4_b", (6.1, 9.0, 0.75), (0.20, 0.02, 0.15), mat_flag)

    # Stadium Floodlight Tower (Corner)
    fl_pole = create_cylinder("fl_p", (-6.8, -9.8, 2.5), 0.08, 5.0, mat_mast)
    fl_bank = create_box("fl_bk", (-6.8, -9.8, 5.1), (0.8, 0.3, 0.5), mat_mast)
    fl_lamp = create_box("fl_lp", (-6.8, -9.7, 5.1), (0.75, 0.05, 0.45), mat_lamp)

    pitch_objs = [
        pitch, line_center, circle_center,
        gh_l, gh_r, gh_c, gh_net,
        ga_l, ga_r, ga_c, ga_net,
        fl1, fl1_b, fl2, fl2_b, fl3, fl3_b, fl4, fl4_b,
        fl_pole, fl_bank, fl_lamp
    ]
    join_objects("Soccer_Stadium_Pitch", pitch_objs)

    # 2. Soccer_Ball_Pro (Multi-panel official match ball)
    ball_core = create_sphere("sb_c", (0, 0, 0.22), 0.22, mat_ball_white)
    p1 = create_sphere("sb_p1", (0, 0, 0.42), 0.065, mat_ball_black)
    p2 = create_sphere("sb_p2", (0, 0, 0.02), 0.065, mat_ball_black)
    p3 = create_sphere("sb_p3", (0.19, 0, 0.22), 0.065, mat_ball_gold)
    p4 = create_sphere("sb_p4", (-0.19, 0, 0.22), 0.065, mat_ball_gold)
    p5 = create_sphere("sb_p5", (0, 0.19, 0.22), 0.065, mat_ball_black)
    p6 = create_sphere("sb_p6", (0, -0.19, 0.22), 0.065, mat_ball_black)
    join_objects("Soccer_Ball_Pro", [ball_core, p1, p2, p3, p4, p5, p6])

    # 3. Player_Home (Forward in attack zone)
    build_player("Player_Home", -1.5, -2.0, mat_home_jersey, mat_home_shorts, mat_home_socks, is_gk=False)

    # 4. Player_Away (Defender in counter position)
    build_player("Player_Away", 1.5, 2.0, mat_away_jersey, mat_away_shorts, mat_away_socks, is_gk=False)

    # 5. Goalkeeper_Pro (Near Home goal)
    build_player("Goalkeeper_Pro", 0, -8.2, mat_gk_jersey, mat_gk_shorts, mat_gk_socks, is_gk=True)

    export_glb(os.path.join(OUTPUT_SOCCER_DIR, "soccer_pack.glb"))
    print("SOCCER ASSETS EXPORTED SUCCESSFULLY!")

if __name__ == "__main__":
    build_soccer()
