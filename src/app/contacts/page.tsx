import Navbar from "@/components/Navbar";
import ContactForm from "./ContactForm";
import styles from "./Contacts.module.css";

export default function ContactsPage() {
  return (
    <>
      <Navbar />
      <main className={styles.page}>
        <section className={styles.intro} aria-labelledby="contact-heading">
          <p className={styles.eyebrow}>Get in touch</p>
          <h1 id="contact-heading">Contact us</h1>
          <p className={styles.description}>
            Have a question about memberships, showtimes, or an upcoming visit? Send us a message and our team will get
            back to you soon.
          </p>
        </section>

        <ContactForm />
      </main>
    </>
  );
}
