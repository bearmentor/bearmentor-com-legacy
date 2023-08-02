import { useId } from "react"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { getFieldsetConstraint, parse } from "@conform-to/zod"

import type { action as actionBroadcasts } from "~/routes/broadcasts._index"
import { useRootLoaderData } from "~/hooks"
import {
  Alert,
  ButtonLoading,
  FormField,
  FormFieldSet,
  FormLabel,
  Input,
  Textarea,
} from "~/components"
import { schemaBroadcastQuick } from "~/schemas"

export function BroadcastQuickForm() {
  const { userSession } = useRootLoaderData()
  const lastSubmission = useActionData<typeof actionBroadcasts>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const id = useId()
  const [form, { userId, title, description, body }] = useForm({
    id,
    shouldValidate: "onSubmit",
    lastSubmission,
    constraint: getFieldsetConstraint(schemaBroadcastQuick),
    onValidate({ formData }) {
      return parse(formData, { schema: schemaBroadcastQuick })
    },
  })

  return (
    <section className="space-y-4 rounded bg-stone-900 p-4">
      <header>
        <h3>Quick Broadcast</h3>
        <p className="text-sm text-muted-foreground">
          Quickly create new broadcast to ask or offer
        </p>
      </header>

      <Form method="POST" {...form.props} className="space-y-6">
        <FormFieldSet>
          <Input
            {...conform.input(userId)}
            type="hidden"
            defaultValue={userSession?.id}
          />

          <FormField>
            <FormLabel htmlFor={title.id}>Title</FormLabel>
            <Input
              {...conform.input(title)}
              type="text"
              placeholder="Ex: Need mentor to help learning JavaScript"
            />
            {title.error && (
              <Alert variant="destructive" id={title.errorId}>
                {title.error}
              </Alert>
            )}
          </FormField>

          <FormField>
            <FormLabel htmlFor={description.id}>Description</FormLabel>
            <Input
              {...conform.input(description)}
              type="text"
              placeholder="Ex: Want to build a job-ready and portfolio-worthy project"
            />
            {description.error && (
              <Alert variant="destructive" id={description.errorId}>
                {description.error}
              </Alert>
            )}
          </FormField>

          <FormField>
            <FormLabel htmlFor={body.id}>Details</FormLabel>
            <Textarea
              {...conform.input(body)}
              placeholder="Ex: Here are some more details about the mentorship request or service to offer..."
              className="min-h-[100px]"
            />
            {body.error && (
              <Alert variant="destructive" id={body.errorId}>
                {body.error}
              </Alert>
            )}
          </FormField>

          <ButtonLoading
            type="submit"
            isSubmitting={isSubmitting}
            submittingText="Sending..."
          >
            Send
          </ButtonLoading>
        </FormFieldSet>
      </Form>
    </section>
  )
}
