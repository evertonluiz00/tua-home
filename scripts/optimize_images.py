"""Gera as imagens otimizadas do site (assets/img) a partir dos originais em images/.

Uso:  python scripts/optimize_images.py

Para cada imagem gera:
  <nome>.webp     -> até 1600px no maior lado (modal / telas grandes)
  <nome>-sm.webp  -> até 640px (cards e miniaturas)
Também gera favicon, apple-touch-icon e a imagem de compartilhamento (og-image.jpg).
"""
import io
from pathlib import Path

from PIL import Image, ImageCms, ImageDraw, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "images"
OUT = ROOT / "assets" / "img"

FOLDERS = ["produtos-karsten", "fotos", "cores-bordados", "embalagens", "background", "logotipo"]
EXTS = {".jpg", ".jpeg", ".png", ".jfif", ".webp"}
SIZES = {"": 1600, "-sm": 640}
SKIP = {"paleta-cores"}

AREIA = (221, 210, 197)
MARROM = (74, 52, 38)
SRGB = ImageCms.createProfile("sRGB")


def to_srgb(img: Image.Image) -> Image.Image:
    """Converte usando o perfil de cor embutido (ex.: fotos CMYK de gráfica), evitando cores distorcidas."""
    icc = img.info.get("icc_profile")
    if not icc:
        return img
    try:
        src = ImageCms.ImageCmsProfile(io.BytesIO(icc))
        mode = "RGBA" if img.mode in ("RGBA", "LA") else "RGB"
        return ImageCms.profileToProfile(img, src, SRGB, outputMode=mode)
    except (ImageCms.PyCMSError, OSError):
        return img


def save_webp(img: Image.Image, dest: Path, max_side: int) -> None:
    im = img.copy()
    im.thumbnail((max_side, max_side), Image.LANCZOS)
    has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
    im = im.convert("RGBA" if has_alpha else "RGB")
    im.save(dest, "WEBP", quality=80, method=6)


def process_folder(folder: str) -> None:
    out_dir = OUT / folder
    out_dir.mkdir(parents=True, exist_ok=True)
    for src in sorted((SRC / folder).iterdir()):
        if src.suffix.lower() not in EXTS or src.stem in SKIP:
            continue
        with Image.open(src) as img:
            img = to_srgb(ImageOps.exif_transpose(img))
            for suffix, side in SIZES.items():
                dest = out_dir / f"{src.stem}{suffix}.webp"
                save_webp(img, dest, side)
                print(f"  {dest.relative_to(ROOT)}  ({dest.stat().st_size // 1024} KB)")


def flower_icon(alpha: Image.Image, size: int, dilate: int = 0, radius: float = 0) -> Image.Image:
    """Ícone quadrado com a flor marrom sobre fundo areia.
    dilate engrossa o traço (necessário em tamanhos pequenos); radius arredonda os cantos (0–0.5)."""
    side = int(max(alpha.size) * 1.28)
    sq = Image.new("L", (side, side), 0)
    sq.paste(alpha, ((side - alpha.width) // 2, (side - alpha.height) // 2))
    if dilate:
        sq = sq.filter(ImageFilter.MaxFilter(dilate))
    sq = sq.resize((size, size), Image.LANCZOS)
    icon = Image.new("RGBA", (size, size), AREIA + (255,))
    icon.paste(Image.new("RGBA", (size, size), MARROM + (255,)), (0, 0), sq)
    if radius:
        corners = Image.new("L", (size * 4, size * 4), 0)
        ImageDraw.Draw(corners).rounded_rectangle((0, 0, size * 4 - 1, size * 4 - 1), radius=int(size * 4 * radius), fill=255)
        icon.putalpha(corners.resize((size, size), Image.LANCZOS))
    return icon


def make_icons() -> None:
    with Image.open(SRC / "logotipo" / "logo-areia-flor.png") as logo:
        # favicon / apple-touch: somente a flor (pétalas), recortada acima da barra do "T"
        gray = logo.convert("L")
        alpha = gray.point(lambda v: max(0, min(255, int((212 - v) * 255 / (212 - 60)))))
        w, h = logo.size
        flower = alpha.crop((0, 0, int(w * 0.31), int(h * 0.325)))
        flower = flower.crop(flower.point(lambda v: 255 if v > 40 else 0).getbbox())
        flower_icon(flower, 180).convert("RGB").save(OUT / "apple-touch-icon.png", optimize=True)
        flower_icon(flower, 64, dilate=9, radius=0.22).save(OUT / "favicon.png", optimize=True)
        flower_icon(flower, 32, dilate=15, radius=0.22).save(OUT / "favicon-32.png", optimize=True)

        # og-image 1200x630 para compartilhamento (WhatsApp / Instagram)
        logo = logo.convert("RGB")
        og = Image.new("RGB", (1200, 630), AREIA)
        mark = logo.copy()
        mark.thumbnail((630, 630), Image.LANCZOS)
        og.paste(mark, ((1200 - mark.width) // 2, (630 - mark.height) // 2))
        og.save(OUT / "og-image.jpg", quality=85, optimize=True)
    print("  ícones e og-image gerados")


def make_transparent_logos() -> None:
    """Converte os logos (traço marrom sobre areia) em versões com fundo transparente."""
    sources = {"logo-areia-flor.png": "", "logo-areia.png": "-sem-flor"}
    for filename, suffix in sources.items():
        with Image.open(SRC / "logotipo" / filename) as logo:
            gray = logo.convert("L")
            bg, ink = 212, 60  # luminância aproximada do fundo areia e do traço marrom
            alpha = gray.point(lambda v: max(0, min(255, int((bg - v) * 255 / (bg - ink)))))
            bbox = alpha.point(lambda v: 255 if v > 40 else 0).getbbox()
            alpha = alpha.crop(bbox)
            for name, color in {"logo-marrom": (74, 52, 38), "logo-claro": (243, 238, 231)}.items():
                im = Image.new("RGBA", alpha.size, color + (0,))
                im.putalpha(alpha)
                im.thumbnail((900, 900), Image.LANCZOS)
                im.save(OUT / "logotipo" / f"{name}{suffix}.webp", "WEBP", quality=90, method=6)
                im.save(OUT / "logotipo" / f"{name}{suffix}.png", optimize=True)
    print("  logos transparentes gerados")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for folder in FOLDERS:
        print(f"[{folder}]")
        process_folder(folder)
    make_icons()
    make_transparent_logos()
    total = sum(f.stat().st_size for f in (ROOT / "assets").rglob("*") if f.is_file())
    print(f"Total em assets/: {total / 1024 / 1024:.1f} MB")


if __name__ == "__main__":
    main()
