import { json, type LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData, type V2_MetaFunction } from "@remix-run/react"

import { prisma } from "~/libs"
import { createCacheHeaders, formatTitle } from "~/utils"
import {
  AvatarAuto,
  Badge,
  Card,
  CardDescription,
  CardTitle,
  Layout,
  SearchForm,
} from "~/components"

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const query = data?.query
  const count = data?.count

  if (!query) {
    return [
      { title: formatTitle(`All mentees`) },
      { name: "description", content: `All mentees in Bearmentee.` },
    ]
  }

  return [
    { title: formatTitle(`Keyword "${query}" found ${count} mentees`) },
    {
      name: "description",
      content: `Searching for "${query}" found ${count} mentees.`,
    },
  ]
}

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const query = url.searchParams.get("q")

  if (!query) {
    const mentees = await prisma.user.findMany({
      where: { tags: { some: { symbol: "MENTEE" } } },
      orderBy: { updatedAt: "asc" },
      include: {
        avatars: { select: { url: true } },
        tags: { select: { id: true, symbol: true, name: true } },
        profiles: { select: { headline: true, links: true } },
      },
    })

    return json(
      { query, count: mentees.length, mentees },
      { headers: createCacheHeaders(request, 3600) },
    )
  }

  const mentees = await prisma.user.findMany({
    where: {
      tags: { some: { symbol: "MENTEE" } },
      OR: [
        { name: { contains: query } },
        { username: { contains: query } },
        { nick: { contains: query } },
      ],
    },
    orderBy: { updatedAt: "asc" },
    include: {
      avatars: { select: { url: true } },
      tags: { select: { id: true, symbol: true, name: true } },
      profiles: { select: { headline: true, links: true } },
    },
  })

  return json({ query, count: mentees.length, mentees })
}

export default function Route() {
  const { query, count, mentees } = useLoaderData<typeof loader>()

  return (
    <Layout className="space-y-8 px-4 py-4 sm:px-8">
      <header className="space-y-4">
        <h1 className="flex items-center gap-2 text-4xl text-emerald-500">
          <img src="/images/bear-smile.png" alt="Bear" className="h-10" />
          <span>Mentees</span>
        </h1>
        <SearchForm action="/mentees" placeholder="Search for mentees" />
      </header>

      {mentees.length > 0 && (
        <section className="space-y-2">
          {count && !query && <p>All {count} mentees</p>}
          {count && query && (
            <p>
              Found {mentees.length} mentees with keyword "{query}"
            </p>
          )}

          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {mentees.map((user) => {
              return (
                <li key={user.id} className="w-full">
                  <Link to={`/${user.username}`}>
                    <Card className="p-2 transition hover:opacity-80">
                      <div className="flex gap-4">
                        <AvatarAuto
                          className="h-24 w-24"
                          src={user.avatars[0]?.url}
                          alt={user.username}
                          fallback={user.username[0].toUpperCase()}
                        />
                        <div className="flex flex-col justify-between space-y-1">
                          <div>
                            <CardTitle className="text-2xl">
                              {user.name}
                            </CardTitle>
                            <CardDescription>
                              {user.profiles[0]?.headline}
                            </CardDescription>
                          </div>
                          <ul className="flex flex-wrap gap-2">
                            {user.tags
                              .filter((tag) => tag.symbol !== "MENTEE")
                              .map((tag) => {
                                return (
                                  <li key={tag.id}>
                                    <Badge size="sm">{tag.name}</Badge>
                                  </li>
                                )
                              })}
                          </ul>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}
    </Layout>
  )
}
