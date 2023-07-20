import { Prisma } from "@prisma/client"
import type { User } from "@prisma/client"
import bcrypt from "bcryptjs"
import invariant from "tiny-invariant"
import type { z } from "zod"

import { prisma } from "~/libs"
import { dataUsersUnallowed } from "~/data"
import type {
  schemaUserUpdateEmail,
  schemaUserUpdateName,
  schemaUserUpdateNick,
  schemaUserUpdateUsername,
} from "~/schemas"

export type { User } from "@prisma/client"

export const fields = {
  public: {
    id: true,
    name: true,
    username: true,
    role: { select: { symbol: true, name: true, description: true } },
    avatars: { select: { url: true } },
    tags: { select: { symbol: true, name: true } },
    profiles: { select: { headline: true, bio: true } },
  },
  private: {
    id: true,
    name: true,
    username: true,
    role: { select: { symbol: true, name: true, description: true } },
    email: true,
    phone: true,
    profiles: true,
    notes: true,
  },
}

export const query = {
  count() {
    return prisma.user.count()
  },

  getAllUsernames() {
    return prisma.user.findMany({
      select: {
        id: true,
        username: true,
        updatedAt: true,
      },
    })
  },

  getForSession({ id }: Pick<User, "id">) {
    return prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: { select: { symbol: true, name: true } },
        avatars: { select: { url: true } },
        tags: { select: { symbol: true, name: true } },
        profiles: {
          select: {
            id: true,
            headline: true,
            bio: true,
          },
        },
      },
    })
  },

  getById({ id }: Pick<User, "id">) {
    return prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        profiles: true,
      },
    })
  },

  getByUsername({ username }: Pick<User, "username">) {
    return prisma.user.findUnique({
      where: { username },
      include: {
        role: true,
        profiles: true,
      },
    })
  },

  getByEmail({ email }: Pick<User, "email">) {
    return prisma.user.findUnique({
      where: { email: String(email) },
      select: { id: true },
    })
  },

  search({ q }: { q: string | undefined }) {
    return prisma.user.findMany({
      where: { OR: [{ name: { contains: q } }, { username: { contains: q } }] },
      select: fields.public,
      orderBy: [{ role: { sequence: "asc" } }, { createdAt: "asc" }],
    })
  },
}

export const mutation = {
  async register({
    name,
    username,
    email,
    password,
  }: Pick<User, "name" | "username" | "email"> & {
    password: string // unencrypted password at first
  }) {
    const nameIsUnallowed = dataUsersUnallowed.find(
      username => name.toLowerCase() === username,
    )
    if (nameIsUnallowed) {
      return { error: { name: `Name ${name} is not allowed` } }
    }

    const usernameIsUnallowed = dataUsersUnallowed.find(
      username => username.toLowerCase() === username,
    )
    if (usernameIsUnallowed) {
      return { error: { username: `Username ${username} is not allowed` } }
    }

    const userUsername = await prisma.user.findUnique({
      where: { username: username.trim() },
    })
    if (userUsername) {
      return { error: { username: `Username ${username} is already taken` } }
    }

    if (!email) return { error: { email: `Email is required` } }
    const userEmail = await prisma.user.findUnique({
      where: { email: email.trim() },
      include: { password: true },
    })
    if (userEmail) return { error: { email: `Email ${email} is already used` } }

    const hashedPassword = await bcrypt.hash(password, 10)

    const defaultUserRole = await prisma.userRole.findFirst({
      where: { symbol: "NORMAL" },
    })
    invariant(defaultUserRole, "User Role with symbol NORMAL is not found")

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        username: username.trim(),
        email: email.trim(),
        password: { create: { hash: hashedPassword } },
        role: { connect: { id: defaultUserRole.id } },
        profiles: {
          create: {
            headline: "I am new here",
            bio: "This is my profile bio.",
          },
        },
      },
    })

    return {
      user,
      error: null,
    }
  },

  async login({
    email,
    password,
  }: {
    email: User["email"]
    password: string // from the form field, but it is not the hash
  }) {
    if (!email) return { error: { email: `Email is required` } }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { password: true },
    })

    if (!user) {
      return {
        error: { email: `Email ${email} is not registered yet`, password: "" },
      }
    }
    if (!user.password) {
      return { error: { email: "User account has no password", password: "" } }
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password.hash)
    if (!isPasswordCorrect) {
      return { error: { email: "", password: "Password is incorrect" } }
    }

    // To make sure we only have the essential data in the session
    // Without any other sensitive information
    return { user, error: null }
  },

  deleteById({ id }: Pick<User, "id">) {
    return prisma.user.delete({ where: { id } })
  },

  deleteByEmail({ email }: Pick<User, "email">) {
    if (!email) return { error: { email: `Email is required` } }
    return prisma.user.delete({ where: { email } })
  },

  async updateUsername({
    id,
    username,
  }: z.infer<typeof schemaUserUpdateUsername>) {
    const usernameIsUnallowed = dataUsersUnallowed.find(
      word => word === username.toLowerCase(),
    )

    if (usernameIsUnallowed) {
      return { error: { username: `Username ${username} is not allowed` } }
    }

    try {
      const user = await prisma.user.update({
        where: { id },
        data: { username },
      })
      return { user, error: null }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return { error: { username: `Username ${username} is taken` } }
      }
      return { error: { username: "Username failed to update" } }
    }
  },

  async updateName({ id, name }: z.infer<typeof schemaUserUpdateName>) {
    const nameIsUnallowed = dataUsersUnallowed.find(
      word => word === name.toLowerCase(),
    )
    if (nameIsUnallowed) {
      return { error: { name: `Name ${name} is not allowed` } }
    }

    try {
      const user = await prisma.user.update({ where: { id }, data: { name } })
      return { user, error: null }
    } catch (error) {
      return { error: { name: `Name is failed to change` } }
    }
  },

  async updateNick({ id, nick }: z.infer<typeof schemaUserUpdateNick>) {
    const nickIsUnallowed = dataUsersUnallowed.find(
      word => word === nick.toLowerCase(),
    )
    if (nickIsUnallowed) {
      return { error: { nick: `Nick ${nick} is not allowed` } }
    }

    try {
      const user = await prisma.user.update({ where: { id }, data: { nick } })
      return { user, error: null }
    } catch (error) {
      return { error: { nick: `Nick is failed to change` } }
    }
  },

  async updateEmail({ id, email }: z.infer<typeof schemaUserUpdateEmail>) {
    try {
      const user = await prisma.user.update({ where: { id }, data: { email } })
      return { user, error: null }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return { error: { email: `Email ${email} might already used` } }
      }
      return { error: { username: "Email failed to update" } }
    }
  },
}
