const db = require('../models')

const logIn = async function (req, res) {
    const user = await db.Users.findOne(
        { accountName: req.body.username },
        'password'
    ).exec();
    res.status(200).send({
        login: user.password === req.body.password
    })
}

const signUp = function (req, res) {
    const usernameExist = await db.Users.exists({ accoutName: req.body.username });
    if (usernameExist) {
        res.status(200).send({ 
            signup: false, 
            msg: 'Username existed' 
        })
        return;
    }
    const data = {
        username: req.body.username,
        password: req.body.password,
    }
    await db.Users.create(data);
    res.status(200).send({ signup: true })
}

module.exports = {
    logIn, signUp
}