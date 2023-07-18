import type { Prisma } from "@prisma/client"
import type { modelUser } from "~/models"
import { Authenticator } from "remix-auth"

import { AuthStrategies } from "~/services/auth_strategies"
import { sessionStorage } from "~/services/session.server"

import { formStrategy } from "./auth_strategies/form.strategy"

export interface UserSession {
  // Add your own user properties here or extend with a type from your database
  id?: string
}

export interface UserData
  extends NonNullable<
    Prisma.PromiseReturnType<typeof modelUser.getForSession>
  > {}

export type AuthStrategy = (typeof AuthStrategies)[keyof typeof AuthStrategies]

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<UserSession>(sessionStorage)

// Register your strategies below
authenticator.use(formStrategy, AuthStrategies.FORM)
