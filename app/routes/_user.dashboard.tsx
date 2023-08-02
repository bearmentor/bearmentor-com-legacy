import { json, redirect, type LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import { authenticator } from "~/services"
import { Button, Debug, Layout, UserCard } from "~/components"
import { model } from "~/models"

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
  if (!userSession?.id) return redirect("/logout")

  const user = await model.user.query.getById({ id: userSession.id })
  if (!user) return redirect("/logout")

  return json({ user })
}

export default function Route() {
  const { user } = useLoaderData<typeof loader>()

  if (!user) {
    return <p>Sorry something went wrong</p>
  }

  return (
    <Layout className="space-y-8 px-4 py-4 sm:px-8">
      <header className="flex flex-wrap justify-between">
        <div>
          <span>Welcome,</span>
          <Link to="/dashboard">
            <h1 className="hover-opacity text-brand">{user.name}</h1>
          </Link>
          <p className="text-muted-foreground">This is your dashboard.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button asChild size="xs" variant="secondary">
            <Link to="/settings">Settings</Link>
          </Button>
          <Button asChild size="xs" variant="secondary">
            <Link to="/settings/profile">Edit Profile</Link>
          </Button>
          <Button asChild size="xs" type="submit" variant="destructive">
            <Link to="/logout">Logout</Link>
          </Button>
        </div>
      </header>

      <section className="space-y-2">
        <h4>Your profile card:</h4>
        <Link to={`/${user.username}`} className="block">
          <UserCard user={user as any} />
        </Link>
      </section>

      <Debug>{{ user }}</Debug>
    </Layout>
  )
}
