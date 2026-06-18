const express = require('express');
const router = express.Router();
const {register,login } = require('../Controllers/userController');
const {validate,registerRules,loginRules} = require('../middleware/validateMiddleware');

router.post('/register', registerRules,validate,register);
router.post('/login', loginRules, validate, login);

module.exports = router;