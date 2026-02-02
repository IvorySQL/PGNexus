import { NextRequest, NextResponse } from "next/server";
import { getAllFeeds } from "@/lib/db/feeds";
import { getUserSubscriptionsGrouped } from "@/lib/db/users";
import { getCurrentUserId } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const subscribedOnly = searchParams.get("subscribedOnly") === "true";

    // Get current user ID
    const userId = await getCurrentUserId();

    // Get user subscriptions if needed
    let subscriptions;
    if (userId && subscribedOnly) {
      subscriptions = await getUserSubscriptionsGrouped(userId);
    }

    // Fetch feeds
    const result = await getAllFeeds(limit, offset, subscriptions);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching feeds:", error);
    return NextResponse.json(
      { error: "Failed to fetch feeds" },
      { status: 500 }
    );
  }
}
