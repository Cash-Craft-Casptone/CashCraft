import { NextRequest, NextResponse } from "next/server"
import { otpStore } from "../send-otp/route"

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Email and code are required" }, { status: 400 })
    }

    const key = email.toLowerCase()
    const record = otpStore.get(key)

    if (!record) {
      return NextResponse.json({ error: "No verification code found. Please request a new one." }, { status: 400 })
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(key)
      return NextResponse.json({ error: "Code has expired. Please request a new one." }, { status: 400 })
    }

    if (record.code !== code.trim()) {
      return NextResponse.json({ error: "Incorrect code. Please try again." }, { status: 400 })
    }

    // Valid - remove from store
    otpStore.delete(key)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Verify OTP error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
