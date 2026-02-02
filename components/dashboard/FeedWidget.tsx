import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Rss, Mail, Newspaper, ExternalLink } from "lucide-react";
import type { UnifiedFeed } from "@/lib/types/database";

interface FeedWidgetProps {
  feeds: UnifiedFeed[];
  title: string;
  type: "rss" | "email" | "news";
  viewAllLink?: string;
}

const typeConfig = {
  rss: {
    color: "orange",
    icon: Rss,
    borderClass: "border-l-orange-500",
    badgeClass: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  },
  email: {
    color: "blue",
    icon: Mail,
    borderClass: "border-l-blue-500",
    badgeClass: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  },
  news: {
    color: "purple",
    icon: Newspaper,
    borderClass: "border-l-purple-500",
    badgeClass: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  },
};

export function FeedWidget({ feeds, title, type, viewAllLink }: FeedWidgetProps) {
  const config = typeConfig[type];
  const Icon = config.icon;
  const linkHref = viewAllLink || `/feeds?type=${type}`;

  return (
    <div
      className={`backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg min-h-[400px] max-h-[500px] border-l-4 ${config.borderClass}`}
    >
      <div className="p-6 border-b border-slate-200/60 dark:border-slate-700/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${config.badgeClass}`}>
              <Icon className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {title}
            </h2>
          </div>
          <Link
            href={linkHref}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1"
          >
            View All
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[400px]">
        {feeds.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Icon className="h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-500 dark:text-slate-400">
              No {type} feeds available
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-200/60 dark:divide-slate-700/60">
            {feeds.map((feed) => (
              <li key={feed.id}>
                {feed.link ? (
                  feed.link.startsWith('/') ? (
                    <Link
                      href={feed.link}
                      className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <FeedItemContent feed={feed} config={config} />
                    </Link>
                  ) : (
                    <a
                      href={feed.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                    >
                      <FeedItemContent feed={feed} config={config} />
                    </a>
                  )
                ) : (
                  <div className="block p-4">
                    <FeedItemContent feed={feed} config={config} />
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function FeedItemContent({
  feed,
  config,
}: {
  feed: UnifiedFeed;
  config: typeof typeConfig[keyof typeof typeConfig];
}) {
  return (
    <>
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 line-clamp-1 mb-1">
        {feed.title}
      </h3>
      <div className="flex items-center gap-2 flex-wrap">
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${config.badgeClass}`}
        >
          {feed.source}
        </span>
        {feed.date && (
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {formatDistanceToNow(new Date(feed.date), { addSuffix: true })}
          </span>
        )}
      </div>
    </>
  );
}
