import { json, redirect, type LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import { authenticator } from "~/services"
import { prisma } from "~/libs"
import { getGreetingByTime } from "~/utils"
import { Button, Card, Debug, Layout, Time, UserCard } from "~/components"

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/signin",
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
    return (
      <Layout withPadding>
        <p>Sorry something went wrong</p>
      </Layout>
    )
  }

  return (
    <Layout withPadding className="space-y-8">
      <header className="flex flex-wrap justify-between">
        <div>
          <span>{getGreetingByTime()},</span>
          <h1 className="text-brand">{user.name}</h1>
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
        <h4>Your profile card</h4>
        <Link to={`/${user.username}`} className="block">
          <UserCard user={user as any} />
        </Link>
      </section>

      <section className="max-w-xl space-y-2">
        <h4>Your broadcasts</h4>

        {user.broadcasts.length <= 0 && <p>No broadcasts.</p>}
        {user.broadcasts.length <= 0 && (
          <Button asChild size="sm" variant="secondary">
            <Link to="/broadcasts">Go to Broadcasts and create</Link>
          </Button>
        )}

        {user.broadcasts.length > 0 && (
          <ul className="space-y-2">
            {user.broadcasts.map(broadcast => {
              return (
                <li key={broadcast.id}>
                  <Link to={`/${user.username}/broadcasts/${broadcast.id}`}>
                    <Card className="hover-opacity space-y-1 p-2">
                      <h5 className="font-sans">{broadcast.title}</h5>
                      <Time>{broadcast.updatedAt}</Time>
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
