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
        <span>Welcome,</span>
        <h2>{user?.name}</h2>
        <p className="text-muted-foreground">This is your dashboard.</p>
      </header>

      <section className="space-y-2">
        <h4>Your profile card:</h4>
        <Link to={`/${user.username}`} className="block">
          <UserCard user={user as any} />
        </Link>
      </section>

      <section className="flex gap-2">
        <Button asChild variant="secondary">
          <Link to="/profile">Edit Profile</Link>
        </Button>
        <Form method="POST" action="/logout">
          <Button type="submit" variant="destructive">
            Logout
          </Button>
        </Form>
      </section>
    </Layout>
  )
}
