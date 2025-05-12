// React의 기본 훅(useState, useEffect)과 컴포넌트 기능을 사용하기 위한 import
import React, { useEffect, useState } from "react";

// 대륙 필터용 체크박스 컴포넌트 import
import CheckBox from "./Sections/CheckBox";

// 가격 필터용 라디오 버튼 컴포넌트 import
import RadioBox from "./Sections/RadioBox";

// 상품 검색 입력창 컴포넌트 import
import SearchInput from "./Sections/SearchInput";

// 각각의 상품을 보여주는 카드 컴포넌트 import
import CardItem from "./Sections/CardItem";

// API 호출을 위한 axios 인스턴스 import (기본 URL 및 설정이 미리 적용되어 있음)
import axiosInstance from "../../utils/axios";

// 대륙 및 가격 필터 데이터 상수 import
import { continents, prices } from "../../utils/filterData";

// 랜딩 페이지 컴포넌트 정의
const LandingPage = () => {
    const limit = 4; // 한 번에 불러올 상품 개수

    const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
    const [products, setProducts] = useState([]); // 화면에 출력할 상품 목록 상태
    const [skip, setSkip] = useState(0); // 몇 번째 상품부터 불러올지 결정하는 skip 값
    const [hasMore, setHasMore] = useState(false); // 더 불러올 상품이 있는지 여부 판단
    const [filters, setFilters] = useState({
        continents: [], // 대륙 필터 상태
        price: [], // 가격 필터 상태
    });

    // 컴포넌트가 처음 마운트될 때 상품 목록을 요청
    useEffect(() => {
        fetchProducts({ skip, limit });
    }, []);

    // 상품 목록을 서버로부터 불러오는 함수
    const fetchProducts = async ({
        skip,
        limit,
        loadMore = false,
        filters = {},
        searchTerm = "",
    }) => {
        const params = {
            skip, // 불러올 시작 index
            limit, // 몇 개 불러올지
            filters, // 필터 조건
            searchTerm, // 검색어
        };

        try {
            const response = await axiosInstance.get("/products", { params });

            if (loadMore) {
                // '더 보기' 버튼으로 불러올 경우 기존 목록 뒤에 추가
                setProducts([...products, ...response.data.products]);
            } else {
                // 필터링이나 초기 로딩일 경우 새 목록으로 교체
                setProducts(response.data.products);
            }

            // 서버 응답으로 더 불러올 데이터가 있는지 여부 저장
            setHasMore(response.data.hasMore);
        } catch (error) {
            console.error(error); // 에러 발생 시 콘솔에 출력
        }
    };

    // "더 보기" 버튼 클릭 시 실행되는 함수
    const handleLoadMore = () => {
        const body = {
            skip: skip + limit, // 현재 skip 값에 limit을 더해 다음 페이지의 시작 위치 계산
            limit, // 한 번에 불러올 상품 개수는 동일하게 유지
            loadMore: true, // fetchProducts 함수에서 더 보기 모드로 처리되도록 설정
            filters, // 현재 적용된 필터 조건 유지
            searchTerm, // 현재 검색어 유지
        };

        fetchProducts(body); // 상품 목록을 추가로 요청
        setSkip(skip + limit); // skip 상태를 업데이트하여 다음 요청 시 기준을 변경
    };

    // 필터가 변경될 때 호출되는 함수
    const handleFilters = (newFilteredData, category) => {
        const newFilters = { ...filters }; // 기존 필터 상태를 복사
        newFilters[category] = newFilteredData; // 해당 필터 카테고리만 새로운 값으로 업데이트

        if (category === "price") {
            const priceValues = handlePrice(newFilteredData); // 선택된 가격 id를 실제 범위 배열로 변환
            newFilters[category] = priceValues; // 변환된 가격 범위로 필터 업데이트
        }

        showFilteredResults(newFilters); // 필터가 적용된 상품 요청
        setFilters(newFilters); // 필터 상태 저장
    };

    // 선택된 가격 ID를 실제 가격 범위 배열로 변환하는 함수
    const handlePrice = (value) => {
        let array = []; // 변환된 가격 범위를 저장할 배열

        for (let key in prices) {
            // prices는 filterData에서 import한 가격 리스트 (각 항목은 id와 array 포함)
            if (prices[key]._id === parseInt(value, 10)) {
                // 선택된 가격의 ID와 일치하는 항목을 찾음
                array = prices[key].array; // 해당 가격 ID에 해당하는 가격 범위 배열을 가져옴
            }
        }

        return array; // 변환된 가격 범위 배열을 반환하여 필터에 사용
    };

    // 필터링 후 상품 목록 요청을 실행하는 함수
    const showFilteredResults = (filters) => {
        const body = {
            skip: 0, // 필터링 시 항상 첫 페이지부터 시작
            limit, // 한 번에 가져올 상품 수
            filters, // 적용할 필터 조건
            searchTerm, // 현재 검색어 유지
        };

        fetchProducts(body); // 위 조건을 바탕으로 서버에 상품 목록 요청
        setSkip(0); // 페이지 인덱스를 0으로 초기화
    };

    // 검색창에서 입력할 때마다 실행되는 함수
    const handleSearchTerm = (event) => {
        const body = {
            skip: 0, // 검색도 첫 페이지부터 다시 시작
            limit, // 요청 개수 동일
            filters, // 현재 필터 상태 유지
            searchTerm: event.target.value, // 입력된 검색어로 상태 업데이트
        };

        setSkip(0); // 페이지 초기화
        setSearchTerm(event.target.value); // 검색어 상태 저장
        fetchProducts(body); // 검색 결과를 서버로부터 요청
    };

    return (
        <section>
            {/* 전체 랜딩 페이지 내용을 감싸는 시맨틱 섹션 요소 */}

            <div className="text-center m-7">
                {/* 페이지 상단 제목 영역 */}
                {/* text-center: 가운데 정렬 */}
                {/* m-7: 상하좌우 외부 여백 약 1.75rem */}
                <h2 className="text-2xl">買い物テスト</h2>
                {/* text-2xl: 텍스트 크기 약 1.5rem */}
            </div>

            <div className="flex gap-3">
                {/* 필터 영역을 좌우 2열로 정렬 */}
                {/* flex: 가로 정렬 */}
                {/* gap-3: 좌우 요소 간 간격 약 0.75rem */}

                <div className="w-1/2">
                    {/* 왼쪽 영역: 대륙 체크박스 필터 */}
                    {/* w-1/2: 전체 너비의 절반 사용 */}
                    <CheckBox
                        continents={continents}
                        checkedContinents={filters.continents}
                        onFilters={(filters) =>
                            handleFilters(filters, "continents")
                        }
                    />
                    {/* CheckBox 컴포넌트에 대륙 리스트와 현재 체크 상태 전달 */}
                    {/* 필터 변경 시 handleFilters 함수 실행 */}
                </div>

                <div className="w-1/2">
                    {/* 오른쪽 영역: 가격 라디오박스 필터 */}
                    <RadioBox
                        prices={prices}
                        checkedPrice={filters.price}
                        onFilters={(filters) => handleFilters(filters, "price")}
                    />
                    {/* RadioBox 컴포넌트에 가격 리스트와 선택 상태 전달 */}
                    {/* 필터 변경 시 handleFilters 함수 실행 */}
                </div>
            </div>

            <div className="flex justify-end mb-3">
                {/* 검색창 영역 */}
                {/* justify-end: 오른쪽 정렬 */}
                {/* mb-3: 하단 여백 약 0.75rem */}
                <SearchInput
                    searchTerm={searchTerm}
                    onSearch={handleSearchTerm}
                />
                {/* 현재 입력된 검색어 상태 전달 */}
                {/* onSearch 이벤트 발생 시 handleSearchTerm 함수 실행 */}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {/* 상품 카드 리스트 영역 */}
                {/* grid: 그리드 레이아웃 */}
                {/* grid-cols-2: 기본 2열 */}
                {/* gap-4: 카드 간 간격 1rem */}
                {/* sm:grid-cols-4: 화면이 작지 않으면 4열로 변경 */}

                {products.map((product) => (
                    <CardItem product={product} key={product._id} />
                ))}

                {/* 상품 객체를 CardItem 컴포넌트에 전달 */}
                {/* key는 React 최적화를 위한 고유 식별자 */}
            </div>

            {hasMore && (
                <div className="flex justify-center mt-5">
                    {/* 더 보기 버튼 영역 */}
                    {/* flex + justify-center: 중앙 정렬 */}
                    {/* mt-5: 위쪽 여백 1.25rem */}
                    <button
                        onClick={handleLoadMore}
                        className="px-4 py-2 mt-5 text-white bg-black rounded-md hover:bg-gray-500"
                    >
                        더 보기
                    </button>
                    {/* onClick: 클릭 시 handleLoadMore 함수 실행 */}
                    {/* className:
            - px-4: 좌우 padding 1rem
            - py-2: 상하 padding 0.5rem
            - mt-5: 버튼 위 여백
            - text-white: 글자색 흰색
            - bg-black: 배경 검정색
            - rounded-md: 둥근 테두리
            - hover:bg-gray-500: 마우스 오버 시 회색 배경 */}
                </div>
            )}
        </section>
    );
};

// 컴포넌트 export
export default LandingPage;
