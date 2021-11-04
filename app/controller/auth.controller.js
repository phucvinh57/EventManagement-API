const logIn = function(req, res) {
    res.json({
        msg: "Login"
    })
}

const signUp = function(req, res) {
    let str = ['email', 'tranhuyduc'];
    let obj = {};
    obj[`$s{str[0]}`] = str[1];
    res.json({
        msg: "Sign up"
    })
}

module.exports = {
    logIn, signUp
}