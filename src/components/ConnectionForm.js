import React, { useState, useEffect, useRef } from 'react';
import '../form.css';
import Select from "react-select";
function ConnectionForm({ isConnected, setIsConnected,
  addRealTimeData, setRealTimeData, realTimeData, setTestData,
  testData, selectedWavelength, setSelectedWavelength, chartPoints,
  startTime, setFilteredData, filteredData, setRealTimeDataTable, setAxis, axis }) {
  const [instrument, setInstrument] = useState('lucadema210');
  const [readInterval, setReadInterval] = useState(2000);
  const [port, setPort] = useState(null);
  const [intervalState, setIntervalState] = useState(1000)

  const [file, setFile] = useState(null)

  const [userDeviceConfig, setUserDeviceConfig] = useState(null); // novo



  // const startTime = useRef(null)
  let deviceConfigs = {
    lucadema210: {
      name: "Lucadema - LUCA210 - Escala pH",
      baudRate: 9600,
      dataBits: 8,
      stopBits: 1,
      parity: "none",
    },
    phmeter: {
      name: "pH Meter 2",
      baudRate: 19200,
      dataBits: 8,
      stopBits: 1,
      parity: "none",
    },
    ADS_continous_Arduino: {
      name: "ADS_continous-Arduino",
      baudRate: 9600,
      dataBits: 8,
      stopBits: 1,
      parity: "none",
    },
    AS7341_FIA: {
      name: "AS7341-FIA",
      baudRate: 115200,
      dataBits: 8,
      stopBits: 1,
      parity: "none",
    },
    novoDispositivo: {
      name: "novoDispositivo",
      baudRate: 115200,
      dataBits: 8,
      stopBits: 1,
      parity: "none",
    },


  };

  let reader;
  let buffer = [];
  const toggleConnection = async () => {
    if (isConnected) {
      await disconnect();
    } else {
      await connect();
    }
  };


  const serialOptions = {
    baudRate: deviceConfigs[instrument].baudRate,
    dataBits: deviceConfigs[instrument].dataBits,
    stopBits: deviceConfigs[instrument].stopBits,
    parity: deviceConfigs[instrument].parity
  };




  const connect = async () => {
    try {
      const port = await navigator.serial.requestPort();
      console.log(serialOptions)
      await port.open(serialOptions);
      reader = port.readable.getReader();
      setIsConnected(true);
      startSerialReading();
      // updateReadInterval();
      // toggleButtonState(true);

    } catch (err) {
      console.error("Failed to connect:", err);
      alert("Failed to connect to the instrument.");
    }
  };

  function handleConnection() {
    toggleConnection()
    startTime.current = Date.now()

  }

  const disconnect = async () => {
    if (port) await port.close();
    setIsConnected(false);
  };


  // FUNÇÃO QUE FUNCIONA

  let time;
  // Start reading data from the serial port
  function startSerialReading() {
    let readTimer = setInterval(readSerialData, 50); // Set an interval to read data every 500ms
  }

  // Read data from the serial port
  async function readSerialData() {
    try {
      const { value, done } = await reader.read(); // Read data from the port
      if (done) return; // Exit if reader is done
      buffer += new TextDecoder().decode(value);
      // buffer.push({buffer: new TextDecoder().decode(value) , time:  Date.now() }) += new TextDecoder().decode(value),; // Append new data to the buffer


      let index;
      while ((index = buffer.indexOf("\r")) >= 0) {
        // Process each line of data
        const dataStr = buffer.slice(0, index + 1).trim(); // Extract a single line of data
        buffer = buffer.slice(index + 1); // Remove processed data from buffer
        dealDataStr(dataStr, startTime)
        // console.log(buffer)


      }
    } catch (err) {
      console.error("Failed to read data:", err);
    }
  }
  console.log(deviceConfigs[instrument].name)
  let data = [];
  let data_teste;
  function dealDataStr(dataStr, startTime) {
    if (deviceConfigs[instrument].name == "AS7341-FIA") {
      dataStr = dataStr.split(';')
      dataStr = dataStr.map((e) => Number(e))
      dataStr = dataStr.filter(item => !Number.isNaN(item));
      data.push({ x: Date.now(), y: dataStr[selectedWavelength] })

      // data_teste = data.map((e,idx) => ({ x: time[idx], read: e }));

      // setLocalData(prev => [...prev, { x: elapsedTime, y: dataStr[selectedWavelength] }]);




      // setTestData(prev => [...prev, { x: Date.now(), y: dataStr[selectedWavelength] }]);

      const currentStartTime = startTime; // Captura o valor mais recente
      // console.log(currentStartTime)
      const elapsedTime = currentStartTime ? Date.now() - currentStartTime.current : 0;

      // console.log(elapsedTime)
      // setRealTimeData(prev => [...prev, { x: elapsedTime, y: dataStr[selectedWavelength] }]);
      if (selectedWavelength.length > 0) {
        setRealTimeData(prev => [...prev, { x: elapsedTime, y: selectedWavelength.map((wave) => dataStr[wave]) }]);
      }



    }

    if (deviceConfigs['novoDispositivo'].name == "novoDispositivo") {

      console.log("aaaa")
      dataStr = dataStr.split(';')
      dataStr = dataStr.map((e) => Number(e))
      dataStr = dataStr.filter(item => !Number.isNaN(item));
      data.push({ x: Date.now(), y: dataStr[selectedWavelength] })

      // data_teste = data.map((e,idx) => ({ x: time[idx], read: e }));

      // setLocalData(prev => [...prev, { x: elapsedTime, y: dataStr[selectedWavelength] }]);




      // setTestData(prev => [...prev, { x: Date.now(), y: dataStr[selectedWavelength] }]);

      const currentStartTime = startTime; // Captura o valor mais recente
      // console.log(currentStartTime)
      const elapsedTime = currentStartTime ? Date.now() - currentStartTime.current : 0;

      // console.log(elapsedTime)
      // setRealTimeData(prev => [...prev, { x: elapsedTime, y: dataStr[selectedWavelength] }]);
      if (selectedWavelength.length > 0) {
        setRealTimeData(prev => [...prev, { x: elapsedTime, y: selectedWavelength.map((wave) => dataStr[wave]) }]);
      }



    }

  }

  useEffect(() => {
    if (!realTimeData.length || !intervalState) {
      setFilteredData([]);
      return;
    }

    // 1. Cria uma cópia segura dos dados atuais
    const currentData = [...realTimeData];
    const lastPoint = currentData[currentData.length - 1];

    // 2. Calcula quantos intervalos completos se passaram
    const totalIntervals = Math.floor(lastPoint.x / intervalState);

    // 3. Para cada intervalo, encontra o ponto mais próximo
    const result = [];
    for (let i = 1; i <= totalIntervals; i++) {
      const targetTime = i * intervalState;

      // Encontra o primeiro ponto que ultrapassa o tempo alvo
      const point = currentData.find(p => p.x >= targetTime);

      if (point) {
        result.push(point);
      }
    }

    setFilteredData(result);



  }, [realTimeData, intervalState]);



  // useEffect(() => {
  //   console.log("realTimeData updated:", realTimeData);
  //   console.log("filtered updated:", filteredData)


  // }, [realTimeData, filteredData]);


  function handleExperimentStart() {
    setRealTimeData([])
    setFilteredData([])
    setRealTimeDataTable([])
    startTime.current = 0

  }


  function getCurrentDateTime() {
    const now = new Date();
    return { date: now.toLocaleDateString(), time: now.toLocaleTimeString() }; // Return formatted date and time
  }

  const waves = [
    { value: '0', label: 'ADC0/F1' },
    { value: '1', label: '415nm' },
    { value: '2', label: '445nm' },
    { value: '3', label: '480nm' },
    { value: '4', label: '515nm' },
    { value: '5', label: '555nm' },
    { value: '6', label: '630nm' },
    { value: '8', label: 'NIR' }
  ]

  function handleWavelenght(e) {
    // setSelectedWavelength(e)
    // const nomes = experimentDataTable.map(item => item.Nome);
    // setExperimentLabels(nomes);
    const indexs = e.map(item => Number(item.value))
    setSelectedWavelength(indexs)
  }

    // novoDispositivo: {
    //   name: "",
    //   baudRate: 115200,
    //   dataBits: 8,
    //   stopBits: 1,
    //   parity: "none",
    // },

  function useJSONUser() {
    // deviceConfigs.novoDispositivo = file
    deviceConfigs.novoDispositivo = {
      ...deviceConfigs.novoDispositivo, 
      name: file.name,   
      baudRate: file.baudRate,
      dataBits : file.dataBits,   
      stopBits: file.stopBits,             
      parity: file.parity,               
    };

    console.log(deviceConfigs)
    // setInstrument("novoDispositivo")

  }

  function handleFile(e) {
    const file = e.target?.files?.[0];


    if (file && file.type === "application/json") {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const result = JSON.parse(e.target.result);
          // const newKey = "userCustomDevice";
          // deviceConfigs[newKey] = result; // adiciona ao objeto de configs
          // setInstrument(newKey);          // agora instrument é "userCustomDevice"

          setFile(result); // Aqui você pode usar os dados como quiser
          console.log("JSON carregado:", result);
        } catch (error) {
          console.error("Erro ao fazer parse do JSON:", error);
        }
      };

      reader.readAsText(file);
    } else {
      alert("Por favor, selecione um arquivo JSON válido.");
    }
  }


  if (file) {

    console.log(file);
  }


  return (
    <>
      <div>


        <form id="connection-form">
          <div className="row g-2 mb-2 align-items-center">
            <div className="col-md-5">
              <label htmlFor="instrument" className="form-label mb-0">Instrumento</label>
              <select
                id="instrument"
                className="form-select"
                value={instrument}
                onChange={(e) => setInstrument(e.target.value)}
              >
                <option value='AS7341_FIA'>AS7341-FIA</option>
                <option value='lucadema210' >Lucadema - LUCA210 - Escala pH</option>
                <option value='phmeter'>pH Meter 2</option>
                <option value='ADS_continous_Arduino'>ADS_continous-Arduino</option>
                <option value="novoDispositivo">Dispositivo Personalizado (JSON)</option>

              </select>
            </div>
            <div className="col-md-4">
              <label htmlFor="read-interval" className="form-label mb-0">Intervalo de Leitura</label>
              <select
                id="read-interval"
                className="form-select"
                // value={readInterval}
                onChange={(e) => setIntervalState(e.target.value)}
              >
                <option value="500">Every 500ms</option>
                <option value="1000">Every second</option>
                <option value="2000">Every 2 seconds</option>
                <option value="5000">Every 5 seconds</option>
                <option value="10000">Every 10 seconds</option>
                <option value="30000">Every 30 seconds</option>
                <option value="60000">Every minute</option>
                <option value="300000">Every 5 minutes</option>
              </select>
            </div>
            <div className="col-md-3">
              <button
                type="button"
                className='btnc btn-connnect'
                onClick={() => handleConnection()}
              // onClick={
              //   toggleConnection
              // }
              >
                {isConnected ? 'Desconectar' : 'Conectar'}
              </button>
            </div>
          </div>
        </form>

        <div className='input-container'>
          <div className=" width50 ">
            <label className="form-label mb-0 ">Comprimento de onda</label>
            {/* <select
              id="instrument"
              className="form-select"
              // onChange={(e) => setSelectedWavelength(Number(e.target.value))}
            >
              <option value='0' >ADC0/F1</option>
              <option value='1'>415nm</option>
              <option value='2'>445nm</option>
              <option value='3'>480nm</option>
              <option value='4'>515nm</option>
              <option value='5'>555nm</option>
              <option value='6'>630nm</option>
              <option value='8'>NIR</option>
            </select> */}
            <Select
              isMulti
              onChange={handleWavelenght}
              options={waves}
            />


          </div>
          <div >
            <label className="form-label mb-0 ">Mínimo Y</label>
            <div className=" width50 ">
              <input onChange={(e) => setAxis([Number(e.target.value), axis[1]])} className='input-axis'></input>

            </div>
          </div>
          <div >
            <label className="form-label mb-0 ">Máximo Y</label>
            <div className=" width50 ">
              <input onChange={(e) => setAxis([axis[0], Number(e.target.value)])} className='input-axis'></input>

            </div>
          </div>
          <div>
            <input type='file' onChange={(e) => handleFile(e)} />
            <button onClick={useJSONUser}>Usar JSON</button>
          </div>
        </div>


        {/* <button
                type="button"
                onClick={() => handleExperimentStart()}
              // onClick={
              //   toggleConnection
              // }
              >
                Começar
              </button> */}
      </div>
    </>
  );
}

export default ConnectionForm;