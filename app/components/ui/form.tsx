import * as React from "react"
import type * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "~/utils"
import { Label, labelVariants } from "~/components"

const FormField = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-2", className)} {...props} />
})
FormField.displayName = "FormField"

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  return (
    <Label ref={ref} className={cn(labelVariants(), className)} {...props} />
  )
})
FormLabel.displayName = "FormLabel"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
})
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-[0.8rem] font-medium text-destructive", className)}
      {...props}
    >
      {children}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

const FormFieldSet = React.forwardRef<
  HTMLFieldSetElement,
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>
>(({ className, children, ...props }, ref) => {
  return (
    <fieldset
      ref={ref}
      className={cn("space-y-4 disabled:opacity-80", className)}
      {...props}
    >
      {children}
    </fieldset>
  )
})
FormFieldSet.displayName = "FormFieldSet"

export { FormField, FormLabel, FormDescription, FormMessage, FormFieldSet }
