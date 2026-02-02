import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const dynamic = 'force-dynamic';

/**
 * POST /api/daily-updates/upload
 *
 * Upload a markdown file to content/daily-updates directory
 *
 * Headers:
 *   Authorization: Bearer <API_TOKEN>
 *
 * Body (JSON):
 *   {
 *     "filename": "2026-02-02-postgresql-daily-news-40.md",
 *     "content": "---\ntitle: ...\n---\n\n# Content here"
 *   }
 */
export async function POST(request: NextRequest) {
  try {
    // Check if API_TOKEN is configured
    const apiToken = process.env.API_TOKEN;

    if (!apiToken) {
      return NextResponse.json(
        {
          error: 'Upload API is not configured',
          message: 'API_TOKEN environment variable is not set'
        },
        { status: 503 }
      );
    }

    // Validate Authorization header
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid Authorization header' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    if (token !== apiToken) {
      return NextResponse.json(
        { error: 'Invalid API token' },
        { status: 401 }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      );
    }

    const { filename, content } = body;

    // Validate required fields
    if (!filename || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: filename and content' },
        { status: 400 }
      );
    }

    // Validate filename
    if (typeof filename !== 'string' || typeof content !== 'string') {
      return NextResponse.json(
        { error: 'filename and content must be strings' },
        { status: 400 }
      );
    }

    // Security: prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid filename: cannot contain path separators or ..' },
        { status: 400 }
      );
    }

    // Only allow .md files
    if (!filename.endsWith('.md')) {
      return NextResponse.json(
        { error: 'Invalid filename: only .md files are allowed' },
        { status: 400 }
      );
    }

    // Validate filename format (optional but recommended)
    // Expected format: YYYY-MM-DD-postgresql-daily-news-{jobid}.md
    const filenamePattern = /^[\w\-]+\.md$/;
    if (!filenamePattern.test(filename)) {
      return NextResponse.json(
        { error: 'Invalid filename format: use alphanumeric characters, hyphens, and underscores only' },
        { status: 400 }
      );
    }

    // Ensure content directory exists
    const contentDir = join(process.cwd(), 'content', 'daily-updates');

    if (!existsSync(contentDir)) {
      await mkdir(contentDir, { recursive: true });
    }

    // Write file
    const filePath = join(contentDir, filename);

    try {
      await writeFile(filePath, content, 'utf-8');
    } catch (error) {
      console.error('Error writing file:', error);
      return NextResponse.json(
        { error: 'Failed to write file' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      filename,
      path: `/content/daily-updates/${filename}`,
    });

  } catch (error) {
    console.error('Error uploading daily update:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}
