import { z } from "zod"

const id = z.string().min(1, "Existing id is required")

const username = z
  .string()
  .regex(/^[a-zA-Z0-9._]+$/, "Only alphabet, number, dot, underscore allowed")
  .min(4, "Username require at least 4 characters")
  .max(20, "Username limited to 20 characters")

const name = z
  .string()
  .min(1, "Full Name is required")
  .max(50, "Full Name limited to 50 characters")

const nick = z.string().max(50, "Nick Name limited to 50 characters")

const email = z.string().min(1, "Email is required").email("Email is invalid")

/**
 * TODO: Improve password check
 * - Not only numbers
 * - Shouldn't match the email
 */
const password = z
  .string()
  .min(8, "Password require at least 8 characters")
  .max(100, "Password max length limited to 100 characters")

const confirmPassword = z.string()

const remember = z.boolean().optional()

const redirectTo = z.string().optional()

const roleSymbol = z.string().min(1, "Role is required")

const modeName = z.string().min(1, "Profile mode name is required")

const headline = z.string().max(50, "Headline limited to 50 characters")

const bio = z.string().max(280, "Bio limited to 280 characters").optional()

const link = z.object({
  value: z.string().url({ message: "Please enter a valid URL." }),
  text: z.string().optional(),
  sequence: z.number().int().optional(),
})

export const schemaUserRegister = z.object({
  name,
  username,
  email,
  password,
  remember,
})

export const schemaUserLogin = z.object({
  email,
  password,
  remember,
  redirectTo,
})

export const schemaUserUpdateUsername = z.object({ id, username })
export const schemaUserUpdateName = z.object({ id, name })
export const schemaUserUpdateNick = z.object({ id, nick })
export const schemaUserUpdateEmail = z.object({ id, email })
export const schemaUserUpdateProfile = z.object({ id, headline, bio })

export const schemaUserProfileModeName = z.object({ id, modeName })
export const schemaUserProfileHeadline = z.object({ id, headline })
export const schemaUserProfileBio = z.object({ id, bio })

export const schemaUserUpdatePassword = z
  .object({
    id,
    password,
    confirmPassword,
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        code: "custom",
        message: "The passwords did not match",
      })
    }
  })

export const schemaAdminUserUpdate = z.object({
  id,
  username,
  name,
  nick,
  email,
  links: z.array(link),
  roleSymbol,
})
