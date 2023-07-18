import { json, type LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData, type V2_MetaFunction } from "@remix-run/react"

import { prisma } from "~/libs"
import { createCacheHeaders, formatTitle } from "~/utils"
import { Layout, SearchForm, UserCard } from "~/components"

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const query = data?.query
  const count = data?.count

  if (!query) {
    return [
      { title: formatTitle(`All mentors`) },
      { name: "description", content: `All mentors in Bearmentor.` },
    ]
  }

  return [
    { title: formatTitle(`Keyword "${query}" found ${count} mentors`) },
    {
      name: "description",
      content: `Searching for "${query}" found ${count} mentors.`,
    },
  ]
}

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const query = url.searchParams.get("q")

  if (!query) {
    const mentors = await prisma.user.findMany({
      where: { tags: { some: { symbol: "MENTOR" } } },
      orderBy: { updatedAt: "asc" },
      include: {
        avatars: { select: { url: true } },
        tags: { select: { id: true, symbol: true, name: true } },
        profiles: { select: { headline: true, links: true } },
      },
    })

    return json(
      { query, count: mentors.length, mentors },
      { headers: createCacheHeaders(request, 3600) },
    )
  }

  const mentors = await prisma.user.findMany({
    where: {
      tags: { some: { symbol: "MENTOR" } },
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

  return json({ query, count: mentors.length, mentors })
}

export default function Route() {
  const { query, count, mentors } = useLoaderData<typeof loader>()

  return (
    <Layout className="space-y-8 px-4 py-4 sm:px-8">
      <header className="space-y-4">
        <h1 className="flex items-center gap-2 text-4xl text-emerald-500">
          <img src="/images/bear-sunglasses.png" alt="Bear" className="h-10" />
          <span>Mentors</span>
        </h1>
        <SearchForm action="/mentors" placeholder="Search for mentors" />
      </header>

      {mentors.length > 0 && (
        <section className="space-y-2">
          {count && !query && <p>All {count} mentors</p>}
          {count && query && (
            <p>
              Found {mentors.length} mentors with keyword "{query}"
            </p>
          )}

          <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {mentors.map(user => {
              return (
                <li key={user.id} className="w-full">
                  <Link to={`/${user.username}`}>
                    <UserCard user={user as any} filterSymbol={["MENTOR"]} />
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
