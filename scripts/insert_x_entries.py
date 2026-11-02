# -*- coding: utf-8 -*-
with open('js/world3d_dictionaries.js', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''    "term": "Write up",
    "pron": "/raɪt ʌp/",
    "meaning": "Redactar un reporte formal de incidencias laborales",
    "example": "El supervisor had to write up un reporte sobre el accidente en la obra."
  },'''

replacement = '''    "term": "Write up",
    "pron": "/raɪt ʌp/",
    "meaning": "Redactar un reporte formal de incidencias laborales",
    "example": "El supervisor had to write up un reporte sobre el accidente en la obra."
  },
  {
    "term": "X out",
    "pron": "/ɛks aʊt/",
    "meaning": "Tachar con una cruz o eliminar renglones de una lista",
    "example": "Tacha con tinta roja: please X out the names of anyone who canceled."
  },
  {
    "term": "X off",
    "pron": "/ɛks ɔːf/",
    "meaning": "Tachar o marcar casillas conforme se completan los pendientes",
    "example": "Conforme liquides pendientes, make sure to X off each item on your board."
  },'''

# Try both CRLF and LF
if target in content:
    content = content.replace(target, replacement, 1)
    with open('js/world3d_dictionaries.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Reemplazo exitoso (LF)")
elif target.replace('\n', '\r\n') in content:
    content = content.replace(target.replace('\n', '\r\n'), replacement.replace('\n', '\r\n'), 1)
    with open('js/world3d_dictionaries.js', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Reemplazo exitoso (CRLF)")
else:
    print("Target no encontrado")
