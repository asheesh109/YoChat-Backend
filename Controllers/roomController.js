const Room = require("../Models/Room");

// ✅ Get all rooms (public)
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch all rooms" });
  }
};

// ✅ Create a new room
exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create({
      name: req.body.name,
      createdBy: req.user.id,
      members: [req.user.id],
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Join a room
exports.joinRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }

    if (!room.members.includes(req.user.id)) {
      room.members.push(req.user.id);
      await room.save();
    }

    res.json(room);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// ✅ Get all rooms the current user has joined
exports.getMyRooms = async (req, res) => {
  try {
    const userId = req.user.id;
    const rooms = await Room.find({ members: userId }).populate("createdBy", "username");
    res.status(200).json(rooms);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch user rooms" });
  }
};

// ✅ ✅ NEW: Get a room by its ID (used to fetch room name)
exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }
    res.json(room);
  } catch (error) {
    console.error("Error fetching room by ID:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
