# Christmas Craft — pack source

A [packwiz](https://packwiz.infra.link) modpack (Minecraft 1.21.1, NeoForge) that updates itself on every launch.

| Branch | Channel URL | Used by |
|---|---|---|
| `testing` | `https://alexbanham.github.io/christmas-craft-pack/testing/pack.toml` | Alex, first |
| `stable` | `https://alexbanham.github.io/christmas-craft-pack/stable/pack.toml` | Friends' launchers and the server |

**Playing?** Download the launcher once: **[ChristmasCraft-Launcher.zip](https://github.com/alexbanham/christmas-craft-pack/releases/latest/download/ChristmasCraft-Launcher.zip)** (Windows). Unzip, open `prismlauncher.exe`, sign in, double-click *Christmas Craft*. It updates itself from then on.

**Release:** commit to `testing` → play it → `scripts/promote.sh` (always a `--no-ff` merge; Pages keys deploys by commit SHA, so a fast-forward never goes live). Pages redeploys in about a minute; CDN caching can add up to 10 minutes.

Mods are fetched from their official Modrinth/CurseForge downloads. This repo contains only metadata and our own files.
