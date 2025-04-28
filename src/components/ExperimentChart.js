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
          data: data,
          backgroundColor: 'rgba(255, 99, 132, 1)',
          borderColor: 'rgba(255, 99, 132, 1)',
          showLine: true,
          borderWidth: 1,
          pointRadius: 2,
        }],
      },
      options: {
        animation: false,
        plugins: {
          legend: {
            display: false, // Ocultar legenda
          }
        },
        scales: {
          x: {
             title: { display: true, text: 'Tempo',font: { size: 17} }, 
             ticks: {
              callback: function(value) {
                return value / 1000 + 's'; // Converte ms para segundos
              }
            },
            },
          y: { title: { display: true, text: 'Sinal',font: { size: 17} },  },
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