import { z } from "zod"

const id = z.string().min(1, "Existing id is required")

const title = z.string().max(50, "Title limited to 50 characters")

const description = z.string().max(200, "Description limited to 200 characters")

const body = z
  .string()
  .max(1000, "Broadcast body message limited to 1000 characters")

const link = z.object({
  value: z.string().url({ message: "Please enter a valid URL." }),
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
