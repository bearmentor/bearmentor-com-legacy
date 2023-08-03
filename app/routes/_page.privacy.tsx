import type { V2_MetaFunction } from "@remix-run/react"

import { formatTitle } from "~/utils"
import { Layout } from "~/components"

export const meta: V2_MetaFunction = () => [
  { title: formatTitle("Privacy Policy") },
  {
    name: "description",
    content: "Privacy Policy of 🐻 Bearmentor.",
  },
]

export default function Route() {
  return (
    <Layout withPadding>
      <header>
        <h1>Privacy Policy</h1>
        <p>(Work in Progress)</p>
      </header>
    </Layout>
  )
}
