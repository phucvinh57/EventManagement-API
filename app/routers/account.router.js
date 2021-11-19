const express = require('express');
const router = express.Router();
const account = require('../business_layer/account')
const verifyToken = require('../middleware/verifyToken')

router.get('/info', verifyToken, account.getPersonalInfo);
router.put('/info/update', verifyToken, account.updateInfo);
router.post('/change-password', verifyToken, account.changePassword)
router.delete('/', verifyToken, account.deleteAccount)
router.get('/contacts', verifyToken, account.getContacts)
router.put('/contacts/update', verifyToken, account.updateContacts)

module.exports = router;