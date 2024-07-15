// src/services/api.js
import axios from 'axios';

const apiUrl = 'http://127.0.0.1:5000';

export const getHistoricalData = async () => {
  try {
    const response = await axios.get(`${apiUrl}/historical-data`);
    return response.data;
  } catch (error) {
    console.error('Error fetching historical data:', error);
    throw error;
  }
};

export const postPredictionRequest = async (data) => {
  try {
    console.log(data);
    const response = await axios.post(`${apiUrl}/predict`, data);
    return response.data;
  } catch (error) {
    console.error('Error posting prediction request:', error);
    throw error;
  }
};
