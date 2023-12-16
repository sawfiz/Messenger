import axios from 'axios';

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosPublic.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosPublic.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('🚀 ~ file: axiosPublic.jsx:21 ~ error:', error);
    let customError = { name: error.name, message: error.message };

    // If server is unreachable, there is no error.response
    if (error.response) {
      if (error.response.status === 401) {
        customError = {
          name: 'Authentication Error',
          message: 'Please verify username and password then try again.',
        };
      }
    }

    // Propagate error so it can be used in try...catch
    // An empty object is still truthy, be careful of the condition
    return Promise.reject(customError);
  }
);

export default axiosPublic;
