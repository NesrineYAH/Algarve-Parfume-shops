//routes/return.js
const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleware/auth");
const returnCtrl = require("../controllers/return");

 router.post("/create", authMiddleware, returnCtrl.createReturnRequest);
// Admin
router.put("/:orderId/approve", authMiddleware, isAdmin, returnCtrl.approveReturn);
router.put("/:orderId/refund", authMiddleware, isAdmin, returnCtrl.refundProduct);

module.exports = router;

/*
const express = require("express");
const router = express.Router();
const { authMiddleware, isAdmin } = require("../middleware/auth");
const returnCtrl = require("../controllers/return");

router.post("/create", authMiddleware, returnCtrl.createReturnRequest);
router.put("/:orderId/approve", authMiddleware, isAdmin, returnCtrl.approveReturn);

module.exports = router;
*/