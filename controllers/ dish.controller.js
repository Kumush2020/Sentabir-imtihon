const dishService = require("../services/dish.service");
const AppError = require("../utils/AppError");

function validatePagination(query) {
  const pageRaw = query.page;
  const limitRaw = query.limit;
  const page = pageRaw === undefined ? 1 : Number(pageRaw);
  const limit = limitRaw === undefined ? 5 : Number(limitRaw);

  if (
    !Number.isInteger(page) || page < 1 ||
    !Number.isInteger(limit) || limit < 1 || limit > 20
  ) {
    return null;
  }
  return { page, limit };
}

async function getAllDishes(req, res, next) {
  try {
    const pagination = validatePagination(req.query);
    if (!pagination) {
      return res.status(400).json({
        success: false,
        message: "page and limit must be positive integers (limit max 20)"
      });
    }

    const result = await dishService.getAllDishes({
      ...pagination,
      category: req.query.category,
      search: req.query.search
    });

    return res.status(200).json({
      success: true,
      data: result.data,
      meta: result.meta
    });
  } catch (err) {
    next(err);
  }
}

async function getDishById(req, res, next) {
  try {
    if (!/^\d+$/.test(req.params.id) || Number(req.params.id) < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid dish id"
      });
    }

    const dish = await dishService.getDishById(req.params.id);
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: "Dish not found"
      });
    }

    return res.status(200).json({ success: true, data: dish });
  } catch (err) {
    next(err);
  }
}

async function createDish(req, res, next) {
  try {
    const dish = await dishService.createDish(req.body);
    return res.status(201).json({ success: true, data: dish });
  } catch (err) {
    next(err);
  }
}

async function uploadDishImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image file is required"
      });
    }

    if (!/^\d+$/.test(req.params.id) || Number(req.params.id) < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid dish id"
      });
    }

    const imagePath = `/uploads/${req.file.filename}`;
    const dish = await dishService.updateDishImage(req.params.id, imagePath);

    if (!dish) {
      const fs = require("fs/promises");
      const path = require("path");
      await fs.unlink(path.join(__dirname, "..", "uploads", req.file.filename)).catch(() => {});
      return res.status(404).json({
        success: false,
        message: "Dish not found"
      });
    }

    return res.status(200).json({ success: true, data: dish });
  } catch (err) {
    next(err);
  }
  return next(new AppError("Dish not found", 404));
}

module.exports = {
  getAllDishes,
  getDishById,
  createDish,
  uploadDishImage
};
