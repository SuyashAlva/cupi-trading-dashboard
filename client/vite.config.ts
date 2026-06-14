import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The dev server proxies API + Socket.io traffic to the Node backend so the
// browser only ever talks to a single origin in development.
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split heavy, rarely-changing vendor code into cacheable chunks so the
        // app shell stays small and updates don't bust the cache.
        manualChunks: {
          react: ["react", "react-dom"],
          charts: ["recharts"],
          motion: ["framer-motion"],
          query: ["@tanstack/react-query"],
          socket: ["socket.io-client"],
        },
      },
    },
  },
  server: {
    port: 5173,
    proxy: {
      "/api": { target: "http://localhost:8080", changeOrigin: true },
      "/socket.io": { target: "http://localhost:8080", ws: true },
    },
  },
});
