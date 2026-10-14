import connectDB from "@/database/db";
import Movie, { type MovieType } from "@/database/movieSchema";

export async function getMovieById(id: string): Promise<MovieType | null> {
  await connectDB();
  return Movie.findOne({ id }).lean<MovieType>();
}
