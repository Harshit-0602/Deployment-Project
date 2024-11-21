import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      "/user": "http://localhost:3001/", // Proxy all requests to your backend
      "/fetch-projects": "http://localhost:3001/", // Proxy all requests to your backend
      "/submit-form": "http://localhost:3001/", // Proxy all requests to your backend
      "/updateStatus": "http://localhost:3001/", // Proxy all requests to your backend
      "/delete-project": "http://localhost:3001/", // Proxy all requests to your backend
      "/project-logs": "http://localhost:3001/", // Proxy all requests to your backend
      "/project-status": "http://localhost:3001/", // Proxy all requests to your backend
    },
  },
  plugins: [react()],
});
