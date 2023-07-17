import { Footer, HeaderNavigation } from "~/components"

interface Props {
  children: React.ReactNode
}

export function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <HeaderNavigation />
      <main className="flex-[1] lg:ml-16">{children}</main>
      <Footer />
    </div>
  )
}
