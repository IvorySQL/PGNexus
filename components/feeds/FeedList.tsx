"use client";

import { FeedCard } from "./FeedCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { UnifiedFeed } from "@/lib/types/database";

interface FeedListProps {
  feeds: UnifiedFeed[];
  isLoading?: boolean;
  hasMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
  language?: "en" | "zh";
  loadMoreText?: string;
}

export function FeedList({
  feeds,
  isLoading = false,
  hasMore = false,
  onLoadMore,
  isLoadingMore = false,
  language = "en",
  loadMoreText = "Load More"
}: FeedListProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="backdrop-blur-sm bg-white/90 dark:bg-slate-900/90 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-6 space-y-4 animate-pulse">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-24 rounded-md" />
            </div>
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-32" />
            <div className="space-y-2 pt-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (feeds.length === 0) {
    return (
      <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-16 text-center">
        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">No feeds found</p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">Try adjusting your filters or check back later</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {feeds.map((feed) => (
        <FeedCard key={`${feed.type}-${feed.id}`} feed={feed} language={language} />
      ))}

      {hasMore && (
        <div className="flex justify-center pt-6">
          <Button
            onClick={onLoadMore}
            variant="outline"
            disabled={isLoadingMore}
            size="lg"
            className="cursor-pointer transition-all hover:scale-105 shadow-md px-8"
          >
            {isLoadingMore ? "Loading..." : loadMoreText}
          </Button>
        </div>
      )}
    </div>
  );
}
