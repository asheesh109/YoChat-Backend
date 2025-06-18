const express = require("express");
const router = express.Router();
const authMiddleware = require("../Middleware/authMiddleware");

router.get("/me", authMiddleware, (req, res) => {
  res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email
  });
});

module.exports = router;

