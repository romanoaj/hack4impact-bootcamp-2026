import styles from "./About.module.css";

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <section className={styles.intro} aria-labelledby="about-heading">
        <p className={styles.eyebrow}>About the theater</p>
        <h1 id="about-heading">Silver Screen Cinema</h1>
        <p>A neighborhood theater built around the simple idea that every great film is better when it is shared.</p>
      </section>

      <article className={styles.infoBox} aria-labelledby="theater-name">
        <header className={styles.boxHeader}>
          <h2 id="theater-name">A home for memorable movie nights.</h2>
          <p className={styles.established}>
            Established
            <strong>1987</strong>
          </p>
        </header>

        <div className={styles.content}>
          <section className={styles.history} aria-labelledby="history-heading">
            <h3 id="history-heading">Our history</h3>
            <p>
              Silver Screen Cinema was founded in 1987 by a group of local film lovers who wanted to bring the magic of
              the big screen back to their neighborhood. What began as a single-screen theater in a restored downtown
              building has grown into a welcoming place for new releases, independent films, and generations of shared
              memories.
            </p>
          </section>

          <section aria-labelledby="mission-heading">
            <h3 id="mission-heading">Our mission</h3>
            <p>
              We make excellent cinema accessible, welcoming, and worth gathering for. From the films we choose to the
              care we bring to every visit, our goal is to create an experience that connects our community with stories
              from everywhere.
            </p>
          </section>

          <section aria-labelledby="vision-heading">
            <h3 id="vision-heading">Our vision</h3>
            <p>
              We envision a theater where everyone feels at home, every story has room to be heard, and the love of film
              continues to bring our community together for years to come.
            </p>
          </section>
        </div>
      </article>
    </main>
  );
}
