import path from "path";
import { defineConfig, Config } from "drizzle-kit";

const apiRoot = path.join("..", "..", "apps", "api");

const migrationsDir = path.join(apiRoot, "src/db/migrations");

// eslint-disable-next-line turbo/no-undeclared-env-vars
const DB_PATH = process.env.LOCAL_DB_PATH;

if (!DB_PATH) {
  throw new Error("LOCAL_DB_PATH is not set");
}

const sqlPath = path.join(DB_PATH);

export default defineConfig({
  schema: "./src/schema.ts",
  out: migrationsDir,
  dialect: "sqlite",
  dbCredentials: {
    url: sqlPath,
  },
}) satisfies Config;
