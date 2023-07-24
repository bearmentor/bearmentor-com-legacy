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

import { authenticator } from "~/services/auth.server"
import { prisma } from "~/libs"
import {
  Alert,
  Button,
  FormDescription,
  FormField,
  FormLabel,
  InputPassword,
} from "~/components"
import { model } from "~/models"
import { schemaUserUpdatePassword } from "~/schemas"

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request)
  if (!userSession?.id) {
    return redirect("/logout")
  }

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
      <fieldset
        disabled={isSubmitting}
        className="space-y-4 disabled:opacity-80"
      >
        <input hidden {...conform.input(id)} defaultValue={user.id} />

        <FormField>
          <FormLabel htmlFor={password.id}>New Password</FormLabel>
          <InputPassword
            {...conform.input(password)}
            placeholder="Your new password"
            defaultValue=""
          />
          <FormDescription>
            Make sure to save your new password safely in a password manager
          </FormDescription>
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

        <Button
          type="submit"
          name="intent"
          variant="secondary"
          value="update-user-password"
          disabled={isSubmitting}
          size="sm"
        >
          Save New Password
        </Button>
      </fieldset>
    </Form>
  )
}

export async function action({ request }: ActionArgs) {
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
