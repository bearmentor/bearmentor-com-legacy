import { defineConfig } from "taze"

export default defineConfig({
  exclude: ["prettier"],
  write: true,
  install: true,
  packageMode: { "/remix/": "latest" },
})
