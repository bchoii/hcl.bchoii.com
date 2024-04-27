import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { defineConfig } from "vite";
import path from "path";

installGlobals();

export default defineConfig(() => ({
  plugins: [
    remix({
      ignoredRouteFiles: ["**/*.css"],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./@"),
      app: path.resolve(__dirname, "./app"),
    },
  },

  tailwind: true,
  postcss: true,
}));
