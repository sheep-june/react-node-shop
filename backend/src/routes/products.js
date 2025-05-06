const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Product = require("../models/Product");
const multer = require("multer");
const qs = require("qs");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${file.originalname}`);
    },
});

const upload = multer({ storage: storage }).single("file");

router.post("/image", auth, async (req, res, next) => {
    upload(req, res, (err) => {
        if (err) {
            return req.status(500).send(err);
        }
        return res.json({ fileName: res.req.file.filename });
    });
});

router.get("/:id", async (req, res, next) => {
    const type = req.query.type;
    let productIds = req.params.id;

    if (type === "array") {
        // id=32423423423,345345345345345,345345345
        // productIds = ['32423423423', '345345345345345345', '345345345345345']

        let ids = productIds.split(",");
        productIds = ids.map((item) => {
            return item;
        });
    }

    // productId를 이용해서 DB에서 productId와 같은 상품의 정보를 가져옵니다.
    try {
        const product = await Product.find({
            _id: { $in: productIds },
        }).populate("writer");

        return res.status(200).send(product);
    } catch (error) {
        next(error);
    }
});



router.get("/", async (req, res, next) => {
    const parsed = qs.parse(req._parsedUrl.query);
    //   console.log("전체 쿼리:", req.query);        // 여기에 filters 나와야 함
    //   console.log("필터 정보:", req.query.filters);
    //   console.log("parsed:", parsed);
    //   console.log("parsed.filters:", parsed.filters);
    const order = parsed.order || "desc";
    const sortBy = parsed.sortBy || "_id";
    const limit = parsed.limit ? Number(parsed.limit) : 20;
    const skip = parsed.skip ? Number(parsed.skip) : 0;
    const term = parsed.searchTerm;

    let findArgs = {};
    for (let key in parsed.filters) {
        if (parsed.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    $gte: parsed.filters[key][0],
                    $lte: parsed.filters[key][1],
                };
            } else {
                findArgs[key] = parsed.filters[key];
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
    if (term) {
        findArgs["title"] = { $regex: term, $options: "i" }; // i는 대소문자 구분 안 함
    }
    

    //console.log(findArgs);

    try {
        const products = await Product.find(findArgs)
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit);

        const productsTotal = await Product.countDocuments(findArgs);
        const hasMore = skip + limit < productsTotal ? true : false;

        return res.status(200).json({
            products,
            hasMore,
        });
    } catch (error) {
        next(error);
    }
});

router.post("/", auth, async (req, res, next) => {
    try {
        const product = new Product(req.body);
        product.save();
        return res.sendStatus(201);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
