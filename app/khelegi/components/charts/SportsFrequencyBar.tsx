'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { KhelegySurveyResponse } from '../../../models/khelegySurvey';
import ChartCard from '../ChartCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props { surveys: KhelegySurveyResponse[] }

const SportsFrequencyBar: React.FC<Props> = ({ surveys }) => {
  const themeEl = (typeof document !== 'undefined' && document.querySelector('.khelegi-theme') as HTMLElement) || document.documentElement;
  const css = getComputedStyle(themeEl);
  const primary = css.getPropertyValue('--primary-500').trim() || '#cc221c';
  // const neutral100 = css.getPropertyValue('--neutral-800').trim() || '#101010'; // Unused for now
  const neutral400 = css.getPropertyValue('--neutral-600').trim() || '#202020';

  const labels = ['Daily', 'Weekly', 'Monthly/rarely', 'None'];
  const mapToFriendly = (f: string) => {
    switch (f) {
      case 'SportsFrequency.daily': return 'Daily';
      case 'SportsFrequency.weekly': return 'Weekly';
      case 'SportsFrequency.monthly': return 'Monthly/rarely';
      case 'SportsFrequency.none': return 'None';
      default: return 'None';
    }
  };

  const countsMap: Record<string, number> = { 'Daily': 0, 'Weekly': 0, 'Monthly/rarely': 0, 'None': 0 };
  surveys.forEach(s => {
    countsMap[mapToFriendly(s.sportsFrequency)] = (countsMap[mapToFriendly(s.sportsFrequency)] ?? 0) + 1;
  });

  const data = { labels, datasets: [{ label: 'Students', data: labels.map(l => countsMap[l] || 0), backgroundColor: primary }] };
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, ticks: { color: neutral400 }, grid: { color: 'rgba(0,0,0,0.06)' } },
      x: { ticks: { color: neutral400 }, grid: { display: false } }
    },
    plugins: { legend: { display: false } },
  };

  return (
    <ChartCard title="Sports Frequency">
      <Bar data={{ ...data, datasets: [...data.datasets] }} options={{ ...options }} />
    </ChartCard>
  );
};

export default SportsFrequencyBar;


