import { Link } from "@remix-run/react"
import {
  HomeIcon,
  SearchIcon,
  UnlockIcon,
  User2Icon,
  Users2Icon,
} from "lucide-react"

import { cn } from "~/libs"
import { TooltipAuto, TooltipProvider } from "~/components"

const navItems = [
  { to: "/", text: "Home", icon: <HomeIcon className="icon" /> },
  { to: "/search", text: "Search", icon: <SearchIcon className="icon" /> },
  { to: "/mentors", text: "Mentors", icon: <User2Icon className="icon" /> },
  { to: "/mentees", text: "Mentees", icon: <Users2Icon className="icon" /> },
  { to: "/login", text: "Login", icon: <UnlockIcon className="icon" /> },
]

export function HeaderNavigation() {
  return (
    <header
      className={cn(
        "select-none",
        "border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950",
        "fixed bottom-0 left-0 z-10 flex w-full items-center justify-center border-t-2",
        "lg:top-0 lg:h-screen lg:w-16 lg:border-r-2 lg:border-t-0",
      )}
    >
      <nav className="w-full max-w-3xl">
        <TooltipProvider delayDuration={300}>
          <ul className="flex justify-between gap-10 p-2 sm:gap-4 lg:flex-col">
            {navItems.map((navItem) => {
              return (
                <li key={navItem.to}>
                  <TooltipAuto
                    content={navItem.text}
                    className="hidden lg:block"
                    side="right"
                  >
                    <Link
                      to={navItem.to}
                      className="flex items-center justify-center gap-2 rounded p-2 font-bold hover:bg-stone-800"
                    >
                      {navItem.icon}
                      <span className="hidden sm:block lg:hidden">
                        {navItem.text}
                      </span>
                    </Link>
                  </TooltipAuto>
                </li>
              )
            })}
          </ul>
        </TooltipProvider>
      </nav>
    </header>
  )
}
