const db = require('../data_layer')
const bcrypt = require('bcryptjs')
const bluebird = require('bluebird')
const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.config')

const bcryptCompare = bluebird.promisify(bcrypt.compare)
const bcryptHash = bluebird.promisify(bcrypt.hash)

const logIn = async function (req, res) {
    try {
        const user = await db.Users.findOne(
            { username: req.body.username },
            { password: true }
        )
        const result = await bcryptCompare(req.body.password, user.password)
        if (!result) {
            return res.status(401).send({
                msg: 'Incorrect password'
            })
        }

        const token = jwt.sign({ userId: user._id }, authConfig.secret, {
            expiresIn: 86400 // 24 hours
        })
        res.cookie('access-token', token, {
            httpOnly: false
        })
        res.status(200).send({
            login: true,
            msg: 'Login successfully !'
        })
    }
    catch (err) {
        res.status(500).send({ msg: "Error !!!" });
    }
}

const signUp = async function (req, res) {
    console.log(req.body)

    try {
        const usernameExist = await db.Users.exists({
            username: req.body.username
        });
        if (usernameExist) {
            res.status(200).send({
                signup: false,
                msg: 'Username existed'
            })
            return;
        }
        const username = req.body.username
        const password = await bcryptHash(req.body.password, 8)
        const email = req.body.email
        const newUser = db.Users.create({
            username: username,
            password: password,
            email: email
        });

        const token = jwt.sign({ userId: newUser._id }, authConfig.secret, {
            expiresIn: 86400 // 24 hours
        })
        res.cookie('access-token', token, {
            httpOnly: false,
            secure: true
        })
        
        res.status(200).send({ signup: 'success' })
    } catch (err) {
        res.status(500).send({ signup: 'fail' })
    }
}

const logOut = function(req, res) {
    res.clearCookie('access-token')
    res.status(200).send({msg: 'Log out'})
}

module.exports = {
    logIn, signUp, 
    logOut
}