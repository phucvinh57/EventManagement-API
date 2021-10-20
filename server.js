const express = require("express");
const cors = require("cors");
const connection = require('./app/models');
const accountRouter = require('./app/routers/account.router')
const authRouter = require('./app/routers/auth.router')
const calendarRouter = require('./app/routers/calendar.router')
const eventRouter = require('./app/routers/event.router')
const inviteRouter = require('./app/routers/invite.router')
const schedRouter = require('./app/routers/sched.router')
const searchRouter = require('./app/routers/search.router')

const app = express();

var corsOptions = {
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use('/auth', authRouter);
app.use('/calendar', calendarRouter);
app.use('/event', eventRouter);
app.use('/', searchRouter);
app.use('/event', inviteRouter);
app.use('/event', schedRouter)
app.use('/', accountRouter);

connection.connect(function(err) {
    if(err) {
        console.log("DB connection failed !");
        return;
    };
    console.log("Database connected !");
});

app.get('/', function(req, res) {
    res.json({
        msg: "Welcome to Đồ án CNPM"
    })
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});