import { defineConfig } from "vite";

export default defineConfig(({ mode }) => ({
  // Keep the same bundle usable at the domain root or beside WordPress in a folder.
  base: "./",
  plugins: [
    {
      name: "review-indexing",
      transformIndexHtml(html) {
        return html.replace(
          "%ROBOTS%",
          mode === "production-ready" ? "index,follow" : "noindex,nofollow",
        );
      },
      generateBundle() {
        this.emitFile({
          type: "asset",
          fileName: "robots.txt",
          source:
            mode === "production-ready"
              ? "User-agent: *\nAllow: /\n"
              : "User-agent: *\nDisallow: /\n",
        });
      },
    },
  ],
}));
