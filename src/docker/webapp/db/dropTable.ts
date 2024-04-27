import { eq, inArray } from "drizzle-orm";
import { execute } from "./orm";

import { sql } from "drizzle-orm";
import { pathToFileURL } from "url";
import { addDays, addHours, startOfHour } from "date-fns";
import { join } from "path";
import dotenv from "dotenv";

dotenv.config({ path: "../.env" });

const main = async () => {
  const result = await execute(
    sql.raw(`drop table if exists "${process.argv[2]}"`)
  );
  console.log(result);
  process.exit(0);
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  main();
}
