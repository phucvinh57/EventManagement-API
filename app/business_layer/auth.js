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
            { accountName: req.body.username },
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
            httpOnly: true,
            secure: true
        })
        res.status(200).send({
            userId: user._id,
            username: user.name,
            accessToken: token
        })
    }
    catch (err) {
        res.status(500).send({ msg: "Error !!!" });
    }
}

const signUp = async function (req, res) {
    try {
        const usernameExist = await db.Users.exists({
            accoutName: req.body.username
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
        const newUser = db.Users.create({
            username: username,
            password: password
        });
        const token = jwt.sign({ userId: newUser._id }, authConfig.secret, {
            expiresIn: 86400 // 24 hours
        })
        res.cookie('access-token', token, {
            httpOnly: true,
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

const changePassword = async function (req, res) {
    const userId = req.userId;
    const oldPass = req.body.oldPassword;
    const newPass = req.body.newPassword;
    try {
        const user = await db.Users.findOne(
            { _id: userId },
            { password: true }
        )
        const result = await bcryptCompare(oldPass, user.password)
        if (!result) return res.send({ msg: 'Incorrect password' })

        const newPassword = await bcryptHash(newPass, 8);
        await db.Users.findByIdAndUpdate(userId, { password: newPassword })

        res.status(200).send({
            msg: 'Update password successfully !!'
        })
    }
    catch (err) {
        res.status(500).json({
            msg: 'User does not exist'
        })
    }
}

module.exports = {
    logIn, signUp, 
    changePassword, logOut
}