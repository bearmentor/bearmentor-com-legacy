import { json, type V2_MetaFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components"

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Bearmentor" },
    {
      name: "description",
      content: "Brilliant mentoring platform for people and organization.",
    },
  ]
}

export async function loader() {
  const mentors = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      username: true,
      nick: true,
      role: { select: { symbol: true, name: true } },
      profiles: { select: { headline: true, links: true } },
    },
    where: { tags: { some: { symbol: "MENTOR" } } },
  })

  return json({ mentors })
}

export default function Index() {
  return (
    <main className="container space-y-20 px-4 sm:px-8">
      <LandingHero />
      <LandingMentors />
      <LandingDevelopment />
    </main>
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

  return (
    <article className="max-w-7xl space-y-4">
      <h2>Available Mentors</h2>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mentors.map((mentor) => {
          const avatarImageURL = `https://api.dicebear.com/6.x/thumbs/svg?seed=${mentor.username}`

          return (
            <li key={mentor.id} className="w-full">
              <Link to={mentor.username}>
                <Card className="p-1 transition hover:opacity-90">
                  <div>
                    <CardHeader className="flex gap-2">
                      <img
                        src={avatarImageURL}
                        alt={mentor.name}
                        className="h-20 w-20 rounded object-cover"
                      />
                      <div className="space-y-1">
                        <CardTitle>{mentor.name}</CardTitle>
                        <CardDescription>
                          {mentor.profiles[0].headline}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>{/* Content */}</CardContent>
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
