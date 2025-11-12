import { foodModel } from "../../models/foodModel.js";

export const getFoodPartnerInfo = async (req, res) => {
  try {
    const foodPartner = req.foodPartner;
    const foodItems = await foodModel.find({ foodPartner: foodPartner._id });
    res.status(200).json({
      message: "Food partner info fetched successfully.",
      foodPartner: {
        _id: foodPartner._id,
        ownerName: foodPartner.ownerName,
        restaurantName: foodPartner.restaurantName,
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
