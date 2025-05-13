// 여러 개의 reducer를 하나의 rootReducer로 병합할 수 있는 함수
// Redux Toolkit에서 제공
import { combineReducers, configureStore } from "@reduxjs/toolkit";

// 사용자 인증 상태, 유저 정보 등을 관리하는 user reducer import
import userReducer from "./userSlice";

// redux-persist에서 기본적으로 사용하는 localStorage 저장소 import
import storage from "redux-persist/lib/storage";

// redux-persist에서 사용하는 주요 함수들과 직렬화 예외처리용 상수들 import
import {
    FLUSH, // persist가 완료되었음을 나타내는 액션 타입
    PAUSE, // 저장 일시 정지
    PERSIST, // persist 시작 액션
    PURGE, // 저장된 상태 초기화
    REGISTER, // persist store 등록 완료
    REHYDRATE, // 저장된 상태를 복원하는 액션
    persistReducer, // 기존 reducer에 persist 기능을 입히는 함수
    persistStore, // store에 persist 기능을 실제로 연결하는 함수
} from "redux-persist";

// rootReducer를 정의 (앱에서 사용할 모든 reducer를 하나로 병합)
// 현재는 user 하나만 있지만, 추후 다른 reducer도 이곳에 추가 가능
export const rootReducer = combineReducers({
    user: userReducer, // userSlice에서 정의한 user 관련 reducer
});

// persist를 위한 설정 객체 생성
const persistConfig = {
    key: "root", // localStorage에 저장될 key 이름 (root로 저장됨)
    storage, // 사용할 저장소 (위에서 import한 localStorage 기반 storage)
    // 필요시 sessionStorage로 변경 가능
};

// persist 설정을 적용한 새로운 reducer 생성
// rootReducer를 persistReducer로 감싸서 상태 저장 기능을 부여함
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux store를 생성
export const store = configureStore({
    reducer: persistedReducer, // 상태 유지 기능이 적용된 reducer를 store에 연결

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Redux Toolkit은 기본적으로 액션과 상태가 직렬화 가능한 값인지 검사함
                // 하지만 redux-persist 내부에서 사용하는 액션들은 직렬화되지 않은 값이 포함됨
                // 따라서 아래 액션들을 검사에서 제외해야 경고나 오류가 발생하지 않음
                ignoreActions: [
                    FLUSH, // 저장 완료
                    REHYDRATE, // 저장된 값 복원
                    PAUSE, // 일시 정지
                    PERSIST, // persist 시작
                    PURGE, // 상태 제거
                    REGISTER, // persist 등록 완료
                ],
            },
        }),
});

// 실제로 상태를 localStorage에 저장하고, 앱이 다시 켜졌을 때 복원해주는 객체
// <PersistGate> 컴포넌트에 전달되어 앱 전체의 상태 복원을 제어함
export const persistor = persistStore(store);
