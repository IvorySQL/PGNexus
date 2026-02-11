import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {

    const searchParams = request.nextUrl.searchParams;
    const subject = searchParams.get('subject');
    const limit = parseInt(searchParams.get('limit') || '5');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject parameter is required' },
        { status: 400 }
      );
    }

    // Get all entries for this subject, ordered by jobid DESC (latest first)
    const result = await query(
      `
      SELECT
        jobid,
        threadid,
        subject,
        subject_zh,
        participants,
        messages,
        summary,
        summary_zh,
        lastactivity
      FROM email_feeds
      WHERE subject = $1
      ORDER BY jobid DESC
      LIMIT $2 OFFSET $3
      `,
      [subject, limit, offset]
    );

    // Get total count for this subject
    const countResult = await query(
      `
      SELECT COUNT(*) as total
      FROM email_feeds
      WHERE subject = $1
      `,
      [subject]
    );

    const total = parseInt(countResult.rows[0].total);
    const hasMore = offset + limit < total;

    return NextResponse.json({
      entries: result.rows,
      total,
      hasMore,
    });
  } catch (error) {
    console.error('Error fetching email entries by subject:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email entries' },
      { status: 500 }
    );
  }
}
