const footerLinks = [
  { to: "privacy", name: "Privacy" },
  { to: "terms", name: "Terms" },
  { to: "cookies", name: "Cookies policy" },
]

export function Footer() {
  const today = new Date()

  return (
    <footer className="mb-10 mt-20 flex justify-center">
      <ul className="flex gap-4 text-muted-foreground">
        <li>&copy; {today.getFullYear()} Bearmentor</li>
        {footerLinks.map((link) => {
          return <li key={link.to}>{link.name}</li>
        })}
      </ul>
    </footer>
  )
}
