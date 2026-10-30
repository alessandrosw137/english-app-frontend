import bpy
import mathutils
import math
import os

def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.unit_settings.system = 'METRIC'
    scene.unit_settings.scale_length = 1.0

def get_material(name, base_color=(0.8, 0.8, 0.8, 1.0), metallic=0.0, roughness=0.5, 
                 transmission=0.0, ior=1.45, emission=(0, 0, 0, 1), emission_strength=0.0, 
                 alpha=1.0, coat_weight=0.0, coat_roughness=0.05):
    if name in bpy.data.materials:
        return bpy.data.materials[name]
    
    mat = bpy.data.materials.new(name=name)
    mat.use_nodes = True
    tree = mat.node_tree
    bsdf = tree.nodes.get('Principled BSDF')
    if bsdf:
        if 'Base Color' in bsdf.inputs:
            bsdf.inputs['Base Color'].default_value = base_color
        if 'Metallic' in bsdf.inputs:
            bsdf.inputs['Metallic'].default_value = metallic
        if 'Roughness' in bsdf.inputs:
            bsdf.inputs['Roughness'].default_value = roughness
        if 'Transmission Weight' in bsdf.inputs:
            bsdf.inputs['Transmission Weight'].default_value = transmission
        if 'IOR' in bsdf.inputs:
            bsdf.inputs['IOR'].default_value = ior
        if 'Alpha' in bsdf.inputs:
            bsdf.inputs['Alpha'].default_value = alpha
        if 'Coat Weight' in bsdf.inputs:
            bsdf.inputs['Coat Weight'].default_value = coat_weight
        if 'Coat Roughness' in bsdf.inputs:
            bsdf.inputs['Coat Roughness'].default_value = coat_roughness
        if 'Emission Color' in bsdf.inputs:
            bsdf.inputs['Emission Color'].default_value = emission
        if 'Emission Strength' in bsdf.inputs:
            bsdf.inputs['Emission Strength'].default_value = emission_strength
            
    if transmission > 0.0 or alpha < 1.0:
        mat.blend_method = 'BLEND'
    return mat

# --- Standard Studio PBR Materials Library ---
def mat_chrome():
    return get_material("chrome_metal", base_color=(0.96, 0.96, 0.97, 1.0), metallic=0.95, roughness=0.12)

def mat_steel():
    return get_material("brushed_steel", base_color=(0.78, 0.80, 0.82, 1.0), metallic=0.85, roughness=0.28)

def mat_gold():
    return get_material("gold_brass", base_color=(0.95, 0.78, 0.32, 1.0), metallic=0.92, roughness=0.18)

def mat_glass():
    return get_material("clear_glass", base_color=(0.94, 0.98, 1.0, 1.0), roughness=0.05, transmission=0.92, ior=1.45, alpha=0.35)

def mat_porcelain():
    return get_material("porcelain_white", base_color=(0.97, 0.97, 0.96, 1.0), roughness=0.10, coat_weight=0.5, coat_roughness=0.03)

def mat_warm_wood():
    return get_material("warm_wood", base_color=(0.58, 0.38, 0.22, 1.0), roughness=0.38)

def mat_dark_walnut():
    return get_material("dark_walnut", base_color=(0.22, 0.12, 0.07, 1.0), roughness=0.32)

def mat_parquet():
    return get_material("herringbone_parquet", base_color=(0.32, 0.18, 0.11, 1.0), roughness=0.30, coat_weight=0.25)

def mat_black_marble():
    return get_material("black_marble", base_color=(0.08, 0.09, 0.11, 1.0), roughness=0.12, coat_weight=0.6)

def mat_burgundy_rug():
    # Elegant deep wine / burgundy (#4a1525 / #581c28) - zero hot-pink
    return get_material("burgundy_rug", base_color=(0.32, 0.09, 0.14, 1.0), roughness=0.85)

def mat_woven_beige():
    return get_material("woven_beige_rug", base_color=(0.88, 0.85, 0.80, 1.0), roughness=0.90)

def mat_commercial_tile():
    return get_material("commercial_tile", base_color=(0.91, 0.91, 0.92, 1.0), roughness=0.18, coat_weight=0.35)

def mat_sci_fi_metal():
    return get_material("sci_fi_deck", base_color=(0.18, 0.20, 0.24, 1.0), metallic=0.75, roughness=0.32)

def mat_grass_natural():
    return get_material("natural_grass", base_color=(0.14, 0.46, 0.16, 1.0), roughness=0.88)

def mat_stone_path():
    return get_material("limestone_paver", base_color=(0.76, 0.74, 0.70, 1.0), roughness=0.68)

def mat_velvet_red():
    return get_material("velvet_red", base_color=(0.55, 0.05, 0.10, 1.0), roughness=0.85)

def mat_terracotta():
    return get_material("terracotta", base_color=(0.78, 0.38, 0.22, 1.0), roughness=0.75)

def mat_screen(color=(0.0, 0.85, 1.0, 1.0), strength=3.5, name="emissive_screen"):
    return get_material(name, base_color=color, emission=color, emission_strength=strength)

# --- Mesh Modifiers & Topology ---
def apply_bevel_and_normals(obj, bevel_width=0.012, segments=4):
    if not obj or obj.type != 'MESH':
        return
    for poly in obj.data.polygons:
        poly.use_smooth = True
    
    if bevel_width > 0:
        mod_b = obj.modifiers.new(name="Bevel", type='BEVEL')
        mod_b.width = bevel_width
        mod_b.segments = segments
        mod_b.limit_method = 'ANGLE'
        mod_b.angle_limit = math.radians(35)
        
    mod_wn = obj.modifiers.new(name="WeightedNormal", type='WEIGHTED_NORMAL')
    mod_wn.keep_sharp = True

# --- Geometry Generation Helpers ---
def create_box(name, location, dimensions, material=None, bevel=0.012, rotation=(0,0,0), scale=(1,1,1)):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=location, rotation=rotation)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (dimensions[0] * scale[0], dimensions[1] * scale[1], dimensions[2] * scale[2])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if material:
        obj.data.materials.append(material)
    apply_bevel_and_normals(obj, bevel_width=bevel)
    return obj

def create_cylinder(name, location, radius, depth, material=None, vertices=32, bevel=0.008, rotation=(0,0,0), scale=(1,1,1)):
    bpy.ops.mesh.primitive_cylinder_add(
        vertices=vertices,
        radius=radius,
        depth=depth,
        location=location,
        rotation=rotation
    )
    obj = bpy.context.active_object
    obj.name = name
    if scale != (1, 1, 1):
        obj.scale = scale
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if material:
        obj.data.materials.append(material)
    apply_bevel_and_normals(obj, bevel_width=bevel)
    return obj

def create_sphere(name, location, radius, material=None, segments=32, rings=16, scale=(1,1,1)):
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=segments,
        ring_count=rings,
        radius=radius,
        location=location
    )
    obj = bpy.context.active_object
    obj.name = name
    if scale != (1, 1, 1):
        obj.scale = scale
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if material:
        obj.data.materials.append(material)
    apply_bevel_and_normals(obj, bevel_width=0.0)
    return obj

def create_torus(name, location, major_radius, minor_radius, material=None, rotation=(0,0,0), scale=(1,1,1)):
    bpy.ops.mesh.primitive_torus_add(
        major_radius=major_radius,
        minor_radius=minor_radius,
        location=location,
        rotation=rotation
    )
    obj = bpy.context.active_object
    obj.name = name
    if scale != (1, 1, 1):
        obj.scale = scale
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if material:
        obj.data.materials.append(material)
    apply_bevel_and_normals(obj, bevel_width=0.0)
    return obj

def join_as_named_object(parts_list, exact_name, location=None):
    valid_objs = [o for o in parts_list if o and o.name in bpy.data.objects]
    if not valid_objs:
        return None
    if len(valid_objs) == 1:
        single = valid_objs[0]
        single.name = exact_name
        bpy.ops.object.select_all(action='DESELECT')
        single.select_set(True)
        bpy.context.view_layer.objects.active = single
        bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
        if location:
            single.location = location
            bpy.context.view_layer.update()
        return single

    bpy.ops.object.select_all(action='DESELECT')
    for o in valid_objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = valid_objs[0]
    bpy.ops.object.join()
    combined = bpy.context.active_object
    combined.name = exact_name
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
    if location:
        combined.location = location
        bpy.context.view_layer.update()
    apply_bevel_and_normals(combined, bevel_width=0.008, segments=3)
    return combined

def join_objects(final_name, objs, location=None):
    return join_as_named_object(objs, final_name, location)

# --- Surface Placement Mathematical Engine ---
def place_on_surface(obj, surface_x, surface_y, surface_top_z, rotation=None):
    """
    Computes the exact world-space bounding box of obj, then translates it so that:
      - its bottom base (min_z) rests EXACTLY at surface_top_z.
      - its horizontal center is positioned at (surface_x, surface_y).
    Preserves node translation (no bake to 0,0,0) so Three.js can inspect child.position!
    """
    if not obj:
        return None
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')

    if rotation:
        obj.rotation_euler = rotation
    bpy.context.view_layer.update()

    mw = obj.matrix_world
    world_bb = [mw @ mathutils.Vector(corner) for corner in obj.bound_box]
    min_x = min(v.x for v in world_bb)
    max_x = max(v.x for v in world_bb)
    min_y = min(v.y for v in world_bb)
    max_y = max(v.y for v in world_bb)
    min_z = min(v.z for v in world_bb)

    center_x = (min_x + max_x) / 2.0
    center_y = (min_y + max_y) / 2.0

    dx = surface_x - center_x
    dy = surface_y - center_y
    dz = surface_top_z - min_z

    obj.location.x += dx
    obj.location.y += dy
    obj.location.z += dz

    bpy.context.view_layer.update()
    return obj

# --- Architectural Isometric Diorama Base Helper ---
def add_bounds_anchor(radius_x=8.0, radius_y=7.0):
    """
    Creates an invisible symmetric bounding anchor centered at (0, 0) with base at Z=0.
    This guarantees Three.js Box3 computes:
      centerX = (-8.0 + 8.0) / 2 = 0
      centerZ = (-7.0 + 7.0) / 2 = 0
      min.y = 0
    so glbScene.position stays at (0, 0, 0) without any coordinate drift.
    """
    mat_inv = get_material("Invisible_Anchor", base_color=(0, 0, 0, 0), roughness=1.0, alpha=0.0)
    b1 = create_box("Anchor_Min", (-radius_x, -radius_y, 0.001), (0.001, 0.001, 0.001), mat_inv, bevel=0.0)
    b2 = create_box("Anchor_Max", (radius_x, radius_y, 0.001), (0.001, 0.001, 0.001), mat_inv, bevel=0.0)
    return join_as_named_object([b1, b2], "World_Bounds_Anchor")

def build_isometric_room(base_name, floor_size=(16.0, 14.0), floor_mat=None, wall_mat=None, 
                         baseboard_mat=None, north_y=6.0, west_x=-7.0, wall_height=3.6, 
                         wall_thick=0.25, has_window=True, window_pos=(-1.5, 6.0, 2.0), 
                         window_size=(3.2, 1.8), rug_config=None):
    """
    Constructs an open-front architectural L-cutaway room:
    - Floor plate: floor_size (16m x 14m) centered at (0, 0) with top surface at Z = 0.
    - North Wall: at Y = north_y (+6.0m), height 3.6m, thickness 0.25m.
    - West Wall: at X = west_x (-7.0m), height 3.6m, thickness 0.25m.
    - Baseboards along the North and West walls.
    - Architectural framed window with glass and sill.
    - Optional central accent rug (with realistic colors, zero hot-pink).
    """
    parts = []
    fx, fy = floor_size
    f_mat = floor_mat or mat_warm_wood()
    w_mat = wall_mat or get_material(f"{base_name}_WallMat", base_color=(0.92, 0.92, 0.93, 1.0), roughness=0.6)
    bb_mat = baseboard_mat or mat_dark_walnut()

    # 1. Floor Plate (base at Z = -0.04, top at Z = 0.00)
    flr = create_box(f"{base_name}_Floor", (0, 0, -0.02), (fx, fy, 0.04), f_mat, bevel=0.0)
    parts.append(flr)

    # Optional Rug
    if rug_config:
        # rug_config: (center_x, center_y, size_x, size_y, mat, is_circle)
        rc_x, rc_y, rs_x, rs_y, r_mat, is_circ = rug_config
        if is_circ:
            rug = create_cylinder(f"{base_name}_Rug", (rc_x, rc_y, 0.008), rs_x / 2.0, 0.016, r_mat, vertices=48, bevel=0.003)
        else:
            rug = create_box(f"{base_name}_Rug", (rc_x, rc_y, 0.008), (rs_x, rs_y, 0.016), r_mat, bevel=0.008)
        parts.append(rug)

    # 2. L-Shaped Walls
    # North Wall: X from west_x - wall_thick/2 (-7.125) to +fx/2 (+8.0)
    nw_len = (fx / 2.0) - (west_x - wall_thick / 2.0)
    nw_center_x = (west_x - wall_thick / 2.0) + (nw_len / 2.0)
    
    # West Wall: Y from -fy/2 (-7.0) to north_y + wall_thick/2 (+6.125)
    ww_len = (north_y + wall_thick / 2.0) - (-fy / 2.0)
    ww_center_y = (-fy / 2.0) + (ww_len / 2.0)

    # Build North Wall (with window cutout or framed)
    if has_window and window_pos:
        wx, wy, wz = window_pos
        w_w, w_h = window_size
        # Left section of North wall
        left_len = (wx - w_w / 2.0) - (west_x - wall_thick / 2.0)
        if left_len > 0.1:
            left_cx = (west_x - wall_thick / 2.0) + left_len / 2.0
            w_left = create_box(f"{base_name}_NW_L", (left_cx, north_y, wall_height / 2.0), (left_len, wall_thick, wall_height), w_mat, bevel=0.01)
            parts.append(w_left)
        # Right section of North wall
        right_len = (fx / 2.0) - (wx + w_w / 2.0)
        if right_len > 0.1:
            right_cx = (wx + w_w / 2.0) + right_len / 2.0
            w_right = create_box(f"{base_name}_NW_R", (right_cx, north_y, wall_height / 2.0), (right_len, wall_thick, wall_height), w_mat, bevel=0.01)
            parts.append(w_right)
        # Top header
        top_h = wall_height - (wz + w_h / 2.0)
        if top_h > 0.05:
            top_cz = wz + w_h / 2.0 + top_h / 2.0
            w_top = create_box(f"{base_name}_NW_Top", (wx, north_y, top_cz), (w_w, wall_thick, top_h), w_mat, bevel=0.01)
            parts.append(w_top)
        # Bottom sill wall
        bot_h = wz - w_h / 2.0
        if bot_h > 0.05:
            bot_cz = bot_h / 2.0
            w_bot = create_box(f"{base_name}_NW_Bot", (wx, north_y, bot_cz), (w_w, wall_thick, bot_h), w_mat, bevel=0.01)
            parts.append(w_bot)

        # Window Frame & Glass
        win_frame = create_box(f"{base_name}_Win_Frame", (wx, north_y, wz), (w_w + 0.10, wall_thick + 0.05, w_h + 0.10), mat_steel(), bevel=0.01)
        win_glass = create_box(f"{base_name}_Win_Glass", (wx, north_y, wz), (w_w, 0.02, w_h), mat_glass())
        win_sill = create_box(f"{base_name}_Win_Sill", (wx, north_y - 0.08, wz - w_h / 2.0), (w_w + 0.20, 0.32, 0.06), bb_mat, bevel=0.008)
        parts.extend([win_frame, win_glass, win_sill])
    else:
        wall_north = create_box(f"{base_name}_Wall_North", (nw_center_x, north_y, wall_height / 2.0), (nw_len, wall_thick, wall_height), w_mat, bevel=0.01)
        parts.append(wall_north)

    # West Wall
    wall_west = create_box(f"{base_name}_Wall_West", (west_x, ww_center_y, wall_height / 2.0), (wall_thick, ww_len, wall_height), w_mat, bevel=0.01)
    parts.append(wall_west)

    # 3. Baseboards (Zócalos)
    bb_north = create_box(f"{base_name}_BB_N", (nw_center_x, north_y - wall_thick / 2.0 - 0.015, 0.075), (nw_len, 0.03, 0.15), bb_mat, bevel=0.004)
    bb_west = create_box(f"{base_name}_BB_W", (west_x + wall_thick / 2.0 + 0.015, ww_center_y, 0.075), (0.03, ww_len, 0.15), bb_mat, bevel=0.004)
    parts.extend([bb_north, bb_west])

    return join_as_named_object(parts, f"{base_name}_Diorama")

def export_glb(filepath):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format='GLB',
        export_apply=False,
        export_yup=True
    )
    size_kb = os.path.getsize(filepath) / 1024
    print(f"[EXPORT OK] {filepath} ({size_kb:.1f} KB)")
