import { defineConfig } from "taze"

export default defineConfig({
  exclude: ["prettier", "nanoid"],
  write: true,
  install: true,
  packageMode: { "/remix/": "latest" },
})
