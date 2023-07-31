import { Form } from "@remix-run/react"

import { useRootLoaderData } from "~/hooks"
import { ButtonLoading } from "~/components"

export default function Route() {
  const { userSession } = useRootLoaderData()

  return (
    <div className="w-full space-y-10">
      <header>
        <h2>Danger</h2>
        <p className="text-muted-foreground">Destructive things.</p>
      </header>

      <section>
        <h3>Delete Personal Account</h3>
        <p>
          Permanently remove your Personal Account () and all of its contents
          from Bearmentor. This action is not reversible, so please continue
          with caution.
        </p>
        {userSession && (
          <Form method="DELETE">
            <input hidden defaultValue={userSession.id} />
            <ButtonLoading variant="destructive">
              Delete Personal Account
            </ButtonLoading>
          </Form>
        )}
      </section>
    </div>
  )
}
