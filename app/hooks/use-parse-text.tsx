import { Fragment } from "react"
import { Link } from "@remix-run/react"

export function useParseText(input: string) {
  const regex = /@(\w+)/g
  const parts = input.split(regex)

  const parsedElements = parts.map((part, index) =>
    regex.test(part) ? (
      <Link key={index} to={`/${part.slice(1)}`}>
        @{part.slice(1)}
      </Link>
    ) : (
      part
    ),
  )

  return parsedElements
}

export function DisplayParsedElements(
  parsedElements: (string | JSX.Element)[],
) {
  return (
    <>
      {parsedElements.map((element, index) => (
        <Fragment key={index}>{element}</Fragment>
      ))}
    </>
  )
}
