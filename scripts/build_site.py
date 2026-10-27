#!/usr/bin/env python3
"""Build the download page (Pages root) from a channel checkout.

    python3 scripts/build_site.py --pack _site/stable [--testing _site/testing] --out _site

Version and mod list come from --pack (stable: what the download button installs). Mod titles,
icons and descriptions come from the Modrinth API; if that is unreachable the page still builds
from the .pw.toml names. The pixel art is generated here, so the page ships no game textures.
"""
import argparse, html, json, os, random, shutil, tomllib, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPO = os.environ.get("GITHUB_REPOSITORY", "alexbanham/christmas-craft-pack")
ASSET = "ChristmasCraft-Launcher.zip"
DOWNLOAD = f"https://github.com/{REPO}/releases/latest/download/{ASSET}"
UA = {"User-Agent": f"{REPO} site builder (github.com/{REPO})"}


def get_json(url):
    with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=20) as r:
        return json.load(r)


def plain(text):
    """Drop emoji and other astral-plane symbols the pixel font has no glyphs for."""
    return "".join(ch for ch in text if ord(ch) < 0x2190 or 0x2E80 <= ord(ch) < 0x1F000).strip()


def pixel_svg(rows, palette):
    """Pixel map (one char per pixel, '.' = transparent) -> data URI SVG."""
    w = max(len(r) for r in rows)
    rects = []
    for y, row in enumerate(rows):
        x = 0
        while x < len(row):
            ch, run = row[x], 1
            while x + run < len(row) and row[x + run] == ch:
                run += 1
            if ch != ".":
                rects.append(f'<rect x="{x}" y="{y}" width="{run}" height="1" fill="{palette[ch]}"/>')
            x += run
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w} {len(rows)}" shape-rendering="crispEdges">{"".join(rects)}</svg>'
    return "data:image/svg+xml," + urllib.parse.quote(svg)


TREE = [
    ".......Y.......",
    "......YYY......",
    ".......Y.......",
    ".......G.......",
    "......GgG......",
    ".....GGRGG.....",
    "......GGG......",
    ".....GgGGG.....",
    "....GGGBGgG....",
    "...GgGGGGGYG...",
    ".....GGgGG.....",
    "....GRGGGgGG...",
    "...GGGGgGGBGG..",
    "..GGYGGGGgGGGG.",
    ".GgGGGGRGGGGgGG",
    "......TTT......",
    "......TTT......",
    "..SSSSSSSSSSS..",
]
TREE_COLORS = {"Y": "#ffd93b", "G": "#2e7d32", "g": "#4caf50", "R": "#e53935", "B": "#42a5f5", "T": "#6d4c2f", "S": "#f4f8ff"}


GROUND_COLORS = {"W": "#ffffff", "w": "#eef5ff", "S": "#d3e2f5", "D": "#866043", "d": "#79553a", "k": "#593d29", "L": "#9b7653"}


def ground_tile(snowy):
    """16x16 dirt tile, optionally snow-capped, drawn from a fixed seed so every build is identical."""
    rng = random.Random(1225 if snowy else 2512)
    rows = []
    for y in range(16):
        row = ""
        for x in range(16):
            edge = 4 + (1 if (x * 7 + 3) % 5 < 2 else 0) if snowy else 0  # ragged snow line
            row += rng.choice("WwwS") if y < edge else rng.choice("DDdkL")
        rows.append(row)
    return pixel_svg(rows, GROUND_COLORS)


def mod_rows(pack):
    mods = []
    for f in sorted((pack / "mods").glob("*.pw.toml")):
        t = tomllib.loads(f.read_text(encoding="utf-8"))
        mods.append({"name": t["name"], "side": t.get("side", "both"),
                     "mr": t.get("update", {}).get("modrinth", {}).get("mod-id")})
    info = {}
    ids = [m["mr"] for m in mods if m["mr"]]
    if ids:
        try:
            for p in get_json("https://api.modrinth.com/v2/projects?ids=" + urllib.parse.quote(json.dumps(ids))):
                info[p["id"]] = p
        except Exception as e:  # page still builds, just plainer
            print(f"warning: Modrinth lookup failed ({e}); using .pw.toml names")
    for m in mods:
        p = info.get(m["mr"], {})
        m["title"] = plain(p.get("title") or m["name"])
        m["desc"] = p.get("description", "")
        m["icon"] = p.get("icon_url")
        m["url"] = f"https://modrinth.com/mod/{p.get('slug') or m['mr']}" if m["mr"] else None
        m["lib"] = "library" in p.get("categories", [])  # primary categories only; extras over-tag
    mods.sort(key=lambda m: (m["lib"], m["title"].lower()))

    out = []
    for m in mods:
        e = html.escape
        icon = f'<img src="{e(m["icon"])}" alt="" loading="lazy">' if m["icon"] else ""
        tags = ('<span class="tag">client</span>' if m["side"] == "client" else "") + \
               ('<span class="tag lib">library</span>' if m["lib"] else "")
        body = f'<span class="slot">{icon}</span><span><span class="name">{e(m["title"])}{tags}</span><span class="desc">{e(m["desc"])}</span></span>'
        inner = f'<a href="{e(m["url"])}">{body}</a>' if m["url"] else f'<a>{body}</a>'
        cls = ' class="lib-row"' if m["lib"] else ""
        out.append(f'      <li{cls}>{inner}</li>')
    return "\n".join(out), len(mods)


def release_size():
    try:
        rel = get_json(f"https://api.github.com/repos/{REPO}/releases/latest")
        size = next(a["size"] for a in rel["assets"] if a["name"] == ASSET)
        return f" &middot; {round(size / 1e6)} MB"
    except Exception as e:
        print(f"warning: release lookup failed ({e}); omitting size")
        return ""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pack", required=True, type=Path)
    ap.add_argument("--testing", type=Path)
    ap.add_argument("--out", required=True, type=Path)
    a = ap.parse_args()

    pack = tomllib.loads((a.pack / "pack.toml").read_text(encoding="utf-8"))
    testing_note = ""
    if a.testing and (a.testing / "pack.toml").exists():
        tv = tomllib.loads((a.testing / "pack.toml").read_text(encoding="utf-8"))["version"]
        if tv != pack["version"]:
            testing_note = f" (testing: v{html.escape(tv)})"
    rows, count = mod_rows(a.pack)

    values = {
        "version": html.escape(pack["version"]),
        "mc": html.escape(pack["versions"]["minecraft"]),
        "neoforge": html.escape(pack["versions"].get("neoforge", "")),
        "size": release_size(),
        "download_url": DOWNLOAD,
        "repo_url": f"https://github.com/{REPO}",
        "testing_note": testing_note,
        "mod_rows": rows,
        "mod_count": str(count),
        "tree_uri": pixel_svg(TREE, TREE_COLORS),
        "ground_uri": ground_tile(True),
        "dirt_uri": ground_tile(False),
    }
    page = (ROOT / "site" / "template.html").read_text(encoding="utf-8")
    for k, v in values.items():
        page = page.replace("{{" + k + "}}", v)
    assert "{{" not in page, "unfilled placeholder in template"

    a.out.mkdir(parents=True, exist_ok=True)
    (a.out / "index.html").write_text(page, encoding="utf-8", newline="\n")
    (a.out / "assets").mkdir(exist_ok=True)
    for f in (ROOT / "site" / "fonts").iterdir():
        shutil.copy2(f, a.out / "assets" / f.name)
    print(f"built {a.out / 'index.html'}: v{pack['version']}, {count} mods")


if __name__ == "__main__":
    main()
