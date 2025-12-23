import { Router } from "express";
import ChatbotController from "../controller/index.js";

const ChatbotRoute = Router();

ChatbotRoute.post("/chatbot/:userId", ChatbotController.createAiResponse);
ChatbotRoute.get("/chatbot/:userId", ChatbotController.getAiChatByUserId);

export default ChatbotRoute;
