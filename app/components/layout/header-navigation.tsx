import { Link } from "@remix-run/react"

import { cn } from "~/libs"

const navItems = [
  { to: "/", text: "Home", icon: "home" },
  { to: "/mentors", text: "Mentors", icon: "mentors" },
  { to: "/mentee", text: "Mentee", icon: "mentees" },
  { to: "/login", text: "Login", icon: "login" },
]

export function HeaderNavigation() {
  return (
    <header
      className={cn(
        "border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950",
        "fixed bottom-0 left-0 z-10 flex h-14 w-full items-center justify-center border-t-2",
        "lg:top-0 lg:h-screen lg:w-16 lg:border-r-2 lg:border-t-0",
      )}
    >
      <nav className="w-full max-w-lg">
        <ul className="flex justify-between gap-4 lg:flex-col">
          {navItems.map((navItem) => {
            return (
              <li key={navItem.to}>
                <Link
                  to={navItem.to}
                  className="rounded px-3 py-2 font-bold uppercase hover:bg-stone-800"
                >
                  {navItem.text}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
