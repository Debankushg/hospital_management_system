import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "./index";

migrate(db, { migrationsFolder: "./drizzle" })
  .then(() => console.log("Migrations applied"))
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
