import React from "react";

const RadioBox = ({ prices, checkedPrice, onFilters }) => {
    // props로 3개 받음:
    // - prices: 가격 구간 리스트 (배열)
    // - checkedPrice: 현재 선택된 가격의 value (array가 아닌 _id)
    // - onFilters: 라디오 선택 시 호출할 상위 함수 (필터 적용용)

    return (
        <div className="p-2 mb-3 bg-gray-100 rounded-md">
            {/* Tailwind로 스타일 설정: 패딩, 아래 마진, 회색 배경, 둥근 모서리 */}

            {prices?.map((price) => (
                // 가격 배열을 반복해서 각각 라디오 버튼 생성
                <div key={price._id}>
                    <input
                        checked={checkedPrice === price.array}
                        // 현재 선택된 가격이 이 항목과 일치하는지 확인 (※ 여긴 논리상 오류가 있음, 아래 참고)

                        onChange={(e) => onFilters(e.target.value)}
                        // 선택이 변경되면 선택한 price._id를 상위 컴포넌트에 전달

                        type="radio"
                        // 라디오 버튼 타입 지정 (하나만 선택 가능)

                        id={price._id}
                        // <label htmlFor>로 연결할 ID

                        value={price._id}
                        // 선택된 값으로 전달할 _id
                    />{" "}
                    <label htmlFor={price._id}>{price.name}</label>
                </div>
            ))}
        </div>
    );
};

export default RadioBox;
