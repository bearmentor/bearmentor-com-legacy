import { json, type LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData, type V2_MetaFunction } from "@remix-run/react"

import { prisma } from "~/libs"
import { formatPluralItems, formatTitle } from "~/utils"
import { AvatarAuto, Layout, SearchForm } from "~/components"

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const query = data?.query || ""
  const count = data?.count || 0

  if (!query && !count) {
    return [
      { title: formatTitle(`Search anything`) },
      { name: "description", content: `Search for various information.` },
    ]
  }

  if (query && !count) {
    return [
      { title: formatTitle(`Keyword "${query}" has no users`) },
      { name: "description", content: `No search users.` },
    ]
  }

  return [
    { title: formatTitle(`Keyword "${query}" found ${count} users`) },
    {
      name: "description",
      content: `Searching for "${query}" found ${count} users.`,
    },
  ]
}

export const loader = async ({ request }: LoaderArgs) => {
  const url = new URL(request.url)
  const query = url.searchParams.get("q")

  if (!query) {
    return json({ query, count: 0, users: [] })
  }

  // This will be more than just finding users
  const [users] = await prisma.$transaction([
    prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query } },
          { username: { contains: query } },
          { nick: { contains: query } },
        ],
      },
      select: {
        id: true,
        name: true,
        username: true,
        avatars: { select: { url: true } },
        tags: { select: { symbol: true, name: true } },
        profiles: { select: { headline: true, links: true } },
      },
      orderBy: [{ username: "asc" }],
    }),
  ])

  const usersCount = users.length
  const count = usersCount

  return json({ query, count, users })
}

export default function Route() {
  const { query, count, users } = useLoaderData<typeof loader>()

  return (
    <Layout className="max-w-7xl space-y-8 px-4 py-4 sm:px-8">
      <header className="space-y-4">
        <h1 className="flex items-center gap-2 text-4xl text-brand">
          <img src="/images/bear-monocle.png" alt="Bear" className="h-10" />
          <span>Search</span>
        </h1>
        <p className="text-muted-foreground">
          Find anyone in here by name or username.
        </p>
        <SearchForm />
      </header>

      {count <= 0 && query && (
        <section>
          <p>No result found for keyword "{query}"</p>
        </section>
      )}

      {users.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-emerald-700">Users</h2>
          <p className="text-muted-foreground">
            Found {formatPluralItems("user", count)} with keyword "{query}"
          </p>

          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {users.map(user => {
              return (
                <li key={user.id}>
                  <Link
                    to={`/${user.username}`}
                    className="hover-opacity flex gap-2 py-1"
                  >
                    <AvatarAuto
                      className="h-14 w-14"
                      src={user.avatars[0]?.url}
                      alt={user.username}
                      fallback={user.username[0].toUpperCase()}
                    />
                    <div>
                      <h3 className="text-lg">{user.name}</h3>
                      <p className="text-muted-foreground">@{user.username}</p>
                    </div>
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
