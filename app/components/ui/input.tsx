import * as React from "react"
import { useState } from "react"
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons"

import { cn } from "~/libs"
import { Button } from "~/components"

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded border-2 border-input bg-background px-3 py-1 text-base shadow transition-colors file:border-0 file:bg-transparent file:text-base file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      />
    )
  },
)
Input.displayName = "Input"

function InputPassword({
  type = "password",
  placeholder = "Enter password",
  className,
  ...props
}: InputProps) {
  const [isShown, setIsShown] = useState<boolean>(false)

  function handleClick() {
    setIsShown(!isShown)
  }

  return (
    <div className={cn("relative", className)}>
      <Input
        data-component="input-password"
        type={isShown ? "text" : "password"}
        placeholder={placeholder}
        {...props}
      />
      <Button
        size="xs"
        type="button"
        variant="secondary"
        onClick={handleClick}
        className="absolute inset-y-0 right-0 my-1.5 me-1.5 flex gap-2"
      >
        {isShown ? (
          <EyeClosedIcon className="h-4 w-4" />
        ) : (
          <EyeOpenIcon className="h-4 w-4" />
        )}
        <span>{isShown ? "Hide" : "Show"}</span>
      </Button>
    </div>
  )
}

export { Input, InputPassword }
