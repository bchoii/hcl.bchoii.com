import { eq, inArray } from "drizzle-orm";
import { create, db, execute, nextVal, update } from "./orm";

import { sql } from "drizzle-orm";
import { pathToFileURL } from "url";
import { addDays, addHours, startOfHour } from "date-fns";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

export {};

const main = async () => {
  console.log(
    await execute(
      sql`
        select true
      `
    )
  );
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
