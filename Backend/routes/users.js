const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const { authMiddleware, isAdmin } = require("../middleware/auth");

// ➤ REGISTER & LOGIN
router.post("/register", userCtrl.validate("register"), userCtrl.register);
router.post("/login", userCtrl.login);
router.get("/moncompte", authMiddleware, (req, res) => {
    res.json({ user: req.user });
});
router.get("/all", authMiddleware, isAdmin, userCtrl.getUsers);
router.post("/forgot-password", userCtrl.forgotPassword);
router.post("/reset-password/:token", userCtrl.resetPassword);
router.post("/logout", userCtrl.logout);


module.exports = router;
//  *Neshadil