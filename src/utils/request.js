import axios from 'axios';
// import { getToken } from './get-token';

const request1 = axios.create({
  baseURL: import.meta.env.VITE_ELIGIBILITY_PATIENT_URL, // TODO: take this api URL from env
  // timeout: 30000,
  maxBodyLength: Infinity,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

// Add interceptor to modify request headers
request1.interceptors.request.use(
  (config) => {
    // const token = getToken();
    const token = "";
    config.headers.Authorization = `Bearer ${token || ''}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default request1;