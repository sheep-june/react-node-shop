const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
const port = 4000;
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("연결완료");
    })
    .catch((err) => {
        console.log(err);
    });

app.get("/", (req, res, next) => {
    setImmediate(() => {next(new Error("it is an error")) });
    //res.send("안녕하세요11");
});

app.post("/", (req, res) => {
    console.log(req.body);
    res.json(req.body);
});

app.use('/users',require('./routes/users'));
app.use('/products', require('./routes/products'));


app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.send(error.message || "서버 에러 ");
});

app.use(express.static(path.join(__dirname, "../uploads")));

app.listen(port, () => {
    console.log(`${port}번에서 실행이 되었습니다.`);
});
