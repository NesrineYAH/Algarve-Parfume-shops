//routes/return.js
const { createReturnRequest } = require("../controllers/return.js");
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/auth");

router.post("/create", authMiddleware, createReturnRequest);


module.exports = router;


