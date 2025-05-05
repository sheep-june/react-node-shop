import axios from 'axios';
import qs from 'qs';

const axiosInstance = axios.create({
  baseURL: import.meta.env.PROD ? '' : 'http://localhost:4000',
  // 필터 객체가 쿼리스트링으로 잘 직렬화되도록 설정
  paramsSerializer: (params) =>
    qs.stringify(params, { arrayFormat: 'brackets' }),
});

// 요청 시 Authorization 헤더 추가
axiosInstance.interceptors.request.use(
  function (config) {
    config.headers.Authorization =
      'Bearer ' + localStorage.getItem('accessToken');
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 응답 처리
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async function (error) {
    if (error.response.data === 'jwt expired') {
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
