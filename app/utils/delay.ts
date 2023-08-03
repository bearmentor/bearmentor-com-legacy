import sleep from "sleep-promise"

export async function delay(ms = 500) {
  await sleep(ms)
}
