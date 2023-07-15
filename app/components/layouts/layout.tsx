import { Footer } from "~/components"

interface Props {
  children: React.ReactNode
}

export function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-[1]">{children}</main>
      <Footer />
    </div>
  )
}
