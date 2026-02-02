import { NextResponse } from "next/server";
import { getAvailableSources } from "@/lib/db/feeds";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sources = await getAvailableSources();

    return NextResponse.json(sources);
  } catch (error) {
    console.error("Error fetching sources:", error);
    return NextResponse.json(
      { error: "Failed to fetch sources" },
      { status: 500 }
    );
  }
}
