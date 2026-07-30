import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

const isProduction = process.env.NODE_ENV === "production";

const adapter = new PrismaLibSql({
  url: isProduction ? process.env.TURSO_DATABASE_URL! : "file:prisma/dev.db",
  authToken: isProduction ? process.env.TURSO_AUTH_TOKEN : undefined,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (!isProduction) globalForPrisma.prisma = prisma;
