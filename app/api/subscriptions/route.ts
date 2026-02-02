import { NextRequest, NextResponse } from "next/server";
import {
  getUserSubscriptions,
  addUserSubscription,
  removeUserSubscription,
} from "@/lib/db/users";
import { getCurrentUserId } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const subscriptions = await getUserSubscriptions(userId);

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    return NextResponse.json(
      { error: "Failed to fetch subscriptions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { feedType, sourceIdentifier } = body;

    if (!feedType || !sourceIdentifier) {
      return NextResponse.json(
        { error: "feedType and sourceIdentifier are required" },
        { status: 400 }
      );
    }

    if (!["rss", "email", "news"].includes(feedType)) {
      return NextResponse.json(
        { error: "Invalid feed type" },
        { status: 400 }
      );
    }

    const subscription = await addUserSubscription(userId, feedType, sourceIdentifier);

    return NextResponse.json({ subscription }, { status: 201 });
  } catch (error) {
    console.error("Error adding subscription:", error);
    return NextResponse.json(
      { error: "Failed to add subscription" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getCurrentUserId();

    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { feedType, sourceIdentifier } = body;

    if (!feedType || !sourceIdentifier) {
      return NextResponse.json(
        { error: "feedType and sourceIdentifier are required" },
        { status: 400 }
      );
    }

    const success = await removeUserSubscription(userId, feedType, sourceIdentifier);

    if (success) {
      return NextResponse.json({ message: "Subscription removed" });
    } else {
      return NextResponse.json(
        { error: "Subscription not found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Error removing subscription:", error);
    return NextResponse.json(
      { error: "Failed to remove subscription" },
      { status: 500 }
    );
  }
}
