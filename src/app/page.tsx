import MovieCatalog from "@/components/MovieCatalog";
import styles from "@/styles/movies.module.css";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <main className={styles.page}>
      <header className={styles.simpleHeader}>
        <h1>MOVIES</h1>
      </header>

      <MovieCatalog />
    </main>
  );
}
