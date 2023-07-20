import { Form, useNavigation } from "@remix-run/react"
import { GitHubLogoIcon, UpdateIcon, ValueIcon } from "@radix-ui/react-icons"

import type { AuthStrategy } from "~/services/auth.server"
import { cn } from "~/libs"
import { useScreenLarge } from "~/hooks"
import { Button, Input, InputPassword, Label } from "~/components"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const isScreenLarge = useScreenLarge()
  const navigation = useNavigation()
  const isLoading = navigation.state === "loading"

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form method="POST" action={`/auth/form`}>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="yourname@example.com"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              autoFocus={isScreenLarge}
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <InputPassword
              id="password"
              name="password"
              type="password"
              autoComplete="password"
              disabled={isLoading}
            />
          </div>

          <Button disabled={isLoading}>
            {isLoading && <UpdateIcon className="mr-2 h-4 w-4 animate-spin" />}
            <span>Login</span>
          </Button>
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
    </div>
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
        {isLoading && <UpdateIcon className="mr-2 h-4 w-4 animate-spin" />}
        {!isLoading && icon}
        <span>{label}</span>
      </Button>
    </Form>
  )
}
