import mongoose from "mongoose";
import MenuItem from "../src/database/menuItemSchema";

const Menuitems = [
  { name: "Popcorn", price: 5.99, description: "Freshly popped popcorn" },
  { name: "Soda", price: 3.99, description: "Refreshing carbonated drink" },
  { name: "Chips", price: 1.99, description: "Crispy and savory chips" },
  { name: "Candy", price: 2.49, description: "Sweet and delicious candy" },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI as string);
  for (const item of Menuitems) {
    await MenuItem.updateOne({ name: item.name }, item, { upsert: true });
  }
  console.log("Seeded", Menuitems.length, "menu items");
  await mongoose.disconnect();
}

seed();
