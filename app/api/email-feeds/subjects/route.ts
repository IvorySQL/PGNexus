import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get unique subjects with their latest jobid, ordered by highest jobid first
    const result = await query(
      `
      WITH latest_subjects AS (
        SELECT DISTINCT ON (subject)
          subject,
          jobid,
          lastactivity
        FROM email_feeds
        WHERE subject IS NOT NULL AND subject != ''
        ORDER BY subject, jobid DESC
      )
      SELECT subject, jobid, lastactivity
      FROM latest_subjects
      ORDER BY jobid DESC
      LIMIT $1 OFFSET $2
      `,
      [limit, offset]
    );

    // Get total count of unique subjects
    const countResult = await query(
      `
      SELECT COUNT(DISTINCT subject) as total
      FROM email_feeds
      WHERE subject IS NOT NULL AND subject != ''
      `
    );

    const total = parseInt(countResult.rows[0].total);
    const hasMore = offset + limit < total;

    return NextResponse.json({
      subjects: result.rows,
      total,
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching email subjects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email subjects' },
      { status: 500 }
    );
  }
}
