import mongoose from "mongoose";

export const ticketSchema = new mongoose.Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
  },
  code: Number,
  purchase_datatime:Date,
  amount: Number,
  purchaser: String,
});

