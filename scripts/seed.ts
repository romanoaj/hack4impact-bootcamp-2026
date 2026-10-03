import mongoose from "mongoose";
import MenuItem from "../src/database/menuItemSchema";
import Movie from "../src/database/movieSchema";

const Menuitems = [
  { name: "Popcorn", price: 5.99, description: "Freshly popped popcorn" },
  { name: "Soda", price: 3.99, description: "Refreshing carbonated drink" },
  { name: "Chips", price: 1.99, description: "Crispy and savory chips" },
  { name: "Candy", price: 2.49, description: "Sweet and delicious candy" },
];

const movies = [
  {
    id: "spider-man-brand-new-day",
    title: "Spider-Man: Brand New Day",
    director: "Destin Daniel Cretton",
    year: 2026,
    runtimeMinutes: 120,
    rating: "PG-13",
    genres: ["Action", "Adventure", "Sci-Fi"],
    description:
      "Peter Parker begins a new chapter, but a fresh threat pulls him back into the city-spanning responsibility of being Spider-Man.",
    cast: ["Tom Holland", "Zendaya", "Jacob Batalon"],
    showtimes: ["1:15 PM", "4:30 PM", "7:45 PM"],
    posterLabel: "S",
    posterGradient: "linear-gradient(145deg, #172a55 0%, #851b26 55%, #c43834 100%)",
  },
  {
    id: "obsession",
    title: "Obsession",
    director: "Curry Barker",
    year: 2026,
    runtimeMinutes: 96,
    rating: "R",
    genres: ["Horror", "Thriller"],
    description:
      "A hopeless romantic uses a mysterious ritual to win over his longtime crush, only to discover that desire can become dangerously consuming.",
    cast: ["Michael Johnston", "Inde Navarrette", "Cooper Tomlinson"],
    showtimes: ["2:20 PM", "5:35 PM", "9:10 PM"],
    posterLabel: "O",
    posterGradient: "linear-gradient(145deg, #25141c 0%, #713341 50%, #c47a68 100%)",
  },
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI as string);
  for (const item of Menuitems) {
    await MenuItem.updateOne({ name: item.name }, item, { upsert: true });
  }
  for (const movie of movies) {
    await Movie.updateOne({ id: movie.id }, movie, { upsert: true });
  }

  console.log("Seeded", movies.length, "movies");
  console.log("Seeded", Menuitems.length, "menu items");
  await mongoose.disconnect();
}

seed();
