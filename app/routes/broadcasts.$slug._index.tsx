import { json } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { notFound } from "remix-utils"
import invariant from "tiny-invariant"

import { prisma } from "~/libs"
import { createCacheHeaders } from "~/utils"
import { AvatarAuto, Badge, Button, Layout } from "~/components"

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.slug, "Broadcast slug not found")

  const broadcast = await prisma.broadcast.findFirst({
    where: { slug: params.slug },
    include: {
      tags: true,
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          nick: true,
          avatars: { select: { url: true } },
        },
      },
    },
  })
  if (!broadcast) return notFound({ broadcast: null })

  return json({ broadcast }, { headers: createCacheHeaders(request, 10) })
}

export default function BroadcastsRoute() {
  const { broadcast } = useLoaderData<typeof loader>()

  if (!broadcast) {
    return null
  }

  return (
    <Layout className="flex justify-center pt-10">
      <div className="w-full max-w-xl space-y-6">
        <header className="space-y-2">
          <h1 className="flex">
            <Link
              to={`/broadcasts/${broadcast.slug}`}
              className="hover-opacity"
            >
              {broadcast.title}
            </Link>
          </h1>
          <p>{broadcast.description}</p>
        </header>

        <div>
          <Link
            to={`/${broadcast.user.username}`}
            className="hover-opacity flex items-center gap-2"
          >
            <AvatarAuto className="h-10 w-10" user={broadcast.user} />
            <div className="space-y-0">
              <h6>{broadcast.user.name}</h6>
              <p className="text-sm text-muted-foreground">
                @{broadcast.user.username}
              </p>
            </div>
          </Link>
        </div>

        {broadcast.body && (
          <div className="space-y-4">
            <p className="prose dark:prose-invert whitespace-pre-wrap">
              {broadcast.body}
            </p>
          </div>
        )}

        {broadcast.tags?.length > 0 && (
          <div className="space-y-4">
            <ul className="flex flex-wrap gap-1 sm:gap-2">
              {broadcast.tags.map(tag => {
                return (
                  <li key={tag.id}>
                    <Badge size="sm" variant="secondary">
                      {tag.name}
                    </Badge>
                  </li>
                )
              })}
            </ul>
          </div>
        )}

        <div>
          <Button>Contact {broadcast.user.nick}</Button>
        </div>
      </div>
    </Layout>
  )
}
