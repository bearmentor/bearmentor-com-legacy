import type { V2_MetaFunction } from "@remix-run/node"

import { Button } from "~/components"

export const meta: V2_MetaFunction = () => {
  return [
    { title: "Bearmentor" },
    {
      name: "description",
      content: "Brilliant mentoring platform for people and organization.",
    },
  ]
}

export default function Index() {
  return (
    <main className="container px-2 flex justify-center">
      <LandingHero />
    </main>
  )
}

export function LandingHero() {
  return (
    <article className="space-y-8 my-8 max-w-3xl">
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
