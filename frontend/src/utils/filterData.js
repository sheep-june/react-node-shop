const continents = [
    // 상품 필터용 '대륙' 목록 배열을 정의

    {
        _id: 1, // 아프리카 항목의 고유 ID
        name: "Africa", // 아프리카라는 이름으로 사용자에게 표시됨
    },

    {
        _id: 2, // 유럽 항목의 고유 ID
        name: "Europe", // 유럽이라는 이름으로 표시
    },

    {
        _id: 3, // 아시아 항목의 고유 ID
        name: "Asia", // 아시아라는 이름으로 표시
    },

    {
        _id: 4, // 북아메리카 항목의 고유 ID
        name: "North America", // 북아메리카라는 이름으로 표시
    },

    {
        _id: 5, // 남아메리카 항목의 고유 ID
        name: "South America", // 남아메리카라는 이름으로 표시
    },

    {
        _id: 6, // 오스트레일리아 항목의 고유 ID
        name: "Australia", // 오스트레일리아라는 이름으로 표시
    },

    {
        _id: 7, // 남극 항목의 고유 ID
        name: "Antarctica", // 남극이라는 이름으로 표시
    },
]; // continents 배열 끝

const prices = [ // 상품 가격 필터용 구간 목록 배열을 정의

    {
        _id: 0,        // '모두' 항목의 고유 ID
        name: "모두",  // 전체 상품 보기용 이름
        array: [],     // 범위 제한 없음 → 전체 선택
    },

    {
        _id: 1,            // 첫 번째 가격 구간의 고유 ID
        name: "0 ~ 1만원", // 사용자에게 표시될 가격 범위 이름
        array: [0, 10000], 
    },

    {
        _id: 2,
        name: "만원 ~ 5만원",
        array: [10000, 50000], 
    },

    {
        _id: 3,
        name: "5만원 ~ 10만원",
        array: [50000, 100000], 
    },

    {
        _id: 4,
        name: "10만원 ~ 50만원",
        array: [100000, 500000], 
    },

    {
        _id: 5,
        name: "50만원 이상",
        array: [500000, 90000000], 
    },

]; // prices 배열 끝


export { continents, prices }; 
// 위에서 정의한 두 배열을 다른 컴포넌트에서 사용할 수 있도록 export 함
