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
  TooltipItem,
} from 'chart.js';



import { ClassStats } from '@/app/models/helpers/homeTypes';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TestChartProps {
  testName: string;
  testData: { [className: string]: ClassStats };
  selectedFilter: 'all' | 'male' | 'female';
}

const TestChart: React.FC<TestChartProps> = ({ testName, testData, selectedFilter }) => {
  const [primaryColor, setPrimaryColor] = React.useState('#EC4D86'); // Default or fallback
  const [secondaryColor, setSecondaryColor] = React.useState('#7474DC'); // Default or fallback

  React.useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    setPrimaryColor(rootStyles.getPropertyValue('--primary-400').trim());
    setSecondaryColor(rootStyles.getPropertyValue('--secondary-400').trim());
  }, []);

  const getScoreData = (classStats: ClassStats) => {
    switch (selectedFilter) {
      case 'male':
        return {
          avgScore: classStats.class_male_avg_score,
          maxScore: classStats.class_male_max_score,
        };
      case 'female':
        return {
          avgScore: classStats.class_female_avg_score,
          maxScore: classStats.class_female_max_score,
        };
      default:
        return {
          avgScore: classStats.class_total_avg_score,
          maxScore: classStats.class_total_max_score,
        };
    }
  };

  const createChartData = (data: { [className: string]: ClassStats }) => {
    const classes = Object.keys(data).sort((a, b) => parseInt(a) - parseInt(b));
    const avgScores: number[] = [];
    const maxDifferences: number[] = [];

    classes.forEach(className => {
      const { avgScore, maxScore } = getScoreData(data[className]);
      avgScores.push(avgScore);
      maxDifferences.push(Math.max(0, maxScore - avgScore));
    });

    return {
      labels: classes,
      datasets: [
        {
          label: 'Average',
          data: avgScores,
          backgroundColor: secondaryColor,
          borderColor: secondaryColor,
          borderWidth: 1,
          barPercentage: 0.25,
          categoryPercentage: 1.0,
        },
        {
          label: 'Best',
          data: maxDifferences,
          backgroundColor: primaryColor,
          borderColor: primaryColor,
          borderWidth: 1,
          barPercentage: 0.25,
          categoryPercentage: 1.0,
        },
      ],
    };
  };

  const getYAxisMax = (data: { [className: string]: ClassStats }) => {
    let maxValue = 0;
    Object.values(data).forEach(classStats => {
      const { maxScore } = getScoreData(classStats);
      maxValue = Math.max(maxValue, maxScore);
    });
    
    const padding = maxValue * 0.1;
    const maxWithPadding = maxValue + padding;
    
    if (maxWithPadding <= 10) return 10;
    if (maxWithPadding <= 20) return 20;
    if (maxWithPadding <= 30) return 30;
    if (maxWithPadding <= 50) return 50;
    if (maxWithPadding <= 100) return Math.ceil(maxWithPadding / 10) * 10;
    return Math.ceil(maxWithPadding / 20) * 20;
  };

  const getYAxisStepSize = (maxValue: number) => {
    if (maxValue <= 10) return 1;
    if (maxValue <= 20) return 2;
    if (maxValue <= 30) return 3;
    if (maxValue <= 50) return 5;
    if (maxValue <= 100) return 10;
    return 20;
  };

  const chartOptions = (data: { [className: string]: ClassStats }) => {
    const yAxisMax = getYAxisMax(data);
    const stepSize = getYAxisStepSize(yAxisMax);
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          title: {
            display: true,
            text: 'Class',
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
          stacked: true,
          beginAtZero: true,
          max: yAxisMax,
          title: {
            display: true,
            text: 'Score',
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
          display: false,
        },
        tooltip: {
          mode: 'index' as const,
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: 'white',
          bodyColor: 'white',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          borderWidth: 1,
          callbacks: {
            label: function(context: TooltipItem<"bar">) {
              const datasetLabel = context.dataset.label;
              const classIndex = context.dataIndex;
              const classes = Object.keys(data).sort((a, b) => parseInt(a) - parseInt(b));
              const className = classes[classIndex];
              const { avgScore, maxScore } = getScoreData(data[className]);
              
              if (datasetLabel === 'Average') {
                return `Average: ${avgScore}`;
              } else if (datasetLabel === 'Best') {
                return `Best: ${maxScore}`;
              }
              return '';
            }
          }
        },
      },
      interaction: {
        mode: 'index' as const,
        intersect: false,
      },
    };
  };

  const chartData = createChartData(testData);
  const options = chartOptions(testData);
  
  return (
    <div className="bg-[var(--neutral-20)] rounded-xl px-9 py-4  min-w-[400px]  flex-shrink-0">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-['Made_Outer_Sans_Regular'] text-[var(--neutral-600)] text-left mt-0">
          {testName.toUpperCase()}
        </h3>
        <div className="flex flex-col space-y-2">
        <div className="flex items-center">
            <span className="text-sm text-[var(--primary-400)] font-['Manrope'] font-semibold mr-2 ml-7 ">Best</span>
            <span className="w-4 h-0.5 bg-[var(--primary-400)] mr-2"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--primary-400)] -ml-2 "></span>
            <span className="w-4 h-0.5 bg-[var(--primary-400)] "></span>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-[var(--secondary-400)] font-['Manrope'] font-semibold mr-2 ml-2">Average</span>
            <span className="w-4 h-0.5 bg-[var(--secondary-400)] mr-2"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-[var(--secondary-400)] -ml-2 "></span>
            <span className="w-4 h-0.5 bg-[var(--secondary-400)] "></span>
          </div>
          
        </div>
      </div>
      <div className="h-[320px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default TestChart; 