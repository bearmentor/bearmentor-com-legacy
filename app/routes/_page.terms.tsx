import type { V2_MetaFunction } from "@remix-run/react"

import { formatTitle } from "~/utils"
import { Layout } from "~/components"

export const meta: V2_MetaFunction = () => [
  { title: formatTitle("Terms of Service") },
  {
    name: "description",
    content: "Terms of Service of 🐻 Bearmentor.",
  },
]

export default function Route() {
  return (
    <Layout withPadding>
      <header>
        <h1>Terms of Service</h1>
        <p>(Work in Progress)</p>
      </header>
    </Layout>
  )
}
