import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import {
  Form,
  Link,
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
  Button,
  ButtonLoading,
  FormDescription,
  FormField,
  FormLabel,
  Input,
} from "~/components"
import { model } from "~/models"
import {
  schemaUserUpdateName,
  schemaUserUpdateNick,
  schemaUserUpdateUsername,
} from "~/schemas"

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request)
  if (!userSession?.id) return redirect("/signout")
  const user = await prisma.user.findUnique({ where: { id: userSession.id } })
  return json({ user })
}

export default function Route() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <div className="w-full space-y-10">
      <header>
        <h2>General</h2>
        <p className="text-muted-foreground">Your general information.</p>
        <Button asChild size="xs" variant="secondary">
          <Link to="/profile">Go to your profile @{user?.username}</Link>
        </Button>
      </header>

      <div className="space-y-6">
        <UserUsernameForm user={user as any} />
        <UserNameForm user={user as any} />
        <UserNickForm user={user as any} />
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

  const [form, { id, username }] = useForm<
    z.infer<typeof schemaUserUpdateUsername>
  >({
    shouldValidate: "onSubmit",
    lastSubmission: actionData,
    onValidate({ formData }) {
      return parseZod(formData, { schema: schemaUserUpdateUsername })
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
          <FormLabel htmlFor={username.id}>Your Username</FormLabel>
          <FormDescription>
            Public @username and your URL namespace within Bearmentor like{" "}
            <code className="text-xs">bearmentor.com/yourname</code>. Please use
            20 characters at maximum.
          </FormDescription>
          <Input
            {...conform.input(username)}
            type="text"
            defaultValue={user.username}
            placeholder="yourname"
          />
          {username.error && (
            <Alert variant="destructive" id={username.errorId}>
              {username.error}
            </Alert>
          )}
        </FormField>

        <ButtonLoading
          name="intent"
          value="update-user-username"
          size="sm"
          disabled={isSubmitting}
          isSubmitting={isSubmitting}
          submittingText="Saving Username..."
        >
          Save Username
        </ButtonLoading>
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
    <Form {...form.props} replace method="PUT" className="space-y-6">
      <fieldset
        disabled={isSubmitting}
        className="space-y-2 disabled:opacity-80"
      >
        <input hidden {...conform.input(id)} defaultValue={user.id} />

        <FormField>
          <FormLabel htmlFor={name.id}>Your Full Name</FormLabel>
          <FormDescription>
            Display name you are comfortable with. It can be real name or a
            pseudonym.
          </FormDescription>
          <Input
            {...conform.input(name)}
            type="text"
            defaultValue={user.name}
            placeholder="Your Full Name"
          />
          {name.error && (
            <Alert variant="destructive" id={name.errorId}>
              {name.error}
            </Alert>
          )}
        </FormField>

        <ButtonLoading
          name="intent"
          value="update-user-name"
          size="sm"
          disabled={isSubmitting}
          isSubmitting={isSubmitting}
          submittingText="Saving Full Name..."
        >
          Save Full Name
        </ButtonLoading>
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
    <Form {...form.props} replace method="PUT" className="space-y-6">
      <fieldset
        disabled={isSubmitting}
        className="space-y-2 disabled:opacity-80"
      >
        <input hidden {...conform.input(id)} defaultValue={user.id} />

        <FormField>
          <FormLabel htmlFor={nick.id}>Your Nick Name</FormLabel>
          <FormDescription>
            When you are being called by someone.
          </FormDescription>
          <Input
            {...conform.input(nick)}
            type="text"
            defaultValue={user.nick ?? ""}
            placeholder="Your Nick"
          />
          {nick.error && (
            <Alert variant="destructive" id={nick.errorId}>
              {nick.error}
            </Alert>
          )}
        </FormField>

        <ButtonLoading
          name="intent"
          value="update-user-nick"
          size="sm"
          disabled={isSubmitting}
          isSubmitting={isSubmitting}
          submittingText="Saving Nick Name..."
        >
          Save Nick Name
        </ButtonLoading>
      </fieldset>
    </Form>
  )
}

export async function action({ request }: ActionArgs) {
  await delay()
  await authenticator.isAuthenticated(request, { failureRedirect: "/signin" })

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

  return json(parsed)
}
