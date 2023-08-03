import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { parse } from "@conform-to/zod"
import { badRequest } from "remix-utils"

import { prisma } from "~/libs"
import { delay, formatPluralItems } from "~/utils"
import { useRootLoaderData } from "~/hooks"
import {
  AvatarAuto,
  Badge,
  BroadcastQuickForm,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Layout,
  SearchForm,
  Time,
} from "~/components"
import { model } from "~/models"
import { schemaBroadcastQuick } from "~/schemas"

export async function loader({ request }: LoaderArgs) {
  const url = new URL(request.url)
  const query = url.searchParams.get("q")

  if (!query) {
    const broadcasts = await prisma.broadcast.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        tags: true,
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatars: { select: { url: true } },
          },
        },
      },
    })

    return json({ query, count: broadcasts.length, broadcasts })
  }

  const broadcasts = await prisma.broadcast.findMany({
    orderBy: { updatedAt: "asc" },
    where: {
      OR: [
        { title: { contains: query } },
        { description: { contains: query } },
        { body: { contains: query } },
        {
          user: {
            OR: [
              {
                name: { contains: query },
                username: { contains: query },
              },
            ],
          },
        },
      ],
    },
    include: {
      tags: true,
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          avatars: { select: { url: true } },
        },
      },
    },
  })

  return json({ query, count: broadcasts.length, broadcasts })
}

export default function Route() {
  const { userSession } = useRootLoaderData()
  const { query, count, broadcasts } = useLoaderData<typeof loader>()

  return (
    <Layout className="flex flex-wrap gap-8 px-4 py-4 sm:flex-nowrap sm:px-8">
      <section id="broadcasts-action" className="w-full space-y-8 sm:max-w-sm">
        <header className="space-y-4">
          <h1 className="text-4xl text-brand">
            <Link to="/broadcasts" className="hover-opacity">
              Broadcasts
            </Link>
          </h1>
          <p className="text-muted-foreground">
            Use broadcasts to posts some announcements or requests for everyone,
            that you ask for help or offer a service
          </p>
        </header>

        {!userSession?.id && (
          <section>
            <Button asChild>
              <Link to="/login?redirectTo=/broadcasts">Login to Broadcast</Link>
            </Button>
          </section>
        )}

        {userSession?.id && <BroadcastQuickForm />}
      </section>

      <section id="broadcasts-list" className="w-full max-w-3xl space-y-4">
        <SearchForm action="/broadcasts" placeholder="Search broadcasts..." />

        {!query && count > 0 && (
          <p className="text-muted-foreground">{count} broadcasts</p>
        )}
        {query && count <= 0 && (
          <p className="text-muted-foreground">
            No broadcast found with keyword "{query}"
          </p>
        )}
        {query && count > 0 && (
          <p className="text-muted-foreground">
            Found {formatPluralItems("broadcast", count)} with keyword "{query}"
          </p>
        )}

        {count > 0 && (
          <section>
            <ul className="space-y-4">
              {broadcasts.map(broadcast => {
                return (
                  <li key={broadcast.id} className="w-full">
                    <Link
                      to={`/${broadcast.user.username}/broadcasts/${broadcast.id}`}
                    >
                      <Card className="hover-opacity space-y-1">
                        <CardHeader className="space-y-2 p-4">
                          <div>
                            <CardTitle className="text-2xl">
                              {broadcast.title}
                            </CardTitle>
                            <CardDescription>
                              {broadcast.description}
                            </CardDescription>
                          </div>

                          <div className="flex items-center gap-2">
                            <AvatarAuto
                              className="h-10 w-10"
                              user={broadcast.user}
                            />
                            <div className="space-y-0">
                              <h6>{broadcast.user.name}</h6>
                              <p className="text-sm text-muted-foreground">
                                @{broadcast.user.username}
                              </p>
                            </div>
                          </div>

                          <Time>{broadcast.updatedAt}</Time>
                        </CardHeader>

                        {broadcast.body && (
                          <CardContent className="space-y-4 px-4 pb-4">
                            {broadcast.body && (
                              <p className="prose dark:prose-invert whitespace-pre-wrap">
                                {broadcast.body}
                              </p>
                            )}
                          </CardContent>
                        )}

                        {broadcast.tags?.length > 0 && (
                          <CardContent className="space-y-4 px-4 pb-4">
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
                          </CardContent>
                        )}
                      </Card>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )}
      </section>
    </Layout>
  )
}

export async function action({ request }: ActionArgs) {
  await delay()
  const formData = await request.formData()
  const submission = parse(formData, { schema: schemaBroadcastQuick })
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission)
  }
  const broadcast = await model.broadcast.mutation.createQuick(submission.value)
  return redirect(`/${broadcast.user.username}/broadcasts/${broadcast.id}`)
}
