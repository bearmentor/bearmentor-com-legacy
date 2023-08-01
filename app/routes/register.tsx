import { json } from "@remix-run/node"
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node"
import { Link } from "@remix-run/react"
import { parse } from "@conform-to/zod"

import { authenticator } from "~/services/auth.server"
import { formatTitle } from "~/utils"
import { Layout } from "~/components"
import { model } from "~/models"
import { schemaUserRegister } from "~/schemas"

export const meta: V2_MetaFunction = () => {
  return [
    { title: formatTitle("Register") },
    {
      name: "description",
      content: "Create your new 🐻 Bearmentor user account.",
    },
  ]
}

export const loader = async ({ request }: LoaderArgs) => {
  await authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  })

  const url = new URL(request.url)
  const invitedBy = url.searchParams.get("invitedBy") || undefined
  const inviteCode = url.searchParams.get("inviteCode") || undefined

  console.log({ invitedBy, inviteCode })

  return null
}

export default function Route() {
  return (
    <Layout className="flex justify-center">
      <div className="max-w-2xl space-y-4 px-4 py-4 sm:px-8">
        <header className="space-y-2">
          <h1 className="flex flex-col text-4xl">
            <span>Registration is in waiting list</span>
          </h1>
          <p>
            Please wait until it's available for anyone. Or get invited by
            existing memebers.
          </p>
        </header>

        <section>
          <p className="text-muted-foreground">
            Already a Bearmentor user?{" "}
            <Link to={`/login`} className="hover-opacity font-bold text-brand">
              Login to your account
            </Link>
          </p>
        </section>
      </div>
    </Layout>
  )
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const submission = parse(formData, { schema: schemaUserRegister })

  if (!submission.value || submission.intent !== "submit") {
    return json(submission, { status: 400 })
  }

  const result = await model.user.mutation.register(submission.value)
  if (result.error) {
    return json({ ...submission, error: result.error })
  }

  return authenticator.authenticate("form", request, {
    successRedirect: "/dashboard",
  })
}
