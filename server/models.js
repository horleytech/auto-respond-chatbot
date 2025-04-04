import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  userMessage: { type: String, required: true },
  chatGPTReply: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const Conversation = mongoose.model("Conversation", conversationSchema);
