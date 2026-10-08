"""Genera el logo de Xpertos en SVG (sin dependencias de fuentes)."""
import math, os, sys

OUT = sys.argv[1] if len(sys.argv) > 1 else '.'

# ---------- Colores (muestreados del PNG original) ----------
ORANGE_LIGHT, ORANGE_MID, ORANGE_DARK = '#FDA301', '#FE7A01', '#EE4400'
BLUE_LIGHT, BLUE_MID, BLUE_DARK = '#0A84F0', '#0A3F9E', '#021F62'
NAVY_TOP, NAVY_BOTTOM = '#073A8F', '#00266B'
TAGLINE = '#032D73'
DASH = '#FF7502'

def defs(prefix):
    p = prefix
    return f'''<defs>
  <linearGradient id="{p}xo" x1="0" y1="198" x2="0" y2="393" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#FD9A00"/><stop offset="1" stop-color="#FB4A03"/></linearGradient>
  <linearGradient id="{p}xb1" x1="362" y1="164" x2="215" y2="262" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1A7AD8"/><stop offset="1" stop-color="#062E78"/></linearGradient>
  <linearGradient id="{p}xb2" x1="210" y1="318" x2="356" y2="401" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#062E78"/><stop offset="1" stop-color="#1468D2"/></linearGradient>
  <linearGradient id="{p}wm" x1="0" y1="218" x2="0" y2="345" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="{NAVY_TOP}"/><stop offset="1" stop-color="{NAVY_BOTTOM}"/></linearGradient>
  <linearGradient id="{p}hb" x1="612" y1="420" x2="300" y2="640" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0A7FE6"/><stop offset=".5" stop-color="#0451B0"/><stop offset="1" stop-color="#01236A"/></linearGradient>
  <linearGradient id="{p}hk" x1="612" y1="0" x2="745" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#044CA9"/><stop offset="1" stop-color="#1478D6"/></linearGradient>
  <linearGradient id="{p}ho" x1="650" y1="400" x2="950" y2="700" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="{ORANGE_LIGHT}"/><stop offset=".45" stop-color="{ORANGE_MID}"/><stop offset="1" stop-color="{ORANGE_DARK}"/></linearGradient>
</defs>'''

# ---------- X ----------
def x_mark(p):
    """X de dos colores: chevrón naranja y dos trazos azules del mismo grosor. Los extremos internos
    de los trazos azules son paralelos a los bordes del naranja, separados por una ranura delgada."""
    orange = 'M82,198 L172,198 L240,278 L122,393 L40,393 L152,278 Z'
    blue_top = 'M277,164 L362,164 L249,269 L212,230 Z'
    blue_bot = 'M245,292 L356,401 L257,401 L201,331 Z'
    soft = 'stroke-width="6" stroke-linejoin="round"'  # esquinas levemente redondeadas
    return (f'<path d="{orange}" fill="url(#{p}xo)" stroke="url(#{p}xo)" {soft}/>'
            f'<path d="{blue_top}" fill="url(#{p}xb1)" stroke="url(#{p}xb1)" {soft}/>'
            f'<path d="{blue_bot}" fill="url(#{p}xb2)" stroke="url(#{p}xb2)" {soft}/>')

# ---------- PERTOS (letras en caja vertical, luego itálica) ----------
H, W, G = 127, 130, 15.6
TV, TH = 36, 32  # grosor vertical / horizontal

def letter_P(x):
    b = 86  # base del ojo
    outer = f'M{x},{H} V0 H{x+W-30} Q{x+W},0 {x+W},30 V{b-30} Q{x+W},{b} {x+W-30},{b} H{x+TV} V{H} Z'
    inner = f'M{x+TV},{TH} H{x+W-TV-6} Q{x+W-TV},{TH} {x+W-TV},{TH+6} V{b-TH-6} Q{x+W-TV},{b-TH} {x+W-TV-6},{b-TH} H{x+TV} Z'
    return [(outer + ' ' + inner, 'evenodd')]

def letter_E(x):
    m1, m2 = (H - TH) / 2, (H + TH) / 2
    return [(f'M{x},0 H{x+W} V{TH} H{x+TV} V{m1} H{x+W-12} V{m2} H{x+TV} V{H-TH} H{x+W} V{H} H{x} Z', 'nonzero')]

def letter_R(x):
    parts = letter_P(x)
    leg = f'M{x+W-62},{86} H{x+W-26} L{x+W},{H} H{x+W-36} Z'
    return parts + [(leg, 'nonzero')]

def letter_T(x):
    c = x + W / 2
    return [(f'M{x},0 H{x+W} V{TH} H{c+TV/2} V{H} H{c-TV/2} V{TH} H{x} Z', 'nonzero')]

def letter_O(x):
    r = 30
    outer = f'M{x+r},0 H{x+W-r} Q{x+W},0 {x+W},{r} V{H-r} Q{x+W},{H} {x+W-r},{H} H{x+r} Q{x},{H} {x},{H-r} V{r} Q{x},0 {x+r},0 Z'
    ir = 8
    x0, x1, y0, y1 = x + TV, x + W - TV, TH, H - TH
    inner = f'M{x0+ir},{y0} H{x1-ir} Q{x1},{y0} {x1},{y0+ir} V{y1-ir} Q{x1},{y1} {x1-ir},{y1} H{x0+ir} Q{x0},{y1} {x0},{y1-ir} V{y0+ir} Q{x0},{y0} {x0+ir},{y0} Z'
    return [(outer + ' ' + inner, 'evenodd')]

def letter_S(x):
    m1, m2 = (H - TH) / 2, (H + TH) / 2
    d = (f'M{x+30},0 H{x+W} V{TH} H{x+TV} V{m1} H{x+W-30} Q{x+W},{m1} {x+W},{m1+30} V{H-30} '
         f'Q{x+W},{H} {x+W-30},{H} H{x} V{H-TH} H{x+W-TV} V{m2} H{x+30} Q{x},{m2} {x},{m2-30} V30 Q{x},0 {x+30},0 Z')
    return [(d, 'nonzero')]

def wordmark(p):
    shapes = []
    for i, fn in enumerate([letter_P, letter_E, letter_R, letter_T, letter_O, letter_S]):
        shapes += fn(i * (W + G))
    paths = ''.join(f'<path d="{d}" fill-rule="{rule}"/>' for d, rule in shapes)
    # Caja de 0..H con y hacia abajo; itálica de 14° con la línea base en y=345.
    return f'<g fill="url(#{p}wm)" transform="translate(312 345) skewX(-14) translate(0 {-H})">{paths}</g>'

# ---------- Casa ----------
def house(p):
    blue = ('M612,386 L256,600 V630 H322 V948 H612 Z')
    orange = ('M634,386 L796,494 V458 Q796,448 806,448 H862 Q872,448 872,458 V545 '
              'L990,624 V655 H925 V948 H634 Z')
    out = []
    out.append(f'<path d="{blue}" fill="url(#{p}hb)"/>')
    out.append(f'<path d="{orange}" fill="url(#{p}ho)"/>')
    # Conector superior (naranja entra en la mitad azul) con filete blanco
    # Las tres pestañas tienen la misma forma y medidas: las de la pestaña naranja superior
    # (cuello de 52, cabeza de 84 de alto, 87 de largo). La azul es su reflejo y la inferior está
    # girada 90°. Contorno blanco por fuera (13 px visibles) y relleno del degradado de su mitad.
    up = 'M634,512 C614,512 612,498 594,497 C565,496 547,515 547,538 C547,561 565,580 594,579 C612,578 614,564 634,564'
    out.append(f'<path d="{up}" fill="none" stroke="#fff" stroke-width="26"/>')
    out.append(f'<path d="M646,512 H634 {up[9:]} H646 Z" fill="url(#{p}ho)"/>')
    # Conector inferior (azul entra en la mitad naranja) con filete blanco
    low = 'M612,744 C632,744 634,730 652,729 C681,728 699,747 699,770 C699,793 681,812 652,811 C634,810 632,796 612,796'
    out.append(f'<path d="{low}" fill="none" stroke="#fff" stroke-width="26"/>')
    out.append(f'<path d="M600,744 H612 {low[9:]} H600 Z" fill="url(#{p}hk)"/>')
    # Ventana 2x2
    out.append('<g fill="#fff"><rect x="727" y="592" width="51" height="51"/><rect x="796" y="592" width="52" height="51"/>'
               '<rect x="727" y="660" width="51" height="52"/><rect x="796" y="660" width="52" height="52"/></g>')
    # Pestaña inferior: centrada en la mitad naranja, sube desde la base.
    bottom = ('M753.5,948 C753.5,928 739.5,926 738.5,908 C737.5,879 756.5,861 779.5,861 '
              'C802.5,861 821.5,879 820.5,908 C819.5,926 805.5,928 805.5,948')
    out.append(f'<path d="M753.5,956 V948 {bottom[11:]} V956" fill="none" stroke="#fff" stroke-width="26" stroke-linecap="butt"/>')
    out.append(f'<path d="{bottom} Z" fill="url(#{p}ho)"/>')
    # Herramientas en blanco (martillo y brocha), trazadas sobre el diseño original.
    hammer = ('M345,598 '
              'C375,578 410,560 450,555 C490,551 520,572 536,596 '        # arco superior de la garra
              'L539,606 C541,616 547,625 557,628 '                          # muesca del cuello
              'L582,651 L542,690 L524,672 '                                 # bloque de la cabeza
              'C518,664 520,652 510,647 C504,644 498,644 493,646 '          # muesca inferior
              'L322,816 V756 L453,627 '                                     # mango a 45°
              'C462,615 466,600 458,591 C450,583 432,582 410,585 C392,588 374,598 360,606 Z')  # interior de la garra
    brush_block = 'M422,764 L492,698 L575,785 L506,849 Z'
    brush_handle = ('M411,776 L416,775 L486,845 '                               # virola (borde junto a la ranura)
                    'C491,849 495,853 496,858 C493,861 486,860 480,857 '        # gancho al final de la virola
                    'C472,852 463,846 455,847 C448,848 440,853 433,856 '        # curva cóncava inferior
                    'C430,858 429,860 427,862 '
                    'L323,962 L293,923 L390,832 '                               # mango recto, ancho uniforme
                    'C400,826 410,814 411,800 Z')                               # curva cóncava superior
    out.append(f'<g fill="#fff"><path d="{hammer}"/><path d="{brush_block}"/><path d="{brush_handle}"/></g>')
    # Grieta de las cerdas: nace en el borde superior derecho y termina en punta.
    out.append(f'<path d="M519,730 L530,741 L471,789 Z" fill="url(#{p}hb)"/>')
    return ''.join(out)

# ---------- Lema: letras de trazo redondeado ----------
R = 13
def g_o():  return 44, f'M19,-44 H25 A{R},{R} 0 0 1 38,-31 V-19 A{R},{R} 0 0 1 25,-6 H19 A{R},{R} 0 0 1 6,-19 V-31 A{R},{R} 0 0 1 19,-44 Z', []
def g_c():  return 44, f'M38,-44 H19 A{R},{R} 0 0 0 6,-31 V-19 A{R},{R} 0 0 0 19,-6 H38', []
def g_e():  return 44, f'M6,-25 H38 V-31 A{R},{R} 0 0 0 25,-44 H19 A{R},{R} 0 0 0 6,-31 V-19 A{R},{R} 0 0 0 19,-6 H38', []
def g_s():  return 42, 'M36,-44 H15.5 A9.5,9.5 0 0 0 6,-34.5 A9.5,9.5 0 0 0 15.5,-25 H26.5 A9.5,9.5 0 0 1 36,-15.5 A9.5,9.5 0 0 1 26.5,-6 H6', []
def g_a():  return 44, f'M38,-44 V-6 M38,-44 H19 A{R},{R} 0 0 0 6,-31 V-19 A{R},{R} 0 0 0 19,-6 H38', []
def g_d():  return 44, f'M38,-72 V-6 M38,-44 H19 A{R},{R} 0 0 0 6,-31 V-19 A{R},{R} 0 0 0 19,-6 H38', []
def g_u():  return 44, f'M6,-44 V-19 A{R},{R} 0 0 0 19,-6 H38 M38,-44 V-6', []
def g_m():  return 70, f'M6,-6 V-44 H22 A{R},{R} 0 0 1 35,-31 V-6 M35,-31 A{R},{R} 0 0 1 48,-44 H51 A{R},{R} 0 0 1 64,-31 V-6', []
def g_r():  return 36, f'M6,-6 V-31 A{R},{R} 0 0 1 19,-44 H32', []
def g_v():  return 44, 'M6,-44 L22,-6 L38,-44', []
def g_i():  return 12, 'M6,-44 V-6', [(6, -62)]
def g_t():  return 38, f'M14,-68 V-19 A{R},{R} 0 0 0 27,-6 H34 M4,-44 H34', []
GLYPHS = dict(o=g_o, c=g_c, e=g_e, s=g_s, a=g_a, d=g_d, u=g_u, m=g_m, r=g_r, v=g_v, i=g_i, t=g_t)

def tagline(text, x0, baseline, target_width, color=TAGLINE):
    gap, space = 10, 26
    parts, dots, x = [], [], 0.0
    for ch in text:
        if ch == ' ':
            x += space - gap
            continue
        w, d, ds = GLYPHS[ch]()
        parts.append(f'<path transform="translate({x:.1f} 0)" d="{d}"/>')
        dots += [(x + dx, dy) for dx, dy in ds]
        x += w + gap
    width = x - gap
    k = target_width / width
    dots_svg = ''.join(f'<circle cx="{dx:.1f}" cy="{dy}" r="7.5"/>' for dx, dy in dots)
    return (f'<g transform="translate({x0} {baseline}) scale({k:.4f})">'
            f'<g fill="none" stroke="{color}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round">{"".join(parts)}</g>'
            f'<g fill="{color}">{dots_svg}</g></g>')

def dashes():
    return (f'<g stroke="{DASH}" stroke-width="10" stroke-linecap="round">'
            '<path d="M56,1021 H140"/><path d="M1112,1021 H1194"/></g>')

def svg(view_box, body, title, w=None, h=None):
    size = f' width="{w}" height="{h}"' if w else ''
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{view_box}"{size} role="img" aria-labelledby="t">'
            f'<title id="t">{title}</title>{body}</svg>\n')

TAG = 'servicios a tu medida'

full = svg('20 140 1214 930', defs('a') + x_mark('a') + wordmark('a') + house('a') + tagline(TAG, 172, 1046, 910) + dashes(),
           'Xpertos — servicios a tu medida')
mark = svg('243 285 760 760', defs('b') + house('b'), 'Xpertos')  # casa sola: ícono de la app nativa

# Dos versiones del logo: completo (casa + XPERTOS + lema) y solo XPERTOS.
# Caja del wordmark: X de x=37 a 365, letras hasta x=1202; alto de y=161 a 404 (6 px de margen).
WORDMARK_BOX = (31, 155, 1177, 255)
wordmark_only = svg(' '.join(map(str, WORDMARK_BOX)), defs('c') + x_mark('c') + wordmark('c'), 'Xpertos')

# Ícono (favicon): solo la X, centrada en un cuadrado.
icon = svg('27 108.5 348 348', defs('d') + x_mark('d'), 'Xpertos')

def mono_mark(color='#FFFFFF'):
    body = house('e').replace('#fff', '#000')
    import re
    body = re.sub(r'url\(#e[a-z]+\)', '#fff', body)
    return svg('243 285 760 760', f'<mask id="m" maskUnits="userSpaceOnUse" x="243" y="285" width="760" height="760">'
               f'<rect x="243" y="285" width="760" height="760" fill="#000"/>{body}</mask>'
               f'<rect x="243" y="285" width="760" height="760" fill="{color}" mask="url(#m)"/>', 'Xpertos')

with open(os.path.join(OUT, 'xpertos-mark-mono.svg'), 'w') as f:
    f.write(mono_mark())

def strip(x):
    """Versión para react-native-svg: sin <title> ni atributos ARIA (la accesibilidad va en el componente)."""
    import re
    x = re.sub(r'<title[^>]*>.*?</title>', '', x.strip())
    x = re.sub(r' (role|aria-labelledby)="[^"]*"', '', x)
    return x.replace('`', '')
ts = ('// Generado por xpertos-landing/scripts/brand/build-logo.py. No editar a mano.\n'
      '// SVG del logo de Xpertos para react-native-svg (SvgXml).\n\n'
      '/** Logo completo: casa, XPERTOS y el lema «servicios a tu medida». */\n'
      f'export const LOGO_XML = `{strip(full)}`;\n\n'
      '/** Solo XPERTOS (sin la casa), para encabezados. */\n'
      f'export const LOGO_WORDMARK_XML = `{strip(wordmark_only)}`;\n\n'
      '/** Proporciones (ancho / alto) según el viewBox de cada versión. */\n'
      f'export const LOGO_RATIO = {1214/930:.4f};\n'
      f'export const LOGO_WORDMARK_RATIO = {WORDMARK_BOX[2]/WORDMARK_BOX[3]:.4f};\n')
with open(os.path.join(OUT, 'brand-logo.ts'), 'w') as f:
    f.write(ts)

for name, content in [('xpertos-logo.svg', full), ('xpertos-wordmark.svg', wordmark_only), ('xpertos-icon.svg', icon), ('xpertos-mark.svg', mark)]:
    with open(os.path.join(OUT, name), 'w') as f:
        f.write(content)
    print(name, len(content))
