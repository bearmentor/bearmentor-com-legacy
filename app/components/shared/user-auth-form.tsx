import { Form, useNavigation } from "@remix-run/react"

import type { AuthStrategy } from "~/services/auth.server"
import { cn } from "~/libs"
import { Button, Icons, Input, Label } from "~/components"

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
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
              disabled={isLoading}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="password"
              disabled={isLoading}
            />
          </div>

          <Button disabled={isLoading}>
            {isLoading && (
              <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
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
            Or continue with
          </span>
        </div>
      </div>

      <Button variant="outline" type="button" disabled>
        {isLoading ? (
          <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.GitHub className="mr-2 h-4 w-4" />
        )}
        <span>GitHub</span>
      </Button>
    </div>
  )
}

export const SocialAuthButton = ({
  provider,
  label,
}: {
  provider: AuthStrategy
  label: string
}) => {
  const navigation = useNavigation()
  const isLoading = navigation.state === "loading"

  return (
    <Form method="POST" action={`/auth/${provider}`}>
      <Button type="submit" disabled={isLoading}>
        {isLoading && <Icons.Spinner className="mr-2 h-4 w-4 animate-spin" />}
        <span>{label}</span>
      </Button>
    </Form>
  )
}
