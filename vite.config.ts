import path from 'path';
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [tailwindcss(), react()],
  resolve: {
    alias: {
      '@' : path.resolve(__dirname, './src'), // Allows using "@" as an alias for "src"
    },
  }
});
