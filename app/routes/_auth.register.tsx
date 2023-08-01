import { json } from "@remix-run/node"
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { parse } from "@conform-to/zod"
import { badRequest } from "remix-utils"

import { authenticator } from "~/services/auth.server"
import { checkAuthInvite } from "~/helpers"
import { formatTitle } from "~/utils"
import { useRedirectTo } from "~/hooks"
import { Alert, Layout, UserAuthRegisterForm } from "~/components"
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

  const invite = checkAuthInvite(request)

  return json({ invite })
}

export default function Route() {
  const { invite } = useLoaderData<typeof loader>()
  const { searchParams } = useRedirectTo()

  if (!invite.by || !invite.code) {
    return (
      <Layout className="max-w-7xl space-y-8 px-4 py-4 sm:px-8">
        <header className="space-y-2">
          <h1>Registration is in waiting list</h1>
          <p>
            Please wait until it's available for everyone. Or get invited by
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
      </Layout>
    )
  }

  return (
    <Layout hasFooter={false}>
      <div className="relative grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <section className="mx-auto flex w-full max-w-md flex-col space-y-8 px-4 pb-20 pt-8">
          <section className="flex flex-col space-y-4">
            <h2>Register</h2>
            <p className="inline-flex flex-wrap gap-1 text-muted-foreground">
              <span>Already a Bearmentor user? </span>
              <Link
                to={{ pathname: "/login", search: searchParams.toString() }}
                className="hover-opacity font-bold text-brand"
              >
                Login
              </Link>
            </p>
            {invite.by && invite.code && (
              <Alert>
                You're being invited by{" "}
                <Link to={`/${invite.by}`} className="font-bold">
                  @{invite.by}
                </Link>{" "}
                with invite code{" "}
                <code className="font-bold">{invite.code}</code>
              </Alert>
            )}
          </section>

          <UserAuthRegisterForm />
        </section>

        <section className="relative hidden h-full flex-col gap-2 bg-stone-900 p-10 text-white lg:flex lg:items-end">
          <Link to="/" className="hidden lg:block">
            <h1 className="flex items-center gap-2 text-2xl">
              <img src="/images/bear-rounded.png" alt="Bear" className="h-10" />
              <span className="text-brand">Bearmentor</span>
            </h1>
          </Link>

          <p className="text-right text-lg font-semibold">
            Let's join 🐻 Bearmentor community to get mentored or mentor others!
            🎉
          </p>
        </section>
      </div>
    </Layout>
  )
}

export async function action({ request }: ActionArgs) {
  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()

  const submission = parse(formData, { schema: schemaUserRegister })
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission)
  }

  const result = await model.user.mutation.register(submission.value)
  if (result.error) {
    return json({ ...submission, error: result.error })
  }

  return authenticator.authenticate("form", request, {
    successRedirect: "/dashboard",
  })
}
