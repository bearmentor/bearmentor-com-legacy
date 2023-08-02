import { Layout, NotFound } from "~/components"

export default function Route() {
  return (
    <Layout className="px-4 sm:px-8">
      <NotFound>
        <h2>Your account has been deleted</h2>
      </NotFound>
    </Layout>
  )
}
