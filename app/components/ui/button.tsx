import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { IconLoader2 } from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "~/utils"

const buttonVariants = cva(
  cn(
    "select-none inline-flex items-center justify-center rounded font-bold transition-colors disabled:pointer-events-none disabled:opacity-50",
    "focus:border-brand focus:outline-none focus:ring focus:ring-emerald-500/20",
    // "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
  ),
  {
    variants: {
      variant: {
        default:
          "border-2 border-primary bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "border-2 border-destructive bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border-2 border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "border-2 border-secondary bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost:
          "border-2 border-background hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        xs: "h-6 rounded px-2 text-xs gap-0.5",
        sm: "h-8 rounded px-3 text-sm gap-1",
        default: "h-9 px-4 py-2 text-base gap-2",
        lg: "h-10 rounded px-8 text-lg gap-2",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  },
)
Button.displayName = "Button"

// https://reactrouter.com/en/6.14.2/hooks/use-navigation
export interface ButtonLoadingProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  isSubmitting?: boolean
  submittingText?: React.ReactNode
  isLoading?: boolean
  loadingText?: React.ReactNode
  isDisabledWhenLoading?: boolean
}

const ButtonLoading = React.forwardRef<HTMLButtonElement, ButtonLoadingProps>(
  (
    {
      type = "submit",
      variant = "default",
      size = "default",
      className,
      name,
      value,
      isSubmitting = false,
      submittingText = "",
      isLoading = false,
      loadingText = "",
      isDisabledWhenLoading = true,
      children,
      ...props
    },
    ref,
  ) => {
    const isActive = isDisabledWhenLoading
      ? isSubmitting || isLoading
      : isDisabledWhenLoading

    return (
      <button
        className={cn(buttonVariants({ variant, size, className }), "flex")}
        type={type}
        ref={ref}
        name={name}
        value={value}
        disabled={isActive}
        {...props}
      >
        {isActive && <IconLoader2 className="h-4 w-4 animate-spin" />}
        {isSubmitting ? submittingText : isLoading ? loadingText : children}
      </button>
    )
  },
)
ButtonLoading.displayName = "ButtonLoading"

export { Button, ButtonLoading, buttonVariants }
