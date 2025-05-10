import { createAsyncThunk } from "@reduxjs/toolkit";
// Redux Toolkit에서 비동기 액션 생성을 위한 createAsyncThunk를 가져옵니다.

import axiosInstance from "../utils/axios";
// axios의 공통 설정 인스턴스를 가져옵니다 (baseURL, interceptors 등 적용됨)

// 회원가입 요청을 위한 비동기 thunk 함수
export const registerUser = createAsyncThunk(
    "user/registerUser", // 이 thunk의 이름이자, slice에서 사용하는 액션 타입 접두사입니다.
    async (body, thunkAPI) => {
        // body는 회원가입 폼에서 입력한 데이터 (예: 이메일, 비밀번호 등)를 의미합니다.
        try {
            const response = await axiosInstance.post(
                `/users/register`, // 서버의 회원가입 API 주소로 POST 요청을 보냅니다.
                body // 요청 본문으로 회원가입 정보 전송
            );
            return response.data; // 성공 시 응답 데이터 반환
        } catch (error) {
            console.log(error); // 에러 발생 시 콘솔에 출력
            return thunkAPI.rejectWithValue(
                error.response.data || error.message
            );
            // thunk에서 에러를 rejected 상태로 넘기기 위해 rejectWithValue 사용
        }
    }
);

// 로그인 요청을 위한 thunk
export const loginUser = createAsyncThunk(
    "user/loginUser", // 로그인 액션 이름
    async (body, thunkAPI) => {
        // body는 로그인 폼의 입력값 (이메일, 비밀번호 등)
        try {
            const response = await axiosInstance.post(
                `/users/login`, // 로그인 API로 POST 요청
                body // 로그인 정보 전달
            );
            return response.data; // 성공 시 사용자 정보 등 반환
        } catch (error) {
            console.log(error); // 에러 로그 출력
            return thunkAPI.rejectWithValue(
                error.response.data || error.message
            );
            // 실패 시 에러 메시지를 thunk의 rejected로 넘김
        }
    }
);

// 로그인 유지 상태 확인용 thunk (페이지 새로고침 등에서 사용)
export const authUser = createAsyncThunk(
    "user/authUser", // 액션 타입 이름
    async (_, thunkAPI) => {
        // 매개변수 없음. 현재 로그인 상태인지 확인만 함.
        try {
            const response = await axiosInstance.get(
                `/users/auth` // 로그인된 유저인지 확인하는 API 요청
            );
            return response.data; // 인증된 사용자 정보 반환
        } catch (error) {
            console.log(error); // 인증 실패 시 에러 출력
            return thunkAPI.rejectWithValue(
                error.response.data || error.message
            );
            // 인증 실패 시 메시지 전달
        }
    }
);

// 로그아웃 처리용 thunk
export const logoutUser = createAsyncThunk(
    "user/logoutUser", // 로그아웃 액션 타입
    async (_, thunkAPI) => {
        // 파라미터 없음
        try {
            const response = await axiosInstance.post(
                `/users/logout` // 로그아웃 처리 요청
            );
            return response.data; // 로그아웃 성공 시 응답 반환
        } catch (error) {
            console.log(error); // 에러 로그 출력
            return thunkAPI.rejectWithValue(
                error.response.data || error.message
            );
            // 에러 메시지 반환
        }
    }
);

// 장바구니에 상품 추가하는 thunk
export const addToCart = createAsyncThunk(
    "user/addToCart", // 액션 타입 이름.
    async (body, thunkAPI) => { // body는 { productId, quantity } 형태의 객체.
        try {
            const response = await axiosInstance.post(
                `/users/cart`, // 장바구니 추가 API 호출.
                body // 요청 본문에 상품 정보 포함.
            );
            return response.data; // 장바구니에 추가 완료된 정보 반환.
        } catch (error) {
            console.log(error); // 에러 콘솔 출력.
            return thunkAPI.rejectWithValue(error.response.data || error.message);
            // 실패 응답을 rejected 상태로 전달.
        }
    }
);


// 장바구니에 담긴 상품들의 상세 정보를 조회하는 thunk
export const getCartItems = createAsyncThunk(
    "user/getCartItems", // 액션 타입 이름.
    async ({ cartItemIds, userCart }, thunkAPI) => {
        // cartItemIds는 문자열 ID 배열 (e.g., ["id1", "id2"])
        // userCart는 수량 포함된 장바구니 정보 배열 (e.g., [{ id: "id1", quantity: 2 }])

        try {
            const response = await axiosInstance.get(
                `/products/${cartItemIds}?type=array`
                // 상품 ID 배열을 URL 경로로 전달하여 상품 상세 정보 요청.
            );

            userCart.forEach((cartItem) => {
                // 유저의 장바구니 데이터를 순회.
                response.data.forEach((productDetail, index) => {
                    // 서버 응답의 상품 목록 순회.
                    if (cartItem.id === productDetail._id) {
                        // ID가 일치하면
                        response.data[index].quantity = cartItem.quantity;
                        // 해당 상품 객체에 수량 정보 병합.
                    }
                });
            });

            return response.data; // 수량 정보 포함된 상품 상세 배열 반환.
        } catch (error) {
            console.log(error); // 에러 로그 출력.
            return thunkAPI.rejectWithValue(
                error.response.data || error.message
            );
            // 에러 메시지를 rejected 상태로 전달.
        }
    }
);

// 장바구니에서 상품 삭제 처리 thunk
export const removeCartItem = createAsyncThunk(
    "user/removeCartItem", // 액션 타입 이름.
    async (productId, thunkAPI) => {
        // productId는 제거할 상품의 고유 ID

        try {
            const response = await axiosInstance.delete(
                `/users/cart?productId=${productId}`
                // 쿼리 파라미터로 삭제할 상품 ID 전달.
            );

            response.data.cart.forEach((cartItem) => {
                // 서버에서 반환한 장바구니 정보 순회.
                response.data.productInfo.forEach((productDetail, index) => {
                    // 상품 상세 정보 배열 순회.
                    if (cartItem.id === productDetail._id) {
                        // ID 일치 시 수량 정보 병합.
                        response.data.productInfo[index].quantity =
                            cartItem.quantity;
                    }
                });
            });

            return response.data; // 수량 병합된 장바구니/상품 정보 반환.
        } catch (error) {
            console.log(error); // 에러 로그 출력.
            return thunkAPI.rejectWithValue(
                error.response.data || error.message
            );
            // 실패 메시지를 rejected 상태로 전달.
        }
    }
);

// 결제 요청 thunk
export const payProducts = createAsyncThunk(
    "user/payProducts", // 결제 요청 액션 타입.
    async (body, thunkAPI) => {
        // body에는 결제 대상 상품 정보, 총 금액, 사용자 정보 등이 포함됨.

        try {
            const response = await axiosInstance.post(
                `/users/payment`, // 결제 API 호출.
                body // 요청 본문에 결제 정보 포함.
            );
            return response.data; // 결제 처리 결과 반환.
        } catch (error) {
            console.log(error); // 에러 콘솔 출력.
            return thunkAPI.rejectWithValue(
                error.response.data || error.message
            );
            // 실패 응답 rejected 상태로 전달.
        }
    }
);
