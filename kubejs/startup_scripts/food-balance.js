// Christmas Craft food balance (2026-10-28): tones down effects that were far stronger than the effort to make them.
// Rule from the owner: lots of effects are fine on something hard to make (the duo chicken bucket), not on something
// cheap. Each entry swaps one effect's level and length; reasons are in data/balance-2026-10-28.md.
// Every change is wrapped on its own, because an error inside a registry event stalls the server's boot.

// [item, effect, new level (1 = I), new seconds]; level 0 removes the effect
var CC_FOOD_RETUNE = [
  // Saturation II for 3 minutes keeps the hunger bar full; cheap to brew (2 corn flour, sugar, water)
  ['hearthandharvest:moonshine', 'minecraft:saturation', 0, 0],
  // Resistance III from 2 cranberries in a crafting grid
  ['cocktailsdelight:cranberry_juice', 'minecraft:resistance', 1, 30],
  // Resistance IV (80% less damage) for a minute, 4 drinks per craft
  ['cocktailsdelight:medina', 'minecraft:resistance', 2, 60],
  ['cocktailsdelight:china_blue', 'minecraft:strength', 2, 30],
  // Strength III from a mango and a spoon of jam; the fruit line keeps its effect at level I
  ['fruitsdelight:mango_salad', 'minecraft:strength', 1, 30],
  ['fruitsdelight:mango_jello', 'minecraft:strength', 1, 20],
  ['fruitsdelight:mango_jam', 'minecraft:strength', 1, 20],
  ['fruitsdelight:mango_milkshake', 'minecraft:strength', 1, 10],
  ['fruitsdelight:mango_tea', 'minecraft:strength', 1, 10],
  ['fruitsdelight:lychee_jam', 'minecraft:strength', 1, 10],
  ['fruitsdelight:lychee_jello', 'minecraft:strength', 1, 10],
  ['fruitsdelight:lychee_cherry_tea', 'minecraft:strength', 1, 5],
  ['fruitsdelight:lychee_chicken', 'minecraft:strength', 2, 20],
  // A minute of Regeneration I heals 12 hearts, six golden apples' worth, from wheat and hops
  ['hearthandharvest:beer', 'minecraft:regeneration', 1, 20],
  ['hearthandharvest:melon_wine', 'minecraft:regeneration', 1, 20],
  ['hearthandharvest:trail_mix', 'minecraft:regeneration', 1, 20],
  ['hearthandharvest:red_grape_wine', 'minecraft:resistance', 1, 30]
]

ItemEvents.modification(function (event) {
  var FOOD = Java.loadClass('net.minecraft.core.component.DataComponents').FOOD
  CC_FOOD_RETUNE.forEach(function (row) {
    var id = row[0], effect = row[1], level = row[2], seconds = row[3]
    try {
      event.modify(id, function (item) {
        // KubeJS 2101.7.2's FoodBuilder copies the finished saturation into its modifier field, which inflates it by
        // 2 x hunger on rebuild (lychee chicken went from 19 to 461). Put the original modifier back.
        var old = item.item().components().get(FOOD)
        item.modifyFood(function (food) {
          food.saturation(old.nutrition() > 0 ? old.saturation() / (2 * old.nutrition()) : 0)
          food.removeEffect(effect)
          if (level > 0) food.effect(effect, Math.round(seconds * 20), level - 1, 1.0)
        })
      })
    } catch (err) {
      console.error('food-balance: ' + id + ': ' + err)
    }
  })
})
