import { json } from "@remix-run/node"
import type { LoaderArgs } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"

import { prisma } from "~/libs"
import { createCacheHeaders } from "~/utils"
import { AvatarAuto, Button, Layout, UserCard } from "~/components"

export async function loader({ request }: LoaderArgs) {
  const mentors = await prisma.user.findMany({
    where: { tags: { some: { symbol: "MENTOR" } } },
    orderBy: { createdAt: "asc" },
    take: 12,
    select: {
      id: true,
      name: true,
      username: true,
      avatars: { select: { url: true } },
      tags: { select: { id: true, symbol: true, name: true } },
      profiles: { select: { headline: true, links: true } },
    },
  })

  const mentees = await prisma.user.findMany({
    where: { tags: { some: { symbol: "MENTEE" } } },
    orderBy: { createdAt: "asc" },
    take: 24,
    select: {
      id: true,
      name: true,
      username: true,
      avatars: { select: { url: true } },
    },
  })

  return json(
    { mentors, mentees },
    { headers: createCacheHeaders(request, 3600) },
  )
}

export default function Index() {
  return (
    <Layout className="flex flex-col items-center justify-center gap-20 px-4 sm:px-8">
      <LandingHero />
      <LandingMentors />
      <LandingMentees />
      <LandingDevelopment />
    </Layout>
  )
}

export function LandingHero() {
  return (
    <article className="w-full max-w-3xl space-y-8 pb-10 pt-20">
      <section className="flex gap-8">
        <div className="flex w-full flex-col items-center justify-center space-y-4 text-center lg:items-start lg:text-left">
          <h1 className="flex flex-col flex-wrap items-center gap-2 lg:flex-row">
            <img src="/images/bear-rounded.png" alt="Bear" className="h-16" />
            <span className="text-emerald-500">Bearmentor</span>
          </h1>
          <h2>Brilliant mentoring</h2>
          <p>The mentoring platform for people and organization.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link to="/mentors">Discover Mentors</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Login to Continue</Link>
            </Button>
          </div>
        </div>
        <div className="hidden lg:flex">
          <img
            src="/images/bear-wolf.png"
            alt="Hero Illustration"
            className="w-80 object-contain"
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
    <article className="w-full max-w-7xl space-y-4">
      <h2 className="text-emerald-500">Available Mentors</h2>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {mentors.map((user) => {
          return (
            <li key={user.id} className="w-full">
              <Link to={user.username}>
                <UserCard user={user as any} />
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
    <article className="w-full max-w-7xl space-y-4">
      <h2 className="text-emerald-500">Featured Mentees</h2>
      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {mentees.map((user) => {
          return (
            <li key={user.id}>
              <Link
                to={user.username}
                className="flex gap-2 py-1 transition hover:opacity-80"
              >
                <AvatarAuto
                  className="h-14 w-14"
                  src={user.avatars[0]?.url}
                  alt={user.username}
                  fallback={user.username[0].toUpperCase()}
                />
                <div className="flex items-center">
                  <h3 className="text-base">{user.name}</h3>
                </div>
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
    <article className="w-full max-w-3xl space-y-8 py-20">
      <section className="space-y-4">
        <img
          src="/images/bearmentor.png"
          alt="Bearmentor: Brilliant mentoring"
          className="rounded bg-slate-900"
        />

        <div className="space-y-4">
          <p>
            Bearmentor is available as open source, free to use, still has
            manual payment process, will have automatic payment options.
          </p>
          <p>
            But also making a business, revenue, profit model in mind for
            sustainability.
          </p>
          <p>
            This is still in very early development. Check out{" "}
            <a
              href="https://github.com/bearmentor"
              target="_blank"
              rel="noreferrer"
              className="font-bold text-emerald-700 transition hover:opacity-80 dark:text-emerald-300"
            >
              github.com/bearmentor
            </a>
          </p>
        </div>
      </section>
    </article>
  )
}
