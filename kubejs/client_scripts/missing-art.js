// Christmas Craft 2026 - hide items whose art belongs to mods that are not in the pack (client).
// Generated from a test client log (missing textures from mynethersdelight, create_shimmer, createnuclear,
// createnetherindustry, twilightforest). Recipes for them never load without those mods. [R] verify in JEI.

RecipeViewerEvents.removeEntries('item', event => {
  event.remove('create_connected:fan_enriched_catalyst')
  event.remove('create_connected:fan_glooming_catalyst')
  event.remove('create_connected:fan_soul_stripping_catalyst')
  event.remove('create_connected:fan_transmutation_catalyst')
  event.remove('displaydelight:mnd_plated_chilidog')
})
