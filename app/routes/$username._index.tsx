import { json } from "@remix-run/node"
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node"
import { Link, useLoaderData, useParams } from "@remix-run/react"
import { formatTitle } from "~/utils"
import { notFound } from "remix-utils"
import invariant from "tiny-invariant"

import { prisma } from "~/libs"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Layout,
} from "~/components"

export const meta: V2_MetaFunction<typeof loader> = ({ params, data }) => {
  if (!data?.user) {
    return [
      {
        title: formatTitle(
          `Sorry, this page isn't available or "${params.username}" is not found`
        ),
      },
      {
        name: "description",
        content: `The link you followed may be broken, or the page may have been removed.`,
      },
    ]
  }

  return [
    { title: formatTitle(`${data.user?.name} (@${data.user?.username})`) },
    { name: "description", content: data.user?.profiles[0]?.headline },
  ]
}

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.username, "username not found")

  const user = await prisma.user.findUnique({
    where: { username: params.username },
    include: { role: true, profiles: true },
  })
  if (!user) return notFound({ user: null })

  return json({ user })
}

export default function Route() {
  const { user } = useLoaderData<typeof loader>()
  const params = useParams()

  if (!user) {
    return (
      <Layout>
        <header>
          <h2>
            Sorry, this page isn't available or "{params.username}" is not found
          </h2>
          <p className="text-muted-foreground">
            The link you followed may be broken, or the page may have been
            removed.
          </p>
        </header>
        <Button variant="link" asChild>
          <Link to="/">Go back to the landing page</Link>
        </Button>
      </Layout>
    )
  }

  const coverImageURL = `https://images.unsplash.com/photo-1571745544682-143ea663cf2c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80`

  const avatarImageURL = `https://api.dicebear.com/6.x/thumbs/svg?seed=${user.username}`

  return (
    <Layout>
      <section className="flex justify-center">
        <div className="contain-full">
          <img
            className="h-32 rounded-b-lg object-cover sm:h-48 md:h-60"
            alt="User Cover"
            src={coverImageURL}
            height={240}
            width={1440}
          />
        </div>
      </section>

      <section className="container max-w-3xl space-y-8">
        <header className="-mt-16">
          <Avatar className="mb-4 h-32 w-32 outline outline-4 outline-background">
            <AvatarImage src={avatarImageURL} alt={user.username} />
            <AvatarFallback className="text-5xl">
              {user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <h1>{user.name}</h1>
          <h2 className="text-muted-foreground">@{user.username}</h2>
        </header>

        <div className="space-y-2">
          <h3>{user.profiles[0].headline}</h3>
          <p>{user.profiles[0].bio}</p>
        </div>
      </section>
    </Layout>
  )
}
