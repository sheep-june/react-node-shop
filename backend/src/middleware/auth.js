const jwt = require("jsonwebtoken");
// JWT(JSON Web Token)를 처리하기 위한 라이브러리를 불러온다.
// 이 라이브러리를 통해 토큰을 생성하거나 검증할 수 있다.

const User = require("../models/User");
// 사용자 정보를 DB에서 조회하기 위해 Mongoose 모델을 불러온다.
// 이 모델은 MongoDB의 users 컬렉션과 연결되어 있다.

let auth = async (req, res, next) => {
    // 인증 미들웨어 정의.
    // 사용자가 보호된 라우트에 접근하려고 할 때 이 미들웨어가 실행된다.
    // 토큰이 유효한지 확인하고, 유효하면 해당 사용자의 정보를 req.user에 담아 다음 단계로 넘긴다.

    const authHeader = req.headers["authorization"];
    // 클라이언트가 요청할 때 헤더에 담은 Authorization 값을 가져온다.
    // 예: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6..."

    const token = authHeader && authHeader.split(" ")[1];
    // Authorization 헤더가 존재하면, "Bearer 토큰값" 중에서 토큰 부분만 추출한다.
    // split(' ')으로 나누면 ["Bearer", "토큰값"] → [1]이 토큰임.

    if (token === null) return res.sendStatus(401);
    // 토큰이 존재하지 않으면 인증되지 않은 요청이므로 401 Unauthorized 응답을 보낸다.

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        // 토큰이 유효한지 검증한다.
        // 유효하면 decode 객체에 우리가 토큰 만들 때 넣었던 payload가 들어있음 (예: { userId: "xxxx" })

        const user = await User.findOne({ _id: decode.userId });
        // 토큰에서 추출한 userId를 바탕으로 DB에서 해당 사용자를 찾는다.
        // 토큰 자체는 유효하지만, DB에 사용자가 없을 수도 있기 때문에 한번 더 체크.

        if (!user) {
            // DB에 사용자가 존재하지 않으면 토큰은 조작된 것이거나 유효하지 않음.
            return res.status(400).send("올바르지 않은 토큰입니다.");
        }

        req.user = user;
        // 인증이 완료되었으므로 사용자 정보를 req.user에 담는다.
        // 이후 라우터에서 req.user를 통해 로그인한 사용자 정보를 접근할 수 있다.

        next();
        // 미들웨어 처리를 마쳤으니 다음 단계로 넘긴다.
    } catch (error) {
        next(error);
        // 토큰이 유효하지 않거나 다른 오류가 발생했을 경우, 에러를 다음 에러 처리기로 넘긴다.
    }
};

module.exports = auth;
// 이 미들웨어 함수를 외부에서 사용할 수 있도록 내보낸다.
// routes 폴더에서 특정 라우트에 이 인증 미들웨어를 적용할 수 있다.
