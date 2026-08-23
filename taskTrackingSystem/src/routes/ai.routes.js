const express = require('express');
const { generateAiDescription, summarizeTask } = require('../controllers/ai.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validation.middleware');
const { generateAiDescriptionSchema } = require('../utils/schemas');

const router = express.Router();

router.use(protect);

router.post('/generate-description', validate(generateAiDescriptionSchema), generateAiDescription);
router.post('/tasks/:taskId/summarize', summarizeTask);

module.exports = router;
