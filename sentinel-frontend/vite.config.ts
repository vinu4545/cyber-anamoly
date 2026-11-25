import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
	plugins: [react(), tailwindcss()],
	server: {
		port: 5173,
		proxy: {
			// Development only; production API requests use VITE_API_BASE_URL.
			"/api": "http://localhost:8000",
		},
	},
});
