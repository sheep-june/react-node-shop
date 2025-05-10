import { Outlet, Route, Routes, useLocation } from "react-router-dom";
// React Router를 사용하기 위해 필요한 컴포넌트들을 가져옵니다.
// Routes: 라우터 묶음
// Route: 개별 경로 정의
// Outlet: 중첩 라우팅 시 자식 컴포넌트가 렌더링될 위치
// useLocation: 현재 URL 경로를 가져오기 위한 훅

import "./App.css";
// 전체 앱에 적용할 스타일 시트 불러오기

import LoginPage from "./pages/LoginPage";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
// 주요 페이지 컴포넌트들을 가져옵니다

import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
// 공통 레이아웃 컴포넌트인 네브바와 푸터를 가져옵니다

import { ToastContainer } from "react-toastify";
// 알림 메시지를 띄우는 라이브러리 (react-toastify)에서 알림 컨테이너를 가져옵니다

import "react-toastify/dist/ReactToastify.css";
// toastify의 기본 스타일 적용

import { useDispatch, useSelector } from "react-redux";
// Redux의 상태 값 조회(useSelector)와 액션 발송(useDispatch)에 필요한 훅을 가져옵니다

import { authUser } from "./store/thunkFunctions";
// 사용자 인증 상태를 백엔드에서 확인하기 위한 thunk 함수

import { useEffect } from "react";
// 사이드 이펙트 처리를 위한 React의 훅

import ProtectedPage from "./pages/ProtectedPage";
// 로그인한 사람만 볼 수 있는 예시 페이지

import ProtectedRoutes from "./components/ProtectedRoutes";
import NotAuthRoutes from "./components/NotAuthRoutes";
// 인증 여부에 따라 접근을 제어하는 라우터 컴포넌트

import UploadProductPage from "./pages/UploadProductPage/index";
import CartPage from "./pages/CartPage/index";
import HistoryPage from "./pages/HistoryPage/index";
import DetailProductPage from "./pages/DetailProductPage/index";
// 실제 기능 페이지: 상품 업로드, 장바구니, 주문 내역, 상품 상세

function Layout() {
    return (
        <div className="flex flex-col h-screen justify-between">
            {/* 전체 화면을 세로 방향으로 구성하고 위아래 공간을 적절히 분배 */}

            <ToastContainer
                position="bottom-right"
                theme="light"
                pauseOnHover
                autoClose={1500}
            />
            {/* 알림 메시지 띄우는 컨테이너. 오른쪽 아래에 1.5초 간 표시됨 */}

            <Navbar />
            {/* 상단 네비게이션 바 (공통) */}

            <main className="mb-auto w-10/12 max-w-4xl mx-auto">
                {/* 본문 영역. 중앙 정렬, 너비 제한 */}

                <Outlet />
                {/* 중첩된 Route가 여기 렌더링됨 */}
            </main>

            <Footer />
            {/* 하단 푸터 (공통) */}
        </div>
    );
}

function App() {
    const isAuth = useSelector((state) => state.user?.isAuth);
    // Redux 상태 중 user 객체에서 isAuth(로그인 여부)를 가져옵니다

    const { pathname } = useLocation();
    // 현재 URL 경로를 가져옵니다 (ex. /login, /product/123)

    const dispatch = useDispatch();
    // Redux 액션을 보낼 수 있도록 설정합니다

    useEffect(() => {
        if (isAuth) {
            dispatch(authUser());
        }
        // 로그인된 상태라면 서버에 인증 요청을 보냅니다 (리프레시 대응)
    }, [isAuth, pathname, dispatch]);
    // 의존성 배열에 isAuth와 pathname을 넣음: 로그인 여부나 페이지 경로가 바뀌면 실행됨

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* 루트 경로(/)는 Layout 컴포넌트를 사용. 이 안에서 Outlet으로 자식 컴포넌트를 렌더링 */}

                <Route index element={<LandingPage />} />
                {/* 기본 경로(/)는 LandingPage 컴포넌트를 렌더링 */}

                {/* 로그인한 사람은 접근 불가 */}
                <Route element={<NotAuthRoutes isAuth={isAuth} />}>
                    {/* 로그인 또는 회원가입은 비로그인 상태에서만 접근 가능 */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                </Route>

                {/* 로그인한 사람만 접근 가능 */}
                <Route element={<ProtectedRoutes isAuth={isAuth} />}>
                    {/* 아래 경로들은 모두 인증된 사용자만 접근할 수 있음 */}
                    <Route path="/protected" element={<ProtectedPage />} />
                    <Route
                        path="/product/upload"
                        element={<UploadProductPage />}
                    />
                    <Route
                        path="/product/:productId"
                        element={<DetailProductPage />}
                    />
                    <Route path="/user/cart" element={<CartPage />} />
                    <Route path="/history" element={<HistoryPage />} />
                </Route>
            </Route>
        </Routes>
    );
}
export default App;
// App 컴포넌트를 기본으로 내보냅니다
