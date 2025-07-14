const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const { fetchNews } = require('../controllers/newsController');

router.get('/', auth, fetchNews);
module.exports = router;
