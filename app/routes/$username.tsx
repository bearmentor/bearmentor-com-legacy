import { json } from "@remix-run/node"
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node"
import { Link, useLoaderData, useParams } from "@remix-run/react"
import { notFound } from "remix-utils"
import invariant from "tiny-invariant"

import { prisma } from "~/libs"
import { createCacheHeaders, formatTitle } from "~/utils"
import { useRootLoaderData } from "~/hooks"
import { AvatarAuto, Button, Debug, Layout } from "~/components"

export const meta: V2_MetaFunction<typeof loader> = ({ params, data }) => {
  if (!data?.user) {
    return [
      {
        title: formatTitle(
          `Sorry, "${params.username}" is not found or this page isn't available`,
        ),
      },
      {
        name: "description",
        content: `The link you followed may be broken, or the page may have been removed. Please refresh or back to the home page.`,
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
  const params = useParams()
  const { userSession } = useRootLoaderData()
  const { user } = useLoaderData<typeof loader>()

  const defaultCoverImageURL = `https://images.unsplash.com/photo-1571745544682-143ea663cf2c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80`

  if (!user) {
    return (
      <Layout className="px-4 sm:px-8">
        <section className="flex flex-col items-center justify-center pt-4">
          <Link to="/" className="hover-opacity">
            <img src="/favicon.png" alt="Bear" className="h-12" />
          </Link>
          <div className="flex max-w-md flex-col justify-center space-y-4 pt-24 text-center">
            <img
              src="/images/bear-fox.png"
              alt="Not Found Illustration"
              className="h-40 object-contain"
            />
            <h2>
              This page isn't available or{" "}
              <span className="text-red-500">"{params.username}"</span> is not
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

  const isOwner = userSession?.id === user.id

  return (
    <Layout className="flex flex-col items-center">
      <section className="flex justify-center sm:px-2">
        <img
          className="h-32 object-cover sm:h-48 sm:rounded-b-lg md:h-60"
          alt="User Cover"
          src={defaultCoverImageURL}
          height={240}
          width={1440}
        />
      </section>

      <section className="w-full max-w-3xl space-y-8 px-4 sm:px-8">
        <header className="-mt-16 flex flex-wrap items-end justify-between">
          <div>
            <AvatarAuto
              className="mb-4 h-32 w-32 outline outline-4 outline-background"
              src={user.avatars[0]?.url}
              alt={user.username}
              fallback={user.username[0].toUpperCase()}
            />
            <h1 className="text-4xl">{user.name}</h1>
            <h2 className="text-2xl text-muted-foreground">@{user.username}</h2>
          </div>

          {isOwner && (
            <section className="flex flex-wrap gap-1">
              <Button asChild variant="secondary" size="xs">
                <Link to="/settings">Settings</Link>
              </Button>
              <Button asChild variant="secondary" size="xs">
                <Link to="/settings/profile">Edit Profile</Link>
              </Button>
              <Button asChild type="submit" variant="destructive" size="xs">
                <Link to="/logout">Logout</Link>
              </Button>
            </section>
          )}
        </header>

        <div className="space-y-4">
          <h3>{user.profiles[0]?.headline}</h3>
          <p className="prose dark:prose-invert whitespace-pre-wrap">
            {user.profiles[0]?.bio}
          </p>
        </div>

        <Debug name="user">{{ params, userSession, user }}</Debug>
      </section>
    </Layout>
  )
}
