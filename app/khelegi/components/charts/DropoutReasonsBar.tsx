'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { KhelegySurveyResponse } from '../../../models/khelegySurvey';
import ChartCard from '../ChartCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props { surveys: KhelegySurveyResponse[] }

const DropoutReasonsBar: React.FC<Props> = ({ surveys }) => {
  const themeEl = (typeof document !== 'undefined' && document.querySelector('.khelegi-theme') as HTMLElement) || document.documentElement;
  const css = getComputedStyle(themeEl);
  const primary = css.getPropertyValue('--primary-500').trim() || '#cc221c';
  const neutral400 = css.getPropertyValue('--neutral-500').trim() || '#2a2a2a';
  // const neutral100 = css.getPropertyValue('--neutral-800').trim() || '#101010'; // Unused for now

  // Since dropout reasons are no longer mapped in the service, show placeholder
  const dropoutOnly = surveys.filter(s => s.sportsParticipationStatus === 'Dropout');
  const counts: Record<string, number> = {
    'No data available': dropoutOnly.length || 1
  };

  const top = Object.entries(counts)
    .sort((a,b) => b[1] - a[1])
    .slice(0, 8);
  const labels = top.map(([k]) => k.replace(/\b\w/g, c => c.toUpperCase()));
  const dataVals = top.map(([,v]) => v);

  const data = { labels, datasets: [{ label: 'Students (dropout)', data: dataVals, backgroundColor: primary }] };
  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { beginAtZero: true, ticks: { color: neutral400 }, grid: { color: 'rgba(0,0,0,0.08)' } },
      y: { ticks: { color: neutral400 }, grid: { display: false } },
    },
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
  };

  return (
    <ChartCard title="Top Reasons for Dropout (girls)">
      <Bar data={data} options={options} />
    </ChartCard>
  );
};

export default DropoutReasonsBar;


