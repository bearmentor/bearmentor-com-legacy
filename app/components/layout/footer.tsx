import { Link } from "@remix-run/react"

import { cn } from "~/libs"

const footerNavItems = [
  { to: "search", text: "Search" },
  { to: "login", text: "Login" },
]

interface Props {
  className?: string
}

export function Footer({ className }: Props) {
  const today = new Date()

  return (
    <footer
      className={cn("flex justify-center pb-20 pt-40 lg:pb-10", className)}
    >
      <div className="flex flex-col flex-wrap items-center justify-center gap-4 text-muted-foreground sm:flex-row sm:gap-8">
        <p>&copy; {today.getFullYear()} Bearmentor</p>
        {/* <FooterNavigation /> */}
      </div>
    </footer>
  )
}

export function FooterNavigation() {
  return (
    <nav>
      <ul className="flex flex-wrap gap-4">
        {footerNavItems.map((navItem) => {
          return (
            <li key={navItem.to}>
              <Link
                to={navItem.to}
                className="font-bold transition hover:opacity-80"
              >
                {navItem.text}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
