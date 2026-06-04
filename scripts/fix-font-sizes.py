"""
Fixes all unreadably small font-size values across every CSS module.
Only touches font-size declarations, nothing else.

Mapping rationale (base 18px):
  0.42rem = 7.5px  → 0.72rem = 13px
  0.44rem = 7.9px  → 0.72rem = 13px
  0.46rem = 8.3px  → 0.72rem = 13px
  0.48rem = 8.6px  → 0.74rem = 13.3px
  0.50rem = 9.0px  → 0.76rem = 13.7px
  0.52rem = 9.4px  → 0.76rem = 13.7px
  0.54rem = 9.7px  → 0.78rem = 14px
  0.55rem = 9.9px  → 0.78rem = 14px
  0.56rem = 10.1px → 0.80rem = 14.4px
  0.58rem = 10.4px → 0.80rem = 14.4px
  0.60rem = 10.8px → 0.82rem = 14.8px
  0.62rem = 11.2px → 0.82rem = 14.8px
  0.65rem = 11.7px → 0.84rem = 15.1px
  Body text:
  0.70rem = 12.6px → 0.90rem = 16.2px
  0.72rem = 13.0px → 0.92rem = 16.6px
  0.75rem = 13.5px → 0.94rem = 16.9px
  0.76rem = 13.7px → 0.94rem = 16.9px
  0.78rem = 14.0px → 0.96rem = 17.3px
  0.80rem = 14.4px → 0.96rem = 17.3px
  0.82rem = 14.8px → 0.98rem = 17.6px
"""
import re, os, glob

# font-size value → replacement
MAP = {
    # Cinzel label sizes (these were unreadably tiny)
    '0.42rem': '0.72rem',
    '0.44rem': '0.72rem',
    '0.45rem': '0.72rem',
    '0.46rem': '0.72rem',
    '0.48rem': '0.74rem',
    '0.5rem':  '0.76rem',
    '0.52rem': '0.76rem',
    '0.54rem': '0.78rem',
    '0.55rem': '0.78rem',
    '0.56rem': '0.80rem',
    '0.58rem': '0.80rem',
    '0.6rem':  '0.82rem',
    '0.62rem': '0.82rem',
    '0.65rem': '0.84rem',
    '0.68rem': '0.86rem',
    # Body text sizes (borderline small)
    '0.7rem':  '0.92rem',
    '0.72rem': '0.92rem',
    '0.75rem': '0.95rem',
    '0.76rem': '0.95rem',
    '0.78rem': '0.96rem',
    '0.8rem':  '0.96rem',
    '0.82rem': '0.98rem',
}

# Pattern: matches "font-size: <value>;" or "font-size: <value>,"
# Handles both inline and property declarations
FS_RE = re.compile(r'(font-size:\s*)(' + '|'.join(re.escape(k) for k in sorted(MAP, key=len, reverse=True)) + r')(\s*[;,}])')

css_files = glob.glob(
    r'c:\Users\anvit\OneDrive\Documents\Website\next-app\src\**\*.css',
    recursive=True
)

total_changes = 0

for path in sorted(css_files):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    count = [0]
    def replace(m):
        old_val = m.group(2)
        new_val = MAP[old_val]
        count[0] += 1
        return m.group(1) + new_val + m.group(3)

    new_content = FS_RE.sub(replace, content)

    if count[0]:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"  {count[0]:3d} fixes  {os.path.relpath(path, r'c:\Users\anvit\OneDrive\Documents\Website\next-app\src')}")
        total_changes += count[0]

print(f"\nTotal: {total_changes} font-size values updated across {len(css_files)} CSS files.")
