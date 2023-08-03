import type { ParamDate } from "~/utils"
import { formatTimeDate } from "~/utils"

export function Time({ children }: { children: ParamDate }) {
  return (
    <time className="text-xs text-muted-foreground">
      {formatTimeDate(children)}
    </time>
  )
}
