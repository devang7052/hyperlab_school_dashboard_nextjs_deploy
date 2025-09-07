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

const ParticipationByGradeBar: React.FC<Props> = ({ surveys }) => {
  const themeEl = (typeof document !== 'undefined' && document.querySelector('.khelegi-theme') as HTMLElement) || document.documentElement;
  const css = getComputedStyle(themeEl);
  const primary = css.getPropertyValue('--primary-500').trim() || '#cc221c';

  // Since classGradeLevel is removed from the new service, use age groups instead
  const ageGroups = ['AgeGroup.8to12', 'AgeGroup.12to17', 'AgeGroup.18to27'];
  const labels = ['8-12 years', '12-17 years', '18-27 years'];

  const activeCounts = ageGroups.map(g => surveys.filter(s => s.ageGroup === g && s.sportsParticipationStatus === 'Active/Regular').length);
  const totals = ageGroups.map(g => surveys.filter(s => s.ageGroup === g).length);
  const rates = activeCounts.map((a, i) => (totals[i] > 0 ? Math.round((a / totals[i]) * 100) : 0));

  const data = { labels, datasets: [{ label: 'Active Rate (%)', data: rates, backgroundColor: primary, borderWidth: 1 }] };
  const neutral100 = css.getPropertyValue('--neutral-800').trim() || '#101010';
  const neutral400 = css.getPropertyValue('--neutral-500').trim() || '#2a2a2a';
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, max: 100, ticks: { stepSize: 20, color: neutral400 }, title: { display: true, text: 'Participation Rate (%)', color: neutral100 }, grid: { color: 'rgba(0,0,0,0.08)' } },
      x: { ticks: { color: neutral400 }, grid: { display: false } },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <ChartCard title="Participation by Age Group">
      <Bar data={data} options={options} />
    </ChartCard>
  );
};

export default ParticipationByGradeBar;


