import ChatbotService from "../service/index.js";

class ChatbotController {
  /**
   * POST /chatbot/:userId
   * Tạo message user + generate AI + lưu DB
   */
  createAiResponse = async (req, res) => {
    try {
      const { userId } = req.params;
      const { content } = req.body;

      console.log("📩 createAiResponse:", { userId, content });

      if (!content) {
        return res.status(400).json({
          message: "Content is required",
        });
      }

      const answer = await ChatbotService.createMessageAndGenerate(
        userId,
        content
      );

      return res.json({
        answer,
      });
    } catch (error) {
      console.error("❌ createAiResponse error:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };

  /**
   * GET /chatbot/:userId
   * Lấy lịch sử chat theo userId
   */
  getAiChatByUserId = async (req, res) => {
    try {
      const { userId } = req.params;

      console.log("📚 getAiChatByUserId:", userId);

      const messages = await ChatbotService.getMessagesByUserId(userId);

      return res.json({
        data: messages,
      });
    } catch (error) {
      console.error("❌ getAiChatByUserId error:", error);

      return res.status(500).json({
        message: "Internal server error",
      });
    }
  };
}

export default new ChatbotController();
