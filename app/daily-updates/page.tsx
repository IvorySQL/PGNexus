"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, Calendar, FileText } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";
import "./markdown.css";

interface MarkdownFile {
  filename: string;
  date: string;
  jobid: number;
}

function DailyUpdatesContent() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [files, setFiles] = useState<MarkdownFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<MarkdownFile | null>(null);
  const [content, setContent] = useState<string>("");
  const [frontmatter, setFrontmatter] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(10);

  useEffect(() => {
    fetchFileList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFileList = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/daily-updates/list');
      const data = await response.json();

      setFiles(data.files || []);

      // Check if there's a file specified in URL
      const fileParam = searchParams.get('file');
      let fileToLoad: MarkdownFile | null = null;

      if (fileParam) {
        // Find the file from URL parameter
        fileToLoad = data.files.find((f: MarkdownFile) => f.filename === fileParam) || null;
      }

      // If no file in URL or file not found, use the latest
      if (!fileToLoad && data.latest) {
        fileToLoad = data.latest;
      }

      if (fileToLoad) {
        setSelectedFile(fileToLoad);
        await fetchFileContent(fileToLoad.filename);
        // Update URL if not already set
        if (!fileParam || fileParam !== fileToLoad.filename) {
          router.replace(`/daily-updates?file=${encodeURIComponent(fileToLoad.filename)}`, { scroll: false });
        }
      }
    } catch (error) {
      console.error('Error fetching file list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchFileContent = async (filename: string) => {
    try {
      setIsLoadingContent(true);
      const response = await fetch(`/api/daily-updates/content?filename=${encodeURIComponent(filename)}`);
      const data = await response.json();

      if (data.content) {
        setContent(data.content);
        setFrontmatter(data.frontmatter || {});
      }
    } catch (error) {
      console.error('Error fetching file content:', error);
      setContent('# Error\n\nFailed to load daily update content.');
      setFrontmatter({});
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleFileSelect = async (file: MarkdownFile) => {
    setSelectedFile(file);
    await fetchFileContent(file.filename);
    // Update URL to reflect selected file
    router.push(`/daily-updates?file=${encodeURIComponent(file.filename)}`, { scroll: false });
  };

  const handleLoadMore = () => {
    setDisplayLimit((prev) => prev + 10);
  };

  const displayedFiles = files.slice(0, displayLimit);
  const hasMoreFiles = files.length > displayLimit;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-12 text-center">
        <FileText className="h-12 w-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
          {t(trans.dailyUpdatesPage.noUpdates)}
        </h3>
        <p className="text-slate-600 dark:text-slate-400">
          {t(trans.dailyUpdatesPage.noUpdatesSubtext)}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      {/* Sidebar with file list */}
      <aside className="w-full lg:w-64 lg:shrink-0">
        <div className="lg:sticky lg:top-24 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 px-2">
            {t(trans.dailyUpdatesPage.sidebarTitle)}
          </h2>
          <div className="space-y-1 max-h-[300px] lg:max-h-[calc(100vh-200px)] overflow-y-auto">
            {displayedFiles.map((file) => (
              <button
                key={file.filename}
                onClick={() => handleFileSelect(file)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-all cursor-pointer text-sm ${
                  selectedFile?.filename === file.filename
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  <span className="font-medium">{file.date}</span>
                </div>
              </button>
            ))}
            {hasMoreFiles && (
              <button
                onClick={handleLoadMore}
                className="w-full text-center px-3 py-2 mt-2 rounded-lg transition-all cursor-pointer text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 font-medium"
              >
                {t(trans.dailyUpdatesPage.loadMore)} ({files.length - displayLimit} {t(trans.dailyUpdatesPage.remaining)})
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-4 sm:p-8">
          {isLoadingContent ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {selectedFile && (
                <div className="mb-6 pb-6 border-b border-slate-200/60 dark:border-slate-700/60">
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400">
                    <Calendar className="h-4 w-4" />
                    <span>{selectedFile.date}</span>
                    <span>•</span>
                    <span className="font-mono">#{selectedFile.jobid}</span>
                  </div>
                </div>
              )}
              <div>
                {Object.keys(frontmatter).length > 0 && (
                  <div className="mb-8 overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
                    <table className="w-full">
                      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {Object.entries(frontmatter).map(([key, value]) => (
                          <tr key={key} className="bg-slate-50/50 dark:bg-slate-800/30">
                            <td className="px-4 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 w-1/4">
                              {key}
                            </td>
                            <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <article className="markdown-content text-slate-800 dark:text-slate-200">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {content}
                  </ReactMarkdown>
                </article>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function DailyUpdatesPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    }>
      <DailyUpdatesContent />
    </Suspense>
  );
}
