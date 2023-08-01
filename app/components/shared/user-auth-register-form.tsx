import { useId } from "react"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { getFieldsetConstraint, parse } from "@conform-to/zod"
import { GitHubLogoIcon, ValueIcon } from "@radix-ui/react-icons"
import type { z } from "zod"

import type { action as registerAction } from "~/routes/_auth.register"
import { useRedirectTo } from "~/hooks"
import {
  Alert,
  ButtonLoading,
  FormField,
  FormLabel,
  Input,
  InputPassword,
  Label,
  UserAuthSocialButton,
} from "~/components"
import { schemaUserRegister } from "~/schemas"

export function UserAuthRegisterForm(props: React.HTMLAttributes<HTMLElement>) {
  const { redirectTo } = useRedirectTo()
  const actionData = useActionData<typeof registerAction>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  const id = useId()
  const [form, { email, name, username, password, inviteBy, inviteCode }] =
    useForm<z.infer<typeof schemaUserRegister>>({
      id,
      shouldValidate: "onSubmit",
      lastSubmission: actionData,
      constraint: getFieldsetConstraint(schemaUserRegister),
      onValidate({ formData }) {
        return parse(formData, { schema: schemaUserRegister })
      },
    })

  return (
    <section className="space-y-6" {...props}>
      <Form id="user-auth-register-form" method="POST" {...form.props}>
        <fieldset className="flex flex-col gap-4">
          <FormField className="space-y-2">
            <Label htmlFor={email.id}>Email</Label>
            <Input
              {...conform.input(email, { type: "email", description: true })}
              id={email.id}
              name="email"
              placeholder="yourname@example.com"
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
          </FormField>

          <FormField className="space-y-2">
            <Label htmlFor={name.id}>Full Name</Label>
            <Input
              {...conform.input(name)}
              id={name.id}
              name="name"
              placeholder="Full Name"
              disabled={isSubmitting}
              autoFocus={name.error ? true : undefined}
              required
            />
            {name.errors && name.errors?.length > 0 && (
              <ul>
                {name.errors?.map((error, index) => (
                  <li key={index}>
                    <Alert variant="destructive">{error}</Alert>
                  </li>
                ))}
              </ul>
            )}
          </FormField>

          <FormField className="space-y-2">
            <Label htmlFor={username.id}>Username</Label>
            <Input
              {...conform.input(username)}
              id={username.id}
              name="username"
              placeholder="Full Name"
              disabled={isSubmitting}
              autoFocus={username.error ? true : undefined}
              required
            />
            {username.errors && username.errors?.length > 0 && (
              <ul>
                {username.errors?.map((error, index) => (
                  <li key={index}>
                    <Alert variant="destructive">{error}</Alert>
                  </li>
                ))}
              </ul>
            )}
          </FormField>

          <FormField className="space-y-2">
            <FormLabel htmlFor={password.id}>Password</FormLabel>
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
          </FormField>

          <input
            hidden
            {...conform.input(inviteBy)}
            defaultValue={redirectTo}
          />
          <input
            hidden
            {...conform.input(inviteCode)}
            defaultValue={redirectTo}
          />
          <input hidden name="redirectTo" defaultValue={redirectTo} />

          <p className="hidden text-xs text-muted-foreground">
            By registering, you agree to the processing of your personal data by
            Bearmentor
          </p>

          <ButtonLoading
            type="submit"
            loadingText="Creating Account..."
            isLoading={isSubmitting}
          >
            Sign Up
          </ButtonLoading>
        </fieldset>
      </Form>

      <section className="flex flex-col">
        <hr className="h-0 border-t" />
        <div className="-mt-2 text-center text-xs">
          <span className="bg-background px-2 text-muted-foreground">OR</span>
        </div>
      </section>

      <section className="flex gap-2">
        <UserAuthSocialButton
          provider="github"
          label="GitHub"
          icon={<GitHubLogoIcon className="mr-2 h-4 w-4" />}
          disabled
        />
        <UserAuthSocialButton
          provider="google"
          label="Google"
          icon={<ValueIcon className="mr-2 h-4 w-4" />}
          disabled
        />
      </section>
    </section>
  )
}
