import { json } from "@remix-run/node"
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node"
import { Link, useLoaderData, useParams } from "@remix-run/react"
import { notFound } from "remix-utils"
import invariant from "tiny-invariant"

import { prisma } from "~/libs"
import { createCacheHeaders, formatTitle } from "~/utils"
import { AvatarAuto, Button, Layout } from "~/components"

export const meta: V2_MetaFunction<typeof loader> = ({ params, data }) => {
  if (!data?.user) {
    return [
      {
        title: formatTitle(
          `Sorry, this page isn't available or "${params.username}" is not found`,
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
    include: {
      avatars: { select: { url: true } },
      role: true,
      profiles: true,
    },
  })
  if (!user) return notFound({ user: null })

  return json({ user }, { headers: createCacheHeaders(request, 60) })
}

export default function Route() {
  const { user } = useLoaderData<typeof loader>()
  const params = useParams()

  if (!user) {
    return (
      <Layout>
        <section className="flex flex-col items-center justify-center pt-4">
          <Link to="/" className="transition hover:opacity-80">
            <img src="/favicon.png" alt="Bear" className="h-12" />
          </Link>
          <div className="flex max-w-md flex-col justify-center space-y-4 pt-24 text-center">
            <img
              src="/images/bear-fox.png"
              alt="Not Found Illustration"
              className="h-40 object-contain"
            />
            <h2>
              Sorry, this page isn't available or "{params.username}" is not
              found
            </h2>
            <p className="text-muted-foreground">
              The link you followed may be broken, or the page may have been
              removed.
            </p>
            <Button asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          </div>
        </section>
      </Layout>
    )
  }

  const coverImageURL = `https://images.unsplash.com/photo-1571745544682-143ea663cf2c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80`

  return (
    <Layout>
      <section className="flex justify-center px-2">
        <img
          className="h-32 rounded-b-lg object-cover sm:h-48 md:h-60"
          alt="User Cover"
          src={coverImageURL}
          height={240}
          width={1440}
        />
      </section>

      <section className="container max-w-3xl space-y-8">
        <header className="-mt-16">
          <AvatarAuto
            className="mb-4 h-32 w-32 outline outline-4 outline-background"
            src={user.avatars[0]?.url}
            alt={user.username}
            fallback={user.username[0].toUpperCase()}
          />
          <h1 className="text-4xl">{user.name}</h1>
          <h2 className="text-3xl text-muted-foreground">@{user.username}</h2>
        </header>

        <div className="space-y-2">
          <h3>{user.profiles[0]?.headline}</h3>
          <p>{user.profiles[0]?.bio}</p>
        </div>
      </section>
    </Layout>
  )
}
