import { uploadFile } from "../../services/storageService.js";
import { v4 as uuidv4 } from "uuid";
import { foodModel } from "../../models/foodModel.js";

//Create food items
export const createFood = async (req, res) => {
  const { name, description } = req.body;

  try {
    const uploadResult = await uploadFile(req.file.buffer, uuidv4());
    const foodItem = await foodModel.create({
      name: name,
      description: description,
      video: uploadResult.url,
      foodPartner: req.foodPartner._id,
    });
    res.status(201).json({
      message: "Food item created successFully",
      foodItem: {
        name: foodItem.name,
        description: foodItem.description,
        video: foodItem.video,
        foodPartner: foodItem.foodPartner,
        _id: foodItem._id,
      },
    });
  } catch (error) {
    console.log("Error in server:", error);
    res.status(500).json({ message: "Something went wrong on server side." });
  }
};

//Get all food items
export const getFood = async (req, res) => {
  try {
    const foodItems = await foodModel.find({});
    res.status(200).json({
      message: "All the food items fetched successfull",
      foodItems,
    });
  } catch (error) {
    console.log("Error in server:", error);
    res.status(500).json({ message: "Something went wrong on server side." });
  }
};
