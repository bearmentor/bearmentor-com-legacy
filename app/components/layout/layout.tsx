import { cn } from "~/utils"
import { Footer, HeaderNavigation } from "~/components"

interface Props {
  className?: string
  children: React.ReactNode
  hasFooter?: boolean
  withPadding?: boolean
}

export function Layout({
  className,
  children,
  hasFooter = true,
  withPadding = false,
}: Props) {
  return (
    <div className={cn("flex min-h-screen flex-col")}>
      <HeaderNavigation />
      <main
        className={cn(
          "flex-[1] lg:ml-16",
          withPadding && "px-4 py-4 sm:px-8",
          className,
        )}
      >
        {children}
      </main>
      {hasFooter && <Footer className="lg:ml-16" />}
    </div>
  )
}
