import mongoose from "mongoose";
import { messagesSchema } from "./messageSchema.js";
const messagesCollection = "messages";

const model = mongoose.model(messagesCollection, messagesSchema);

export class MessagesModel {
  constructor() {
    this.db = model;
  }
  getMessages = async () => {
    return await this.db.find().lean().exec();
  };
  createMessage = async (data) => {
    await this.db.insertMany([data]);
    return {
      status: 200,
      payload: "Mensaje enviado correctamente",
    };
  };
}
