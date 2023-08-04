import { json } from "@remix-run/node"
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node"
import { Link, useLoaderData, useParams } from "@remix-run/react"
import { notFound } from "remix-utils"
import invariant from "tiny-invariant"

import { createCacheHeaders, formatTitle } from "~/utils"
import { useRootLoaderData } from "~/hooks"
import {
  Alert,
  AvatarAuto,
  Badge,
  Button,
  Card,
  Debug,
  Layout,
  NotFound,
  Time,
} from "~/components"
import { model } from "~/models"

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

  const user = await model.user.query.getByUsername({
    username: params.username,
  })
  if (!user) return notFound({ user: null })

  return json({ user }, { headers: createCacheHeaders(request, 3) })
}

export default function Route() {
  const params = useParams()
  const { userSession } = useRootLoaderData()
  const { user } = useLoaderData<typeof loader>()

  const defaultCoverImageURL = `https://images.unsplash.com/photo-1571745544682-143ea663cf2c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80`

  if (!user) {
    return (
      <Layout className="px-4 sm:px-8">
        <NotFound>
          <h2>
            This page isn't available or{" "}
            <span className="text-red-500">"{params.username}"</span> is not
            found
          </h2>
          <p className="text-muted-foreground">
            The link you followed may be broken, or the page may have been
            removed.
          </p>
        </NotFound>
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

      <section className="w-full max-w-2xl space-y-8 px-4 sm:px-8">
        <header className="-mt-16 flex flex-wrap items-end justify-between">
          <div>
            <AvatarAuto
              className="mb-4 h-32 w-32 outline outline-4 outline-background"
              user={user}
            />
            <h1 className="text-4xl">{user.name}</h1>
            <h2 className="text-2xl text-muted-foreground">@{user.username}</h2>
          </div>

          {isOwner && (
            <section className="flex flex-wrap gap-1">
              <Button asChild variant="secondary" size="xs">
                <Link to="/settings/profile">Edit Profile</Link>
              </Button>
            </section>
          )}
        </header>

        <section>
          {user.tags?.length > 0 && (
            <ul className="flex flex-wrap gap-1 sm:gap-2">
              {user.tags.map(tag => {
                return (
                  <li key={`${tag.id}-${tag.symbol}`}>
                    <Badge>{tag.name}</Badge>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="space-y-4">
          <h3>{user.profiles[0]?.headline}</h3>
          <p className="prose dark:prose-invert whitespace-pre-wrap">
            {user.profiles[0]?.bio}
          </p>
        </section>

        <section className="space-y-2">
          <h4>Broadcasts</h4>

          {user.broadcasts.length <= 0 && (
            <Alert>
              No broadcasts.{" "}
              <Link to="/broadcasts" className="link">
                Go to Broadcasts page and create one
              </Link>
              .
            </Alert>
          )}

          {user.broadcasts.length > 0 && (
            <ul className="space-y-2">
              {user.broadcasts.map(broadcast => {
                return (
                  <li key={broadcast.id}>
                    <Link to={`/${user.username}/broadcasts/${broadcast.id}`}>
                      <Card className="hover-opacity space-y-1 p-2">
                        <h5 className="font-sans">{broadcast.title}</h5>
                        <Time>{broadcast.updatedAt}</Time>
                      </Card>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <Debug>{{ params, userSession, user }}</Debug>
      </section>
    </Layout>
  )
}
