// /lib/axiosClient.js

import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://sesamo.brickly.cloud/api', // ✅ API REST reali di Sesamo
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance;
