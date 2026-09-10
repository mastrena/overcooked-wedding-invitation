from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter, ImageOps

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "public" / "assets"


def kb(path: Path) -> float:
    return path.stat().st_size / 1024


def resize_to_width(image: Image.Image, width: int) -> Image.Image:
    if image.width <= width:
        return image.copy()
    height = round(image.height * width / image.width)
    return image.resize((width, height), Image.Resampling.LANCZOS)


def save_webp(source: str, target: str, width: int, quality: int = 88, sharpen: bool = False) -> None:
    source_path = ASSETS / source
    target_path = ASSETS / target
    with Image.open(source_path) as image:
        mode = "RGBA" if "A" in image.getbands() else "RGB"
        image = image.convert(mode)
        image = resize_to_width(image, width)
        if sharpen:
            image = ImageEnhance.Sharpness(image).enhance(1.15)
            image = image.filter(ImageFilter.UnsharpMask(radius=0.9, percent=90, threshold=3))
        image.save(target_path, "WEBP", quality=quality, method=6, exact=(mode == "RGBA"))
    print(f"{source} {kb(source_path):.1f} KB -> {target} {kb(target_path):.1f} KB")


def build_hero() -> None:
    save_webp("hero-castle.jpg", "hero-castle-960.webp", 960, quality=88, sharpen=True)
    save_webp("hero-castle.jpg", "hero-castle-hd.webp", 1440, quality=90, sharpen=True)


def build_logo() -> None:
    save_webp("wedding-invitation-logo.png", "wedding-invitation-logo-720.webp", 720, quality=91)
    save_webp("wedding-invitation-logo.png", "wedding-invitation-logo.webp", 1440, quality=92)


def build_below_fold() -> None:
    for name in ("chef-platypus", "chef-crocodile", "chef-mouse", "chef-octopus"):
        save_webp(f"{name}.png", f"{name}.webp", 512, quality=90)
    save_webp("kitchen-warm.jpg", "kitchen-warm.webp", 1440, quality=87)
    save_webp("ending-bus.jpg", "ending-bus.webp", 1440, quality=87)


def build_share_card() -> None:
    source = ASSETS / "share-card-v2.png"
    target = ASSETS / "share-card-v2.jpg"
    with Image.open(source) as image:
        image = ImageOps.fit(image.convert("RGB"), (1200, 630), method=Image.Resampling.LANCZOS)
        image.save(target, "JPEG", quality=90, optimize=True, progressive=True)
    print(f"{source.name} {kb(source):.1f} KB -> {target.name} {kb(target):.1f} KB")


if __name__ == "__main__":
    build_hero()
    build_logo()
    build_below_fold()
    build_share_card()
