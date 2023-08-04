import { json, redirect } from "@remix-run/node"
import type { ActionArgs, LoaderArgs } from "@remix-run/node"
import { useLoaderData, useParams } from "@remix-run/react"
import { parse } from "@conform-to/zod"
import { badRequest } from "remix-utils"
import invariant from "tiny-invariant"

import { prisma } from "~/libs"
import { createCacheHeaders, delay } from "~/utils"
import { useRootLoaderData } from "~/hooks"
import { BroadcastEditForm, Layout, NotFound } from "~/components"
import { model } from "~/models"
import { schemaBroadcastUpdate } from "~/schemas"

export async function loader({ request, params }: LoaderArgs) {
  invariant(params.id, "Broadcast ID not found")

  const broadcast = await prisma.broadcast.findFirst({
    where: { id: params.id },
    include: { types: true, tags: true, images: true },
  })

  return json({ broadcast }, { headers: createCacheHeaders(request, 3) })
}

export default function BroadcastsRoute() {
  const params = useParams()
  const { userSession } = useRootLoaderData()
  const { broadcast } = useLoaderData<typeof loader>()

  if (!broadcast) {
    return (
      <Layout className="px-4 sm:px-8">
        <NotFound>
          <h2>
            This broadcast{" "}
            <span className="text-red-500">"{params.username}"</span> is not
            found or cannot be edited
          </h2>
          <p className="text-muted-foreground">
            The broadcast may be broken or have been removed.
          </p>
        </NotFound>
      </Layout>
    )
  }

  const isOwner = userSession?.id === broadcast.userId

  return (
    <Layout className="flex justify-center p-4 sm:p-8">
      <div className="mb-40 w-full max-w-2xl space-y-6">
        <header>
          <h1>Edit Broadcast</h1>
        </header>

        {isOwner && <BroadcastEditForm />}
      </div>
    </Layout>
  )
}

export const action = async ({ request }: ActionArgs) => {
  await delay()
  const formData = await request.formData()
  const submission = parse(formData, { schema: schemaBroadcastUpdate })
  if (!submission.value || submission.intent !== "submit") {
    return badRequest(submission)
  }
  const broadcast = await model.broadcast.mutation.updateById(submission.value)
  if (!broadcast) return null
  return redirect(`/${broadcast.user.username}/broadcasts/${broadcast.id}`)
}
