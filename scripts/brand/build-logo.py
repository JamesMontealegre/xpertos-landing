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
  <linearGradient id="{p}xb" x1="0" y1="164" x2="0" y2="400" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#1678D6"/><stop offset=".5" stop-color="#04286F"/><stop offset="1" stop-color="#0A62C6"/></linearGradient>
  <linearGradient id="{p}wm" x1="0" y1="218" x2="0" y2="345" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="{NAVY_TOP}"/><stop offset="1" stop-color="{NAVY_BOTTOM}"/></linearGradient>
  <linearGradient id="{p}hb" x1="612" y1="420" x2="300" y2="640" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#0A7FE6"/><stop offset=".5" stop-color="#0451B0"/><stop offset="1" stop-color="#01236A"/></linearGradient>
  <linearGradient id="{p}hk" x1="612" y1="0" x2="745" y2="0" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#044CA9"/><stop offset="1" stop-color="#1478D6"/></linearGradient>
  <linearGradient id="{p}ho" x1="650" y1="400" x2="950" y2="700" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="{ORANGE_LIGHT}"/><stop offset=".45" stop-color="{ORANGE_MID}"/><stop offset="1" stop-color="{ORANGE_DARK}"/></linearGradient>
</defs>'''

# ---------- X ----------
def x_mark(p):
    orange = 'M84,198 L172,198 L240,282 L124,393 L40,393 L154,282 Z'
    blue_top = 'M270,164 L360,164 L233,274 L194,229 Z'
    blue_bot = 'M270,400 L360,400 L233,290 L194,335 Z'
    return (f'<path d="{orange}" fill="url(#{p}xo)" stroke="url(#{p}xo)" stroke-width="6" stroke-linejoin="round"/>'
            # filete blanco que separa los trazos azules del naranja
            f'<g fill="#fff" stroke="#fff" stroke-width="16" stroke-linejoin="round"><path d="{blue_top}"/><path d="{blue_bot}"/></g>'
            # trazos azules con esquinas suavizadas
            f'<g fill="url(#{p}xb)" stroke="url(#{p}xb)" stroke-width="5" stroke-linejoin="round"><path d="{blue_top}"/><path d="{blue_bot}"/></g>')

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
              'L990,624 V655 H925 V912 Q925,920 917,920 H852 V948 H634 Z')
    out = []
    out.append(f'<path d="{blue}" fill="url(#{p}hb)"/>')
    out.append(f'<path d="{orange}" fill="url(#{p}ho)"/>')
    # Conector superior (naranja entra en la mitad azul) con filete blanco
    up = 'M634,512 C614,512 612,498 594,497 C565,496 547,515 547,538 C547,561 565,580 594,579 C612,578 614,564 634,564'
    out.append(f'<path d="{up}" fill="none" stroke="#fff" stroke-width="26"/>')
    out.append(f'<path d="M646,512 H634 {up[9:]} H646 Z" fill="url(#{p}ho)"/>')
    # Conector inferior (azul entra en la mitad naranja) con filete blanco
    low = 'M612,744 C640,744 644,722 682,721 C724,720 746,745 746,771 C746,799 722,819 690,819 C652,819 646,797 612,797'
    out.append(f'<path d="{low}" fill="none" stroke="#fff" stroke-width="26"/>')
    out.append(f'<path d="M600,744 H612 {low[9:]} H600 Z" fill="url(#{p}hk)"/>')
    # Ventana 2x2
    out.append('<g fill="#fff"><rect x="727" y="592" width="51" height="51"/><rect x="796" y="592" width="52" height="51"/>'
               '<rect x="727" y="660" width="51" height="52"/><rect x="796" y="660" width="52" height="52"/></g>')
    # Pieza inferior tipo cerradura (contorno blanco dentro de la mitad naranja)
    out.append('<path d="M776,952 C776,930 786,914 786,896 A46,46 0 1 1 838,896 C838,910 842,920 854,920 H860" '
               'fill="none" stroke="#fff" stroke-width="15" stroke-linecap="butt"/>')
    # Herramientas en blanco (martillo y brocha) sobre la mitad azul
    hammer = ('M347,601 C372,578 412,560 452,561 C492,562 520,584 541,608 L562,630 L583,652 L543,692 L522,671 L500,650 '
              'L322,815 V752 L446,637 C452,622 450,604 436,595 C414,583 380,590 347,601 Z')
    brush_block = 'M422,767 L492,700 L575,785 L505,852 Z'
    brush_handle = ('M413,772 L503,857 C490,856 470,846 452,850 C420,858 380,905 336,948 H306 V905 Z')
    out.append(f'<g fill="#fff"><path d="{hammer}"/><path d="{brush_block}"/><path d="{brush_handle}"/></g>')
    # Separación entre el bloque de cerdas y la virola, y la grieta de las cerdas
    out.append(f'<path d="M418,770 L500,850" stroke="url(#{p}hb)" stroke-width="9"/>')
    out.append(f'<path d="M466,790 L524,729 L518,746 Z" fill="url(#{p}hb)"/>')
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
mark = svg('243 285 760 760', defs('b') + house('b'), 'Xpertos')
wordmark_only = svg('30 150 1190 262', defs('c') + x_mark('c') + wordmark('c'), 'Xpertos')

# Horizontal: casa a la izquierda + XPERTOS a la derecha (sin lema)
hs = 0.40   # escala de la casa
ws = 0.62   # escala del wordmark
house_g = f'<g transform="translate({-256*hs:.1f} {-383*hs:.1f}) scale({hs})">{house("d")}</g>'
house_w, house_h = 734 * hs, 565 * hs
word_h = 237 * ws
word_y = (house_h - word_h) / 2 + 6
word_x = house_w + 28
word_g = f'<g transform="translate({word_x - 40*ws:.1f} {word_y - 163*ws:.1f}) scale({ws})">{x_mark("d")}{wordmark("d")}</g>'
total_w = word_x + 1165 * ws
horizontal = svg(f'0 0 {total_w:.0f} {house_h:.0f}', defs('d') + house_g + word_g, 'Xpertos')

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
      f'export const LOGO_XML = `{strip(full)}`;\n\n'
      f'export const LOGO_HORIZONTAL_XML = `{strip(horizontal)}`;\n\n'
      f'export const LOGO_MARK_XML = `{strip(mark)}`;\n\n'
      '/** Proporciones (ancho / alto) según el viewBox de cada variante. */\n'
      f'export const LOGO_RATIO = {1214/930:.4f};\n'
      f'export const LOGO_HORIZONTAL_RATIO = {total_w/house_h:.4f};\n')
with open(os.path.join(OUT, 'brand-logo.ts'), 'w') as f:
    f.write(ts)

for name, content in [('xpertos-logo.svg', full), ('xpertos-mark.svg', mark), ('xpertos-wordmark.svg', wordmark_only), ('xpertos-horizontal.svg', horizontal)]:
    with open(os.path.join(OUT, name), 'w') as f:
        f.write(content)
    print(name, len(content))
