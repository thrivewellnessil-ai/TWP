import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Base path for GitHub Pages project site: https://ishaanman7898.github.io/ve-wellness-blue/
  base: mode === "production" ? "/ve-wellness-blue/" : "/",
  server: {
    host: "::",
    port: 8080,
    // Allow any ngrok-free.dev subdomain (and localhost by default)
    allowedHosts: [
      "localhost",
      ".ngrok-free.dev",        // ← this matches *.ngrok-free.dev
      ".ngrok.io",              // optional: also works with paid ngrok plans
    ],
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));