const express = require("express");
const cors = require("cors");

const router = require('./app/routers')
const db = require("./app/data_layer");

const app = express();

var corsOptions = {
    origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", router.auth);
app.use("/calendar", router.calendar);
app.use("/event", router.event);
app.use("/", router.search);
app.use("/event", router.invite);
app.use("/event", router.sched);
app.use("/", router.account);

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
