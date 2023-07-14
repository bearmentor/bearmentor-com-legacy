import { json } from "@remix-run/node"
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node"
import { Link, useLoaderData, useParams } from "@remix-run/react"
import { notFound } from "remix-utils"
import invariant from "tiny-invariant"

import { prisma } from "~/libs"

export const meta: V2_MetaFunction = ({ data }) => {
  return [
    { title: "Mentor Name" },
    { name: "description", content: "Mentor Headline" },
  ]
}

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.username, "username not found")

  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: {
      role: true,
      profiles: true,
    },
  })
  if (!user) return notFound({ user: null })

  return json({ user })
}

export default function Route() {
  const { user } = useLoaderData<typeof loader>()
  const params = useParams()

  if (!user) {
    return (
      <div>
        <h1>Sorry, user with username "{params.username}" is not found</h1>
        <Link to="/">Go back to the landing page</Link>
      </div>
    )
  }

  const coverImageURL = `https://images.unsplash.com/photo-1571745544682-143ea663cf2c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80`

  return (
    <main>
      <section>
        <div className="contain-full">
          <img
            className="h-48 rounded-b-lg object-cover sm:h-60 md:h-72"
            alt="User Cover"
            src={coverImageURL}
            height={240}
            width={1440}
          />
        </div>
      </section>

      <section className="container max-w-3xl space-y-8">
        <header>
          <h1>{user.name}</h1>
          <h2 className="font-sans">@{user.username}</h2>
        </header>

        <div className="space-y-2">
          <h3>{user.profiles[0].headline}</h3>
          <p>{user.profiles[0].bio}</p>
        </div>
      </section>
    </main>
  )
}
