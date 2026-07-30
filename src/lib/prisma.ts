import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { createClient } from "@libsql/client";

// Absolute path resolution for Vercel Serverless environment
const dbPath = path.join(process.cwd(), "prisma", "dev.db");

const libsql = createClient({
  url: `file:${dbPath}`,
});

const adapter = new PrismaLibSql(libsql);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
