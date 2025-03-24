import React from 'react';
import '../table.css'
function DataTable({ data, columns }) {

  // Importante: 
//   { Time: '10:00', Read: 1.2, pH: 7.0, Temperature: 25.0 },
//   { Time: '10:05', Read: 1.5, pH: 6.8, Temperature: 25.5 },
//   { Time: '10:10', Read: 1.7, pH: 6.5, Temperature: 26.0 },
// ];

// const columns = ['Time', 'Read', 'pH', 'Temperature'];

  return (
    <div className="scrollable-table">
      <table className="table mt-2">
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column}>{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index}>
              {columns.map((column) => (
                <td key={column}>{row[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;