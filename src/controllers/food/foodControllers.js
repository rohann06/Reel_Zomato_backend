export const addFoodController = async (req, res) => {
  try {
    res.status(201).json({ message: "hite the end point " });
  } catch (error) {
    console.log("Something went wrong in the server", error);
    res
      .status(500)
      .json({ message: "Opps! something went wrong in the server...!" });
  }
};
