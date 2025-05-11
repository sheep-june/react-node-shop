// React에서 useState 훅을 가져와서 상태를 관리하기 위해 import
import React, { useState } from "react";

// Redux store에서 사용자 정보(state.user)를 가져오기 위한 훅 import
import { useSelector } from "react-redux";

// axios 설정 인스턴스를 import (공통 baseURL 등 포함)
import axiosInstance from "../../utils/axios";

// 페이지 이동을 위한 useNavigate 훅 import
import { useNavigate } from "react-router-dom";

// 이미지 업로드 기능을 담당하는 컴포넌트 import
import FileUpload from "../../components/FileUpload";

// 상품 지역 옵션을 정의한 상수 배열 (select 박스에서 사용됨)
const continents = [
    { key: 1, value: "Africa" },
    { key: 2, value: "Europe" },
    { key: 3, value: "Asia" },
    { key: 4, value: "North America" },
    { key: 5, value: "South America" },
    { key: 6, value: "Australia" },
    { key: 7, value: "Antarctica" },
];

// 상품 업로드 페이지 컴포넌트 정의
const UploadProductPage = () => {
    // 상품 입력 정보를 상태로 관리
    const [product, setProduct] = useState({
        title: "", // 상품명
        description: "", // 상품 설명
        price: 0, // 가격
        continents: 1, // 대륙 기본값
        images: [], // 업로드된 이미지 배열
    });

    // Redux 스토어에서 로그인한 사용자 정보 가져오기
    const userData = useSelector((state) => state.user?.userData);

    // 페이지 이동을 위한 useNavigate 훅 초기화
    const navigate = useNavigate();

    // input 요소에서 사용자가 입력을 변경했을 때 호출되는 함수
    const handleChange = (event) => {
        // event.target에서 name과 value를 추출한다
        // 예: name='title', value='노트북'
        const { name, value } = event.target;

        // setProduct로 상태를 업데이트한다.
        // 이전 상태를 보존하면서, 방금 바뀐 필드만 새로운 값으로 덮어쓴다
        // name이라는 문자열을 key로 사용해서 해당 필드(title, description 등)를 동적으로 갱신한다
        setProduct((prevState) => ({
            ...prevState, // 이전 상태의 모든 속성(title, description, price 등)을 유지한다
            [name]: value, // 입력한 필드만 업데이트한다. [ ] 문법은 key를 문자열로 받아서 동적으로 접근할 수 있게 한다
        }));
    };

    // 이미지 업로드 또는 변경이 발생했을 때 호출되는 함수
    const handleImages = (newImages) => {
        // newImages는 FileUpload 컴포넌트로부터 전달된 이미지 배열이다
        // 예: ['a.jpg', 'b.jpg']
        // 이 배열을 상태의 images 필드에 반영한다

        setProduct((prevState) => ({
            ...prevState, // 기존 title, description 등 나머지 필드는 유지
            images: newImages, // images만 새로운 배열로 교체
        }));
    };

    // 폼이 제출될 때 실행되는 함수 (버튼 클릭 or Enter 키)
    const handleSubmit = async (event) => {
        event.preventDefault(); // 기본 동작(페이지 새로고침)을 막는다

        // 서버로 보낼 데이터 객체를 생성한다
        const body = {
            writer: userData.id, // Redux store에서 가져온 현재 로그인한 유저의 id를 writer로 포함
            ...product, // 상태에 있는 title, description, price, continents, images를 한꺼번에 포함
        };

        try {
            // 비동기 요청: 서버에 POST 요청을 보낸다. 경로는 '/products'
            // 등록 성공 시 아무 것도 리턴받지 않아도 상관없고, 요청이 끝나기만 기다린다
            await axiosInstance.post("/products", body);

            // 요청 성공 후, 메인 페이지로 강제 이동시킨다
            navigate("/");
        } catch (error) {
            // 요청 실패 시 에러 내용을 콘솔에 출력한다
            console.error(error);
        }
    };

    return (
        <section>
            {/* 이 컴포넌트 전체를 감싸는 HTML 시맨틱 요소 */}
            {/* 의미 있는 구조 분리를 위해 사용됨 */}

            <div className="text-center m-7">
                {/* 제목을 포함하는 상단 영역 */}
                {/* text-center: 텍스트 가운데 정렬 */}
                {/* m-7: 상하좌우 바깥 여백 1.75rem (Tailwind spacing scale) */}
                <h1>예상 상품 업로드</h1>
                {/* 실제로 페이지 상단에 표시될 텍스트 */}
            </div>

            <form className="mt-6" onSubmit={handleSubmit}>
                {/* 사용자 입력을 처리하는 form 태그 */}
                {/* mt-6: 폼 위쪽 여백 1.5rem */}
                {/* onSubmit: 버튼 클릭 시 handleSubmit 함수 실행 */}

                <FileUpload
                    images={product.images}
                    onImageChange={handleImages}
                />
                {/* 이미지 업로드 컴포넌트 */}
                {/* images: 현재 이미지 배열 상태 전달 */}
                {/* onImageChange: 이미지 변경 시 호출될 콜백 함수 */}

                <div className="mt-4">
                    {/* 상품명 입력창을 감싸는 div */}
                    {/* mt-4: 위 요소와의 간격 1rem */}

                    <label htmlFor="title">이름</label>
                    {/* 라벨 텍스트. htmlFor="title"로 input과 연결 */}

                    <input
                        className="w-full px-4 py-2 bg-white border rounded-md"
                        name="title"
                        id="title"
                        onChange={handleChange}
                        value={product.title}
                    />
                    {/* name: 상태에서 어떤 필드를 업데이트할지 구분 */}
                    {/* id: label과 연결됨 */}
                    {/* onChange: 입력 시 handleChange 실행 */}
                    {/* value: 상태값과 입력창이 연결된 controlled input */}
                    {/* className:
            - w-full: 가로 너비 100%
            - px-4: 좌우 padding 1rem
            - py-2: 상하 padding 0.5rem
            - bg-white: 배경색 흰색
            - border: 기본 테두리
            - rounded-md: 둥근 모서리 */}
                </div>

                <div className="mt-4">
                    {/* 설명 입력창을 감싸는 div */}
                    {/* mt-4: 위 요소와 간격 설정 */}

                    <label htmlFor="description">설명</label>
                    {/* label과 input을 연결하여 클릭 시 포커스 이동 가능 */}

                    <input
                        className="w-full px-4 py-2 bg-white border rounded-md"
                        name="description"
                        id="description"
                        onChange={handleChange}
                        value={product.description}
                    />
                    {/* name: description 상태 필드와 연결 */}
                    {/* id: label과 연결 */}
                    {/* onChange: 입력 시 상태 업데이트 */}
                    {/* value: product.description 상태값 표시 */}
                    {/* className:
            - w-full: 전체 너비 사용
            - px-4: 좌우 1rem
            - py-2: 상하 0.5rem
            - bg-white: 배경 흰색
            - border: 테두리 적용
            - rounded-md: 모서리 둥글게 */}
                </div>

                <div className="mt-4">
                    {/* 가격 입력창을 감싸는 div */}
                    {/* mt-4: 위 요소와 간격 설정 */}

                    <label htmlFor="price">가격</label>
                    {/* 가격 입력 라벨. htmlFor로 input 연결 */}

                    <input
                        className="w-full px-4 py-2 bg-white border rounded-md"
                        type="number"
                        name="price"
                        id="price"
                        onChange={handleChange}
                        value={product.price}
                    />
                    {/* type="number": 숫자만 입력 가능 */}
                    {/* name: 상태 필드 이름 */}
                    {/* id: label과 연결 */}
                    {/* onChange: 값 변경 시 상태 업데이트 */}
                    {/* value: 상태와 동기화된 가격 값 */}
                    {/* className:
            - w-full: 가로 너비 전체
            - px-4: 좌우 padding
            - py-2: 상하 padding
            - bg-white: 배경색 흰색
            - border: 테두리
            - rounded-md: 둥근 테두리 */}
                </div>

                <div className="mt-4">
                    {/* 지역 선택 드롭다운을 감싸는 div */}
                    {/* mt-4: 위 요소와 간격 설정 */}

                    <label htmlFor="continents">지역</label>
                    {/* 지역 선택 드롭다운과 연결된 라벨 */}

                    <select
                        className="w-full px-4 py-2 mt-2 bg-white border rounded-md"
                        name="continents"
                        id="continents"
                        onChange={handleChange}
                        value={product.continents}
                    >
                        {/* select: 사용자가 하나의 지역을 선택할 수 있는 요소 */}
                        {/* name: 상태 필드명 */}
                        {/* id: 라벨과 연결 */}
                        {/* onChange: 선택값이 바뀔 때 상태 업데이트 */}
                        {/* value: 현재 선택된 상태값 반영 */}
                        {/* className:
              - w-full: 너비 100%
              - px-4: 좌우 padding 1rem
              - py-2: 상하 padding 0.5rem
              - mt-2: select 위쪽 여백 0.5rem
              - bg-white: 배경 흰색
              - border: 테두리
              - rounded-md: 둥근 테두리 */}

                        {continents.map((item) => (
                            <option key={item.key} value={item.key}>
                                {item.value}
                            </option>
                        ))}
                        {/* continents 배열을 반복해서 option 요소를 생성 */}
                        {/* key: React에서 리스트 최적화를 위한 고유 식별자 */}
                        {/* value: 사용자가 선택할 때 상태로 저장될 숫자 */}
                        {/* item.value: 사용자에게 보여질 텍스트 (예: Asia) */}
                    </select>
                </div>

                <div className="mt-4">
                    {/* 제출 버튼을 감싸는 div */}
                    {/* mt-4: 버튼 위쪽 여백 설정 */}

                    <button
                        type="submit"
                        className="w-full px-4 py-2 text-white bg-black rounded-md hover:bg-gray-700"
                    >
                        생성하기
                    </button>
                    {/* type="submit": form 제출을 트리거하는 역할 */}
                    {/* className:
            - w-full: 버튼 너비 100%
            - px-4: 좌우 padding
            - py-2: 상하 padding
            - text-white: 글자 흰색
            - bg-black: 배경 검정
            - rounded-md: 테두리 둥글게
            - hover:bg-gray-700: 마우스 올렸을 때 회색 배경으로 변경 */}
                </div>
            </form>
        </section>
    );
};

export default UploadProductPage;
