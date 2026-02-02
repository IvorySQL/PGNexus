"use client";

import { useEffect, useState, useCallback } from "react";
import { FeedList } from "@/components/feeds/FeedList";
import { EmailSubjectList } from "@/components/feeds/EmailSubjectList";
import { FeedFilters, type FilterState } from "@/components/feeds/FeedFilters";
import { Button } from "@/components/ui/button";
import type { UnifiedFeed } from "@/lib/types/database";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";

interface EmailSubject {
  subject: string;
  jobid: number;
  lastactivity: string;
}

export default function DashboardPage() {
  const { language, t } = useLanguage();
  const [feeds, setFeeds] = useState<UnifiedFeed[]>([]);
  const [emailSubjects, setEmailSubjects] = useState<EmailSubject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);
  const [subscribedOnly, setSubscribedOnly] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    query: "",
    feedType: "all",
  });
  const [isSearchMode, setIsSearchMode] = useState(false);

  const limit = 20;

  const fetchFeeds = useCallback(async (newOffset: number, append: boolean = false) => {
    try {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }

      let url: string;
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: newOffset.toString(),
      });

      // Check if we're filtering by email type OR searching with "all" that includes emails
      const isEmailType = isSearchMode && filters.feedType === "email";
      const isAllTypeWithSearch = isSearchMode && filters.feedType === "all" && filters.query;

      if (isEmailType) {
        // Use email subjects search API
        url = `/api/email-feeds/subjects-search`;
        if (filters.query) params.set("q", filters.query);

        const response = await fetch(`${url}?${params}`);
        const data = await response.json();

        if (append) {
          setEmailSubjects((prev) => [...prev, ...data.subjects]);
        } else {
          setEmailSubjects(data.subjects);
        }
        setFeeds([]); // Clear regular feeds

        setHasMore(data.hasMore);
        setOffset(newOffset);
      } else if (isAllTypeWithSearch) {
        // Fetch both email subjects and other feeds when searching "all"
        // Fetch email subjects
        const emailParams = new URLSearchParams({
          limit: Math.ceil(limit / 2).toString(),
          offset: Math.floor(newOffset / 2).toString(),
        });
        if (filters.query) emailParams.set("q", filters.query);

        // Fetch other feeds (rss, news, daily-updates)
        const otherParams = new URLSearchParams({
          limit: limit.toString(),
          offset: Math.floor(newOffset / 2).toString(),
        });
        if (filters.query) otherParams.set("q", filters.query);
        // Don't set type so it searches all, we'll filter out emails on frontend

        const [emailResponse, otherResponse] = await Promise.all([
          fetch(`/api/email-feeds/subjects-search?${emailParams}`),
          fetch(`/api/feeds/search?${otherParams}`)
        ]);

        const emailData = await emailResponse.json();
        const otherData = await otherResponse.json();

        // Filter out email type from other feeds since we're handling them separately
        const nonEmailFeeds = otherData.feeds.filter((f: UnifiedFeed) => f.type !== 'email');

        if (append) {
          setEmailSubjects((prev) => [...prev, ...emailData.subjects]);
          setFeeds((prev) => [...prev, ...nonEmailFeeds]);
        } else {
          setEmailSubjects(emailData.subjects);
          setFeeds(nonEmailFeeds);
        }

        // Determine if there's more data
        const hasMoreData = emailData.hasMore || otherData.hasMore;
        setHasMore(hasMoreData);
        setOffset(newOffset);
      } else if (isSearchMode && (filters.query || filters.feedType !== "all" || filters.dateFrom || filters.dateTo)) {
        // Use search API for non-email types
        url = `/api/feeds/search`;
        if (filters.query) params.set("q", filters.query);
        if (filters.feedType !== "all") params.set("type", filters.feedType);
        if (filters.dateFrom) params.set("dateFrom", filters.dateFrom);
        if (filters.dateTo) params.set("dateTo", filters.dateTo);

        const response = await fetch(`${url}?${params}`);
        const data = await response.json();

        if (append) {
          setFeeds((prev) => [...prev, ...data.feeds]);
        } else {
          setFeeds(data.feeds);
        }
        setEmailSubjects([]); // Clear email subjects

        setHasMore(data.hasMore);
        setOffset(newOffset);
      } else {
        // Use regular feeds API - separate email subjects from other feeds
        const emailParams = new URLSearchParams({
          limit: Math.ceil(limit / 2).toString(),
          offset: Math.floor(newOffset / 2).toString(),
        });
        const otherParams = new URLSearchParams({
          limit: Math.ceil(limit / 2).toString(),
          offset: Math.floor(newOffset / 2).toString(),
        });
        otherParams.set("subscribedOnly", subscribedOnly.toString());

        const [emailResponse, feedsResponse] = await Promise.all([
          fetch(`/api/email-feeds/subjects-search?${emailParams}`),
          fetch(`/api/feeds?${otherParams}`)
        ]);

        const emailData = await emailResponse.json();
        const feedsData = await feedsResponse.json();

        if (append) {
          setEmailSubjects((prev) => [...prev, ...emailData.subjects]);
          setFeeds((prev) => [...prev, ...feedsData.feeds.filter((f: UnifiedFeed) => f.type !== 'email')]);
        } else {
          setEmailSubjects(emailData.subjects);
          setFeeds(feedsData.feeds.filter((f: UnifiedFeed) => f.type !== 'email'));
        }

        const hasMoreData = emailData.hasMore || feedsData.hasMore;
        setHasMore(hasMoreData);
        setOffset(newOffset);
      }
    } catch (error) {
      console.error("Error fetching feeds:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [subscribedOnly, isSearchMode, filters]);

  useEffect(() => {
    if (!isSearchMode) {
      fetchFeeds(0, false);
    }
  }, [subscribedOnly, isSearchMode, fetchFeeds]);

  const handleLoadMore = () => {
    fetchFeeds(offset + limit, true);
  };

  const toggleSubscribedOnly = () => {
    setSubscribedOnly((prev) => !prev);
    setOffset(0);
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setIsSearchMode(true);
    setOffset(0);

    // Immediately fetch with new filters
    const fetchSearch = async () => {
      try {
        setIsLoading(true);
        const params = new URLSearchParams({
          limit: limit.toString(),
          offset: "0",
        });

        const isEmailType = newFilters.feedType === "email";
        const isAllTypeWithSearch = newFilters.feedType === "all" && newFilters.query;

        if (isEmailType) {
          // Fetch email subjects only
          if (newFilters.query) params.set("q", newFilters.query);

          const response = await fetch(`/api/email-feeds/subjects-search?${params}`);
          const data = await response.json();

          setEmailSubjects(data.subjects);
          setFeeds([]);
          setHasMore(data.hasMore);
          setOffset(0);
        } else if (isAllTypeWithSearch) {
          // Fetch both email subjects and other feeds when searching "all"
          const emailParams = new URLSearchParams({
            limit: Math.ceil(limit / 2).toString(),
            offset: "0",
          });
          if (newFilters.query) emailParams.set("q", newFilters.query);

          const otherParams = new URLSearchParams({
            limit: limit.toString(),
            offset: "0",
          });
          if (newFilters.query) otherParams.set("q", newFilters.query);
          // Don't set type so it searches all, we'll filter out emails on frontend

          const [emailResponse, otherResponse] = await Promise.all([
            fetch(`/api/email-feeds/subjects-search?${emailParams}`),
            fetch(`/api/feeds/search?${otherParams}`)
          ]);

          const emailData = await emailResponse.json();
          const otherData = await otherResponse.json();

          // Filter out email type from other feeds since we're handling them separately
          const nonEmailFeeds = otherData.feeds.filter((f: UnifiedFeed) => f.type !== 'email');

          setEmailSubjects(emailData.subjects);
          setFeeds(nonEmailFeeds);

          const hasMoreData = emailData.hasMore || otherData.hasMore;
          setHasMore(hasMoreData);
          setOffset(0);
        } else {
          // Fetch regular feeds for specific non-email types
          if (newFilters.query) params.set("q", newFilters.query);
          if (newFilters.feedType !== "all") params.set("type", newFilters.feedType);
          if (newFilters.dateFrom) params.set("dateFrom", newFilters.dateFrom);
          if (newFilters.dateTo) params.set("dateTo", newFilters.dateTo);

          const response = await fetch(`/api/feeds/search?${params}`);
          const data = await response.json();

          setFeeds(data.feeds);
          setEmailSubjects([]);
          setHasMore(data.hasMore);
          setOffset(0);
        }
      } catch (error) {
        console.error("Error searching feeds:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearch();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
              {t(trans.explorePage.title)}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              {t(trans.explorePage.subtitle)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar with filters */}
        <aside className="w-80 shrink-0">
          <div className="sticky top-24 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-4 px-2">
              {t(trans.common.filters)}
            </h2>
            <FeedFilters onFilterChange={handleFilterChange} />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {isLoading && !isLoadingMore ? (
            <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-16 text-center">
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            </div>
          ) : (
            <>
              {emailSubjects.length > 0 && (
                <div className="space-y-6">
                  <EmailSubjectList subjects={emailSubjects} language={language} />
                </div>
              )}

              {feeds.length > 0 && (
                <FeedList
                  feeds={feeds}
                  isLoading={false}
                  hasMore={false}
                  onLoadMore={handleLoadMore}
                  isLoadingMore={false}
                  language={language}
                />
              )}

              {emailSubjects.length === 0 && feeds.length === 0 && !isLoading && (
                <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-16 text-center">
                  <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">{t(trans.explorePage.noFeeds)}</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-2">{t(trans.explorePage.noFeedsSubtext)}</p>
                </div>
              )}

              {hasMore && (emailSubjects.length > 0 || feeds.length > 0) && (
                <div className="flex justify-center pt-6">
                  <Button
                    onClick={handleLoadMore}
                    variant="outline"
                    disabled={isLoadingMore}
                    size="lg"
                    className="cursor-pointer transition-all hover:scale-105 shadow-md px-8"
                  >
                    {isLoadingMore ? t(trans.common.loading) : t(trans.common.loadMore)}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
