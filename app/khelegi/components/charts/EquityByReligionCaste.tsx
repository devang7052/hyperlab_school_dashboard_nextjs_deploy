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

const rateBy = (surveys: KhelegySurveyResponse[], key: keyof KhelegySurveyResponse, values: string[]) => {
  const totals = values.map(v => surveys.filter(s => (s[key] as unknown as string) === v).length);
  const active = values.map(v => surveys.filter(s => (s[key] as unknown as string) === v && s.sportsParticipationStatus === 'Active/Regular').length);
  return active.map((a, i) => (totals[i] > 0 ? Math.round((a / totals[i]) * 100) : 0));
};

const EquityByReligionCaste: React.FC<Props> = ({ surveys }) => {
  const themeEl = (typeof document !== 'undefined' && document.querySelector('.khelegi-theme') as HTMLElement) || document.documentElement;
  const css = getComputedStyle(themeEl);
  const primary = css.getPropertyValue('--primary-500').trim() || '#cc221c';
  const secondary = css.getPropertyValue('--secondary-400').trim() || '#f05d48';
  const neutral100 = css.getPropertyValue('--neutral-800').trim() || '#101010';
  const neutral400 = css.getPropertyValue('--neutral-500').trim() || '#2a2a2a';

  // Use actual religion values from the new service (raw values, not enum)
  const religionValues = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist'];
  const religionLabels = ['Hindu', 'Muslim', 'Christian', 'Sikh', 'Jain', 'Buddhist'];
  const religionRates = rateBy(surveys, 'religion', religionValues);

  // Use actual caste values from the new service (raw values, not enum)
  const casteValues = ['Scheduled Caste', 'Scheduled Tribe', 'General'];
  const casteLabels = ['SC', 'ST', 'General'];
  const casteRates = rateBy(surveys, 'casteCommunity', casteValues);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, max: 100, ticks: { stepSize: 20, color: neutral400 }, title: { display: true, text: 'Active Rate (%)', color: neutral100 }, grid: { color: 'rgba(0,0,0,0.08)' } },
      x: { ticks: { color: neutral400 }, grid: { display: false } },
    },
    plugins: { legend: { display: false } },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartCard title="Active Rate by Religion">
        <Bar data={{ labels: religionLabels, datasets: [{ label: 'Active Rate (%)', data: religionRates, backgroundColor: secondary }] }} options={options} />
      </ChartCard>
      <ChartCard title="Active Rate by Caste">
        <Bar data={{ labels: casteLabels, datasets: [{ label: 'Active Rate (%)', data: casteRates, backgroundColor: primary }] }} options={options} />
      </ChartCard>
    </div>
  );
};

export default EquityByReligionCaste;


