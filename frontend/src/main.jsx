import React from "react";
// React를 사용하기 위해 불러옵니다. JSX 문법을 사용하려면 반드시 필요합니다.

import ReactDOM from "react-dom/client";
// React 18 이상의 새로운 방식인 createRoot API를 사용하기 위해 ReactDOM의 client 버전을 불러옵니다.

import "./index.css";
// 전체 애플리케이션에 적용되는 전역 스타일 시트를 불러옵니다.

import App from "./App";
// 실제 페이지의 루트 컴포넌트인 App.jsx를 불러옵니다.

import { BrowserRouter } from "react-router-dom";
// React Router의 라우팅 기능을 사용하기 위해 BrowserRouter 컴포넌트를 불러옵니다.

import { Provider } from "react-redux";
// Redux를 전역 상태로 사용하기 위해 최상단에 Provider를 감쌉니다. 이 안에서 store를 사용할 수 있습니다.

import { store, persistor } from "./store";
// Redux의 store 객체와, 상태를 유지(persist)시키기 위한 persistor 객체를 불러옵니다.

import { PersistGate } from "redux-persist/integration/react";
// 새로고침 후에도 Redux 상태를 유지하기 위해 PersistGate를 사용합니다.

ReactDOM.createRoot(document.getElementById("root")).render(
    // index.html에 있는 <div id="root"></div>를 기준으로 React 앱을 렌더링합니다 (React 18 방식)

    <BrowserRouter>
        {/* 모든 라우팅 기능을 App 내부에서 사용할 수 있도록 최상단에 BrowserRouter로 감쌉니다 */}

        <Provider store={store}>
            {/* Redux 상태관리 기능을 모든 컴포넌트에서 사용할 수 있도록 감쌉니다 */}

            <PersistGate loading={null} persistor={persistor}>
                {/* 로컬스토리지에 저장된 Redux 상태가 복원될 때까지 기다립니다 (null이면 로딩 화면 없음) */}

                <App />
                {/* 실제 전체 앱 컴포넌트를 렌더링합니다. 이 안에 라우터, 페이지, 레이아웃이 구성됩니다 */}
            </PersistGate>
        </Provider>
    </BrowserRouter>
);
