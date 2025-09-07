import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { KhelegySurveyResponse } from '../../models/khelegySurvey';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface SurveyChartProps {
  metricName: string;
  surveys: KhelegySurveyResponse[];
  selectedFilter: 'all' | 'government' | 'private';
}

const SurveyChart: React.FC<SurveyChartProps> = ({ metricName, surveys, selectedFilter }) => {
  const [brick, setBrick] = React.useState('#cc221c');
  const [coral, setCoral] = React.useState('#f05d48');
  const [peach, setPeach] = React.useState('#fee6e0');

  React.useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    setBrick(rootStyles.getPropertyValue('--primary-500').trim() || '#cc221c');
    setCoral(rootStyles.getPropertyValue('--secondary-400').trim() || '#f05d48');
    setPeach(rootStyles.getPropertyValue('--neutral-50').trim() || '#fee6e0');
  }, []);

  const getFilteredSurveys = () => {
    switch (selectedFilter) {
      case 'government':
        return surveys.filter(s => s.schoolType === 'State Board govt funded');
      case 'private':
        return surveys.filter(s => s.schoolType === 'State Board self funded' || s.schoolType === 'ICSE' || s.schoolType === 'CBSE' || s.schoolType === 'IB' || s.schoolType === 'IGCSE');
      default:
        return surveys;
    }
  };

  const createChartData = () => {
    const filteredSurveys = getFilteredSurveys();
    
    if (metricName === 'Sports Participation') {
      const participation = {
        'Active': filteredSurveys.filter(s => s.sportsParticipationStatus === 'Active/Regular').length,
        'Irregular': filteredSurveys.filter(s => s.sportsParticipationStatus === 'Active/Irregular').length,
        'Dropout': filteredSurveys.filter(s => s.sportsParticipationStatus === 'Dropout').length,
        'Returnee': filteredSurveys.filter(s => s.sportsParticipationStatus === 'Returnee').length,
      };

      return {
        labels: Object.keys(participation),
        datasets: [
          {
            label: 'Count',
            data: Object.values(participation),
            backgroundColor: [brick, coral, brick, peach],
            borderColor: [brick, coral, brick, peach],
            borderWidth: 1,
            barPercentage: 0.6,
            categoryPercentage: 0.8,
          },
        ],
      };
    }

    if (metricName === 'Age Distribution') {
      const ageGroups = {
        '8-12': filteredSurveys.filter(s => s.ageGroup === 'AgeGroup.8to12').length,
        '12-17': filteredSurveys.filter(s => s.ageGroup === 'AgeGroup.12to17').length,
        '18-27': filteredSurveys.filter(s => s.ageGroup === 'AgeGroup.18to27').length,
        'Parent': filteredSurveys.filter(s => s.ageGroup === 'AgeGroup.parent').length,
      };

      return {
        labels: Object.keys(ageGroups),
        datasets: [
          {
            label: 'Count',
            data: Object.values(ageGroups),
            backgroundColor: brick,
            borderColor: brick,
            borderWidth: 1,
            barPercentage: 0.6,
            categoryPercentage: 0.8,
          },
        ],
      };
    }

    if (metricName === 'Performance Indices') {
      // Performance indices are not available in current data model
      return {
        labels: ['No data'],
        datasets: [
          {
            label: 'Performance data not available',
            data: [0],
            backgroundColor: '#9CA3AF',
            borderColor: '#9CA3AF',
            borderWidth: 1,
          },
        ],
      };
    }

    // Default case
    return {
      labels: [],
      datasets: [],
    };
  };

  const getYAxisMax = () => {
    const data = createChartData();
    if (!data.datasets || data.datasets.length === 0) return 10;
    
    let maxValue = 0;
    data.datasets.forEach(dataset => {
      const dataMax = Math.max(...(dataset.data as number[]));
      maxValue = Math.max(maxValue, dataMax);
    });
    
    const padding = maxValue * 0.1;
    const maxWithPadding = maxValue + padding;
    
    if (maxWithPadding <= 10) return 10;
    if (maxWithPadding <= 20) return 20;
    if (maxWithPadding <= 50) return Math.ceil(maxWithPadding / 10) * 10;
    return Math.ceil(maxWithPadding / 20) * 20;
  };

  const getYAxisStepSize = (maxValue: number) => {
    if (maxValue <= 10) return 1;
    if (maxValue <= 20) return 2;
    if (maxValue <= 50) return 5;
    return 10;
  };

  const chartOptions = () => {
    const yAxisMax = getYAxisMax();
    const stepSize = getYAxisStepSize(yAxisMax);
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: metricName === 'Performance Indices',
          title: {
            display: true,
            text: getXAxisLabel(),
            font: {
              size: 14,
              weight: 'bold' as const,
            },
          },
          grid: {
            display: false,
          },
          ticks: {
            font: {
              size: 12,
            },
          },
        },
        y: {
          stacked: metricName === 'Performance Indices',
          beginAtZero: true,
          max: yAxisMax,
          title: {
            display: true,
            text: 'Count',
            font: {
              size: 14,
              weight: 'bold' as const,
            },
          },
          grid: {
            color: 'rgba(0, 0, 0, 0.1)',
          },
          border: {
            display: false,
          },
          ticks: {
            stepSize: stepSize,
            font: {
              size: 12,
            },
          },
        },
      },
      plugins: {
        legend: {
          display: metricName === 'Performance Indices',
          position: 'top' as const,
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
        },
      },
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
    };
  };

  const getXAxisLabel = () => {
    switch (metricName) {
      case 'Sports Participation':
        return 'Status';
      case 'Age Distribution':
        return 'Age Groups';
      case 'Performance Indices':
        return 'Quartiles';
      default:
        return 'Category';
    }
  };

  const chartData = createChartData();
  const options = chartOptions();
  
  return (
    <div className="bg-[var(--neutral-20)] rounded-xl px-9 py-4 min-w-[400px] flex-shrink-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-['Made_Outer_Sans_Regular'] text-[var(--neutral-600)] text-left mt-0">
          {metricName.toUpperCase()}
        </h3>
        {metricName !== 'Performance Indices' && (
          <div className="flex items-center">
            <span className="text-sm text-[var(--primary-400)] font-['Manrope'] font-semibold mr-2">
              {selectedFilter === 'all' ? 'All Schools' : selectedFilter === 'government' ? 'Government' : 'Private'}
            </span>
            <span className="w-4 h-0.5 bg-[var(--primary-400)] mr-2"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary-400)] -ml-2"></span>
            <span className="w-4 h-0.5 bg-[var(--primary-400)]"></span>
          </div>
        )}
        {metricName === 'Performance Indices' && (
          <div className="flex flex-col space-y-2">
            <div className="flex items-center">
              <span className="text-sm text-[var(--primary-400)] font-['Manrope'] font-semibold mr-2 ml-7">PLI</span>
              <span className="w-4 h-0.5 bg-[var(--primary-400)] mr-2"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary-400)] -ml-2"></span>
              <span className="w-4 h-0.5 bg-[var(--primary-400)]"></span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-[var(--secondary-400)] font-['Manrope'] font-semibold mr-2 ml-7">CPI</span>
              <span className="w-4 h-0.5 bg-[var(--secondary-400)] mr-2"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-[var(--secondary-400)] -ml-2"></span>
              <span className="w-4 h-0.5 bg-[var(--secondary-400)]"></span>
            </div>
          </div>
        )}
      </div>
      <div className="h-[320px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default SurveyChart;
