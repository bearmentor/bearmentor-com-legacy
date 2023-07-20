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
import { model } from "~/models"
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
  Input,
} from "~/components"
import {
  schemaUserUpdateEmail,
  schemaUserUpdateName,
  schemaUserUpdateNick,
  schemaUserUpdatePassword,
  schemaUserUpdateUsername,
} from "~/schemas"

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request)
  if (!userSession?.id) {
    return redirect("/logout")
  }

  const user = await prisma.user.findFirst({
    where: { id: userSession.id },
    select: {
      id: true,
      name: true,
      nick: true,
      username: true,
      email: true,
      avatars: { select: { url: true } },
      tags: { select: { id: true, symbol: true, name: true } },
      profiles: true,
    },
  })

  return json({ user })
}

export default function Route() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <div className="w-full space-y-10">
      <header>
        <h2>Profile</h2>
        <p className="text-muted-foreground">
          This is how others will see you on the site.
        </p>
      </header>

      <div className="space-y-6">
        <UserUsernameForm user={user as any} />
        <UserNameForm user={user as any} />
        <UserNickForm user={user as any} />
        <UserEmailForm user={user as any} />
      </div>
    </div>
  )
}

export function UserUsernameForm({
  user,
}: {
  user: Pick<User, "id" | "username">
}) {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"
  const schema = schemaUserUpdateUsername

  const [form, { id, username }] = useForm<z.infer<typeof schema>>({
    shouldValidate: "onSubmit",
    lastSubmission: actionData,
    onValidate({ formData }) {
      return parseZod(formData, { schema })
    },
  })

  return (
    <Form {...form.props} replace method="PUT" className="space-y-4">
      <fieldset
        disabled={isSubmitting}
        className="space-y-2 disabled:opacity-80"
      >
        <input hidden {...conform.input(id)} defaultValue={user.id} />

        <FormField>
          <FormLabel htmlFor={username.id}>Username</FormLabel>
          <Input
            {...conform.input(username)}
            type="text"
            defaultValue={user.username}
            placeholder="yourname"
            className="max-w-xs"
          />
          <FormDescription>
            This is your public username as @username
          </FormDescription>
          {username.error && (
            <Alert variant="destructive" id={username.errorId}>
              {username.error}
            </Alert>
          )}
        </FormField>

        <Button
          size="sm"
          type="submit"
          name="intent"
          variant="secondary"
          value="update-user-username"
          disabled={isSubmitting}
        >
          Save Username
        </Button>
      </fieldset>
    </Form>
  )
}

export function UserNameForm({ user }: { user: Pick<User, "id" | "name"> }) {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const [form, { id, name }] = useForm<z.infer<typeof schemaUserUpdateName>>({
    shouldValidate: "onSubmit",
    lastSubmission: actionData,
    onValidate({ formData }) {
      return parseZod(formData, { schema: schemaUserUpdateName })
    },
  })

  return (
    <Form {...form.props} replace method="PUT" className="space-y-4">
      <fieldset
        disabled={isSubmitting}
        className="space-y-2 disabled:opacity-80"
      >
        <input hidden {...conform.input(id)} defaultValue={user.id} />

        <FormField>
          <FormLabel htmlFor={name.id}>Full Name</FormLabel>
          <Input
            {...conform.input(name)}
            type="text"
            defaultValue={user.name}
            placeholder="Your Full Name"
            className="max-w-xs"
          />
          <FormDescription>
            This is your public display name, can be your real name or a
            pseudonym
          </FormDescription>
          {name.error && (
            <Alert variant="destructive" id={name.errorId}>
              {name.error}
            </Alert>
          )}
        </FormField>

        <Button
          size="sm"
          type="submit"
          name="intent"
          variant="secondary"
          value="update-user-name"
          disabled={isSubmitting}
        >
          Save Name
        </Button>
      </fieldset>
    </Form>
  )
}

export function UserNickForm({ user }: { user: Pick<User, "id" | "nick"> }) {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const [form, { id, nick }] = useForm<z.infer<typeof schemaUserUpdateNick>>({
    shouldValidate: "onSubmit",
    lastSubmission: actionData,
    onValidate({ formData }) {
      return parseZod(formData, { schema: schemaUserUpdateNick })
    },
  })

  return (
    <Form {...form.props} replace method="PUT" className="space-y-4">
      <fieldset
        disabled={isSubmitting}
        className="space-y-2 disabled:opacity-80"
      >
        <input hidden {...conform.input(id)} defaultValue={user.id} />

        <FormField>
          <FormLabel htmlFor={nick.id}>Nick</FormLabel>
          <Input
            {...conform.input(nick)}
            type="text"
            defaultValue={String(user.nick)}
            placeholder="Your Nick"
            className="max-w-xs"
          />
          <FormDescription>
            This is your nick name when being called
          </FormDescription>
          {nick.error && (
            <Alert variant="destructive" id={nick.errorId}>
              {nick.error}
            </Alert>
          )}
        </FormField>

        <Button
          size="sm"
          type="submit"
          name="intent"
          variant="secondary"
          value="update-user-nick"
          disabled={isSubmitting}
        >
          Save Nick
        </Button>
      </fieldset>
    </Form>
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
    <Form {...form.props} replace method="PUT" className="space-y-4">
      <fieldset
        disabled={isSubmitting}
        className="space-y-2 disabled:opacity-80"
      >
        <input hidden {...conform.input(id)} defaultValue={user.id} />

        <FormField>
          <FormLabel htmlFor={email.id}>Email</FormLabel>
          <Input
            {...conform.input(email)}
            type="email"
            defaultValue={String(user.email)}
            placeholder="you@yourname.com"
            className="max-w-xs"
          />
          <FormDescription>
            This is your default email to communicate with
          </FormDescription>
          {email.error && (
            <Alert variant="destructive" id={email.errorId}>
              {email.error}
            </Alert>
          )}
        </FormField>

        <Button
          size="sm"
          type="submit"
          name="intent"
          variant="secondary"
          value="update-user-email"
          disabled={isSubmitting}
        >
          Save Email
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

  if (intent === "update-user-username") {
    const submission = parseZod(formData, { schema: schemaUserUpdateUsername })
    if (!submission.value) return badRequest(submission)
    const result = await model.user.mutation.updateUsername(submission.value)
    if (result.error) return forbidden({ ...submission, error: result.error })
    return json(submission)
  }

  if (intent === "update-user-name") {
    const submission = parseZod(formData, { schema: schemaUserUpdateName })
    if (!submission.value) return badRequest(submission)
    const result = await model.user.mutation.updateName(submission.value)
    if (result?.error) return forbidden({ ...submission, error: result.error })
    return json(submission)
  }

  if (intent === "update-user-nick") {
    const submission = parseZod(formData, { schema: schemaUserUpdateNick })
    if (!submission.value) return badRequest(submission)
    const result = await model.user.mutation.updateNick(submission.value)
    if (result.error) return forbidden({ ...submission, error: result.error })
    return json(submission)
  }

  if (intent === "update-user-email") {
    const submission = parseZod(formData, { schema: schemaUserUpdateEmail })
    if (!submission.value) return badRequest(submission)
    const result = await model.user.mutation.updateEmail(submission.value)
    if (result.error) return forbidden({ ...submission, error: result.error })
    return json(submission)
  }

  if (intent === "update-user-password") {
    const submission = parseZod(formData, { schema: schemaUserUpdatePassword })
    if (!submission.value) return badRequest(submission)
    const result = await model.userPassword.mutation.update(submission.value)
    if (result.error) return forbidden({ ...submission, error: result.error })
    return json(submission)
  }

  return json(parsed)
}
