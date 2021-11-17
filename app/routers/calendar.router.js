const express = require('express');
const router = express.Router();
const calendarCtrler = require('../business_layer/calendar')
const verifyToken = require('../middleware/verifyToken')

router.get('/', verifyToken, calendarCtrler.getCalendar);

module.exports = router;