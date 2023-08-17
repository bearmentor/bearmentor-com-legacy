import { json, type LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData, type V2_MetaFunction } from "@remix-run/react"

import { prisma } from "~/libs"
import { createCacheHeaders, formatPluralItems, formatTitle } from "~/utils"
import { Layout, SearchForm, UserCard } from "~/components"

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
      where: {
        isPublic: true,
        tags: { some: { symbol: "MENTEE" } },
      },
      orderBy: { updatedAt: "asc" },
      include: {
        avatars: { select: { url: true } },
        tags: { select: { id: true, symbol: true, name: true } },
        profiles: { select: { headline: true, links: true } },
      },
    })

    return json(
      { query, count: mentees.length, mentees },
      { headers: createCacheHeaders(request, 60) },
    )
  }

  const mentees = await prisma.user.findMany({
    where: {
      isPublic: true,
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
    <Layout withPadding className="max-w-7xl space-y-8">
      <header className="space-y-4">
        <h1 className="flex items-center gap-2 text-4xl text-brand">
          <img src="/images/bear-smile.png" alt="Bear" className="h-10" />
          <span>Mentees</span>
        </h1>
        <p className="text-muted-foreground">
          Mentee is a person who is mentored, advised, trained, counseled, or
          taught by a mentor. Like a student or trainee.
        </p>
        <SearchForm action="/mentees" placeholder="Search for mentees" />
      </header>

      {count > 0 && (
        <section className="space-y-2">
          {!query && <p>{formatPluralItems("mentee", count)}</p>}
          {query && (
            <p className="text-muted-foreground">
              Found {formatPluralItems("mentee", count)} with keyword "{query}"
            </p>
          )}

          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {mentees.map(user => {
              return (
                <li key={user.id} className="w-full">
                  <Link to={`/${user.username}`}>
                    <UserCard user={user as any} />
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
