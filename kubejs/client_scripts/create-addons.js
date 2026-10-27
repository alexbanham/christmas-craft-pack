// Christmas Craft 2026 - create-addons area (client).
// Source: data/integration-spec-create-addons-2026-10-27.md, "Patches we must write" 1, 2, 4, 6.
// Hides recipe-viewer (JEI) entries only; items stay registered and craftable. [R] verify in JEI.

RecipeViewerEvents.removeEntries('item', event => {
  // Patch 4: dev item with no recipe.
  event.remove('bits_n_bobs:test_rope')

  // Patch 1: one zinc sheet. createdeco:zinc_sheet is the only pressing output
  // (createaddition/createcasing pressing recipes are disabled in christmas-craft-fixes);
  // every consumer uses the c:plates/zinc tag, which all three sheets are in.
  event.remove('createaddition:zinc_sheet')
  event.remove('createcasing:zinc_sheet')

  // Patch 2: Ratatouille owns "Cake Base"; the C&A base chain is disabled in christmas-craft-fixes.
  event.remove('createaddition:cake_base')
  event.remove('createaddition:cake_base_baked')

  // Bits 'n' Bobs chairs: recipes are switched off by featureFlags.blocks.chairs=false
  // (config/bits_n_bobs-common.toml); Interiors owns chairs. Hide the still-registered blocks.
  event.remove(/^bits_n_bobs:[a-z_]+_chair$/)

  // Patch 6: JEI clutter. Hide non-festive Design n' Decor dye colours; keep red, green, white
  // and the material sets (brass, copper, gold, andesite, ...).
  event.remove(/^dndecor:(orange|magenta|light_blue|yellow|lime|pink|gray|light_gray|cyan|purple|blue|brown|black)_/)
})
