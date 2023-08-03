import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"

import { authenticator } from "~/services"
import { prisma } from "~/libs"
import { delay } from "~/utils"
import { UserTagsForm } from "~/components"
import { model } from "~/models"

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request)
  if (!userSession?.id) return redirect("/logout")

  let [user, userTags] = await prisma.$transaction([
    prisma.user.findFirst({
      where: { id: userSession.id },
      select: { id: true, tags: true },
    }),

    model.userTag.query.getAll(),
  ])
  if (!user) return redirect("/logout")
  if (!userTags) {
    userTags = []
  }

  return json({ user, userTags })
}

export default function Route() {
  return (
    <div className="w-full space-y-10">
      <header>
        <h2>Tags</h2>
        <p className="text-muted-foreground">To communicate with you.</p>
      </header>

      <div className="space-y-6">
        <UserTagsForm />
      </div>
    </div>
  )
}

export async function action({ request }: ActionArgs) {
  await delay()

  const formData = await request.formData()
  const id = String(formData.get("id"))
  const tags = JSON.parse(String(formData.get("tags")))

  await model.user.mutation.updateTags({ id, tags })

  return null
}