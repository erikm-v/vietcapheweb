import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://www.vietcaphe.com.au",
  trailingSlash: "ignore",
  devToolbar: { enabled: false },
  integrations: [react(), mdx(), sitemap({ filter: (page) => !page.includes("/og/") })],
  vite: { plugins: [tailwindcss()] },
});
