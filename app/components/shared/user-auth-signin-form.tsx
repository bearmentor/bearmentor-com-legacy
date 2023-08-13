import { useId } from "react"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { getFieldsetConstraint, parse } from "@conform-to/zod"
import type { z } from "zod"

import type { action as actionSignIn } from "~/routes/_auth.signin"
import { useRedirectTo } from "~/hooks"
import { Alert, ButtonLoading, Input, InputPassword, Label } from "~/components"
import { schemaUserSignIn } from "~/schemas"

export function UserAuthSignInForm(props: React.HTMLAttributes<HTMLElement>) {
  const { redirectTo } = useRedirectTo()
  const actionData = useActionData<typeof actionSignIn>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const id = useId()
  const [form, { email, password }] = useForm<z.infer<typeof schemaUserSignIn>>(
    {
      id,
      shouldValidate: "onSubmit",
      lastSubmission: actionData,
      constraint: getFieldsetConstraint(schemaUserSignIn),
      onValidate({ formData }) {
        return parse(formData, { schema: schemaUserSignIn })
      },
    },
  )

  return (
    <section className="space-y-6" {...props}>
      <Form method="POST" {...form.props}>
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

          <input hidden name="redirectTo" defaultValue={redirectTo} />

          <ButtonLoading
            type="submit"
            loadingText="Signing in..."
            isLoading={isSubmitting}
          >
            Sign In
          </ButtonLoading>
        </div>
      </Form>
    </section>
  )
}
