import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    isBot: {
      type: Boolean,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // 👉 tự tạo createdAt & updatedAt
  }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;
