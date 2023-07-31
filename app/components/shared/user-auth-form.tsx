import { useId } from "react"
import { Form, useActionData, useNavigation } from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { getFieldsetConstraint, parse } from "@conform-to/zod"
import { GitHubLogoIcon, ReloadIcon, ValueIcon } from "@radix-ui/react-icons"
import type { z } from "zod"

import type { action as loginAction } from "~/routes/login"
import type { AuthStrategy } from "~/services/auth.server"
import { useRedirectTo } from "~/hooks"
import {
  Alert,
  Button,
  ButtonLoading,
  Debug,
  Input,
  InputPassword,
  Label,
} from "~/components"
import { schemaUserLogin } from "~/schemas"

export function UserAuthForm(props: React.HTMLAttributes<HTMLElement>) {
  const { redirectTo } = useRedirectTo()
  const actionData = useActionData<typeof loginAction>()
  const navigation = useNavigation()
  const isLoading = navigation.state === "loading"

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
              disabled={isLoading}
              autoFocus={email.initialError?.[""] ? true : undefined}
              required
            />
            {actionData?.error.email && (
              <Alert variant="destructive">{actionData.error.email}</Alert>
            )}
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
              disabled={isLoading}
              autoFocus={password.initialError?.[""] ? true : undefined}
              required
            />
            <p className="text-surface-500 text-xs">At least 10 characters</p>
            {!password.error && actionData?.error.password && (
              <Alert variant="destructive">{actionData.error.password}</Alert>
            )}
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

          <Input type="hidden" name="redirectTo" value={redirectTo} />

          <ButtonLoading
            type="submit"
            loadingText="Logging in..."
            isLoading={isLoading}
          >
            Login
          </ButtonLoading>

          <Debug>{{ focus: password.initialError?.[""] }}</Debug>
        </div>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or later continue with
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <SocialAuthButton
          provider="github"
          label="GitHub"
          icon={<GitHubLogoIcon className="mr-2 h-4 w-4" />}
          disabled
        />
        <SocialAuthButton
          provider="google"
          label="Google"
          icon={<ValueIcon className="mr-2 h-4 w-4" />}
          disabled
        />
      </div>
    </section>
  )
}

export const SocialAuthButton = ({
  provider,
  label,
  icon,
  disabled,
}: {
  provider: AuthStrategy
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}) => {
  const navigation = useNavigation()
  const isLoading = navigation.state === "loading"

  return (
    <Form method="POST" action={`/auth/${provider}`} className="w-full">
      <Button
        type="submit"
        variant="outline"
        disabled={disabled || isLoading}
        className="w-full"
      >
        {isLoading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && icon}
        <span>{label}</span>
      </Button>
    </Form>
  )
}
