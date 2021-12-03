const db = require('../data_layer')
const bcrypt = require('bcryptjs');
const bluebird = require('bluebird')

const bcryptCompare = bluebird.promisify(bcrypt.compare)
const bcryptHash = bluebird.promisify(bcrypt.hash)

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
        const result = bcrypt.compareSync(oldPass, user.password)
      
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

const getContacts = async function (req, res) {
    const userId = req.userId
    try {
        const user = await db.Users.findById(userId)
        const contacts = await db.Users.find({
          _id: {
              $in: user.contacts
          }
        })
        res.status(200).send(contacts)
    } catch (err) {
        res.status(500).send({ msg: 'Server error' })
    }
}

const updateContacts = async function (req, res) {
    const email = req.body.email
    const contactId = req.body.contactId
    const userId = req.userId
    try {
      const user = await db.Users.findOne(
        { 
          _id: userId
        }
      );
      if(contactId) {
        await db.Users.findByIdAndUpdate(
          userId,
          { $pull: { 'contacts': contactId } },
          { new: true }
        );
        res.status(200).send({msg: 'Delete successfully'})
      }
      else {
        const contact = await db.Users.findOne({email: email});
        if(contact._id.toString() === userId) {
          res.status(200).send({msg: 'This mail is yours'})
        }
        else if(contact) {
          const exist = user.contacts.filter(contactId => contactId.toString() === contact._id.toString())
          if(exist.length === 0) {
            await db.Users.findByIdAndUpdate(
              userId,
              { $push: { 'contacts': contact._id } },
              { upsert: true, new: true }
            );
            res.status(200).send({msg: 'Add successfully', contact: contact})
          }
          else res.status(200).send({msg: 'Contact already exist'})
        }
        else {
          res.status(200).send({msg: 'Cannot find user'})
        }
      }
    }
    catch (err) {
        res.status(500).send({ msg: 'Server error' })
    }
}

module.exports = {
    getPersonalInfo,
    updateInfo,
    deleteAccount,
    changePassword,
    getContacts,
    updateContacts
}