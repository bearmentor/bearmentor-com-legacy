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
        className="flex w-full items-center gap-2"
      >
        {icon}
        <span>{label}</span>
      </ButtonLoading>
    </Form>
  )
}
