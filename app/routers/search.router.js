const express = require('express');
const router = express.Router();
const search = require('../business_layer/search');
const verifyToken = require('../middleware/verifyToken')

router.post('/event/search/', verifyToken, search.searchEvent)

module.exports = router;