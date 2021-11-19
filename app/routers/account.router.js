const express = require('express');
const router = express.Router();
const account = require('../business_layer/account')
const verifyToken = require('../middleware/verifyToken')

router.get('/', verifyToken, account.getPersonalInfo);
router.put('/update-info', verifyToken, account.updateInfo);
router.post('/change-password', verifyToken, account.changePassword)
router.delete('/', verifyToken, account.deleteAccount)

module.exports = router;