import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jobidsParam = searchParams.get('jobids');

    if (!jobidsParam) {
      return NextResponse.json({ patches: [] });
    }

    const jobids = jobidsParam
      .split(',')
      .map((id) => parseInt(id.trim()))
      .filter((id) => !isNaN(id));

    if (jobids.length === 0) {
      return NextResponse.json({ patches: [] });
    }

    const result = await query(
      `SELECT jobid, threadid, messageid, patchfile, summary, summary_zh, risk, risk_zh
       FROM patch_reports
       WHERE jobid = ANY($1)
       ORDER BY jobid DESC, messageid`,
      [jobids]
    );

    return NextResponse.json({ patches: result.rows });
  } catch (error) {
    console.error('Error fetching patch reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patch reports' },
      { status: 500 }
    );
  }
}
