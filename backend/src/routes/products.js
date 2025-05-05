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

router.post('/image', auth, async (req, res, next) => {

    upload(req, res, err => {
        if (err) {
            return req.status(500).send(err);
        }
        return res.json({ fileName: res.req.file.filename })
    })

})

router.get("/", async (req, res, next) => {
    const parsed = qs.parse(req._parsedUrl.query);
    console.log("전체 쿼리:", req.query);        // 여기에 filters 나와야 함
  console.log("필터 정보:", req.query.filters); 
    const order = req.query.order ? req.query.order : "desc";
    const sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const skip = req.query.skip ? Number(req.query.skip) : 0;
    const term = req.query.searchTerm;

    let findArgs = {};
    for (let key in parsed.filters) {
        if (parsed.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    $gte: parsed.filters[key][0],
                    $lte: parsed.filters[key][1]
                };
            } else {
                findArgs[key] = parsed.filters[key];
            }
        }
    }

    if (term) {
        findArgs["$text"] = { $search: term };
    }

    console.log(findArgs);

    try {
        const products = await Product.find(findArgs)
            .populate("writer")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)

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
