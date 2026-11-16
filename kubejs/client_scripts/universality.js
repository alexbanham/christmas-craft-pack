// Christmas Craft 2026 - universality pass (client).
// Source: data/universality-2026-10-28.md. Hides recipe-viewer (JEI) entries only; the items stay
// registered. The recipe side (tags, overrides, neoforge:false stubs) lives in
// moonlight-global-datapacks/christmas-craft-fixes. [R] verify in JEI.

RecipeViewerEvents.removeEntries('item', event => {
  // U-M1: one andesite sheet and one industrial iron sheet, like the zinc sheet (create-addons.js).
  // createcasing's pressing recipes are stubbed; every createcasing recipe takes the c:plates/* tag,
  // which the createdeco sheets are in.
  event.remove('createcasing:andesite_sheet')
  event.remove('createcasing:industrial_iron_sheet')

  // U-M2: Create owns copper nuggets. Dusty Decorations' ingot -> 9 nuggets recipe used the same grid
  // input as Create's and is stubbed; its nugget -> ingot recipe stays so old stacks still convert.
  event.remove('dustydecorations:copper_nugget')

  // U-M3: Copycats+ owns these copycats. Create: Connected switches its own recipes off when Copycats+
  // has the same feature (feature_enabled_in_copycats) and ships a 1:1 conversion, so these are dead.
  const connectedCopycats = ['beam', 'block', 'board', 'box', 'catwalk', 'fence', 'fence_gate', 'slab',
    'stairs', 'vertical_step', 'wall']
  connectedCopycats.forEach(c => event.remove('create_connected:copycat_' + c))
})
