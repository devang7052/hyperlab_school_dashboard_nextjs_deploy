'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  TooltipItem
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { KhelegySurveyResponse } from '../../../models/khelegySurvey';
import ChartCard from '../ChartCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface ParticipationByAgePieProps {
  surveys: KhelegySurveyResponse[];
}

const ParticipationByAgePie: React.FC<ParticipationByAgePieProps> = ({ surveys }) => {
  const [brick, setBrick] = React.useState('#cc221c');
  const [coral, setCoral] = React.useState('#f05d48');
  const [peach, setPeach] = React.useState('#fee6e0');
  const [grey, setGrey] = React.useState('#9CA3AF');

  React.useEffect(() => {
    const themeEl = (typeof document !== 'undefined' && document.querySelector('.khelegi-theme') as HTMLElement) || document.documentElement;
    const css = getComputedStyle(themeEl);
    setBrick(css.getPropertyValue('--primary-500').trim() || '#cc221c');
    setCoral(css.getPropertyValue('--secondary-400').trim() || '#f05d48');
    setPeach(css.getPropertyValue('--neutral-50').trim() || '#fee6e0');
    setGrey(css.getPropertyValue('--neutral-400').trim() || '#9CA3AF');
  }, []);

  const ageGroups = ['AgeGroup.8to12', 'AgeGroup.12to17', 'AgeGroup.18to27', 'AgeGroup.parent'];
  const ageLabels = ['8-12', '12-17', '18-27', 'Parent'];

  const activeCounts = ageGroups.map(group =>
    surveys.filter(s => s.ageGroup === group && s.sportsParticipationStatus === 'Active/Regular').length
  );
  const irregularCounts = ageGroups.map(group =>
    surveys.filter(s => s.ageGroup === group && s.sportsParticipationStatus === 'Active/Irregular').length
  );
  const returneeCounts = ageGroups.map(group =>
    surveys.filter(s => s.ageGroup === group && s.sportsParticipationStatus === 'Returnee').length
  );
  const dropoutCounts = ageGroups.map(group =>
    surveys.filter(s => s.ageGroup === group && s.sportsParticipationStatus === 'Dropout').length
  );
  const neverPlayedCounts = ageGroups.map(group =>
    surveys.filter(s => s.ageGroup === group && s.sportsParticipationStatus === 'Never played').length
  );
  const totals = ageGroups.map(group => surveys.filter(s => s.ageGroup === group).length);
  const pct = (n: number, d: number) => (d > 0 ? Math.round((n / d) * 100) : 0);
  const data = {
    labels: ageLabels,
    datasets: [
      { label: 'Active', data: activeCounts.map((n, i) => pct(n, totals[i])), backgroundColor: brick },
      { label: 'Irregular', data: irregularCounts.map((n, i) => pct(n, totals[i])), backgroundColor: coral },
      { label: 'Returnee', data: returneeCounts.map((n, i) => pct(n, totals[i])), backgroundColor: peach },
      { label: 'Dropout', data: dropoutCounts.map((n, i) => pct(n, totals[i])), backgroundColor: brick },
      { label: 'Never played', data: neverPlayedCounts.map((n, i) => pct(n, totals[i])), backgroundColor: grey },
    ],
  };

  const themeEl = (typeof document !== 'undefined' && document.querySelector('.khelegi-theme') as HTMLElement) || document.documentElement;
  const neutral100 = getComputedStyle(themeEl).getPropertyValue('--neutral-800').trim() || '#101010';
  const neutral400 = getComputedStyle(themeEl).getPropertyValue('--neutral-500').trim() || '#2a2a2a';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true, ticks: { color: neutral400 }, grid: { display: false } },
      y: { stacked: true, max: 100, beginAtZero: true, ticks: { stepSize: 20, color: neutral400 }, grid: { color: 'rgba(0,0,0,0.08)' } },
    },
    plugins: {
      legend: { position: 'top' as const, labels: { color: neutral100 } },
      tooltip: { callbacks: { label: (ctx: TooltipItem<"bar">) => `${ctx.dataset.label}: ${ctx.parsed.y}%` } },
    },
    color: neutral100,
  };

  return (
    <ChartCard title="Participation by Age Group (100%)">
      <Bar data={data} options={options} />
    </ChartCard>
  );
};

export default ParticipationByAgePie;


