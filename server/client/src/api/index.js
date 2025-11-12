import axios from 'axios';

const API_BASE_URL = 'https://hackathon-starter-kit.onrender.com'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export default api;
