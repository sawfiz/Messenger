import axios from 'axios';

const axiosJWT = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

axiosJWT.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Modify headers based on the content type (JSON or FormData)
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosJWT.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let customError = {
      status: error.response ? error.response.status : 500,
      name: error.name,
      message: error.message,
    };

    // If server is unreachable, there is no error.response
    if (error.response) {
      if (error.response.status === 401) {
        customError = {
          status: error.response.status,
          name: 'Authentication Error',
          message: 'Please verify if JWT is sent in the header then try again.',
        };
      }
      if (error.response.status === 403) {
        customError = {
          status: error.response.status,
          name: 'Session Timed Out',
          message: 'Please login again.',
        };
      }
    }

    // Propagate error so it can be used in try...catch
    // An empty object is still truthy, be careful of the condition
    return Promise.reject(customError);
  }
);

export default axiosJWT;
