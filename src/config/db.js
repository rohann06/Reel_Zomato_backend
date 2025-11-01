import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("Data base connected successfully");
  } catch (error) {
    console.error("Error connecting a data base", error);
    process.exit(1);
  }
};
