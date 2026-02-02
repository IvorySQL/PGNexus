import { NextRequest, NextResponse } from "next/server";
import { searchFeeds } from "@/lib/db/feeds";
import { searchDailyUpdates } from "@/lib/db/daily-updates";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") as "rss" | "email" | "news" | "daily-updates" | undefined;
    const dateFromStr = searchParams.get("dateFrom");
    const dateToStr = searchParams.get("dateTo");
    const limit = parseInt(searchParams.get("limit") || "50", 10);
    const offset = parseInt(searchParams.get("offset") || "0", 10);

    // Parse dates
    let dateFrom: Date | undefined;
    let dateTo: Date | undefined;

    if (dateFromStr) {
      dateFrom = new Date(dateFromStr);
      if (isNaN(dateFrom.getTime())) {
        dateFrom = undefined;
      }
    }

    if (dateToStr) {
      dateTo = new Date(dateToStr);
      if (isNaN(dateTo.getTime())) {
        dateTo = undefined;
      } else {
        // Set to end of day
        dateTo.setHours(23, 59, 59, 999);
      }
    }

    // Search feeds - handle daily updates separately
    let result;
    if (type === "daily-updates") {
      result = await searchDailyUpdates(query, dateFrom, dateTo, limit, offset);
    } else {
      result = await searchFeeds(
        query,
        type,
        dateFrom,
        dateTo,
        limit,
        offset
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error searching feeds:", error);
    return NextResponse.json(
      { error: "Failed to search feeds" },
      { status: 500 }
    );
  }
}
