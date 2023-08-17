import { useRef } from "react"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { json, redirect } from "@remix-run/node"
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react"
import type { FieldsetConfig } from "@conform-to/react"
import {
  conform,
  list,
  parse,
  useFieldList,
  useFieldset,
  useForm,
} from "@conform-to/react"
import { parse as parseZod } from "@conform-to/zod"
import type { UserProfile } from "@prisma/client"
import {
  IconArrowMoveDown,
  IconArrowMoveUp,
  IconBackspaceFilled,
  IconPlus,
  IconTrashXFilled,
} from "@tabler/icons-react"
import { badRequest, forbidden } from "remix-utils"
import type * as z from "zod"

import { authenticator } from "~/services"
import { prisma } from "~/libs"
import { cn, createTimer } from "~/utils"
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
import type { schemaLink } from "~/schemas"
import {
  schemaUserProfileBio,
  schemaUserProfileHeadline,
  schemaUserProfileLinks,
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
              <UserProfileLinksForm userProfile={userProfile as any} />
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

export function UserProfileLinksForm({
  userProfile,
}: {
  userProfile: Pick<UserProfile, "id" | "links">
}) {
  const actionData = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const [form, { id, links }] = useForm<z.infer<typeof schemaUserProfileLinks>>(
    {
      shouldValidate: "onSubmit",
      lastSubmission: actionData,
      onValidate({ formData }) {
        return parseZod(formData, { schema: schemaUserProfileLinks })
      },
      defaultValue: {
        links: userProfile.links,
      },
    },
  )

  const linksItems = useFieldList(form.ref, links)
  const isAllowAddLink = linksItems.length < 10

  return (
    <Form {...form.props} replace method="PUT" className="space-y-6">
      <fieldset
        disabled={isSubmitting}
        className="space-y-2 disabled:opacity-80"
      >
        <input hidden {...conform.input(id)} defaultValue={userProfile.id} />

        <FormField>
          <FormLabel htmlFor={links.id}>Your Links</FormLabel>
          <FormDescription>
            To link your websites, social media, and projects/products. Limited
            to 10 items.
          </FormDescription>

          {linksItems.map((linkItem, index) => (
            <section key={linkItem.key} className="flex gap-2">
              <LinkItemFieldset {...linkItem} />
              <div className="flex gap-1">
                <Button
                  size="xs"
                  variant="secondary"
                  disabled={index === 0}
                  {...list.reorder(links.name, {
                    from: index,
                    to: index > 0 ? index - 1 : index,
                  })}
                >
                  <IconArrowMoveUp className="icon-xs" />
                </Button>
                <Button
                  size="xs"
                  variant="secondary"
                  disabled={index === 9}
                  {...list.reorder(links.name, {
                    from: index,
                    to: linksItems.length > 2 && index < 9 ? index + 1 : index,
                  })}
                >
                  <IconArrowMoveDown className="icon-xs" />
                </Button>
                <Button
                  size="xs"
                  variant="secondary"
                  {...list.replace(links.name, {
                    index,
                    defaultValue: { url: "", text: "" },
                  })}
                >
                  <IconBackspaceFilled className="icon-xs" />
                </Button>
                <Button
                  size="xs"
                  variant="destructive"
                  {...list.remove(links.name, { index })}
                >
                  <IconTrashXFilled className="icon-xs" />
                </Button>
              </div>
            </section>
          ))}
          <Button
            size="xs"
            variant="secondary"
            disabled={!isAllowAddLink}
            {...list.append(links.name)}
          >
            <IconPlus className="icon-xs" />
            <span>Add link</span>
          </Button>

          {links.error && (
            <Alert variant="destructive" id={links.errorId}>
              {links.error}
            </Alert>
          )}
        </FormField>

        <ButtonLoading
          name="intent"
          value="update-user-profile-links"
          size="sm"
          disabled={isSubmitting}
          isSubmitting={isSubmitting}
          submittingText="Saving Links..."
        >
          Save Links
        </ButtonLoading>
      </fieldset>
    </Form>
  )
}

interface LinkItemFieldsetProps
  extends FieldsetConfig<z.input<typeof schemaLink>> {}

function LinkItemFieldset({ ...config }: LinkItemFieldsetProps) {
  const ref = useRef<HTMLFieldSetElement>(null)
  const { url, text } = useFieldset(ref, config)

  return (
    <fieldset ref={ref} className="flex w-full gap-2">
      <div className="w-full">
        <Input
          placeholder="https://example.com"
          className={cn("h-6 px-1 text-xs", url.error && "error")}
          {...conform.input(url)}
        />
        {/* <Alert>{url.error}</Alert> */}
      </div>
      <div>
        <Input
          placeholder="Example Name"
          className={cn("h-6 px-1 text-xs", text.error && "error")}
          {...conform.input(text)}
        />
        {/* <Alert>{text.error}</Alert> */}
      </div>
    </fieldset>
  )
}

export async function action({ request }: ActionArgs) {
  const timer = createTimer()

  const formData = await request.formData()
  const parsed = parse(formData)
  const { intent } = parsed.payload

  if (intent === "update-user-profile-modename") {
    const submission = parseZod(formData, { schema: schemaUserProfileModeName })
    if (!submission.value) return badRequest(submission)
    const result = await model.userProfile.mutation.updateModeName(
      submission.value,
    )
    await timer.delay()
    if (result.error) return forbidden({ ...submission, error: result.error })
    return json(submission)
  }

  if (intent === "update-user-profile-headline") {
    const submission = parseZod(formData, { schema: schemaUserProfileHeadline })
    if (!submission.value) return badRequest(submission)
    const result = await model.userProfile.mutation.updateHeadline(
      submission.value,
    )
    await timer.delay()
    if (result.error) return forbidden({ ...submission, error: result.error })
    return json(submission)
  }

  if (intent === "update-user-profile-bio") {
    const submission = parseZod(formData, { schema: schemaUserProfileBio })
    if (!submission.value) return badRequest(submission)
    const result = await model.userProfile.mutation.updateBio(submission.value)
    await timer.delay()
    if (result.error) return forbidden({ ...submission, error: result.error })
    return json(submission)
  }

  if (intent === "update-user-profile-links") {
    const submission = parseZod(formData, { schema: schemaUserProfileLinks })
    if (!submission.value) return badRequest(submission)
    const result = await model.userProfile.mutation.updateLinks(
      submission.value,
    )
    await timer.delay()
    if (result.error) return forbidden({ ...submission, error: result.error })
    return json(submission)
  }

  return json(parsed)
}
