// Christmas Craft 2026 - xmas-decor area (client).
// Source: data/integration-spec-xmas-decor-2026-10-27.md, "Patches we must write" 1, 4, 5.
// Hides recipe-viewer (JEI) entries only. Dusty's and Alpine Whispers' fairy lights are back (Alex,
// 2026-11-07), renamed in kubejs/assets so they don't share the Fairy Lights mod's name. The Macaw's
// Halloween set is back (Alex, 2026-11-02: it is modded Minecraft, don't remove content for theme).

RecipeViewerEvents.removeEntries('item', event => {
  // Patch 5: Hearth & Timber compat-wood items for absent mods (BloomingNature, Vinery,
  // Vanilla Backport, Beachparty, Meadow). Their recipes are already mod_loaded-conditional and
  // the creative tab already skips them; JEI still lists them. arolla_pine is kept
  // (Alpine Whispers is installed).
  event.remove(/^hearth_and_timber:(aspen|baobab|cactus|chestnut|cypress|ebony|fan_palm|fir|larch|swamp_cypress|swamp_oak|dark_cherry|pale_oak|palm|pine)_(beam|board|pillar|railing|shingles|shingle_slab|shingle_stairs|support|window_casing|window|window_pane)$/)
})
