import express from "express";
import { connectDB } from "./db.js";
import { Conversation, Rule } from "./models.js";
import { getChatGPTResponse } from "./chatgpt.js";
import cors from "cors";


const app = express();
const port = process.env.PORT || 3000;

connectDB();
app.use(express.json());

app.use(
  cors({
    origin: ["https://auto-respond-chatbot.vercel.app", "https://auto-respond-chatbot-pnzaj9vzt-horleytechs-projects.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  })
);


// ✅ Webhook endpoint
app.post("/webhook", async (req, res) => {
  const userMessage = req.body.message?.toLowerCase();
  if (!userMessage) return res.status(400).send("Missing message in request body");

  // Check rules
  const rules = await Rule.find();
  for (const rule of rules) {
    if (rule.trigger.some(trigger => userMessage.includes(trigger.toLowerCase()))) {
      let reply;

      switch (rule.responseType) {
        case "text":
          reply = rule.responseText;
          break;
        case "csv":
          reply = "[CSV handling not yet implemented]";
          break;
        case "ai":
          reply = await getChatGPTResponse(rule.aiInstruction + " " + userMessage);
          break;
        default:
          reply = "Sorry, I don't understand.";
      }

      await Conversation.create({ userMessage, chatGPTReply: reply });
      return res.send(reply);
    }
  }

  // Fallback to ChatGPT if no rule matched
  const fallback = await getChatGPTResponse(userMessage);
  await Conversation.create({ userMessage, chatGPTReply: fallback });
  res.send(fallback);
});

// Logs
app.get("/logs", async (req, res) => {
  const conversations = await Conversation.find().sort({ timestamp: -1 });
  res.json(conversations);
});

// Create rule
app.post("/rules", async (req, res) => {
  try {
    const rule = new Rule(req.body);
    await rule.save();
    res.status(201).json(rule);
  } catch (error) {
    console.error("Error creating rule:", error);
    res.status(500).send("Error creating rule");
  }
});

// Get all rules
app.get("/rules", async (req, res) => {
  try {
    const rules = await Rule.find().sort({ createdAt: -1 });
    res.json(rules);
  } catch (error) {
    res.status(500).send("Error fetching rules");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
