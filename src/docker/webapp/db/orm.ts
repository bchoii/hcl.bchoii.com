import * as schema from "./schema";
import { SQLWrapper, eq, sql } from "drizzle-orm";
import { PgTable, PgTableWithColumns, TableConfig } from "drizzle-orm/pg-core";

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const pgClient = postgres({ idle_timeout: 20 });

export const db = drizzle(pgClient, { schema, logger: false });

export const create = async (entityName: keyof typeof schema, data: any) => {
  const table = schema[
    entityName
  ] as unknown as PgTableWithColumns<TableConfig>;
  const { id, ...rest } = data; // ignore id from data
  const newRecords = await db
    .insert(table as PgTable)
    .values({ ...rest, created: sql`now()`, updated: sql`now()` })
    .returning();
  return newRecords[0];
};

export const update = async (
  entityName: keyof typeof schema,
  data: any,
  id: string
) => {
  const table = schema[
    entityName
  ] as unknown as PgTableWithColumns<TableConfig>;
  const result = await db
    .update(table)
    .set({
      ...data,
      version: sql`${table.version} + 1`,
      updated: sql`now()`,
    })
    .where(eq(table.id, id))
    .returning();
  return result[0];
};

export const remove = async (entityName: keyof typeof schema, id: string) => {
  const table = schema[
    entityName
  ] as unknown as PgTableWithColumns<TableConfig>;
  return await db.delete(table).where(eq(table.id, id));
};

export const execute = async (sql_: SQLWrapper) => {
  const result = await db.execute(sql_);
  return result;
};

export const nextVal = async (name: string) => {
  await db.execute(
    sql.raw(`create sequence if not exists "${name.toLowerCase()}"`)
  );

  return (await execute(sql`select nextval(${name})`))[0].nextval as string;
};

export const end = async () => {
  await pgClient.end();
};
