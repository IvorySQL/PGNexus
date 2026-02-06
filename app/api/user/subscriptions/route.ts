import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { query } from "@/lib/db";

// GET - Retrieve user's email subscriptions
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user ID from email
    const userResult = await query(
      "SELECT id FROM users WHERE email = $1",
      [session.user.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userResult.rows[0].id;

    // Get user's email subscriptions (daily and weekly)
    const subscriptionsResult = await query(
      `SELECT source_identifier, status, created_at
       FROM user_subscriptions
       WHERE user_id = $1 AND feed_type = 'email' AND source_identifier IN ('daily', 'weekly')`,
      [userId]
    );

    // Format response
    const subscriptions = {
      daily: subscriptionsResult.rows.find(row => row.source_identifier === 'daily')?.status || null,
      weekly: subscriptionsResult.rows.find(row => row.source_identifier === 'weekly')?.status || null,
    };

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

// POST - Update subscription status
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { type, status } = body;

    // Validate input
    if (!type || !['daily', 'weekly'].includes(type)) {
      return NextResponse.json(
        { error: "Invalid subscription type. Must be 'daily' or 'weekly'" },
        { status: 400 }
      );
    }

    if (!status || !['active', 'inactive'].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status. Must be 'active' or 'inactive'" },
        { status: 400 }
      );
    }

    // Get user ID from email
    const userResult = await query(
      "SELECT id FROM users WHERE email = $1",
      [session.user.email]
    );

    if (userResult.rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userResult.rows[0].id;

    // Insert or update subscription
    await query(
      `INSERT INTO user_subscriptions (user_id, feed_type, source_identifier, status)
       VALUES ($1, 'email', $2, $3)
       ON CONFLICT (user_id, feed_type, source_identifier)
       DO UPDATE SET status = $3`,
      [userId, type, status]
    );

    return NextResponse.json({
      success: true,
      message: `Successfully ${status === 'active' ? 'subscribed to' : 'unsubscribed from'} ${type} emails`
    });
  } catch (error) {
    console.error("Error updating subscription:", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
