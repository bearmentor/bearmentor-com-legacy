import { json, type LoaderArgs } from "@remix-run/node"
import type {
  ShouldRevalidateFunction,
  V2_MetaFunction,
} from "@remix-run/react"
import { useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"

export const meta: V2_MetaFunction = () => [
  { title: "All Users | Bearmentor" },
  { description: "All Bearmentor users to discover." },
]

export const loader = async ({ request }: LoaderArgs) => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      role: { select: { symbol: true, name: true } },
      profiles: { select: { headline: true, links: true } },
    },
  })

  return json({ users })
}

export default function RouteComponent() {
  const { users } = useLoaderData<typeof loader>()

  return (
    <main>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </main>
  )
}

export const shouldRevalidate: ShouldRevalidateFunction = () => {
  return true
}
