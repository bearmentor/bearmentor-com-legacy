import { type LoaderArgs } from "@remix-run/node"
import { Form } from "@remix-run/react"

import { authenticator } from "~/services/auth.server"
import { useRootLoaderData } from "~/hooks"
import {
  AvatarAuto,
  Badge,
  Button,
  Card,
  CardDescription,
  CardTitle,
  Layout,
} from "~/components"

export const loader = async ({ request }: LoaderArgs) => {
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" })
  return null
}

export default function DashboardRoute() {
  const { userData: user } = useRootLoaderData()

  if (!user) {
    return <p>Sorry something went wrong</p>
  }

  return (
    <Layout className="space-y-8 px-4 py-4 sm:px-8">
      <header>
        <h2>Welcome, {user?.name}</h2>
        <p>This is the dashboard.</p>
      </header>

      <section>
        <Form method="POST" action="/logout">
          <Button type="submit" variant="destructive">
            Logout
          </Button>
        </Form>
      </section>

      <section className="flex max-w-xs justify-start">
        <Card className="p-2">
          <div className="flex gap-4">
            <AvatarAuto
              className="h-24 w-24"
              src={user.avatars[0]?.url}
              alt={user.username}
              fallback={user.username[0].toUpperCase()}
            />
            <div className="flex flex-col justify-between space-y-1">
              <div>
                <CardTitle className="text-2xl">{user.name}</CardTitle>
                <CardDescription>{user.profiles[0]?.headline}</CardDescription>
              </div>
              <ul className="flex flex-wrap gap-2">
                {user.tags.map((tag) => {
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
      </section>
    </Layout>
  )
}
