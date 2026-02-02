"use client";

import { useLanguage } from "@/components/providers/LanguageProvider";
import { translations as trans } from "@/lib/translations";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export function WeeklyEmailChart() {
  const { t, language } = useLanguage();

  // Sample data for weekly email activity (last 7 days)
  const labels = language === "en"
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

  const data = {
    labels,
    datasets: [
      {
        label: t(trans.homePage.emailsLabel),
        data: [45, 52, 38, 65, 48, 28, 66],
        borderColor: 'rgb(59, 130, 246)', // blue-500
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgb(59, 130, 246)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: 'rgb(59, 130, 246)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
      },
      {
        label: t(trans.homePage.patchesLabel),
        data: [3, 5, 4, 7, 5, 3, 6],
        borderColor: 'rgb(168, 85, 247)', // purple-500
        backgroundColor: 'rgba(168, 85, 247, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 6,
        pointHoverRadius: 8,
        pointBackgroundColor: 'rgb(168, 85, 247)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointHoverBackgroundColor: 'rgb(168, 85, 247)',
        pointHoverBorderColor: '#fff',
        pointHoverBorderWidth: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top' as const,
        labels: {
          usePointStyle: true,
          padding: 15,
          font: {
            size: 13,
            weight: 'bold' as const,
          },
          color: 'rgb(100, 116, 139)', // slate-500
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(148, 163, 184, 0.1)', // slate-400 with opacity
          drawBorder: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: 'rgb(100, 116, 139)', // slate-500
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
          },
          color: 'rgb(100, 116, 139)', // slate-500
        },
      },
    },
  };

  return (
    <div className="backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
        {t(trans.homePage.weeklyEmailActivity)}
      </h3>
      <div className="h-[280px]">
        <Line data={data} options={options} />
      </div>
    </div>
  );
}
