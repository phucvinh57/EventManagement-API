const express = require('express');
const router = express.Router();
const schedCtrler = require('../business_layer/sched');

router.get('/:id/schedule', schedCtrler.getSchedule);

module.exports = router