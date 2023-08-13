import { json, type LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import {
  getPaginationConfigs,
  getPaginationOptions,
  Layout,
  PaginationNavigation,
  PaginationSearch,
} from "~/components"

export const loader = async ({ request }: LoaderArgs) => {
  const config = getPaginationConfigs({ request, defaultLimit: 8 })

  // Custom query config
  const where = !config.queryParam
    ? {}
    : { OR: [{ name: { contains: config.queryParam } }] }

  const [totalItems, items] = await prisma.$transaction([
    prisma.user.count({ where }),
    prisma.user.findMany({ where, skip: config.skip, take: config.limitParam }),
  ])

  return json({ ...getPaginationOptions({ request, totalItems }), items })
}

export default function Route() {
  const { items: users, ...loaderData } = useLoaderData<typeof loader>()

  return (
    <Layout withPadding className="max-w-7xl space-y-12">
      <h1>
        <Link to="/pagination">Example: Pagination</Link>
      </h1>

      <PaginationSearch
        itemName="user"
        searchPlaceholder="Search users with keyword..."
        count={users.length}
        isVerbose={true}
        {...loaderData}
      />

      <PaginationNavigation {...loaderData} />

      {users.length > 0 && (
        <section>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {users.map(user => {
              return (
                <li key={user.id}>
                  <Link to={`/${user.username}`}>
                    <h4 className="hover-opacity">{user.name}</h4>
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      <PaginationNavigation {...loaderData} />
    </Layout>
  )
}
