import axios from 'axios';

export const api = axios.create({ baseURL: 'fetch("https://your-backend-service.onrender.com/api/customers")
' });

export function handleError(err) {
  if (err.response && err.response.data && err.response.data.message) {
    return err.response.data.message;
  }
  return 'Something went wrong';
}
