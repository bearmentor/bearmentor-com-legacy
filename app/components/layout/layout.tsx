import { cn } from "~/libs"
import { Footer, HeaderNavigation } from "~/components"

interface Props {
  className?: string
  children: React.ReactNode
  hasFooter?: boolean
}

export function Layout({ className, children, hasFooter = true }: Props) {
  return (
    <div className={cn("flex min-h-screen flex-col")}>
      <HeaderNavigation />
      <main className={cn("flex-[1] lg:ml-16", className)}>{children}</main>
      {hasFooter && <Footer className="lg:ml-16" />}
    </div>
  )
}
