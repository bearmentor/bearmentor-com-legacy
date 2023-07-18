import { type LoaderArgs } from "@remix-run/node"
import { Form, Link } from "@remix-run/react"

import { authenticator } from "~/services/auth.server"
import { useRootLoaderData } from "~/hooks"
import { Button, Layout, UserCard } from "~/components"

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
        <Link to={user.username}>
          <UserCard user={user as any} />
        </Link>
      </section>
    </Layout>
  )
}
