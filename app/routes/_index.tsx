import { json, type V2_MetaFunction } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { CircleIcon, StarIcon } from "@radix-ui/react-icons"

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
      role: { select: { symbol: true, name: true } },
      profiles: { select: { headline: true, links: true } },
    },
  })

  return json({ mentors })
}

export default function Index() {
  return (
    <main className="container px-2 sm:px-4 space-y-20">
      <LandingHero />
      <LandingMentors />
      <LandingDevelopment />
    </main>
  )
}

export function LandingHero() {
  return (
    <article className="container space-y-8 my-8 max-w-3xl">
      <header className="space-y-4">
        <h1 className="flex flex-wrap gap-2 items-center">
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
    <article className="w-full">
      {mentors.map((mentor) => {
        const avatarImageURL = `https://api.dicebear.com/6.x/thumbs/svg?seed=${mentor.username}`

        return (
          <Card key={mentor.id} className="max-w-md flex gap-2 p-2">
            <div>
              <img
                src={avatarImageURL}
                alt={mentor.name}
                className="w-24 rounded object-cover"
              />
            </div>
            <div>
              <CardHeader className="space-y-2">
                <div className="space-y-1">
                  <CardTitle>{mentor.name}</CardTitle>
                  <CardDescription>
                    {mentor.profiles[0].headline}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <CircleIcon className="h-3 w-3 fill-green-400 text-green-400" />
                    <span>Frontend</span>
                  </div>
                  <div>
                    <span>10 years exp.</span>
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="mr-1 h-3 w-3" />
                    <span>42 Favorited</span>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>
        )
      })}
    </article>
  )
}

export function LandingDevelopment() {
  return (
    <article className="container space-y-8 my-8 max-w-3xl">
      <section className="space-y-4">
        <img
          src="/images/bearmentor.png"
          alt="Bearmentor: Brilliant mentoring"
          className="bg-slate-900 rounded"
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
              className="text-emerald-700 dark:text-emerald-300 font-bold hover:opacity-80 transition-all"
            >
              github.com/bearmentor
            </a>
          </li>
        </ul>

        <pre className="p-2 rounded bg-stone-200 dark:bg-stone-900">
          <code>console.log("Hello, Bear")</code>
        </pre>
      </section>
    </article>
  )
}
