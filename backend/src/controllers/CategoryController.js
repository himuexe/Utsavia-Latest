const Category = require("../models/category");
const Item = require("../models/item");

const getAllSubCats = async (req, res) => {
  try {
    const subcategories = await Category.find({
      level: 1,
      isActive: true,
    }).select("name slug _id image");
    if (!subcategories) {
      return res.status(404).json({ error: "Categories not found" });
    }

    res.json(subcategories);
  } catch (error) {
    res.status(500).json({ error: "Error fetching subcategories" });
  }
};
const getAllItems = async (req, res) => {
  try {
    const { categoryId, location } = req.params;

    const query = {
      category: categoryId,
      isActive: true,
      prices: { $elemMatch: { city: location } } 
    };

    const items = await Item.find(query)
      .select("name description prices image _id") 
      .sort({ createdAt: -1 });

    if (!items.length) {
      return res.status(404).json({ error: "Items not found" });
    }

    res.json({ items });
  } catch (error) {
    console.error(error); 
    res.status(500).json({ error: "Error fetching items" });
  }
};
const getItemById = async (req, res) => {
  try {
    const { itemId, location } = req.params;

    const item = await Item.findById(itemId).select(
      "name description prices category image _id"
    );

    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    const priceForLocation = item.prices.find(price => price.city === location);

    if (!priceForLocation) {
      return res.status(404).json({ error: "Price not found for the specified location" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: "Error fetching item" });
  }
};

const validatePincode = async (req, res) => {
  const { pincode } = req.params;

  // Validate pincode format
  if (!/^\d{6}$/.test(pincode)) {
    return res.status(400).json({ error: "Invalid pincode format. Please provide a 6-digit pincode." });
  }

  try {
    const response = await fetch(`http://postalpincode.in/api/pincode/${pincode}`);

    // Check if the response is OK (status code 200)
    if (!response.ok) {
      return res.status(response.status).json({ error: "Failed to fetch data from the external API." });
    }

    const data = await response.json();


    // Return the data if everything is fine
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error); // Log the error for debugging
    res.status(500).json({ error: "An error occurred while fetching data. Please try again later." });
  }
};

module.exports = { 
  getAllSubCats,
  getAllItems,
  getItemById,
  validatePincode
};