import pg from "pg";

import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
});

pool

  .query("SELECT NOW()")

  .then(() => {
    console.log("✅ Database connected");
  })

  .catch((err) => {
    console.error("❌ Database connection failed");

    console.error(err);
  });
