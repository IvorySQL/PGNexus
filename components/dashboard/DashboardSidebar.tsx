"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, Settings, MessageSquare, Newspaper, BookOpen, FileText } from "lucide-react";

export function DashboardSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/daily-updates",
      label: "Daily Updates",
      icon: Newspaper,
    },
    {
      href: "/hacker-discussions",
      label: "Hacker Discussions",
      icon: MessageSquare,
    },
    {
      href: "/tech-blogs",
      label: "Tech Blogs",
      icon: BookOpen,
    },
    {
      href: "/tech-news",
      label: "Tech News",
      icon: FileText,
    },
    {
      href: "/feeds",
      label: "Explore",
      icon: List,
    },
    {
      href: "/manage-subscription",
      label: "Manage Subscription",
      icon: Settings,
    },
  ];

  return (
    <nav className="sticky top-24 h-fit backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-4">
      <ul className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/80"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
