import { defineConfig, Config } from "drizzle-kit";
import path from "path";

const root = process.cwd();
const apiRoot = path.join(root, "..", "..", "apps", "api");
console.log(apiRoot);

const migrationsDir = path.join(apiRoot, "src/db/migrations");

const sqlPath = path.join(
  apiRoot,
  ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/34d299c3ce1ac43b4463ff5104d1a6d7b80456f1c43f28146c90269b78c9d14d.sqlite"
);

export default defineConfig({
  schema: "./schema.ts",
  out: migrationsDir,
  dialect: "sqlite",
  dbCredentials: {
    url: sqlPath,
  },
}) satisfies Config;
