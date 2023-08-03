import { Form, useNavigation } from "@remix-run/react"

import type { AuthStrategy } from "~/services"
import { ButtonLoading } from "~/components"

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
      <ButtonLoading
        type="submit"
        variant="outline"
        disabled={disabled || isSubmitting}
        className="w-full"
      >
        {label}
      </ButtonLoading>
    </Form>
  )
}
