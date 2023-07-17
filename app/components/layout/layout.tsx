import { cn } from "~/libs"
import { Footer, HeaderNavigation } from "~/components"

interface Props {
  className?: string
  children: React.ReactNode
}

export function Layout({ className, children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderNavigation />
      <main className={cn("flex-[1] lg:ml-16", className)}>{children}</main>
      <Footer className="lg:ml-16" />
    </div>
  )
}
