import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

function ExperimentChart({ data,experimentLabels,experimentData }) {
  const chartRef = useRef(null);
  console.log(data)
  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: experimentLabels,
        datasets: [{
          label: 'Experiment Data',
          data: experimentData,
          backgroundColor: 'rgba(255, 99, 132, 1)',
          borderColor: 'rgba(255, 99, 132, 1)',
          showLine: false,
          borderWidth: 1,
          pointRadius: 4,
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
          // x: {
          //    title: { display: true, text: 'Tempo',font: { size: 17} }, 
          //    ticks: {
          //     callback: function(value) {
          //       return value / 1000 + 's'; // Converte ms para segundos
          //     }
          //   },
          //   },
          y: { title: { display: true, text: 'Sinal',font: { size: 17} },  },
        },
      },
    });

    return () => chart.destroy(); // Limpar gráfico ao desmontar
  }, [data,experimentLabels]);

  return (
    <div >
      <canvas ref={chartRef} />
    </div>
  )

}

export default ExperimentChart;