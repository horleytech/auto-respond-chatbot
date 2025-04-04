import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getChatGPTResponse(message) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("Error in ChatGPT response:", error);
    return "Sorry, something went wrong.";
  }
}
