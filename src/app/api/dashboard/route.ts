import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // Fetch user details with devices and usage logs
    const user = await prisma.user.findFirst({
      where: userId ? { id: userId } : {},
      include: {
        devices: true,
        usageLogs: {
          orderBy: { lastActive: "asc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // Calculations for Dashboard Metrics
    const totalDataConsumedMB = user.usageLogs.reduce(
      (acc, log) => acc + log.dataMB,
      0,
    );
    const totalDataGB = (totalDataConsumedMB / 1024).toFixed(2);
    const activeDevicesCount = user.devices.filter(
      (d) => d.status === "ONLINE",
    ).length;
    const totalDevicesCount = user.devices.length;

    // Daily Chart Data
    const chartData = user.usageLogs.map((log) => ({
      date: new Date(log.lastActive).toLocaleDateString("en-US", {
        weekday: "short",
      }),
      dataGB: parseFloat((log.dataMB / 1024).toFixed(2)),
      sessionMins: log.sessionTime,
    }));

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        companyName: user.companyName,
        kycStatus: user.kycStatus,
      },
      stats: {
        totalDataGB,
        activeDevicesCount,
        totalDevicesCount,
        lastActive:
          user.usageLogs[user.usageLogs.length - 1]?.lastActive || new Date(),
      },
      devices: user.devices,
      chartData,
    });
  } catch (_error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch dashboard metrics" },
      { status: 500 },
    );
  }
}
