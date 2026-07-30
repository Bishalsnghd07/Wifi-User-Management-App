import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";

declare const process: {
  exit(code?: number): never;
};

const adapter = new PrismaLibSql({
  url: "file:prisma/dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding initial data...");

  // Clean existing data
  await prisma.usageLog.deleteMany({});
  await prisma.device.deleteMany({});
  await prisma.user.deleteMany({});

  // 1. Create a Test User
  const user = await prisma.user.create({
    data: {
      name: "Bishal Singh Deo",
      email: "bishal@example.com",
      mobile: "+919876543210",
      companyName: "MatchToCollege Tech",
      kycStatus: "VERIFIED",
      kycDocType: "PAN",
      kycDocUrl: "https://example.com/mock-pan.pdf",
    },
  });

  console.log(`Created User: ${user.name}`);

  // 2. Register Sample Devices
  await prisma.device.createMany({
    data: [
      {
        userId: user.id,
        deviceName: "Bishal MacBook Pro M2",
        deviceType: "Laptop",
        macAddress: "32:F4:11:89:AB:CD",
        status: "ONLINE",
      },
      {
        userId: user.id,
        deviceName: "iPhone 15 Pro",
        deviceType: "Mobile",
        macAddress: "1A:2B:3C:4D:5E:6F",
        status: "ONLINE",
      },
      {
        userId: user.id,
        deviceName: "iPad Air (Testing)",
        deviceType: "Tablet",
        macAddress: "98:76:54:32:10:FE",
        status: "OFFLINE",
      },
    ],
  });

  console.log("Registered 3 devices.");

  // 3. Create Daily Internet Usage Logs for Dashboard Graphs
  const usageData = [
    { dataMB: 1250.5, sessionTime: 240, daysAgo: 6 },
    { dataMB: 3400.0, sessionTime: 480, daysAgo: 5 },
    { dataMB: 2100.2, sessionTime: 310, daysAgo: 4 },
    { dataMB: 4800.8, sessionTime: 520, daysAgo: 3 },
    { dataMB: 1900.0, sessionTime: 290, daysAgo: 2 },
    { dataMB: 5120.4, sessionTime: 600, daysAgo: 1 },
    { dataMB: 2850.0, sessionTime: 350, daysAgo: 0 },
  ];

  for (const item of usageData) {
    const date = new Date();
    date.setDate(date.getDate() - item.daysAgo);

    await prisma.usageLog.create({
      data: {
        userId: user.id,
        dataMB: item.dataMB,
        sessionTime: item.sessionTime,
        lastActive: date,
      },
    });
  }

  console.log("Seeded 7 days of internet usage metrics.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
