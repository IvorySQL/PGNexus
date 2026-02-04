import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jobid = searchParams.get('jobid');
    const url = searchParams.get('url');

    if (!jobid && !url) {
      return NextResponse.json(
        { error: 'jobid or url parameter is required' },
        { status: 400 }
      );
    }

    // Get specific RSS feed by URL (more specific) or jobid
    let result;
    if (url) {
      result = await query(
        `
        SELECT
          jobid,
          title,
          url,
          author,
          pubdate,
          summary,
          summary_zh,
          imgurl
        FROM rss_feeds
        WHERE url = $1
        `,
        [url]
      );
    } else {
      result = await query(
        `
        SELECT
          jobid,
          title,
          url,
          author,
          pubdate,
          summary,
          summary_zh,
          imgurl
        FROM rss_feeds
        WHERE jobid = $1
        `,
        [parseInt(jobid!)]
      );
    }

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Feed not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      feed: result.rows[0],
    });
  } catch (error) {
    console.error('Error fetching RSS feed by jobid:', error);
    return NextResponse.json(
      { error: 'Failed to fetch RSS feed' },
      { status: 500 }
    );
  }
}
