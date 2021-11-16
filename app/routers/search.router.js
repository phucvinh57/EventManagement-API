const express = require('express');
const router = express.Router();
const searchCtrler = require('../business_layer/search');

router.get('/event/search', searchCtrler.searchEvent)
router.get('/user/search', searchCtrler.searchUser)

module.exports = router;