import { json, type LoaderArgs } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"

import { authenticator } from "~/services/auth.server"
import { Button, Layout } from "~/components"

export const loader = async ({ request }: LoaderArgs) => {
  await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })

  return json({ message: "You are logged in!" })
}

export default function DashboardRoute() {
  const { message } = useLoaderData()

  return (
    <Layout className="space-y-8 px-4 py-4 sm:px-8">
      <h2>{message}</h2>
      <Form method="POST" action="/logout">
        <Button type="submit" variant="destructive">
          Logout
        </Button>
      </Form>
    </Layout>
  )
}
