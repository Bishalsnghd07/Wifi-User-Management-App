import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 1. Mobile + Mock OTP Authentication or Email/Password Login
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, mobile, password, otp, name, companyName } = body;

    // Action A: Send / Verify Mock OTP
    if (action === "VERIFY_OTP") {
      if (otp === "123456") {
        // Mock OTP check
        let user = await prisma.user.findFirst({ where: { mobile } });

        // If user doesn't exist, create a default entry
        if (!user) {
          user = await prisma.user.create({
            data: {
              mobile,
              name: name || "WiFi Guest User",
              email: email || `user_${Date.now()}@wifi.com`,
              companyName: companyName || "Visitor",
            },
          });
        }

        return NextResponse.json({
          success: true,
          message: "OTP Verified successfully",
          user,
        });
      }
      return NextResponse.json(
        { success: false, error: "Invalid OTP. Use 123456 for testing." },
        { status: 400 },
      );
    }

    // Action B: Registration
    if (action === "REGISTER") {
      const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { mobile }] },
      });

      if (existingUser) {
        return NextResponse.json(
          {
            success: false,
            error: "User with this Email or Mobile already exists.",
          },
          { status: 400 },
        );
      }

      const user = await prisma.user.create({
        data: {
          name,
          email,
          mobile,
          companyName,
          password: password || "default123",
        },
      });

      return NextResponse.json({
        success: true,
        message: "User registered successfully",
        user,
      });
    }

    return NextResponse.json(
      { success: false, error: "Invalid action" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Auth API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
