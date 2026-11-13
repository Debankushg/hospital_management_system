import "dotenv/config";

import { migrate } from "drizzle-orm/node-postgres/migrator";
import { db, pool } from "./index";

async function runMigration() {
  try {
    console.log("Connecting to PostgreSQL...");

    await pool.query("SELECT 1");

    console.log("Database connected successfully!");
    console.log("Running migrations...");

    await migrate(db, {
      migrationsFolder: "./drizzle",
    });

    console.log("Migrations applied successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

runMigration();