const express = require('express');
const router = express.Router();
const event = require('../business_layer/event');
const verifyToken = require('../middleware/verifyToken')

router.get('/basic/:id', verifyToken, event.getBasicEvent);
router.get('/basics', verifyToken, event.getAllBasicEvent);

router.get('/:id', event.getFullEvent);
router.get('/:id/invitations', event.getEventInvitations);
router.post('/', verifyToken, event.createEvent);
router.put('/:id', event.updateEvent);
router.delete('/:id', verifyToken, event.deleteEvent);
router.get('/:id/response', event.responseInvitation);
router.get('/:id/sched', event.getSchedule);

router.get('/:id/notifications', verifyToken, event.getEventNotifications);

router.post('/invite', verifyToken, event.invite);
router.put('/:id/invitation', event.cancelInvitation);
router.put('/:id/role', event.changeRole);
router.get('/:id/role', verifyToken, event.getRole);

router.put('/:id/response', verifyToken, event.responseInvitation);

module.exports = router;