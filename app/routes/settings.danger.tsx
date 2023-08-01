import { redirect, type ActionArgs } from "@remix-run/node"
import { useNavigation } from "@remix-run/react"
import { parse } from "@conform-to/react"

import { useRootLoaderData } from "~/hooks"
import {
  AlertDialogAutoForm,
  Button,
  ButtonLoading,
  FormDescription,
  FormField,
  FormLabel,
} from "~/components"
import { model } from "~/models"

export default function Route() {
  const { userData } = useRootLoaderData()
  const navigation = useNavigation()
  const isSubmitting = navigation.state === "submitting"

  return (
    <div className="w-full space-y-10">
      <header>
        <h2>Danger</h2>
        <p className="text-muted-foreground">Destructive things.</p>
      </header>

      {userData && (
        <section className="space-y-4">
          <FormField>
            <FormLabel>Delete Personal Account</FormLabel>
            <FormDescription className="text-base">
              Permanently remove your Personal Account and all of its contents
              from Bearmentor. This action is not reversible, so please continue
              with caution.
            </FormDescription>

            <AlertDialogAutoForm
              method="DELETE"
              title={`Confirm to Delete "${userData.name}"`}
              description={`Your account with the full name ${userData.name} and username
                "@${userData.username}" will be deleted`}
              trigger={
                <Button
                  type="submit"
                  name="intent"
                  variant="destructive"
                  value="delete-user"
                  size="sm"
                >
                  Delete Personal Account
                </Button>
              }
              confirmButton={
                <ButtonLoading
                  type="submit"
                  size="sm"
                  variant="destructive"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                  loadingText="Deleting Account..."
                >
                  Delete Personal Account
                </ButtonLoading>
              }
            >
              <input hidden name="id" defaultValue={userData.id} />
            </AlertDialogAutoForm>
          </FormField>
        </section>
      )}
    </div>
  )
}

export const action = async ({ request }: ActionArgs) => {
  const submission = parse(await request.formData())
  await model.user.mutation.deleteById({ id: submission.payload.id })
  return redirect("/logout?redirectTo=/deleted")
}
