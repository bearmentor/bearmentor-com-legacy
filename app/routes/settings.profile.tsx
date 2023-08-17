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
import type { UserProfile } from "@prisma/client"
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
  Textarea,
} from "~/components"
import { model } from "~/models"
import {
  schemaUserProfileBio,
  schemaUserProfileHeadline,
  schemaUserProfileModeName,
} from "~/schemas"

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request)
  if (!userSession?.id) return redirect("/signout")
  const user = await prisma.user.findUnique({
    where: { id: userSession.id },
    include: { profiles: true },
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
          Your profiles and links. In Bearmentor, you could have multiple
          profiles.
        </p>
        <Button asChild size="xs" variant="secondary">
          <Link to="/profile">Go to your profile @{user?.username}</Link>
        </Button>
      </header>

      <ul className="space-y-10">
        {user?.profiles.map(userProfile => {
          return (
            <li key={userProfile.id} className="space-y-6">
              <UserProfileModeNameForm userProfile={userProfile as any} />
              <UserProfileHeadlineForm userProfile={userProfile as any} />
              <UserProfileBioForm userProfile={userProfile as any} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function UserProfileModeNameForm({
  userProfile,
}: {
  userProfile: Pick<UserProfile, "id" | "modeName">
}) {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const [form, { id, modeName }] = useForm<
    z.infer<typeof schemaUserProfileModeName>
  >({
    shouldValidate: "onSubmit",
    lastSubmission: actionData,
    onValidate({ formData }) {
      return parseZod(formData, { schema: schemaUserProfileModeName })
    },
  })

  return (
    <Form {...form.props} replace method="PUT" className="space-y-6">
      <fieldset
        disabled={isSubmitting}
        className="space-y-2 disabled:opacity-80"
      >
        <input hidden {...conform.input(id)} defaultValue={userProfile.id} />

        <FormField>
          <FormLabel htmlFor={modeName.id}>Profile Mode Name</FormLabel>
          <FormDescription>
            To identify from your multiple profiles
          </FormDescription>
          <Input
            {...conform.input(modeName)}
            type="text"
            defaultValue={String(userProfile.modeName)}
            placeholder="Profile Mode Name"
          />
          {modeName.error && (
            <Alert variant="destructive" id={modeName.errorId}>
              {modeName.error}
            </Alert>
          )}
        </FormField>

        <ButtonLoading
          name="intent"
          value="update-user-profile-modename"
          size="sm"
          disabled={isSubmitting}
          isSubmitting={isSubmitting}
          submittingText="Saving Mode Name..."
        >
          Save Mode Name
        </ButtonLoading>
      </fieldset>
    </Form>
  )
}

export function UserProfileHeadlineForm({
  userProfile,
}: {
  userProfile: Pick<UserProfile, "id" | "headline">
}) {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const [form, { id, headline }] = useForm<
    z.infer<typeof schemaUserProfileHeadline>
  >({
    shouldValidate: "onSubmit",
    lastSubmission: actionData,
    onValidate({ formData }) {
      return parseZod(formData, { schema: schemaUserProfileHeadline })
    },
  })

  return (
    <Form {...form.props} replace method="PUT" className="space-y-6">
      <fieldset
        disabled={isSubmitting}
        className="space-y-2 disabled:opacity-80"
      >
        <input hidden {...conform.input(id)} defaultValue={userProfile.id} />

        <FormField>
          <FormLabel htmlFor={headline.id}>Your Headline</FormLabel>
          <FormDescription>
            To recognize your profile, tagline, or job position.
          </FormDescription>
          <Input
            {...conform.input(headline)}
            type="text"
            defaultValue={userProfile.headline ?? ""}
            placeholder="Your Headline"
          />
          {headline.error && (
            <Alert variant="destructive" id={headline.errorId}>
              {headline.error}
            </Alert>
          )}
        </FormField>

        <ButtonLoading
          name="intent"
          value="update-user-profile-headline"
          size="sm"
          disabled={isSubmitting}
          isSubmitting={isSubmitting}
          submittingText="Saving Headline..."
        >
          Save Headline
        </ButtonLoading>
      </fieldset>
    </Form>
  )
}

export function UserProfileBioForm({
  userProfile,
}: {
  userProfile: Pick<UserProfile, "id" | "bio">
}) {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const [form, { id, bio }] = useForm<z.infer<typeof schemaUserProfileBio>>({
    shouldValidate: "onSubmit",
    lastSubmission: actionData,
    onValidate({ formData }) {
      return parseZod(formData, { schema: schemaUserProfileBio })
    },
  })

  return (
    <Form {...form.props} replace method="PUT" className="space-y-6">
      <fieldset
        disabled={isSubmitting}
        className="space-y-2 disabled:opacity-80"
      >
        <input hidden {...conform.input(id)} defaultValue={userProfile.id} />

        <FormField>
          <FormLabel htmlFor={bio.id}>Your Bio</FormLabel>
          <FormDescription>
            To inform or explain about yourself. Can also <span>@mention</span>{" "}
            other users and organizations to link to them.
          </FormDescription>
          <Textarea
            {...conform.input(bio)}
            defaultValue={userProfile.bio ?? ""}
            placeholder="Tell us a bit about yourself..."
            className="min-h-[200px]"
          />
          {bio.error && (
            <Alert variant="destructive" id={bio.errorId}>
              {bio.error}
            </Alert>
          )}
        </FormField>

        <ButtonLoading
          name="intent"
          value="update-user-profile-bio"
          size="sm"
          disabled={isSubmitting}
          isSubmitting={isSubmitting}
          submittingText="Saving Bio..."
        >
          Save Bio
        </ButtonLoading>
      </fieldset>
    </Form>
  )
}

export async function action({ request }: ActionArgs) {
  await delay()

  const formData = await request.formData()
  const parsed = parse(formData)
  const { intent } = parsed.payload

  if (intent === "update-user-profile-modename") {
    const submission = parseZod(formData, { schema: schemaUserProfileModeName })
    if (!submission.value) return badRequest(submission)
    const result = await model.userProfile.mutation.updateModeName(
      submission.value,
    )
    if (result.error) return forbidden({ ...submission, error: result.error })
    return json(submission)
  }

  if (intent === "update-user-profile-headline") {
    const submission = parseZod(formData, { schema: schemaUserProfileHeadline })
    if (!submission.value) return badRequest(submission)
    const result = await model.userProfile.mutation.updateHeadline(
      submission.value,
    )
    if (result.error) return forbidden({ ...submission, error: result.error })
    return json(submission)
  }

  if (intent === "update-user-profile-bio") {
    const submission = parseZod(formData, { schema: schemaUserProfileBio })
    if (!submission.value) return badRequest(submission)
    const result = await model.userProfile.mutation.updateBio(submission.value)
    if (result.error) return forbidden({ ...submission, error: result.error })
    return json(submission)
  }

  return json(parsed)
}
