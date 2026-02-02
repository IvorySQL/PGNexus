"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Rss, Mail, Newspaper } from "lucide-react";

interface SourceListProps {
  type: "rss" | "email" | "news";
  sources: string[];
  subscribedSources: Set<string>;
  onToggle: (source: string) => void;
}

export function SourceList({ type, sources, subscribedSources, onToggle }: SourceListProps) {
  const getIcon = () => {
    switch (type) {
      case "rss":
        return <Rss className="h-5 w-5" />;
      case "email":
        return <Mail className="h-5 w-5" />;
      case "news":
        return <Newspaper className="h-5 w-5" />;
    }
  };

  const getTitle = () => {
    switch (type) {
      case "rss":
        return "RSS Feeds";
      case "email":
        return "Email Threads";
      case "news":
        return "News Sources";
    }
  };

  const getDescription = () => {
    switch (type) {
      case "rss":
        return "Subscribe to RSS feed authors";
      case "email":
        return "Subscribe to email threads";
      case "news":
        return "Subscribe to news sources";
    }
  };

  if (sources.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          {getIcon()}
          <div>
            <CardTitle>{getTitle()}</CardTitle>
            <CardDescription>{getDescription()}</CardDescription>
          </div>
          <Badge variant="secondary" className="ml-auto">
            {subscribedSources.size} / {sources.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sources.map((source) => {
            const isSubscribed = subscribedSources.has(source);
            return (
              <label
                key={source}
                className="flex items-center gap-2 p-3 rounded-md border cursor-pointer hover:bg-accent transition-colors"
              >
                <Checkbox
                  checked={isSubscribed}
                  onCheckedChange={() => onToggle(source)}
                />
                <span className="text-sm flex-1 truncate" title={source}>
                  {source}
                </span>
              </label>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
