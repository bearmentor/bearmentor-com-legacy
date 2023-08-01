import { json, redirect } from "@remix-run/node"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { parse } from "@conform-to/zod"
import { badRequest } from "remix-utils"

import { authenticator } from "~/services"
import { cn } from "~/utils"
import {
  Alert,
  ButtonLoading,
  Card,
  FormDescription,
  FormField,
  FormFieldSet,
  FormLabel,
  Label,
  Layout,
} from "~/components"
import { model } from "~/models"
import { schemaUserWelcome } from "~/schemas"

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request)
  if (!userSession?.id) return redirect("/logout")

  const user = await model.user.query.getById({ id: userSession.id })
  if (!user) return redirect("/logout")

  const userTags = await model.userTag.query.getAll()

  return json({ user, userTags })
}

export default function Route() {
  const { user, userTags } = useLoaderData<typeof loader>()
  const lastSubmission = useActionData<typeof action>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const [form, { id, tags }] = useForm({
    lastSubmission,
    onValidate({ formData }) {
      return parse(formData, { schema: schemaUserWelcome })
    },
  })

  return (
    <Layout className="space-y-8 px-4 py-4 sm:px-8">
      <header>
        <h1>Welcome, {user.name}</h1>
        <p className="text-muted-foreground">
          Let's setup your account to get ready.
        </p>
      </header>

      <Form {...form.props} replace method="PUT" className="space-y-6">
        <FormFieldSet disabled={isSubmitting}>
          <input hidden {...conform.input(id)} defaultValue={user.id} />

          <FormField>
            <FormLabel className="text-lg">Tags</FormLabel>
            <p>Select all relevant tags or categories that applies to you.</p>

            <ul className="grid grid-cols-2 gap-2 py-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {userTags.map(tag => {
                const isSelected = user.tags.find(t => t.id === tag.id)

                return (
                  <li key={tag.id}>
                    <Card
                      className={cn(
                        "flex cursor-pointer items-center justify-center p-1 hover:opacity-80",
                        isSelected && "border-brand",
                      )}
                    >
                      <span>{tag.name}</span>
                    </Card>
                  </li>
                )
              })}
            </ul>

            {tags.error && (
              <Alert variant="destructive" id={tags.errorId}>
                {tags.error}
              </Alert>
            )}
          </FormField>

          <ButtonLoading
            type="submit"
            loadingText="Saving Tags..."
            isSubmitting={isSubmitting}
          >
            Save Tags
          </ButtonLoading>
        </FormFieldSet>
      </Form>
    </Layout>
  )
}

export async function action({ request }: ActionArgs) {
  const formData = await request.formData()
  const submission = parse(formData, { schema: schemaUserWelcome })

  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission)
  }

  // Do something with the data
  return json(submission)
}
