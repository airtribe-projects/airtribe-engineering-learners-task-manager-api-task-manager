const { homePage } = require("../controllers/homeController");
const express = require("express");
const router = express.Router();

router.use(express.json());

router.get("/", homePage);

module.exports = router;
