const express = require('express');
const router = express.Router();
const calendar = require('../business_layer/calendar')
// const verifyToken = require('../middleware/verifyToken')

router.get('/', calendar.getCalendar);

module.exports = router;