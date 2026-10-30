import os
import sys
import time

script_dir = os.path.dirname(os.path.abspath(__file__))
if script_dir not in sys.path:
    sys.path.append(script_dir)

import generate_worlds
import generate_soccer
import generate_hedbanz

def run():
    start_t = time.time()
    print("======================================================================")
    print("🚀 STARTING BLENDER AUTOMATION: GLB GENERATION & PBR EXPORT")
    print("======================================================================")
    
    print("\n>>> PHASE 1: GENERATING 7 WORLDS GLB PACKAGES...")
    generate_worlds.build_house()
    generate_worlds.build_supermarket()
    generate_worlds.build_restaurant()
    generate_worlds.build_hotel()
    generate_worlds.build_dating()
    generate_worlds.build_garden()
    generate_worlds.build_space()

    print("\n>>> PHASE 2: GENERATING MASTERGOAL 3D SOCCER PACK...")
    generate_soccer.build_soccer()

    print("\n>>> PHASE 3: GENERATING HEDBANZ 3D PACK...")
    generate_hedbanz.build_hedbanz()

    elapsed = time.time() - start_t
    print("======================================================================")
    print(f"✨ ALL 9 3D PACKAGES GENERATED AND EXPORTED IN {elapsed:.2f}s!")
    print("======================================================================")

if __name__ == "__main__":
    run()
