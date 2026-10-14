"use client";

import type { MovieType } from "@/database/movieSchema";
import styles from "@/styles/movies.module.css";
import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";

export default function MovieCatalog() {
  const [movies, setMovies] = useState<MovieType[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetch("/api/movies")
      .then((res) => res.json())
      .then((data) => setMovies(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Failed to load movies:", error));
  }, []);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredMovies = movies.filter((movie) =>
    [movie.title, movie.director, ...movie.genres, ...movie.cast].some((field) =>
      field.toLowerCase().includes(normalizedQuery),
    ),
  );

  return (
    <section className={styles.catalog} aria-label="Movies">
      <div className={styles.searchBar}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search by title, director, genre, or cast"
          aria-label="Search movies"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>

      {filteredMovies.length > 0 ? (
        <div className={styles.movieGrid}>
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className={styles.noResults}>No movies match &ldquo;{query}&rdquo;.</p>
      )}
    </section>
  );
}
