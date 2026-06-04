"""
Replaces all Temple.webp hero backgrounds with a pure CSS crimson/gold gradient.
Run: python scripts/patch-heroes.py
"""
import re, os

# ── New hero background (replaces background-image + size + position lines) ──
NEW_BG = (
    "  background:\n"
    "    radial-gradient(ellipse 160% 100% at 50% -15%, rgba(212,175,55,0.22) 0%, transparent 55%),\n"
    "    radial-gradient(ellipse 90% 140% at 0% 55%, rgba(155,47,64,0.28) 0%, transparent 50%),\n"
    "    radial-gradient(ellipse 90% 140% at 100% 55%, rgba(155,47,64,0.28) 0%, transparent 50%),\n"
    "    linear-gradient(158deg, #2D0710 0%, #7B1F2E 42%, #9B2F40 70%, #5A1020 100%);\n"
)

# Pattern: background-image: url('..Temple.webp') + background-size + background-position lines
IMG_LINE      = re.compile(r"  background-image: url\('/Assets/Temple\.webp'\);\n")
SIZE_LINE     = re.compile(r"  background-size: cover;\n")
POSITION_LINE = re.compile(r"  background-position: [^\n]+;\n")

# New ::before — decorative gold dot grid instead of dark overlay
OLD_BEFORE = re.compile(
    r"(\.hero::before\s*\{[^}]*?)background:\s*\n?"
    r"\s*linear-gradient[^;]+;(\s*\n[^}]*)?(\s*linear-gradient[^;]+;)?",
    re.DOTALL
)

NEW_BEFORE_BG = (
    "  background-image: radial-gradient(circle, rgba(212,175,55,0.28) 1px, transparent 1px);\n"
    "  background-size: 28px 28px;\n"
    "  opacity: 0.55;\n"
)

# Files to patch
FILES = [
    r"c:\Users\anvit\OneDrive\Documents\Website\next-app\src\components\StaticPages\static.module.css",
    r"c:\Users\anvit\OneDrive\Documents\Website\next-app\src\app\m\membership\membership.module.css",
    r"c:\Users\anvit\OneDrive\Documents\Website\next-app\src\app\d\membership\membership.module.css",
    r"c:\Users\anvit\OneDrive\Documents\Website\next-app\src\app\m\signup\signup.module.css",
    r"c:\Users\anvit\OneDrive\Documents\Website\next-app\src\app\d\signup\signup.module.css",
    r"c:\Users\anvit\OneDrive\Documents\Website\next-app\src\app\m\login\login.module.css",
    r"c:\Users\anvit\OneDrive\Documents\Website\next-app\src\app\d\login\login.module.css",
    r"c:\Users\anvit\OneDrive\Documents\Website\next-app\src\app\m\dashboard\dashboard.module.css",
    r"c:\Users\anvit\OneDrive\Documents\Website\next-app\src\components\LikedPage\liked.module.css",
]

def patch(path):
    if not os.path.exists(path):
        print("  SKIP (file not found):", path)
        return
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    changed = False

    # 1. Replace background-image line
    if IMG_LINE.search(content):
        content = IMG_LINE.sub(NEW_BG, content)
        # Remove the now-redundant background-size and background-position lines
        content = SIZE_LINE.sub("", content)
        content = POSITION_LINE.sub("", content)
        changed = True
        print("  OK  background replaced")
    else:
        print("  --  no Temple.webp found, skipping")

    if changed:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("  Saved:", os.path.basename(path))

print("Patching hero backgrounds...\n")
for f in FILES:
    print(os.path.basename(os.path.dirname(f)) + "/" + os.path.basename(f))
    patch(f)
    print()
print("Done.")
