;

/**
 * Debug
 *
 * Preformatted code component to show debugging information with JSON stringify
 */

import { useState } from "react";
import { Cross2Icon } from "@radix-ui/react-icons";



import { cn } from "~/libs";
import { stringify } from "~/utils";
import { useRootLoaderData } from "~/hooks";
import { buttonVariants, Collapsible, CollapsibleContent, CollapsibleTrigger } from "~/components";





;












export function Debug({
  name = "unknown",
  isCollapsibleOpen = false,
  isAlwaysShow = false,
  className,
  children,
}: {
  name?: string
  isCollapsibleOpen?: boolean
  isAlwaysShow?: boolean
  className?: string
  children: string | any | unknown | null | undefined | React.ReactNode
}) {
  const { nodeEnv } = useRootLoaderData()
  const [isVisible, setIsVisible] = useState(true)
  const [isOpen, setIsOpen] = useState(isCollapsibleOpen)

  if (!isAlwaysShow && nodeEnv === "production") return null
  if (!isVisible) return null

  return (
    <div>
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-1">
        <CollapsibleTrigger asChild>
          <div
            className={cn(
              buttonVariants({ variant: "secondary", size: "sm" }),
              "inline-flex cursor-pointer select-none gap-2 pr-0",
            )}
          >
            <code>DEBUG: {name}</code>
            <span
              onClick={() => setIsVisible(false)}
              className="rounded p-2 hover:bg-destructive"
            >
              <Cross2Icon />
            </span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <pre
            className={cn(
              "border-input bg-card",
              "my-1 overflow-scroll rounded border-2 p-1 text-xs",
              "whitespace-pre-wrap", // alternative: break-spaces
              className,
            )}
          >
            {stringify(children)}
          </pre>
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}