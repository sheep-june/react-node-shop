import React from "react";
// React 기본 import

import { Link } from "react-router-dom";
// 페이지 이동을 위한 Link 컴포넌트 import (a 태그 역할을 함)

import ImageSlider from "../../../components/ImageSlider";
// 이미지 슬라이더 컴포넌트 import (상품 이미지를 여러 장 보여줄 수 있음)

const CardItem = ({ product }) => {
    // 상위 컴포넌트(LandingPage)에서 전달받은 product 객체를 구조 분해

    return (
        <div className="border-[1px] border-gray-300">
            {/* 카드 전체에 테두리 1px 회색 설정 (Tailwind CSS 사용) */}

            <ImageSlider images={product.images} />
            {/* 상품의 이미지 배열을 전달해서 이미지 슬라이더 출력 */}

            <Link to={`/product/${product._id}`}>
                {/* 해당 상품의 상세 페이지로 이동하는 링크 (동적 라우팅) */}

                <p className="p-1">{product.title}</p>
                {/* 상품 제목 표시, 패딩 1 */}

                <p className="p-1">{product.continents}</p>
                {/* 상품 대륙 정보 표시 (숫자 ID일 수도 있음 → 보통 이름으로 변환해서 쓰는 게 일반적) */}

                <p className="p-1 text-xs text-gray-500">{product.price}원</p>
                {/* 가격 표시, 작은 글씨, 회색 텍스트 */}
            </Link>
        </div>
    );
};

export default CardItem;
