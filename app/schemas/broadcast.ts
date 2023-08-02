import { z } from "zod"

const id = z.string().min(1, "Existing id is required")

const title = z
  .string()
  .min(1, "Title is required")
  .max(50, "Title limited to 50 characters")

const description = z
  .string()
  .min(1, "Description is required")
  .max(200, "Description limited to 200 characters")

const body = z
  .string()
  .min(1, "Broadcast body is required")
  .max(1000, "Broadcast body message limited to 1000 characters")

const link = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
  text: z.string().optional(),
  sequence: z.number().int().optional(),
})
const links = z.array(link).optional()

export const schemaBroadcast = z.object({
  id,
  title,
  description,
  body,
  links,
})

export const schemaBroadcastQuick = z.object({
  userId: id,
  title,
  description,
  body,
})

export const schemaBroadcastDelete = z.object({
  id,
})
