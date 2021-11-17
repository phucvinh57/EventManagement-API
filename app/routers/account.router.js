const express = require('express');
const router = express.Router();
const account = require('../business_layer/account')
const verifyToken = require('../middleware/verifyToken')

router.get('/my', verifyToken, account.getPersonalInfo);
router.put('/my/update_info', verifyToken, account.updateInfo);
router.delete('/my', verifyToken, account.deleteAccount)

module.exports = router;