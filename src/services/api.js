import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const sendCommand = async (command) => {
  try {
    const response = await api.post('/command', { command });
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error.response?.data || { message: 'Failed to connect to the agent.' };
  }
};

export default api;
