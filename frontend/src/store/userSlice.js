import { createSlice } from "@reduxjs/toolkit";
// Redux Toolkit에서 슬라이스(상태 조각)를 만들기 위한 createSlice 함수 불러옴

import {
    addToCart,
    authUser,
    getCartItems,
    loginUser,
    logoutUser,
    payProducts,
    registerUser,
    removeCartItem,
} from "./thunkFunctions";
// 비동기 API 요청 함수(thunks)들을 불러옴. 각 함수는 백엔드와 통신하고 그 결과를 상태에 반영함.

import { toast } from "react-toastify";
// 사용자에게 알림 메시지를 띄우기 위한 라이브러리. 예: "로그인 성공", "에러 발생"

const initialState = {
    userData: {
        id: "", // 사용자 고유 ID
        email: "", // 이메일
        name: "", // 이름
        role: 0, // 권한 (0: 일반유저, 1: 관리자 등)
        image: "", // 프로필 이미지 경로
    },
    isAuth: false, // 로그인 상태 여부
    isLoading: false, // API 요청 중 로딩 상태
    error: "", // 에러 메시지 저장
};

const userSlice = createSlice({
    name: "user", // 이 슬라이스의 이름. Redux DevTools 등에서 사용됨
    initialState, // 초기 상태 할당
    reducers: {}, // 동기 액션은 사용하지 않기 때문에 비워둠
    extraReducers: (builder) => {
        // 비동기 액션 처리용

        builder
            .addCase(registerUser.pending, (state) => {
                // registerUser thunk가 실행되기 시작한 상태 (비동기 요청 시작됨)
                // 이 때는 아직 응답을 받지 않았기 때문에 로딩 상태로 바꿔줌
                state.isLoading = true; // 로딩 중임을 나타냄
            })
            .addCase(registerUser.fulfilled, (state) => {
                // registerUser thunk가 성공적으로 완료되었을 때 실행됨
                state.isLoading = false; // 로딩 상태 종료
                toast.info("회원가입을 성공했습니다."); // 사용자에게 알림 메시지 표시
            })
            .addCase(registerUser.rejected, (state, action) => {
                // registerUser 요청이 실패했을 때 실행됨
                state.isLoading = false; // 로딩 상태 해제
                state.error = action.payload; // 에러 메시지를 상태에 저장
                toast.error(action.payload); // 사용자에게 에러 메시지 표시
            })

            .addCase(loginUser.pending, (state) => {
                // 로그인 요청 시작
                state.isLoading = true; // 로딩 표시
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                // 로그인 성공
                state.isLoading = false; // 로딩 종료
                state.userData = action.payload; // 서버에서 받은 사용자 정보를 userData에 저장
                state.isAuth = true; // 로그인 상태로 변경
                localStorage.setItem("accessToken", action.payload.accessToken);
                // accessToken을 브라우저에 저장하여 인증 유지 (ex. 새로고침 대비)
            })
            .addCase(loginUser.rejected, (state, action) => {
                // 로그인 실패
                state.isLoading = false; // 로딩 종료
                state.error = action.payload; // 에러 메시지 저장
                toast.error(action.payload); // 사용자에게 에러 알림 표시
            })

            .addCase(authUser.pending, (state) => {
                // 로그인 유지 상태 확인 시작
                state.isLoading = true; // 로딩 시작
            })
            .addCase(authUser.fulfilled, (state, action) => {
                // 로그인 유지 확인 성공
                state.isLoading = false; // 로딩 종료
                state.userData = action.payload; // 서버에서 받은 유저 정보 저장
                state.isAuth = true; // 로그인 상태 true
            })
            .addCase(authUser.rejected, (state, action) => {
                // 로그인 유지 확인 실패 (ex. 토큰 만료)
                state.isLoading = false; // 로딩 종료
                state.error = action.payload; // 에러 메시지 저장
                state.userData = initialState.userData; // 유저 정보 초기화
                state.isAuth = false; // 로그인 상태 해제
                localStorage.removeItem("accessToken"); // 저장된 토큰 제거
            })

            .addCase(logoutUser.pending, (state) => {
                // 로그아웃 요청 시작
                state.isLoading = true; // 로딩 시작
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                // 로그아웃 성공
                state.isLoading = false; // 로딩 종료
                state.userData = initialState.userData; // 유저 정보 초기화
                state.isAuth = false; // 로그인 상태 false
                localStorage.removeItem("accessToken"); // 로컬 스토리지에서 토큰 제거
            })
            .addCase(logoutUser.rejected, (state, action) => {
                // 로그아웃 실패
                state.isLoading = false; // 로딩 종료
                state.error = action.payload; // 에러 저장
                toast.error(action.payload); // 사용자에게 에러 알림 표시
            })

            .addCase(addToCart.pending, (state) => {
                // 장바구니 추가 요청 시작
                state.isLoading = true; // 로딩 시작
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                // 장바구니 추가 성공
                state.isLoading = false; // 로딩 종료
                state.userData.cart = action.payload; // 새로운 장바구니 상태 저장
                toast.info("장바구니에 추가되었습니다."); // 알림 표시
            })
            .addCase(addToCart.rejected, (state, action) => {
                // 장바구니 추가 실패
                state.isLoading = false; // 로딩 종료
                state.error = action.payload; // 에러 저장
                toast.error(action.payload); // 알림 표시
            })

            .addCase(getCartItems.pending, (state) => {
                // 장바구니 상품 정보 요청 시작
                state.isLoading = true; // 로딩 시작
            })
            .addCase(getCartItems.fulfilled, (state, action) => {
                // 장바구니 정보 받아오기 성공
                state.isLoading = false; // 로딩 종료
                state.cartDetail = action.payload; // 상세 상품 정보 저장
            })
            .addCase(getCartItems.rejected, (state, action) => {
                // 장바구니 정보 받아오기 실패
                state.isLoading = false; // 로딩 종료
                state.error = action.payload; // 에러 메시지 저장
                toast.error(action.payload); // 에러 알림
            })

            .addCase(removeCartItem.pending, (state) => {
                // 장바구니 상품 제거 요청 시작
                state.isLoading = true; // 로딩 시작
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                // 장바구니 상품 제거 성공
                state.isLoading = false; // 로딩 종료
                state.cartDetail = action.payload.productInfo; // 남은 상품 정보 저장
                state.userData.cart = action.payload.cart; // 장바구니 상태 갱신
                toast.info("상품이 장바구니에서 제거되었습니다."); // 성공 알림
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                // 장바구니 제거 실패
                state.isLoading = false; // 로딩 종료
                state.error = action.payload; // 에러 저장
                toast.error(action.payload); // 알림 출력
            })

            .addCase(payProducts.pending, (state) => {
                // 결제 요청 시작
                state.isLoading = true; // 로딩 시작
            })
            .addCase(payProducts.fulfilled, (state, action) => {
                // 결제 성공
                state.isLoading = false; // 로딩 종료
                state.cartDetail = []; // 결제 후 장바구니 비움
                state.userData.cart = []; // 사용자 장바구니 비움
                toast.info("성공적으로 상품을 구매했습니다."); // 알림 출력
            })
            .addCase(payProducts.rejected, (state, action) => {
                // 결제 실패
                state.isLoading = false; // 로딩 종료
                state.error = action.payload; // 에러 메시지 저장
                toast.error(action.payload); // 사용자에게 에러 메시지 표시
            });
    },
});
export default userSlice.reducer;
