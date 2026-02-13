import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '6');

    // Get upcoming events ordered by pubdate (future events first, then recent past events)
    const result = await query(
      `
      SELECT
        title,
        title_zh,
        url,
        pubdate,
        content,
        snippet
      FROM event_feeds
      WHERE pubdate IS NOT NULL
      ORDER BY
        CASE
          WHEN pubdate >= NOW() THEN 0
          ELSE 1
        END,
        ABS(EXTRACT(EPOCH FROM (pubdate - NOW()))) ASC
      LIMIT $1
      `,
      [limit]
    );

    return NextResponse.json({
      events: result.rows,
    });
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming events' },
      { status: 500 }
    );
  }
}
