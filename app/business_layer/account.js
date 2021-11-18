const db = require('../data_layer')

const getPersonalInfo = async function (req, res) {
    const userId = req.userId;
    try {
        const user = await db.Users.findById(userId, { password: false });
        if (!user) return res.status(400).json({
            msg: 'User not found'
        })
        res.status(200).json(user)
    }
    catch (err) {
        res.status(500).json({
            msg: "Error !!"
        })
    }
}

const updateInfo = async function (req, res) {
    const newInfo = {
        fName: req.body.fName,
        lName: req.body.lName,
        phone: req.body.phone,
        email: req.body.email
    }
    try {
        const updatedUser = await db.Users.findByIdAndUpdate(
            req.userId, newInfo,
            {
                after: true
            });
        res.status(200).send(updatedUser)
    } catch (err) {
        res.status(500).send({ msg: 'Server error !!' })
    }
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

const deleteAccount = async function (req, res) {
    const userId = req.userId
    try {
        await db.Users.findByIdAndDelete(userId)
        res.clearCookie('access-token');
        res.status(200).send({ msg: 'Your account has been deleted' })
    }
    catch (err) {
        res.status(500).send({ msg: 'Server error' })
    }
}

module.exports = {
    getPersonalInfo,
    updateInfo,
    deleteAccount,
    changePassword
}