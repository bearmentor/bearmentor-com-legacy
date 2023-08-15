import { defineConfig } from "taze"

export default defineConfig({
  write: true,
  install: true,
  exclude: [
    "nanoid",
    "prettier",
    "prettier-plugin-tailwindcss",
    "@conform-to/react",
    "@conform-to/zod",
  ],
  packageMode: { "/remix/": "latest" },
})
