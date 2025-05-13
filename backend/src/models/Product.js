const { default: mongoose, Schema } = require("mongoose");
// Mongoose는 MongoDB와 연결된 데이터를 정의하고 관리할 수 있도록 도와주는 ODM 라이브러리이다.
// 여기서 mongoose 객체 전체와 그 안의 Schema 생성자만 따로 구조분해해서 불러온다.

const productSchema = mongoose.Schema(
    {
        // 상품(Product)에 대한 데이터 구조(스키마)를 정의한다.
        // 이 구조를 기준으로 MongoDB에 데이터가 저장된다.

        writer: {
            type: Schema.Types.ObjectId,
            ref: "User",
            // 이 상품을 등록한 사용자의 고유 ID를 저장한다.
            // ObjectId 타입이며, User 모델을 참조(ref)하고 있어 나중에 populate()로 유저 정보를 불러올 수 있다.
        },

        title: {
            type: String,
            maxLength: 30,
            // 상품의 제목 문자열
            // 최대 30자까지만 입력 가능하도록 제한
        },

        description: {
            type: String,
            // 상품에 대한 상세 설명을 저장하는 필드
            // 별도의 제한 없이 문자열로 저장
        },

        price: {
            type: Number,
            default: 0,
            // 상품 가격을 숫자로 저장
            // 따로 입력하지 않으면 기본값은 0으로 설정된다
        },

        images: {
            type: Array,
            default: [],
            // 상품 이미지 경로를 저장할 배열
            // 여러 장의 이미지가 저장될 수 있으므로 배열로 처리
            // 예: ["image1.jpg", "image2.jpg"]
        },

        sold: {
            type: Number,
            default: 0,
            // 지금까지 몇 개가 판매되었는지를 저장
            // 기본값은 0 → 상품 등록 시 초기값
            // 결제 시마다 수량이 증가
        },

        continents: {
            type: Number,
            default: 1,
            // 상품이 어떤 대륙(지역)에 해당하는지를 숫자로 저장
            // 예: 1 → Africa, 2 → Europe 등의 매핑을 프론트엔드에서 처리함
        },

        views: {
            type: Number,
            default: 0,
            // 해당 상품의 상세 페이지가 몇 번 조회되었는지를 기록
            // 페이지 열릴 때마다 이 숫자를 증가시키면 된다
        },
    },
    { timestamps: true }
);
// timestamps 옵션을 true로 설정하면 createdAt, updatedAt 필드가 자동으로 추가된다.
// 상품이 언제 생성되었고 마지막으로 수정되었는지 기록 가능

productSchema.index(
    {
        title: "text",
        description: "text",
    },
    {
        weight: {
            title: 5,
            description: 1,
        },
    }
);
// MongoDB에서 텍스트 검색을 위한 인덱스를 설정한다.
// title과 description에 대해 검색이 가능하도록 text 인덱스를 걸고,
// 검색 결과 순위에 영향을 주는 weight(가중치)를 설정한다.
// title이 더 중요하게 평가되도록 weight 5로 설정 → 검색 시 상단 노출 우선

const Product = mongoose.model("Product", productSchema);
// 위에서 정의한 스키마를 이용해 Product 모델을 만든다.
// 이 모델은 MongoDB의 products 컬렉션과 연결된다.

module.exports = Product;
// 다른 파일에서 이 Product 모델을 사용할 수 있도록 export 한다.
// 상품 생성, 조회, 수정, 삭제 등에서 이 모델을 활용한다.
