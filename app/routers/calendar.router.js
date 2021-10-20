const express = require('express');
const router = express.Router();
const calendarCtrler = require('../controller/calendar.controller')

router.get('/', calendarCtrler.getCalendar);

module.exports = router;