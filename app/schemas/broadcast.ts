import { z } from "zod"

const id = z.string().min(1, "Existing id is required")

const title = z
  .string()
  .min(1, "Title is required")
  .max(100, "Title limited to 100 characters")

const description = z
  .string()
  .min(1, "Description is required")
  .max(200, "Description limited to 200 characters")

const body = z
  .string()
  .min(1, "Details are required")
  .max(10_000, "Details are limited to 10,000 characters")

const tag = z.object({ id, symbol: z.string().optional() })
const tags = z.array(tag).optional()

const link = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
  text: z.string().optional(),
  sequence: z.number().int().optional(),
})
const links = z.array(link).optional()

const image = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
})
const images = z.array(image).optional()

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

export const schemaBroadcastUpdate = z.object({
  userId: id,
  id,
  title,
  description,
  tags,
  links,
  images,
  body,
})
