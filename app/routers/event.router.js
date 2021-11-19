const express = require('express');
const router = express.Router();
const event = require('../business_layer/event');

router.get('/basic/:id', event.getBasicEvent);
router.get('/:id', event.getFullEvent);
router.get('/:id/invitation', event.getEventInvitations);
router.post('/', event.createEvent);
router.put('/:id', event.updateEvent);
router.delete('/:id', event.deleteEvent);
router.get('/:id/response', event.responseInvitation);
router.get('/:id/sched', event.getSchedule);

router.post('/invite', event.invite);
router.get('/:id/response', event.responseInvitation);

module.exports = router;