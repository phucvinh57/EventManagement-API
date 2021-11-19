const express = require('express');
const router = express.Router();
const event = require('../business_layer/event');

router.get('/basic/:id', event.getBasicEvent);
router.get('/:id', event.getFullEvent);
router.get('/:id/invitation', event.getEventInvitations);
router.post('/', event.createEvent);
router.put('/:id', event.updateEvent);
router.delete('/:id', event.deleteEvent);
router.get('/:id/invite', event.invite);
router.get('/:id/response', event.responseInvitation);
router.get('/:id/sched', event.getSchedule);

module.exports = router;