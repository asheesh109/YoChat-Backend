const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("Room", roomSchema);


// === controllers/roomController.js ===
const Room = require("../Models/Room");
const User = require("../models/User");

exports.createRoom = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;

    const newRoom = new Room({ name, createdBy: userId, members: [userId] });
    await newRoom.save();

    res.status(201).json(newRoom);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("createdBy", "username");
    res.json(rooms);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.joinRoom = async (req, res) => {
  try {
    const roomId = req.params.id;
    const userId = req.user.id;
    const room = await Room.findById(roomId);

    if (!room) return res.status(404).json({ error: "Room not found" });

    if (!room.members.includes(userId)) {
      room.members.push(userId);
      await room.save();
    }

    res.json(room);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
