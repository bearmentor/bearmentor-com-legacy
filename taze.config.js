import { defineConfig } from "taze"

export default defineConfig({
  write: true,
  install: true,
  exclude: ["prettier", "nanoid"],
  packageMode: { "/remix/": "latest" },
})
