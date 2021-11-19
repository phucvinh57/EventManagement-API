const jwt = require('jsonwebtoken')
const authConfig = require('../config/auth.config')

const verifyToken = function (req, res, next) {
    let token = req.cookies['access-token'];
    if (!token) {
        return res.status(403).send({
            msg: 'No token provided ! Please login or signup !'
        })
    }   
    jwt.verify(token, authConfig.secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({
                msg: 'Unauthorized'
            })
        }
        req.userId = decoded.userId
        next()
    })
};

module.exports = verifyToken