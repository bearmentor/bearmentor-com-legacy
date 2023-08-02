import { useId } from "react"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { getFieldsetConstraint, parse } from "@conform-to/zod"
import type { z } from "zod"

import type { action as loginAction } from "~/routes/_auth.login"
import { useRedirectTo } from "~/hooks"
import { Alert, ButtonLoading, Input, InputPassword, Label } from "~/components"
import { schemaUserLogin } from "~/schemas"

export function UserAuthLoginForm(props: React.HTMLAttributes<HTMLElement>) {
  const { redirectTo } = useRedirectTo()
  const actionData = useActionData<typeof loginAction>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const id = useId()
  const [form, { email, password }] = useForm<z.infer<typeof schemaUserLogin>>({
    id,
    shouldValidate: "onSubmit",
    lastSubmission: actionData,
    constraint: getFieldsetConstraint(schemaUserLogin),
    onValidate({ formData }) {
      return parse(formData, { schema: schemaUserLogin })
    },
  })

  return (
    <section className="space-y-6" {...props}>
      <Form id="user-auth-form" method="POST" {...form.props}>
        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor={email.id}>Email</Label>
            <Input
              {...conform.input(email, { type: "email", description: true })}
              id={email.id}
              name="email"
              placeholder="yourname@example.com"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isSubmitting}
              autoFocus={email.error ? true : undefined}
              required
            />
            {email.errors && email.errors?.length > 0 && (
              <ul>
                {email.errors?.map((error, index) => (
                  <li key={index}>
                    <Alert variant="destructive">{error}</Alert>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={password.id}>Password</Label>
            <InputPassword
              {...conform.input(email, { type: "password", description: true })}
              id={password.id}
              name="password"
              placeholder="Enter password"
              autoComplete="current-password"
              disabled={isSubmitting}
              autoFocus={password.error ? true : undefined}
              required
            />
            <p id={password.descriptionId} className="text-surface-500 text-xs">
              At least 10 characters
            </p>
            {password.errors && password.errors?.length > 0 && (
              <ul>
                {password.errors?.map((error, index) => (
                  <li key={index}>
                    <Alert variant="destructive">{error}</Alert>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Input type="hidden" name="redirectTo" defaultValue={redirectTo} />

          <ButtonLoading
            type="submit"
            loadingText="Logging in..."
            isLoading={isSubmitting}
          >
            Login
          </ButtonLoading>
        </div>
      </Form>
    </section>
  )
}
