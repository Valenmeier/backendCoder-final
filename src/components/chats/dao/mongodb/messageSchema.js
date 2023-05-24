import mongoose from "mongoose";
export const messagesSchema = new mongoose.Schema({
  user: String,
  message: String,
  profileImage: String,
});
