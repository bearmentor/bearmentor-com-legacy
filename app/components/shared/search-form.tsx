import { Form, useSearchParams } from "@remix-run/react"
import { MagnifyingGlassIcon } from "@radix-ui/react-icons"

import { Input, Label } from "~/components"

interface Props {
  action?: string
  placeholder?: string
}

export function SearchForm({
  action = "/search",
  placeholder = "Search",
}: Props) {
  const [searchParams] = useSearchParams()
  const query = searchParams.get("q") || ""

  return (
    <Form method="GET" action={action} className="w-full">
      <fieldset className="relative flex items-center gap-1">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <Input
          id="search"
          type="search"
          name="q"
          placeholder={placeholder}
          defaultValue={query}
          autoComplete="off"
          className="block h-12 w-full px-3 py-2 ps-12 text-xl"
        />
        <span className="pointer-events-none absolute flex ps-3">
          <MagnifyingGlassIcon className="h-6 w-6 text-muted-foreground" />
        </span>
      </fieldset>
    </Form>
  )
}
