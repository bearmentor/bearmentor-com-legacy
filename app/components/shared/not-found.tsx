import { Link } from "@remix-run/react"

import { Button } from "~/components"

export function NotFound({ children }: { children: React.ReactNode }) {
  return (
    <section className="flex flex-col items-center justify-center pt-4">
      <Link to="/" className="hover-opacity">
        <img src="/favicon.png" alt="Bear" className="h-12" />
      </Link>
      <div className="flex max-w-md flex-col items-center justify-center space-y-4 pt-24 text-center">
        <img
          src="/images/bear-fox.png"
          alt="Not Found Illustration"
          className="h-40 object-contain"
        />

        {children}

        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </section>
  )
}
