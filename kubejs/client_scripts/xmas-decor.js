// Christmas Craft 2026 - xmas-decor area (client).
// Source: data/integration-spec-xmas-decor-2026-10-27.md, "Patches we must write" 1, 4, 5.
// Hides recipe-viewer (JEI) entries only. Recipes for the Macaw's Halloween set and Dusty's
// fairy_lights are disabled in moonlight-global-datapacks/christmas-craft-fixes; creative-tab
// removal is in startup_scripts/xmas-decor.js. [R] verify in JEI.

// Patch 1: Macaw's Holidays Halloween/autumn set (68 recipe outputs from the spec), plus three
// recipe-less Halloween blocks that also have item models (bat_awake, happy_ghost, haunting_ghost).
// Shared with startup_scripts/xmas-decor.js (keep the two lists identical).
const XMAS_DECOR_MCW_HALLOWEEN = [
  'bat_doormat', 'bat_sleeping', 'bat_wall_deco_1', 'bat_wall_deco_2', 'bat_wall_deco_3',
  'carved_evil_pumpkin', 'carved_friendly_pumpkin', 'carved_screaming_pumpkin', 'carved_shocked_pumpkin', 'carved_smile_pumpkin',
  'lit_evil_pumpkin', 'lit_friendly_pumpkin', 'lit_screaming_pumpkin', 'lit_shocked_pumpkin', 'lit_smile_pumpkin',
  'small_pumpkin', 'medium_pumpkin', 'large_pumpkin', 'pair_of_pumpkins', 'three_pumpkins',
  'pumpkin_balloon', 'pumpkin_doormat', 'pumpkin_wall_deco_1', 'pumpkin_wall_deco_2', 'pumpkin_wheelbarrow',
  'ghost', 'ghost_balloon', 'ghost_doormat', 'ghost_wall_deco_1', 'ghost_wall_deco_2',
  'chaotic_cobweb', 'cornered_cobweb', 'half_cobweb', 'hanging_cobweb', 'outlined_cobweb', 'pyramid_cobweb', 'spooky_cobweb', 'triangle_cobweb',
  'gravestone', 'flat_gravestone', 'flat_dirt_gravestone', 'slanted_gravestone', 'small_gravestone', 'square_gravestone', 'tall_gravestone',
  'stone_cross', 'wooden_cross', 'ground_skeleton', 'sitting_skeleton', 'skeleton_balloon',
  'spider_balloon', 'spider_wall_deco_1', 'spider_wall_deco_2',
  'witch_cauldron', 'witch_hat', 'witch_hat_wall_deco_1', 'witch_hat_wall_deco_2', 'standing_broomstick',
  'single_potion', 'pair_of_potions', 'three_potions', 'cat_wall_deco_1',
  // autumn-farm props: the spec says the owner may keep these; hidden by default
  'scarecrow', 'hay_wheelbarrow', 'laying_hay_bale', 'standing_hay_bale', 'standing_rake', 'standing_shovel'
]
const XMAS_DECOR_MCW_HALLOWEEN_NO_RECIPE = ['bat_awake', 'happy_ghost', 'haunting_ghost']

RecipeViewerEvents.removeEntries('item', event => {
  XMAS_DECOR_MCW_HALLOWEEN.concat(XMAS_DECOR_MCW_HALLOWEEN_NO_RECIPE)
    .forEach(id => event.remove('mcwholidays:' + id))

  // Patch 4: functional duplicate of the Fairy Lights mod.
  event.remove('dustydecorations:fairy_lights')

  // Patch 5: Hearth & Timber compat-wood items for absent mods (BloomingNature, Vinery,
  // Vanilla Backport, Beachparty, Meadow). Their recipes are already mod_loaded-conditional and
  // the creative tab already skips them; JEI still lists them. arolla_pine is kept
  // (Alpine Whispers is installed).
  event.remove(/^hearth_and_timber:(aspen|baobab|cactus|chestnut|cypress|ebony|fan_palm|fir|larch|swamp_cypress|swamp_oak|dark_cherry|pale_oak|palm|pine)_(beam|board|pillar|railing|shingles|shingle_slab|shingle_stairs|support|window_casing|window|window_pane)$/)
})
