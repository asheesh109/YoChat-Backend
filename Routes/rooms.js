const express = require("express");
const {
  createRoom,
  getAllRooms,
  joinRoom,
  getMyRooms,
  getRoomById, // ✅ Add this
} = require("../Controllers/roomController");

const auth = require("../Middleware/authMiddleware");

const router = express.Router();

// Existing routes
router.post("/create", auth, createRoom);
router.get("/all", getAllRooms);
router.post("/join/:id", auth, joinRoom);
router.get("/my", auth, getMyRooms);

// ✅ New route to get room by ID (no auth for now)
router.get("/:id", getRoomById);

// Aliases (optional)
router.post("/", auth, createRoom); 
router.get("/", getAllRooms);

module.exports = router;
