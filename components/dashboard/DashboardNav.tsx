"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, Search, ChevronDown, Languages } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";

export function DashboardNav() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [isPostgreSQLOpen, setIsPostgreSQLOpen] = useState(false);
  const [isKnowledgeOpen, setIsKnowledgeOpen] = useState(false);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [isLabOpen, setIsLabOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "zh" : "en");
  };

  const postgresqlItems = [
    {
      href: "/daily-updates",
      label: t(trans.nav.dailyUpdates),
    },
    {
      href: "/hacker-discussions",
      label: t(trans.nav.hackerDiscussions),
    },
    {
      href: "/tech-blogs",
      label: t(trans.nav.techBlogs),
    },
    {
      href: "/tech-news",
      label: t(trans.nav.industryNews),
    },
  ];

  const knowledgeItems = [
    {
      href: "/deep-dives",
      label: t(trans.nav.deepDives),
    },
    {
      href: "/postgresql-internals",
      label: t(trans.nav.postgresqlInternals),
    },
    {
      href: "/research-papers",
      label: t(trans.nav.researchPapers),
    },
    {
      href: "/conferences-talks",
      label: t(trans.nav.conferencesTalks),
    },
  ];

  const communityItems = [
    {
      href: "/hacker-profiles",
      label: t(trans.nav.hackerProfiles),
    },
    {
      href: "/events-meetups",
      label: t(trans.nav.eventsMeetups),
    },
    {
      href: "/institutions",
      label: t(trans.nav.institutions),
    },
    {
      href: "/hiring",
      label: t(trans.nav.hiring),
    },
  ];

  const labItems = [
    {
      href: "/sandboxes",
      label: t(trans.nav.sandboxes),
    },
    {
      href: "/case-studies",
      label: t(trans.nav.caseStudies),
    },
    {
      href: "/experiments",
      label: t(trans.nav.experiments),
    },
  ];

  const servicesItems = [
    {
      href: "/apis",
      label: t(trans.nav.apis),
    },
    {
      href: "/request-feature",
      label: t(trans.nav.requestFeature),
    },
    {
      href: "/collaborations",
      label: t(trans.nav.collaborations),
    },
  ];

  const isPostgreSQLActive = postgresqlItems.some(item => pathname === item.href);
  const isKnowledgeActive = knowledgeItems.some(item => pathname === item.href);
  const isCommunityActive = communityItems.some(item => pathname === item.href);
  const isLabActive = labItems.some(item => pathname === item.href);
  const isServicesActive = servicesItems.some(item => pathname === item.href);

  return (
    <nav className="sticky top-4 z-50 px-4">
      <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-700/50 rounded-2xl shadow-lg shadow-slate-200/50 dark:shadow-slate-900/50 py-4">
        <div className="container mx-auto max-w-7xl px-8">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-8">
              <Link href="/home" className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all whitespace-nowrap">
                PGNexus
              </Link>
              <div className="hidden lg:flex items-center gap-1">
                {/* Home Link */}
                <Link
                  href="/home"
                  className={`px-3 py-2 rounded-lg transition-all cursor-pointer text-sm font-medium whitespace-nowrap ${
                    pathname === "/home"
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                      : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                  }`}
                >
                  {t(trans.nav.home)}
                </Link>

                {/* PostgreSQL Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsPostgreSQLOpen(true)}
                  onMouseLeave={() => setIsPostgreSQLOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all cursor-pointer text-sm font-medium whitespace-nowrap ${
                      isPostgreSQLActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    {t(trans.nav.discover)}
                    <ChevronDown className={`h-4 w-4 transition-transform ${isPostgreSQLOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isPostgreSQLOpen && (
                    <div className="absolute top-full left-0 pt-2 min-w-[200px]">
                      <div className="backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border border-slate-200/60 dark:border-slate-700/60 rounded-lg shadow-lg py-2 z-50">
                      {postgresqlItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-2 text-sm font-medium transition-all ${
                              isActive
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                            }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Knowledge Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsKnowledgeOpen(true)}
                  onMouseLeave={() => setIsKnowledgeOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all cursor-pointer text-sm font-medium whitespace-nowrap ${
                      isKnowledgeActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    {t(trans.nav.knowledge)}
                    <ChevronDown className={`h-4 w-4 transition-transform ${isKnowledgeOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isKnowledgeOpen && (
                    <div className="absolute top-full left-0 pt-2 min-w-[220px]">
                      <div className="backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border border-slate-200/60 dark:border-slate-700/60 rounded-lg shadow-lg py-2 z-50">
                      {knowledgeItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-2 text-sm font-medium transition-all ${
                              isActive
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                            }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Community Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsCommunityOpen(true)}
                  onMouseLeave={() => setIsCommunityOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all cursor-pointer text-sm font-medium whitespace-nowrap ${
                      isCommunityActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    {t(trans.nav.community)}
                    <ChevronDown className={`h-4 w-4 transition-transform ${isCommunityOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isCommunityOpen && (
                    <div className="absolute top-full left-0 pt-2 min-w-[220px]">
                      <div className="backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border border-slate-200/60 dark:border-slate-700/60 rounded-lg shadow-lg py-2 z-50">
                      {communityItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-2 text-sm font-medium transition-all ${
                              isActive
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                            }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Lab Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsLabOpen(true)}
                  onMouseLeave={() => setIsLabOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all cursor-pointer text-sm font-medium whitespace-nowrap ${
                      isLabActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    {t(trans.nav.lab)}
                    <ChevronDown className={`h-4 w-4 transition-transform ${isLabOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isLabOpen && (
                    <div className="absolute top-full left-0 pt-2 min-w-[180px]">
                      <div className="backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border border-slate-200/60 dark:border-slate-700/60 rounded-lg shadow-lg py-2 z-50">
                      {labItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-2 text-sm font-medium transition-all ${
                              isActive
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                            }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Services Dropdown */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsServicesOpen(true)}
                  onMouseLeave={() => setIsServicesOpen(false)}
                >
                  <button
                    className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-all cursor-pointer text-sm font-medium whitespace-nowrap ${
                      isServicesActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                    }`}
                  >
                    {t(trans.nav.services)}
                    <ChevronDown className={`h-4 w-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {isServicesOpen && (
                    <div className="absolute top-full left-0 pt-2 min-w-[200px]">
                      <div className="backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border border-slate-200/60 dark:border-slate-700/60 rounded-lg shadow-lg py-2 z-50">
                      {servicesItems.map((item) => {
                        const isActive = pathname === item.href;

                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-2 text-sm font-medium transition-all ${
                              isActive
                                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                            }`}
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {/* Explore Link - Right aligned */}
              <Link
                href="/feeds"
                className={`hidden lg:flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer text-sm font-medium whitespace-nowrap ${
                  pathname === "/feeds"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                }`}
              >
                <Search className="h-4 w-4" />
                <span>{t(trans.nav.explore)}</span>
              </Link>

              {/* Language Selector */}
              <Button
                onClick={toggleLanguage}
                variant="outline"
                size="sm"
                className="cursor-pointer transition-all hover:scale-105 shadow-md gap-2 whitespace-nowrap"
              >
                <Languages className="h-4 w-4" />
                <span>{language === "en" ? "EN" : "中文"}</span>
              </Button>

              {session?.user ? (
                <>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 px-3 py-1.5 bg-slate-100/80 dark:bg-slate-800/80 rounded-lg">
                    {session.user.name || session.user.email}
                  </span>
                  <Button
                    onClick={handleSignOut}
                    variant="ghost"
                    size="sm"
                    className="gap-2 cursor-pointer hover:bg-red-50 dark:hover:bg-red-950/50 hover:text-red-600 dark:hover:text-red-400 transition-all"
                  >
                    <LogOut className="h-4 w-4" />
                    {t(trans.auth.signOut)}
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                    >
                      {t(trans.auth.signIn)}
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button
                      size="sm"
                      className="cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white transition-all"
                    >
                      {t(trans.auth.signUp)}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
