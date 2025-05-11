import React, { useEffect, useState } from "react";
// React 기본, 그리고 사이드 이펙트 처리용 useEffect, 상태값 관리용 useState

import { useDispatch, useSelector } from "react-redux";
// Redux의 dispatch와 전역 상태 값 접근용 useSelector

import {
    getCartItems,
    payProducts,
    removeCartItem,
} from "../../store/thunkFunctions";
// 장바구니 관련 API 처리 함수들 가져옴

import CartTable from "./Sections/CartTable";
// 장바구니 항목들을 테이블 형식으로 출력하는 하위 컴포넌트

const CartPage = () => {
    const userData = useSelector((state) => state.user?.userData);
    // Redux store에서 로그인된 사용자 정보 가져옴

    const cartDetail = useSelector((state) => state.user?.cartDetail);
    // 장바구니 안에 담긴 상품의 상세 정보 목록 가져옴

    const dispatch = useDispatch();
    // thunk dispatch 함수

    const [total, setTotal] = useState(0);
    // 장바구니 총 금액을 저장하는 로컬 상태

    useEffect(() => {
        let cartItemIds = [];

        if (userData?.cart && userData.cart.length > 0) {
            // 유저의 장바구니에 항목이 있다면

            userData.cart.forEach((item) => {
                cartItemIds.push(item.id);
                // 각 상품의 ID만 추출하여 배열에 저장
            });

            const body = {
                cartItemIds,
                userCart: userData.cart,
                // ID + 수량 정보를 함께 전달 (수량 병합 용도)
            };

            dispatch(getCartItems(body));
            // 상품 상세정보를 가져오기 위한 thunk 요청
        }
    }, [dispatch, userData]);
    // userData가 바뀔 때마다 실행됨

    useEffect(() => {
        calculateTotal(cartDetail);
        // 장바구니 상세 목록이 변경되면 합계 다시 계산
    }, [cartDetail]);

    const calculateTotal = (cartItems) => {
        let total = 0;
        cartItems.map((item) => (total += item.price * item.quantity));
        // 각 상품의 가격 * 수량을 누적해서 합계 계산

        setTotal(total);
        // 상태 저장
    };

    const handleRemoveCartItem = (productId) => {
        dispatch(removeCartItem(productId));
        // 특정 상품 ID를 제거하는 thunk 실행
    };

    const handlePaymentClick = () => {
        dispatch(payProducts({ cartDetail }));
        // 현재 장바구니 상품들을 결제하는 thunk 실행
    };

    return (
        <section>
            {/* 전체 장바구니 페이지 섹션을 감싸는 태그 */}

            <div className="text-center m-7">
                {/* 페이지 상단 제목 영역. 가운데 정렬 + 마진 */}
                <h2 className="text-2xl">나의 장바구니</h2>
                {/* 제목 텍스트 */}
            </div>

            {cartDetail?.length > 0 ? (
                // 장바구니에 상품이 하나라도 있으면

                <>
                    <CartTable
                        products={cartDetail}
                        onRemoveItem={handleRemoveCartItem}
                    />
                    {/* 장바구니 목록을 테이블 형식으로 출력하는 컴포넌트 호출 */}

                    <div className="mt-10">
                        {/* 결제 정보 영역 - 위에서 여백 줌 */}

                        <p>
                            <span className="font-bold">합계:</span>
                            {/* '합계:' 텍스트 굵게 표시 */}
                            {total} 원{/* 총 금액 출력 */}
                        </p>

                        <button
                            className="px-4 py-2 mt-5 text-white bg-black rounded-md hover:bg-gray-500"
                            // 패딩 + 배경색 + 흰 글씨 + 호버 효과

                            onClick={handlePaymentClick}
                            // 클릭 시 결제 처리 함수 실행
                        >
                            결제하기
                            {/* 버튼 내부 텍스트 */}
                        </button>
                    </div>
                </>
            ) : (
                // 장바구니에 아무것도 없으면

                <p>장바구니가 비었습니다.</p>
                // 텍스트로 빈 장바구니 표시
            )}
        </section>
    );
};

export default CartPage;
