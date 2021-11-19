const express = require("express");
var cookieParser = require('cookie-parser')
const cors = require("cors");

const router = require('./app/routers')
const db = require("./app/data_layer");

const app = express();

var corsOptions = {
    origin: "http://localhost:3000",
    credentials: true
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));

app.use("/auth", router.auth);
app.use("/calendar", router.calendar);
app.use("/event", router.event);
app.use("/", router.search);
app.use("/my", router.account);

db.connect();

app.get("/", function (req, res) {
    res.json({
        msg: "Welcome to Đồ án CNPM",
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
