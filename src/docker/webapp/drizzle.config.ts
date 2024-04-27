import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: `postgres://postgres:jNPyNcPpidzWBRUdJAkT58YpWoYFqBBz@hcl-hackathon.bchoii.com:5432/postgres`,
  },
  verbose: true,
} satisfies Config;
