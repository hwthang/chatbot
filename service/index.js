import { GoogleGenAI } from "@google/genai";
import { configDotenv } from "dotenv";
import loadAllJson from "../data/index.js";
import Message from "../model/index.js";

configDotenv();
const data = loadAllJson();

class ChatbotService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing");
    }

    this.ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    this.model = "gemini-2.5-flash";

    this.basePrompt = `
VAI TRÒ:
Bạn là chuyên viên tư vấn về **nghiệp vụ của Đoàn Thanh niên Cộng sản Hồ Chí Minh**.

PHẠM VI DỮ LIỆU:
Chỉ được sử dụng **duy nhất** bộ dữ liệu sau để trả lời:
---
${data}
---

NGUYÊN TẮC TRẢ LỜI:
1. Chỉ trả lời nội dung có trong dữ liệu.
2. Không suy đoán, không dùng kiến thức bên ngoài.
3. Trả lời bằng **tiếng Việt**, ngắn gọn, đúng thuật ngữ nghiệp vụ.
4. Không bịa đặt thông tin.

TRƯỜNG HỢP KHÔNG CÓ DỮ LIỆU:
- Từ chối lịch sự.
- Nêu rõ: "Nội dung này không có trong bộ dữ liệu nghiệp vụ hiện tại."
- Gợi ý 2–3 chủ đề liên quan có trong dữ liệu.

ĐỊNH DẠNG KẾT QUẢ:
- Markdown thuần
- Không HTML
- Không ký tự escape \\n

NỘI DUNG NGƯỜI DÙNG YÊU CẦU:
`.trim();
  }

  /**
   * 1️⃣ Tạo & lưu message (user + bot)
   * @param {string} userId
   * @param {string} content
   * @returns {Promise<string>} AI response
   */
  async createMessageAndGenerate(userId, content) {
    // 🔹 Lưu message user
    await Message.create({
      userId,
      isBot: false,
      content,
    });

    const finalPrompt = `
${this.basePrompt}

${content}
`.trim();

    // 🔹 Gọi AI
    const response = await this.ai.models.generateContent({
      model: this.model,
      contents: finalPrompt,
    });

    const aiReply = response.text;

    // 🔹 Lưu message bot
    await Message.create({
      userId,
      isBot: true,
      content: aiReply,
    });

    return aiReply;
  }

  /**
   * 2️⃣ Lấy danh sách message theo userId
   * @param {string} userId
   * @returns {Promise<Array>}
   */
  async getMessagesByUserId(userId) {
    return Message.find({ userId })
      .sort({ createdAt: 1 }) // ⬅️ tăng dần theo thời gian
      .lean();
  }
}

/* Singleton */
export default new ChatbotService();
