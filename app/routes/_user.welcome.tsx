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

  const initialTags = user.tags.map(tag => ({ id: tag.id }))
  const [selectedTags, setSelectedTags] = useState(initialTags)
  const excludedSymbols = ["COLLABORATOR", "UNKNOWN"]

  const toggleSelectTag = (id: string) => {
    setSelectedTags(prevSelectedTags => {
      const isSelected = prevSelectedTags.some(tag => tag.id === id)
      return isSelected
        ? prevSelectedTags.filter(tag => tag.id !== id) // remove if already
        : [...prevSelectedTags, { id }] // add if not selected
    })
  }

  return (
    <Layout className="space-y-8 px-4 py-4 sm:px-8">
      <header>
        <h1>Welcome, {user.name}</h1>
        <p className="text-muted-foreground">
          Let's setup your account to get ready.
        </p>
      </header>

      <Form replace method="PUT" className="space-y-6">
        <FormFieldSet disabled={isSubmitting}>
          <input hidden name="id" defaultValue={user.id} />

          <FormField>
            <FormLabel className="text-lg">Your Tags</FormLabel>
            <FormDescription className="max-w-lg">
              Select all relevant tags or categories that applies to you. This
              will help to customize your experience and determine wether you
              need to be mentored, or want to mentor.
            </FormDescription>

            <input hidden name="tags" defaultValue={stringify(selectedTags)} />

            <ul className="grid grid-cols-2 gap-2 py-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {userTags
                .filter(tag => !excludedSymbols.includes(tag.symbol))
                .map((userTag, index) => {
                  const isSelected = selectedTags.find(
                    tag => tag.id === userTag.id,
                  )
                  return (
                    <li key={userTag.id}>
                      <Card
                        className={cn(
                          "flex cursor-pointer items-center justify-center p-1 hover:opacity-80",
                          isSelected && "border-brand",
                        )}
                        onClick={() => toggleSelectTag(userTag.id)}
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
            Save Tags
          </ButtonLoading>
        </FormFieldSet>
      </Form>

      <Debug>{{ selectedTags }}</Debug>
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
