import util from "util"

export function log(code: any) {
  console.info(util.inspect(code, false, null, true))
}
