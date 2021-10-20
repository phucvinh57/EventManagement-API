const express = require('express');
const router = express.Router();
const schedCtrler = require('../controller/sched.controller');

router.get('/:id/schedule', schedCtrler.getSchedule);

module.exports = router