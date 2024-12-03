import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === "production";
  const apiBaseUrl = process.env.VITE_API_BASE_URL; // Access environment variable via process.env

  return {
    server: {
      host: "0.0.0.0",
      port: 4173,
      hmr: false, // Disable Hot Module Replacement
      proxy: isProduction
        ? {
            "/api": {
              target: apiBaseUrl,
              changeOrigin: true,
              rewrite: (path) => path.replace(/^\/api/, ""), // Remove '/api' prefix
            },
          }
        : undefined, // No proxy in development
    },
    build: {
      outDir: "dist", // Ensure your output directory is correctly set
    },
    plugins: [
      react(),
      mode === "development" && componentTagger(), // Use the componentTagger plugin only in development
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), // Path alias for cleaner imports
      },
    },
  };
});
