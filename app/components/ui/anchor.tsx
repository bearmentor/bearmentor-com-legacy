import * as React from "react"

import { cn } from "~/libs"





export interface AnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const Anchor = React.forwardRef<HTMLAnchorElement, AnchorProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <a
        className={cn(
          "hover-opacity text-emerald-700 dark:text-emerald-300",
          className,
        )}
        target="_blank"
        rel="noreferrer"
        ref={ref}
        {...props}
      >
        {children}
      </a>
    )
  },
)
Anchor.displayName = "Anchor"

export { Anchor }