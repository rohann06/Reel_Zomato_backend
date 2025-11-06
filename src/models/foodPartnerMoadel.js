import mongoose from "mongoose";

export const foodPartnerSchema = mongoose.Schema({
  ownerName: {
    type: String,
    required: true,
  },
  restaurantName: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  restaurantAddress: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

export const foodPartnerModel = mongoose.model(
  "foodPartner",
  foodPartnerSchema
);
