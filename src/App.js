import React, { useState, useEffect, useRef } from 'react';
import ConnectionForm from './components/ConnectionForm';
import RealTimeChart from './components/RealTimeChart';
import ExperimentChart from './components/ExperimentChart';
import DerivativeChart from './components/DerivativeChart';
import DataTable from './components/DataTable';
import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [realTimeData, setRealTimeData] = useState([]);
  const [realTimeDataTable, setRealTimeDataTable] = useState([]);
  const [experimentDataTable, setExperimentDataTable] = useState([]);

  const [derivativeData, setDerivativeData] = useState([]);
  const [testData, setTestData] = useState([])
  const [selectedWavelength, setSelectedWavelength] = useState()
  const [chartPoints, setChartsPoints] = useState(50)
  const startTime = useRef(null)
  const [filteredData, setFilteredData] = useState([]);




  // State que controlará mínimo e máximo do gráfico Real

  const [axis, setAxis] = useState([0, 65700]);

  // State que controlará o aparecimento das instruções

  const [showInstruction, setShowInstruction] = useState(false);
  const [textInstruction, setTextInstruction] = useState('Mostrar instruções');

  // States que serão utlizados para estocar arrays do volume e concentração 

  const [aditionVolume, setAditionVolume] = useState([])
  const [aditionConc, setAditionConc] = useState([])
  const [labelTable, setLabelText] = useState([])


  const [lastAditionVolume, setLastAditionVolume] = useState()
  const [lastAditionConc, setlastAditionConc] = useState()
  const [lastLabelTable, setLastLabelText] = useState()

  const [maxPoint, setMaxPoint] = useState()
  const [maxPointArray, setMaxPointArray] = useState([])

  const addTime = useRef(null)
  const [addTimeArray, setAddTimeArray] = useState([])

  // Eixo X e Y para o Gráficos de Dados

  const [experimentLabels, setExperimentLabels] = useState([])
  const [experimentData, setExperimentData] = useState([]);

  // State que apresentará os nomes da coluna 1

  const [columsTable1, setColumsTable1] = useState([])
  const [columsTable2, setColumsTable2] = useState([])
  // Função para adicionar dados em tempo real
  // const addRealTimeData = (data) => {
  //   setRealTimeData((prevData) => [...prevData, data]);
  // };

  // Função para adicionar dados de experimento
  const addExperimentData = (data) => {
    setExperimentData((prevData) => [...prevData, data]);
  };

  // Função para calcular e atualizar dados da derivada
  // const updateDerivativeData = () => {
  //   if (experimentData.length < 2) return;
  //   const newDerivativeData = [];
  //   for (let i = 1; i < experimentData.length; i++) {
  //     const volume1 = experimentData[i - 1].volume;
  //     const volume2 = experimentData[i].volume;
  //     const pH1 = experimentData[i - 1].pH;
  //     const pH2 = experimentData[i].pH;
  //     const averageVolume = (volume1 + volume2) / 2;
  //     const derivativeValue = ((pH2 - pH1) / (volume2 - volume1) * 1000);
  //     newDerivativeData.push({ averageVolume, derivativeValue });
  //   }
  //   setDerivativeData(newDerivativeData);
  // };

  // Função para download de dados em CSV
  const downloadCSV = (dataArray, filename, headers) => {
    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...dataArray.map(e => headers.map(header => e[header]).join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // useEffect(() => {
  //   updateDerivativeData();
  // }, [experimentData]);

  useEffect(() => {

    let read1 = columsTable1[1]
    let read2 = columsTable1[2]
    let read3 = columsTable1[3]


    let a = filteredData.map((e) => ({ 'Time': (e.x / 1000).toFixed(1), [read1]: e.y[0], [read2]: e.y[1], [read3]: e.y[2], 'Selecionado': maxPointArray.some(item => item.x === e.x && item.y === e.y) ? 1 : 0 }))

    setRealTimeDataTable(a)
  }, [filteredData]);



  useEffect(() => {
    let read1 = columsTable1[1]
    let read2 = columsTable1[2]
    let read3 = columsTable1[3]

    setExperimentDataTable(maxPointArray.map((e, idx) => ({ 'Nome': labelTable[idx], [read1]: e.y[0], [read2]: e.y[1], [read3]: e.y[2] })))
  }, [maxPointArray]);



  useEffect(() => {

    // if ( addTimeArray[-2] < addTimeArray[-1] ) {
    //   setMaxPoints([...maxPoints, Math.max(...filteredData.map(o => o.y))])

    // // }

    // const maxTimestamp = Math.max(...addTimeArray);
    // let biggertimes = filteredData.filter(e => e.x > maxTimestamp);


    if (addTimeArray.length === 0) return;
    const lastTime = addTimeArray[addTimeArray.length - 1];

    const newDataAfterClick = filteredData.filter(point => point.x >= (lastTime - startTime.current));
    // const teste = filteredData.filter(point => point.x);



    setMaxPoint(Math.max(...newDataAfterClick.map(o => o.y)))







  }, [addTimeArray, filteredData]);


  useEffect(() => {
    let dataInTime;
    addTimeArray.forEach((e, idx) => {
      // if (addTimeArray[idx - 1 ] === undefined) {

      //   //  dataInTime = filteredData.filter( point => point.x >=  e - startTime.current )
      //   //  setMaxPointArray([...maxPointArray, Math.max(...dataInTime.map(o => o.y))])
      // } else {
      //   dataInTime = filteredData.filter( point => point.x <=  e - startTime.current && point.x >= addTimeArray[idx-1]  - startTime.current)
      //   setMaxPointArray([...maxPointArray, Math.max(...dataInTime.map(o => o.y))])
      // }
      if (addTimeArray.length === 1) {
        dataInTime = filteredData.filter(point => point.x <= e - startTime.current)

      } else {

        dataInTime = filteredData.filter(point => point.x <= e - startTime.current && point.x >= addTimeArray[idx -1] - startTime.current)

      }
      // dataInTime = filteredData.filter( point => point.x <=  e - startTime.current && point.x >= addTimeArray[idx-1]  - startTime.current)
      // console.log(dataInTime)
      // setMaxPointArray([...maxPointArray, Math.max(...dataInTime.map(o => o.y))])


      if (dataInTime.length !== 0) {
        const max = dataInTime.reduce(function (prev, current) {
          // obs, do jeito que está agora, ele só verifica o valor máximo do comprimento de onda inicial
          return (prev && prev.y[0] > current.y[0]) ? prev : current
        }) //returns object

        const aa = [...maxPointArray, max]

        const uniqueArray = aa.reduce((acc, current) => {
          const exists = acc.some(item => item.x === current.x && item.y === current.y);
          return exists ? acc : [...acc, current];
        }, []);

        setMaxPointArray(uniqueArray)

      }



    });


    // setMaxPointArray([...maxPointArray, maxPoint ])
    // console.log(maxPointArray)
  }, [maxPoint, addTimeArray, filteredData]);



  // console.log(addTimeArray)
  // console.log(maxPoints)

  useEffect(() => {
    let colunm = ["Time"];
    let colunm2 = ["Nome"]

    if (filteredData && filteredData[0] !== undefined && filteredData[0].y) {
      const wave_numbers = filteredData[0].y.length;

      for (let index = 0; index < wave_numbers; index++) {
        let label = "Nenhum"; // Default value

        if (selectedWavelength && selectedWavelength[0] !== undefined) {
          switch (selectedWavelength[index]) {
            case 0:
              label = "ADC0/F1";
              break;
            case 1:
              label = "415nm";
              break;
            case 2:
              label = "445nm";
              break;
            case 3:
              label = "480nm";
              break;
            case 4:
              label = "515nm";
              break;
            case 5:
              label = "555nm";
              break;
            case 6:
              label = "630nm";
              break;
            case 8:
              label = "NIR";
              break;
            default:
              label = "Nenhum";
              break;
          }
        }
        colunm.push(label);
        colunm2.push(label)
      }
    }

    colunm.push("Selecionado");
    setColumsTable1(colunm);
    setColumsTable2(colunm2)
  }, [filteredData]); // Added selectedWavelength to dependencies



  useEffect(() => {

    if (experimentDataTable.length > 0) {
      const nomes = experimentDataTable.map(item => item.Nome);
      setExperimentLabels(nomes);
      const numbers = experimentDataTable.map(item => item.Read);
      // setExperimentData(maxPointArray.map((e) => e.y))
      setExperimentData(maxPointArray)

    }



  }, [experimentDataTable]);

  // console.log(experimentData)
  // console.log(maxPointArray)
  // console.log(filteredData)

  function handleAddButton() {
    setAditionConc([...aditionConc, lastAditionConc])
    setAditionVolume([...aditionVolume, lastAditionVolume])
    setLabelText([...labelTable, lastLabelTable])
    setAddTimeArray(prev => [...prev, Date.now()]);
    addTime.current = Date.now()
  }



  function handleClearData() {
    setMaxPointArray([])
    setTestData([])
    setFilteredData([])
    setRealTimeData([])
    setRealTimeDataTable([])
    startTime.current = Date.now()
  }

  function handleInstruction() {

    return (
      <>
        <p class="mb-3 text-center">Esta página é projetada para aquisição de dados de instrumentos de laboratório via portas RS232/USB</p>
        <p class=" my-1 ">1)Para realizar um experimento de injeção de fluxo, escolha o instrumento AS7341-FIA</p>
        <p class=" my-1">2) Escollha os comprimentos de onda que serão analisados antes de fazer o experimento</p>
        <p class=" my-1">3) Clique no botão <strong>Conectar</strong> para começar a leitura de dados</p>
        <p class=" my-1">4) Após adição de um padrão ou alguma amostra, adicione um rótulo e clique no botão "Adicionar"</p>
      </>
    );
  }
  return (
    <div className="container-fluid">
      <header className="text-bg-primary text-center py-1 mb-2">
        <h4 className="mb-0">Lab Instrument Data Acquisition</h4>
      </header>

      <div className="row mb-2 g-2">
        <div className='menu-container'>

          <div className="col-md-7">
            <ConnectionForm
              isConnected={isConnected}
              setIsConnected={setIsConnected}
              // addRealTimeData={addRealTimeData}
              realTimeData={realTimeData}
              setRealTimeData={setRealTimeData}
              setRealTimeDataTable={setRealTimeDataTable}
              setTestData={setTestData}
              testData={testData}
              selectedWavelength={selectedWavelength}
              setSelectedWavelength={setSelectedWavelength}
              chartPoints={chartPoints}
              startTime={startTime}
              setFilteredData={setFilteredData}
              filteredData={filteredData}
              setAxis={setAxis}
              axis={axis}


            />

          </div>
          <div class="col-md-5 mb-3 instructions">
            <h5 class="text-center"><button class='btn btn-info' onClick={() => setShowInstruction(!showInstruction)}>Instruções para aquisição de dados</button></h5>
            {showInstruction ? handleInstruction() : null}
          </div>
        </div>
      </div>
      <div className="graph-container">
        <div className="real-chart">
          <h5 className="text-center">Dados obtidos em tempo real</h5>
          <RealTimeChart data={filteredData} testData={testData} setSelectedWavelength={setSelectedWavelength} chartPoints={chartPoints} axis={axis} selectedWavelength={selectedWavelength} />
          <div class="row g-2 mb-2 align-items-center">
            <div class="col-md-8">
              <div class="label-container">
                <label for="max-points" class="form-label mb-0" >Chart Number of Points</label>
                <input type="number" id="max-points" class="form-control" onChange={(e) => setChartsPoints(e.target.value)}></input>
              </div>
            </div>
            <div class="col-md-4">
              <button type="button" id="clear-data-button" class="btn btn-danger full-width-button" onClick={() => handleClearData()}>Clear Data</button>
            </div>
          </div>
          <DataTable data={realTimeDataTable} columns={columsTable1} />
          <button
            className="btn btn-info mt-2 mb-2 full-width-button"
            onClick={() => downloadCSV(realTimeDataTable, 'real-time_data.csv', columsTable1)}
            disabled={realTimeDataTable.length === 0}
          >
            Download Real-Time Data
          </button>
        </div>
        <div className="experiment-chart">
          <h5 className="text-center">Dados Experimentais</h5>
          <ExperimentChart data={experimentDataTable} experimentLabels={experimentLabels} experimentData={experimentData} selectedWavelength={selectedWavelength} />
          <div class="row g-2 mb-2 align-items-center">
            <div class="col-md-8">
              <div class="label-container">
                <label for="volume" class="form-label mb-0" >Texto</label>
                <input id="label-table" class="form-control" onChange={(e) => (setLastLabelText(e.target.value))} ></input>
                {/* Tirando os inputs de concentração e volume por enquanto */}
                {/* <label for="volume" class="form-label mb-0" >Addition Volume (µl)</label>
                <input type="number" id="volume" class="form-control" onChange={(e) => setLastAditionVolume(e.target.value)} ></input>
                <label for="volume" class="form-label mb-0">Concentração</label>
                <input type="number" id="conc" class="form-control" onChange={(e) => setlastAditionConc(e.target.value)}></input> */}
                <div class="col-md-4">
                  <button type="button" id="add-experiment-data-button" class="btn btn-primary full-width-button" onClick={() => handleAddButton()} >Adicionar</button>
                </div>
              </div>
            </div>
          </div>

          <DataTable data={experimentDataTable} columns={columsTable2} />
          <button
            className="btn btn-info mt-2 mb-2 full-width-button"
            onClick={() => downloadCSV(experimentDataTable, 'experiment_data.csv', columsTable2)}
            disabled={experimentDataTable.length === 0}
          >
            Download Experiment Data
          </button>
        </div>
        {/* <div className="derivative-chart">
          <h5 className="text-center">Derivative</h5>
          <div style={{ justifyItems: 'center' }}>
            <DerivativeChart data={derivativeData} />
          </div>

          <button
            className="btn btn-info mt-2 mb-2 full-width-button"
            onClick={() => downloadCSV(derivativeData, 'derivative_data.csv', ['averageVolume', 'derivativeValue'])}
            disabled={derivativeData.length === 0}
          >
            Download Derivative Data
          </button>
        </div> */}
      </div>
    </div>

  );
}

export default App;