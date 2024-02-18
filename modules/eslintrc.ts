import { defineNuxtModule } from "@nuxt/kit";
import { promises as fs } from "node:fs";

export default defineNuxtModule({
  setup(opts, nuxt) {
    nuxt.hook("imports:context", async (ctx) => {
      const imports = await ctx
        .getImports()
        .then((r) => r.filter((i) => !i.type));
      const newEslintConfigs = { globals: {} };
      imports
        .map((i) => i.as ?? i.name)
        .filter(Boolean)
        .sort()
        .forEach((name) => {
          // @ts-ignore
          newEslintConfigs.globals[name] = true;
        });
      const eslintConfig = JSON.parse(await fs.readFile(".eslintrc", "utf-8"));
      const jsonBody = JSON.stringify(
        { ...newEslintConfigs, ...eslintConfig },
        null,
        2,
      );
      await fs.writeFile(".eslintrc", jsonBody);
    });
  },
});
