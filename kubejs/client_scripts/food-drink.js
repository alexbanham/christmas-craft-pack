// Christmas Craft 2026 - food-drink area (client).
// Source: data/integration-spec-food-drink-2026-10-27.md, patches P5-P9.
// Hides recipe-viewer (JEI) entries only. The recipe side lives in
// moonlight-global-datapacks/christmas-craft-fixes (create_confectionery, create_bic_bit,
// create_wrapped and christmascraft/recipe/food_drink). [R] verify in JEI.

RecipeViewerEvents.removeEntries('item', event => {
  // P8: Confectionery off-theme items (tool, disc and block recipes are disabled in the datapack).
  const caneTools = ['axe', 'hoe', 'pickaxe', 'shovel', 'sword']
  caneTools.forEach(t => event.remove('create_confectionery:candy_cane_' + t))
  event.remove('create_confectionery:the_bright_side') // music disc, audio licence unknown
  event.remove('create_confectionery:little_gingerbread_man_spawn_egg')
  event.remove('create_confectionery:create_confectionery_icon')

  // P6: Snowy Spirit owns the candy cane (Confectionery's mixing recipe now outputs it).
  event.remove('create_confectionery:candy_cane')
  event.remove('create_confectionery:candy_cane_block') // its 2x2 recipe is disabled (clashed with Snowy Spirit's)

  // P5: Ratatouille owns cocoa butter/powder; Confectionery's pressing/crushing chain is disabled.
  event.remove('create_confectionery:cocoa_butter')
  event.remove('create_confectionery:cocoa_powder')
  event.remove('create_confectionery:crushed_cocoa')

  // P7: Fried Delights owns fries; Bitterballen's fryer now turns potato sticks into french_fries.
  event.remove('create_bic_bit:fries')
  event.remove('create_bic_bit:raw_fries')

  // P9: Display Delight plates for mods that are not in the pack. Prefix -> source mod read from
  // the jar: fd_ = Festive Delight (held), fr_ = Farmer's Respite (installed, kept), bnc_ =
  // Brewin' and Chewin' (kept); unprefixed, plated_* and small_* are Farmer's Delight (kept).
  event.remove(/^displaydelight:(abd|acd|ad|cd|crd|ctd|df|ed|edd|erd|fd|lm|md|mnd|nd|od|pd)_/)
})
