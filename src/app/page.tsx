import UpcomingTickets from "@/components/UpcomingTickets";
import MovieCatalog from "@/components/MovieCatalog";
import styles from "@/styles/movies.module.css";

export default function Home() {
  return (
    <div>
      <main className={styles.page}>
        <div className="mx-auto flex max-w-[1360px] flex-wrap items-end justify-between gap-6 pr-[clamp(24px,7vw,112px)]">
          <div>
            <header className={styles.simpleHeader}>
              <h1>MOVIES</h1>
            </header>
          </div>

          <UpcomingTickets />
        </div>

        <MovieCatalog />
      </main>
    </div>
  );
}
