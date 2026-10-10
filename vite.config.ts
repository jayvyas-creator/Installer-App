import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { tempoVitePlugin } from "tempo-sdk";

// https://vite.dev/config/
export default defineConfig({
  plugins: [tempoVitePlugin(), react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },
});
