import { drizzle } from "drizzle-orm/d1";
import * as schema from "./schema";

export const generateDB = (d1: D1Database) => {
  return drizzle(d1, { schema });
};
