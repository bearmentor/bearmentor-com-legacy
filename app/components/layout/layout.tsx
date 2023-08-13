import { cn } from "~/utils"
import { Anchor, Footer, HeaderNavigation } from "~/components"

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
  const showBanner = true

  return (
    <div className={cn("flex min-h-screen flex-col")}>
      <HeaderNavigation />

      {showBanner && <BannerInfo />}

      <main
        className={cn(
          "flex-[1] lg:ml-16",
          withPadding && "p-4 sm:p-8",
          className,
        )}
      >
        {children}
      </main>
      {hasFooter && <Footer className="lg:ml-16" />}
    </div>
  )
}

function BannerInfo() {
  return (
    <div className="flex w-full justify-center bg-stone-900 p-1">
      <p className="flex flex-wrap justify-center gap-1 text-center text-sm sm:gap-2">
        <span>
          Bearmentor is still{" "}
          <Anchor href="https://github.com/bearmentor">work in progress</Anchor>
        </span>
        <span>🚧</span>
        <span>Please wait until it's ready or explore what's available</span>
      </p>
    </div>
  )
}
