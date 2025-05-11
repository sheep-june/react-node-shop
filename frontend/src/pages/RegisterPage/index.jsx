// React로 함수형 컴포넌트를 만들기 위해 import
import React from "react";

// react-hook-form: 폼 입력값 추적 및 유효성 검사 자동 처리 라이브러리
import { useForm } from "react-hook-form";

// Redux의 dispatch 함수를 사용하기 위한 훅
import { useDispatch } from "react-redux";

// 회원가입 요청을 보내는 비동기 thunk 함수
import { registerUser } from "../../store/thunkFunctions";

const RegisterPage = () => {
    // useForm 훅으로 폼 관련 기능을 가져옵니다
    const {
        register, // input 요소와 react-hook-form 연결
        handleSubmit, // submit 시 실행할 콜백을 연결하는 함수
        formState: { errors }, // 유효성 검사 결과를 담은 객체
        reset, // 폼 초기화 함수
    } = useForm({ mode: "onChange" }); // onChange 시점마다 유효성 검사 수행
    // Redux 액션을 실행하기 위한 dispatch 초기화
    const dispatch = useDispatch();

    // 회원가입 버튼 클릭 시 실행되는 함수
    const onSubmit = ({ email, password, name }) => {
        // 서버에 보낼 회원가입 요청 데이터 객체 생성
        const body = {
            email,
            password,
            name,
            image: "https://via.placeholder.com/600x400?text=no+user+image",
            // 이미지 필드는 기본값으로 placeholder 이미지 URL 사용
        };

        // registerUser 액션을 dispatch 하여 서버로 요청 보냄
        dispatch(registerUser(body));

        // 폼 초기화 (입력창 비우기)
        reset();
    };

    // 이메일 입력 유효성 검사 규칙
    const userEmail = {
        required: "필수 필드 입니다.",
    };

    // 이름 입력 유효성 검사 규칙
    const userName = {
        required: "필수 필드 입니다.",
    };

    // 비밀번호 입력 유효성 검사 규칙
    const userPassword = {
        required: "필수 필드입니다.",
        minLength: {
            value: 6, // 최소 길이 조건
            message: "최소 6자입니다.", // 에러 메시지
        },
    };

    return (
        <section className="flex flex-col justify-center mt-20 max-w-[400px] m-auto">
            {/* 섹션 태그: 로그인 폼 전체를 감싸는 최상위 요소 */}
            {/* flex-col: 내부 요소를 수직 방향으로 배치 */}
            {/* justify-center: 수직 가운데 정렬 */}
            {/* mt-20: 위 여백 추가 */}
            {/* max-w-[400px]: 최대 너비 400px로 제한 */}
            {/* m-auto: 좌우 중앙 정렬 */}

            <div className="p-6 bg-white rounded-md shadow-md">
                {/* 로그인 박스 컨테이너 */}
                {/* p-6: 안쪽 여백 */}
                {/* bg-white: 배경색 흰색 */}
                {/* rounded-md: 모서리 둥글게 */}
                {/* shadow-md: 그림자 적용 */}

                <h1 className="text-3xl font-semibold text-center">회원가입</h1>
                {/* 제목 텍스트 */}
                {/* text-3xl: 큰 글씨 크기 */}
                {/* font-semibold: 글씨 굵기 반 굵게 */}
                {/* text-center: 가운데 정렬 */}

                <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* 폼 시작 */}
                    {/* onSubmit: react-hook-form의 handleSubmit을 사용하여 유효성 검사 후 onSubmit 함수 실행 */}

                    <div className="mb-2">
                        {/* 이메일 필드 영역 */}
                        <label
                            htmlFor="email"
                            className="text-sm font-semibold text-gray-800"
                        >
                            Email
                        </label>
                        {/* 이메일 입력창과 연결되는 label (htmlFor="email") */}

                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 mt-2 bg-white border rounded-md"
                            {...register("email", userEmail)}
                        />
                        {/* email input: react-hook-form의 register로 연결됨 */}
                        {/* 유효성 검사 규칙은 userEmail 객체를 따름 */}
                        {/* 입력값은 자동으로 상태에 저장됨 */}

                        {errors?.email && (
                            <div>
                                <span className="text-red-500">
                                    {errors.email.message}
                                </span>
                            </div>
                        )}
                        {/* 이메일 입력이 비어 있거나 잘못된 경우 에러 메시지 출력 */}
                    </div>

                    <div className="mb-2">
                        {/* 이름 필드 영역 */}
                        <label
                            htmlFor="name"
                            className="text-sm font-semibold text-gray-800"
                        >
                            Name
                        </label>

                        <input
                            type="text"
                            id="name"
                            className="w-full px-4 py-2 mt-2 bg-white border rounded-md"
                            {...register("name", userName)}
                        />
                        {/* 이름 input: register로 연결됨 */}
                        {/* 유효성 검사 규칙은 userName 객체 적용 */}

                        {errors?.name && (
                            <div>
                                <span className="text-red-500">
                                    {errors.name.message}
                                </span>
                            </div>
                        )}
                        {/* 이름 유효성 실패 시 메시지 출력 */}
                    </div>

                    <div className="mb-2">
                        {/* 비밀번호 필드 영역 */}
                        <label
                            htmlFor="password"
                            className="text-sm font-semibold text-gray-800"
                        >
                            Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 mt-2 bg-white border rounded-md"
                            {...register("password", userPassword)}
                        />
                        {/* 비밀번호 input: register로 연결됨 */}
                        {/* 최소 길이 6자 유효성 포함 (userPassword 객체 적용) */}

                        {errors?.password && (
                            <div>
                                <span className="text-red-500">
                                    {errors.password.message}
                                </span>
                            </div>
                        )}
                        {/* 비밀번호 유효성 실패 시 메시지 출력 */}
                    </div>

                    <div className="mt-6">
                        {/* 위쪽 여백을 주는 컨테이너 (버튼과 위 입력 필드 사이 공간 확보) */}

                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white duration-200 transform bg-black rounded-md hover:bg-fray-700"
                        >
                            회원가입
                        </button>
                        {/* 버튼 클릭 시 폼 제출 발생 (submit 이벤트) */}
                        {/* react-hook-form의 handleSubmit에 의해 onSubmit 실행됨 */}
                        {/* Tailwind로 스타일 지정: 전체 너비, 검정 배경, 흰 글씨, 호버 효과 포함 */}
                    </div>

                    <p className="mt-8 text-xs font-light text-center text-gray-700">
                        {/* 로그인 안내 문구 영역 */}
                        {/* mt-8: 위 여백, text-xs: 작은 글씨, font-light: 얇은 글씨, text-center: 가운데 정렬 */}{" "}
                        아이디가 있다면?{" "}
                        <a
                            href="/login"
                            className="font-medium hover:underline"
                        >
                            로그인
                        </a>
                        {/* 로그인 링크: 회원가입 완료 대신 로그인 페이지로 이동 가능 */}
                        {/* font-medium: 중간 굵기, hover:underline → 마우스 올리면 밑줄 표시 */}
                    </p>

                    {/* 하단 안내문 + 로그인 링크 (단순 네비게이션, 기능 연결은 아님) */}
                </form>
            </div>
        </section>
    );
};

export default RegisterPage;
