import { NavLink, Outlet } from "@remix-run/react"

import { cn } from "~/libs"
import { buttonVariants, Layout } from "~/components"

export const settingsNavItems = [
  { title: "Profile", to: "/settings/profile" },
  { title: "Account", to: "/settings/account" },
  { title: "Appearance", to: "/settings/appearance" },
  { title: "Notifications", to: "/settings/notifications" },
  { title: "Display", to: "/settings/display" },
]

export default function Route() {
  return (
    <Layout className="px-4 sm:px-8">
      <header className="py-10">
        <h1 className="text-4xl">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </p>
      </header>

      <div className="m:flex-row flex max-w-4xl flex-col gap-4 sm:-mx-4 sm:flex-row sm:gap-8">
        {/* Maximum width is less than xs */}
        <aside className="w-full max-w-[200px] sm:block">
          <SidebarNav items={settingsNavItems} />
        </aside>

        <Outlet />
      </div>
    </Layout>
  )
}

interface SidebarNavProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    to: string
    title: string
  }[]
}

export function SidebarNav({ className, items, ...props }: SidebarNavProps) {
  return (
    <nav className={cn("flex gap-2 sm:flex-col", className)} {...props}>
      {items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              buttonVariants({ variant: "ghost" }),
              isActive
                ? "bg-emerald-950 hover:bg-emerald-900"
                : "hover:bg-muted",
              "justify-start",
            )
          }
        >
          {item.title}
        </NavLink>
      ))}
    </nav>
  )
}
