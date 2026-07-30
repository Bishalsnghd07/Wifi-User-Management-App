import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId, docType, docUrl } = await req.json();

    if (!userId || !docType) {
      return NextResponse.json(
        { success: false, error: "User ID and Document Type are required" },
        { status: 400 },
      );
    }

    // Mock KYC Approval
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        kycStatus: "VERIFIED",
        kycDocType: docType,
        kycDocUrl:
          docUrl || "https://via.placeholder.com/150?text=Mock+ID+Proof",
      },
    });

    return NextResponse.json({
      success: true,
      message: "KYC Document verified successfully!",
      user,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "KYC verification failed" },
      { status: 500 },
    );
  }
}
