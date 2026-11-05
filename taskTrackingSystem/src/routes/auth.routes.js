const express = require('express');
const { register, login } = require('../controllers/auth.controller');
const validate = require('../middlewares/validation.middleware');
const { registerSchema, loginSchema } = require('../utils/schemas');

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

module.exports = router;
