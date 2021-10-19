const express = require("express");
const cors = require("cors");
const connection = require('./app/models');
const router = require('./app/routes/routers');

const app = express();

var corsOptions = {
    origin: "http://localhost:3000"
};

app.use(cors(corsOptions));
app.use('/api', router);

app.get('/', (req, res) => {
    res.send("Welcome to localhost:8080");
})

connection.connect(function(err) {
    if(err) {
        console.log("DB connection failed !");
        return;
    };
    console.log("Database connected !");
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});