import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // change to prod URL later
});

export default instance;
