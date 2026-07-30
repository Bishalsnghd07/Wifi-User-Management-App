import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: Fetch all registered devices for a user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const devices = await prisma.device.findMany({
      where: userId ? { userId } : {},
      orderBy: { registeredAt: "desc" },
    });

    return NextResponse.json({ success: true, devices });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch devices" },
      { status: 500 },
    );
  }
}

// POST: Register a new device
export async function POST(req: Request) {
  try {
    const { userId, deviceName, deviceType, macAddress } = await req.json();

    if (!userId || !deviceName || !macAddress) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 },
      );
    }

    const device = await prisma.device.create({
      data: {
        userId,
        deviceName,
        deviceType: deviceType || "Laptop",
        macAddress,
        status: "ONLINE",
      },
    });

    return NextResponse.json({ success: true, device });
  } catch (error: any) {
    if (error.code === "P2002") {
      return NextResponse.json(
        { success: false, error: "MAC Address is already registered" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to register device" },
      { status: 500 },
    );
  }
}

// PATCH: Update Device Status (ONLINE / OFFLINE / BLOCKED)
export async function PATCH(req: Request) {
  try {
    const { deviceId, status } = await req.json();

    const device = await prisma.device.update({
      where: { id: deviceId },
      data: { status },
    });

    return NextResponse.json({ success: true, device });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update device status" },
      { status: 500 },
    );
  }
}
