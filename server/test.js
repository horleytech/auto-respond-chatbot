import { getChatGPTResponse } from "./chatgpt.js";

getChatGPTResponse("Hello, ChatGPT!").then(response => {
  console.log("ChatGPT response:", response);
});