const express = require('express');
const router = express.Router();
const eventCtrler = require('../controller/event.controller');

router.get('/basic', eventCtrler.getBasicEvent);
router.get('/:id', eventCtrler.getFullEvent);
router.get('/:id/invitation', eventCtrler.getEventInvitations);
router.post('/', eventCtrler.createEvent);
router.put('/:id', eventCtrler.updateEvent);
router.delete('/:id', eventCtrler.deleteEvent);

module.exports = router;