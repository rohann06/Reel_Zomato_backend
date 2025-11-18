import { foodModel } from "../../models/foodModel.js";
import { foodPartnerModel } from "../../models/foodPartnerMoadel.js";
export const getUserFoodPartnerInfo = async (req, res) => {
  const { foodPartnerId } = req.query;
  if (!foodPartnerId) {
    return res.status(400).json({
      message: "Food partner ID is required",
    });
  }
  const foodPartner = await foodPartnerModel.findById(foodPartnerId);

  if (!foodPartner) {
    return res.status(404).json({
      message: "Food partner not found",
    });
  }
  const foodItems = await foodModel.find({ foodPartner: foodPartnerId });
  try {
    res.status(200).json({
      message: "Food partner info fetched successfully.",
      foodPartner: {
        _id: foodPartner._id,
        ownerName: foodPartner.ownerName,
        restaurantName: foodPartner.restaurantName,
        restaurantAddress: foodPartner.restaurantAddress,
        phone: foodPartner.phone,
        email: foodPartner.email,
        address: foodPartner.address,
        foodItems: foodItems.map((item) => ({
          _id: item._id,
          name: item.name,
          price: item.price,
          description: item.description,
          video: item.video,
        })),
      },
    });
  } catch (error) {
    console.error("Server error:", error.message);
    res
      .status(500)
      .json({ message: "Something went wrong on the server side." });
  }
};
