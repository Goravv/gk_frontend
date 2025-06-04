import axios from 'axios';

const API = axios.create({
  baseURL: 'https://gk-project.onrender.com', // adjust if needed
});

export default API;
