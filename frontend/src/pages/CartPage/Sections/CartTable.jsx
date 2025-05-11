import React from "react";

const CartTable = ({ products, onRemoveItem }) => {
    // props로 장바구니 상품 목록(products)과 삭제 콜백 함수(onRemoveItem) 전달받음

    const renderCartImage = (images) => {
        // 상품 이미지 배열에서 첫 번째 이미지를 렌더링하기 위한 함수

        if (images.length > 0) {
            // 이미지가 하나라도 있을 경우에만 실행

            let image = images[0];
            // 첫 번째 이미지 파일명 추출

            return `${import.meta.env.VITE_SERVER_URL}/${image}`;
            // .env에 정의된 백엔드 주소 + 이미지 경로를 조합해 실제 src URL 생성
        }
    };

    const renderItems =
        products.length > 0 && products.map((product) => (
            // 상품이 1개 이상 있으면 map으로 반복

            <tr key={product._id}>
                {/* 각 상품에 대한 테이블 행 (고유 ID로 key 지정) */}
                <td>
                    <img
                        className="w-[70px]"
                        alt="product"
                        src={renderCartImage(product.images)}
                    />
                </td>
                <td>{product.quantity} 개</td>
                <td>{product.price} 원</td>
                <td>
                    <button onClick={() => onRemoveItem(product._id)}>
                        {/* 삭제 버튼 클릭 시 해당 상품 ID로 삭제 요청 */}
                        지우기
                    </button>
                </td>
            </tr>
        ));

    return (
        <table className="w-full text-sm text-left text-gray-500">
            
            <thead className="border-[1px]">
                <tr>
                    <th>사진</th>
                    <th>개수</th>
                    <th>가격</th>
                    <th>삭제</th>
                </tr>
            </thead>

            <tbody>{renderItems}</tbody>
        </table>
    );
};

export default CartTable;
