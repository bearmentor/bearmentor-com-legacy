import { useId } from "react"
import { Form, Link, useActionData, useNavigation } from "@remix-run/react"
import { conform, useForm } from "@conform-to/react"
import { getFieldsetConstraint, parse } from "@conform-to/zod"
import { GitHubLogoIcon as IconBrandGithub } from "@radix-ui/react-icons"
import { IconBrandGoogle } from "@tabler/icons-react"
import type { z } from "zod"

import type { action as registerAction } from "~/routes/_auth.register"
import type { checkAuthInvite } from "~/helpers"
import { cn } from "~/utils"
import { useRedirectTo } from "~/hooks"
import {
  Alert,
  ButtonLoading,
  FormField,
  FormLabel,
  Input,
  InputPassword,
  UserAuthSocialButton,
} from "~/components"
import { schemaUserRegister } from "~/schemas"

export function UserAuthRegisterForm({
  invite,
  ...props
}: React.HTMLAttributes<HTMLElement> & {
  invite: ReturnType<typeof checkAuthInvite>
}) {
  const { redirectTo } = useRedirectTo()
  const lastSubmission = useActionData<typeof registerAction>()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"
  const disabled = !invite.isAvailable

  const id = useId()
  const [form, { email, name, username, password, inviteBy, inviteCode }] = useForm<
    z.infer<typeof schemaUserRegister>
  >({
    id,
    shouldValidate: "onSubmit",
    lastSubmission,
    constraint: getFieldsetConstraint(schemaUserRegister),
    onValidate({ formData }) {
      return parse(formData, { schema: schemaUserRegister })
    },
  })

  return (
    <section className="space-y-6" {...props}>
      <Form id="user-auth-register-form" method="POST" {...form.props}>
        <fieldset className="flex flex-col gap-4" disabled={disabled}>
          <FormField className="space-y-2">
            <FormLabel htmlFor={email.id} disabled={disabled}>
              Email
            </FormLabel>
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
            <FormLabel htmlFor={name.id} disabled={disabled}>
              Full Name
            </FormLabel>
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
            <FormLabel htmlFor={username.id} disabled={disabled}>
              Username
            </FormLabel>
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
            <FormLabel htmlFor={password.id} disabled={disabled}>
              Password
            </FormLabel>
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
            <p
              id={password.descriptionId}
              className={cn("text-surface-500 text-xs", disabled && "opacity-50")}
            >
              At least 8 characters
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

          <input hidden {...conform.input(inviteBy)} defaultValue={redirectTo} />
          <input hidden {...conform.input(inviteCode)} defaultValue={redirectTo} />
          <input hidden name="redirectTo" defaultValue={redirectTo} />

          <ButtonLoading type="submit" loadingText="Creating Account..." isLoading={isSubmitting}>
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
          icon={<IconBrandGithub className="h-4 w-4" />}
          disabled
        />
        <UserAuthSocialButton
          provider="google"
          label="Google"
          icon={<IconBrandGoogle className="h-4 w-4" />}
          disabled
        />
      </section>

      <section className="flex justify-center text-center">
        <p className="text-xs text-muted-foreground">
          By signing up, you agree to the{" "}
          <Link to="/terms" className="link">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="link">
            Privacy Policy
          </Link>
        </p>
      </section>
    </section>
  )
}
