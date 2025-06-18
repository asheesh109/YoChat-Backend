const Message = require("./Models/Message");

function handleSocket(socket, io) {
  console.log("✅ User connected:", socket.id);

  // When a user joins a specific room
  socket.on("join-room", async ({ roomId, username }) => {
    try {
      socket.join(roomId);
      console.log(`📥 User '${username}' joined room: ${roomId}`);

      // Fetch previous messages
      const messages = await Message.find({ roomId }).sort({ time: 1 });
      console.log(`📤 Sending ${messages.length} messages to '${username}'`);

      // Send room history to the new user
      socket.emit("room-history", messages);
    } catch (error) {
      console.error(`❌ Error fetching room history for room ${roomId}:`, error.message);
    }
  });

  // When a user sends a message
  socket.on("send-message", async (payload) => {
    try {
      const newMessage = new Message({
        roomId: payload.roomId,
        username: payload.username,
        message: payload.message,
        time: payload.time || new Date()
      });

      const savedMessage = await newMessage.save();

      // Emit to all users in the room except sender
      socket.to(payload.roomId).emit("receive-message", savedMessage);

      // Emit confirmation to sender (with tempId to match local message)
      socket.emit("message-delivered", {
        ...savedMessage.toObject(),
        tempId: payload.tempId
      });

      console.log(`📨 Message saved and emitted from '${payload.username}' in room '${payload.roomId}'`);
    } catch (err) {
      console.error("❌ Error saving message:", err.message);
    }
  });

  // When a user disconnects
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
}

module.exports = { handleSocket };
