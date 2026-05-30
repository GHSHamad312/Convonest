import { Router } from "express";
import jwt from "jsonwebtoken";
import Message from "../models/Message.js";
import User from "../models/User.js";

const router = Router();

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(403).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Error verifying JWT token:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Send Message Between Users (protected)
router.post("/", authenticateToken, async (req, res) => {
  const { text, sender, receiver } = req.body;

  try {
    // Validate sender and receiver exist
    const senderUser = await User.findById(sender);
    const receiverUser = await User.findById(receiver);

    if (!senderUser || !receiverUser) {
      return res.status(404).json({ message: "Sender or Receiver not found" });
    }

    // Create and save new message
    const newMessage = new Message({
      text,
      sender,
      receiver,
    });
    await newMessage.save();

    // Return the message for immediate display
    res.status(201).json(newMessage);

    console.log("Message sent:", newMessage._id);
  } catch (err) {
    console.error("Error sending message:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// Get Messages Between Two Users
router.get("/:userId/:friendId", async (req, res) => {
  const { userId, friendId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: friendId },
        { sender: friendId, receiver: userId },
      ],
    }).sort({ timestamp: 1 }); // Fixed: was sorting by 'createdAt' which doesn't exist on the schema

    res.json(messages);
  } catch (err) {
    console.error("Error fetching messages:", err.message);
    res.status(500).json({ error: err.message });
  }
});

export default router;
