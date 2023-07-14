import type { LinksFunction } from "@remix-run/node"
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

export default function App() {
  return (
    <html lang="en" className="dark">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="text-stone-950 bg-stone-50 dark:text-stone-50 dark:bg-stone-950">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
