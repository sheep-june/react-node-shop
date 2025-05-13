import { createAsyncThunk } from "@reduxjs/toolkit";
// Redux Toolkit에서 비동기 액션 생성을 위한 createAsyncThunk를 가져옵니다.

import axiosInstance from "../utils/axios";
// axios의 공통 설정 인스턴스를 가져옵니다 (baseURL, interceptors 등 적용됨)

// 회원가입 요청을 위한 비동기 thunk 액션 생성
export const registerUser = createAsyncThunk(
    "user/registerUser",
    // 이 thunk 액션의 이름 (type prefix)
    // 'user' 슬라이스에서 처리될 비동기 액션 이름으로 사용됨

    async (body, thunkAPI) => {
        // 비동기 요청 처리 함수
        // body: 회원가입 폼에서 전달된 사용자 입력값 객체
        // thunkAPI: dispatch, getState 등 redux-thunk에서 제공하는 유틸 객체

        try {
            const response = await axiosInstance.post(
                "/users/register",
                // 서버의 회원가입 API 경로에 POST 요청을 보냄
                body
                // 요청 본문에 사용자 입력 데이터 포함
            );

            return response.data;
            // 요청 성공 시 응답 데이터 반환 (fulfilled 상태로 전달됨)
        } catch (error) {
            console.log(error);
            // 에러 발생 시 콘솔에 에러 로그 출력

            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
            // 요청 실패 시 에러 메시지를 rejected 상태로 반환
            // 서버에서 응답한 메시지 없을 경우 일반 에러 메시지 사용
        }
    }
);

// 로그인 요청을 처리하는 비동기 thunk 함수
export const loginUser = createAsyncThunk(
    "user/loginUser",
    // 액션 타입 이름 (user 슬라이스에서 처리됨)

    async (body, thunkAPI) => {
        // body: 로그인 폼에서 전달된 { email, password } 객체
        // thunkAPI: 에러 처리 및 dispatch 등 유틸 제공

        try {
            const response = await axiosInstance.post(
                "/users/login",
                // 로그인 API 엔드포인트로 POST 요청
                body
                // 사용자 로그인 정보 전송 (email, password 포함)
            );

            return response.data;
            // 요청 성공 시 서버로부터 받은 사용자 정보 반환 (fulfilled 상태)
        } catch (error) {
            console.log(error);
            // 에러가 발생하면 콘솔에 출력

            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
            // 서버 응답 메시지 또는 일반 에러 메시지를 rejected 상태로 전달
        }
    }
);

// 로그인 유지 상태를 확인하는 비동기 thunk 함수
export const authUser = createAsyncThunk(
    "user/authUser",
    // 액션 타입 이름 (슬라이스 내에서 처리됨)

    async (_, thunkAPI) => {
        // 첫 번째 인자는 필요 없음 (로그인 상태 확인이 목적이므로)
        // thunkAPI: 에러 핸들링 등 유틸 객체

        try {
            const response = await axiosInstance.get(
                "/users/auth"
                // 서버에 GET 요청하여 현재 로그인 상태인지 확인
            );

            return response.data;
            // 인증된 사용자 정보 반환 (fulfilled 상태)
        } catch (error) {
            console.log(error);
            // 인증 실패 시 콘솔 출력

            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
            // 실패 메시지를 rejected 상태로 반환
        }
    }
);

// 로그아웃 요청을 처리하는 비동기 thunk 함수 생성
export const logoutUser = createAsyncThunk(
    "user/logoutUser",
    // 액션 타입 이름 (user 슬라이스에서 'logoutUser.fulfilled', 'rejected' 등으로 인식됨)

    async (_, thunkAPI) => {
        // 첫 번째 인자 없음: 로그아웃에는 추가 데이터가 필요하지 않음
        // thunkAPI: dispatch, rejectWithValue 등의 유틸 함수에 접근 가능

        try {
            const response = await axiosInstance.post(
                "/users/logout"
                // 서버의 로그아웃 API에 POST 요청을 보냄
                // 현재 로그인된 사용자 정보는 쿠키나 토큰 등으로 서버가 판단
            );

            return response.data;
            // 요청이 성공한 경우 fulfilled 상태로 응답 데이터 반환
            // 이 데이터는 slice에서 extraReducers로 받아 상태에 반영 가능
        } catch (error) {
            console.log(error);
            // 네트워크 오류, 서버 에러 등 발생 시 콘솔 출력

            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
            // rejectWithValue를 통해 실패 이유를 slice의 rejected 상태로 전달
            // 서버에서 에러 메시지를 주면 그걸 사용, 없으면 일반 에러 메시지 사용
        }
    }
);

// 장바구니에 상품을 추가하는 비동기 thunk 함수 생성
export const addToCart = createAsyncThunk(
    "user/addToCart",
    // 액션 타입 이름 (user 슬라이스에서 'addToCart.fulfilled' 등으로 자동 연결됨)

    async (body, thunkAPI) => {
        // body: { productId, quantity } 형태의 객체
        // 예: { productId: "abc123", quantity: 2 }
        // thunkAPI: dispatch, getState, rejectWithValue 등의 함수 접근 가능

        try {
            const response = await axiosInstance.post(
                "/users/cart",
                // 서버의 장바구니 API에 POST 요청을 보냄
                body
                // 요청 본문에 상품 ID와 수량을 전달함
                // 이 정보는 서버에서 해당 유저의 장바구니에 추가 처리됨
            );

            return response.data;
            // 요청 성공 시 fulfilled 상태로 응답 데이터를 반환함
            // 예: { success: true, cart: [...], total: ... } 구조일 수 있음
            // 이 데이터는 userSlice에서 받아 장바구니 상태를 갱신할 수 있음
        } catch (error) {
            console.log(error);
            // 요청 실패 시 콘솔에 에러 로그 출력

            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
            // 요청 실패 시 rejectWithValue로 실패 이유 전달
            // 이는 slice에서 rejected 액션에 연결되어 에러 처리에 사용됨
        }
    }
);

// 장바구니에 담긴 상품들의 상세 정보를 조회하는 thunk 생성
export const getCartItems = createAsyncThunk(
    "user/getCartItems",
    // 액션 타입 이름 (user 슬라이스에서 해당 액션을 추적함)

    async ({ cartItemIds, userCart }, thunkAPI) => {
        // cartItemIds: 상품의 ID만 모은 문자열 배열 (예: ["id1", "id2"])
        // userCart: 수량 정보를 포함한 배열 (예: [{ id: "id1", quantity: 2 }])
        // thunkAPI: dispatch, rejectWithValue 등 thunk 유틸 접근 객체

        try {
            const response = await axiosInstance.get(
                `/products/${cartItemIds}?type=array`
                // GET 요청으로 상품 ID 배열을 서버에 전달
                // 서버는 해당 ID들에 해당하는 상품 상세 정보 리스트를 반환
            );

            userCart.forEach((cartItem) => {
                // 유저의 장바구니에 담긴 각 상품을 순회

                response.data.forEach((productDetail, index) => {
                    // 서버에서 응답받은 상품 상세 목록을 순회

                    if (cartItem.id === productDetail._id) {
                        // 유저의 장바구니 상품 ID와 서버 응답 상품 ID가 일치하는 경우

                        response.data[index].quantity = cartItem.quantity;
                        // 수량 정보를 서버 응답 객체에 병합
                        // 즉, 각 상품 상세에 해당 상품의 수량을 추가로 붙임
                    }
                });
            });

            return response.data;
            // 수량이 병합된 상품 목록을 fulfilled 상태로 반환
            // 이 데이터는 userSlice의 extraReducers에서 사용 가능
        } catch (error) {
            console.log(error);
            // 오류 발생 시 콘솔 출력

            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
            // 에러 응답이 있다면 해당 메시지, 없다면 일반 에러 메시지를 rejected 상태로 전달
        }
    }
);

// 장바구니에서 상품을 삭제하는 thunk 함수 생성
export const removeCartItem = createAsyncThunk(
    "user/removeCartItem",
    // 액션 타입 이름 (user 슬라이스에서 추적됨)

    async (productId, thunkAPI) => {
        // productId: 삭제할 상품의 고유 ID (문자열)
        // thunkAPI: dispatch, rejectWithValue 등 유틸 접근 객체

        try {
            const response = await axiosInstance.delete(
                `/users/cart?productId=${productId}`
                // DELETE 요청으로 쿼리 파라미터에 상품 ID를 포함
                // 해당 상품을 유저의 장바구니에서 삭제 처리
            );

            response.data.cart.forEach((cartItem) => {
                // 서버 응답의 남아있는 장바구니 항목을 순회

                response.data.productInfo.forEach((productDetail, index) => {
                    // 서버 응답에 포함된 상품 상세 리스트 순회

                    if (cartItem.id === productDetail._id) {
                        // 상품 ID가 일치하는 경우

                        response.data.productInfo[index].quantity =
                            cartItem.quantity;
                        // 삭제 이후 남은 상품들의 수량을 상세 정보에 병합
                    }
                });
            });

            return response.data;
            // 병합된 상품 정보와 장바구니 정보 전체를 fulfilled 상태로 반환
            // 이 데이터를 통해 프론트엔드는 화면을 즉시 업데이트 가능
        } catch (error) {
            console.log(error);
            // 에러 발생 시 콘솔에 출력

            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
            // 서버 응답 에러 또는 일반 에러 메시지를 rejected 상태로 반환
        }
    }
);

// 결제 요청을 처리하는 비동기 thunk 함수 생성
export const payProducts = createAsyncThunk(
    "user/payProducts",
    // 액션 타입 이름 지정
    // 이 이름은 user 슬라이스에서 'payProducts/pending', 'fulfilled', 'rejected'로 연결됨

    async (body, thunkAPI) => {
        // body: 결제 요청에 포함되는 데이터 객체
        // 예: { cartItems: [...], total: 32000, paymentMethod: "card", user: { ... } }
        // thunkAPI: rejectWithValue 등 thunk에서 제공하는 유틸 함수 접근

        try {
            const response = await axiosInstance.post(
                "/users/payment",
                // 서버의 결제 API 주소에 POST 요청 전송
                body
                // body 안의 결제 상품 정보, 사용자 ID, 총 결제 금액 등을 함께 전송
            );

            return response.data;
            // 요청 성공 시 서버 응답 데이터를 fulfilled 상태로 반환
            // 이 데이터는 결제 성공 여부, 주문 번호 등일 수 있음
        } catch (error) {
            console.log(error);
            // 결제 요청 실패 시 콘솔에 에러 로그 출력

            return thunkAPI.rejectWithValue(
                error.response?.data || error.message
            );
            // 서버에서 에러 메시지를 응답했으면 그대로 전달
            // 응답이 없다면 일반적인 error.message를 rejected 상태로 반환
        }
    }
);
