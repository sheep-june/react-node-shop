import React from "react";
// React를 사용하기 위해 import

const CheckBox = ({ continents, checkedContinents, onFilters }) => {
    // props로 세 가지 값을 받음
    // 1. continents: 체크박스로 표시할 대륙 리스트 (배열)
    // 2. checkedContinents: 현재 체크된 대륙 ID 리스트 (배열)
    // 3. onFilters: 상위 컴포넌트에서 전달받은 필터 적용 함수

    const handleToggle = (continentId) => {
        // 사용자가 특정 checkbox를 클릭했을 때 호출되는 함수
        // continentId는 클릭된 항목의 고유 ID

        const currentIndex = checkedContinents.indexOf(continentId);
        // 현재 클릭된 대륙 ID가 이미 선택된 항목인지 검사

        const newChecked = [...checkedContinents];
        // 기존 선택된 항목을 복사해서 수정할 배열 생성

        if (currentIndex === -1) {
            newChecked.push(continentId);
            // 기존에 없으면 추가 (선택된 것)
        } else {
            newChecked.splice(currentIndex, 1);
            // 이미 있었으면 제거 (선택 해제한 것)
        }

        onFilters(newChecked);
        // 변경된 배열을 상위 컴포넌트에 전달해서 필터링 적용
    };

    return (
        <div className="p-2 mb-3 bg-gray-100 rounded-md">
            {/* 박스 스타일: 패딩, 마진, 회색 배경, 둥근 테두리 */}

            {continents?.map((continent) => (
                // continents 배열을 반복하며 각 대륙 항목에 대한 checkbox 렌더링
                <div key={continent._id}>
                    <input
                        type="checkbox"
                        onChange={() => handleToggle(continent._id)} //checkbox 클릭 시 handleToggle 실행
                        checked={
                            checkedContinents.indexOf(continent._id) === -1 // 해당 항목이 선택된 상태인지 확인해서 체크 여부 설정
                                ? false
                                : true
                        }
                    />{" "}
                    <label>{continent.name}</label>
                    {/* 대륙 이름 표시 */}
                </div>
            ))}
        </div>
    );
};

export default CheckBox;
