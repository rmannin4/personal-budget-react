import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Chart, ArcElement, Tooltip, Legend, Title, PieController} from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend, Title, PieController);

const ChartComponent = () => {
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  const [dataSource, setDataSource] = useState({
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#ffcd56', '#ff6384', '#36a2eb', '#8a89a6'],
      },
    ],
  });

  useEffect(() => {
    const getBudget = async () => {
      try {
        const res = await axios.get('http://localhost:3000/budget');
        const newData = res.data.myBudget.map((item) => item.budget);
        const newLabels = res.data.myBudget.map((item) => item.title);

        setDataSource({
          labels: newLabels,
          datasets: [
            {
              data: newData,
              backgroundColor: ['#ffcd56', '#ff6384', '#36a2eb', '#8a89a6'],
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching budget data:', error);
      }
    };

    getBudget();
  }, []);

  useEffect(() => {
    if (dataSource.labels.length > 0) {
      createChart();
    }

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [dataSource]);

  const createChart = () => {
    const chartElement = chartRef.current;
    if (chartElement) {
      const ctx = chartElement.getContext('2d');
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      chartInstanceRef.current = new Chart(ctx, {
        type: 'pie',
        data: dataSource,
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 1,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'My Budget Chart',
            },
          },
        },
      });
    } else {
      console.error('Canvas element not found');
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '400px',
        height: '400px',
        maxWidth: '100%',
        maxHeight: '100%',
      }}
    >
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default ChartComponent;