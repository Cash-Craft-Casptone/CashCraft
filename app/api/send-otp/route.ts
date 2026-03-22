import { NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

// In-memory OTP store: email -> { code, expiresAt }
// In production you'd use Redis, but this works for a single-instance deployment
const otpStore = new Map<string, { code: string; expiresAt: number }>()

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const code = generateOTP()
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutes

    otpStore.set(email.toLowerCase(), { code, expiresAt })

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    })

    await transporter.sendMail({
      from: `"CashCraft" <${process.env.GMAIL_USER}>`,
      to: email,
      subject: "Your CashCraft Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8f9fa; border-radius: 12px;">
          <h2 style="color: #084f5a; margin-bottom: 8px;">CashCraft Email Verification</h2>
          <p style="color: #555; margin-bottom: 24px;">Use the code below to verify your email address. It expires in <strong>10 minutes</strong>.</p>
          <div style="background: #fff; border: 2px solid #6099a5; border-radius: 8px; padding: 24px; text-align: center;">
            <span style="font-size: 40px; font-weight: bold; letter-spacing: 12px; color: #084f5a;">${code}</span>
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Send OTP error:", error)
    return NextResponse.json({ error: "Failed to send email. Please try again." }, { status: 500 })
  }
}

// Export the store so verify-otp can access it
export { otpStore }
