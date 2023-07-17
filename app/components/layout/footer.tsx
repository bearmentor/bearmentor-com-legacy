import { cn } from "~/libs"

const footerLinks = [
  { to: "search", text: "Search" },
  // { to: "privacy", text: "Privacy" },
  // { to: "terms", text: "Terms" },
  // { to: "cookies", text: "Cookies policy" },
]

interface Props {
  className?: string
}

export function Footer({ className }: Props) {
  const today = new Date()

  return (
    <footer
      className={cn("flex justify-center pb-20 pt-20 lg:pb-10", className)}
    >
      <ul className="flex gap-4 text-muted-foreground">
        <li>&copy; {today.getFullYear()} Bearmentor</li>
        {footerLinks.map((link) => {
          return <li key={link.to}>{link.text}</li>
        })}
      </ul>
    </footer>
  )
}
