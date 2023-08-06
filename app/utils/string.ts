import pluralize from "pluralize"

export function formatPluralItems(word: string, count: number) {
  return pluralize(word, count, true)
}

export function getNameInitials(name = "First Last") {
  return name
    .trim()
    .split(" ")
    .map((word, index) => {
      if (index < 2) return word.charAt(0).toUpperCase()
      else return ""
    })
    .join("")
}

export function truncateText(text: string, maxLength = 200) {
  if (!text || typeof text !== "string") return text
  return text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text
}

export function capitalizeText(text: string) {
  if (!text || typeof text !== "string") return text
  return text.charAt(0).toUpperCase() + text.slice(1)
}
