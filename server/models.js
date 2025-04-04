import mongoose from "mongoose";

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  userMessage: { type: String, required: true },
  chatGPTReply: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export const Conversation = mongoose.model("Conversation", conversationSchema);

// Rule Schema
const RuleSchema = new mongoose.Schema({
  platform: { type: String, required: true }, // e.g., whatsapp, instagram
  trigger: [{ type: String, required: true }], // list of trigger phrases
  responseType: { type: String, enum: ["text", "csv", "ai"], required: true },
  responseText: { type: String }, // used if responseType is "text"
  csvSource: { type: String },    // used if responseType is "csv"
  fieldMatch: { type: String },   // used to match content in CSV
  aiInstruction: { type: String }, // instruction to pass to AI
  createdAt: { type: Date, default: Date.now }
});

export const Rule = mongoose.model("Rule", RuleSchema);
