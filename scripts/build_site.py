#!/usr/bin/env python3
"""Build the download page (Pages root) from a channel checkout.

    python3 scripts/build_site.py --pack _site/stable [--testing _site/testing] --out _site

Version and mod list come from --pack (stable: what the download button installs). Mod titles
and descriptions come from the Modrinth API; if that is unreachable the page still builds from the
.pw.toml names. Images and the favicon live in site/assets and are copied next to index.html, so
the page loads nothing from other hosts and works from its own folder.
"""
import argparse, html, json, os, shutil, tomllib, urllib.parse, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
REPO = os.environ.get("GITHUB_REPOSITORY", "alexbanham/christmas-craft-pack")
OWNER, NAME = REPO.split("/", 1)
SITE = f"https://{OWNER.lower()}.github.io/{NAME}/"  # absolute base for the Open Graph tags
ASSET = "ChristmasCraft-Launcher.zip"
DOWNLOAD = f"https://github.com/{REPO}/releases/latest/download/{ASSET}"
UA = {"User-Agent": f"{REPO} site builder (github.com/{REPO})"}


def get_json(url):
    headers = dict(UA)
    if url.startswith("https://api.github.com/") and os.environ.get("GITHUB_TOKEN"):
        headers["Authorization"] = "Bearer " + os.environ["GITHUB_TOKEN"]  # runner IPs share the anonymous rate limit
    with urllib.request.urlopen(urllib.request.Request(url, headers=headers), timeout=20) as r:
        return json.load(r)


def plain(text):
    """Drop emoji and other pictographic symbols from mod titles."""
    return "".join(ch for ch in text if ord(ch) < 0x2190 or 0x2E80 <= ord(ch) < 0x1F000).strip()


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
        m["desc"] = plain(p.get("description", ""))
        m["url"] = f"https://modrinth.com/mod/{p.get('slug') or m['mr']}" if m["mr"] else None
        m["lib"] = "library" in p.get("categories", [])  # primary categories only; extras over-tag
    mods.sort(key=lambda m: (m["lib"], m["title"].lower()))

    out = []
    e = html.escape
    for m in mods:
        tags = ('<span class="tag">client</span>' if m["side"] == "client" else "") + \
               ('<span class="tag">library</span>' if m["lib"] else "")
        name = f'<a href="{e(m["url"])}">{e(m["title"])}</a>' if m["url"] else e(m["title"])
        desc = f'<span class="mod-desc">{e(m["desc"])}</span>' if m["desc"] else ""
        cls = "mod lib" if m["lib"] else "mod"
        out.append(f'          <li class="{cls}"><span class="mod-name">{name}{tags}</span>{desc}</li>')
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
        "site_url": SITE,
        "testing_note": testing_note,
        "mod_rows": rows,
        "mod_count": str(count),
    }
    page = (ROOT / "site" / "template.html").read_text(encoding="utf-8")
    for k, v in values.items():
        page = page.replace("{{" + k + "}}", v)
    assert "{{" not in page, "unfilled placeholder in template"

    a.out.mkdir(parents=True, exist_ok=True)
    (a.out / "index.html").write_text(page, encoding="utf-8", newline="\n")
    (a.out / "assets").mkdir(exist_ok=True)
    for f in (ROOT / "site" / "assets").iterdir():
        if f.is_file():
            shutil.copy2(f, a.out / "assets" / f.name)
    print(f"built {a.out / 'index.html'}: v{pack['version']}, {count} mods")


if __name__ == "__main__":
    main()
