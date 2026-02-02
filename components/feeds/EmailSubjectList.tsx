"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Loader2, ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface EmailSubject {
  subject: string;
  jobid: number;
  lastactivity: string;
}

interface EmailEntry {
  jobid: number;
  threadid: string;
  subject: string;
  participants: string;
  messages: string;
  summary: string;
  summary_zh: string;
  lastactivity: string;
}

interface EmailSubjectListProps {
  subjects: EmailSubject[];
  language: "en" | "zh";
}

export function EmailSubjectList({ subjects, language }: EmailSubjectListProps) {
  const [expandedSubject, setExpandedSubject] = useState<string | null>(null);
  const [subjectEntries, setSubjectEntries] = useState<Record<string, EmailEntry[]>>({});
  const [subjectEntriesTotal, setSubjectEntriesTotal] = useState<Record<string, number>>({});
  const [subjectEntriesOffset, setSubjectEntriesOffset] = useState<Record<string, number>>({});
  const [isLoadingSubjectEntries, setIsLoadingSubjectEntries] = useState<Record<string, boolean>>({});

  const entriesLimit = 5;

  const fetchSubjectEntries = async (subject: string, entriesOffset: number, append: boolean) => {
    try {
      setIsLoadingSubjectEntries((prev) => ({ ...prev, [subject]: true }));

      const response = await fetch(
        `/api/email-feeds/by-subject?subject=${encodeURIComponent(subject)}&limit=${entriesLimit}&offset=${entriesOffset}`
      );
      const data = await response.json();

      if (append) {
        setSubjectEntries((prev) => ({
          ...prev,
          [subject]: [...(prev[subject] || []), ...data.entries],
        }));
      } else {
        setSubjectEntries((prev) => ({
          ...prev,
          [subject]: data.entries,
        }));
      }

      setSubjectEntriesTotal((prev) => ({
        ...prev,
        [subject]: data.total,
      }));

      setSubjectEntriesOffset((prev) => ({
        ...prev,
        [subject]: entriesOffset,
      }));
    } catch (error) {
      console.error("Error fetching subject entries:", error);
    } finally {
      setIsLoadingSubjectEntries((prev) => ({ ...prev, [subject]: false }));
    }
  };

  const toggleSubject = async (subject: string) => {
    if (expandedSubject === subject) {
      setExpandedSubject(null);
    } else {
      setExpandedSubject(subject);
      if (!subjectEntries[subject]) {
        await fetchSubjectEntries(subject, 0, false);
      }
    }
  };

  const loadMoreEntries = async (subject: string) => {
    const currentOffset = subjectEntriesOffset[subject] || 0;
    await fetchSubjectEntries(subject, currentOffset + entriesLimit, true);
  };

  if (subjects.length === 0) {
    return (
      <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-16 text-center">
        <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">No email discussions found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {subjects.map((subject) => (
        <div
          key={subject.subject}
          className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg border-l-4 border-l-blue-500 overflow-hidden"
        >
          <button
            onClick={() => toggleSubject(subject.subject)}
            className="w-full p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer text-left"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="flex items-center gap-1.5 font-medium px-2.5 py-1 bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 border-blue-200 dark:border-blue-800">
                  <Mail className="h-4 w-4" />
                  EMAIL
                </Badge>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                {subject.subject}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Last activity: {formatDistanceToNow(new Date(subject.lastactivity), { addSuffix: true })}
              </p>
            </div>
            <div className="ml-4 flex items-center gap-2">
              {expandedSubject === subject.subject ? (
                <ChevronDown className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              ) : (
                <ChevronRight className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              )}
            </div>
          </button>

          {expandedSubject === subject.subject && (
            <div className="border-t border-slate-200/60 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-800/30">
              {isLoadingSubjectEntries[subject.subject] && !subjectEntries[subject.subject] ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                </div>
              ) : (
                <div className="space-y-4 p-6">
                  {subjectEntries[subject.subject]?.map((entry) => {
                    let messageUrl: string | undefined = undefined;
                    let participants: string[] = [];

                    if (entry.messages) {
                      try {
                        const messages = JSON.parse(entry.messages);
                        if (Array.isArray(messages) && messages.length > 0 && messages[0].messageId) {
                          messageUrl = `https://www.postgresql.org/message-id/${messages[0].messageId}`;
                        }
                      } catch (e) {}
                    }

                    if (entry.participants) {
                      try {
                        const parsed = JSON.parse(entry.participants);
                        if (Array.isArray(parsed)) {
                          participants = parsed;
                        }
                      } catch (e) {}
                    }

                    return (
                      <div
                        key={entry.jobid}
                        className="bg-white dark:bg-slate-900 rounded-xl p-5 shadow-md border border-slate-200/60 dark:border-slate-700/60"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="text-sm text-slate-500 dark:text-slate-400">
                            {formatDistanceToNow(new Date(entry.lastactivity), { addSuffix: true })}
                          </div>
                          {messageUrl && (
                            <a
                              href={messageUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors flex items-center gap-1 text-sm font-medium"
                            >
                              View Thread
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>

                        {language === "en" && entry.summary && (
                          <div className="space-y-2 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border border-blue-100 dark:border-blue-900/50 mb-3">
                            <h4 className="text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                              Summary
                            </h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {entry.summary}
                            </p>
                          </div>
                        )}

                        {language === "zh" && entry.summary_zh && (
                          <div className="space-y-2 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border border-purple-100 dark:border-purple-900/50 mb-3">
                            <h4 className="text-xs font-bold text-purple-700 dark:text-purple-400 uppercase tracking-wide">
                              摘要
                            </h4>
                            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {entry.summary_zh}
                            </p>
                          </div>
                        )}

                        {participants.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                            <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wide mb-2">
                              Participants
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {participants.map((participant, idx) => (
                                <span
                                  key={idx}
                                  className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-md"
                                >
                                  {participant}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {subjectEntriesTotal[subject.subject] > (subjectEntries[subject.subject]?.length || 0) && (
                    <div className="flex justify-center pt-4">
                      <Button
                        onClick={() => loadMoreEntries(subject.subject)}
                        disabled={isLoadingSubjectEntries[subject.subject]}
                        variant="outline"
                        className="cursor-pointer"
                      >
                        {isLoadingSubjectEntries[subject.subject] ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Loading...
                          </>
                        ) : (
                          `Load More (${subjectEntriesTotal[subject.subject] - (subjectEntries[subject.subject]?.length || 0)} remaining)`
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
