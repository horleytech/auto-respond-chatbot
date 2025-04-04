import express from "express";
import { getChatGPTResponse } from "./chatgpt.js";
import { connectDB } from "./db.js";
import { Conversation } from "./models.js";

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware to parse JSON bodies
app.use(express.json());

// ✅ Webhook endpoint
app.post("/webhook", async (req, res) => {
  console.log("Webhook received:", req.body);

  const userMessage = req.body.message;
  if (!userMessage) {
    return res.status(400).send("Missing message in request body");
  }

  // Get ChatGPT response
  const reply = await getChatGPTResponse(userMessage);
  console.log("Reply:", reply);

  // Save the conversation in the database
  try {
    const conversation = new Conversation({
      userMessage,
      chatGPTReply: reply,
    });
    await conversation.save();
    console.log("Conversation saved to DB");
  } catch (error) {
    console.error("Error saving conversation:", error);
  }

  res.status(200).send(reply);
});

// ✅ MOVE THIS OUTSIDE the webhook route
app.get("/logs", async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({ timestamp: -1 });
    res.json(conversations);
  } catch (error) {
    console.error("Error retrieving logs:", error);
    res.status(500).send("Error retrieving logs");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
