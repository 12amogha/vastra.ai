// src/components/LinePlot.js
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

// Sample data
const data = [
  { month: 'Jan', sales: 400, type: 'past' },
  { month: 'Feb', sales: 300, type: 'past' },
  { month: 'Mar', sales: 200, type: 'past' },
  { month: 'Apr', sales: 278, type: 'past' },
  { month: 'May', sales: 189, type: 'past' },
  { month: 'Jun', sales: 239, type: 'past' },
  { month: 'Jul', sales: 349, type: 'past' },
  { month: 'Aug', sales: 420, type: 'future' },
  { month: 'Sep', sales: 500, type: 'future' },
  { month: 'Oct', sales: 550, type: 'future' },
  // add more data as needed
];

const LinePlot = () => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        width={600}
        height={300}
        data={data}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="sales" stroke="#8884d8" strokeDasharray="3 4 5 2" />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#8884d8"
          strokeDasharray="3 4 5 2"
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
          data={data.filter(item => item.type === 'future')}
          connectNulls
        />
        <Line
          type="monotone"
          dataKey="sales"
          stroke="#8884d8"
          dot={{ r: 3 }}
          activeDot={{ r: 5 }}
          data={data.filter(item => item.type === 'past')}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LinePlot;
