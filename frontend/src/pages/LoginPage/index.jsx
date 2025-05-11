// React 컴포넌트를 만들기 위한 import
import React from "react";

// react-hook-form: 폼 상태와 유효성 검사를 간단하게 처리할 수 있는 라이브러리
import { useForm } from "react-hook-form";

// Redux의 dispatch를 사용하기 위한 훅
import { useDispatch } from "react-redux";

// 로그인 요청을 보내는 thunk 비동기 함수 import
import { loginUser } from "../../store/thunkFunctions";

// LoginPage 컴포넌트 정의
const LoginPage = () => {
    // useForm 훅으로 폼 상태 관리 함수들을 초기화
    const {
        register, // input 요소와 유효성 검사 규칙을 연결할 때 사용
        handleSubmit, // form 제출을 처리하는 함수
        formState: { errors }, // 각 input의 유효성 검사 에러 객체
        reset, // 입력값을 초기화하는 함수
    } = useForm({ mode: "onChange" }); // 입력 시마다 유효성 검사를 실행하도록 설정

    // Redux dispatch 함수 초기화 (액션 실행용)
    const dispatch = useDispatch();

    // 실제 로그인 버튼을 눌렀을 때 실행되는 콜백 함수
    const onSubmit = ({ email, password }) => {
        // 폼에서 받아온 email, password를 body 객체로 구성
        const body = {
            email,
            password,
        };
        // Redux 비동기 thunk 액션을 호출하여 로그인 요청 전송
        dispatch(loginUser(body));

        // 로그인 요청 후 폼 초기화 (입력칸 비우기)
        reset();
    };

    // 이메일 입력 필드 유효성 검사 규칙
    const userEmail = {
        required: "필수 필드 입니다.", // 아무 것도 입력하지 않았을 때 표시되는 메시지
    };

    // 비밀번호 입력 필드 유효성 검사 규칙
    const userPassword = {
        required: "필수 필드입니다.", // 미입력 시 메시지 출력
        minLength: {
            value: 6, // 최소 길이 설정
            message: "최소 6자입니다.", // 조건을 만족하지 못할 경우 표시되는 메시지
        },
    };

    return (
        <section className="flex flex-col justify-center mt-20 max-w-[400px] m-auto">
            {/* 로그인 폼 전체를 감싸는 section 요소 */}
            {/* flex flex-col: 세로 방향 정렬 */}
            {/* justify-center: 수직 가운데 정렬 */}
            {/* mt-20: 상단 마진 5rem (로그인 화면을 아래로 내림) */}
            {/* max-w-[400px]: 최대 너비를 400px로 제한 */}
            {/* m-auto: 수평 가운데 정렬 */}

            <div className="p-6 bg-white rounded-md shadow-md">
                {/* 로그인 입력 영역을 감싸는 박스형 컨테이너 */}
                {/* p-6: 내부 여백 1.5rem */}
                {/* bg-white: 배경색 흰색 */}
                {/* rounded-md: 모서리를 중간 정도로 둥글게 만듦 */}
                {/* shadow-md: 중간 정도의 그림자 효과로 박스 형태 강조 */}

                <h1 className="text-3xl font-semibold text-center">로그인</h1>
                {/* 로그인 화면 제목 */}
                {/* text-3xl: 폰트 크기 약 1.875rem */}
                {/* font-semibold: 폰트 굵기 600(SemiBold) */}
                {/* text-center: 가운데 정렬 */}

                <form className="mt-6" onSubmit={handleSubmit(onSubmit)}>
                    {/* 로그인 form 태그 시작 */}
                    {/* mt-6: 위쪽 여백 1.5rem */}
                    {/* handleSubmit: react-hook-form에서 유효성 검사 후 onSubmit 실행 */}

                    <div className="mb-2">
                        {/* 이메일 입력 필드를 감싸는 div */}
                        {/* mb-2: 아래쪽 여백 0.5rem */}

                        <label
                            htmlFor="email"
                            className="text-sm font-semibold text-gray-800"
                        >
                            Email
                        </label>
                        {/* label: 이메일 input과 연결 */}
                        {/* htmlFor="email": id와 연결되어 클릭 시 포커스 이동 */}
                        {/* text-sm: 글자 크기 작게 (0.875rem) */}
                        {/* font-semibold: 반굵은 글씨체 */}
                        {/* text-gray-800: 진회색 텍스트 (#1F2937) */}

                        <input
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 mt-2 bg-white border rounded-md"
                            {...register("email", userEmail)}
                        />
                        {/* type="email": 이메일 형식만 허용 */}
                        {/* id="email": 위 label과 연결됨 */}
                        {/* className:
              - w-full: 입력창 너비 100%
              - px-4: 좌우 padding 1rem
              - py-2: 상하 padding 0.5rem
              - mt-2: 위쪽 여백 0.5rem
              - bg-white: 배경 흰색
              - border: 기본 테두리
              - rounded-md: 테두리 둥글게 처리 */}
                        {/* register: react-hook-form과 연결 + 유효성 검사 규칙 적용 */}

                        {errors?.email && (
                            <div>
                                <span className="text-red-500">
                                    {errors.email.message}
                                </span>
                            </div>
                        )}
                        {/* 이메일 입력 실패 시 빨간색 메시지 출력 */}
                        {/* text-red-500: 글자색을 빨간색 (#EF4444)으로 설정 */}
                    </div>

                    <div className="mb-2">
                        {/* 비밀번호 입력 필드를 감싸는 div */}
                        {/* mb-2: 아래쪽 여백 0.5rem */}

                        <label
                            htmlFor="password"
                            className="text-sm font-semibold text-gray-800"
                        >
                            Password
                        </label>
                        {/* label: 비밀번호 input과 연결 */}
                        {/* htmlFor="password": id와 연결되어 포커스 이동 가능 */}
                        {/* text-sm: 글자 작게 */}
                        {/* font-semibold: 반굵은 글씨 */}
                        {/* text-gray-800: 텍스트 진회색 */}

                        <input
                            type="password"
                            id="password"
                            className="w-full px-4 py-2 mt-2 bg-white border rounded-md"
                            {...register("password", userPassword)}
                        />
                        {/* type="password": 입력값을 ●●●●로 표시 */}
                        {/* id="password": label과 연결됨 */}
                        {/* className:
              - w-full: 입력창 너비 100%
              - px-4: 좌우 패딩 1rem
              - py-2: 상하 패딩 0.5rem
              - mt-2: 위쪽 여백 0.5rem
              - bg-white: 배경 흰색
              - border: 기본 테두리
              - rounded-md: 둥근 모서리 처리 */}
                        {/* register: react-hook-form에 연결해 유효성 검사 적용 */}

                        {errors?.password && (
                            <div>
                                <span className="text-red-500">
                                    {errors.password.message}
                                </span>
                            </div>
                        )}
                        {/* 비밀번호 유효성 검사 실패 시 빨간색 텍스트로 메시지 출력 */}
                    </div>

                    <div className="mt-6">
                        {/* 로그인 버튼을 감싸는 div */}
                        {/* mt-6: 위쪽 여백 1.5rem */}

                        <button
                            type="submit"
                            className="w-full px-4 py-2 text-white duration-200 transform bg-black rounded-md hover:bg-gray-700"
                        >
                            로그인
                        </button>
                        {/* type="submit": form 제출 동작을 트리거 */}
                        {/* className:
              - w-full: 버튼 너비 전체
              - px-4 py-2: 내부 여백
              - text-white: 글자색 흰색
              - duration-200: 전환 애니메이션 0.2초
              - transform: 변형 효과 활성화
              - bg-black: 배경 검정색
              - rounded-md: 둥근 모서리
              - hover:bg-gray-700: 마우스 올렸을 때 회색 배경 */}
                    </div>

                    <p className="mt-8 text-xs font-light text-center text-gray-700">
                        {" "}
                        아이디가 없다면?{" "}
                        <a
                            href="/register"
                            className="font-medium hover:underline"
                        >
                            회원가입
                        </a>
                    </p>
                    {/* 하단 회원가입 링크 안내 텍스트 */}
                    {/* mt-8: 위쪽 여백 2rem */}
                    {/* text-xs: 텍스트 크기 매우 작게 (0.75rem) */}
                    {/* font-light: 얇은 글씨체 */}
                    {/* text-center: 가운데 정렬 */}
                    {/* text-gray-700: 텍스트 색상 중간 회색 */}
                    {/* a 태그:
            - font-medium: 중간 굵기
            - hover:underline: 마우스 올릴 때 밑줄 표시 */}
                </form>
            </div>
        </section>
    );
};

export default LoginPage;
