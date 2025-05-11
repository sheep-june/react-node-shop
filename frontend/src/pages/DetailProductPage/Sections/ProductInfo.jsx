// React 기본 import
import React from "react";

// Redux에서 액션을 발생시키기 위한 dispatch 함수를 가져옵니다
import { useDispatch } from "react-redux";

// 상품을 장바구니에 추가하기 위한 thunk 함수 import
import { addToCart } from "../../../store/thunkFunctions";

// 상품 정보를 표시하고 장바구니에 추가하는 기능을 제공하는 컴포넌트입니다
const ProductInfo = ({ product }) => {
    // Redux 액션을 발생시키기 위한 dispatch 함수 초기화
    const dispatch = useDispatch();

    // '장바구니로' 버튼 클릭 시 호출되는 함수
    const handleClick = () => {
        // Redux 스토어에 addToCart 비동기 액션을 전달 (payload: 상품 ID)
        dispatch(addToCart({ productId: product._id }));
    };

    // 상품 정보를 화면에 렌더링
    return (
        <div>
            {/* 제목 텍스트 */}
            <p className="text-xl text-bold">상품 정보</p>

            {/* 상품의 가격, 판매량, 설명을 리스트로 출력 */}
            <ul>
                <li>
                    <span className="font-semibold text-gray-900">가격:</span>{" "}
                    {product.price} 원
                </li>
                <li>
                    <span className="font-semibold text-gray-900">
                        팔린 개수:
                    </span>{" "}
                    {product.sold} 개
                </li>
                <li>
                    <span className="font-semibold text-gray-900">설명:</span>{" "}
                    {product.description}
                </li>
            </ul>

            {/* 장바구니 버튼 영역 */}
            <div className="mt-3">
                <button
                    onClick={handleClick} // 버튼 클릭 시 handleClick 실행
                    className="w-full px-4 py-2 text-white bg-black rounded-md hover:bg-gray-700"
                    // Tailwind CSS로 버튼 크기, 색상, 호버 효과 적용
                >
                    장바구니로
                </button>
            </div>
        </div>
    );
};

export default ProductInfo;
