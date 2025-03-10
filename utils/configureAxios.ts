enum STATUS_CODES {
  'UNAUTHORISED' = 401,
}
import axios from 'axios';
import siteConfig from '@/config/siteConfig';

const onFulfilled = (response: any) => {
  console.log("responseonFulfilled",response)
  return response;
};

const onRejected = (error: any) => {
  if (error.response.status === STATUS_CODES.UNAUTHORISED) {
    localStorage.removeItem('_token');
    // set redux profile null and remove local stored token
  }

  return Promise.reject(error.response.data.message);
};

const configureAxios = (_token: string | null) => {
  if (_token) {
    // Cast to AxiosHeaders to access `common` where Authorization headers are stored
    (axios.defaults.headers.common as Record<string, string>).Authorization = 'Bearer ' + _token;
  }
  axios.defaults.baseURL = siteConfig.base_url;
  axios.interceptors.response.use(onFulfilled, onRejected);
};

export default configureAxios;
