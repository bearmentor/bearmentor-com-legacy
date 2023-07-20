import { useMediaQuery } from "usehooks-ts"

export function useScreenLarge(): boolean {
  return useMediaQuery("(min-width: 1024px)")
}
