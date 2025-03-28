import React, { useState } from 'react';
import '../form.css';
function ConnectionForm({ isConnected, setIsConnected, addRealTimeData,setRealTimeData }) {
  const [instrument, setInstrument] = useState('lucadema210');
  const [readInterval, setReadInterval] = useState(2000);
  const [port, setPort] = useState(null);
  const deviceConfigs = {
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
    }



  };

  let reader;
  let lastValidData = null
  let updateTimer;
  let realTimeData = [], experimentData = [], derivativeData = []; // Data arrays
  let buffer = []
  let volumeSum = 0, readCount = 0, experimentReadCount = 0; // Counters
  const toggleConnection = async () => {
    if (isConnected) {
      await disconnect();
    } else {
      await connect();
    }
  };


//   const connect = async () => {
//     // Implementar lógica de conexão
//   };

//   const disconnect = async () => {
//     // Implementar lógica de desconexão
//   };
const serialOptions = {
  baudRate: deviceConfigs[instrument].baudRate,
  dataBits: deviceConfigs[instrument].dataBits,
  stopBits: deviceConfigs[instrument].stopBits,
  parity: deviceConfigs[instrument].parity
};

const connect = async () => {
    try {
      const port = await navigator.serial.requestPort();
      await port.open(serialOptions);
      reader = port.readable.getReader();
      setIsConnected(true);
      startSerialReading();
      updateReadInterval();
      // toggleButtonState(true);
  
    } catch (err) {
      console.error("Failed to connect:", err);
      alert("Failed to connect to the instrument.");
    }
  };

const disconnect = async () => {
  if (port) await port.close();
  setIsConnected(false);
};


// FUNÇÃO QUE FUNCIONA


  // Start reading data from the serial port
  function startSerialReading() {
     let readTimer = setInterval(readSerialData, 500); // Set an interval to read data every 500ms
  }

    // Read data from the serial port
    async function readSerialData() {
      try {
        const { value, done } = await reader.read(); // Read data from the port
        if (done) return; // Exit if reader is done
        buffer += new TextDecoder().decode(value); // Append new data to the buffer

        
        // console.log(buffer)

        let index;
        while ((index = buffer.indexOf("\r")) >= 0) {
            // Process each line of data
            const dataStr = buffer.slice(0, index + 1).trim(); // Extract a single line of data
            buffer = buffer.slice(index + 1); // Remove processed data from buffer
            dealDataStr(dataStr)
            // console.log(buffer)
            

        }
    } catch (err) {
        console.error("Failed to read data:", err);
    }
  }

  let data = [];
    function dealDataStr(dataStr) {
      if (deviceConfigs[instrument].name == "AS7341-FIA") {
        dataStr = Number(dataStr.split(';'))
        console.log(dataStr)
      }

    }

    // let rawBuffer = '';
    
    // async function readSerialData() {
    //   try {
    //     while (true) {
    //       const { value, done } = await reader.read();
    //       if (done) {
    //         console.log("Leitura concluída");
    //         return;
    //       }
    
    //       const chunk = new TextDecoder().decode(value);
    //       rawBuffer += chunk;
    //       console.log("Dado bruto recebido:", chunk);
    
    //       // Processa todos os valores completos (separados por ;)
    //       let parts = rawBuffer.split(';');
          
    //       // Mantém o último fragmento incompleto no buffer
    //       rawBuffer = parts.pop() || '';
          
    //       // Filtra valores vazios e converte para números
    //       let values = parts.filter(val => val.trim() !== '').map(Number);
          
    //       // Adiciona os valores processados ao buffer
    //       if (values.length > 0) {
    //         buffer.push(...values);
    //         console.log("Valores processados:", values);
    //       }
    
    //       // Quando temos 10 valores, processamos como uma leitura completa
    //       while (buffer.length >= 10) {
    //         const reading = buffer.slice(0, 10);
    //         buffer = buffer.slice(10);
    //         console.log("Leitura completa (10 valores):", reading);
    //         // Aqui você pode usar a leitura completa (10 valores)
    //       }
    //     }
    //   } catch (err) {
    //     console.error("Erro na leitura:", err);
    //   }
    // }
    
    // readSerialData().catch(console.error);

    // function parseData(dataStr) {
    //   const parts = dataStr.split(','); // Split data string into parts
    //   if (parts.length !== 2) return null; // Ensure data is valid
  
    //   const pH = parseFloat(parts[0]); // Parse pH value
    //   const temperature = parseFloat(parts[1]).toFixed(1); // Parse and format temperature
    //   if (isNaN(pH) || pH < 1 || pH > 14 || isNaN(temperature)) return null; // Validate data
  
    //   return { pH, temperature }; // Return parsed data
    // }

    function updateReadInterval() {
      clearInterval(updateTimer); // Clear any existing update timer
      const readInterval = parseInt(readInterval); // Get selected interval
      updateTimer = setInterval(updateRealTimeData, readInterval); // Set a new interval
      updateRealTimeData(); // Update real-time data immediately
      
    }

    function updateRealTimeData() {
      if (!lastValidData) return; // Exit if no valid data available
  
      const data = { ...lastValidData, ...getCurrentDateTime(), read: ++readCount }; // Create a new data point
      realTimeData.push(data); // Add to real-time data array
      setRealTimeData(realTimeData)
  
    }

    function getCurrentDateTime() {
      const now = new Date();
      return { date: now.toLocaleDateString(), time: now.toLocaleTimeString() }; // Return formatted date and time
    }
  
    const getButtonClass = (isConnected) => {
      let className = 'btn full-width-button btn-success ';
      if (isConnected) {
        className = ' btn full-width-button btn-warning';
      } else {
        className = 'btn full-width-button btn-success';
      }
      return className;
    };
  console.log(realTimeData)
  return (
    <>
    <div ><h2 style={{textAlign: 'center'}}>Connection</h2></div>
    <div> 


    <form id="connection-form">
      <div className="row g-2 mb-2 align-items-center">
        <div className="col-md-5">
          <label htmlFor="instrument" className="form-label mb-0">Instrument</label>
          <select
            id="instrument"
            className="form-select"
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
          >
            <option value='lucadema210' >Lucadema - LUCA210 - Escala pH</option>
            <option value='phmeter'>pH Meter 2</option>
            <option value='ADS_continous_Arduino'>ADS_continous-Arduino</option>
            <option value='AS7341_FIA'>AS7341-FIA</option>
          </select>
        </div>
        <div className="col-md-4">
          <label htmlFor="read-interval" className="form-label mb-0">Read Interval</label>
          <select
            id="read-interval"
            className="form-select"
            value={readInterval}
            onChange={(e) => setReadInterval(e.target.value)}
          >
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
            className={getButtonClass(isConnected)}
            onClick={toggleConnection}
          >
            {isConnected ? 'Disconnect' : 'Connect'}
          </button>
        </div>
      </div>
    </form>
    </div>
    </>
  );
}

export default ConnectionForm;