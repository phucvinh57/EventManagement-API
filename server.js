const express = require("express");
const cors = require("cors");

const accountRouter = require("./app/routers/account.router");
const authRouter = require("./app/routers/auth.router");
const calendarRouter = require("./app/routers/calendar.router");
const eventRouter = require("./app/routers/event.router");
const inviteRouter = require("./app/routers/invite.router");
const schedRouter = require("./app/routers/sched.router");
const searchRouter = require("./app/routers/search.router");

const db = require("./app/models");

const app = express();

var corsOptions = {
    origin: "http://localhost:3000",
};

app.use(cors(corsOptions));
app.use("/auth", authRouter);
app.use("/calendar", calendarRouter);
app.use("/event", eventRouter);
app.use("/", searchRouter);
app.use("/event", inviteRouter);
app.use("/event", schedRouter);
app.use("/", accountRouter);
app.use(express.json());

db.connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log("Mongo Database connected");
    })
    .catch((err) => {
        console.log("Cannot connect to the Mongo database");
        process.exit();
    });

const Tutorial = db.tutorials;

app.get("/", function (req, res) {
    res.json({
        msg: "Welcome to Đồ án CNPM",
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
