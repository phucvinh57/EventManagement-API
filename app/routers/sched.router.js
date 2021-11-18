const express = require('express');
const router = express.Router();
const schedCtrler = require('../business_layer/sched');

router.get('/:id/sched', schedCtrler.getSchedule);

module.exports = router