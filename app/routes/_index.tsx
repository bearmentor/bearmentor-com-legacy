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
    orderBy: { createdAt: "asc" },
    take: 12,
  })

  const mentees = await prisma.user.findMany({
    select: { id: true, name: true, username: true },
    where: { tags: { some: { symbol: "MENTEE" } } },
    orderBy: { createdAt: "asc" },
    take: 24,
  })

  return json({ mentors, mentees })
}

export default function Index() {
  return (
    <Layout>
      <div className="space-y-20 px-4 sm:px-8">
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
    <article className="max-w-3xl space-y-8 py-20 sm:container">
      <section className="flex gap-8">
        <div className="flex w-full flex-col items-center justify-center space-y-4 lg:items-start">
          <h1 className="flex flex-col flex-wrap items-center gap-2 lg:flex-row">
            <img src="/favicon.png" alt="Bear" className="h-16" />
            <span className="text-emerald-500">Bearmentor</span>
          </h1>
          <h2>Brilliant mentoring</h2>
          <p className="text-center lg:text-left">
            The mentoring platform for people and organization.
          </p>
          <div className="space-x-4">
            <Button size="lg">Let's go</Button>
            <Button size="lg" variant="outline">
              Sign in
            </Button>
          </div>
        </div>
        <div className="hidden lg:flex">
          <img
            src="/images/cats-learning.png"
            alt="Hero Illustration"
            className="object-fit"
            width={300}
          />
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
      <h2 className="text-emerald-500">Available Mentors</h2>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mentors.map((mentor) => {
          const avatarImageURL = `https://api.dicebear.com/6.x/thumbs/svg?seed=${mentor.username}`

          return (
            <li key={mentor.id} className="w-full">
              <Link to={mentor.username}>
                <Card className="p-2 transition hover:opacity-90">
                  <div className="flex gap-4">
                    <img
                      src={avatarImageURL}
                      alt={mentor.name}
                      className="h-24 w-24 rounded object-cover"
                    />
                    <div className="flex flex-col justify-between space-y-1">
                      <div>
                        <CardTitle className="text-2xl">
                          {mentor.name}
                        </CardTitle>
                        <CardDescription>
                          {mentor.profiles[0]?.headline}
                        </CardDescription>
                      </div>
                      <ul className="flex gap-2">
                        {mentor.tags.map((tag) => {
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
      <h2 className="text-emerald-500">Featured Mentees</h2>
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
                      className="h-14 w-14 rounded object-cover"
                    />
                    <CardTitle className="flex items-center text-base leading-normal">
                      <span>{mentee.name}</span>
                    </CardTitle>
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
    <article className="max-w-3xl space-y-8 py-20 sm:container">
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
              className="font-bold text-emerald-700 transition hover:opacity-80 dark:text-emerald-300"
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
