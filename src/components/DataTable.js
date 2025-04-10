import React, { useRef, useEffect,useState} from 'react';
import '../table.css'
function DataTable({ data, columns }) {

  // Importante: 
//   { Time: '10:00', Read: 1.2, pH: 7.0, Temperature: 25.0 },
//   { Time: '10:05', Read: 1.5, pH: 6.8, Temperature: 25.5 },
//   { Time: '10:10', Read: 1.7, pH: 6.5, Temperature: 26.0 },
// ];

// const columns = ['Time', 'Read', 'pH', 'Temperature'];
const tableContainerRef = useRef(null);
const [autoScroll, setAutoScroll] = useState(true);
const prevDataLength = useRef(data.length);

// Detecta se o usuário está scrollando manualmente
// const handleScroll = () => {
//   const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
//   const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 50; // 50px de margem
  
//   setAutoScroll(isNearBottom);
// };

// Efeito para scroll automático condicional
useEffect(() => {
  if (tableContainerRef.current) {
    tableContainerRef.current.scrollTop = tableContainerRef.current.scrollHeight;
  }
  prevDataLength.current = data.length;
}, [data, autoScroll]);

function realdatatable() {

  // onScroll={handleScroll}
  return (
    <div className="scrollable-table" ref={tableContainerRef}  >
    <table className="table mt-2">
      <thead>
        <tr>
          {columns.map((column) => (
            <th key={column}>{column}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => {
          // Verifica se a linha atual é diferente da anterior
          const isDuplicate = index > 0 && 
            columns.every(column => row[column] === data[index-1][column]);
          
          // Só renderiza se não for duplicada
          return !isDuplicate ? (
            <tr key={`row-${index}`}>
              {columns.map(column => (
                <td key={`${column}-${row[column]}`}>
                  {row[column]}
                </td>
              ))}
            </tr>
          ) : null;
        })}
      </tbody>
    </table>
  </div>
  );
}


  return (
    <>
      {realdatatable()}
    </>

  );
}

export default DataTable;