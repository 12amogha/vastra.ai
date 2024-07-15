import React from 'react';
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { influencer_id, engagement_metrics, followers } = payload[0].payload;
    return (
      <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
        <p>{`Influencer ID: ${influencer_id}`}</p>
        <p>{`Engagement Metrics: ${engagement_metrics}`}</p>
        <p>{`Followers: ${followers}`}</p>
      </div>
    );
  }
  return null;
};

const ScatterPlot = ({ influencerData }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart
        width={600}
        height={300}
        margin={{
          top: 20, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid />
        <XAxis type="number" dataKey="engagement_metrics" name="Engagement Metrics" />
        <YAxis type="number" dataKey="followers" name="Followers" />
        <Tooltip content={<CustomTooltip />} />
        <Scatter name="Influencers" data={influencerData} fill="#8884d8" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default ScatterPlot;
