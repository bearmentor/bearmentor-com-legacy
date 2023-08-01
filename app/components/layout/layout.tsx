import { cn } from "~/libs"
import { Footer, HeaderNavigation } from "~/components"

interface Props {
  className?: string
  children: React.ReactNode
  hasFooter?: boolean
}

export function Layout({ className, children, hasFooter = true }: Props) {
  return (
    <div
      className={cn(
        "flex min-h-screen flex-col",
        "border-t-2 border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-950",
      )}
    >
      <HeaderNavigation />
      <main className={cn("flex-[1] lg:ml-16", className)}>{children}</main>
      {hasFooter && <Footer className="lg:ml-16" />}
    </div>
  )
}
