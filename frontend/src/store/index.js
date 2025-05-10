import { combineReducers, configureStore } from "@reduxjs/toolkit";
// 여러 reducer를 하나로 합치기 위한 combineReducers와 Redux store를 만들기 위한 configureStore를 가져옵니다.

import userReducer from "./userSlice";
// 사용자 정보와 인증 상태를 관리하는 userReducer를 가져옵니다.

import storage from "redux-persist/lib/storage";
// redux-persist에서 기본으로 사용하는 localStorage를 불러옵니다.

import {
    FLUSH,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
    REHYDRATE,
    persistReducer,
    persistStore,
} from "redux-persist";
// redux-persist 관련 상수 및 함수들을 불러옵니다.
// - persistReducer: 상태 유지 기능을 reducer에 적용시켜줌
// - persistStore: store와 연결되는 persistor 객체 생성
// - 나머지는 상태 직렬화 검사를 피하기 위한 예외 처리용 상수들


export const rootReducer = combineReducers({
    user: userReducer,
});
// user 리듀서를 포함하는 루트 리듀서를 생성합니다.
// 이후 기능이 추가되면 여기에 다른 reducer들도 함께 병합할 수 있습니다.


const persistConfig = {
    key: "root",
    storage,
};
// persist 설정 객체
// - key: localStorage에 저장될 이름
// - storage: 로컬스토리지 사용 (세션스토리지를 쓸 수도 있음)


const persistedReducer = persistReducer(persistConfig, rootReducer);
// rootReducer에 persist 설정을 적용한 새로운 reducer를 생성합니다.
// 이렇게 만들어진 reducer는 앱 상태를 자동으로 localStorage에 저장하고, 불러올 수 있게 됩니다.

export const store = configureStore({
    reducer: persistedReducer,
    // persistReducer를 적용한 reducer를 사용합니다

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Redux Toolkit은 직렬화되지 않은 값이 들어오면 경고를 출력하는데,
                // redux-persist 내부에서 사용하는 일부 액션은 직렬화되지 않아 아래 액션들을 예외 처리합니다.
                ignoreActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export const persistor = persistStore(store);
// store를 기반으로 상태를 실제로 localStorage에 저장/복원하는 persistor를 생성합니다.
// 이 값은 main.jsx에서 PersistGate에 전달됩니다.

