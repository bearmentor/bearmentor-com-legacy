import { createCookieSessionStorage } from "@remix-run/node"

function convertDaysToSeconds(days: number) {
  return 60 * 60 * 24 * days // seconds * minutes * hours * days
}

const remember = true // TODO: Integrate on auth flow
const maxAgeDays = 7

// export the whole sessionStorage object
export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    maxAge: remember ? convertDaysToSeconds(maxAgeDays) : undefined,
    secrets: [String(process.env.SESSION_SECRET)],
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
})

// you can also export the methods individually for your own usage
export const { getSession, commitSession, destroySession } = sessionStorage
