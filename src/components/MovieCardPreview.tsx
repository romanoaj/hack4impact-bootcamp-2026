import type { MovieType } from "@/database/movieSchema";
import styles from "./carousel.module.css";

type MovieCardPreviewProps = {
  movie: MovieType;
};

export default function MovieCardPreview({ movie }: MovieCardPreviewProps) {
  return (
    <article className={styles.previewCard}>
      <div className={styles.poster} style={{ background: movie.posterGradient }} aria-hidden="true">
        <span className={styles.badge}>Coming {movie.year}</span>
        <span className={styles.posterTitle}>{movie.title}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.headingRow}>
          <h2 className={styles.title}>{movie.title}</h2>
          <span className={styles.rating}>{movie.rating}</span>
        </div>
        <p className={styles.director}>Directed by {movie.director}</p>
        <p className={styles.meta}>
          {movie.runtimeMinutes} min · {movie.genres.join(" · ")}
        </p>
        <p className={styles.description}>{movie.description}</p>
      </div>
    </article>
  );
}
