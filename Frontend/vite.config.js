import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [React()],
  server: {
    proxy: {
      "/admin": {
        target: "http://localhost:5174/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/admin/, ""),
      },
    },
  },
});
