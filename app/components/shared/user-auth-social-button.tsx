import { Form, useNavigation } from "@remix-run/react"
import { ReloadIcon } from "@radix-ui/react-icons"

import type { AuthStrategy } from "~/services/auth.server"
import { Button } from "~/components"

export const UserAuthSocialButton = ({
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
  const isSubmitting = navigation.state === "submitting"

  return (
    <Form method="POST" action={`/auth/${provider}`} className="w-full">
      <Button
        type="submit"
        variant="outline"
        disabled={disabled || isSubmitting}
        className="w-full"
      >
        {isSubmitting && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
        {!isSubmitting && icon}
        <span>{label}</span>
      </Button>
    </Form>
  )
}
