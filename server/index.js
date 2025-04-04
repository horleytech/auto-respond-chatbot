import express from "express";
import { getChatGPTResponse } from "./chatgpt.js";
import { connectDB } from "./db.js";
import { Conversation, Rule } from "./models.js";

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
  const platform = req.body.platform || "whatsapp"; // default if not passed

  if (!userMessage) {
    return res.status(400).send("Missing message in request body");
  }

  // Try to find a rule for this platform + trigger
  const rules = await Rule.find({ platform });

  let matchedRule = null;
  for (const rule of rules) {
    if (rule.trigger.some(trigger => userMessage.toLowerCase().includes(trigger.toLowerCase()))) {
      matchedRule = rule;
      break;
    }
  }

  let reply = "";

  if (matchedRule) {
    if (matchedRule.responseType === "text") {
      reply = matchedRule.responseText;
    } else if (matchedRule.responseType === "ai") {
      const instruction = matchedRule.aiInstruction || "";
      reply = await getChatGPTResponse(`${instruction} \nUser said: ${userMessage}`);
    } else {
      reply = "CSV response type not yet implemented.";
    }
  } else {
    reply = await getChatGPTResponse(userMessage); // fallback AI
  }

  // Save the conversation
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

// ✅ Logs endpoint
app.get("/logs", async (req, res) => {
  try {
    const conversations = await Conversation.find().sort({ timestamp: -1 });
    res.json(conversations);
  } catch (error) {
    console.error("Error retrieving logs:", error);
    res.status(500).send("Error retrieving logs");
  }
});

// ✅ Rules: create
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

// ✅ Rules: fetch
app.get("/rules", async (req, res) => {
  try {
    const rules = await Rule.find().sort({ createdAt: -1 });
    res.json(rules);
  } catch (error) {
    console.error("Error fetching rules:", error);
    res.status(500).send("Error fetching rules");
  }
});

// ✅ Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
