import bpy
import bmesh
import mathutils
import math
import os


def reset_scene():
    """Resets Blender factory scene cleanly with metric 1.0 scale."""
    bpy.ops.wm.read_factory_settings(use_empty=True)
    scene = bpy.context.scene
    scene.unit_settings.system = 'METRIC'
    scene.unit_settings.scale_length = 1.0


def _ensure_object_mode():
    if bpy.context.active_object and bpy.context.active_object.mode != 'OBJECT':
        try:
            bpy.ops.object.mode_set(mode='OBJECT')
        except Exception:
            pass


def bake_modifiers(obj):
    """Applies all active modifiers on a mesh object so bevels/subsurf export cleanly."""
    if not obj or obj.type != 'MESH' or not obj.modifiers:
        return obj
    _ensure_object_mode()
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    for mod in list(obj.modifiers):
        try:
            bpy.ops.object.modifier_apply(modifier=mod.name)
        except Exception:
            try:
                obj.modifiers.remove(mod)
            except Exception:
                pass
    return obj


def set_smooth_normals(obj, auto_angle_deg=42.0):
    """Applies smooth shading; uses angle-based auto-smooth for hard-surface crispness."""
    if not obj or obj.type != 'MESH':
        return
    _ensure_object_mode()
    for poly in obj.data.polygons:
        poly.use_smooth = True
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    try:
        if auto_angle_deg is None:
            bpy.ops.object.shade_smooth()
        elif hasattr(bpy.ops.object, 'shade_auto_smooth'):
            bpy.ops.object.shade_auto_smooth(angle=math.radians(auto_angle_deg))
        else:
            bpy.ops.object.shade_smooth()
    except Exception:
        pass


def get_material(name, base_color=(0.8, 0.8, 0.8, 1.0), metallic=0.0, roughness=0.45,
                 transmission=0.0, ior=1.45, emission=(0, 0, 0, 1), emission_strength=0.0,
                 alpha=1.0, coat_weight=0.0, coat_roughness=0.05, sheen_weight=0.0,
                 double_sided=True):
    """Creates or retrieves a harmonious studio PBR Principled BSDF material."""
    if name in bpy.data.materials:
        return bpy.data.materials[name]

    mat = bpy.data.materials.new(name=name)
    if not mat.use_nodes:
        mat.use_nodes = True
    tree = mat.node_tree
    bsdf = tree.nodes.get('Principled BSDF')

    effective_alpha = alpha
    if len(base_color) >= 4 and alpha == 1.0 and base_color[3] < 1.0:
        effective_alpha = base_color[3]
    rgba = (base_color[0], base_color[1], base_color[2], effective_alpha)

    if bsdf:
        if 'Base Color' in bsdf.inputs:
            bsdf.inputs['Base Color'].default_value = rgba
        if 'Metallic' in bsdf.inputs:
            bsdf.inputs['Metallic'].default_value = metallic
        if 'Roughness' in bsdf.inputs:
            bsdf.inputs['Roughness'].default_value = roughness
        if 'Transmission Weight' in bsdf.inputs:
            bsdf.inputs['Transmission Weight'].default_value = transmission
        if 'IOR' in bsdf.inputs:
            bsdf.inputs['IOR'].default_value = ior
        if 'Alpha' in bsdf.inputs:
            bsdf.inputs['Alpha'].default_value = effective_alpha
        if 'Coat Weight' in bsdf.inputs:
            bsdf.inputs['Coat Weight'].default_value = coat_weight
        if 'Coat Roughness' in bsdf.inputs:
            bsdf.inputs['Coat Roughness'].default_value = coat_roughness
        if 'Sheen Weight' in bsdf.inputs and sheen_weight > 0.0:
            bsdf.inputs['Sheen Weight'].default_value = sheen_weight
        if 'Emission Color' in bsdf.inputs:
            bsdf.inputs['Emission Color'].default_value = emission
        if 'Emission Strength' in bsdf.inputs:
            bsdf.inputs['Emission Strength'].default_value = emission_strength

    mat.use_backface_culling = not double_sided
    if effective_alpha < 0.99 or transmission > 0.0:
        if hasattr(mat, 'surface_render_method'):
            mat.surface_render_method = 'BLENDED'
        elif hasattr(mat, 'blend_method'):
            mat.blend_method = 'BLEND'
    return mat


# ==============================================================================
# HARMONIOUS STUDIO PBR MATERIAL PALETTE (ZERO NEON / ZERO HOT-PINK)
# ==============================================================================
def mat_chrome():
    return get_material("chrome_metal", base_color=(0.91, 0.92, 0.94, 1.0), metallic=0.92, roughness=0.14)


def mat_steel():
    return get_material("brushed_steel", base_color=(0.74, 0.77, 0.80, 1.0), metallic=0.82, roughness=0.28)


def mat_dark_steel():
    return get_material("anodized_dark_steel", base_color=(0.17, 0.19, 0.22, 1.0), metallic=0.72, roughness=0.34)


def mat_gold():
    return get_material("champagne_gold", base_color=(0.87, 0.71, 0.34, 1.0), metallic=0.88, roughness=0.20)


def mat_bronze():
    return get_material("architectural_bronze", base_color=(0.48, 0.35, 0.22, 1.0), metallic=0.80, roughness=0.28)


def mat_copper():
    return get_material("warm_copper", base_color=(0.76, 0.44, 0.27, 1.0), metallic=0.85, roughness=0.24)


def mat_glass():
    return get_material("crystal_glass", base_color=(0.88, 0.94, 0.98, 0.34), roughness=0.06,
                        transmission=0.88, ior=1.48, alpha=0.34)


def mat_tinted_glass(name, rgb=(0.20, 0.24, 0.28), alpha=0.48):
    return get_material(name, base_color=(rgb[0], rgb[1], rgb[2], alpha), roughness=0.08,
                        transmission=0.75, ior=1.48, alpha=alpha)


def mat_water():
    return get_material("spring_water", base_color=(0.38, 0.73, 0.82, 0.62), roughness=0.08,
                        transmission=0.80, ior=1.33, alpha=0.62)


def mat_porcelain():
    return get_material("porcelain_warm", base_color=(0.85, 0.83, 0.80, 1.0), roughness=0.18,
                        coat_weight=0.45, coat_roughness=0.05)


def mat_white_quartz():
    return get_material("carrara_quartz", base_color=(0.78, 0.77, 0.75, 1.0), roughness=0.18,
                        coat_weight=0.40, coat_roughness=0.06)


def mat_warm_wood():
    # Warm rich timber (#8B5A2B)
    return get_material("european_oak", base_color=(0.55, 0.35, 0.17, 1.0), roughness=0.36)


def mat_warm_wood_rich():
    # Sienna warm wood (#A0522D)
    return get_material("rich_sienna_wood", base_color=(0.63, 0.32, 0.18, 1.0), roughness=0.34)


def mat_light_oak():
    return get_material("natural_ash_wood", base_color=(0.65, 0.50, 0.34, 1.0), roughness=0.38)


def mat_dark_walnut():
    # Dark walnut wood (#5C3A21)
    return get_material("american_walnut", base_color=(0.36, 0.23, 0.13, 1.0), roughness=0.32)


def mat_parquet():
    return get_material("bistro_parquet_a", base_color=(0.42, 0.26, 0.15, 1.0), roughness=0.32, coat_weight=0.22)


def mat_parquet_alt():
    return get_material("bistro_parquet_b", base_color=(0.35, 0.21, 0.12, 1.0), roughness=0.34, coat_weight=0.22)


def mat_black_marble():
    return get_material("imperial_nero_marble", base_color=(0.08, 0.09, 0.12, 1.0), roughness=0.15, coat_weight=0.55)


def mat_dark_slate():
    # Elegant dark slate (#1e293b)
    return get_material("terrace_dark_slate", base_color=(0.12, 0.16, 0.23, 1.0), roughness=0.45, coat_weight=0.15)


def mat_volcanic_stone():
    # Dark volcanic stone
    return get_material("volcanic_dark_stone", base_color=(0.09, 0.10, 0.12, 1.0), roughness=0.82)


def mat_travertine():
    return get_material("cream_travertine", base_color=(0.74, 0.70, 0.63, 1.0), roughness=0.38, coat_weight=0.15)


def mat_burgundy_rug():
    return get_material("bordeaux_burgundy", base_color=(0.30, 0.08, 0.13, 1.0), roughness=0.84, sheen_weight=0.35)


def mat_woven_beige():
    return get_material("woven_oatmeal_rug", base_color=(0.75, 0.71, 0.64, 1.0), roughness=0.88, sheen_weight=0.30)


def mat_linen_white():
    return get_material("fine_ivory_linen", base_color=(0.85, 0.83, 0.79, 1.0), roughness=0.76, sheen_weight=0.35)


def mat_navy_fabric():
    return get_material("slate_navy_boucle", base_color=(0.14, 0.20, 0.32, 1.0), roughness=0.78, sheen_weight=0.40)


def mat_cognac_leather():
    return get_material("cognac_saddle_leather", base_color=(0.54, 0.28, 0.14, 1.0), roughness=0.44, coat_weight=0.12)


def mat_commercial_tile():
    # Medium gray porcelain (#475569) - Zero blinding white!
    return get_material("porcelain_floor_tile", base_color=(0.28, 0.33, 0.41, 1.0), roughness=0.25, coat_weight=0.28)


def mat_sci_fi_metal():
    return get_material("orbital_titanium_deck", base_color=(0.16, 0.19, 0.25, 1.0), metallic=0.72, roughness=0.32)


def mat_grass_natural():
    return get_material("botanical_lawn", base_color=(0.16, 0.38, 0.16, 1.0), roughness=0.86)


def mat_stone_path():
    return get_material("limestone_paver", base_color=(0.58, 0.56, 0.52, 1.0), roughness=0.68)


def mat_velvet_red():
    return get_material("crimson_velvet", base_color=(0.48, 0.07, 0.11, 1.0), roughness=0.80, sheen_weight=0.45)


def mat_terracotta():
    # Terracotta warm (#A0522D / #8B5A2B)
    return get_material("artisanal_terracotta", base_color=(0.63, 0.32, 0.18, 1.0), roughness=0.72)


# ==============================================================================
# VIBRANT SUPERMARKET & PRODUCE PBR PALETTES
# ==============================================================================
def mat_apple_red():
    return get_material("prod_apple_red", (0.86, 0.08, 0.12, 1.0), roughness=0.30, coat_weight=0.3)

def mat_banana_yellow():
    return get_material("prod_banana_yellow", (0.96, 0.82, 0.15, 1.0), roughness=0.42)

def mat_orange_vivid():
    return get_material("prod_orange_vivid", (0.95, 0.45, 0.05, 1.0), roughness=0.40)

def mat_watermelon_green():
    return get_material("prod_watermelon_green", (0.12, 0.46, 0.16, 1.0), roughness=0.32, coat_weight=0.3)

def mat_strawberry_red():
    return get_material("prod_strawberry_red", (0.92, 0.12, 0.20, 1.0), roughness=0.35)

def mat_avocado_dark():
    return get_material("prod_avocado_dark", (0.14, 0.26, 0.11, 1.0), roughness=0.58)

def mat_tomato_red():
    return get_material("prod_tomato_red", (0.88, 0.14, 0.08, 1.0), roughness=0.28, coat_weight=0.3)

def mat_potato_brown():
    return get_material("prod_potato_brown", (0.58, 0.42, 0.26, 1.0), roughness=0.85)

def mat_carrot_orange():
    return get_material("prod_carrot_orange", (0.96, 0.42, 0.08, 1.0), roughness=0.48)

def mat_broccoli_green():
    return get_material("prod_broccoli_green", (0.14, 0.40, 0.15, 1.0), roughness=0.75)

def mat_cheese_yellow():
    return get_material("prod_cheese_yellow", (0.98, 0.78, 0.18, 1.0), roughness=0.35)

def mat_yogurt_berry():
    return get_material("prod_yogurt_berry", (0.78, 0.22, 0.48, 1.0), roughness=0.28)

def mat_butter_cream():
    return get_material("prod_butter_cream", (0.96, 0.88, 0.52, 1.0), roughness=0.38)

def mat_soda_red():
    return get_material("prod_soda_red", (0.88, 0.06, 0.08, 1.0), metallic=0.75, roughness=0.22)

def mat_soda_blue():
    return get_material("prod_soda_blue", (0.08, 0.35, 0.88, 1.0), metallic=0.75, roughness=0.22)

def mat_chips_bag():
    return get_material("prod_chips_bag", (0.92, 0.65, 0.08, 1.0), metallic=0.30, roughness=0.25)

def mat_cookies_box():
    return get_material("prod_cookies_box", (0.24, 0.45, 0.82, 1.0), roughness=0.38)

def mat_chocolate_brown():
    return get_material("prod_chocolate_brown", (0.26, 0.13, 0.07, 1.0), roughness=0.36)

def mat_shopping_basket_red():
    return get_material("market_basket_red", (0.85, 0.10, 0.12, 1.0), roughness=0.35)


# ==============================================================================
# SOLAR SYSTEM & COSMOS PBR PALETTES
# ==============================================================================
def mat_sun():
    return get_material("Solar_Star_Sun", (1.0, 0.65, 0.08, 1.0), roughness=0.20,
                        emission=(1.0, 0.65, 0.08, 1.0), emission_strength=4.5)

def mat_mercury():
    return get_material("Planet_Mercury", (0.58, 0.55, 0.52, 1.0), roughness=0.85)

def mat_venus():
    return get_material("Planet_Venus", (0.88, 0.74, 0.45, 1.0), roughness=0.60)

def mat_earth():
    return get_material("Planet_Earth_Ocean", (0.08, 0.35, 0.82, 1.0), roughness=0.40)

def mat_earth_land():
    return get_material("Planet_Earth_Continent", (0.16, 0.50, 0.20, 1.0), roughness=0.62)

def mat_moon():
    return get_material("Satellite_Moon", (0.68, 0.69, 0.72, 1.0), roughness=0.90)

def mat_mars():
    return get_material("Planet_Mars", (0.85, 0.28, 0.12, 1.0), roughness=0.75)

def mat_jupiter():
    return get_material("Planet_Jupiter", (0.86, 0.58, 0.34, 1.0), roughness=0.50)

def mat_saturn():
    return get_material("Planet_Saturn", (0.88, 0.78, 0.50, 1.0), roughness=0.52)

def mat_saturn_rings():
    return get_material("Saturn_Rings_Golden", (0.82, 0.72, 0.45, 0.75), roughness=0.35, alpha=0.75)

def mat_uranus():
    return get_material("Planet_Uranus", (0.44, 0.82, 0.88, 1.0), roughness=0.45)

def mat_neptune():
    return get_material("Planet_Neptune", (0.12, 0.30, 0.88, 1.0), roughness=0.42)

def mat_pluto():
    return get_material("Planet_Pluto", (0.72, 0.68, 0.64, 1.0), roughness=0.88)

def mat_space_rocket_body():
    return get_material("Space_Rocket_Body", (0.90, 0.91, 0.93, 1.0), roughness=0.25)

def mat_space_rocket_red():
    return get_material("Space_Rocket_Red", (0.88, 0.10, 0.12, 1.0), roughness=0.25)

def mat_solar_panel():
    return get_material("Space_Solar_Array", (0.06, 0.15, 0.42, 1.0), metallic=0.85, roughness=0.15)

def mat_black_hole_disk():
    return get_material("Black_Hole_Disk", (0.98, 0.55, 0.08, 1.0), roughness=0.20,
                        emission=(0.98, 0.55, 0.08, 1.0), emission_strength=4.0)

def mat_ufo_metallic():
    return get_material("UFO_Hull_Chrome", (0.82, 0.85, 0.88, 1.0), metallic=0.88, roughness=0.18)

def mat_ufo_dome():
    return get_material("UFO_Dome_Green", (0.15, 0.88, 0.45, 0.65), roughness=0.12,
                        transmission=0.65, alpha=0.65)


def mat_screen(color=(0.18, 0.68, 0.88, 1.0), strength=1.5, name="studio_screen"):
    # Soft studio illumination: clamp overly saturated neon channels
    r = min(0.95, max(0.05, color[0]))
    g = min(0.95, max(0.05, color[1]))
    b = min(0.95, max(0.05, color[2]))
    a = color[3] if len(color) > 3 else 1.0
    col = (r, g, b, a)
    return get_material(name, base_color=col, roughness=0.22, emission=col,
                        emission_strength=min(2.2, strength))


# ==============================================================================
# MESH MODIFIERS & PRIMITIVES (BAKED MULTI-SEGMENT BEVELS)
# ==============================================================================
def apply_bevel_and_normals(obj, bevel_width=0.012, segments=3, auto_angle_deg=42.0):
    if not obj or obj.type != 'MESH':
        return obj
    if bevel_width and bevel_width > 0:
        mod_b = obj.modifiers.new(name="Bevel", type='BEVEL')
        mod_b.width = bevel_width
        mod_b.segments = segments
        mod_b.limit_method = 'ANGLE'
        mod_b.angle_limit = math.radians(32)
        if hasattr(mod_b, 'miter_outer'):
            mod_b.miter_outer = 'MITER_ARC'
        bake_modifiers(obj)
    set_smooth_normals(obj, auto_angle_deg=auto_angle_deg)
    return obj


def create_box(name, location, dimensions, material=None, bevel=0.012, segments=3,
               rotation=(0, 0, 0), scale=(1, 1, 1)):
    _ensure_object_mode()
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=location, rotation=rotation)
    obj = bpy.context.active_object
    obj.name = name
    obj.data.name = name
    sx = max(0.001, dimensions[0] * scale[0])
    sy = max(0.001, dimensions[1] * scale[1])
    sz = max(0.001, dimensions[2] * scale[2])
    obj.scale = (sx, sy, sz)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if material:
        obj.data.materials.append(material)
    max_safe_bevel = min(sx, sy, sz) * 0.32
    eff_bevel = min(bevel, max_safe_bevel) if bevel > 0 else 0.0
    apply_bevel_and_normals(obj, bevel_width=eff_bevel, segments=segments)
    return obj


def create_cylinder(name, location, radius, depth, material=None, vertices=32,
                    bevel=0.006, rotation=(0, 0, 0), scale=(1, 1, 1), radius2=None):
    _ensure_object_mode()
    if radius2 is not None and abs(radius2 - radius) > 1e-5:
        bpy.ops.mesh.primitive_cone_add(
            vertices=vertices,
            radius1=radius,
            radius2=radius2,
            depth=depth,
            location=location,
            rotation=rotation
        )
    else:
        bpy.ops.mesh.primitive_cylinder_add(
            vertices=vertices,
            radius=radius,
            depth=depth,
            location=location,
            rotation=rotation
        )
    obj = bpy.context.active_object
    obj.name = name
    obj.data.name = name
    if scale != (1, 1, 1):
        obj.scale = scale
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if material:
        obj.data.materials.append(material)
    max_safe = min(radius if radius > 0 else 0.01, depth * 0.35) * 0.4
    eff_bevel = min(bevel, max_safe) if bevel > 0 else 0.0
    apply_bevel_and_normals(obj, bevel_width=eff_bevel, segments=2)
    return obj


def create_cone(name, location, radius1, radius2, depth, material=None, vertices=32,
                bevel=0.004, rotation=(0, 0, 0), scale=(1, 1, 1)):
    return create_cylinder(name, location, radius=radius1, radius2=radius2, depth=depth,
                           material=material, vertices=vertices, bevel=bevel,
                           rotation=rotation, scale=scale)


def create_sphere(name, location, radius, material=None, segments=32, rings=18,
                  rotation=(0, 0, 0), scale=(1, 1, 1)):
    _ensure_object_mode()
    bpy.ops.mesh.primitive_uv_sphere_add(
        segments=segments,
        ring_count=rings,
        radius=radius,
        location=location,
        rotation=rotation
    )
    obj = bpy.context.active_object
    obj.name = name
    obj.data.name = name
    if scale != (1, 1, 1):
        obj.scale = scale
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if material:
        obj.data.materials.append(material)
    set_smooth_normals(obj, auto_angle_deg=None)
    return obj


def create_torus(name, location, major_radius, minor_radius, material=None,
                 major_segments=36, minor_segments=16, rotation=(0, 0, 0), scale=(1, 1, 1)):
    _ensure_object_mode()
    bpy.ops.mesh.primitive_torus_add(
        major_radius=major_radius,
        minor_radius=minor_radius,
        major_segments=major_segments,
        minor_segments=minor_segments,
        location=location,
        rotation=rotation
    )
    obj = bpy.context.active_object
    obj.name = name
    obj.data.name = name
    if scale != (1, 1, 1):
        obj.scale = scale
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if material:
        obj.data.materials.append(material)
    set_smooth_normals(obj, auto_angle_deg=None)
    return obj


# ==============================================================================
# 1. TURNED LATHE REVOLUTION ENGINE: create_lathe_profile(points_rz, segments=32)
# ==============================================================================
def _smooth_profile_chaikin(points_rz, iterations=1):
    """
    Smooths a 2D (r, z[, tag]) profile via Chaikin corner-cutting while keeping
    endpoints and any point tagged with 'sharp' crisp (for flat bottle/plate bases).
    """
    pts = list(points_rz)
    if len(pts) < 3 or iterations <= 0:
        return [(float(p[0]), float(p[1])) for p in pts]

    for _ in range(iterations):
        new_pts = [pts[0]]
        for i in range(1, len(pts) - 1):
            prev_p = pts[i - 1]
            curr_p = pts[i]
            next_p = pts[i + 1]
            is_sharp = (len(curr_p) >= 3 and curr_p[2] == 'sharp')
            if is_sharp:
                new_pts.append(curr_p)
            else:
                q_r = 0.75 * curr_p[0] + 0.25 * prev_p[0]
                q_z = 0.75 * curr_p[1] + 0.25 * prev_p[1]
                r_r = 0.75 * curr_p[0] + 0.25 * next_p[0]
                r_z = 0.75 * curr_p[1] + 0.25 * next_p[1]
                new_pts.append((q_r, q_z))
                new_pts.append((r_r, r_z))
        new_pts.append(pts[-1])
        pts = new_pts

    return [(max(0.0, float(p[0])), float(p[1])) for p in pts]


def create_lathe_profile(points_rz, segments=32, name="Lathe_Object", material=None,
                         location=(0, 0, 0), rotation=(0, 0, 0), scale=(1, 1, 1),
                         smooth_steps=1, cap_ends=True):
    """
    Generates a revolved 3D mesh from a 2D (radius, z) profile around the Z axis.
    Supports both solid silhouettes and hollow vessels (outer profile up -> rim -> inner profile down).
    Can be called as create_lathe_profile(points_rz, segments=32, ...) per spec.
    """
    _ensure_object_mode()
    # Allow flexible positional call if name was passed first by caller
    if isinstance(points_rz, str) and isinstance(segments, (list, tuple)):
        actual_name = points_rz
        pts_input = segments
        segs = name if isinstance(name, int) else 32
    else:
        actual_name = name
        pts_input = points_rz
        segs = max(8, int(segments))

    profile = _smooth_profile_chaikin(pts_input, iterations=smooth_steps)

    # Optionally close open ends onto the Z axis so there are no open holes
    if cap_ends and len(profile) >= 2:
        first_r, first_z = profile[0]
        last_r, last_z = profile[-1]
        is_closed_loop = (math.hypot(first_r - last_r, first_z - last_z) < 1e-5)
        if not is_closed_loop:
            if first_r > 1e-5:
                profile.insert(0, (0.0, first_z))
            if last_r > 1e-5:
                profile.append((0.0, last_z))

    # Deduplicate consecutive identical points
    clean_prof = []
    for r, z in profile:
        if not clean_prof or math.hypot(r - clean_prof[-1][0], z - clean_prof[-1][1]) > 1e-5:
            clean_prof.append((max(0.0, r), z))

    bm = bmesh.new()
    rings = []
    for r, z in clean_prof:
        if r <= 1e-5:
            v = bm.verts.new((0.0, 0.0, z))
            rings.append([v])
        else:
            ring = []
            for s in range(segs):
                ang = (2.0 * math.pi * s) / segs
                ring.append(bm.verts.new((r * math.cos(ang), r * math.sin(ang), z)))
            rings.append(ring)

    bm.verts.ensure_lookup_table()

    for idx in range(len(rings) - 1):
        r_a = rings[idx]
        r_b = rings[idx + 1]
        if len(r_a) == 1 and len(r_b) > 1:
            pole = r_a[0]
            for s in range(segs):
                s_next = (s + 1) % segs
                try:
                    bm.faces.new((pole, r_b[s_next], r_b[s]))
                except ValueError:
                    pass
        elif len(r_a) > 1 and len(r_b) == 1:
            pole = r_b[0]
            for s in range(segs):
                s_next = (s + 1) % segs
                try:
                    bm.faces.new((r_a[s], r_a[s_next], pole))
                except ValueError:
                    pass
        elif len(r_a) > 1 and len(r_b) > 1:
            for s in range(segs):
                s_next = (s + 1) % segs
                try:
                    bm.faces.new((r_a[s], r_a[s_next], r_b[s_next], r_b[s]))
                except ValueError:
                    pass

    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)

    mesh = bpy.data.meshes.new(actual_name)
    bm.to_mesh(mesh)
    bm.free()

    obj = bpy.data.objects.new(actual_name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = rotation
    if scale != (1, 1, 1):
        obj.scale = scale
        bpy.ops.object.select_all(action='DESELECT')
        obj.select_set(True)
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)

    if material:
        obj.data.materials.append(material)

    set_smooth_normals(obj, auto_angle_deg=52.0)
    return obj


# ==============================================================================
# 2. ORGANIC SUBDIVIDED CUSHION / PLUSH VOLUME: create_soft_cushion(...)
# ==============================================================================
def create_soft_cushion(size, bevel_width=0.04, subdiv=2, name="Soft_Cushion",
                        location=(0, 0, 0), rotation=(0, 0, 0), material=None,
                        puff=0.14, seam_pinch=0.05, crown_arch=0.0):
    """
    Creates an organic, pillowed cushion / mattress / bread loaf / steak / petal volume
    using a structured multi-loop bmesh cage, cosine belly puffing, welt seam creases,
    beveling, and Catmull-Clark Subdivision Surface baked to smooth triangles.
    """
    _ensure_object_mode()
    if isinstance(size, str) and isinstance(bevel_width, (list, tuple)):
        actual_name = size
        dims = bevel_width
        b_width = 0.04
    else:
        actual_name = name
        dims = size
        b_width = bevel_width

    sx, sy, sz = max(0.01, dims[0]), max(0.01, dims[1]), max(0.01, dims[2])
    hx, hy, hz = sx * 0.5, sy * 0.5, sz * 0.5

    # Structured 5x5x4 grid so Catmull-Clark holds rectangular upholstery proportions
    # while bulging naturally in the center and creasing cleanly along piped seams
    u_steps = [-1.0, -0.78, 0.0, 0.78, 1.0]
    v_steps = [-1.0, -0.78, 0.0, 0.78, 1.0]
    w_steps = [-1.0, -0.68, 0.68, 1.0]

    bm = bmesh.new()
    nu, nv, nw = len(u_steps), len(v_steps), len(w_steps)
    grid = {}

    for iu, u in enumerate(u_steps):
        for iv, v in enumerate(v_steps):
            for iw, w in enumerate(w_steps):
                is_boundary = (iu in (0, nu - 1)) or (iv in (0, nv - 1)) or (iw in (0, nw - 1))
                if not is_boundary:
                    continue

                x = u * hx
                y = v * hy
                z = w * hz

                # Smooth pillow dome inflation on top, bottom, and side bellies
                dome_xy = math.cos(u * math.pi * 0.5) * math.cos(v * math.pi * 0.5)
                dome_z = math.cos(w * math.pi * 0.5)

                z += math.copysign(1.0, w) * (sz * puff * dome_xy) if abs(w) > 0.5 else 0.0
                x += u * (sx * puff * 0.35 * dome_z * math.cos(v * math.pi * 0.5))
                y += v * (sy * puff * 0.35 * dome_z * math.cos(u * math.pi * 0.5))

                # Upholstered welt / piped seam pinch at perimeter corners
                on_edge_ring = ((abs(u) > 0.95) + (abs(v) > 0.95) + (abs(w) > 0.95)) >= 2
                if on_edge_ring and seam_pinch > 0:
                    x *= (1.0 - seam_pinch)
                    y *= (1.0 - seam_pinch)
                    z *= (1.0 - seam_pinch * 0.6)

                # Optional baker's loaf crown arch (e.g. for Sliced_Bread)
                if crown_arch != 0.0 and w > 0.0:
                    z += crown_arch * math.cos(u * math.pi * 0.5) * (0.5 + 0.5 * w)

                grid[(iu, iv, iw)] = bm.verts.new((x, y, z))

    bm.verts.ensure_lookup_table()

    def _add_quad(k1, k2, k3, k4):
        try:
            bm.faces.new((grid[k1], grid[k2], grid[k3], grid[k4]))
        except ValueError:
            pass

    # Bottom (iw = 0) & Top (iw = nw - 1)
    for iu in range(nu - 1):
        for iv in range(nv - 1):
            _add_quad((iu, iv, 0), (iu, iv + 1, 0), (iu + 1, iv + 1, 0), (iu + 1, iv, 0))
            _add_quad((iu, iv, nw - 1), (iu + 1, iv, nw - 1), (iu + 1, iv + 1, nw - 1), (iu, iv + 1, nw - 1))

    # Front (iv = 0) & Back (iv = nv - 1)
    for iu in range(nu - 1):
        for iw in range(nw - 1):
            _add_quad((iu, 0, iw), (iu + 1, 0, iw), (iu + 1, 0, iw + 1), (iu, 0, iw + 1))
            _add_quad((iu, nv - 1, iw), (iu, nv - 1, iw + 1), (iu + 1, nv - 1, iw + 1), (iu + 1, nv - 1, iw))

    # Left (iu = 0) & Right (iu = nu - 1)
    for iv in range(nv - 1):
        for iw in range(nw - 1):
            _add_quad((0, iv, iw), (0, iv, iw + 1), (0, iv + 1, iw + 1), (0, iv + 1, iw))
            _add_quad((nu - 1, iv, iw), (nu - 1, iv + 1, iw), (nu - 1, iv + 1, iw + 1), (nu - 1, iv, iw + 1))

    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)

    mesh = bpy.data.meshes.new(actual_name)
    bm.to_mesh(mesh)
    bm.free()

    obj = bpy.data.objects.new(actual_name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    obj.rotation_euler = rotation

    if material:
        obj.data.materials.append(material)

    if b_width > 0:
        max_b = min(sx, sy, sz) * 0.22
        mod_b = obj.modifiers.new(name="CushionBevel", type='BEVEL')
        mod_b.width = min(b_width, max_b)
        mod_b.segments = 2
        mod_b.limit_method = 'ANGLE'
        mod_b.angle_limit = math.radians(40)

    if subdiv and subdiv > 0:
        mod_s = obj.modifiers.new(name="CushionSubsurf", type='SUBSURF')
        mod_s.levels = min(3, int(subdiv))
        mod_s.render_levels = mod_s.levels

    bake_modifiers(obj)
    set_smooth_normals(obj, auto_angle_deg=None)
    return obj


# ==============================================================================
# 3. SWEPT 3D TUBES & CURVED HANDLES (FAUCETS, SPOUTS, RAILS, HANDLES)
# ==============================================================================
def create_curved_tube(name, points_3d, radius=0.014, resolution=8, bevel_res=5,
                       material=None, closed=False):
    """Creates a smooth swept 3D tubular mesh along control points using NURBS/Bezier spline."""
    _ensure_object_mode()
    curve_data = bpy.data.curves.new(name=f"{name}_Curve", type='CURVE')
    curve_data.dimensions = '3D'
    curve_data.resolution_u = resolution
    curve_data.bevel_depth = radius
    curve_data.bevel_resolution = bevel_res
    if hasattr(curve_data, 'use_fill_caps'):
        curve_data.use_fill_caps = True

    spline = curve_data.splines.new(type='NURBS' if len(points_3d) >= 4 else 'POLY')
    spline.points.add(len(points_3d) - 1)
    for i, pt in enumerate(points_3d):
        spline.points[i].co = (pt[0], pt[1], pt[2], 1.0)
    if spline.type == 'NURBS':
        spline.use_endpoint_u = True
        spline.order_u = min(4, len(points_3d))
    spline.use_cyclic_u = closed

    curve_obj = bpy.data.objects.new(name, curve_data)
    bpy.context.collection.objects.link(curve_obj)
    bpy.ops.object.select_all(action='DESELECT')
    curve_obj.select_set(True)
    bpy.context.view_layer.objects.active = curve_obj
    bpy.ops.object.convert(target='MESH')
    mesh_obj = bpy.context.active_object
    mesh_obj.name = name
    mesh_obj.data.name = name
    if material:
        mesh_obj.data.materials.append(material)
    set_smooth_normals(mesh_obj, auto_angle_deg=55.0)
    return mesh_obj


def create_curved_handle(name, center, length=0.22, standoff=0.032, radius=0.009,
                         axis='Z', facing='-Y', material=None):
    """Creates an ergonomic curved appliance/cabinet D-handle with mounting standoffs."""
    mat = material or mat_chrome()
    cx, cy, cz = center
    hl = length * 0.5
    sign = -1.0 if facing in ('-Y', '-X') else 1.0

    if facing in ('-Y', '+Y'):
        fy = cy + sign * standoff
        my = cy + sign * (standoff * 0.85)
        if axis == 'Z':
            pts = [
                (cx, cy, cz - hl),
                (cx, my, cz - hl * 0.92),
                (cx, fy, cz),
                (cx, my, cz + hl * 0.92),
                (cx, cy, cz + hl)
            ]
        else:
            pts = [
                (cx - hl, cy, cz),
                (cx - hl * 0.92, my, cz),
                (cx, fy, cz),
                (cx + hl * 0.92, my, cz),
                (cx + hl, cy, cz)
            ]
    else:
        fx = cx + sign * standoff
        mx = cx + sign * (standoff * 0.85)
        if axis == 'Z':
            pts = [
                (cx, cy, cz - hl),
                (mx, cy, cz - hl * 0.92),
                (fx, cy, cz),
                (mx, cy, cz + hl * 0.92),
                (cx, cy, cz + hl)
            ]
        else:
            pts = [
                (cx, cy - hl, cz),
                (mx, cy - hl * 0.92, cz),
                (fx, cy, cz),
                (mx, cy + hl * 0.92, cz),
                (cx, cy + hl, cz)
            ]

    return create_curved_tube(name, pts, radius=radius, resolution=8, bevel_res=5, material=mat)


# ==============================================================================
# 4. HARD-SURFACE APPLIANCE & CHASSIS GENERATOR: create_appliance_chassis(...)
# ==============================================================================
def create_recessed_box(name, location, dimensions, cavity_face='-Y',
                        margin=(0.04, 0.04), cavity_depth=0.08,
                        outer_mat=None, inner_mat=None, bevel=0.012):
    """
    Creates a genuine hard-surface box with a physically inset and negatively extruded
    3D cavity on the target face ('-Y', '+Y', '+Z', '+X', '-X').
    """
    _ensure_object_mode()
    sx, sy, sz = dimensions
    bm = bmesh.new()
    bmesh.ops.create_cube(bm, size=1.0)
    for v in bm.verts:
        v.co.x *= sx
        v.co.y *= sy
        v.co.z *= sz

    bm.faces.ensure_lookup_table()
    target_face = None
    best_dot = -1.0
    face_normals = {
        '-Y': mathutils.Vector((0, -1, 0)),
        '+Y': mathutils.Vector((0, 1, 0)),
        '+Z': mathutils.Vector((0, 0, 1)),
        '-Z': mathutils.Vector((0, 0, -1)),
        '+X': mathutils.Vector((1, 0, 0)),
        '-X': mathutils.Vector((-1, 0, 0)),
    }
    wanted_n = face_normals.get(cavity_face, mathutils.Vector((0, -1, 0)))

    for f in bm.faces:
        f.normal_update()
        d = f.normal.dot(wanted_n)
        if d > best_dot:
            best_dot = d
            target_face = f

    if target_face is not None:
        m_thick = min(margin[0], margin[1])
        res = bmesh.ops.inset_individual(bm, faces=[target_face], thickness=m_thick, depth=0.0)
        # Re-find the inset center face (still pointing along wanted_n and smallest center offset)
        bm.faces.ensure_lookup_table()
        inner_face = target_face
        ext = bmesh.ops.extrude_discrete_faces(bm, faces=[inner_face])
        extruded_face = ext['faces'][0]
        bmesh.ops.translate(
            bm,
            verts=extruded_face.verts,
            vec=(-wanted_n.x * cavity_depth, -wanted_n.y * cavity_depth, -wanted_n.z * cavity_depth)
        )
        if inner_mat is not None:
            extruded_face.material_index = 1
            for e in extruded_face.edges:
                for lf in e.link_faces:
                    if lf != extruded_face:
                        lf.material_index = 1

    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()

    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = location
    if outer_mat:
        obj.data.materials.append(outer_mat)
    if inner_mat:
        obj.data.materials.append(inner_mat)
    apply_bevel_and_normals(obj, bevel_width=bevel, segments=3)
    return obj


def create_framed_glass_door(prefix, center, size, frame_width=0.035, frame_mat=None,
                             glass_mat=None, facing='-Y'):
    """Builds a hollow 4-bar beveled door frame with a separate translucent glass pane."""
    f_mat = frame_mat or mat_dark_steel()
    g_mat = glass_mat or mat_tinted_glass(f"{prefix}_DoorGlass", (0.14, 0.18, 0.22), alpha=0.45)
    cx, cy, cz = center
    parts = []

    if facing in ('-Y', '+Y'):
        w, d, h = size
        fw = min(frame_width, w * 0.28, h * 0.28)
        iw = max(0.02, w - 2 * fw)
        ih = max(0.02, h - 2 * fw)
        top_b = create_box(f"{prefix}_ft", (cx, cy, cz + h * 0.5 - fw * 0.5), (w, d, fw), f_mat, bevel=0.005)
        bot_b = create_box(f"{prefix}_fb", (cx, cy, cz - h * 0.5 + fw * 0.5), (w, d, fw), f_mat, bevel=0.005)
        lft_b = create_box(f"{prefix}_fl", (cx - w * 0.5 + fw * 0.5, cy, cz), (fw, d, ih), f_mat, bevel=0.005)
        rgt_b = create_box(f"{prefix}_fr", (cx + w * 0.5 - fw * 0.5, cy, cz), (fw, d, ih), f_mat, bevel=0.005)
        pane = create_box(f"{prefix}_gl", (cx, cy, cz), (iw, d * 0.35, ih), g_mat, bevel=0.0)
        parts.extend([top_b, bot_b, lft_b, rgt_b, pane])
    else:
        d, w, h = size
        fw = min(frame_width, w * 0.28, h * 0.28)
        iw = max(0.02, w - 2 * fw)
        ih = max(0.02, h - 2 * fw)
        top_b = create_box(f"{prefix}_ft", (cx, cy, cz + h * 0.5 - fw * 0.5), (d, w, fw), f_mat, bevel=0.005)
        bot_b = create_box(f"{prefix}_fb", (cx, cy, cz - h * 0.5 + fw * 0.5), (d, w, fw), f_mat, bevel=0.005)
        lft_b = create_box(f"{prefix}_fl", (cx, cy - w * 0.5 + fw * 0.5, cz), (d, fw, ih), f_mat, bevel=0.005)
        rgt_b = create_box(f"{prefix}_fr", (cx, cy + w * 0.5 - fw * 0.5, cz), (d, fw, ih), f_mat, bevel=0.005)
        pane = create_box(f"{prefix}_gl", (cx, cy, cz), (d * 0.35, iw, ih), g_mat, bevel=0.0)
        parts.extend([top_b, bot_b, lft_b, rgt_b, pane])

    return parts


def create_appliance_chassis(name, size, location=(0, 0, 0), body_mat=None, inner_mat=None,
                             bevel_width=0.014, cavity_face='-Y', cavity_margin=0.035,
                             cavity_depth=0.06, doors=None, handles=None, screens=None,
                             knobs=None, vents=None, feet_height=0.012, join_result=False):
    """
    Comprehensive hard-surface appliance generator:
    - Recessed cavity chassis with leveling feet
    - Multi-layer beveled doors (solid or hollow glass-windowed) with seam gaps
    - Independent curved handles
    - Recessed bezel screens
    - Rotary cylindrical knobs with indicator ticks
    - Slatted ventilation grilles
    Returns list of parts (or single joined object if join_result=True).
    """
    b_mat = body_mat or mat_steel()
    i_mat = inner_mat or mat_dark_steel()
    sx, sy, sz = size
    cx, cy, cz = location
    parts = []

    body_h = sz - feet_height
    body_cz = cz + feet_height + body_h * 0.5

    if cavity_depth and cavity_depth > 0:
        chassis = create_recessed_box(
            f"{name}_body", (cx, cy, body_cz), (sx, sy, body_h),
            cavity_face=cavity_face, margin=(cavity_margin, cavity_margin),
            cavity_depth=cavity_depth, outer_mat=b_mat, inner_mat=i_mat, bevel=bevel_width
        )
    else:
        chassis = create_box(f"{name}_body", (cx, cy, body_cz), (sx, sy, body_h), b_mat, bevel=bevel_width)
    parts.append(chassis)

    # 4 Appliance Leveling Feet
    if feet_height > 0:
        foot_r = min(sx, sy) * 0.08
        for fx_s in (-0.38, 0.38):
            for fy_s in (-0.36, 0.36):
                ft = create_cylinder(
                    f"{name}_ft_{fx_s}_{fy_s}",
                    (cx + fx_s * sx, cy + fy_s * sy, cz + feet_height * 0.5),
                    foot_r, feet_height, i_mat, vertices=20, bevel=0.002
                )
                parts.append(ft)

    # Doors: list of dicts {'center': (x,y,z), 'size': (w,d,h), 'mat': mat, 'glass': bool, 'frame_w': 0.035}
    for idx, dr in enumerate(doors or []):
        dc = dr['center']
        ds = dr['size']
        d_mat = dr.get('mat', b_mat)
        if dr.get('glass', False):
            parts.extend(create_framed_glass_door(
                f"{name}_dr_{idx}", dc, ds,
                frame_width=dr.get('frame_w', 0.035),
                frame_mat=d_mat,
                glass_mat=dr.get('glass_mat', None),
                facing=dr.get('facing', '-Y')
            ))
        else:
            d_obj = create_box(f"{name}_dr_{idx}", dc, ds, d_mat, bevel=dr.get('bevel', 0.008))
            parts.append(d_obj)

    # Handles: list of dicts {'center': (x,y,z), 'length': 0.22, 'axis': 'Z', 'facing': '-Y', 'mat': mat}
    for idx, hd in enumerate(handles or []):
        h_obj = create_curved_handle(
            f"{name}_hnd_{idx}",
            center=hd['center'],
            length=hd.get('length', 0.20),
            standoff=hd.get('standoff', 0.028),
            radius=hd.get('radius', 0.008),
            axis=hd.get('axis', 'Z'),
            facing=hd.get('facing', '-Y'),
            material=hd.get('mat', mat_chrome())
        )
        parts.append(h_obj)

    # Screens: list of dicts {'center': (x,y,z), 'size': (w,d,h), 'color': (...), 'rotation': (0,0,0)}
    for idx, sc in enumerate(screens or []):
        sc_c = sc['center']
        sc_s = sc['size']
        sc_rot = sc.get('rotation', (0, 0, 0))
        bezel = create_box(f"{name}_scb_{idx}", sc_c, (sc_s[0] + 0.014, sc_s[1], sc_s[2] + 0.014),
                           i_mat, bevel=0.003, rotation=sc_rot)
        scr_mat = mat_screen(sc.get('color', (0.18, 0.72, 0.90, 1.0)), sc.get('strength', 1.5), f"{name}_ScrMat_{idx}")
        disp = create_box(f"{name}_scd_{idx}", (sc_c[0], sc_c[1] - 0.002, sc_c[2]),
                          (sc_s[0], sc_s[1], sc_s[2]), scr_mat, bevel=0.001, rotation=sc_rot)
        parts.extend([bezel, disp])

    # Knobs: list of dicts {'center': (x,y,z), 'radius': 0.018, 'depth': 0.016, 'rotation': (pi/2,0,0), 'mat': mat}
    for idx, kb in enumerate(knobs or []):
        kc = kb['center']
        kr = kb.get('radius', 0.018)
        kd = kb.get('depth', 0.016)
        krot = kb.get('rotation', (math.radians(90), 0, 0))
        k_ring = create_cylinder(f"{name}_kbr_{idx}", kc, kr * 1.15, kd * 0.35, i_mat, vertices=24, bevel=0.002, rotation=krot)
        k_dial = create_cylinder(f"{name}_kbd_{idx}", kc, kr, kd, kb.get('mat', mat_chrome()), vertices=24, bevel=0.003, rotation=krot)
        parts.extend([k_ring, k_dial])

    # Vents: list of dicts {'start': (x,y,z), 'step': (dx,dy,dz), 'count': 5, 'slot_size': (w,d,h)}
    for idx, vt in enumerate(vents or []):
        vx, vy, vz = vt['start']
        dx, dy, dz = vt.get('step', (0, 0, 0.016))
        ss = vt.get('slot_size', (0.004, 0.14, 0.006))
        for vi in range(vt.get('count', 5)):
            sl = create_box(f"{name}_vnt_{idx}_{vi}", (vx + vi * dx, vy + vi * dy, vz + vi * dz), ss, i_mat, bevel=0.001)
            parts.append(sl)

    if join_result:
        return join_as_named_object(parts, name)
    return parts


def create_draped_tablecloth(name, center_xy, top_z, table_radius=0.74, drop_height=0.22,
                             pleats=16, material=None):
    """Creates a round draped fabric tablecloth with flat tabletop contact at top_z and pleated skirt."""
    _ensure_object_mode()
    mat = material or mat_linen_white()
    cx, cy = center_xy
    segs = 64
    bm = bmesh.new()

    center_v = bm.verts.new((cx, cy, top_z))
    # Ring 0: inner top surface
    # Ring 1: rounded table rim
    # Rings 2..5: draped pleated skirt
    ring_specs = [
        (table_radius * 0.96, top_z, 0.0),
        (table_radius * 1.005, top_z - 0.014, 0.004),
        (table_radius * 1.020, top_z - drop_height * 0.28, 0.014),
        (table_radius * 1.040, top_z - drop_height * 0.65, 0.026),
        (table_radius * 1.060, top_z - drop_height, 0.036),
    ]

    rings = []
    for r_base, z_base, wave_amp in ring_specs:
        ring = []
        for s in range(segs):
            ang = (2.0 * math.pi * s) / segs
            wave = math.sin(ang * pleats) * wave_amp
            rr = r_base + wave
            zz = z_base + (math.cos(ang * pleats) * wave_amp * 0.25 if wave_amp > 0.02 else 0.0)
            ring.append(bm.verts.new((cx + rr * math.cos(ang), cy + rr * math.sin(ang), zz)))
        rings.append(ring)

    bm.verts.ensure_lookup_table()
    for s in range(segs):
        sn = (s + 1) % segs
        bm.faces.new((center_v, rings[0][s], rings[0][sn]))

    for r_i in range(len(rings) - 1):
        ra = rings[r_i]
        rb = rings[r_i + 1]
        for s in range(segs):
            sn = (s + 1) % segs
            bm.faces.new((ra[s], rb[s], rb[sn], ra[sn]))

    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    mesh = bpy.data.meshes.new(name)
    bm.to_mesh(mesh)
    bm.free()

    obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    obj.data.materials.append(mat)
    set_smooth_normals(obj, auto_angle_deg=None)
    return obj


# ==============================================================================
# OBJECT JOINING & EXACT SURFACE PLACEMENT ENGINE
# ==============================================================================
def join_as_named_object(parts_list, exact_name, location=None):
    """
    Bakes modifiers on each sub-part, joins them into a single clean mesh named
    exact_name (both Object AND Mesh datablock name!), and sets origin to geometry bounds.
    """
    _ensure_object_mode()
    valid_objs = [o for o in parts_list if o and o.name in bpy.data.objects]
    if not valid_objs:
        return None

    for o in valid_objs:
        bake_modifiers(o)

    if len(valid_objs) == 1:
        single = valid_objs[0]
        single.name = exact_name
        if single.data:
            single.data.name = exact_name
        bpy.ops.object.select_all(action='DESELECT')
        single.select_set(True)
        bpy.context.view_layer.objects.active = single
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
        bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
        if location is not None:
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
    if combined.data:
        combined.data.name = exact_name
    bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
    if location is not None:
        combined.location = location
        bpy.context.view_layer.update()
    return combined


def join_objects(final_name, objs, location=None):
    return join_as_named_object(objs, final_name, location)


def get_object_bounds(obj):
    """Returns exact world-space (min_x, max_x, min_y, max_y, min_z, max_z) from mesh vertices."""
    bpy.context.view_layer.update()
    mw = obj.matrix_world
    if obj.type == 'MESH' and obj.data and len(obj.data.vertices) > 0:
        xs, ys, zs = [], [], []
        for v in obj.data.vertices:
            wv = mw @ v.co
            xs.append(wv.x)
            ys.append(wv.y)
            zs.append(wv.z)
        return (min(xs), max(xs), min(ys), max(ys), min(zs), max(zs))
    world_bb = [mw @ mathutils.Vector(corner) for corner in obj.bound_box]
    return (
        min(v.x for v in world_bb), max(v.x for v in world_bb),
        min(v.y for v in world_bb), max(v.y for v in world_bb),
        min(v.z for v in world_bb), max(v.z for v in world_bb)
    )


def place_on_surface(obj, surface_x, surface_y, surface_top_z, rotation=None):
    """
    Evaluates exact world-space geometry bounds of obj and positions it so:
      - lowest vertex (min_z) rests millimeter-accurately on surface_top_z
      - horizontal bounding center sits at (surface_x, surface_y)
    """
    if not obj:
        return None
    _ensure_object_mode()
    bake_modifiers(obj)
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')

    if rotation is not None:
        obj.rotation_euler = rotation
        bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
        bpy.ops.object.origin_set(type='ORIGIN_GEOMETRY', center='BOUNDS')
    bpy.context.view_layer.update()

    min_x, max_x, min_y, max_y, min_z, _ = get_object_bounds(obj)
    center_x = (min_x + max_x) * 0.5
    center_y = (min_y + max_y) * 0.5

    obj.location.x += (surface_x - center_x)
    obj.location.y += (surface_y - center_y)
    obj.location.z += (surface_top_z - min_z)

    bpy.context.view_layer.update()
    return obj


# ==============================================================================
# ARCHITECTURAL ISOMETRIC STUDIO DIORAMA BUILDER
# ==============================================================================
def add_bounds_anchor(radius_x=8.0, radius_y=7.0):
    """Symmetric micro-anchor at Z=0 ensuring Three.js Box3 centers cleanly at (0, 0, 0)."""
    mat_anc = mat_dark_walnut()
    b1 = create_box("Anchor_Min", (-radius_x, -radius_y, 0.0005), (0.001, 0.001, 0.001), mat_anc, bevel=0.0)
    b2 = create_box("Anchor_Max", (radius_x, radius_y, 0.0005), (0.001, 0.001, 0.001), mat_anc, bevel=0.0)
    return join_as_named_object([b1, b2], "World_Bounds_Anchor")


def _build_detailed_floor(base_name, fx, fy, floor_style, floor_mat):
    """Generates beveled planks, grouted tiles, or inlaid marble floor with top at Z=0.0."""
    parts = []
    plinth_mat = get_material(f"{base_name}_Plinth", base_color=(0.14, 0.14, 0.16, 1.0), roughness=0.55)
    # Architectural sub-floor plinth base (Z = -0.14 .. -0.015)
    sub_slab = create_box(f"{base_name}_SubPlinth", (0, 0, -0.075), (fx, fy, 0.13), plinth_mat, bevel=0.006)
    parts.append(sub_slab)

    if floor_style in ('planks', 'parquet'):
        mat_a = floor_mat or mat_warm_wood()
        mat_b = mat_parquet_alt() if floor_style == 'parquet' else get_material(
            f"{base_name}_PlankAlt", base_color=(0.52, 0.35, 0.20, 1.0), roughness=0.40
        )
        plank_w = 0.80
        num_cols = int(round(fx / plank_w))
        actual_w = fx / num_cols
        for col in range(num_cols):
            px = -fx * 0.5 + (col + 0.5) * actual_w
            # Split each column into 2 staggered plank lengths for authentic joinery
            split_y = 0.8 if (col % 2 == 0) else -0.8
            len1 = (split_y - (-fy * 0.5))
            len2 = (fy * 0.5 - split_y)
            p1 = create_box(f"{base_name}_plk1_{col}", (px, -fy * 0.5 + len1 * 0.5, -0.008),
                            (actual_w - 0.006, len1 - 0.006, 0.016),
                            mat_a if col % 2 == 0 else mat_b, bevel=0.003, segments=2)
            p2 = create_box(f"{base_name}_plk2_{col}", (px, split_y + len2 * 0.5, -0.008),
                            (actual_w - 0.006, len2 - 0.006, 0.016),
                            mat_b if col % 2 == 0 else mat_a, bevel=0.003, segments=2)
            parts.extend([p1, p2])

    elif floor_style == 'tiles':
        grout_bed = create_box(f"{base_name}_GroutBed", (0, 0, -0.012), (fx, fy, 0.010),
                               get_material("Tile_Grout", (0.68, 0.70, 0.72, 1.0), roughness=0.7), bevel=0.0)
        parts.append(grout_bed)
        t_mat = floor_mat or mat_commercial_tile()
        nx, ny = 10, 8
        tw, th = fx / nx, fy / ny
        for ix in range(nx):
            for iy in range(ny):
                tx = -fx * 0.5 + (ix + 0.5) * tw
                ty = -fy * 0.5 + (iy + 0.5) * th
                tile = create_box(f"{base_name}_tl_{ix}_{iy}", (tx, ty, -0.005),
                                  (tw - 0.010, th - 0.010, 0.010), t_mat, bevel=0.002, segments=2)
                parts.append(tile)

    elif floor_style == 'marble':
        m_mat = floor_mat or mat_black_marble()
        base_m = create_box(f"{base_name}_MarbleBase", (0, 0, -0.008), (fx, fy, 0.016), m_mat, bevel=0.003)
        parts.append(base_m)
        # Inlaid brass & travertine border frame
        inlay_mat = mat_gold()
        bx, by = fx * 0.43, fy * 0.42
        b_n = create_box(f"{base_name}_mi_n", (0, by, -0.0005), (bx * 2, 0.06, 0.002), inlay_mat, bevel=0.0)
        b_s = create_box(f"{base_name}_mi_s", (0, -by, -0.0005), (bx * 2, 0.06, 0.002), inlay_mat, bevel=0.0)
        b_e = create_box(f"{base_name}_mi_e", (bx, 0, -0.0005), (0.06, by * 2, 0.002), inlay_mat, bevel=0.0)
        b_w = create_box(f"{base_name}_mi_w", (-bx, 0, -0.0005), (0.06, by * 2, 0.002), inlay_mat, bevel=0.0)
        parts.extend([b_n, b_s, b_e, b_w])

    elif floor_style == 'scifi':
        s_mat = floor_mat or mat_sci_fi_metal()
        sub = create_box(f"{base_name}_DeckSub", (0, 0, -0.012), (fx, fy, 0.010), mat_dark_steel(), bevel=0.0)
        parts.append(sub)
        nx, ny = 8, 7
        tw, th = fx / nx, fy / ny
        for ix in range(nx):
            for iy in range(ny):
                tx = -fx * 0.5 + (ix + 0.5) * tw
                ty = -fy * 0.5 + (iy + 0.5) * th
                plate = create_box(f"{base_name}_dk_{ix}_{iy}", (tx, ty, -0.005),
                                   (tw - 0.018, th - 0.018, 0.010), s_mat, bevel=0.004, segments=2)
                parts.append(plate)
    else:
        flr = create_box(f"{base_name}_Floor", (0, 0, -0.008), (fx, fy, 0.016), floor_mat or mat_warm_wood(), bevel=0.003)
        parts.append(flr)

    return parts


def _build_wall_sconce(prefix, pos, facing='-Y'):
    """Builds an architectural brass & frosted-glass studio wall sconce."""
    x, y, z = pos
    dy = -0.06 if facing == '-Y' else 0.0
    dx = 0.06 if facing == '+X' else 0.0
    plate = create_cylinder(f"{prefix}_pl", (x, y, z), 0.055, 0.018, mat_gold(),
                            rotation=(math.radians(90), 0, 0) if facing == '-Y' else (0, math.radians(90), 0))
    arm = create_box(f"{prefix}_ar", (x + dx * 0.6, y + dy * 0.6, z - 0.02), (0.04, 0.06, 0.025), mat_gold(), bevel=0.003)
    shade = create_cylinder(f"{prefix}_sh", (x + dx * 1.4, y + dy * 1.4, z + 0.08),
                            0.045, 0.18, mat_screen((0.96, 0.86, 0.65, 1.0), 1.3, f"{prefix}_WarmGlow"),
                            radius2=0.065)
    return [plate, arm, shade]


def build_isometric_room(base_name, floor_size=(16.0, 14.0), floor_mat=None, wall_mat=None,
                         baseboard_mat=None, north_y=6.0, west_x=-7.0, wall_height=3.6,
                         wall_thick=0.26, has_window=True, window_pos=(-1.5, 6.0, 2.0),
                         window_size=(3.2, 1.8), rug_config=None, floor_style='planks',
                         wainscot=False, add_sconces=True):
    """
    Constructs a detailed Studio Isometric Diorama:
    - Detailed beveled plank / grouted tile / inlaid marble / sci-fi floor with top at Z = 0.0
    - Molded stepped baseboards, top wall crown coping, optional wainscoting
    - Framed multi-pane architectural window with mullions, sill & glass
    - Warm architectural wall sconces
    - Harmonious studio rug (zero hot-pink)
    All joined into <base_name>_Diorama so Three.js treats it as environment.
    """
    parts = []
    fx, fy = floor_size
    # Rich warm architectural slate-taupe wall (Zero blinding pure-white)
    w_mat = wall_mat or get_material(f"{base_name}_WallMat", base_color=(0.38, 0.42, 0.48, 1.0), roughness=0.65)
    bb_mat = baseboard_mat or mat_dark_walnut()

    # 1. Detailed Floor System (Top surface strictly at Z = 0.0)
    parts.extend(_build_detailed_floor(base_name, fx, fy, floor_style, floor_mat))

    # 2. Optional Studio Rug (with border trim)
    if rug_config:
        rc_x, rc_y, rs_x, rs_y, r_mat, is_circ = rug_config
        if is_circ:
            rug_border = create_cylinder(f"{base_name}_RugBdr", (rc_x, rc_y, 0.005), rs_x * 0.5 + 0.05, 0.010, mat_gold(), vertices=48, bevel=0.003)
            rug = create_cylinder(f"{base_name}_Rug", (rc_x, rc_y, 0.009), rs_x * 0.5, 0.012, r_mat, vertices=48, bevel=0.004)
            parts.extend([rug_border, rug])
        else:
            rug = create_box(f"{base_name}_Rug", (rc_x, rc_y, 0.007), (rs_x, rs_y, 0.014), r_mat, bevel=0.006)
            parts.append(rug)

    # 3. L-Shaped Architectural Walls
    nw_len = (fx * 0.5) - (west_x - wall_thick * 0.5)
    nw_center_x = (west_x - wall_thick * 0.5) + (nw_len * 0.5)
    ww_len = (north_y + wall_thick * 0.5) - (-fy * 0.5)
    ww_center_y = (-fy * 0.5) + (ww_len * 0.5)

    if has_window and window_pos:
        wx, wy, wz = window_pos
        w_w, w_h = window_size
        left_len = (wx - w_w * 0.5) - (west_x - wall_thick * 0.5)
        if left_len > 0.1:
            left_cx = (west_x - wall_thick * 0.5) + left_len * 0.5
            parts.append(create_box(f"{base_name}_NW_L", (left_cx, north_y, wall_height * 0.5),
                                    (left_len, wall_thick, wall_height), w_mat, bevel=0.01))
        right_len = (fx * 0.5) - (wx + w_w * 0.5)
        if right_len > 0.1:
            right_cx = (wx + w_w * 0.5) + right_len * 0.5
            parts.append(create_box(f"{base_name}_NW_R", (right_cx, north_y, wall_height * 0.5),
                                    (right_len, wall_thick, wall_height), w_mat, bevel=0.01))
        top_h = wall_height - (wz + w_h * 0.5)
        if top_h > 0.05:
            parts.append(create_box(f"{base_name}_NW_Top", (wx, north_y, wz + w_h * 0.5 + top_h * 0.5),
                                    (w_w, wall_thick, top_h), w_mat, bevel=0.01))
        bot_h = wz - w_h * 0.5
        if bot_h > 0.05:
            parts.append(create_box(f"{base_name}_NW_Bot", (wx, north_y, bot_h * 0.5),
                                    (w_w, wall_thick, bot_h), w_mat, bevel=0.01))

        # Hollow Multi-Pane Architectural Window Frame, Mullions, Glass & Molded Sill
        parts.extend(create_framed_glass_door(
            f"{base_name}_Win", (wx, north_y, wz), (w_w + 0.12, wall_thick + 0.06, w_h + 0.12),
            frame_width=0.07, frame_mat=bb_mat, glass_mat=mat_glass(), facing='-Y'
        ))
        # Vertical & Horizontal Window Mullions
        mull_v = create_box(f"{base_name}_WinMV", (wx, north_y, wz), (0.035, 0.06, w_h), bb_mat, bevel=0.004)
        mull_h = create_box(f"{base_name}_WinMH", (wx, north_y, wz + 0.12), (w_w, 0.06, 0.035), bb_mat, bevel=0.004)
        win_sill = create_box(f"{base_name}_WinSill", (wx, north_y - 0.10, wz - w_h * 0.5 - 0.03),
                              (w_w + 0.30, 0.38, 0.065), bb_mat, bevel=0.012)
        parts.extend([mull_v, mull_h, win_sill])
    else:
        parts.append(create_box(f"{base_name}_Wall_North", (nw_center_x, north_y, wall_height * 0.5),
                                (nw_len, wall_thick, wall_height), w_mat, bevel=0.01))

    # West Wall
    parts.append(create_box(f"{base_name}_Wall_West", (west_x, ww_center_y, wall_height * 0.5),
                            (wall_thick, ww_len, wall_height), w_mat, bevel=0.01))

    # 4. Stepped Molded Baseboards (Zócalos moldurados de 2 capas) & Crown Coping
    bb_y = north_y - wall_thick * 0.5 - 0.018
    bb_x = west_x + wall_thick * 0.5 + 0.018
    parts.append(create_box(f"{base_name}_BB_N1", (nw_center_x, bb_y, 0.075), (nw_len, 0.036, 0.15), bb_mat, bevel=0.006))
    parts.append(create_box(f"{base_name}_BB_N2", (nw_center_x, bb_y - 0.008, 0.155), (nw_len, 0.022, 0.035), bb_mat, bevel=0.005))
    parts.append(create_box(f"{base_name}_BB_W1", (bb_x, ww_center_y, 0.075), (0.036, ww_len, 0.15), bb_mat, bevel=0.006))
    parts.append(create_box(f"{base_name}_BB_W2", (bb_x + 0.008, ww_center_y, 0.155), (0.022, ww_len, 0.035), bb_mat, bevel=0.005))

    # Top Cutaway Wall Coping Cap
    parts.append(create_box(f"{base_name}_Cap_N", (nw_center_x, north_y, wall_height + 0.02),
                            (nw_len + 0.04, wall_thick + 0.06, 0.04), bb_mat, bevel=0.008))
    parts.append(create_box(f"{base_name}_Cap_W", (west_x, ww_center_y, wall_height + 0.02),
                            (wall_thick + 0.06, ww_len + 0.04, 0.04), bb_mat, bevel=0.008))

    # Optional Wainscoting Chair Rail (for Bistro / Hotel)
    if wainscot:
        parts.append(create_box(f"{base_name}_Wain_N", (nw_center_x, bb_y, 1.02), (nw_len, 0.035, 0.05), bb_mat, bevel=0.008))
        parts.append(create_box(f"{base_name}_Wain_W", (bb_x, ww_center_y, 1.02), (0.035, ww_len, 0.05), bb_mat, bevel=0.008))

    # 5. Architectural Wall Sconces
    if add_sconces:
        parts.extend(_build_wall_sconce(f"{base_name}_Sc1", (3.6, north_y - wall_thick * 0.5, 2.35), facing='-Y'))
        parts.extend(_build_wall_sconce(f"{base_name}_Sc2", (west_x + wall_thick * 0.5, -1.8, 2.35), facing='+X'))

    return join_as_named_object(parts, f"{base_name}_Diorama")


def export_glb(filepath):
    """Exports active scene as Y-up binary GLB with all modifiers applied and node transforms preserved, then optimizes with gltfpack -cc -kn."""
    _ensure_object_mode()
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=filepath,
        export_format='GLB',
        export_apply=True,
        export_yup=True
    )
    size_raw_kb = os.path.getsize(filepath) / 1024.0
    print(f"[EXPORT RAW] {filepath} ({size_raw_kb:.1f} KB)")

    # Run gltfpack optimization with -cc and -kn (keep node names for interactive raycasting)
    gltfpack_bin = r"C:\Tools\gltfpack\gltfpack.exe"
    if not os.path.isfile(gltfpack_bin):
        gltfpack_bin = "gltfpack"

    opt_path = filepath.replace(".glb", "_opt.glb")
    bak_path = filepath.replace(".glb", ".bak.glb")
    try:
        import subprocess
        res = subprocess.run([gltfpack_bin, "-i", filepath, "-o", opt_path, "-cc", "-kn"],
                             capture_output=True, text=True)
        if res.returncode == 0 and os.path.isfile(opt_path) and os.path.getsize(opt_path) > 1000:
            if os.path.isfile(bak_path):
                try: os.remove(bak_path)
                except Exception: pass
            os.replace(filepath, bak_path)
            os.replace(opt_path, filepath)
            opt_kb = os.path.getsize(filepath) / 1024.0
            print(f"[GLTFPACK OK] {filepath} optimized: {size_raw_kb:.1f} KB -> {opt_kb:.1f} KB (-kn preserved nodes)")
        else:
            print(f"[GLTFPACK NOTICE] code {res.returncode}: {res.stderr or res.stdout}")
    except Exception as e:
        print(f"[GLTFPACK WARNING] Could not run gltfpack: {e}")
