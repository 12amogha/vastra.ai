// src/components/BarGraph.js
import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const BarGraph = ({ data }) => {
  console.log(data);
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        width={600}
        height={300}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="influencer_id" />
        <YAxis dataKey="brand_fit_score"/>
        <Tooltip />
        <Legend />
        <Bar dataKey="brand_fit_score" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarGraph;
