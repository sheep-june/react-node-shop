const { default: mongoose } = require("mongoose");
// Mongoose는 MongoDB와 Node.js를 연결해주는 ODM(Object Data Modeling) 라이브러리이다.
// mongoose를 불러오고, 그 안에서 default export를 구조분해로 가져온다.

const paymentSchema = mongoose.Schema(
    {
        // 결제 정보를 저장할 MongoDB 컬렉션의 스키마를 정의한다.

        user: {
            type: Object,
            // 결제를 진행한 사용자에 대한 정보가 저장된다.
            // 별도로 참조 설정(ref)하지 않고, 사용자 정보 객체 자체를 그대로 저장한다.
            // 예: { _id, email, name } 등이 들어올 수 있다.
        },

        data: {
            type: Array,
            default: [],
            // 결제에 대한 부가 데이터들이 배열 형태로 저장된다.
            // 예: 결제 API에서 받은 영수증, 승인 정보 등
            // 기본값은 빈 배열로 설정된다.
        },

        product: {
            type: Array,
            default: [],
            // 어떤 상품들을 결제했는지를 저장하는 배열이다.
            // 하나의 결제에는 여러 개의 상품이 포함될 수 있으므로 배열로 설계
            // 상품의 id, 이름, 수량, 가격 등의 정보가 객체로 배열에 담긴다.
        },
    },
    { timestamps: true }
);
// { timestamps: true } 옵션을 넣으면 createdAt, updatedAt 필드가 자동으로 추가된다.
// 언제 결제가 생성되고 수정되었는지 기록할 수 있다.

const Payment = mongoose.model("Payment", paymentSchema);
// 위에서 정의한 스키마를 기반으로 "Payment"라는 이름의 모델을 생성한다.
// 이 모델은 MongoDB의 "payments" 컬렉션과 연결된다 (자동으로 소문자 복수형 변환됨).

module.exports = Payment;
// 이 모델을 외부에서 사용할 수 있도록 내보낸다.
// 예: 결제 기록 저장, 조회 시 이 모델을 사용
