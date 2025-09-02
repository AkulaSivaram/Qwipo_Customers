import axios from 'axios';

export const api = axios.create({ baseURL: 'https://qwipo-backend.onrender.com/api' });

export function handleError(err) {
  if (err.response && err.response.data && err.response.data.message) {
    return err.response.data.message;
  }
  return 'Something went wrong';
}
