import { json } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Layout,
} from "~/components"

export async function loader() {
  const mentors = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      tags: { select: { id: true, name: true } },
      profiles: { select: { headline: true, links: true } },
    },
    where: { tags: { some: { symbol: "MENTOR" } } },
  })

  const mentees = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
    },
    where: { tags: { some: { symbol: "MENTEE" } } },
  })

  return json({ mentors, mentees })
}

export default function Index() {
  return (
    <Layout>
      <div className="container space-y-20 px-4 sm:px-8">
        <LandingHero />
        <LandingMentors />
        <LandingMentees />
        <LandingDevelopment />
      </div>
    </Layout>
  )
}

export function LandingHero() {
  return (
    <article className="container my-8 max-w-3xl space-y-8">
      <header className="space-y-4">
        <h1 className="flex flex-wrap items-center gap-2">
          <img src="/favicon.png" alt="Bear" className="h-16" />
          <span className="text-emerald-500">Bearmentor</span>
        </h1>
        <h2>Brilliant mentoring</h2>
        <p>The mentoring platform for people and organization.</p>
      </header>

      <section className="space-y-4">
        <div className="space-x-4">
          <Button size="lg">Let's go</Button>
          <Button size="lg" variant="outline">
            Sign in
          </Button>
        </div>
      </section>
    </article>
  )
}

export function LandingMentors() {
  const { mentors } = useLoaderData<typeof loader>()

  if (mentors.length <= 0) {
    return null
  }

  return (
    <article className="max-w-7xl space-y-4">
      <h2>Available Mentors</h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mentors.map((mentor) => {
          const avatarImageURL = `https://api.dicebear.com/6.x/thumbs/svg?seed=${mentor.username}`

          return (
            <li key={mentor.id} className="w-full">
              <Link to={mentor.username}>
                <Card className="transition hover:opacity-90">
                  <CardHeader className="flex gap-4">
                    <img
                      src={avatarImageURL}
                      alt={mentor.name}
                      className="h-20 w-20 rounded object-cover"
                    />
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{mentor.name}</CardTitle>
                      <CardDescription>
                        {mentor.profiles[0]?.headline}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="flex gap-2">
                      {mentor.tags.map((tag) => {
                        return (
                          <li key={tag.id}>
                            <Badge size="sm">{tag.name}</Badge>
                          </li>
                        )
                      })}
                    </ul>
                  </CardContent>
                </Card>
              </Link>
            </li>
          )
        })}
      </ul>
    </article>
  )
}

export function LandingMentees() {
  const { mentees } = useLoaderData<typeof loader>()

  if (mentees.length <= 0) {
    return null
  }

  return (
    <article className="max-w-7xl space-y-4">
      <h2>Featured Mentees</h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mentees.map((mentee) => {
          const avatarImageURL = `https://api.dicebear.com/6.x/thumbs/svg?seed=${mentee.username}`

          return (
            <li key={mentee.id} className="w-full">
              <Link to={mentee.username}>
                <Card className="transition hover:opacity-90">
                  <CardHeader className="flex gap-4">
                    <img
                      src={avatarImageURL}
                      alt={mentee.name}
                      className="h-20 w-20 rounded object-cover"
                    />
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{mentee.name}</CardTitle>
                    </div>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          )
        })}
      </ul>
    </article>
  )
}

export function LandingDevelopment() {
  return (
    <article className="container my-8 max-w-3xl space-y-8">
      <section className="space-y-4">
        <img
          src="/images/bearmentor.png"
          alt="Bearmentor: Brilliant mentoring"
          className="rounded bg-slate-900"
        />

        <ul className="space-y-2">
          <li>
            Bearmentor is free to use, available as open source, but also has
            business/revenue/profit model in mind for sustainability.
          </li>
          <li>
            This is still in very early development. Check out{" "}
            <a
              href="https://github.com/bearmentor"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-emerald-700 transition-all hover:opacity-80 dark:text-emerald-300"
            >
              github.com/bearmentor
            </a>
          </li>
        </ul>

        <pre className="rounded bg-stone-200 p-2 dark:bg-stone-900">
          <code>console.log("Hello, Bear")</code>
        </pre>
      </section>
    </article>
  )
}
