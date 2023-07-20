// Remix way to protect routes. Can only be used server-side

import type { UserRole } from "@prisma/client"
import { model } from "~/models"
import invariant from "tiny-invariant"

import type { UserData } from "~/services/auth.server"
import { authenticator } from "~/services/auth.server"

// https://remix.run/docs/en/main/pages/faq#md-how-can-i-have-a-parent-route-loader-validate-the-user-and-protect-all-child-routes
export async function requireUserSession(
  request: Request,
  expectedRoleSymbols?: UserRole["symbol"][],
) {
  // Get user session from app cookie
  const userSession = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  })
  invariant(userSession.id, "User Session ID is not available")

  // Get user data from database
  const userData = await model.user.query.getForSession({ id: userSession.id })
  if (!userData) {
    return await authenticator.logout(request, { redirectTo: "/login" })
  }
  invariant(userData, "User is not available")

  // Check role if expectedRoleSymbols exist
  const userIsAllowed = expectedRoleSymbols
    ? requireUserRole(userData, expectedRoleSymbols)
    : true

  return {
    userSession,
    userData,
    userIsAllowed,
  }
}

// Require User Role
// Can be used client-side or server-side
// This simulate a limited RBAC (Role Based Access Control) functionality
// but obviously not perfect
export function requireUserRole(
  user: UserData,
  expectedRoleSymbols?: UserRole["symbol"][],
) {
  // Find if user's role is available in the list
  const userIsAllowed = checkIfUserIsAllowed(user, expectedRoleSymbols)

  // If user's role is not as expected to be allowed
  if (!userIsAllowed) {
    return false
  } else {
    return true
  }
}

export function checkIfUserIsAllowed(
  user?: UserData,
  expectedRoleSymbols?: UserRole["symbol"][],
) {
  if (!user) {
    return false
  }
  const userIsAllowed = expectedRoleSymbols?.find(
    symbol => user?.role?.symbol === symbol,
  )
  return userIsAllowed ? true : false
}
