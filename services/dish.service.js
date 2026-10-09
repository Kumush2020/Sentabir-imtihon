const fs = require("fs/promises");
const path = require("path");

const dataPath = path.join(__dirname, "..", "database", "data.json");

async function readDishes() {
  const raw = await fs.readFile(dataPath, "utf8");
  return JSON.parse(raw);
}

async function writeDishes(dishes) {
  await fs.writeFile(dataPath, JSON.stringify(dishes, null, 2), "utf8");
}

async function getAllDishes(query = {}) {
  let dishes = await readDishes();

  if (query.category) {
    const category = String(query.category).toLowerCase();
    dishes = dishes.filter(dish => dish.category.toLowerCase() === category);
  }

  if (query.search) {
    const search = String(query.search).toLowerCase();
    dishes = dishes.filter(dish =>
      dish.name.toLowerCase().includes(search) ||
      dish.restaurant.toLowerCase().includes(search)
    );
  }

  const total = dishes.length;
  const page = query.page;
  const limit = query.limit;
  const start = (page - 1) * limit;
  const data = dishes.slice(start, start + limit);
  const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

  return {
    data,
    meta: { total, page, limit, totalPages }
  };
}

async function getDishById(id) {
  const dishes = await readDishes();
  return dishes.find(dish => dish.id === Number(id)) || null;
}

async function createDish(input) {
  const dishes = await readDishes();
  const maxId = dishes.reduce((max, dish) => Math.max(max, dish.id), 0);
  const newDish = {
    id: maxId + 1,
    name: input.name.trim(),
    restaurant: input.restaurant.trim(),
    category: input.category,
    weight: Number(input.weight),
    price: Number(input.price),
    image: null
  };
  dishes.push(newDish);
  await writeDishes(dishes);
  return newDish;
}

async function updateDishImage(id, imagePath) {
  const dishes = await readDishes();
  const index = dishes.findIndex(dish => dish.id === Number(id));
  if (index === -1) return null;

  dishes[index].image = imagePath;
  await writeDishes(dishes);
  return dishes[index];
}

module.exports = {
  getAllDishes,
  getDishById,
  createDish,
  updateDishImage
};
