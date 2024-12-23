// src/components/ChatbotComponent.js
import React from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import { Box } from "@mui/material";
import config from "../chatbot/config";
import MessageParser from "../chatbot/MessageParser";
import ActionProvider from "../chatbot/ActionProvider";

const ChatbotComponent = () => {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 400,
        position: "fixed",
        bottom: 16,
        right: 16,
        borderRadius: "8px",
        boxShadow: 3,
      }}
    >
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
      />
    </Box>
  );
};

export default ChatbotComponent;
