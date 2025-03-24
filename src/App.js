import React, { useState, useEffect } from 'react';
import ConnectionForm from './components/ConnectionForm';
import RealTimeChart from './components/RealTimeChart';
import ExperimentChart from './components/ExperimentChart';
import DerivativeChart from './components/DerivativeChart';
import DataTable from './components/DataTable';
import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [realTimeData, setRealTimeData] = useState([]);
  const [experimentData, setExperimentData] = useState([]);
  const [derivativeData, setDerivativeData] = useState([]);

  // Função para adicionar dados em tempo real
  const addRealTimeData = (data) => {
    setRealTimeData((prevData) => [...prevData, data]);
  };

  // Função para adicionar dados de experimento
  const addExperimentData = (data) => {
    setExperimentData((prevData) => [...prevData, data]);
  };

  // Função para calcular e atualizar dados da derivada
  const updateDerivativeData = () => {
    if (experimentData.length < 2) return;
    const newDerivativeData = [];
    for (let i = 1; i < experimentData.length; i++) {
      const volume1 = experimentData[i - 1].volume;
      const volume2 = experimentData[i].volume;
      const pH1 = experimentData[i - 1].pH;
      const pH2 = experimentData[i].pH;
      const averageVolume = (volume1 + volume2) / 2;
      const derivativeValue = ((pH2 - pH1) / (volume2 - volume1) * 1000);
      newDerivativeData.push({ averageVolume, derivativeValue });
    }
    setDerivativeData(newDerivativeData);
  };

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

  useEffect(() => {
    updateDerivativeData();
  }, [experimentData]);

  // function dealTableTest() {
  //   setRealTimeData([...realTimeData, {  Time: '10:00', Read: 1.2, pH: 7.0, Temperature: 25.0 }])
  // }
  
  console.log(realTimeData)
  return (
    <div className="container-fluid">
      <header className="text-bg-primary text-center py-1 mb-2">
        <h4 className="mb-0">Lab Instrument Data Acquisition</h4>
      </header>

      <div className="row mb-2 g-2">
        <div className='menu-container'>
          <div class="col-md-5 mb-3 instructions">
            <h5 class="text-center">Instructions for Data Acquisition from Lab Instrumentation</h5>
            <p class="mb-3">This page is designed for acquiring data from lab instruments via RS232/USB ports. While it is primarily intended for titration data acquisition, it can also be used for other types of data collection.        </p>
            <p class=" my-1">1) Ensure your lab instrument is connected to your computer's USB port.</p>
            <p class=" my-1">2) Choose the appropriate instrument profile from the dropdown menu.</p>
            <p class=" my-1">3) Click the <strong>Connect</strong> button to establish a connection with the instrument.</p>
            <p class=" my-1">4) Define the Volume aliquot and Click <strong>Start</strong> to start the experiment.</p>
            <p class=" my-1">5) Press the <strong>Add</strong> button to record the data point.</p>
          </div>
          <div className="col-md-7">
            <ConnectionForm
              isConnected={isConnected}
              setIsConnected={setIsConnected}
              addRealTimeData={addRealTimeData}
              setRealTimeData={setRealTimeData}
            />
          </div>
        </div>
      </div>
      <div className="graph-container">
        <div className="real-chart">
          <h5 className="text-center">Real-Time Data</h5>
          <RealTimeChart data={realTimeData} />
          <div class="row g-2 mb-2 align-items-center">
            <div class="col-md-8">
              <div class="label-container">
                <label for="max-points" class="form-label mb-0">Chart Number of Points</label>
                <input type="number" id="max-points" class="form-control" value="50"></input>
              </div>
            </div>
            <div class="col-md-4">
              <button type="button" id="clear-data-button" class="btn btn-danger full-width-button" disabled>Clear Data</button>
            </div>
          </div>
          <DataTable data={realTimeData} columns={['Time', 'Read', 'pH', 'Temperature']} />
          <button
            className="btn btn-info mt-2 mb-2 full-width-button"
            onClick={() => downloadCSV(realTimeData, 'real-time_data.csv', ['Time', 'Read', 'pH', 'Temperature'])}
            disabled={realTimeData.length === 0}
          >
            Download Real-Time Data
          </button>
        </div>
        <div className="experiment-chart">
          <h5 className="text-center">Titration Data</h5>
          <ExperimentChart data={experimentData} />
          <div class="row g-2 mb-2 align-items-center">
            <div class="col-md-8">
              <div class="label-container">
                <label for="volume" class="form-label mb-0">Addition Volume (µl)</label>
                <input type="number" id="volume" class="form-control" value="100"></input>
              </div>
            </div>
            <div class="col-md-4">
              <button type="button" id="add-experiment-data-button" class="btn btn-primary full-width-button">Start</button>
            </div>
          </div>
          <DataTable data={experimentData} columns={['Time', 'Read', 'Volume', 'pH', 'Temperature']} />
          <button
            className="btn btn-info mt-2 mb-2 full-width-button"
            onClick={() => downloadCSV(experimentData, 'experiment_data.csv', ['time', 'read', 'volume', 'pH', 'temperature'])}
            disabled={experimentData.length === 0}
          >
            Download Experiment Data
          </button>
        </div>
        <div className="derivative-chart">
          <h5 className="text-center">Derivative</h5>
          <div style={{justifyItems: 'center'}}>
            <DerivativeChart data={derivativeData} />
          </div>

          <button
            className="btn btn-info mt-2 mb-2 full-width-button"
            onClick={() => downloadCSV(derivativeData, 'derivative_data.csv', ['averageVolume', 'derivativeValue'])}
            disabled={derivativeData.length === 0}
          >
            Download Derivative Data
          </button>
        </div>
      </div>
      {/* <button onClick={() => dealTableTest()}>teste tabela</button> */}
    </div>

  );
}

export default App;