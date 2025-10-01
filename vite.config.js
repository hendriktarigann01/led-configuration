import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const isProd = mode === "production";

  return {
    plugins: [
      react({
        babel: {
          plugins: isProd ? ["transform-remove-console"] : [],
        },
      }),
      tailwindcss(),
    ],
    server: {
      host: true,
      port: 5173,
      cors: true,
      allowedHosts: ["localhost", "c7d16ce01b49.ngrok-free.app"],
    },
  };
});
