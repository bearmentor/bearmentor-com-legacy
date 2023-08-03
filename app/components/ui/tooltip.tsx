import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "~/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = ({ ...props }) => <TooltipPrimitive.Root {...props} />
Tooltip.displayName = TooltipPrimitive.Tooltip.displayName

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "select-none border-2 border-background",
      "z-60 overflow-hidden rounded bg-primary px-2 py-1 text-sm font-bold text-primary-foreground animate-in fade-in-0 zoom-in-95",
      "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className,
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

function TooltipAuto({
  className,
  children,
  content,
  side,
  asChild,
}: {
  className?: string
  children: React.ReactNode
  content: React.ReactNode
  side?: "top" | "right" | "bottom" | "left" | undefined
  asChild?: boolean | undefined
}) {
  return (
    <Tooltip className={className}>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent side={side} sideOffset={8}>
        {content}
      </TooltipContent>
    </Tooltip>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipAuto }
