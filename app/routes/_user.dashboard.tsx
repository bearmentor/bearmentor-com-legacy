import { json, redirect, type LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import { authenticator } from "~/services"
import { prisma } from "~/libs"
import { formatDateTime } from "~/utils/datetime"
import { Button, Card, Debug, Layout, UserCard } from "~/components"

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
  if (!userSession?.id) return redirect("/logout")

  const user = await prisma.user.findUnique({
    where: { id: userSession.id },
    include: {
      role: { select: { symbol: true, name: true } },
      tags: { select: { id: true, symbol: true, name: true } },
      avatars: { select: { id: true, url: true } },
      profiles: true,
      broadcasts: true,
    },
  })
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
          <Debug>{{ user }}</Debug>
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

      <section className="max-w-xl space-y-2">
        <h4>Your profile card:</h4>
        <Link to={`/${user.username}`} className="block">
          <UserCard user={user as any} />
        </Link>
      </section>

      <section className="max-w-xl space-y-2">
        <h4>Your broadcasts:</h4>

        {user.broadcasts.length <= 0 && (
          <div>
            <p>You have no broadcasts.</p>
            <Button asChild variant="secondary">
              <Link to="/broadcasts">Create Broadcast</Link>
            </Button>
          </div>
        )}

        {user.broadcasts.length > 0 && (
          <ul className="space-y-2">
            {user.broadcasts.map(broadcast => {
              return (
                <li key={broadcast.id}>
                  <Link to={`/broadcasts/${broadcast.slug}`}>
                    <Card className="hover-opacity space-y-2 p-2">
                      <h5>{broadcast.title}</h5>
                      <time className="text-xs">
                        {formatDateTime(broadcast.updatedAt)}
                      </time>
                    </Card>
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </Layout>
  )
}
