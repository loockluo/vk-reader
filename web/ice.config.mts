import { defineConfig } from "@ice/app";

// The project config, see https://v3.ice.work/docs/guide/basic/config
const minify = process.env.NODE_ENV === "production" ? "swc" : false;
export default defineConfig(() => ({
  // Set your configs here.
  sourceMap: true,
  minify,
  server: {
    onDemand: true,
    format: "esm",
  },
  postcss: {
    plugins: ["tailwindcss"],
  },
  proxy: {
    "/api": {
      target: "http://localhost:4000",
      changeOrigin: true,
      ssl: false,
      headers: {
        origin: "http://localhost:3000",
      },
    },
  },
}));
