const express = require('express');
const router = express.Router();
const accountCtrler = require('../business_layer/account')


router.get('/my', accountCtrler.getPersonalInfo);
router.put('/my/change_password', accountCtrler.changePassword);
router.put('/my/update_info', accountCtrler.updateInfo);
router.get('/user', accountCtrler.getUserInfoById);
router.delete('/my', accountCtrler.deleteAccount)

module.exports = router;