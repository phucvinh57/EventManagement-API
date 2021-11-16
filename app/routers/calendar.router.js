const express = require('express');
const router = express.Router();
const calendarCtrler = require('../business_layer/calendar')

router.get('/', calendarCtrler.getCalendar);

module.exports = router;