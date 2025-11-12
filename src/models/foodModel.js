import mongoose from "mongoose";

export const foodSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  price: {
    type: String,
    require: true,
  },
  video: {
    type: String,
    require: true,
  },
  description: {
    type: String,
  },
  foodPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "foodPartner",
  },
});

export const foodModel = mongoose.model("food", foodSchema);
