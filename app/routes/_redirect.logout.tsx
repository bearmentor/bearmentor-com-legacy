import { redirect, type LoaderArgs } from "@remix-run/node"

export const loader = ({ request }: LoaderArgs) => {
  return redirect("/signout")
}
