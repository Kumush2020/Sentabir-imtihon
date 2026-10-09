const express = require("express");
const dishController = require("../controllers/dish.controller");
const validateDish = require("../middlewares/validateDish");
const upload = require("../middlewares/upload");

const router = express.Router();

router.get("/", dishController.getAllDishes);
router.get("/:id", dishController.getDishById);
router.post("/", validateDish, dishController.createDish);
router.post("/:id/image", upload.single("image"), dishController.uploadDishImage);

module.exports = router;
