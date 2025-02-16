const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");

// getting all subcategories
router.get("/subcategories",CategoryController.getAllSubCats); 

// getting all items
router.get("/items/:categoryId/:location", CategoryController.getAllItems);

//getting item by id
router.get("/item/:itemId/:location", CategoryController.getItemById);

//check pincode 
router.get("/pincode/:pincode", CategoryController.validatePincode);



module.exports = router;