import { json } from "@remix-run/node"
import type { ActionArgs, LoaderArgs, V2_MetaFunction } from "@remix-run/node"
import { Link, useLoaderData } from "@remix-run/react"
import { parse } from "@conform-to/zod"
import { badRequest } from "remix-utils"

import { authenticator } from "~/services"
import { checkAuthInvite } from "~/helpers"
import { createTimer, formatTitle } from "~/utils"
import { useRedirectTo } from "~/hooks"
import { Alert, Layout, UserAuthSignUpForm } from "~/components"
import { model } from "~/models"
import { schemaUserSignUp } from "~/schemas"

export const meta: V2_MetaFunction = () => {
  return [
    { title: formatTitle("Sign Up") },
    {
      name: "description",
      content: "Create a new 🐻 Bearmentor user account.",
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

  return (
    <Layout hasFooter={false}>
      <div className="relative grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0">
        <section className="mx-auto flex w-full max-w-md flex-col space-y-8 px-4 pb-20 pt-8">
          <section className="flex flex-col space-y-4">
            <h2>Sign Up</h2>
            <p className="inline-flex flex-wrap gap-1 text-muted-foreground">
              <span>Already a Bearmentor user? </span>
              <Link
                to={{ pathname: "/signin", search: searchParams.toString() }}
                className="hover-opacity font-bold text-brand"
              >
                Sign In
              </Link>
            </p>

            {!invite.isAvailable && (
              <Alert>
                Signing up is free but still in waiting list. Please wait for
                availability. Or get invited by existing members.
              </Alert>
            )}

            {invite.isAvailable && (
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

          <UserAuthSignUpForm
            invite={invite as ReturnType<typeof checkAuthInvite>}
          />
        </section>

        <aside className="relative hidden h-full flex-col gap-10 bg-black p-10 text-white lg:flex lg:items-end">
          <Link to="/" className="hidden lg:block">
            <h1 className="flex items-center gap-2 text-2xl">
              <img src="/images/bear-rounded.png" alt="Bear" className="h-10" />
              <span className="text-brand">Bearmentor</span>
            </h1>
          </Link>

          <blockquote className="space-y-2 text-right">
            <p className="max-w-xs text-lg font-semibold">
              &ldquo;Let's join 🐻 Bearmentor community to get mentored or
              mentor others! 🎉&rdquo;
            </p>
            <footer>
              —{" "}
              <Link to="/haidar" className="link">
                M Haidar Hanif
              </Link>
              , Founder of Bearmentor
            </footer>
          </blockquote>
        </aside>
      </div>
    </Layout>
  )
}

export async function action({ request }: ActionArgs) {
  const timer = createTimer()
  const clonedRequest = request.clone()
  const formData = await clonedRequest.formData()

  const submission = parse(formData, { schema: schemaUserSignUp })
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission)
  }

  const invite = checkAuthInvite(request)
  if (!invite.isAvailable) {
    return json({
      ...submission,
      error: { email: "Your email is not invited yet" },
    })
  }

  const result = await model.user.mutation.signup(submission.value)
  await timer.delay()
  if (result.error) {
    return json({ ...submission, error: result.error })
  }

  return authenticator.authenticate("form", request, {
    successRedirect: "/welcome",
  })
}
