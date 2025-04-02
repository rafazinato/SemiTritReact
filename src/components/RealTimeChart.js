import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';

function RealTimeChart({ data, testData, setSelectedWavelength,chartPoints }) {
  const chartRef = useRef(null); // Referência para o elemento canvas
  const chartInstance = useRef(null); // Referência para a instância do gráfico

  // Efeito para inicializar e atualizar o gráfico
  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    console.log(testData)
    // Configuração do gráfico
    const config = {
      type: 'line', // Tipo de gráfico (linha)
      data: {
        datasets: [
          {
            label: 'Tempo (s)', // Rótulo do dataset
            // data: data.map((d) => ({ x: d.read, y: d.pH })), // Dados do gráfico
            data: testData.slice(-chartPoints),
            borderColor: 'rgba(75, 192, 192, 1)', // Cor da linha
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Cor de fundo
            borderWidth: 1, // Espessura da linha
            pointRadius: 2, // Tamanho dos pontos
            fill: false, // Não preencher área abaixo da linha
          },
        ],
      },
      options: {
        responsive: true, // Gráfico responsivo
        maintainAspectRatio: false, // Não manter proporção fixa
        animation: false,
        scales: {
          x: {
            type: 'linear', // Eixo X linear
            // time: {
            //   unit: 'second',
            //   tooltipFormat: 'HH:mm:ss', // Formato do tooltip
            //   displayFormats: {
            //     second: 'HH:mm:ss'      // Formato do eixo
            //   }
            // },
            ticks: {
              callback: function(value) {
                return value / 1000 + 's'; // Converte ms para segundos
              }
            },
            title: {
              display: true,
              text: 'Read Number', // Rótulo do eixo X
              font: { size: 17 }
            },
          },
          y: {
            title: {
              display: true,
              text: 'Leitura/ bits', // Rótulo do eixo Y
              font: { size: 17 }
            },
          },
        },
        plugins: {
          legend: {
            display: false, // Ocultar legenda
          },
        },
      },
    };

    // Se o gráfico já existe, atualize os dados
    if (chartInstance.current) {
      // chartInstance.current.data.datasets[0].data = data.map((d) => ({ x: d.read, y: d.pH }));
      chartInstance.current.data.datasets[0].data = testData
      chartInstance.current.update(); // Atualizar o gráfico
    } else {
      // Caso contrário, crie um novo gráfico
      chartInstance.current = new Chart(ctx, config);
    }

    // Limpar o gráfico ao desmontar o componente
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data, testData]); // Executar efeito sempre que `data` mudar



  // ADC0/F1 415nm 445nm  480nm   515nm  555nm 590nm 630nm Clear NIR explique isso
  return (
    <div style={{ height: '430px' }} >
 
      {/* style={{height: '30%' , width : '40%', display: 'block', boxSizing:' border-box' }} */}
      <canvas ref={chartRef} />
    </div>
  );
}

export default RealTimeChart;