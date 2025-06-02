import axios from 'axios';

const instance = axios.create({
  // baseURL: 'http://localhost:5000/api', 
  baseURL: 'http://ec2-3-6-233-101.ap-south-1.compute.amazonaws.com:5000/api', 
});

export default instance;
