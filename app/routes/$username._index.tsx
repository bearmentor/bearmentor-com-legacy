import { json } from "@remix-run/node"
import type { LoaderArgs, V2_MetaFunction } from "@remix-run/node"
import { Link, useLoaderData, useParams } from "@remix-run/react"
import { notFound } from "remix-utils"
import invariant from "tiny-invariant"

import { formatTitle, trimURL } from "~/utils"
import { useRootLoaderData } from "~/hooks"
import {
  Anchor,
  AvatarAuto,
  Badge,
  Button,
  Card,
  Layout,
  NotFound,
  Time,
} from "~/components"
import { model } from "~/models"

type ProfileLink = {
  id: string
  url: string
  text: string
}

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
  if (!user) {
    return notFound({ user: null, profileLinks: null })
  }

  // https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#reading-a-json-field
  const profileLinks =
    user?.profiles[0].links &&
    typeof user?.profiles[0].links === "object" &&
    Array.isArray(user?.profiles[0].links)
      ? (user?.profiles[0].links as ProfileLink[])
      : ([] as ProfileLink[])

  return json({ user, profileLinks })
}

export default function Route() {
  const params = useParams()
  const { userSession } = useRootLoaderData()
  const { user, profileLinks } = useLoaderData<typeof loader>()

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

      <section className="w-full max-w-2xl space-y-6 px-4 sm:px-8">
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

        <section className="space-y-2">
          <h3>{user.profiles[0]?.headline}</h3>
          <p className="prose dark:prose-invert whitespace-pre-wrap">
            {user.profiles[0]?.bio}
          </p>
        </section>

        <section className="space-y-2">
          <h4>Links</h4>

          {profileLinks.length <= 0 && <p>No profile links.</p>}

          {profileLinks.length > 0 && (
            <ul className="space-y-2">
              {profileLinks.map(profileLink => {
                return (
                  <li key={profileLink.url}>
                    <Anchor href={profileLink.url} className="block">
                      <Card className="hover-opacity flex items-center gap-2 space-y-1 px-2 py-1">
                        {profileLink.text && (
                          <span className="font-bold">{profileLink.text}</span>
                        )}
                        <span className="font-mono text-sm">
                          {trimURL(profileLink.url)}
                        </span>
                      </Card>
                    </Anchor>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section className="space-y-2">
          <h4>Broadcasts</h4>

          {user.broadcasts.length <= 0 && <p>No broadcasts.</p>}

          {isOwner && user.broadcasts.length <= 0 && (
            <Button asChild size="sm" variant="secondary">
              <Link to="/broadcasts">Go to Broadcasts and create</Link>
            </Button>
          )}

          {user.broadcasts.length > 0 && (
            <ul className="space-y-2">
              {user.broadcasts.map(broadcast => {
                return (
                  <li key={broadcast.id}>
                    <Link
                      to={`/${user.username}/broadcasts/${broadcast.id}`}
                      className="focus block"
                    >
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
      </section>
    </Layout>
  )
}
