import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port: 5173,
    cors: true,
    allowedHosts: [
      "localhost",
      "19ee4e8d0097.ngrok-free.app",
      "script.google.com/macros/s/AKfycbxgi5iaPT7x1ZravNioV1SMzvGcXBtCY5j7vj1icBTfhRMhrnZnPgyxZ5btACsIWCaIoQ/exec",
    ],
  },
});
