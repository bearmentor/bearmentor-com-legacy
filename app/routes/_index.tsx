import type { V2_MetaFunction } from "@remix-run/node"

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: "Bearmentor",
    },
    {
      name: "description",
      content: "Brilliant mentoring platform for people and organization.",
    },
  ]
}

export default function Index() {
  return (
    <main className="container px-2 flex justify-center max-w-xl">
      <article className="space-y-8 my-8">
        <header className="space-y-4">
          <h1 className="flex flex-wrap gap-2 items-center">
            <img src="/favicon.png" alt="Bear" className="h-16" />
            <span className="text-emerald-500">Bearmentor</span>
          </h1>
          <h2>Brilliant mentoring</h2>
        </header>
        <section className="space-y-4">
          <p>
            The mentoring platform for people and organization. Free to use and
            open source. Still in early and active development. Check out{" "}
            <a
              href="https://github.com/bearmentor"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-700 dark:text-emerald-300 font-bold hover:opacity-80 transition-all"
            >
              github.com/bearmentor
            </a>
          </p>
          <img
            src="/images/bearmentor.png"
            alt="Bearmentor: Brilliant mentoring"
            className="bg-slate-900 rounded"
          />
          <pre className="p-2 rounded bg-stone-200 dark:bg-stone-900">
            <code>console.log("Hello, Bear")</code>
          </pre>
        </section>
      </article>
    </main>
  )
}
