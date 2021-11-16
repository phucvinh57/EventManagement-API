const express = require('express');
const router = express.Router();
const authCtrler = require('../business_layer/auth')

router.post('/login', authCtrler.logIn);
router.post('/signup', authCtrler.signUp);

module.exports = router