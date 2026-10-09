function validateDish(req, res, next) {
  const body = req.body || {};
  const errors = [];

  if (typeof body.name !== "string" || body.name.trim().length < 2) {
    errors.push("name is required (min 2 chars)");
  }

  if (typeof body.restaurant !== "string" || body.restaurant.trim().length < 2) {
    errors.push("restaurant is required (min 2 chars)");
  }

  if (!["Main", "Soup", "Dessert"].includes(body.category)) {
    errors.push("category must be one of: Main, Soup, Dessert");
  }

  if (
    body.weight === undefined ||
    body.weight === null ||
    body.weight === "" ||
    !Number.isInteger(Number(body.weight)) ||
    Number(body.weight) < 50 ||
    Number(body.weight) > 2000
  ) {
    errors.push("weight must be an integer between 50 and 2000");
  }

  if (
    body.price === undefined ||
    body.price === null ||
    body.price === "" ||
    !Number.isFinite(Number(body.price)) ||
    Number(body.price) <= 0
  ) {
    errors.push("price must be a positive number");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors
    });
  }

  next();
}

module.exports = validateDish;
