// Christmas Craft 2026 - qol-ui-audio area.
// Source: data/integration-spec-qol-ui-audio-2026-10-27.md, "Configs to set":
//   Vanilla gamerule playersSleepingPercentage = 0: one sleeping player skips the night (Alex 2026-11-16:
//   "only needed 1 player to sleep"; was 50, which replaced the rejected Server Sleep mod).
// Applied ONCE per world (flag in the server's KubeJS persistent data), so an admin who later
// changes the gamerule by hand is never overridden on restart.
// [R] needs an in-game check: /gamerule playersSleepingPercentage should report 0 on a new world.

const CC_QOL_GAMERULE_FLAG = 'christmascraft_qol_sleep_gamerule_v2'   // v2: applies the new value once to worlds that ran v1

ServerEvents.loaded(event => {
  const server = event.server
  const data = server.persistentData
  if (data.getBoolean(CC_QOL_GAMERULE_FLAG)) return
  server.runCommandSilent('gamerule playersSleepingPercentage 0')
  data.putBoolean(CC_QOL_GAMERULE_FLAG, true)
  console.info('[christmascraft/qol-ui-audio] set playersSleepingPercentage to 0 (once per world)')
})
