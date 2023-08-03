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
import {
  Alert,
  ButtonLoading,
  FormDescription,
  FormField,
  FormFieldSet,
  FormLabel,
  InputPassword,
} from "~/components"
import { model } from "~/models"
import { schemaUserUpdatePassword } from "~/schemas"
import { delay } from "~/utils"

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request)
  if (!userSession?.id) return redirect("/logout")

  const user = await prisma.user.findFirst({
    where: { id: userSession.id },
    select: { id: true, password: true },
  })

  return json({ user })
}

export default function Route() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <div className="w-full space-y-10">
      <header>
        <h2>Password</h2>
        <p className="text-muted-foreground">To secure your user account.</p>
      </header>

      <div className="space-y-6">
        <UserPasswordForm user={user as any} />
      </div>
    </div>
  )
}

export function UserPasswordForm({ user }: { user: Pick<User, "id"> }) {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const [form, { id, password, confirmPassword }] = useForm<
    z.infer<typeof schemaUserUpdatePassword>
  >({
    shouldValidate: "onSubmit",
    lastSubmission: actionData,
    onValidate({ formData }) {
      return parseZod(formData, { schema: schemaUserUpdatePassword })
    },
  })

  return (
    <Form {...form.props} replace method="PUT" className="space-y-6">
      <FormFieldSet disabled={isSubmitting}>
        <input hidden {...conform.input(id)} defaultValue={user.id} />

        <FormField>
          <FormLabel htmlFor={password.id}>New Password</FormLabel>
          <FormDescription>
            Make sure to save your new password safely in a password manager or
            other secure method you prefer.
          </FormDescription>
          <InputPassword
            {...conform.input(password)}
            placeholder="Your new password"
            defaultValue=""
          />
          {password.error && (
            <Alert variant="destructive" id={password.errorId}>
              {password.error}
            </Alert>
          )}
        </FormField>

        <FormField>
          <FormLabel htmlFor={confirmPassword.id}>
            Confirm New Password
          </FormLabel>
          <InputPassword
            {...conform.input(confirmPassword)}
            placeholder="Confirm your new password"
            defaultValue=""
          />
          {confirmPassword.error && (
            <Alert variant="destructive" id={confirmPassword.errorId}>
              {confirmPassword.error}
            </Alert>
          )}
        </FormField>

        <ButtonLoading
          variant="secondary"
          name="intent"
          value="update-user-password"
          size="sm"
          disabled={isSubmitting}
          isSubmitting={isSubmitting}
          submittingText="Saving New Password..."
        >
          Save New Password
        </ButtonLoading>
      </FormFieldSet>
    </Form>
  )
}

export async function action({ request }: ActionArgs) {
  await delay()
  await authenticator.isAuthenticated(request, { failureRedirect: "/login" })

  const formData = await request.formData()
  const parsed = parse(formData)
  const { intent } = parsed.payload

  if (intent === "update-user-password") {
    const submission = parseZod(formData, { schema: schemaUserUpdatePassword })
    if (!submission.value) return badRequest(submission)
    const result = await model.userPassword.mutation.update(submission.value)
    if (result.error) return forbidden({ ...submission, error: result.error })
    return json(submission)
  }

  return json(parsed)
}
