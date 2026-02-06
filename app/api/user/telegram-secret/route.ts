import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { query } from "@/lib/db";
import crypto from "crypto";

// GET - Retrieve telegram secret
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await query(
      "SELECT telegram_secret FROM users WHERE email = $1",
      [session.user.email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      telegram_secret: result.rows[0].telegram_secret || null,
    });
  } catch (error) {
    console.error("Error fetching telegram secret:", error);
    return NextResponse.json(
      { error: "Failed to fetch telegram secret" },
      { status: 500 }
    );
  }
}

// POST - Generate new telegram secret
export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate a random secret (32 characters)
    const secret = crypto.randomBytes(16).toString("hex");

    // Update both telegram_secret and set telegram_status to 'inactive'
    // This will require the user to re-authenticate with Telegram
    const result = await query(
      "UPDATE users SET telegram_secret = $1, telegram_status = 'inactive' WHERE email = $2 RETURNING telegram_secret",
      [secret, session.user.email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      telegram_secret: result.rows[0].telegram_secret,
    });
  } catch (error) {
    console.error("Error generating telegram secret:", error);
    return NextResponse.json(
      { error: "Failed to generate telegram secret" },
      { status: 500 }
    );
  }
}
