import { json } from "@remix-run/node"
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node"
import { Link, useActionData } from "@remix-run/react"
import { useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import { z } from "zod"

import { authenticator } from "~/services/auth.server"
import { formatTitle } from "~/utils"
import { Layout } from "~/components"

export const meta: V2_MetaFunction = () => {
  return [
    { title: formatTitle("Register") },
    {
      name: "description",
      content: "Create your new 🐻 Bearmentor user account.",
    },
  ]
}

const schema = z.object({
  // Add your schema here
})

export async function loader({ request }: LoaderArgs) {
  return authenticator.isAuthenticated(request, {
    successRedirect: "/dashboard",
  })
}

export default function Route() {
  const lastSubmission = useActionData<typeof action>()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [form] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema })
    },
  })

  return (
    <Layout className="flex justify-center">
      <div className="max-w-2xl space-y-4 px-4 py-4 sm:px-8">
        <header className="space-y-2">
          <h1 className="flex flex-col items-center justify-center text-4xl text-brand">
            <span>Registration is in waiting list</span>
          </h1>
          <p>Please wait until it's available</p>
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
  const submission = parse(formData, { schema })

  if (!submission.value || submission.intent !== "submit") {
    return json(submission, { status: 400 })
  }

  return json(submission)
}
