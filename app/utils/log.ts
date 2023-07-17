import util from "util"

export function log(code: any) {
  console.log(util.inspect(code, false, null, true))
}
