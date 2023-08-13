import { redirect, type LoaderArgs } from "@remix-run/node"

export const loader = ({ request }: LoaderArgs) => {
  const searchParams = new URLSearchParams(request.url)
  return redirect(`/signup?${searchParams.toString()}`)
}
