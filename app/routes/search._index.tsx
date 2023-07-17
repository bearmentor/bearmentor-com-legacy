import { json, type LoaderArgs } from "@remix-run/node"
import {
  Form,
  Link,
  useLoaderData,
  useSearchParams,
  type V2_MetaFunction,
} from "@remix-run/react"
import { SearchIcon } from "lucide-react"

import { prisma } from "~/libs"
import { formatTitle } from "~/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Input,
  Label,
  Layout,
} from "~/components"

export const meta: V2_MetaFunction<typeof loader> = ({ data }) => {
  const query = data?.query || ""
  const count = data?.count || 0

  if (count <= 0) {
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
    <Layout className="space-y-8 px-4 py-4 sm:px-8">
      <header className="space-y-4">
        <h1 className="text-4xl text-emerald-500">Search</h1>
        <SearchForm />
      </header>

      {count <= 0 && query && (
        <section>
          <p>No result found for "{query}"</p>
        </section>
      )}

      {users.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-emerald-700">Users</h2>
          <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3">
            {users.map((user) => {
              return (
                <li key={user.id}>
                  <Link
                    to={user.username}
                    className="flex gap-2 py-1 transition hover:opacity-80"
                  >
                    <Avatar className="h-14 w-14">
                      <AvatarImage
                        src={user.avatars[0]?.url}
                        alt={user.username}
                      />
                      <AvatarFallback>
                        {user.username[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
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

      {/* <pre className="text-xs">{stringify({ query, count, users })}</pre> */}
    </Layout>
  )
}

export function SearchForm({ action = "/search" }: { action?: string }) {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""

  return (
    <Form method="GET" action={action} className="w-full">
      <fieldset className="relative flex items-center gap-1">
        <Label className="sr-only">Search</Label>
        <Input
          name="q"
          type="search"
          placeholder="Search"
          autoComplete="off"
          autoFocus={true}
          defaultValue={query}
          className="block h-12 w-full px-3 py-2 ps-12 text-xl"
        />
        <span className="pointer-events-none absolute flex ps-3">
          <SearchIcon className="h-6 w-6 text-muted-foreground" />
        </span>
      </fieldset>
    </Form>
  )
}
