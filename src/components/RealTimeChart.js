import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';

function RealTimeChart({ data, testData, setSelectedWavelength, chartPoints, axis, selectedWavelength }) {
  const chartRef = useRef(null); // Referência para o elemento canvas
  const chartInstance = useRef(null); // Referência para a instância do gráfico
  const [visibilityState, setVisibilityState] = useState([true, true, true]); // Estado para rastrear visibilidade

  const y1 = data.map(e => ({ x: e.x, y: e.y[0] }));
  const y2 = data.map(e => ({ x: e.x, y: e.y[1] }));
  const y3 = data.map(e => ({ x: e.x, y: e.y[2] }));
  let label1, label2, label3;

  // { value: '0', label: 'ADC0/F1' },
  // { value: '1', label: '415nm' },
  // { value: '2', label: '445nm' },
  // { value: '3', label: '480nm' },
  // { value: '4', label: '515nm' },
  // { value: '5', label: '555nm' },
  // { value: '6', label: '630nm' },
  // { value: '8', label: 'NIR' }
  if (selectedWavelength !== undefined) {
    switch (selectedWavelength[0]) {
      case 0:
        label1 = "ADC0/F1"
        break;
      case 1:
        label1 = "415nm"
        break;
      case 2:
        label1 = "445nm"
        break;
      case 3:
        label1 = "480nm"
        break;
      case 4:
        label1 = "515nm"
        break;
      case 5:
        label1 = "555nm"
        break;
      case 6:
        label1 = "630nm"
        break;
      case 8:
        label1 = "NIR"
        break;

      default:
        label1 = "Nenhum"
        break;
    }
    switch (selectedWavelength[1]) {
      case 0:
        label2 = "ADC0/F1"
        break;
      case 1:
        label2 = "415nm"
        break;
      case 2:
        label2 = "445nm"
        break;
      case 3:
        label2 = "480nm"
        break;
      case 4:
        label2 = "515nm"
        break;
      case 5:
        label2 = "555nm"
        break;
      case 6:
        label2 = "630nm"
        break;
      case 8:
        label2 = "NIR"
        break;

      default:
        label2 = "Nenhum"
        break;
    }
    switch (selectedWavelength[2]) {
      case 0:
        label3 = "ADC0/F1"
        break;
      case 1:
        label3 = "415nm"
        break;
      case 2:
        label3 = "445nm"
        break;
      case 3:
        label3 = "480nm"
        break;
      case 4:
        label3 = "515nm"
        break;
      case 5:
        label3 = "555nm"
        break;
      case 6:
        label3 = "630nm"
        break;
      case 8:
        label3 = "NIR"
        break;

      default:
        label3 = "Nenhum"
        break;
    }
  }

  // Efeito para inicializar e atualizar o gráfico
  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Configuração do gráfico
    const config = {
      type: 'line', // Tipo de gráfico (linha)
      data: {
        datasets: [
          {
            label: label1 ? label1 : " ", // Rótulo do dataset
            // data: data.map((d) => ({ x: d.read, y: d.pH })), // Dados do gráfico
            data: y1.slice(-chartPoints),
            borderColor: 'rgba(75, 192, 192, 1)', // Cor da linha
            backgroundColor: 'rgba(75, 192, 192, 0.2)', // Cor de fundo
            borderWidth: 1, // Espessura da linha
            pointRadius: 2, // Tamanho dos pontos
            fill: false, // Não preencher área abaixo da linha
            hidden: !visibilityState[0] // Aplicar estado de visibilidade

          },
          {
            label: label2 ? label2 : " ", // Rótulo do dataset
            // data: data.map((d) => ({ x: d.read, y: d.pH })), // Dados do gráfico
            data: y2.slice(-chartPoints),
            borderColor: 'rgb(192, 75, 192)', // Cor da linha
            backgroundColor: 'rgb(192, 75, 192,0.2)', // Cor de fundo
            borderWidth: 1, // Espessura da linha
            pointRadius: 2, // Tamanho dos pontos
            fill: false, // Não preencher área abaixo da linha
            hidden: !visibilityState[1] // Aplicar estado de visibilidade

          },
          {
            label: label3 ? label3 : " ", // Rótulo do dataset
            // data: data.map((d) => ({ x: d.read, y: d.pH })), // Dados do gráfico
            data: y3.slice(-chartPoints),
            borderColor: 'rgb(192, 83, 75)', // Cor da linha
            backgroundColor: 'rgb(192, 83, 75,0.2)', // Cor de fundo
            borderWidth: 1, // Espessura da linha
            pointRadius: 2, // Tamanho dos pontos
            fill: false, // Não preencher área abaixo da linha
            hidden: !visibilityState[2] // Aplicar estado de visibilidade

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
              callback: function (value) {
                return value / 1000 + 's'; // Converte ms para segundos
              }
            },
            title: {
              display: true,
              text: 'Tempo', // Rótulo do eixo X
              font: { size: 17 }
            },
          },
          y: {
            min: axis[0],
            max: axis[1],
            title: {
              display: true,
              text: 'Leitura/ bits', // Rótulo do eixo Y
              font: { size: 17 }
            },
          },
        },
        plugins: {
          legend: {
            display: true, // Ocultar legenda
            onClick: (e, legendItem, legend) => {
              const index = legendItem.datasetIndex;
              // Atualizar o estado de visibilidade
              setVisibilityState(prev => {
                const newState = [...prev];
                newState[index] = !newState[index];
                return newState;
              });
            }
          },
        },
      },
    };

    // Se o gráfico já existe, atualize os dados
    if (chartInstance.current) {
      // chartInstance.current.data.datasets[0].data = data.map((d) => ({ x: d.read, y: d.pH }));
      // Atualizar dados e visibilidade
      chartInstance.current.data.datasets[0].data = y1.slice(-chartPoints);
      chartInstance.current.data.datasets[1].data = y2.slice(-chartPoints);
      chartInstance.current.data.datasets[2].data = y3.slice(-chartPoints);

      // Manter o estado de visibilidade
      chartInstance.current.data.datasets[0].hidden = !visibilityState[0];
      chartInstance.current.data.datasets[1].hidden = !visibilityState[1];
      chartInstance.current.data.datasets[2].hidden = !visibilityState[2];

      chartInstance.current.update(); // Atualizar o gráfico
    } else {
      // Caso contrário, crie um novo gráfico
      chartInstance.current = new Chart(ctx, config);

      chartInstance.current.options.plugins.legend.onClick = (e, legendItem, legend) => {
        const index = legendItem.datasetIndex;
        setVisibilityState(prev => {
          const newState = [...prev];
          newState[index] = !newState[index];
          return newState;
        });
      };

    }

    // Limpar o gráfico ao desmontar o componente
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data, testData,visibilityState]); // Executar efeito sempre que `data` mudar



  // ADC0/F1 415nm 445nm  480nm   515nm  555nm 590nm 630nm Clear NIR explique isso
  return (
    <div style={{ height: '350px' }} >

      {/* style={{height: '30%' , width : '40%', display: 'block', boxSizing:' border-box' }} */}
      <canvas ref={chartRef} />
    </div>
  );
}

export default RealTimeChart;