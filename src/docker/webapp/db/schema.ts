import {
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  json,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const common = {
  id: uuid("id").defaultRandom().primaryKey().notNull(),
  // id: serial("id").primaryKey(),
  version: integer("version").default(0).notNull(),
  created: timestamp("created", { mode: "string" }).defaultNow().notNull(),
  updated: timestamp("updated", { mode: "string" }).defaultNow().notNull(),
  host: text("host"),
  ip: text("ip"),
};

export const logs = pgTable("logs", {
  ...common,
  refId: text("refId"),
  text: text("text"),
});

export type Log = typeof logs.$inferSelect;
export type NewLog = typeof logs.$inferInsert;

export const users = pgTable("users", {
  ...common,
  email: text("email").unique(),
  roles: json("roles").$type<string[]>(),
  skills: json("skills").$type<string[]>(),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export const items = pgTable("items", {
  ...common,
  name: text("name").notNull(),
});

export type Item = typeof items.$inferSelect;
export type NewItem = typeof items.$inferInsert;
