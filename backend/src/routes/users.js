const express = require("express");
// Express 프레임워크를 불러온다. Node.js 서버 구축을 위한 핵심 라이브러리이다.

const User = require("../models/User");
// Mongoose로 정의된 User 모델을 불러온다. DB의 users 컬렉션과 연결된다.

const Product = require("../models/Product");
// 상품 정보를 담는 Product 모델을 불러온다. 결제 시 연동된다.

const Payment = require("../models/Payment");
// 결제 정보를 저장할 Payment 모델을 불러온다.

const router = express.Router();
// express.Router()를 호출해 라우터 인스턴스를 생성한다.
// 이 라우터에 각종 경로별 요청 처리를 정의하고, 이후 app.js에 등록된다.

const jwt = require("jsonwebtoken");
// JWT(Json Web Token)를 생성하고 검증하기 위한 라이브러리. 로그인 인증에 사용된다.

const auth = require("../middleware/auth");
// 사용자 인증 미들웨어를 불러온다. 로그인한 사용자만 접근 가능한 라우트에 사용된다.

const async = require("async");
// 비동기 처리를 순차적으로 실행할 수 있게 도와주는 유틸리티 라이브러리.
// forEach 순차 실행 등에서 사용됨 (예: payment 처리 시)

router.get("/auth", auth, async (req, res) => {
    // /auth 경로에 대한 GET 요청을 처리한다.
    // auth 미들웨어를 거친 후 실행되므로, 로그인된 사용자만 접근할 수 있다.
    // JWT를 통해 인증이 성공하면 req.user 객체가 만들어지며,
    // 그 정보를 응답으로 클라이언트에 제공한다.

    return res.status(200).json({
        id: req.user.id,
        // 사용자 ID를 응답에 포함한다.

        email: req.user.email,
        // 사용자 이메일 주소를 포함

        name: req.user.name,
        // 사용자 이름 포함

        role: req.user.role,
        // 사용자 역할(role)을 포함 (예: 일반 사용자, 관리자 등)

        image: req.user.image,
        // 사용자 프로필 이미지 정보

        cart: req.user.cart,
        // 사용자 장바구니(cart) 정보

        history: req.user.history,
        // 사용자 구매 이력(history) 정보
    });
});

router.post("/register", async (req, res, next) => {
    // 회원가입 요청을 처리하는 POST 라우터이다.
    // 클라이언트는 사용자 정보(name, email, password 등)를 req.body로 전송한다.

    try {
        const user = new User(req.body);
        // req.body를 기반으로 새로운 User 인스턴스를 생성한다.
        // User는 Mongoose 모델이며, DB 스키마에 따라 유효성 검사가 적용된다.

        await user.save();
        // 생성한 user 객체를 MongoDB에 저장한다.
        // 내부적으로 pre-save 훅에서 비밀번호 암호화 등이 처리될 수 있다.

        return res.sendStatus(200);
        // 회원가입 성공 시, 본문 없이 200 OK 상태 코드만 응답한다.
    } catch (error) {
        next(error);
        // 에러 발생 시 Express의 에러 처리 미들웨어로 전달한다.
    }
});

router.post("/login", async (req, res, next) => {
    // 로그인 요청을 처리하는 POST 라우터이다.
    // 클라이언트는 이메일(email)과 비밀번호(password)를 req.body로 전송한다.

    try {
        const user = await User.findOne({ email: req.body.email });
        // 사용자 이메일을 기준으로 DB에서 해당 사용자를 조회한다.
        // 사용자가 존재하지 않을 경우 null이 반환된다.

        if (!user) {
            return res.status(400).send("Auth failed, email not found");
            // 사용자가 존재하지 않으면 인증 실패 메시지를 반환한다.
            // 상태 코드는 400 Bad Request
        }

        const isMatch = await user.comparePassword(req.body.password);
        // 입력된 비밀번호가 사용자 계정의 해시된 비밀번호와 일치하는지 확인한다.
        // comparePassword는 User 모델에 정의된 인스턴스 메서드이다.

        if (!isMatch) {
            return res.status(400).send("Wrong password");
            // 비밀번호가 틀릴 경우 인증 실패 메시지를 반환한다.
        }

        const payload = {
            userId: user._id.toHexString(),
        };
        // JWT 토큰에 넣을 사용자 식별 정보를 payload 객체로 정의한다.
        // _id는 ObjectId이므로 toHexString()으로 문자열 변환한다.

        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        // jwt.sign()을 사용하여 액세스 토큰을 생성한다.
        // - payload: 토큰에 담을 데이터
        // - secret: 환경 변수에 저장된 비밀 키
        // - expiresIn: 토큰 유효 시간 (1시간)

        return res.json({ user, accessToken });
        // 로그인 성공 시 사용자 정보와 생성된 JWT 액세스 토큰을 함께 응답한다.
    } catch (error) {
        next(error);
        // 오류 발생 시 에러 처리 미들웨어로 넘긴다.
    }
});

router.post("/logout", auth, async (req, res, next) => {
    // 로그아웃 요청을 처리하는 POST 라우터이다.
    // auth 미들웨어를 거쳐 로그인된 사용자만 접근할 수 있다.

    try {
        return res.sendStatus(200);
        // 클라이언트에 200 OK 상태 코드를 반환한다.
        // 실제로 서버에서 JWT를 무효화하거나 세션을 삭제하는 처리는 없다.
        // 클라이언트가 브라우저 또는 앱에서 JWT 토큰을 제거하는 방식으로 로그아웃을 수행해야 한다.
    } catch (error) {
        next(error);
        // 에러가 발생할 경우 Express 에러 처리 미들웨어로 전달된다.
    }
});

router.post("/cart", auth, async (req, res, next) => {
    // POST 요청으로 사용자의 장바구니(cart)에 상품을 추가하는 기능이다.
    // auth 미들웨어를 통해 로그인한 사용자만 접근할 수 있다.
    // 클라이언트는 요청 본문(req.body)으로 productId를 전달해야 한다.

    try {
        // 먼저 User Collection에 해당 유저의 정보를 가져오기
        const userInfo = await User.findOne({ _id: req.user._id });
        // 인증된 사용자 ID(req.user._id)를 기준으로 DB에서 해당 사용자 정보를 조회한다.
        // 이때 사용자 문서 전체를 받아오며, cart 필드에 담긴 장바구니 상태도 함께 가져온다.

        // 가져온 정보에서 카트에다 넣으려 하는 상품이 이미 들어 있는지 확인
        let duplicate = false;
        // 동일 상품이 이미 장바구니에 들어있는지 여부를 저장하는 변수이다.
        // true일 경우 상품 수량을 증가시키고, false일 경우 새로 추가한다.

        userInfo.cart.forEach((item) => {
            if (item.id === req.body.productId) {
                duplicate = true;
            }
        });
        // cart 배열을 순회하면서 각 항목의 id와 요청된 productId를 비교한다.
        // 일치하는 상품이 하나라도 있으면 duplicate를 true로 설정한다.

        // 상품이 이미 있을 때
        if (duplicate) {
            const user = await User.findOneAndUpdate(
                { _id: req.user._id, "cart.id": req.body.productId },
                { $inc: { "cart.$.quantity": 1 } },
                { new: true }
            );
            // cart 배열 내에서 조건(cart.id가 일치하는 항목)을 만족하는 요소의 quantity 값을 1 증가시킨다.
            // $inc 연산자는 해당 필드 값을 증가시킨다.
            // cart.$.quantity 에서 $는 cart 배열 중 조건에 일치한 첫 번째 요소를 의미한다.
            // new: true 옵션은 업데이트된 최신 문서를 반환하게 한다.

            return res.status(201).send(user.cart);
            // 수량이 증가된 후의 cart 배열을 응답으로 반환한다.
            // 상태 코드 201은 요청이 성공적으로 처리되어 리소스가 수정되었음을 의미한다.
        }

        // 상품이 이미 있지 않을 때
        else {
            const user = await User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $push: {
                        cart: {
                            id: req.body.productId,
                            quantity: 1,
                            date: Date.now(),
                        },
                    },
                },
                { new: true }
            );
            // 동일 상품이 cart에 없을 경우, 새 항목을 cart 배열에 추가한다.
            // $push 연산자를 사용해 객체를 배열에 삽입한다.
            // - id: 상품 ID
            // - quantity: 기본 수량 1
            // - date: 현재 시간을 밀리초 단위 타임스탬프로 저장한다.
            // new: true 옵션은 업데이트된 사용자 정보를 반환한다.

            return res.status(201).send(user.cart);
            // 새 항목이 추가된 후의 장바구니 배열을 응답으로 클라이언트에 반환한다.
        }
    } catch (error) {
        next(error);
        // 위의 DB 연산 과정에서 오류가 발생하면 Express의 에러 처리 미들웨어로 넘긴다.
        // 서버가 중단되지 않고 일관된 방식으로 오류 응답을 처리할 수 있게 해준다.
    }
});

router.delete("/cart", auth, async (req, res, next) => {
    // 장바구니에서 상품을 삭제하는 요청을 처리하는 라우터이다.
    // 로그인된 사용자만 접근할 수 있으며, 삭제 대상 상품 ID는 req.query.productId로 전달된다.

    try {
        // 먼저 cart안에 지우려고 한 상품을 지워주기
        const userInfo = await User.findOneAndUpdate(
            { _id: req.user._id },
            {
                $pull: { cart: { id: req.query.productId } },
            },
            { new: true }
        );
        // $pull 연산자를 이용하여 cart 배열에서 특정 상품(id가 일치하는 항목)을 제거한다.
        // 조건에 맞는 배열 요소를 찾아 제거하며, new: true 옵션으로 업데이트된 user 문서를 반환한다.
        // 즉, 삭제 완료된 장바구니 상태가 userInfo.cart에 들어있게 된다.

        const cart = userInfo.cart;
        // 삭제 후의 장바구니 배열을 cart 변수에 저장한다.

        const array = cart.map((item) => {
            return item.id;
        });
        // 장바구니에 남아 있는 각 상품의 ID만 추출해서 새로운 배열로 만든다.
        // 이 ID 목록은 이후 DB에서 상품 상세 정보를 가져오는 데 사용된다.

        const productInfo = await Product.find({
            _id: { $in: array },
        }).populate("writer");
        // 장바구니에 남아 있는 상품들의 상세 정보를 Product 컬렉션에서 조회한다.
        // $in 연산자는 _id가 array에 포함된 항목들을 전부 조회한다.
        // populate("writer")를 통해 각 상품의 작성자(writer) 정보를 함께 가져온다.

        return res.json({
            productInfo,
            cart,
        });
        // 클라이언트에 최종 장바구니 상태(cart)와 해당 상품들의 정보(productInfo)를 함께 반환한다.
        // 응답 형식은 JSON이며 상태 코드는 기본값 200(성공)이다.
    } catch (error) {
        next(error);
        // 위의 모든 처리 중 오류가 발생하면 Express 에러 처리 미들웨어로 전달된다.
    }
});

router.post("/payment", auth, async (req, res) => {
    // 결제 완료 시 실행되는 POST 라우터이다.
    // 로그인한 사용자만 접근 가능하며, 결제 정보는 req.body.cartDetail로부터 전달된다.

    // User Collection 안에 History 필드 안에 간단한 결제 정보 넣어주기
    let history = [];
    // 사용자 구매 이력을 저장할 배열을 초기화한다.
    // 각 배열 요소는 하나의 상품 구매 정보가 된다.

    let transactionData = {};
    // 전체 결제 트랜잭션 정보를 담을 객체이다.
    // 이후 payment 컬렉션에 저장될 구조이다.

    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: new Date().toISOString(),
            // 현재 시간을 ISO 문자열 형식으로 저장한다 (예: 2024-05-14T12:34:56.789Z)

            name: item.title,
            // 상품 이름

            id: item._id,
            // 상품의 MongoDB 고유 ID

            price: item.price,
            // 결제 당시의 가격 정보

            quantity: item.quantity,
            // 해당 상품의 구매 수량

            paymentId: crypto.randomUUID(),
            // 결제 건 고유 식별자. Node.js 내장 crypto 모듈로 UUID 생성
            // 한 주문 내 여러 상품에 같은 paymentId가 부여됨
        });
    });
    // 장바구니 상품들을 순회하면서, 각 항목의 정보를 history 배열에 누적한다.

    // Payment Collection 안에 자세한 결제 정보들 넣어주기
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
    };
    // 결제한 사용자 정보를 트랜잭션 데이터에 포함시킨다.
    // 이는 payment 문서 내에서 구매자 정보를 명확히 추적할 수 있도록 한다.

    transactionData.product = history;
    // 앞서 구성한 구매 내역 전체를 트랜잭션 데이터에 담는다.

    // user collection
    await User.findOneAndUpdate(
        { _id: req.user._id },
        {
            $push: { history: { $each: history } },
            // 기존 사용자 history 배열에 새 구매 기록들을 모두 추가

            $set: { cart: [] },
            // 결제가 완료되었으므로 사용자 장바구니를 비운다
        }
    );
    // 사용자의 구매 이력을 업데이트하고, 장바구니는 초기화한다.

    // payment collection
    const payment = new Payment(transactionData);
    // 트랜잭션 데이터를 기반으로 새로운 Payment 문서 인스턴스를 생성한다.

    const paymentDocs = await payment.save();
    // DB에 저장하고, 저장된 문서를 paymentDocs에 할당한다.
    // 여기에는 저장된 구매 상품 정보 배열이 포함되어 있다.

    let products = [];
    // 각 상품별로 판매량(sold)을 업데이트하기 위해 정보를 정리할 배열

    paymentDocs.product.forEach((item) => {
        products.push({ id: item.id, quantity: item.quantity });
    });
    // 저장된 결제 문서 내 product 배열을 순회하며
    // 각 상품의 ID와 수량만 별도로 추출해 products 배열에 저장한다.

    async.eachSeries(
        products,
        async (item) => {
            await Product.updateOne(
                { _id: item.id },
                {
                    $inc: {
                        sold: item.quantity,
                    },
                }
            );
            // 해당 상품의 sold 필드를 구매 수량만큼 증가시킨다.
            // 즉, 누적 판매 수치를 반영한다.
            // eachSeries는 각 항목을 순차적으로 실행한다 (병렬 아님).
        },
        (err) => {
            if (err) return res.status(500).send(err);
            // 순회 중 하나라도 실패하면 서버 오류(500) 응답

            return res.sendStatus(200);
            // 모든 상품 업데이트가 성공하면 200 OK 상태로 응답
        }
    );
    // async.eachSeries를 사용해 모든 상품의 판매량을 순차적으로 업데이트함
    // 비동기 루프를 동기적으로 제어할 때 유용한 방식이다
});

module.exports = router;
