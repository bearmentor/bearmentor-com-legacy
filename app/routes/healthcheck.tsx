import { json, type LoaderArgs } from "@remix-run/node"

import { prisma } from "~/libs"
import { HttpStatus } from "~/utils"

export async function loader({ request }: LoaderArgs) {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host")

  try {
    const url = new URL(
      "/",
      process.env.NODE_ENV === "development"
        ? `http://${host}`
        : `https://${host}`,
    )

    // If we can connect to the database and make a simple query
    // and make a HEAD request to ourselves, then we're good
    await Promise.all([
      prisma.user.findFirst(),
      fetch(url.toString(), { method: "HEAD" }).then(r => {
        if (!r.ok) return Promise.reject(r)
      }),
    ])

    return json({
      message: "✅ Health Check",
      success: true,
    })
  } catch (error: unknown) {
    console.info("❌ Health Check", { error })
    return new Response("ERROR", { status: HttpStatus.INTERNAL_SERVER_ERROR })
  }
}
