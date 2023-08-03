import { json, redirect } from "@remix-run/node"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"

import { authenticator } from "~/services"
import { delay } from "~/utils"
import { Layout, UserTagsForm } from "~/components"
import { model } from "~/models"

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
  if (!userSession?.id) return redirect("/logout")

  const user = await model.user.query.getById({ id: userSession.id })
  if (!user) return redirect("/logout")

  const userTags = await model.userTag.query.getAll()

  return json({ user, userTags })
}

export default function Route() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <Layout className="space-y-8 px-4 py-4 sm:px-8">
      <header>
        <div>
          <span>Welcome,</span>
          <h1 className="text-brand">{user.name}</h1>
          <p className="text-muted-foreground">
            Let's setup your account to get ready.
          </p>
        </div>
      </header>

      <UserTagsForm />
    </Layout>
  )
}

export async function action({ request }: ActionArgs) {
  await delay()

  const formData = await request.formData()
  const id = String(formData.get("id"))
  const tags = JSON.parse(String(formData.get("tags")))

  await model.user.mutation.updateTags({ id, tags })

  return redirect("/dashboard")
}
