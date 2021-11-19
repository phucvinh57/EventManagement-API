const express = require('express');
const router = express.Router();
const searchCtrler = require('../business_layer/search');

router.get('/event/search', searchCtrler.searchEvent)

module.exports = router;