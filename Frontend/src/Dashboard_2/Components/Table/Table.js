// Table.js
import React from 'react';
import './Table.css'; // Import the CSS file

const Table = ({ data }) => {
  return (
    <table className="custom-table">
      <thead>
        <tr>
          <th>date</th>
          <th>Amount</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {data.map((row, index) => (
          <tr key={index}>
            <td>{row.date}</td>
            <td>{row.amount}</td>
            <td>{row.type}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
