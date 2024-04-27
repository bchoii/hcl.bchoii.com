import { eq, inArray } from "drizzle-orm";
import { create, db, end, execute, nextVal, update } from "./orm";
import { NewUser, User, users } from "./schema";

import { sql } from "drizzle-orm";
import { pathToFileURL } from "url";
import { addDays, addHours, startOfHour } from "date-fns";
import { join } from "path";
import dotenv from "dotenv";

export {};

dotenv.config({ path: "../.env" });

const main = async () => {
  const users = await execute(sql`select * from users`);
  {
    const user = (
      await execute(
        sql`select * from users where email = ${"bchoii@gmail.com"}`
      )
    )[0] as unknown as User;
    await update("users", { skills: null }, user.id);
  }
  {
    const user = (
      await execute(
        sql`select * from users where email = ${"bchoii@gmail.com"}`
      )
    )[0] as unknown as User;
  }
  await end();
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
