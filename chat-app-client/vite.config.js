import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
export default defineConfig({
	plugins: [
		react(),
		tailwindcss(),
		VitePWA({
			registerType: "autoUpdate",
			injectRegister: "auto",
			manifest: {
				name: "Convo",
				short_name: "Convo",
				description: "Futuristic chat experience",
				theme_color: "#0A0C14",
				background_color: "#0A0C14",
				display: "standalone",
				scope: "/",
				start_url: "/",
				icons: [
					{
						src: "/pwa-192.svg",
						sizes: "192x192",
						type: "image/svg+xml",
					},
					{
						src: "/pwa-512.svg",
						sizes: "512x512",
						type: "image/svg+xml",
					},
					{
						src: "/pwa-512-maskable.svg",
						sizes: "512x512",
						type: "image/svg+xml",
						purpose: "maskable",
					},
				],
			},
			workbox: {
				navigateFallback: "/index.html",
				globPatterns: ["**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp,woff2}"],
				runtimeCaching: [
					{
						urlPattern: ({ request }) => request.destination === "image",
						handler: "CacheFirst",
						options: {
							cacheName: "images",
							expiration: { maxEntries: 80, maxAgeSeconds: 60 * 60 * 24 * 30 },
						},
					},
				],
			},
			devOptions: {
				enabled: true,
			},
		}),
	],
});
