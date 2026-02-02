import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {

    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!searchQuery) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    const searchPattern = `%${searchQuery}%`;

    // Search unique subjects with their latest jobid, matching subject or summary
    const result = await query(
      `
      WITH latest_subjects AS (
        SELECT DISTINCT ON (subject)
          subject,
          jobid,
          lastactivity
        FROM email_feeds
        WHERE subject IS NOT NULL AND subject != ''
          AND (
            subject ILIKE $1
            OR summary ILIKE $1
            OR summary_zh ILIKE $1
          )
        ORDER BY subject, jobid DESC
      )
      SELECT subject, jobid, lastactivity
      FROM latest_subjects
      ORDER BY jobid DESC
      LIMIT $2 OFFSET $3
      `,
      [searchPattern, limit, offset]
    );

    // Get total count of matching unique subjects
    const countResult = await query(
      `
      SELECT COUNT(DISTINCT subject) as total
      FROM email_feeds
      WHERE subject IS NOT NULL AND subject != ''
        AND (
          subject ILIKE $1
          OR summary ILIKE $1
          OR summary_zh ILIKE $1
        )
      `,
      [searchPattern]
    );

    const total = parseInt(countResult.rows[0].total);
    const hasMore = offset + limit < total;

    return NextResponse.json({
      subjects: result.rows,
      total,
      hasMore,
    });
  } catch (error) {
    console.error('Error searching email subjects:', error);
    return NextResponse.json(
      { error: 'Failed to search email subjects' },
      { status: 500 }
    );
  }
}
