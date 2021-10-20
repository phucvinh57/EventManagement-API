const logIn = function(req, res) {
    res.json({
        msg: "Login"
    })
}

const signUp = function(req, res) {
    res.json({
        msg: "Sign up"
    })
}

module.exports = {
    logIn, signUp
}