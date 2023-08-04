import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react"
import { conform, useFieldList, useForm } from "@conform-to/react"
import { getFieldsetConstraint, parse } from "@conform-to/zod"

import type { loader as loaderBroadcastIdEdit } from "~/routes/$username.broadcasts.$id.edit._index"
import type { action as actionBroadcasts } from "~/routes/broadcasts._index"
import { useRootLoaderData } from "~/hooks"
import {
  Alert,
  ButtonLoading,
  FormDescription,
  FormField,
  FormFieldSet,
  FormLabel,
  Input,
  Textarea,
} from "~/components"
import { schemaBroadcastUpdate } from "~/schemas"

// TODO: Some FormField are still hidden with className="hidden"
export function BroadcastEditForm() {
  const { userSession } = useRootLoaderData()
  const { broadcast } = useLoaderData<typeof loaderBroadcastIdEdit>()
  const lastSubmission = useActionData<typeof actionBroadcasts>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const [form, { userId, id, title, description, body, tags, links, images }] =
    useForm({
      shouldValidate: "onSubmit",
      lastSubmission,
      constraint: getFieldsetConstraint(schemaBroadcastUpdate),
      onValidate({ formData }) {
        return parse(formData, { schema: schemaBroadcastUpdate })
      },
      defaultValue: {
        ...broadcast,
        userId: userSession?.id,
        tags: [],
        links: [],
        images: [],
      },
    })

  const tagsList = useFieldList(form.ref, tags)
  const linksList = useFieldList(form.ref, links)
  const imagesList = useFieldList(form.ref, images)

  if (!broadcast) {
    return null
  }

  return (
    <section className="space-y-4 rounded">
      <Form method="PUT" {...form.props} className="space-y-6">
        <FormFieldSet>
          <input hidden {...conform.input(userId)} />

          <input hidden {...conform.input(id)} />

          <FormField>
            <FormLabel htmlFor={title.id}>Title</FormLabel>
            <FormDescription>Limited to 100 characters</FormDescription>
            <Input {...conform.input(title)} type="text" />
            {title.error && (
              <Alert variant="destructive" id={title.errorId}>
                {title.error}
              </Alert>
            )}
          </FormField>

          <FormField>
            <FormLabel htmlFor={description.id}>Description</FormLabel>
            <FormDescription>Limited to 200 characters</FormDescription>
            <Input {...conform.input(description)} type="text" />
            {description.error && (
              <Alert variant="destructive" id={description.errorId}>
                {description.error}
              </Alert>
            )}
          </FormField>

          <FormField>
            <FormLabel htmlFor={body.id}>Details Body</FormLabel>
            <FormDescription>Limited to 10,000 characters</FormDescription>
            <Textarea {...conform.input(body)} rows={20} />
            {body.error && (
              <Alert variant="destructive" id={body.errorId}>
                {body.error}
              </Alert>
            )}
          </FormField>

          <FormField className="hidden">
            <FormLabel htmlFor={tags.id}>Tags</FormLabel>
            <FormDescription>
              Add relevant tags, maximum of 10 tags
            </FormDescription>

            <ul>
              {tagsList.map(tag => (
                <li key={tag.key}>
                  <input name={tag.name} />
                  <div>{tag.error}</div>
                </li>
              ))}
            </ul>

            {tags.error && (
              <Alert variant="destructive" id={tags.errorId}>
                {tags.error}
              </Alert>
            )}
          </FormField>

          <FormField className="hidden">
            <FormLabel htmlFor={links.id}>links</FormLabel>
            <FormDescription>
              Add relevant links, maximum of 3 links
            </FormDescription>

            <ul>
              {linksList.map(link => (
                <li key={link.key}>
                  {/* Set the name to `task[0]`, `tasks[1]` etc */}
                  <input name={link.name} hidden />
                  <div>{link.error}</div>
                </li>
              ))}
            </ul>

            {links.error && (
              <Alert variant="destructive" id={links.errorId}>
                {links.error}
              </Alert>
            )}
          </FormField>

          <FormField className="hidden">
            <FormLabel htmlFor={images.id}>Images</FormLabel>
            <FormDescription>Upload supporting images</FormDescription>

            <ul>
              {imagesList.map(image => (
                <li key={image.key}>
                  {/* Set the name to `task[0]`, `tasks[1]` etc */}
                  <input name={image.name} hidden />
                  <div>{image.error}</div>
                </li>
              ))}
            </ul>

            {images.error && (
              <Alert variant="destructive" id={images.errorId}>
                {images.error}
              </Alert>
            )}
          </FormField>

          <ButtonLoading
            type="submit"
            isSubmitting={isSubmitting}
            submittingText="Saving Broadcast..."
            className="w-full"
          >
            Save Broadcast
          </ButtonLoading>
        </FormFieldSet>
      </Form>
    </section>
  )
}
