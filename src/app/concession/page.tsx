import MenuItem from "@/components/MenuItem";
import styles from "@/styles/movies.module.css";

const Menuitems = [
  { name: "Popcorn", price: 5.99, description: "Freshly popped popcorn" },
  { name: "Soda", price: 3.99, description: "Refreshing carbonated drink" },
  { name: "Chips", price: 1.99, description: "Crispy and savory chips" },
  { name: "Candy", price: 2.49, description: "Sweet and delicious candy" },
];

export default function ConcessionsPage() {
  return (
    <main className={styles.page}>
      <header className={styles.simpleHeader}>
        <h1>CONCESSIONS</h1>
      </header>

      <section className={styles.catalog}>
        <div className={styles.movieGrid}>
          {Menuitems.map((item) => (
            <MenuItem key={item.name} name={item.name} price={item.price} description={item.description} />
          ))}
        </div>
      </section>
    </main>
  );
}
