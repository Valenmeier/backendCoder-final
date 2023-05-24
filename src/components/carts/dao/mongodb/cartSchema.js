import mongoose from "mongoose";
export const cartsSchema = new mongoose.Schema({
  products: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
});
cartsSchema.pre("find", function () {
  this.populate("products._id");
});
