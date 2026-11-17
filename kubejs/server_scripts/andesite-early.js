// Christmas Craft 2026 - andesite without finding it.
// Terralith turns off Minecraft's underground andesite, granite and diorite by default (its placed features have
// count 0; only its Andesite Caves biome has andesite), and Create's first step, andesite alloy, needs andesite.
// Friends found no andesite on the server on 2026-11-17 (Alex: "we cant play without the andesite").
// So: one cobblestone and one gravel make two andesite, like vanilla's cobblestone + diorite. Terralith's own
// vanilla_stone_gen module is also switched on in config/terralith.json, but only for terrain generated afterwards.

ServerEvents.recipes(event => {
  event.shapeless('2x minecraft:andesite', ['minecraft:cobblestone', 'minecraft:gravel'])
    .id('christmascraft:andesite_from_cobblestone_and_gravel')
})
