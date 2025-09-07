'use client';

import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, TooltipItem } from 'chart.js';
import { KhelegySurveyResponse } from '../../../models/khelegySurvey';
import ChartCard from '../ChartCard';

ChartJS.register(ArcElement, Tooltip, Legend);

interface Props { surveys: KhelegySurveyResponse[] }

const OverallParticipationDonut: React.FC<Props> = ({ surveys }) => {
  const themeEl = (typeof document !== 'undefined' && document.querySelector('.khelegi-theme') as HTMLElement) || document.documentElement;
  const css = getComputedStyle(themeEl);
  const colors = [
    css.getPropertyValue('--primary-500').trim() || '#cc221c', // Active
    css.getPropertyValue('--secondary-400').trim() || '#f05d48', // Irregular
    css.getPropertyValue('--neutral-50').trim() || '#fee6e0', // Returnee
    css.getPropertyValue('--primary-400').trim() || '#e02a23', // Dropout (variant)
    '#9CA3AF', // Never played (gray)
  ];
  const neutral100 = css.getPropertyValue('--neutral-800').trim() || '#101010';

  const statuses = ['Active/Regular','Active/Irregular','Returnee','Dropout','Never played'];
  const labels = ['Active','Irregular','Returnee','Dropout','Never played'];
  const counts = statuses.map(st => surveys.filter(s => s.sportsParticipationStatus === st).length);

  const total = counts.reduce((a,b)=>a+b,0) || 1;
  const data = {
    labels,
    datasets: [{ data: counts, backgroundColor: colors, borderColor: 'rgba(0,0,0,0.06)', borderWidth: 1 }],
  };
  const options = { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'right' as const, labels: { color: neutral100 } }, tooltip: { callbacks: { label: (ctx: TooltipItem<"doughnut">) => `${ctx.label}: ${ctx.parsed} (${Math.round((ctx.parsed/total)*100)}%)` } } }, cutout: '55%' };

  return (
    <ChartCard title="Overall Participation Status">
      <Doughnut data={data} options={options} />
    </ChartCard>
  );
};

export default OverallParticipationDonut;


