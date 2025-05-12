// React의 기본 컴포넌트 기능을 사용하기 위한 import
import React from "react";

// 체크박스 필터 컴포넌트 정의
const CheckBox = ({ continents, checkedContinents, onFilters }) => {
    // props로 세 가지 인자를 전달받음:
    // continents: 대륙 항목 리스트 (예: [{_id: 1, name: 'Asia'}, ...])
    // checkedContinents: 현재 체크된 대륙 ID 배열
    // onFilters: 체크 상태가 변경될 때 상위 컴포넌트에 전달하는 콜백 함수

    const handleToggle = (continentId) => {
        // 특정 체크박스를 클릭했을 때 실행되는 함수
        // continentId: 클릭된 항목의 ID

        const currentIndex = checkedContinents.indexOf(continentId);
        // 클릭된 ID가 현재 선택된 항목인지 확인 (-1이면 미선택 상태)

        const newChecked = [...checkedContinents];
        // 기존 선택 배열을 복사하여 새로운 배열 생성

        if (currentIndex === -1) {
            newChecked.push(continentId);
            // 선택되지 않았던 항목 → 추가
        } else {
            newChecked.splice(currentIndex, 1);
            // 이미 선택된 항목 → 제거
        }

        onFilters(newChecked);
        // 새로운 선택 배열을 상위 컴포넌트로 전달
    };

    return (
        <div className="p-2 mb-3 bg-gray-100 rounded-md">
            {/* 체크박스 전체 영역을 감싸는 박스 */}
            {/* p-2: 내부 여백 0.5rem */}
            {/* mb-3: 아래쪽 외부 여백 0.75rem */}
            {/* bg-gray-100: 밝은 회색 배경 (#F3F4F6) */}
            {/* rounded-md: 둥근 테두리 중간 크기 */}

            {continents?.map((continent) => (
                <div key={continent._id}>
                    {/* 각 대륙 항목을 출력하는 블록 */}
                    {/* key: React의 고유 식별자 지정 */}

                    <input
                        type="checkbox"
                        onChange={() => handleToggle(continent._id)}
                        checked={
                            checkedContinents.indexOf(continent._id) !== -1
                        }
                    />
                    {/* type="checkbox": 체크박스 입력 필드 */}
                    {/* onChange: 체크 상태가 변경될 때 handleToggle 실행 */}
                    {/* checked: 현재 해당 대륙 ID가 선택 목록에 포함되어 있는지 여부 */}

                    <label>{continent.name}</label>
                    {/* 대륙 이름 텍스트 출력 */}
                </div>
            ))}
        </div>
    );
};

export default CheckBox;
