import MovieCard from "@/app/components/MovieCardPreview";
import MovieCarousel from "@/app/components/Carousel";
import { upcomingMovies } from "@/app/data/upcomingMovies";
import Navbar from "@/app/components/Navbar";

export default function MoviesPage() {
  return (
    <main>
      <Navbar />
      <h1>Upcoming Movies!</h1>

      <MovieCarousel>
        {upcomingMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </MovieCarousel>
    </main>
  );
}
