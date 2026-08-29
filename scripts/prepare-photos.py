"""Build local WebP assets from the original photographs. Requires Pillow.

Run from anywhere with Python. Originals are never modified. photo-sources.json
keeps stable IDs even if more files are later added to the source folders.
"""
from pathlib import Path
import hashlib
import json
from PIL import Image, ImageOps

SITE = Path(__file__).resolve().parents[1]
WORKSPACE = SITE.parent
SOURCES = json.loads((SITE / "scripts/photo-sources.json").read_text(encoding="utf-8"))
EXCLUDED = {
    "andres-01": "Promotional graphic rather than a photograph of an installation.",
    "andres-06": "Phone screenshot with social-media interface and large borders.",
}
CAPTIONS = {
    "andres": [
        "", "Red de gas para equipos de cocina", "Detalle de tubería y válvulas de gas",
        "Instalación de gas en cocina comercial", "Distribución de gas en área de cocina", "",
        "Tubería de gas junto a campana extractora", "Cilindros y conexiones de gas LP",
        "Línea de gas sobre pared",
    ],
    "juanpablo": [
        "Distribución de agua con control de presión", "Detalle de conexiones y manómetro",
        "Tuberías y tanque de presión", "Registro para almacenamiento de agua",
        "Tuberías de conexión en terreno", "Conexiones en el interior de un depósito",
        "Sistema de bombeo exterior", "Bomba y tablero de control en exterior",
        "Detalle de filtros y conexiones", "Sistema de filtración y distribución de agua",
        "Tanque de almacenamiento conectado", "Tuberías junto a tanque de almacenamiento",
        "Equipo de filtración en cuarto técnico", "Detalle del equipo de filtración",
        "Distribución hidráulica y control de presión", "Sistema de presión con tanque azul",
        "Instalación de tuberías y tanque de presión", "Conjunto de presión y tablero de control",
        "Red de distribución con tanque de presión", "Vista lateral de la red de distribución",
        "Detalle de válvulas y conexiones hidráulicas", "Red hidráulica en cuarto técnico",
        "Equipo de bombeo y tanque de presión", "Conexiones de agua y tablero de control",
        "Detalle de tablero y manómetro", "Distribución de tubería y válvulas",
        "Instalación hidráulica sobre pared", "Detalle de equipo de bombeo",
        "Bomba conectada a tanque de presión", "Válvulas y tuberías en espacio técnico",
        "Equipos de bombeo en caseta", "Conjunto de bombas y controles",
        "Distribución de válvulas en registro", "Red de válvulas y tubería PVC",
        "Detalle de conexiones de distribución", "Sistema de distribución y control de agua",
        "Conexiones de tubería en exterior", "Conexiones entre tanques de almacenamiento",
        "Batería de tanques para almacenamiento de agua", "Tanque de presión y red de válvulas",
        "Conexiones verticales con tanque de presión", "Instalación de tanque y distribución hidráulica",
        "Detalle de bomba y conexiones en PVC", "Equipo de bombeo con control y manómetro",
        "Sistema hidráulico con tanque de presión", "Tanque y conexiones de distribución de agua",
    ],
    "marvin": [
        "Estructura metálica para ampliación con contenedores", "Puerta y acabados de acceso",
        "Cubierta sobre estructura de techo", "Portón metálico con malla",
        "Cerramiento perimetral en malla", "Estructura metálica para cubierta",
        "Portón de acceso en estructura metálica", "Rejilla metálica para canal de desagüe",
    ],
}
OWNERS = {
    "Andres": ("Andrés Garita", "gas"),
    "JuanPablo": ("Juan Pablo", "agua"),
    "Marvin": ("Marvin", "obra"),
}

output = SITE / "public/trabajos"
output.mkdir(parents=True, exist_ok=True)
photos = []
for item in SOURCES:
    if item["id"] in EXCLUDED:
        continue
    source = WORKSPACE / Path(item["source"].replace("\\", "/"))
    if hashlib.sha256(source.read_bytes()).hexdigest() != item["sha256"]:
        raise ValueError(f"Source changed; review before replacing: {source}")
    prefix, number = item["id"].rsplit("-", 1)
    caption = CAPTIONS[prefix][int(number)-1]
    owner, service = OWNERS[item["owner"]]
    with Image.open(source) as original:
        photo = ImageOps.exif_transpose(original).convert("RGB")
        photo.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
        photo.save(output / f"{item['id']}.webp", quality=83, method=6)
        thumbnail = photo.copy()
        thumbnail.thumbnail((480, 720), Image.Resampling.LANCZOS)
        thumbnail.save(output / f"{item['id']}-thumb.webp", quality=78, method=6)
        photos.append({
            "id": item["id"], "owner": owner, "serviceId": service,
            "caption": caption, "alt": f"{caption}. Trabajo de {owner}.",
            "src": f"/trabajos/{item['id']}.webp",
            "thumbnail": f"/trabajos/{item['id']}-thumb.webp",
            "width": photo.width, "height": photo.height,
            "thumbnailWidth": thumbnail.width, "thumbnailHeight": thumbnail.height,
        })
(SITE / "app/data").mkdir(parents=True, exist_ok=True)
(SITE / "app/data/photos.json").write_text(
    json.dumps(photos, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print(f"Prepared {len(photos)} photographs in two sizes; originals preserved.")
print(f"Total web assets: {sum(p.stat().st_size for p in output.glob('*.webp'))/1024/1024:.2f} MB")
