import axios, { AxiosRequestConfig } from 'axios';
import { refreshAccessToken } from './auth';
import { StorageUtils } from '../storage';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config:any) => {
    const accessToken = StorageUtils.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error:any) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (res:any) => {
    return res;
  },
  async (err:any) => {
    const originalConfig = err.config;
    if (err.response) {
      if (err.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true;
        const accessToken = StorageUtils.getItem('accessToken');
        const refreshToken = StorageUtils.getItem('refreshToken');
        if (refreshToken) {
          try {
            const rs = await refreshAccessToken(accessToken, refreshToken);
            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            } = rs.data.data;
            StorageUtils.setItem('accessToken', newAccessToken);
            StorageUtils.setItem('refreshToken', newRefreshToken);
            originalConfig.headers['Authorization'] = `Bearer ${accessToken}`;
            return axiosInstance(originalConfig);
          } catch (_error) {
            StorageUtils.removeItem('refreshToken');
            if (accessToken) {
              StorageUtils.removeItem('accessToken');
            }
            return Promise.reject(_error);
          }
        } else {
          if (accessToken) {
            StorageUtils.removeItem('accessToken');
          }
        }
      }
      return Promise.reject(err);
    }
    return Promise.reject(err);
  },
);

export const getAPI = (
  url: string,
  config?: AxiosRequestConfig<any> | undefined,
) => {
  return axiosInstance.get(url, config);
};
export const postAPI = (
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any> | undefined,
) => {
  return axiosInstance.post(url, data, config);
};
export const putAPI = (
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any> | undefined,
) => {
  return axiosInstance.put(url, data, config);
};
export const patchAPI = (
  url: string,
  data?: any,
  config?: AxiosRequestConfig<any> | undefined,
) => {
  return axiosInstance.patch(url, data, config);
};
export const deleteAPI = (
  url: string,
  config?: AxiosRequestConfig<any> | undefined,
) => {
  return axiosInstance.delete(url, config);
};

export const fetcher = (data: string[]) => {
  const [url, token, params] = data;
  if (url) {
    return axiosInstance
      .get(url, {
        params,
        headers: { Authorization: 'Bearer ' + token },
      })
      .then((res:any) => res.data.data);
  }
};
