// Christmas Craft 2026 - xmas-decor area (startup).
// Source: data/integration-spec-xmas-decor-2026-10-27.md, "Patches we must write" 1.
// Removes the Macaw's Holidays Halloween/autumn set from its creative tab. The items stay
// registered (existing placed blocks keep working); recipes are disabled in
// moonlight-global-datapacks/christmas-craft-fixes and JEI hiding is in client_scripts/xmas-decor.js.
// Tab ids read from com/mcwholidays/kikoz/init/TabInit.class <clinit>: HALLOWEENITEMGROUP is
// registered as "mcwholidays" ("Macaw's Holidays (Autumn)"), CHRISTMASITEMGROUP as "christmas". [R]

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

const xmasDecorHideHalloween = event => {
  XMAS_DECOR_MCW_HALLOWEEN.forEach(id => event.remove('mcwholidays:' + id))
}
StartupEvents.modifyCreativeTab('mcwholidays:mcwholidays', xmasDecorHideHalloween)
StartupEvents.modifyCreativeTab('mcwholidays:christmas', xmasDecorHideHalloween)
