import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn, createAvatarImageURL, getNameInitials } from "~/utils"

const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative z-0 flex shrink-0 overflow-hidden rounded",
      className,
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "select-none",
      "flex h-full w-full items-center justify-center rounded bg-muted",
      className,
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

function AvatarAuto({
  className,
  user,
}: {
  className?: string
  user: {
    name: string
    username: string
    avatars: { url: string }[]
  }
}) {
  return (
    <Avatar className={className}>
      <AvatarImage
        src={user.avatars[0]?.url || createAvatarImageURL(user.username)}
        alt={user.username}
      />
      <AvatarFallback className="text-2xl">
        {getNameInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  )
}

export { Avatar, AvatarImage, AvatarFallback, AvatarAuto }
