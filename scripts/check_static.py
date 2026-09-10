from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlparse
import re

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / "public"


class AuditParser(HTMLParser):
    def __init__(self, filename: Path):
        super().__init__()
        self.filename = filename
        self.ids = []
        self.refs = []
        self.inline_handlers = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        for name, value in attrs.items():
            if name.lower().startswith("on"):
                self.inline_handlers.append((tag, name))
            if name in {"src", "href"} and value:
                self.refs.append(value)
            if name == "srcset" and value:
                for item in value.split(","):
                    candidate = item.strip().split()[0] if item.strip() else ""
                    if candidate:
                        self.refs.append(candidate)


def local_target(html_file: Path, ref: str):
    if ref.startswith(("#", "/", "data:", "mailto:", "tel:", "javascript:")):
        return None
    parsed = urlparse(ref)
    if parsed.scheme or parsed.netloc:
        return None
    clean = parsed.path
    if not clean:
        return None
    return (html_file.parent / clean).resolve()


def audit_html(path: Path):
    parser = AuditParser(path)
    parser.feed(path.read_text(encoding="utf-8"))

    duplicates = sorted({value for value in parser.ids if parser.ids.count(value) > 1})
    if duplicates:
        raise SystemExit(f"{path}: duplicate id(s): {', '.join(duplicates)}")
    if parser.inline_handlers:
        raise SystemExit(f"{path}: inline event handler(s) violate CSP: {parser.inline_handlers}")

    missing = []
    for ref in parser.refs:
        target = local_target(path, ref)
        if target is not None and not target.exists():
            missing.append(ref)
    if missing:
        raise SystemExit(f"{path}: missing local asset(s): {', '.join(sorted(set(missing)))}")


def audit_config():
    text = (PUBLIC / "config.js").read_text(encoding="utf-8")
    for ref in re.findall(r"['\"](\.\/assets\/[^'\"]+)['\"]", text):
        target = (PUBLIC / ref[2:]).resolve()
        if not target.exists():
            raise SystemExit(f"config.js: missing asset: {ref}")


if __name__ == "__main__":
    audit_html(PUBLIC / "index.html")
    audit_config()
    print("Static structure audit passed.")


def audit_js_selector_contracts():
    app_path = PUBLIC / "app.js"
    text = app_path.read_text(encoding="utf-8")

    direct = re.findall(r"(?<!\$)\$\([^\n;]*\)\.forEach\s*\(", text)
    if direct:
        raise SystemExit(f"{app_path}: querySelector helper $() used directly with forEach: {direct}")

    required = [
        "$$('img[data-fallback-src]').forEach(installImageFallback)",
        "const items = $$('.reveal')",
        "$$('.reveal-pending').forEach",
    ]
    missing = [snippet for snippet in required if snippet not in text]
    if missing:
        raise SystemExit(f"{app_path}: selector regression guard missing expected collection selectors: {missing}")


if __name__ == "__main__":
    audit_js_selector_contracts()
    print("JS selector contract audit passed.")
