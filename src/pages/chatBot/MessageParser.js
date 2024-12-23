// src/chatbot/MessageParser.js
class MessageParser {
    constructor(actionProvider) {
      this.actionProvider = actionProvider;
    }
  
    parse(message) {
      if (message.toLowerCase().includes("hello")) {
        this.actionProvider.handleGreeting();
      }
    }
  }
  
  export default MessageParser;
  