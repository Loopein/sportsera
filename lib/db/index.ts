import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set");
}

const shouldUseSsl = connectionString.includes("neon.tech") || connectionString.includes("sslmode=");
const ssl = shouldUseSsl ? { rejectUnauthorized: false } : undefined;

const globalForDb = globalThis as unknown as { __dbPool?: Pool };

export const dbPool =
  globalForDb.__dbPool ??
  new Pool({
    connectionString,
    ssl,
    max: 10,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 10_000,
    keepAlive: true
  });

globalForDb.__dbPool = dbPool;

export async function query<T>(text: string, params: unknown[] = []): Promise<T[]> {
  const result = await dbPool.query(text, params);
  return result.rows as T[];
}
