import React, { useEffect, useRef,useState } from 'react';
import { Chart } from 'chart.js/auto';

function ExperimentChart({ data, experimentLabels,experimentData,selectedWavelength }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null); // Referência para a instância do gráfico
  const [visibilityState, setVisibilityState] = useState([true, true, true]); // Estado para rastrear visibilidade

  const y1 = experimentData.map(e => e.y[0]);
  const y2 = experimentData.map(e => e.y[1] );
  const y3 = experimentData.map(e => e.y[2]);

  let label1, label2, label3;

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

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: experimentLabels,
        datasets: [
          {
          label: label1 ? label1 : " ",
          data: y1,
          borderColor: 'rgba(75, 192, 192, 1)', // Cor da linha
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Cor de fundo
          showLine: false,
          borderWidth: 1,
          pointRadius: 4,
          hidden: !visibilityState[0] // Aplicar estado de visibilidade

        },
        {
          label: label2 ? label2 : " ",
          data: y2,
          borderColor: 'rgb(192, 75, 192)', // Cor da linha
          backgroundColor: 'rgb(192, 75, 192,0.2)', // Cor de fundo
          showLine: false,
          borderWidth: 1,
          pointRadius: 4,
          hidden: !visibilityState[1] // Aplicar estado de visibilidade

        },
        {
          label: label3 ? label3 : " ",
          data: y3,
          borderColor: 'rgb(192, 83, 75)', // Cor da linha
          backgroundColor: 'rgb(192, 83, 75,0.2)', // Cor de fundo
          showLine: false,
          borderWidth: 1,
          pointRadius: 4,
          hidden: !visibilityState[2] // Aplicar estado de visibilidade

        },
      ],
      },
      options: {
        animation: false,
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