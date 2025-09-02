import axios from 'axios';

export const api = axios.create({ baseURL: 'http://localhost:5000/api' });

export function handleError(err) {
  if (err.response && err.response.data && err.response.data.message) {
    return err.response.data.message;
  }
  return 'Something went wrong';
}
