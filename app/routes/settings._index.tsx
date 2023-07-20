import type { LoaderArgs } from "@remix-run/node"
import { redirect } from "@remix-run/node"

export const loader = async ({ request }: LoaderArgs) => {
  return redirect("/settings/profile")
}
