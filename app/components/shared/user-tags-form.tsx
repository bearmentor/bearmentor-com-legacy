import { useState } from "react"
import { Form, useLoaderData, useNavigation } from "@remix-run/react"

import type { loader as loaderSettingsTags } from "~/routes/settings.tags"
import { cn, stringify } from "~/utils"
import {
  ButtonLoading,
  Card,
  FormDescription,
  FormField,
  FormFieldSet,
  FormLabel,
} from "~/components"

/**
 * Note: This is not using Conform as it's still challenging or unknown
 * on how to have multiple selection UX with progressive form fields
 * and checkboxes
 */
export function UserTagsForm() {
  const { user, userTags } = useLoaderData<typeof loaderSettingsTags>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const excludedSymbols = ["COLLABORATOR", "UNKNOWN"]
  const maxSelectedTags = 5

  // FIXME: Issue after using back navigation to load this component
  // But it still need to work with Remix action, so useEffect won't work
  const [selectedTags, setSelectedTags] = useState(
    user.tags
      .map(tag => ({ id: tag.id, name: tag.name }))
      .slice(0, maxSelectedTags),
  )

  const isMaxTagsSelected = selectedTags.length >= maxSelectedTags

  // Toggle select tags into selectedTags array with limit of maxSelectedTags
  const toggleSelectTag = (selectedTag: { id: string; name: string }) => {
    setSelectedTags(prevSelectedTags => {
      const isSelected = prevSelectedTags.some(tag => tag.id === selectedTag.id)
      const newSelectedTags = isSelected
        ? prevSelectedTags.filter(tag => tag.id !== selectedTag.id) // remove if already selected
        : [...prevSelectedTags, selectedTag] // add if not selected
      return newSelectedTags.slice(0, maxSelectedTags)
    })
  }

  return (
    <Form method="PUT" className="space-y-6">
      <FormFieldSet disabled={selectedTags.length < 1 || isSubmitting}>
        <input hidden name="id" defaultValue={user.id} />

        <FormField>
          <FormLabel className="text-lg">Who are you?</FormLabel>
          <FormDescription className="max-w-3xl text-base">
            Select <b>minimum of 1</b> and <b>maximum of 5</b> relevant tags or
            categories that applies to you. This will help to customize your
            experience and determine wether you need to be mentored, want to
            mentor, or neither.
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
                      onClick={() => !isDisabled && toggleSelectTag(userTag)}
                    >
                      <span className="select-none">{userTag.name}</span>
                    </Card>
                  </li>
                )
              })}
          </ul>
        </FormField>

        <p className="text-sm text-muted-foreground">
          <span>{selectedTags.length} selected</span>
          {selectedTags.length > 0 && (
            <span>: {selectedTags.map(t => t.name).join(", ")}</span>
          )}
        </p>

        <ButtonLoading
          size="sm"
          disabled={isSubmitting}
          isSubmitting={isSubmitting}
          submittingText="Saving Tags..."
        >
          Save Tags
        </ButtonLoading>
      </FormFieldSet>
    </Form>
  )
}
