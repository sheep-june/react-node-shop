import axios from "axios";
// axios 라이브러리를 불러옴. HTTP 요청을 쉽게 처리할 수 있는 도구.

import qs from "qs";
// 객체를 쿼리 스트링으로 변환해주는 유틸리티 라이브러리.
// 배열 쿼리 등에서 URL을 깔끔하게 직렬화하기 위해 사용.

const axiosInstance = axios.create({
    baseURL: import.meta.env.PROD ? "" : "http://localhost:4000",
    // 개발 모드에서는 로컬 백엔드로, 배포 모드(PROD)에서는 상대경로로 요청하도록 설정.
    paramsSerializer: (params) =>
        qs.stringify(params, { arrayFormat: "brackets" }),
    // axios에서 params 객체를 URL 쿼리로 변환할 때 사용하는 방식 지정.
    // 예: { genre: ['action', 'drama'] } → genre[]=action&genre[]=drama
});

// 요청 시 Authorization 헤더 추가
axiosInstance.interceptors.request.use(
    function (config) {
        // 요청을 보내기 직전에 실행됨

        config.headers.Authorization =
            "Bearer " + localStorage.getItem("accessToken");
        // 요청 헤더에 accessToken을 Bearer 방식으로 자동 추가함
        // 로그인된 사용자만 접근 가능한 API에서 인증 처리 용도로 사용됨

        return config;
        // 수정된 config 객체를 다음으로 전달
    },
    function (error) {
        return Promise.reject(error);
        // 요청 전 단계에서 오류가 나면 거부 처리
    }
);

// 응답 처리
axiosInstance.interceptors.response.use(
    (response) => {
        return response;
        // 응답이 정상일 경우 그대로 반환
    },
    async function (error) {
        if (error.response.data === "jwt expired") {
            // 응답 데이터가 'jwt expired'이면 (토큰 만료)

            window.location.reload();
            // 페이지를 강제 새로고침 → 로그인 페이지로 리다이렉트되도록 유도
        }

        return Promise.reject(error);
        // 나머지 에러는 그대로 거부 처리
    }
);

export default axiosInstance;
// 설정이 완료된 axios 인스턴스를 export 해서 전체 프로젝트에서 import 해 사용 가능하게 함
