import type { LinksFunction, V2_MetaFunction } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react"
import brandFontStyles from "@fontsource/anybody/600.css"
import monoFontStyles from "@fontsource/pt-mono/index.css"
import sansFontStyles from "@fontsource/pt-sans/index.css"

import styles from "./globals.css"

export const links: LinksFunction = () => [
  {
    rel: "shortcut icon",
    href: "https://fav.farm/🐻",
  },
  {
    rel: "shortcut icon",
    href: "/favicon.ico",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "32x32",
    href: "/favicon-32x32.png",
  },
  {
    rel: "icon",
    type: "image/png",
    sizes: "16x16",
    href: "/favicon-16x16.png",
  },
  {
    rel: "apple-touch-icon",
    sizes: "180x180",
    href: "/apple-touch-icon-precomposed.png",
  },
  { rel: "stylesheet", href: brandFontStyles },
  { rel: "stylesheet", href: sansFontStyles },
  { rel: "stylesheet", href: monoFontStyles },
  { rel: "stylesheet", href: styles },
]

export const meta: V2_MetaFunction = () => {
  return [
    { title: "🐻 Bearmentor" },
    {
      name: "description",
      content: "Brilliant mentoring platform for people and organization.",
    },
  ]
}

export default function App() {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-stone-50 text-stone-950 dark:bg-stone-950 dark:text-stone-50">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
