const express = require('express');
const router = express.Router();
const inviteCtrler = require('../business_layer/invite');

router.get('/:id/invite', inviteCtrler.invite);
router.get('/:id/response', inviteCtrler.responseInvitation);

module.exports = router