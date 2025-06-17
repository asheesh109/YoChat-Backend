const Message = require("./Models/Message");

function handleSocket(socket, io) {
  console.log("✅ User connected:", socket.id);

  socket.on("join-room", async ({ roomId, username }) => {
    socket.join(roomId);
    console.log(`📥 User ${username} joined room ${roomId}`);

    try {
      const messages = await Message.find({ roomId }).sort({ time: 1 });
      socket.emit("room-history", messages);
    } catch (error) {
      console.error("❌ Error fetching room history:", error);
    }
  });

  socket.on("send-message", async (payload) => {
    try {
      // Create message in database
      const newMessage = new Message({
        roomId: payload.roomId,
        username: payload.username,
        message: payload.message,
        time: payload.time || new Date()
      });
      
      const savedMessage = await newMessage.save();
      
      // Broadcast to everyone EXCEPT the sender
      socket.to(payload.roomId).emit("receive-message", savedMessage);
      
      // Send confirmation to sender with saved message (including _id)
      socket.emit("message-delivered", {
        ...savedMessage.toObject(),
        tempId: payload.tempId // Include the tempId to match with local message
      });
      
      console.log(`📨 Message from ${payload.username} in room ${payload.roomId}`);
    } catch (err) {
      console.error("❌ Error saving message:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
}

module.exports = { handleSocket };