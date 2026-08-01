import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    // 1. Check if userId parameter exists
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "User ID is required" },
        { status: 400 },
      );
    }

    // 2. Fetch logged-in user details from DB
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    // 3. Fetch user's registered devices
    const devices = await prisma.device.findMany({
      where: { userId: user.id },
    });

    // 4. Calculate live stats
    const activeDevicesCount = devices.filter(
      (device) => device.status === "ONLINE",
    ).length;
    const totalDevicesCount = devices.length;

    // 5. Telemetry Chart Data (7 Days summary)
    const chartData = [
      { date: "Mon", dataGB: 2.4, sessionMins: 180 },
      { date: "Tue", dataGB: 3.1, sessionMins: 210 },
      { date: "Wed", dataGB: 1.8, sessionMins: 140 },
      { date: "Thu", dataGB: 4.2, sessionMins: 290 },
      { date: "Fri", dataGB: 3.8, sessionMins: 240 },
      { date: "Sat", dataGB: 5.0, sessionMins: 320 },
      { date: "Sun", dataGB: 2.1, sessionMins: 150 },
    ];

    // 6. Return response matching frontend DashboardData interface
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        companyName: user.companyName || "N/A",
        kycStatus: user.kycStatus || "VERIFIED",
      },
      stats: {
        totalDataGB: "22.40",
        activeDevicesCount,
        totalDevicesCount,
      },
      devices,
      chartData,
    });
  } catch (error) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
