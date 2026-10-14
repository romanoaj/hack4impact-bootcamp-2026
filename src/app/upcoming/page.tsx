import MovieCard from "@/components/MovieCardPreview";
import MovieCarousel from "@/components/Carousel";
import { upcomingMovies } from "@/app/data/upcomingMovies";
import styles from "@/styles/movies.module.css";

export default function UpcomingPage() {
  return (
    <main className={styles.page}>
      <header className={styles.simpleHeader}>
        <h1>COMING SOON</h1>
      </header>

      <section className={styles.catalog} aria-label="Upcoming movies">
        <MovieCarousel>
          {upcomingMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </MovieCarousel>
      </section>
    </main>
  );
}
