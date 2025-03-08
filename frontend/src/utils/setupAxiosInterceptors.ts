import axios from 'axios';

export const setupAxiosInterceptors = (
  setRateLimited: (flag: boolean) => void
) => {
  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 429) {
        setRateLimited(true);
      }
      return Promise.reject(error);
    }
  );
};
