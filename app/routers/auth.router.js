const express = require('express');
const router = express.Router();
const auth = require('../business_layer/auth')

router.post('/login', auth.logIn);
router.post('/signup', auth.signUp);
router.put('/change-password', auth.changePassword)
router.get('/logout', auth.logOut);

module.exports = router