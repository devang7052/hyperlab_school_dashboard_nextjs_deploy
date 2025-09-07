'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { KhelegySurveyResponse } from '../../../models/khelegySurvey';
import ChartCard from '../ChartCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props { surveys: KhelegySurveyResponse[] }

const DiscontinuationYearHistogram: React.FC<Props> = () => {
  const themeEl = (typeof document !== 'undefined' && document.querySelector('.khelegi-theme') as HTMLElement) || document.documentElement;
  const css = getComputedStyle(themeEl);
  const primary = css.getPropertyValue('--primary-500').trim() || '#cc221c';
  const neutral400 = css.getPropertyValue('--neutral-500').trim() || '#2a2a2a';
  const neutral100 = css.getPropertyValue('--neutral-800').trim() || '#101010';

  // Since dropout year is no longer mapped in the service, show placeholder
  const years: number[] = [];

  const buckets: Record<string, number> = {};
  years.forEach(y => { const k = String(y); buckets[k] = (buckets[k] || 0) + 1; });
  const sorted = Object.entries(buckets).sort(([a],[b]) => Number(a) - Number(b));
  const labels = sorted.map(([k]) => k);
  const values = sorted.map(([,v]) => v);

  const data = { labels, datasets: [{ label: 'Dropouts', data: values, backgroundColor: primary }] };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { color: neutral400 }, grid: { color: 'rgba(0,0,0,0.08)' }, title: { display: true, text: 'Students', color: neutral100 } },
      x: { ticks: { color: neutral400 }, grid: { display: false }, title: { display: true, text: 'Year', color: neutral100 } },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <ChartCard title="Dropout Year (histogram)">
      {labels.length === 0 ? (
        <div className="h-full w-full flex items-center justify-center text-[var(--neutral-600)]">
          No dropout year data available
        </div>
      ) : (
        <Bar data={data} options={options} />
      )}
    </ChartCard>
  );
};

export default DiscontinuationYearHistogram;


