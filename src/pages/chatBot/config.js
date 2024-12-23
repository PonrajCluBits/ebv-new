// src/chatbot/config.js
import { createChatBotMessage } from "react-chatbot-kit";

const config = {
  botName: "HelperBot",
  initialMessages: [createChatBotMessage("Hello! How can I assist you today?")],
  customStyles: {
    botMessageBox: {
      backgroundColor: "#1976d2", // MUI primary color
    },
    chatButton: {
      backgroundColor: "#1976d2",
    },
  },
};

export default config;
