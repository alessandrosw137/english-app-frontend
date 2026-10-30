import bpy
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

def mat_black_marble():
    return get_material("black_marble", base_color=(0.08, 0.09, 0.11, 1.0), roughness=0.12, coat_weight=0.6)

def mat_velvet_red():
    return get_material("velvet_red", base_color=(0.65, 0.06, 0.12, 1.0), roughness=0.85)

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
        if location:
            single.location = location
        return single

    bpy.ops.object.select_all(action='DESELECT')
    for o in valid_objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = valid_objs[0]
    bpy.ops.object.join()
    combined = bpy.context.active_object
    combined.name = exact_name
    if location:
        combined.location = location
    apply_bevel_and_normals(combined, bevel_width=0.010, segments=3)
    return combined

def join_objects(final_name, objs, location=None):
    return join_as_named_object(objs, final_name, location)

# --- Architectural Isometric Diorama Base Helper ---
def add_bounds_anchor(radius=12.0):
    """
    Creates an invisible symmetric bounding anchor centered at (0, 0) with base at Z=0.
    In glTF (+Y Up), Blender (X, Y, Z) becomes Three.js (X, Z, -Y).
    This forces Three.js Box3 to compute:
      centerX = (-radius + radius) / 2 = 0
      centerZ = (-radius + radius) / 2 = 0
      min.y = 0
    guaranteeing glbScene.position stays at (0, 0, 0) without any coordinate drift.
    """
    mat_inv = get_material("Invisible_Anchor", base_color=(0, 0, 0, 0), roughness=1.0, alpha=0.0)
    b1 = create_box("Anchor_Min", (-radius, radius, 0.0005), (0.001, 0.001, 0.001), mat_inv, bevel=0.0)
    b2 = create_box("Anchor_Max", (radius, -radius, 0.0005), (0.001, 0.001, 0.001), mat_inv, bevel=0.0)
    return join_as_named_object([b1, b2], "World_Bounds_Anchor")

def build_diorama_room(base_name, floor_size=(8.0, 8.0), wall_height=3.2, 
                       floor_mat=None, wall_mat=None, baseboard_mat=None, 
                       has_window=True, window_wall='back'):
    # 1. Floor
    fx, fy = floor_size
    flr = create_box(f"{base_name}_Floor", (0, 0, -0.06), (fx, fy, 0.12), floor_mat or mat_warm_wood(), bevel=0.0)
    
    # 2. Baseboards (Zócalos)
    bb_mat = baseboard_mat or mat_dark_walnut()
    # Back baseboard (along +Y edge)
    bb_back = create_box(f"{base_name}_BB_Back", (0, fy/2 - 0.05, 0.08), (fx, 0.08, 0.16), bb_mat, bevel=0.005)
    # Left baseboard (along -X edge)
    bb_left = create_box(f"{base_name}_BB_Left", (-fx/2 + 0.05, 0, 0.08), (0.08, fy, 0.16), bb_mat, bevel=0.005)

    # 3. L-Shaped Walls
    w_mat = wall_mat or get_material(f"{base_name}_WallMat", base_color=(0.92, 0.93, 0.95, 1.0), roughness=0.6)
    w_thick = 0.20
    
    # Back Wall
    wall_back = create_box(f"{base_name}_Wall_Back", (0, fy/2 + w_thick/2, wall_height/2), (fx + w_thick*2, w_thick, wall_height), w_mat, bevel=0.015)
    # Left Wall
    wall_left = create_box(f"{base_name}_Wall_Left", (-fx/2 - w_thick/2, 0, wall_height/2), (w_thick, fy, wall_height), w_mat, bevel=0.015)

    # 4. Optional Window
    decor_parts = [flr, bb_back, bb_left, wall_back, wall_left]
    if has_window:
        win_frame = create_box(f"{base_name}_Win_Frame", (0, fy/2, 1.8), (2.2, 0.25, 1.4), mat_steel())
        win_glass = create_box(f"{base_name}_Win_Glass", (0, fy/2, 1.8), (2.0, 0.05, 1.2), mat_glass())
        win_sill = create_box(f"{base_name}_Win_Sill", (0, fy/2 - 0.10, 1.05), (2.4, 0.35, 0.08), bb_mat)
        decor_parts.extend([win_frame, win_glass, win_sill])

    return join_as_named_object(decor_parts, f"{base_name}_Diorama")

def export_glb(filepath):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format='GLB',
        export_apply=True,
        export_yup=True
    )
    size_kb = os.path.getsize(filepath) / 1024
    print(f"[EXPORT OK] {filepath} ({size_kb:.1f} KB)")
