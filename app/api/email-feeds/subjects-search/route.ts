import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {

    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get('q') || '';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    let result;
    let countResult;

    if (searchQuery.trim()) {
      // Search with query - search in subject and summary
      result = await query(
        `
        WITH latest_subjects AS (
          SELECT DISTINCT ON (subject)
            subject,
            jobid,
            lastactivity,
            summary,
            summary_zh
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
        [`%${searchQuery}%`, limit, offset]
      );

      countResult = await query(
        `
        WITH unique_subjects AS (
          SELECT DISTINCT subject
          FROM email_feeds
          WHERE subject IS NOT NULL AND subject != ''
            AND (
              subject ILIKE $1
              OR summary ILIKE $1
              OR summary_zh ILIKE $1
            )
        )
        SELECT COUNT(*) as total
        FROM unique_subjects
        `,
        [`%${searchQuery}%`]
      );
    } else {
      // No query - return all subjects
      result = await query(
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

      countResult = await query(
        `
        SELECT COUNT(DISTINCT subject) as total
        FROM email_feeds
        WHERE subject IS NOT NULL AND subject != ''
        `
      );
    }

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
