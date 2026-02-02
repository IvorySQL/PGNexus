import { Rocket } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent mb-2">
          {title}
        </h1>
        {description && (
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            {description}
          </p>
        )}
      </div>

      {/* Coming Soon Message */}
      <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-16 text-center">
        <Rocket className="h-16 w-16 text-blue-600 dark:text-blue-400 mx-auto mb-6 animate-bounce" />
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
          Coming Soon
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          We&apos;re working hard to bring you this exciting new feature. Stay tuned for updates!
        </p>
      </div>
    </div>
  );
}
