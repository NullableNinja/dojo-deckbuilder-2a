import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
  const repositoryName = process.env.GITHUB_REPOSITORY?.split("/").at(-1);
  const pagesBase = repositoryName ? `/${repositoryName}/` : "/dojo-deckbuilder/";

  return {
    base: mode === "offline" ? "./" : pagesBase,
    plugins: [react()],
    build: {
      outDir: "dist",
      emptyOutDir: true,
      rolldownOptions: {
        output: {
          codeSplitting: {
            groups: [
              {
                name: "structured-effects",
                test: /app[\\/]data[\\/]card-effects\.json$/,
                priority: 20,
              },
              {
                name: "playtest",
                test: /app[\\/]playtest\.tsx$/,
                priority: 15,
              },
            ],
          },
        },
      },
    },
  };
});
