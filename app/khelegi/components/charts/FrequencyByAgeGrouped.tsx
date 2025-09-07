'use client';

import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js';
import { KhelegySurveyResponse } from '../../../models/khelegySurvey';
import ChartCard from '../ChartCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Props { surveys: KhelegySurveyResponse[] }

const FrequencyByAgeGrouped: React.FC<Props> = ({ surveys }) => {
  const themeEl = (typeof document !== 'undefined' && document.querySelector('.khelegi-theme') as HTMLElement) || document.documentElement;
  const css = getComputedStyle(themeEl);
  const primary = css.getPropertyValue('--primary-500').trim() || '#cc221c';
  const secondary = css.getPropertyValue('--secondary-400').trim() || '#f05d48';
  const peach = css.getPropertyValue('--neutral-50').trim() || '#fee6e0';
  const neutral400 = css.getPropertyValue('--neutral-500').trim() || '#2a2a2a';
  const neutral100 = css.getPropertyValue('--neutral-800').trim() || '#101010';

  const ageGroups = ['AgeGroup.8to12','AgeGroup.12to17','AgeGroup.18to27','AgeGroup.parent'];
  const ageLabels = ['8-12','12-17','18-27','Parent'];
  const toKey = (s: string) => s === 'SportsFrequency.daily' ? 'Daily' : s === 'SportsFrequency.weekly' ? 'Weekly' : s === 'SportsFrequency.monthly' ? 'Monthly/rarely' : 'None';

  const counts = {
    Daily: ageGroups.map(g => surveys.filter(s => s.ageGroup === g && toKey(s.sportsFrequency) === 'Daily').length),
    Weekly: ageGroups.map(g => surveys.filter(s => s.ageGroup === g && toKey(s.sportsFrequency) === 'Weekly').length),
    'Monthly/rarely': ageGroups.map(g => surveys.filter(s => s.ageGroup === g && toKey(s.sportsFrequency) === 'Monthly/rarely').length),
    None: ageGroups.map(g => surveys.filter(s => s.ageGroup === g && toKey(s.sportsFrequency) === 'None').length),
  };

  const data = {
    labels: ageLabels,
    datasets: [
      { label: 'Daily', data: counts.Daily, backgroundColor: primary },
      { label: 'Weekly', data: counts.Weekly, backgroundColor: secondary },
      { label: 'Monthly/rarely', data: counts['Monthly/rarely'], backgroundColor: peach },
      { label: 'None', data: counts.None, backgroundColor: '#9CA3AF' },
      { label: 'Never played', data: ageGroups.map(g => surveys.filter(s => s.ageGroup === g && s.sportsParticipationStatus === 'Never played').length), backgroundColor: '#9CA3AF' },
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true, ticks: { color: neutral400 }, grid: { display: false } },
      y: { stacked: true, beginAtZero: true, ticks: { color: neutral400 }, grid: { color: 'rgba(0,0,0,0.08)' }, title: { display: true, text: 'Students', color: neutral100 } },
    },
    plugins: { legend: { position: 'top' as const, labels: { color: neutral100 } } },
  };

  return (
    <ChartCard title="Frequency by Age (stacked)">
      <Bar data={data} options={options} />
    </ChartCard>
  );
};

export default FrequencyByAgeGrouped;


