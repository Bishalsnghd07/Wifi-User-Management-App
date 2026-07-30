import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

// Resolve absolute path dynamically for Vercel Serverless environment
const dbPath = path.join(process.cwd(), "prisma", "dev.db");

const adapter = new PrismaLibSql({
  url: `file:${dbPath}`,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
