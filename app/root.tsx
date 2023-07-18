import { useEffect } from "react"
import type {
  LinksFunction,
  LoaderArgs,
  V2_MetaFunction,
} from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useNavigation,
} from "@remix-run/react"
import brandFontStyles from "@fontsource/anybody/600.css"
import monoFontStyles from "@fontsource/pt-mono/index.css"
import sansFontStyles from "@fontsource/pt-sans/index.css"
import { Analytics } from "@vercel/analytics/react"
import { modelUser } from "~/models"
import NProgress from "nprogress"

import { authenticator } from "~/services/auth.server"
import { createCacheHeaders } from "~/utils"

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

export const loader = async ({ request }: LoaderArgs) => {
  const nodeEnv = process.env.NODE_ENV
  const userSession = await authenticator.isAuthenticated(request)
  const userData = await modelUser.getForSession({
    id: String(userSession?.id),
  })

  // If there is an authenticated user, but the user doesn't exist anymore
  if (userSession && !userData) {
    return redirect(`/logout`)
  }

  return json(
    { nodeEnv, userSession, userData },
    { headers: createCacheHeaders(request, 3600) },
  )
}

export default function App() {
  const { nodeEnv } = useLoaderData<typeof loader>()
  const navigation = useNavigation()

  useEffect(() => {
    if (navigation.state === "idle") NProgress.done()
    else NProgress.start()
  }, [navigation.state])

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
        {nodeEnv !== "development" && <Analytics />}
      </body>
    </html>
  )
}
