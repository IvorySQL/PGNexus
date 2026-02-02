import { readdir, readFile } from 'fs/promises';
import { join } from 'path';
import matter from 'gray-matter';
import type { FeedResponse, UnifiedFeed } from '../types/database';

interface DailyUpdateFile {
  filename: string;
  date: string;
  jobid: number;
}

/**
 * Get all daily update markdown files
 */
async function getAllDailyUpdateFiles(): Promise<DailyUpdateFile[]> {
  const contentDir = join(process.cwd(), 'content', 'daily-updates');

  try {
    const files = await readdir(contentDir);

    const markdownFiles = files
      .filter(file => file.endsWith('.md'))
      .map(file => {
        // Extract date and jobid from filename
        // Format: YYYY-MM-DD-postgresql-daily-news-{jobid}.md
        const match = file.match(/^(\d{4}-\d{2}-\d{2}).*?-(\d+)\.md$/);

        if (match) {
          return {
            filename: file,
            date: match[1],
            jobid: parseInt(match[2]),
          };
        }

        // Fallback: just use filename
        return {
          filename: file,
          date: file.substring(0, 10),
          jobid: 0,
        };
      })
      .sort((a, b) => {
        // Sort by jobid descending (latest first)
        if (a.jobid !== b.jobid) {
          return b.jobid - a.jobid;
        }
        // Then by date descending
        return b.date.localeCompare(a.date);
      });

    return markdownFiles;
  } catch (error) {
    return [];
  }
}

/**
 * Read and parse a daily update markdown file
 */
async function readDailyUpdateFile(filename: string): Promise<{ title: string; content: string; summary: string } | null> {
  const contentDir = join(process.cwd(), 'content', 'daily-updates');
  const filePath = join(contentDir, filename);

  try {
    const fileContent = await readFile(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);

    // Extract title from frontmatter or use filename
    const title = frontmatter.title || filename.replace('.md', '').replace(/-/g, ' ');

    // Create summary from first few lines of content
    const lines = content.split('\n').filter(line => line.trim() && !line.startsWith('#'));
    const summary = lines.slice(0, 3).join(' ').substring(0, 300) + '...';

    return {
      title,
      content,
      summary,
    };
  } catch (error) {
    return null;
  }
}

/**
 * Search daily update markdown files
 */
export async function searchDailyUpdates(
  searchQuery: string,
  dateFrom?: Date,
  dateTo?: Date,
  limit: number = 50,
  offset: number = 0
): Promise<FeedResponse> {
  const files = await getAllDailyUpdateFiles();
  const unifiedFeeds: UnifiedFeed[] = [];

  for (const file of files) {
    // Filter by date range if provided
    if (dateFrom || dateTo) {
      const fileDate = new Date(file.date);
      if (dateFrom && fileDate < dateFrom) continue;
      if (dateTo && fileDate > dateTo) continue;
    }

    // Read file content
    const fileData = await readDailyUpdateFile(file.filename);
    if (!fileData) continue;

    // Search in title and content
    const searchLower = searchQuery.toLowerCase();
    const titleMatch = fileData.title.toLowerCase().includes(searchLower);
    const contentMatch = fileData.content.toLowerCase().includes(searchLower);

    if (!searchQuery || titleMatch || contentMatch) {
      unifiedFeeds.push({
        id: file.jobid.toString(),
        type: 'daily-updates' as any, // Add this as a new type
        title: fileData.title,
        content: fileData.content,
        date: new Date(file.date),
        source: 'Daily Updates',
        link: `/daily-updates?file=${encodeURIComponent(file.filename)}`,
        summary_english: fileData.summary,
        summary_chinese: fileData.summary,
        metadata: { filename: file.filename }, // Store filename for linking
      });
    }
  }

  // Apply pagination
  const paginatedFeeds = unifiedFeeds.slice(offset, offset + limit);
  const hasMore = unifiedFeeds.length > offset + limit;

  return {
    feeds: paginatedFeeds,
    total: unifiedFeeds.length,
    hasMore,
  };
}

/**
 * Get all daily updates as unified feeds (for "all" type)
 */
export async function getAllDailyUpdatesAsFeeds(
  limit: number = 50,
  offset: number = 0
): Promise<UnifiedFeed[]> {
  const files = await getAllDailyUpdateFiles();
  const unifiedFeeds: UnifiedFeed[] = [];

  // Limit how many files we read for performance
  const filesToRead = files.slice(offset, offset + limit);

  for (const file of filesToRead) {
    const fileData = await readDailyUpdateFile(file.filename);
    if (!fileData) continue;

    unifiedFeeds.push({
      id: file.jobid.toString(),
      type: 'daily-updates' as any,
      title: fileData.title,
      content: fileData.content,
      date: new Date(file.date),
      source: 'Daily Updates',
      link: `/daily-updates?file=${encodeURIComponent(file.filename)}`,
      summary_english: fileData.summary,
      summary_chinese: fileData.summary,
      metadata: { filename: file.filename },
    });
  }

  return unifiedFeeds;
}
