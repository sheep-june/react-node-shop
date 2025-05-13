import { createSlice } from "@reduxjs/toolkit";
// Redux Toolkit에서 슬라이스(상태 조각)를 만들기 위한 createSlice 함수 불러옴

import {
    addToCart, // 상품을 장바구니에 추가하는 thunk 함수
    authUser, // 로그인 유지 상태를 확인하는 thunk 함수
    getCartItems, // 장바구니에 담긴 상품들의 상세 정보를 요청하는 thunk 함수
    loginUser, // 로그인 요청을 처리하는 thunk 함수
    logoutUser, // 로그아웃 요청을 처리하는 thunk 함수
    payProducts, // 결제 처리를 요청하는 thunk 함수
    registerUser, // 회원가입 요청을 처리하는 thunk 함수
    removeCartItem, // 장바구니에서 상품을 제거하는 thunk 함수
} from "./thunkFunctions"; // 모든 비동기 thunk 함수를 정의한 파일에서 불러옴
// 이 thunk 함수들은 createAsyncThunk로 생성되었으며, 각 요청 상태에 따라 slice의 상태를 변경할 수 있음
// 예: pending → 로딩 시작, fulfilled → 데이터 저장, rejected → 에러 처리

import { toast } from "react-toastify";
// 사용자에게 알림 메시지를 띄우기 위한 라이브러리. 예: "로그인 성공", "에러 발생"

const initialState = {
    userData: {
        id: "", // 사용자 고유 ID (서버에서 발급된 _id)
        email: "", // 사용자 이메일 주소
        name: "", // 사용자 이름
        role: 0, // 권한 (0: 일반 사용자, 1: 관리자 등)
        image: "", // 프로필 이미지 경로 (URL 또는 파일명)
    },
    isAuth: false, // 현재 로그인된 상태인지 여부
    isLoading: false, // 비동기 요청 처리 중일 때 true
    error: "", // 에러 메시지를 문자열로 저장
};

const userSlice = createSlice({
    name: "user", // 이 슬라이스의 이름. Redux DevTools 등에서 사용됨
    initialState, // 초기 상태 할당
    reducers: {}, // 동기 액션은 사용하지 않기 때문에 비워둠
    extraReducers: (builder) => {
        // 비동기 액션 처리용

        builder
            .addCase(registerUser.pending, (state) => {
                // 사용자가 회원가입 폼을 제출한 순간 실행된다.
                // 아직 서버 응답을 기다리는 중이므로, 로딩 상태로 표시한다.
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state) => {
                // 서버로부터 "회원가입 성공" 응답을 받은 경우 실행된다.

                state.isLoading = false;
                // 요청이 끝났으므로 로딩 상태를 false로 바꾼다.

                toast.info("회원가입을 성공했습니다.");
                // 사용자에게 회원가입 성공 메시지를 띄운다.
            })
            .addCase(registerUser.rejected, (state, action) => {
                // 서버에서 회원가입 실패 응답을 보냈을 경우 실행된다.
                // 예: 이미 존재하는 이메일이거나, 서버 오류 등

                state.isLoading = false;
                // 요청이 종료되었으므로 로딩 상태 해제

                state.error = action.payload;
                // 에러 메시지를 상태에 저장하여 나중에 화면에 보여줄 수 있도록 한다.

                toast.error(action.payload);
                // 사용자에게 에러 메시지를 알림으로 보여준다.
            })

            .addCase(loginUser.pending, (state) => {
                // 사용자가 로그인 요청을 보낸 직후 실행된다.
                // 아직 서버 응답을 기다리는 중이므로 로딩 중임을 표시한다.
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                // 서버에서 로그인 응답을 정상적으로 받았을 때 실행된다.
                // action.payload에는 사용자 정보와 accessToken이 포함되어 있다.
                state.isLoading = false;
                // 응답을 받았으므로 로딩 상태를 종료한다.
                state.userData = action.payload;
                // 받은 사용자 정보를 상태에 저장한다.
                state.isAuth = true;
                // 로그인 상태를 true로 설정한다.
                localStorage.setItem("accessToken", action.payload.accessToken);
                // accessToken을 로컬스토리지에 저장하여 로그인 상태를 유지하게 한다.
            })
            .addCase(loginUser.rejected, (state, action) => {
                // 로그인 요청이 실패했을 때 실행된다.
                // 예: 이메일 또는 비밀번호가 틀렸거나 서버 오류가 발생한 경우
                state.isLoading = false;
                // 요청이 끝났으므로 로딩을 종료한다.
                state.error = action.payload;
                // 에러 메시지를 상태에 저장한다.
                toast.error(action.payload);
                // 사용자에게 에러 메시지를 알림으로 표시한다.
            })

            .addCase(authUser.pending, (state) => {
                // 로그인 상태 유지 확인 요청을 보낸 직후 실행된다.
                // 브라우저를 새로 고침하거나 앱을 다시 켰을 때 실행될 수 있다.
                state.isLoading = true;
            })
            .addCase(authUser.fulfilled, (state, action) => {
                // 서버에서 "현재 로그인된 사용자입니다"라는 응답을 받았을 때 실행된다.
                state.isLoading = false;
                // 확인이 끝났으므로 로딩 상태를 종료한다.
                state.userData = action.payload;
                // 사용자 정보를 상태에 저장한다.
                state.isAuth = true;
                // 로그인 상태를 true로 설정한다.
            })
            .addCase(authUser.rejected, (state, action) => {
                // 서버에서 "로그인 안 됨" 또는 "토큰 만료" 등의 응답이 왔을 때 실행된다.
                state.isLoading = false;
                // 요청 종료 → 로딩 상태 해제
                state.error = action.payload;
                // 에러 메시지를 상태에 저장한다.
                state.userData = initialState.userData;
                // 로그인되지 않은 상태이므로 사용자 정보를 초기화한다.
                state.isAuth = false;
                // 로그인 상태도 false로 되돌린다.
                localStorage.removeItem("accessToken");
                // 저장된 토큰을 브라우저에서 제거한다.
            })

            .addCase(logoutUser.pending, (state) => {
                // 사용자가 로그아웃 버튼을 클릭한 순간 실행된다.
                // 서버에 로그아웃 요청을 보냈고, 응답을 기다리는 중이다.
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state, action) => {
                // 서버가 로그아웃을 성공적으로 처리하고 응답을 준 경우 실행된다.
                state.isLoading = false;
                // 요청이 끝났으므로 로딩 상태를 false로 바꾼다.

                state.userData = initialState.userData;
                // 사용자 정보를 초기 상태로 되돌린다 (id, email, name, role, image 등 비움)

                state.isAuth = false;
                // 인증 상태를 false로 바꿔서, 이제 로그인하지 않은 상태로 만든다.

                localStorage.removeItem("accessToken");
                // 저장된 accessToken을 브라우저에서 제거한다.
                // 로그아웃한 사용자는 더 이상 토큰으로 인증할 수 없게 된다.
            })
            .addCase(logoutUser.rejected, (state, action) => {
                // 로그아웃 요청이 실패했을 때 실행된다.
                // 예: 네트워크 오류나 서버 측 문제 등
                state.isLoading = false;
                // 요청이 끝났으므로 로딩 상태 해제

                state.error = action.payload;
                // 서버에서 전달받은 에러 메시지를 상태에 저장한다

                toast.error(action.payload);
                // 사용자에게 에러 메시지를 알림으로 보여준다
            })

            .addCase(addToCart.pending, (state) => {
                // 사용자가 "장바구니 담기" 버튼을 클릭했을 때 실행된다.
                // 서버에 상품 추가 요청을 보내고, 응답을 기다리는 중이다.
                state.isLoading = true;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                // 서버가 장바구니 추가 요청을 성공적으로 처리했을 경우 실행된다.
                state.isLoading = false;
                // 요청 완료 → 로딩 상태 종료

                state.userData.cart = action.payload;
                // 서버에서 응답으로 준 장바구니 상태를 userData.cart에 저장한다.
                // 이 안에는 productId, quantity 등의 정보가 들어 있을 수 있다.

                toast.info("장바구니에 추가되었습니다.");
                // 사용자에게 성공 메시지를 알림으로 띄운다
            })
            .addCase(addToCart.rejected, (state, action) => {
                // 서버에서 장바구니 추가 요청이 실패했을 때 실행된다.
                state.isLoading = false;
                // 요청 종료 → 로딩 상태 해제

                state.error = action.payload;
                // 에러 메시지를 상태에 저장한다

                toast.error(action.payload);
                // 사용자에게 실패 메시지를 알림으로 띄운다
            })

            .addCase(getCartItems.pending, (state) => {
                // 장바구니에 담긴 상품들의 상세 정보를 불러오기 위한 요청이 시작되면 실행된다.
                // 예: 장바구니 페이지를 처음 열 때 자동으로 실행될 수 있다.
                state.isLoading = true;
            })
            .addCase(getCartItems.fulfilled, (state, action) => {
                // 서버로부터 장바구니에 담긴 상품들의 상세 정보를 성공적으로 응답받았을 때 실행된다.
                state.isLoading = false;
                // 요청이 완료되었으므로 로딩 상태를 해제한다.
                state.cartDetail = action.payload;
                // 서버에서 받은 상품 상세 목록을 상태에 저장한다.
                // 이 배열은 productId, name, price, quantity 등을 포함한다.
            })
            .addCase(getCartItems.rejected, (state, action) => {
                // 상품 정보를 불러오지 못했을 경우 실행된다 (네트워크 오류, 인증 실패 등)
                state.isLoading = false;
                // 요청이 종료되었으므로 로딩 상태를 false로 설정한다.
                state.error = action.payload;
                // 서버에서 전달된 에러 메시지를 상태에 저장한다.
                toast.error(action.payload);
                // 사용자에게 에러 메시지를 알림으로 보여준다.
            })

            .addCase(removeCartItem.pending, (state) => {
                // 사용자가 장바구니에서 상품 하나를 삭제하려는 요청을 보낸 순간 실행된다.
                state.isLoading = true;
            })
            .addCase(removeCartItem.fulfilled, (state, action) => {
                // 서버가 해당 상품 삭제를 성공적으로 처리하고 응답했을 경우 실행된다.
                state.isLoading = false;
                // 요청이 완료되었으므로 로딩 상태를 해제한다.
                state.cartDetail = action.payload.productInfo;
                // 삭제 후 남아있는 상품들의 상세 정보를 cartDetail에 저장한다.
                state.userData.cart = action.payload.cart;
                // 서버에서 반환한 장바구니 상태를 userData.cart에 반영한다.
                toast.info("상품이 장바구니에서 제거되었습니다.");
                // 사용자에게 성공 메시지를 알림으로 보여준다.
            })
            .addCase(removeCartItem.rejected, (state, action) => {
                // 장바구니 상품 제거 요청이 실패했을 때 실행된다.
                state.isLoading = false;
                // 요청이 끝났으므로 로딩 상태 해제
                state.error = action.payload;
                // 에러 메시지를 상태에 저장
                toast.error(action.payload);
                // 사용자에게 에러 메시지를 알림으로 보여준다
            })

            .addCase(payProducts.pending, (state) => {
                // 사용자가 결제 버튼을 눌러 결제 요청을 서버에 보낸 순간 실행된다.
                // 결제 진행 중임을 나타내기 위해 로딩 상태를 활성화한다.
                state.isLoading = true;
            })
            .addCase(payProducts.fulfilled, (state, action) => {
                // 서버가 결제를 성공적으로 처리하고 응답했을 때 실행된다.
                state.isLoading = false;
                // 결제가 완료되었으므로 로딩 상태를 종료한다.
                state.cartDetail = [];
                // 결제한 상품들을 장바구니에서 모두 비운다 (상세 정보 초기화)
                state.userData.cart = [];
                // 사용자 상태에 저장된 장바구니 목록도 초기화한다.
                toast.info("성공적으로 상품을 구매했습니다.");
                // 사용자에게 결제가 완료되었다는 알림 메시지를 띄운다.
            })
            .addCase(payProducts.rejected, (state, action) => {
                // 결제 요청이 실패했을 때 실행된다 (예: 서버 오류, 인증 실패 등)
                state.isLoading = false;
                // 요청이 끝났으므로 로딩 상태를 해제한다.
                state.error = action.payload;
                // 서버에서 전달된 에러 메시지를 상태에 저장한다.
                toast.error(action.payload);
                // 사용자에게 에러 메시지를 알림으로 보여준다.
            });
    },
});
export default userSlice.reducer;
