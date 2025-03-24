import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

function ExperimentChart({ data }) {
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Experiment Data',
          data: data.map((d) => ({ x: d.volume, y: d.pH })),
          backgroundColor: 'rgba(255, 99, 132, 1)',
          borderColor: 'rgba(255, 99, 132, 1)',
          showLine: true,
          borderWidth: 1,
          pointRadius: 2,
        }],
      },
      options: {
        plugins: {
          legend: {
            display: false, // Ocultar legenda
          }
        },
        scales: {
          x: { title: { display: true, text: 'Volume (µl)',font: { size: 17} },  },
          y: { title: { display: true, text: 'pH Value',font: { size: 17} },  },
        },
      },
    });

    return () => chart.destroy(); // Limpar gráfico ao desmontar
  }, [data]);

  return (
    <div >
      <canvas ref={chartRef} />
    </div>
  )

}

export default ExperimentChart;