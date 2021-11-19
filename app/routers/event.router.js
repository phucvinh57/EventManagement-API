const express = require('express');
const router = express.Router();
const eventCtrler = require('../business_layer/event');

router.get('/basic/:id', eventCtrler.getBasicEvent);
router.get('/basic/', eventCtrler.getAllBasicEvent);
router.get('/:id', eventCtrler.getFullEvent);
router.get('/:id/invitation', eventCtrler.getEventInvitations);
router.post('/', eventCtrler.createEvent);
router.put('/:id', eventCtrler.updateEvent);
router.delete('/:id', eventCtrler.deleteEvent);

router.post('/invite', eventCtrler.invite);
router.get('/:id/response', eventCtrler.responseInvitation);

module.exports = router;