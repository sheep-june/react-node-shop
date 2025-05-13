const { default: mongoose } = require("mongoose");
// mongoose 모듈을 불러온다.
// MongoDB와 연결된 데이터 모델을 정의하고 관리하기 위한 ODM(Object Data Modeling) 도구

const bcrypt = require("bcryptjs");
// 비밀번호를 암호화(해싱)하기 위한 bcrypt 라이브러리를 불러온다.
// 회원가입 시 비밀번호 저장을 안전하게 하기 위해 사용

const userSchema = mongoose.Schema({
    // 사용자(user)에 대한 데이터 구조를 정의한다.
    // 이 구조를 바탕으로 MongoDB의 users 컬렉션에 문서를 저장하게 된다.

    name: {
        type: String,
        maxLength: 50,
        // 사용자 이름 필드, 최대 50자까지 허용
    },

    email: {
        type: String,
        trim: true,
        unique: true,
        // 이메일은 중복을 허용하지 않는다 (unique)
        // trim은 앞뒤 공백을 자동으로 제거해준다
    },

    password: {
        type: String,
        minLength: 5,
        // 비밀번호 필드. 최소 5자 이상 입력해야 한다.
        // 실제 저장될 때는 bcrypt로 해시 처리됨
    },

    role: {
        type: Number,
        default: 0,
        // 사용자 권한을 구분하는 숫자
        // 0은 일반 사용자, 1 이상은 관리자 등으로 활용 가능
    },

    cart: {
        type: Array,
        default: [],
        // 사용자가 장바구니에 담은 상품들의 정보 배열
        // 결제 전까지 여기에 상품 정보들이 저장된다
    },

    history: {
        type: Array,
        default: [],
        // 결제 완료 후 구매 이력이 기록되는 배열
        // 과거 결제 내역을 관리하기 위해 사용된다
    },

    image: String,
    // 프로필 사진의 이미지 URL 또는 파일 경로를 문자열로 저장
});

userSchema.pre("save", async function (next) {
    // 'save' 이벤트 전에 실행되는 미들웨어 함수
    // 사용자가 저장되기 전에 특정 작업을 수행할 수 있다 (예: 비밀번호 해싱)

    let user = this;
    // this는 현재 저장하려는 사용자 문서를 의미한다

    if (user.isModified("password")) {
        // 사용자가 새로 생성되거나, 비밀번호 필드가 수정된 경우만 암호화 수행

        const salt = await bcrypt.genSalt(10);
        // bcrypt로 10 라운드짜리 솔트를 생성한다 (보안 강도)

        const hash = await bcrypt.hash(user.password, salt);
        // 사용자가 입력한 비밀번호를 해싱(salt 포함)한다

        user.password = hash;
        // 암호화된 비밀번호로 덮어쓴다 → 실제로 DB에 저장되는 건 해시값이다
    }

    next();
    // 다음 미들웨어로 넘긴다 (또는 저장 실행)
});

userSchema.methods.comparePassword = async function (plainPassword) {
    // 사용자 인스턴스에서 사용할 수 있는 메서드를 정의한다.
    // 입력된 비밀번호(plainPassword)가 저장된 해시된 비밀번호와 일치하는지 비교한다.

    let user = this;
    // this는 현재 로그인하려는 사용자 문서

    const match = await bcrypt.compare(plainPassword, user.password);
    // 사용자가 입력한 비밀번호를 기존 해시와 비교한다
    // true 또는 false 결과가 반환된다

    return match;
    // 결과 반환
};

const User = mongoose.model("User", userSchema);
// 위에서 정의한 스키마를 기반으로 User 모델을 생성한다.
// 이 모델은 MongoDB의 users 컬렉션과 연결된다

module.exports = User;
// 다른 파일에서도 이 모델을 사용할 수 있도록 내보낸다.
// 예: 회원가입, 로그인, 인증 처리 시 사용
