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
  TooltipItem,
} from 'chart.js';
import { KhelegySurveyResponse } from '../../../models/khelegySurvey';
import ChartCard from '../ChartCard';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface ParticipationBySchoolTypeBarProps {
  surveys: KhelegySurveyResponse[];
}

const ParticipationBySchoolTypeBar: React.FC<ParticipationBySchoolTypeBarProps> = ({ surveys }) => {
  const themeEl = (typeof document !== 'undefined' && document.querySelector('.khelegi-theme') as HTMLElement) || document.documentElement;
  const css = getComputedStyle(themeEl);
  const primary = css.getPropertyValue('--primary-500').trim() || '#cc221c';
  const secondary = css.getPropertyValue('--secondary-400').trim() || '#f05d48';

  // Use actual school board values from the new service
  // const schoolBoards = ['State Board govt funded', 'State Board self funded', 'CBSE', 'ICSE', 'IB', 'IGCSE']; // Unused for now
  
  // Group by simplified categories for display
  const getCategory = (board: string) => {
    if (board === 'State Board govt funded') return 'Government';
    return 'Private';
  };
  
  const categories = ['Government', 'Private'];
  const activeCounts = categories.map(cat =>
    surveys.filter(s => getCategory(s.schoolType) === cat && s.sportsParticipationStatus === 'Active/Regular').length
  );
  const totals = categories.map(cat => surveys.filter(s => getCategory(s.schoolType) === cat).length);
  const labels = categories;
  const rates = activeCounts.map((a, i) => (totals[i] > 0 ? Math.round((a / totals[i]) * 100) : 0));

  const data = {
    labels,
    datasets: [
      {
        label: 'Participation Rate (%)',
        data: rates,
        backgroundColor: [primary, secondary],
        borderColor: 'rgba(0,0,0,0.06)',
        borderWidth: 1,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    ],
  };

  const neutral100 = getComputedStyle(document.documentElement).getPropertyValue('--neutral-800').trim() || '#101010';
  const neutral400 = getComputedStyle(document.documentElement).getPropertyValue('--neutral-500').trim() || '#2a2a2a';

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: { stepSize: 20, color: neutral400 },
        title: { display: true, text: 'Participation Rate (%)', color: neutral100 },
        grid: { color: 'rgba(0,0,0,0.08)' },
      },
      x: { grid: { display: false }, ticks: { color: neutral400 } },
    },
    plugins: {
      legend: { display: false, labels: { color: neutral100 } },
      tooltip: { callbacks: { label: (ctx: TooltipItem<"bar">) => `${ctx.parsed.y}%` } },
    },
    color: neutral100,
  };

  return (
    <ChartCard title="Participation by School Type">
      <Bar data={data} options={options} />
    </ChartCard>
  );
};

export default ParticipationBySchoolTypeBar;


