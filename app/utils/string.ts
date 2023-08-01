export function getNameInitials(name: string) {
  return name
    .trim()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase())
    .join("")
}
