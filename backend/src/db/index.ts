// import { drizzle } from "drizzle-orm/node-postgres";
// import { Pool } from "pg";
// import { env } from "../config/env";
// import * as schema from "../models";

// export const pool = new Pool({ connectionString: env.DATABASE_URL });
// export const db = drizzle(pool, { schema });

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../config/env";
import * as schema from "../models";

export const pool = new Pool({
    connectionString: env.DATABASE_URL,

    // SSL for Render PostgreSQL external connections
    ssl: {
        rejectUnauthorized: false,
    },

    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 15000,
});

pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL pool error:", error);
});

export const db = drizzle(pool, { schema });
