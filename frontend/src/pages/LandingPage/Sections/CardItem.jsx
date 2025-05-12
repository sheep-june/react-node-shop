// React의 기본 컴포넌트 기능을 사용하기 위한 import
import React from "react";

// 페이지 이동을 위한 Link 컴포넌트 import (SPA에서 새로고침 없이 이동 가능)
import { Link } from "react-router-dom";

// 상품 이미지 슬라이더 컴포넌트 import (여러 장의 이미지를 순차적으로 보여줌)
import ImageSlider from "../../../components/ImageSlider";

// 상품 카드 컴포넌트 정의
const CardItem = ({ product }) => {
  // 부모 컴포넌트에서 전달받은 product 객체를 구조 분해하여 사용

    return (
        <div className="border-[1px] border-gray-300">
            {/* 카드 전체 컨테이너 */}
            {/* border-[1px]: 테두리 두께를 1px로 설정 */}
            {/* border-gray-300: 테두리 색상을 연한 회색 (#D1D5DB)으로 설정 */}

            <ImageSlider images={product.images} />
            {/* 상품 이미지 배열을 props로 전달 */}
            {/* 여러 장의 이미지를 슬라이드 형태로 출력 */}

            <Link to={`/product/${product._id}`}>
                {/* 상품 상세 페이지로 이동할 수 있는 링크 */}
                {/* to 속성: 이동할 경로를 지정 (상품 ID를 포함한 동적 라우팅) */}

                <p className="p-1">{product.title}</p>
                {/* 상품 제목 출력 */}
                {/* p-1: 내부 여백(padding) 0.25rem */}

                <p className="p-1">{product.continents}</p>
                {/* 상품의 대륙 정보 출력 (예: 1이면 Asia 등으로 매핑되어야 함) */}

                <p className="p-1 text-xs text-gray-500">{product.price}원</p>
                {/* 상품 가격 출력 */}
                {/* p-1: 패딩 0.25rem */}
                {/* text-xs: 폰트 크기 매우 작게 (0.75rem) */}
                {/* text-gray-500: 글자색 회색 (#6B7280) */}
            </Link>
        </div>
    );
};

export default CardItem;
