import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

function DerivativeChart({ data }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Referência para a instância do gráfico

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Destruir gráfico existente, se houver
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Criar novo gráfico
    chartInstance.current = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Derivative Data',
          data: data.map((d) => ({ x: d.averageVolume, y: d.derivativeValue })),
          backgroundColor: 'rgba(75, 192, 192, 1)',
          borderColor: 'rgba(75, 192, 192, 1)',
          showLine: true,
          borderWidth: 1,
          pointRadius: 2,
        }],
      },
      options: {
        
        responsive: true, // Desativa o redimensionamento automático
        maintainAspectRatio: false, // Permite definir altura e largura manualmente
        scales: {
          x: {
            title: { display: true, text: 'Average Volume (µl)', font: { size: 17}  },
            
            grid: { display: true },
          },
          y: {
            title: { display: true, text: 'Derivative',font: { size: 17} },
            grid: { display: true },
          },
        },
        plugins: {
          legend: {
            display: false,
            position: 'top',
          },
        },
      },
    });

    // Limpar gráfico ao desmontar
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null; // Limpa a referência
      }
    };
  }, [data]);

  return (
    <div style={{ height: '350px', width: '350px', alignItems: 'center', }}>
      <canvas
        ref={chartRef}
        style={{ height: '100%', width: '100%',  }}
      />
    </div>
  );
}

export default DerivativeChart;