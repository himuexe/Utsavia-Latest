const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");

// creating a category 
router.post('/create', CategoryController.createCategory);

// getting all subcategories
router.get("/subcategories",CategoryController.getAllSubCats); 

// creating an item
router.post('/items', CategoryController.createItem);

// getting all items
router.get("/items/:categoryId/:location", CategoryController.getAllItems);

//getting item by id
router.get("/item/:itemId/:location", CategoryController.getItemById);



module.exports = router;