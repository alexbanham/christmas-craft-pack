// Christmas Craft stone formations (RESOURCE-BALANCE-2026-11.md, approved by Alex 2026-11-01).
// Lava touching a pool of these fluids cools into a stone, the way Create's honey makes limestone; the pool is not
// used up. Registered after all mods load (postInit), through NeoForge's fluid-interaction registry.
// KubeJS can only reach the registry's (fluid type, block state) constructor: a JS function, or any Java function,
// makes the constructor choice ambiguous. So lava sources form the stone too (Create's honey makes obsidian there).
// A console.error in a startup script fails the whole boot, so failures are logged as warnings.
StartupEvents.postInit(event => {
  var Reg = Java.loadClass('net.minecraft.core.registries.BuiltInRegistries')
  var RL = Java.loadClass('net.minecraft.resources.ResourceLocation')
  var FIR = Java.loadClass('net.neoforged.neoforge.fluids.FluidInteractionRegistry')
  var Info = Java.loadClass('net.neoforged.neoforge.fluids.FluidInteractionRegistry$InteractionInformation')
  var NeoForgeMod = Java.loadClass('net.neoforged.neoforge.common.NeoForgeMod')
  var lavaType = NeoForgeMod.LAVA_TYPE.value()

  var formations = [
    ['create_confectionery:black_chocolate', 'create:scorchia'],
    ['create_confectionery:white_chocolate', 'minecraft:diorite'],
    ['create_confectionery:ruby_chocolate', 'minecraft:granite'],
    ['create_confectionery:caramel', 'minecraft:dripstone_block'],
    ['christmascraft:icing', 'minecraft:calcite'],
    ['christmascraft:cranberry_punch', 'create:crimsite'],
    ['christmascraft:eggnog', 'create:ochrum'],
    ['farmersrespite:green_tea', 'create:veridium'],
    ['farmersrespite:gamblers_tea', 'create:asurine'],
    ['create_bic_bit:curdled_milk', 'alpinewhispers:alpine_gneiss'],
    ['ratatouille:compost_tea', 'hearth_and_timber:groutless_rubblestone'],
    ['farmersrespite:rose_hip_tea', 'twigs:rhyolite'],
    ['farmersrespite:black_tea', 'twigs:schist'],
    ['create_factory:sweet_berries_jam', 'twigs:bloodstone'],
    ['supplementaries:lumisene', 'minecraft:prismarine'],
    // Tuff crushes into five metal nuggets (C&A), so it is harder (Alex): it needs crude oil from a pumpjack.
    ['createdieselgenerators:crude_oil', 'minecraft:tuff']
  ]
  formations.forEach(pair => {
    try {
      var fluidType = Reg.FLUID.get(RL.parse(pair[0])).getFluidType()
      var stone = Reg.BLOCK.get(RL.parse(pair[1])).defaultBlockState()
      FIR.addInteraction(lavaType, new Info(fluidType, stone))
      console.info('stone-formations: lava + ' + pair[0] + ' -> ' + pair[1])
    } catch (err) { console.warn('stone-formations ' + pair[0] + ': ' + err) }
  })
})
