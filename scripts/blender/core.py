import bpy
import math
import os

def reset_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.unit_settings.system = 'METRIC'
    scene.unit_settings.scale_length = 1.0

def get_material(name, base_color=(0.8, 0.8, 0.8, 1.0), metallic=0.0, roughness=0.5, 
                 transmission=0.0, ior=1.45, emission=(0, 0, 0, 1), emission_strength=0.0, alpha=1.0):
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
        if 'Emission Color' in bsdf.inputs:
            bsdf.inputs['Emission Color'].default_value = emission
        if 'Emission Strength' in bsdf.inputs:
            bsdf.inputs['Emission Strength'].default_value = emission_strength
            
    if transmission > 0.0 or alpha < 1.0:
        mat.blend_method = 'BLEND'
    return mat

def apply_bevel_and_normals(obj, bevel_width=0.015, segments=3):
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

def create_box(name, location, dimensions, material=None, bevel=0.015, rotation=(0,0,0), scale=(1,1,1)):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=location, rotation=rotation)
    obj = bpy.context.active_object
    obj.name = name
    obj.scale = (dimensions[0] * scale[0], dimensions[1] * scale[1], dimensions[2] * scale[2])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if material:
        obj.data.materials.append(material)
    apply_bevel_and_normals(obj, bevel_width=bevel)
    return obj

def create_cylinder(name, location, radius, depth, material=None, vertices=32, bevel=0.01, rotation=(0,0,0), scale=(1,1,1)):
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

def join_objects(final_name, objs, location=None):
    valid_objs = [o for o in objs if o and o.name in bpy.data.objects]
    if not valid_objs:
        return None
    if len(valid_objs) == 1:
        single = valid_objs[0]
        single.name = final_name
        if location:
            single.location = location
        return single

    bpy.ops.object.select_all(action='DESELECT')
    for o in valid_objs:
        o.select_set(True)
    bpy.context.view_layer.objects.active = valid_objs[0]
    bpy.ops.object.join()
    combined = bpy.context.active_object
    combined.name = final_name
    if location:
        combined.location = location
    apply_bevel_and_normals(combined, bevel_width=0.012, segments=2)
    return combined

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
