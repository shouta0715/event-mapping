import { generateDB } from "@event-mapping/db";
import { Context } from "hono";
import { createFactory } from "hono/factory";
import * as z from "zod";
import { Env } from "@/env";

export const createHono = createFactory<Env>({
  initApp: (app) => {
    app.use(async (c, next) => {
      const db = generateDB(c.env.DB);

      c.set("db", db);
      await next();
    });
  },
});

const paginationSchema = z.object({
  limit: z.coerce.number().min(1).max(50).default(10).catch(10),
  offset: z.coerce.number().min(0).default(0).catch(0),
});

/**
 * ページネーションのパラメータを取得する
 * @param c hono context
 * @returns limit, offset (default 10, 0)
 */
export const pagination = (c: Context<Env>) => {
  const { limit, offset } = paginationSchema.parse(c.req.query());

  return paginationSchema.parse({ limit, offset });
};

/**
 * 検索パラメータを取得する
 * @param c hono context
 * @returns q
 */
export const withQ = (c: Context<Env>) => {
  const q = c.req.query("q");

  return q;
};
