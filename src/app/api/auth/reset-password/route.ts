import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ message: "Token and new password are required" }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ message: "Password must be at least 8 characters" }, { status: 400 });
    }

    // Find the token in the database
    const verificationToken = await prisma.verificationToken.findFirst({
      where: { token: token }
    });

    if (!verificationToken) {
      return NextResponse.json({ message: "Invalid or expired reset token" }, { status: 400 });
    }

    // Check expiration
    if (new Date() > verificationToken.expires) {
      await prisma.verificationToken.deleteMany({
        where: { token: token }
      });
      return NextResponse.json({ message: "Reset token has expired (valid for 1 hour)" }, { status: 400 });
    }

    // Find the associated user using the token identifier (email)
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier }
    });

    if (!user) {
      return NextResponse.json({ message: "User associated with token not found" }, { status: 400 });
    }

    // Hash new password and update user
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    // Cleanup the used token
    await prisma.verificationToken.deleteMany({
      where: { identifier: verificationToken.identifier }
    });

    return NextResponse.json({ message: "Password reset successful" }, { status: 200 });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
