import { NavLink, useLocation } from "@remix-run/react"
import type { Location } from "@remix-run/react"
import {
  DashboardIcon,
  Half1Icon,
  Half2Icon,
  HomeIcon,
  LockOpen1Icon,
  MagnifyingGlassIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons"

import type { UserData } from "~/services/auth.server"
import { cn } from "~/libs"
import { useRootLoaderData, useScreenLarge } from "~/hooks"
import { TooltipAuto, TooltipProvider } from "~/components"

type NavItem = {
  to: string
  text: string
  icon: React.ReactNode
}

const navPublicItems: NavItem[] = [
  {
    to: "/",
    text: "Home",
    icon: <HomeIcon className="icon" />,
  },
  {
    to: "/broadcasts",
    text: "Broadcasts",
    icon: <RocketIcon className="icon" />,
  },
  {
    to: "/search",
    text: "Search",
    icon: <MagnifyingGlassIcon className="icon" />,
  },
  {
    to: "/mentors",
    text: "Mentors",
    icon: <Half2Icon className="icon" />,
  },
  {
    to: "/mentees",
    text: "Mentees",
    icon: <Half1Icon className="icon" />,
  },
]

const navUnauthenticatedItems: NavItem[] = [
  {
    to: "/login",
    text: "Login",
    icon: <LockOpen1Icon className="icon" />,
  },
]

const navAuthenticatedItems: NavItem[] = [
  {
    to: "/dashboard",
    text: "Dashboard",
    icon: <DashboardIcon className="icon" />,
  },
  {
    to: "/profile",
    text: "Profile",
    icon: <PersonIcon className="icon" />,
  },
]

export function HeaderNavigation() {
  const { userSession } = useRootLoaderData()

  return (
    <header
      className={cn(
        "z-10 select-none",
        "border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950",
        "fixed bottom-0 left-0 flex w-full items-center justify-center border-t-2",
        "lg:top-0 lg:h-screen lg:w-16 lg:border-r-2 lg:border-t-0",
      )}
    >
      <nav className="w-full max-w-md md:max-w-3xl">
        <TooltipProvider delayDuration={500}>
          <ul className="flex justify-between gap-0 p-2 sm:gap-2 lg:flex-col">
            <NavigationList navItems={navPublicItems} />
            {!userSession && (
              <NavigationList navItems={navUnauthenticatedItems} />
            )}
            {userSession && <NavigationList navItems={navAuthenticatedItems} />}
          </ul>
        </TooltipProvider>
      </nav>
    </header>
  )
}

export function NavigationList({ navItems }: { navItems: NavItem[] }) {
  const location = useLocation()
  const { userData } = useRootLoaderData()
  const isScreenLarge = useScreenLarge()

  return (
    <>
      {navItems.map(navItem => {
        return (
          <li key={navItem.to}>
            <TooltipAuto
              content={navItem.text}
              className="hidden lg:block"
              side={isScreenLarge ? "right" : "top"}
            >
              <NavLink
                to={navItem.to}
                className={({ isActive }) => {
                  return cn(
                    "flex items-center justify-center gap-2 rounded p-2 font-bold ",
                    isActive ||
                      (navItem.to === "/profile" &&
                        checkIfActiveUsername(location, userData))
                      ? "dark:bg-emerald-950 dark:hover:bg-emerald-900"
                      : "hover:bg-stone-800",
                  )
                }}
              >
                {navItem.to === "/profile" && userData ? (
                  <img
                    className="icon rounded lg:w-full"
                    src={userData?.avatars[0]?.url}
                    alt={userData?.username}
                    width={24}
                    height={24}
                  />
                ) : (
                  navItem.icon
                )}

                <span className="hidden md:block lg:hidden">
                  {navItem.text}
                </span>
              </NavLink>
            </TooltipAuto>
          </li>
        )
      })}
    </>
  )
}

// Because the navigation has a Link to /profile route
// But if we are in the /$username route, then we have to check it
export function checkIfActiveUsername(
  location: Location,
  userData: UserData | undefined,
) {
  return location?.pathname === `/${userData?.username}`
}
