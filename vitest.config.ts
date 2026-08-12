import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      // "server-only" throws when imported outside Next's server bundler by
      // design — swap in its no-op sibling so unit tests can still import
      // server-only modules to test their pure logic.
      "server-only": path.resolve(__dirname, "node_modules/server-only/empty.js"),
    },
  },
});
