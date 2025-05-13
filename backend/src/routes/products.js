const express = require("express");
// Express 웹 서버 프레임워크를 불러온다.

const router = express.Router();
// 라우팅 기능을 사용하기 위해 router 객체를 생성한다.
// 이 파일 안에서 정의된 라우트들을 app.js 등에서 하나의 라우터로 등록할 수 있다.

const auth = require("../middleware/auth");
// 사용자 인증 미들웨어를 불러온다.
// 로그인한 사용자만 접근할 수 있는 라우트에 적용된다.

const Product = require("../models/Product");
// 상품 모델(Product)을 불러온다.
// MongoDB의 products 컬렉션과 연결된 Mongoose 모델이다.

const multer = require("multer");
// 파일 업로드를 처리하기 위한 미들웨어 라이브러리
// multipart/form-data 형태의 요청에서 파일을 처리할 수 있게 해준다.

const qs = require("qs");
// 쿼리스트링을 객체 형태로 파싱하기 위한 라이브러리
// Express 기본 req.query보다 중첩된 구조까지 잘 파싱 가능하다

const storage = multer.diskStorage({
    // multer를 사용할 때 파일을 디스크에 저장할 방식(diskStorage)을 설정한다.
    // 여기서 설정하는 옵션은 destination과 filename 두 가지다.

    destination: function (req, file, cb) {
        // 업로드된 파일이 저장될 폴더 경로를 설정하는 함수이다.
        // 첫 번째 인자는 요청(req), 두 번째는 업로드된 파일(file), 세 번째는 콜백(cb)이다.

        cb(null, "uploads/");
        // 에러 없이 정상적으로 'uploads' 폴더에 저장하도록 설정한다.
        // 첫 번째 인자(null)는 에러 없음 의미, 두 번째 인자는 저장 경로이다.
    },

    filename: function (req, file, cb) {
        // 업로드된 파일의 이름을 어떻게 저장할 것인지 정의하는 함수이다.

        cb(null, `${Date.now()}_${file.originalname}`);
        // 현재 시간을 기준으로 파일명을 앞에 붙이고, 원래 파일 이름을 뒤에 붙인다.
        // 예: 1715586032481_image.jpg → 중복 방지 효과가 있음
    },
});

const upload = multer({ storage: storage }).single("file");
// multer 미들웨어를 설정한다.
// 위에서 정의한 diskStorage 설정을 그대로 적용하며,
// 클라이언트가 "file"이라는 이름으로 전송한 단일 파일만 처리하도록 한다.
// 처리된 파일은 req.file에 담기게 된다.

router.post("/image", auth, async (req, res, next) => {
    // 이미지를 업로드할 때 사용하는 POST 요청 라우트이다.
    // /api/products/image로 요청되며, auth 미들웨어를 통해 로그인한 사용자만 접근할 수 있다.

    upload(req, res, (err) => {
        // multer의 upload 미들웨어를 실행하여 파일을 처리한다.
        // 이 코드는 내부적으로 req.file 객체를 생성하며, 에러 발생 시 err에 담긴다.

        if (err) {
            return req.status(500).send(err);
            // 업로드 중 오류가 발생한 경우 클라이언트에게 500 상태와 에러 내용을 응답한다.
        }

        return res.json({ fileName: res.req.file.filename });
        // 업로드가 성공했을 경우, multer가 저장한 파일 이름을 클라이언트에게 JSON 형식으로 반환한다.
        // 이 파일 이름은 프론트엔드에서 이미지 경로로 사용된다.
    });
});

router.get("/:id", async (req, res, next) => {
    // GET 요청이 들어왔을 때 실행되는 비동기 라우트 핸들러를 정의한다.
    // URL 경로에서 상품 ID를 받아와 해당 상품 또는 상품들 정보를 반환한다.

    const type = req.query.type;
    // 쿼리 문자열에서 type 값을 추출한다.
    // 이 값이 "array"이면 여러 개의 상품 ID가 전달된 것으로 간주한다.
    // 예: /api/products/1,2,3?type=array → type === "array"

    let productIds = req.params.id;
    // URL 경로의 :id에 해당하는 값을 추출한다.
    // 단일 상품이면 단일 ID 문자열이, 다수 상품이면 콤마로 구분된 문자열이 들어온다.

    if (type === "array") {
        // type이 "array"일 경우, productIds는 콤마로 연결된 여러 ID를 의미한다.

        // id=32423423423,345345345345345,345345345
        // productIds = ['32423423423', '345345345345345345', '345345345345345']

        let ids = productIds.split(",");
        // 문자열을 쉼표(,) 기준으로 나누어 배열로 만든다.
        // 예: "1,2,3" → ["1", "2", "3"]

        productIds = ids.map((item) => {
            return item;
        });
        // map을 통해 배열의 각 요소를 그대로 반환한다.
        // 결과적으로 productIds는 문자열 ID들의 배열이 된다.
    }

    // productId를 이용해서 DB에서 productId와 같은 상품의 정보를 가져옵니다.
    try {
        const product = await Product.find({
            _id: { $in: productIds },
        }).populate("writer");
        // MongoDB의 Product 컬렉션에서 _id가 productIds 배열에 포함된 상품들을 조회한다.
        // populate("writer")는 각 상품이 참조하고 있는 작성자 정보를 함께 가져온다.
        // 즉, 상품 정보뿐 아니라 작성자 정보까지 포함된 객체가 응답에 담긴다.

        return res.status(200).send(product);
        // 정상적으로 조회된 상품 정보를 클라이언트에 HTTP 200 OK 상태로 응답한다.
        // 응답 데이터는 상품 객체 배열이다.
    } catch (error) {
        next(error);
        // 조회 중 오류가 발생하면 Express의 에러 처리 미들웨어로 넘긴다.
        // 서버에서 예외를 캐치하여 에러 응답을 처리하게 한다.
    }
});

router.get("/", async (req, res, next) => {
    // 클라이언트가 상품 목록을 조회할 때 사용하는 GET 요청 라우트이다.
    // 검색어, 필터, 정렬, 페이지네이션 등 다양한 조건을 쿼리로 전달할 수 있다.

    const parsed = qs.parse(req._parsedUrl.query);
    // 원래는 req.query로 쿼리를 받지만, 중첩 구조(filters[price][0] 등)를 정확히 파싱하기 위해 qs 사용
    // 예: filters[price][0]=1000&filters[price][1]=5000 → parsed.filters.price = [1000, 5000]

    //   console.log("전체 쿼리:", req.query);        // 여기에 filters 나와야 함
    //   console.log("필터 정보:", req.query.filters);
    //   console.log("parsed:", parsed);
    //   console.log("parsed.filters:", parsed.filters);

    const order = parsed.order || "desc";
    // 정렬 방향을 설정한다. "asc" 또는 "desc" 값을 받으며, 기본값은 "desc" (최신순)

    const sortBy = parsed.sortBy || "_id";
    // 어떤 필드를 기준으로 정렬할지 지정. 기본 정렬 기준은 "_id" (MongoDB의 기본 식별자)

    const limit = parsed.limit ? Number(parsed.limit) : 20;
    // 한 번에 불러올 상품 수를 지정. 쿼리에 없으면 기본 20개로 제한한다.

    const skip = parsed.skip ? Number(parsed.skip) : 0;
    // 몇 개의 상품을 건너뛰고 시작할지를 지정. 페이지네이션 처리를 위해 사용됨.

    const term = parsed.searchTerm;
    // 검색어(예: 책, 노트북 등)를 쿼리에서 추출. 이후 정규식 검색 조건으로 사용됨.

    let findArgs = {};
    // DB 조회 조건을 누적할 객체. 필터나 검색어 조건들이 여기에 담긴다.

    for (let key in parsed.filters) {
        // 쿼리에서 filters 객체에 포함된 키들을 하나씩 순회한다.
        // 예: filters = { price: [1000, 5000], genre: ["소설"] }

        if (parsed.filters[key].length > 0) {
            // 해당 필터 값 배열이 비어 있지 않을 경우에만 처리

            if (key === "price") {
                findArgs[key] = {
                    $gte: parsed.filters[key][0],
                    $lte: parsed.filters[key][1],
                };
                // 가격 필터일 경우, MongoDB에서 $gte(이상), $lte(이하) 조건을 동시에 적용
                // 즉, 최소값과 최대값 사이의 가격대만 조회함
            } else {
                findArgs[key] = parsed.filters[key];
                // 가격 외의 필터(예: genre, category)는 배열 그대로 조건에 삽입
                // MongoDB는 해당 필드가 배열 중 하나라도 일치하면 조회됨
            }
        }
    }

    // if (term) {
    //     findArgs["$text"] = { $search: term };
    // }
    //테스트 중에 테스 만 검색해도 나옴
    //실무에서는 다른 방법을 사용중이니 공부하는걸로
    //밑에 $regex방법은 대규모데이터에서는 성능이 느려짐
    //MongoDB Atlas Search 이것도 있지만
    //직접 N-gram 인덱싱 ////Elasticsearch
    //일본어는 형태소 단위로 쪼개서

    if (term) {
        findArgs["title"] = { $regex: term, $options: "i" }; // i는 대소문자 구분 안 함
        // 검색어가 있을 경우, 상품 제목(title)에 대해 부분일치 검색을 수행
        // $regex를 사용하면 "포함" 조건으로 검색 가능하며, $options: "i"는 대소문자를 무시함
        // 예: term이 "책"이면 "책상", "노트북책" 등 포함된 모든 제목을 검색함
    }

    //console.log(findArgs);
    // 위까지 구성된 DB 검색 조건(findArgs)을 확인하는 디버깅 로그 (현재 주석 처리됨)

    try {
        // try 블록을 시작한다. 이 안에서 DB 쿼리 실행 및 응답 구성을 시도하며,
        // 오류가 발생하면 catch 블록으로 이동하여 예외를 처리하게 된다.

        const products = await Product.find(findArgs)
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit);
        // Product 모델에서 findArgs 조건에 맞는 상품들을 비동기적으로 조회한다.
        // - populate("writer"): 각 상품의 작성자 정보(writer 필드)를 다른 컬렉션에서 조인해서 가져온다.
        // - sort([[sortBy, order]]): 지정된 필드(sortBy, 기본값은 "_id") 기준으로 정렬한다.
        //   예: sortBy = "price", order = "asc" → 가격 오름차순 정렬
        // - skip(skip): 앞에서 지정한 개수만큼 결과를 건너뛴다. (페이지네이션 구현)
        // - limit(limit): 한 번에 가져올 상품 수를 제한한다. (기본값은 20)

        const productsTotal = await Product.countDocuments(findArgs);
        // findArgs 조건을 만족하는 전체 상품 수를 카운트한다.
        // 이 수치를 기반으로 더 많은 상품이 있는지 판단한다.
        // 페이지네이션 구현 시 총 데이터 개수를 알아야 클라이언트가 "더 보기" 등을 표시할 수 있다.

        const hasMore = skip + limit < productsTotal ? true : false;
        // 현재 페이지에서 skip + limit을 적용한 결과가 전체 개수보다 작으면, 아직 더 불러올 상품이 있다는 뜻.
        // 예: 전체 100개 중 0~19 (limit=20)만 가져왔다면 skip(0)+limit(20)=20 < 100 → hasMore=true

        return res.status(200).json({
            products,
            hasMore,
        });
        // 클라이언트에 JSON 형식으로 응답을 보낸다.
        // - products: 조회된 상품 목록 배열
        // - hasMore: 이후 페이지에 불러올 상품이 더 있는지를 나타내는 boolean 값
        // 상태 코드는 200(성공)으로 설정된다.
    } catch (error) {
        next(error);
        // try 블록 내에서 오류가 발생할 경우 이 catch 블록이 실행된다.
        // Express의 기본 에러 처리 미들웨어로 에러 객체(error)를 넘긴다.
        // 이로써 서버가 충돌하지 않고 오류 응답을 클라이언트에 반환할 수 있게 된다.
    }
});

router.post("/", auth, async (req, res, next) => {
    // 클라이언트가 상품을 등록할 때 사용하는 POST 요청 라우트이다.
    // 경로는 /api/products이고, auth 미들웨어를 거치므로 로그인된 사용자만 접근할 수 있다.

    try {
        // try 블록 안에서 상품 객체 생성 및 저장 처리를 시도한다.
        // 오류 발생 시 catch 블록으로 넘어간다.

        const product = new Product(req.body);
        // 클라이언트가 요청 본문(req.body)으로 보낸 데이터를 기반으로
        // 새로운 Product 인스턴스를 생성한다.
        // req.body는 JSON 형태로 상품명, 가격, 설명, 이미지 경로 등이 포함되어 있어야 한다.
        // 이 모델은 Mongoose를 통해 정의된 MongoDB 문서 객체이다.

        product.save();
        // 앞에서 생성한 product 객체를 실제 MongoDB에 저장한다.
        // 비동기 처리를 위해 await를 사용하는 것이 일반적이지만,
        // 여기서는 단순 호출만으로도 저장은 이루어지며, 에러는 catch에서 처리된다.

        return res.sendStatus(201);
        // 클라이언트에 HTTP 201 Created 상태 코드를 반환한다.
        // 본문 없이 상태 코드만 응답하며, 이는 새 자원이 성공적으로 생성되었음을 의미한다.
    } catch (error) {
        next(error);
        // 상품 저장 중 오류가 발생한 경우
        // Express의 에러 처리 미들웨어로 에러 객체(error)를 넘긴다.
        // 이를 통해 클라이언트에 적절한 에러 메시지를 반환하거나 로깅할 수 있다.
    }
});

module.exports = router;
