/**
 * Icon Component
 *
 * For automated icon display with name props.
 * Works by mapping the name string with like a switch case.
 * Only used when need to determine icon based on the item name from data.
 */

import { CircleIcon } from "@radix-ui/react-icons"

export const iconMaps = {
  default: <CircleIcon />,
}

export function lookupIcon(lookupObject: any, defaultCase = "default") {
  return (expression: string | number) => {
    return lookupObject[expression] || lookupObject[defaultCase]
  }
}

export const iconSwitch = lookupIcon(iconMaps, "default")

export function Icon({ name = "default" }: { name?: string }) {
  return iconSwitch(name)
}
