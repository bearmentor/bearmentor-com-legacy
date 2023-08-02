import { useState } from "react"
import { json, redirect } from "@remix-run/node"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { Form, useLoaderData, useNavigation } from "@remix-run/react"

import { authenticator } from "~/services"
import { cn, delay, stringify } from "~/utils"
import {
  ButtonLoading,
  Card,
  Debug,
  FormDescription,
  FormField,
  FormFieldSet,
  FormLabel,
  Layout,
} from "~/components"
import { model } from "~/models"

export const loader = async ({ request }: LoaderArgs) => {
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
  if (!userSession?.id) return redirect("/logout")

  const user = await model.user.query.getById({ id: userSession.id })
  if (!user) return redirect("/logout")

  const userTags = await model.userTag.query.getAll()

  return json({ user, userTags })
}

/**
 * Note: This is not using Conform as it's still challenging or unknown
 * on how to have multiple selection UX with progressive form fields
 */
export default function Route() {
  const { user, userTags } = useLoaderData<typeof loader>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const excludedSymbols = ["COLLABORATOR", "UNKNOWN"]
  const maxSelectedTags = 5

  // FIXME: There's an issue when we are back to this route, this won't work
  const [selectedTags, setSelectedTags] = useState(
    user.tags.map(tag => ({ id: tag.id })).slice(0, maxSelectedTags),
  )

  const isMaxTagsSelected = selectedTags.length >= maxSelectedTags

  // Toggle select tags into selectedTags array
  // with limit of maxSelectedTags
  const toggleSelectTag = (id: string) => {
    setSelectedTags(prevSelectedTags => {
      const isSelected = prevSelectedTags.some(tag => tag.id === id)
      const newSelectedTags = isSelected
        ? prevSelectedTags.filter(tag => tag.id !== id) // remove if already selected
        : [...prevSelectedTags, { id }] // add if not selected
      return newSelectedTags.slice(0, maxSelectedTags)
    })
  }

  return (
    <Layout className="space-y-8 px-4 py-4 sm:px-8">
      <header>
        <h1>Welcome, {user.name}</h1>
        <p className="text-muted-foreground">
          Let's setup your account to get ready.
        </p>
        <Debug>{{ selectedTags }}</Debug>
      </header>

      <Form method="PUT" className="space-y-6">
        <FormFieldSet disabled={selectedTags.length < 1 || isSubmitting}>
          <input hidden name="id" defaultValue={user.id} />

          <FormField>
            <FormLabel className="text-lg">Who are you?</FormLabel>
            <FormDescription className="max-w-3xl text-base">
              Select <b>minimum of 1</b> and <b>maximum of 5</b> relevant tags
              or categories that applies to you. This will help to customize
              your experience and determine wether you need to be mentored, want
              to mentor, or neither.
            </FormDescription>

            <input hidden name="tags" defaultValue={stringify(selectedTags)} />

            <ul className="grid grid-cols-2 gap-2 py-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {userTags
                .filter(tag => !excludedSymbols.includes(tag.symbol))
                .map((userTag, index) => {
                  const isSelected = selectedTags.find(
                    tag => tag.id === userTag.id,
                  )

                  const isDisabled = isMaxTagsSelected && !isSelected

                  // For flexibility, the toggle is using Card not Button
                  return (
                    <li key={userTag.id}>
                      <Card
                        className={cn(
                          "flex select-none items-center justify-center p-1",
                          isSelected && "border-brand",
                          !isDisabled && "cursor-pointer hover:opacity-80",
                          isDisabled && "opacity-50",
                        )}
                        onClick={() =>
                          !isDisabled && toggleSelectTag(userTag.id)
                        }
                      >
                        <span className="select-none">{userTag.name}</span>
                      </Card>
                    </li>
                  )
                })}
            </ul>
          </FormField>

          <ButtonLoading
            type="submit"
            isSubmitting={isSubmitting}
            submittingText="Saving Tags..."
          >
            Save Tags and Continue
          </ButtonLoading>
        </FormFieldSet>
      </Form>
    </Layout>
  )
}

export async function action({ request }: ActionArgs) {
  await delay()

  const formData = await request.formData()
  const id = String(formData.get("id"))
  const tags = JSON.parse(String(formData.get("tags")))

  await model.user.mutation.updateTags({ id, tags })

  return redirect("/dashboard")
}
