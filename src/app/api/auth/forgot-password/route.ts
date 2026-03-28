import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.email === "demo@complife.com") {
      // Return 200 even if user doesn't exist to prevent email enumeration attacks
      // Also silently ignore demo account resets
      return NextResponse.json(
        { message: "If an account exists, a reset link has been sent." },
        { status: 200 }
      );
    }

    // Generate a secure random token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now

    // Save or update the verification token in standard NextAuth table
    // NextAuth uses a composite unique key on identifier & token, so we can't just upsert by identifier alone easily.
    // Instead we delete any existing token for this email (cleanup) and insert a new one.
    await prisma.verificationToken.deleteMany({
      where: { identifier: email }
    });

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token: token,
        expires: expires,
      }
    });

    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

    console.log("\n========================================================");
    console.log(" PASSWORD RESET REQUESTED");
    console.log(" Email:", email);
    console.log(" Token:", token);
    console.log(" Link :", resetLink);
    console.log("========================================================\n");

    return NextResponse.json(
      { message: "If an account exists, a reset link has been sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
