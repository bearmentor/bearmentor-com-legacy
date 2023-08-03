import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react"
import { conform, parse, useForm } from "@conform-to/react"
import { parse as parseZod } from "@conform-to/zod"
import type { User } from "@prisma/client"
import { badRequest, forbidden } from "remix-utils"
import type * as z from "zod"

import { authenticator } from "~/services"
import { prisma } from "~/libs"
import { delay } from "~/utils"
import {
  Alert,
  ButtonLoading,
  FormDescription,
  FormField,
  FormLabel,
  Input,
} from "~/components"
import { model } from "~/models"
import { schemaUserUpdateEmail } from "~/schemas"

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request)
  if (!userSession?.id) return redirect("/logout")

  const user = await prisma.user.findFirst({
    where: { id: userSession.id },
    select: { id: true, email: true },
  })

  return json({ user })
}

export default function Route() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <div className="w-full space-y-10">
      <header>
        <h2>Email</h2>
        <p className="text-muted-foreground">To communicate with you.</p>
      </header>

      <div className="space-y-6">
        <UserEmailForm user={user as any} />
      </div>
    </div>
  )
}

export function UserEmailForm({ user }: { user: Pick<User, "id" | "email"> }) {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const [form, { id, email }] = useForm<z.infer<typeof schemaUserUpdateEmail>>({
    shouldValidate: "onSubmit",
    lastSubmission: actionData,
    onValidate({ formData }) {
      return parseZod(formData, { schema: schemaUserUpdateEmail })
    },
  })

  return (
    <Form {...form.props} replace method="PUT" className="space-y-6">
      <fieldset
        disabled={isSubmitting}
        className="space-y-2 disabled:opacity-80"
      >
        <input hidden {...conform.input(id)} defaultValue={user.id} />

        <FormField>
          <FormLabel htmlFor={email.id}>Email</FormLabel>
          <FormDescription>
            Use your most active email address, to use to log in with
            Bearmentor.
          </FormDescription>
          <Input
            {...conform.input(email)}
            type="email"
            defaultValue={user.email || ""}
            placeholder="you@yourname.com"
          />
          {email.error && (
            <Alert variant="destructive" id={email.errorId}>
              {email.error}
            </Alert>
          )}
        </FormField>

        <ButtonLoading
          name="intent"
          value="update-user-email"
          size="sm"
          disabled={isSubmitting}
          isSubmitting={isSubmitting}
          submittingText="Saving New Email..."
        >
          Save New Email
        </ButtonLoading>
      </fieldset>
    </Form>
  )
}

export async function action({ request }: ActionArgs) {
  await delay()
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" })

  const formData = await request.formData()
  const parsed = parse(formData)
  const { intent } = parsed.payload

  if (intent === "update-user-email") {
    const submission = parseZod(formData, { schema: schemaUserUpdateEmail })
    if (!submission.value) return badRequest(submission)
    const result = await model.user.mutation.updateEmail(submission.value)
    if (result.error) return forbidden({ ...submission, error: result.error })
    return json(submission)
  }

  return json(parsed)
}
