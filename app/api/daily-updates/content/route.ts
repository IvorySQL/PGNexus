import { NextRequest, NextResponse } from 'next/server';
import { readFile, access } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {

    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get('filename');
    const language = searchParams.get('language') || 'en';

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename parameter is required' },
        { status: 400 }
      );
    }

    // Security: prevent directory traversal
    if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }

    // Only allow .md files
    if (!filename.endsWith('.md')) {
      return NextResponse.json(
        { error: 'Only markdown files are allowed' },
        { status: 400 }
      );
    }

    const contentDir = join(process.cwd(), 'content', 'daily-updates');

    // Determine which file to load based on language
    let fileToLoad = filename;

    // If language is Chinese, try to load the _zh version first
    if (language === 'zh') {
      const baseFilename = filename.replace(/\.md$/, '');
      const zhFilename = `${baseFilename}_zh.md`;
      const zhFilePath = join(contentDir, zhFilename);

      try {
        // Check if Chinese version exists
        await access(zhFilePath);
        fileToLoad = zhFilename;
      } catch {
        // Chinese version doesn't exist, fallback to English
        fileToLoad = filename;
      }
    }

    const filePath = join(contentDir, fileToLoad);

    try {
      const fileContent = await readFile(filePath, 'utf-8');

      // Parse frontmatter
      const { data: frontmatter, content } = matter(fileContent);

      return NextResponse.json({
        filename: fileToLoad,
        content,
        frontmatter,
      });
    } catch (error) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error reading daily update:', error);
    return NextResponse.json(
      { error: 'Failed to read daily update' },
      { status: 500 }
    );
  }
}
