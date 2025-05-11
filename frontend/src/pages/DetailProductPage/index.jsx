// React에서 컴포넌트를 만들고, 상태 및 생명주기 관리 훅을 불러옵니다
import React, { useEffect, useState } from "react";

// react-router-dom에서 URL 파라미터를 추출할 수 있는 훅을 불러옵니다
import { useParams } from "react-router-dom";

// 서버와 통신을 위한 axios 인스턴스를 불러옵니다
import axiosInstance from "../../utils/axios";

// 상품 상세 페이지에서 사용할 이미지 출력 컴포넌트를 불러옵니다
import Productimage from "./Sections/Productimage";

// 상품의 텍스트 정보(가격, 설명 등)를 출력하는 컴포넌트를 불러옵니다
import ProductInfo from "./Sections/ProductInfo";

// 상품 상세 페이지 컴포넌트 정의
const DetailProductPage = () => {
    // 현재 URL에서 productId 값을 추출합니다 (예: /product/123 → productId: "123")
    const { productId } = useParams();

    // 서버에서 받아온 상품 데이터를 저장할 상태 변수입니다. 초기값은 null입니다.
    const [product, setProduct] = useState(null);

    // 컴포넌트가 처음 렌더링되거나 productId가 변경될 때 실행되는 함수입니다
    useEffect(() => {
        // 비동기 함수 정의 (async/await 사용)
        async function fetchProduct() {
            try {
                // 서버에 상품 정보를 요청합니다 (단일 상품 모드: type=single)
                const response = await axiosInstance.get(
                    `/products/${productId}?type=single`
                );
                // 응답 데이터 중 첫 번째 상품 객체를 상태에 저장합니다
                setProduct(response.data[0]);
                // (선택) 콘솔에 응답 전체를 출력해 확인합니다
                console.log(response);
            } catch (error) {
                // 에러가 발생했을 경우 콘솔에 에러를 출력합니다
                console.error(error);
            }
        }

        // 위에서 정의한 비동기 함수 실행
        fetchProduct();
    }, [productId]); // productId가 변경될 경우 다시 실행됩니다

    // 아직 상품 데이터가 로딩되지 않았다면 렌더링하지 않고 null을 반환합니다
    if (!product) return null;

    // 상품 데이터를 모두 받아왔을 때 렌더링되는 HTML 구조
    return (
        <section>
            {/* 제목 영역 - 상품명을 중앙 정렬하여 출력 */}
            <div className="text-center">
                <h1 className="p-4 text-2xl">{product.title}</h1>
            </div>

            {/* 상품 본문 영역 - 좌우 2열로 나눔 */}
            <div className="flex gap-4">
                <div className="w-1/2">
                    {/* 왼쪽 영역: 이미지 출력 */}
                    <Productimage product={product} />
                </div>
                <div className="w-1/2">
                    {/* 오른쪽 영역: 상세 정보 출력 */}
                    <ProductInfo product={product} />
                </div>
            </div>
        </section>
    );
};

export default DetailProductPage;
