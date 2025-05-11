// React 훅과 필요한 컴포넌트들을 import
import React, { useEffect, useState } from "react";
import CheckBox from "./Sections/CheckBox"; // 대륙 필터용 체크박스 컴포넌트
import RadioBox from "./Sections/RadioBox"; // 가격 필터용 라디오박스 컴포넌트
import SearchInput from "./Sections/SearchInput"; // 검색창 컴포넌트
import CardItem from "./Sections/CardItem"; // 상품 카드 표시 컴포넌트
import axiosInstance from "../../utils/axios"; // 설정된 Axios 인스턴스 import
import { continents, prices } from "../../utils/filterData"; // 필터용 데이터들 import

// 메인 랜딩 페이지 컴포넌트 정의
const LandingPage = () => {
    const limit = 4; // 한 번에 불러올 상품 개수
    const [searchTerm, setSearchTerm] = useState(""); // 검색어 상태
    const [products, setProducts] = useState([]); // 화면에 표시될 상품 리스트
    const [skip, setSkip] = useState(0); // 페이징을 위한 skip 수치
    const [hasMore, setHasMore] = useState(false); // 더 불러올 상품이 있는지 여부
    const [filters, setFilters] = useState({
        // 필터 상태 (대륙, 가격)
        continents: [],
        price: [],
    });

    // 페이지가 처음 렌더링될 때 한 번만 실행되는 fetch 호출
    useEffect(() => {
        fetchProducts({ skip, limit });
    }, []);

    // 상품을 불러오는 함수: 초기 로딩 / 더 보기 / 필터링 / 검색 모두 대응
    const fetchProducts = async ({
        skip,
        limit,
        loadMore = false,
        filters = {},
        searchTerm = "",
    }) => {
        const params = {
            skip,
            limit,
            filters,
            searchTerm,
        };

        try {
            const response = await axiosInstance.get("/products", { params });

            if (loadMore) {
                // 더 보기 클릭 시 기존 리스트에 추가
                setProducts([...products, ...response.data.products]);
            } else {
                // 초기 로딩이나 필터링 시 새 리스트로 교체
                setProducts(response.data.products);
            }
            // 서버 응답에 따라 더 불러올 상품이 있는지 판단
            setHasMore(response.data.hasMore);
        } catch (error) {
            console.error(error); // 에러 로그 출력
        }
    };

    // "더 보기" 버튼 클릭 시 호출되는 함수
    const handleLoadMore = () => {
        const body = {
            skip: skip + limit, // 다음 페이지 skip 수치
            limit,
            loadMore: true, // 더 보기 모드로 설정
            filters,
            searchTerm,
        };
        fetchProducts(body); // 새로운 상품 요청
        setSkip(skip + limit); // skip 수치 업데이트
    };

    // 필터 적용 시 실행되는 함수
    const handleFilters = (newFilteredData, category) => {
        const newFilters = { ...filters }; // 기존 필터 복사
        newFilters[category] = newFilteredData; // 필터 갱신
        if (category === "price") {
            const priceValues = handlePrice(newFilteredData); // 가격 범위 변환
            newFilters[category] = priceValues;
        }
        showFilteredResults(newFilters); // 필터 결과 보여주기
        setFilters(newFilters); // 필터 상태 저장
    };

    // 선택된 가격 id를 실제 가격 범위 배열로 변환
    const handlePrice = (value) => {
        let array = [];
        for (let key in prices) {
            if (prices[key]._id === parseInt(value, 10)) {
                array = prices[key].array; // 가격 범위 배열 반환
            }
        }
        return array;
    };

    // 필터링 후 상품 요청
    const showFilteredResults = (filters) => {
        const body = {
            skip: 0,
            limit,
            filters,
            searchTerm,
        };
        fetchProducts(body); // 필터 적용된 상품 요청
        setSkip(0); // 첫 페이지로 리셋
    };

    // 검색창에서 입력할 때마다 호출되는 함수
    const handleSearchTerm = (event) => {
        const body = {
            skip: 0,
            limit,
            filters,
            searchTerm: event.target.value,
        };
        setSkip(0); // 페이지 리셋
        setSearchTerm(event.target.value); // 검색어 저장
        fetchProducts(body); // 검색 결과 요청
    };

    return (
        <section>
            {/* 타이틀 */}
            <div className="text-center m-7">
                <h2 className="text-2xl">買い物テスト</h2>
            </div>

            {/* 필터 UI (좌측: 대륙 체크박스 / 우측: 가격 라디오박스) */}
            <div className="flex gap-3">
                <div className="w-1/2">
                    <CheckBox
                        continents={continents}
                        checkedContinents={filters.continents}
                        onFilters={(filters) =>
                            handleFilters(filters, "continents")
                        }
                    />
                </div>
                <div className="w-1/2">
                    <RadioBox
                        prices={prices}
                        checkedPrice={filters.price}
                        onFilters={(filters) => handleFilters(filters, "price")}
                    />
                </div>
            </div>

            {/* 검색창 */}
            <div className="flex justify-end mb-3">
                <SearchInput
                    searchTerm={searchTerm}
                    onSearch={handleSearchTerm}
                />
            </div>

            {/* 상품 카드 리스트 */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {products.map((product) => (
                    <CardItem product={product} key={product._id} />
                ))}
            </div>

            {/* 더 보기 버튼 (hasMore가 true일 때만 노출) */}
            {hasMore && (
                <div className="flex justify-center mt-5">
                    <button
                        onClick={handleLoadMore}
                        className="px-4 py-2 mt-5 text-white bg-black rounded-md hover:bg-gray-500"
                    >
                        더 보기
                    </button>
                </div>
            )}
        </section>
    );
};

// 컴포넌트 export
export default LandingPage;
