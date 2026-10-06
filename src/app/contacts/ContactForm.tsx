"use client";

import { validateContactForm, type ContactValidationErrors } from "@/lib/contactValidation";
import { useState, type FormEvent } from "react";
import styles from "./Contacts.module.css";

type SubmitStatus = "idle" | "sending" | "success";

function FieldError({ id, message }: { id: string; message?: string }) {
  return message ? (
    <p id={id} className={styles.fieldError} role="alert">
      {message}
    </p>
  ) : null;
}

export default function ContactForm() {
  const [errors, setErrors] = useState<ContactValidationErrors>({});
  const [status, setStatus] = useState<SubmitStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const validation = validateContactForm(Object.fromEntries(new FormData(form).entries()));

    if (!validation.success) {
      setErrors(validation.errors);
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("sending");

    try {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validation.data),
      });
      const payload = (await response.json().catch(() => null)) as {
        error?: string;
        fields?: ContactValidationErrors;
      } | null;

      if (!response.ok) {
        setErrors(payload?.fields ?? { form: payload?.error ?? "Unable to send your message." });
        setStatus("idle");
        return;
      }

      form.reset();
      setStatus("success");
    } catch {
      setErrors({ form: "Unable to send your message right now. Please try again." });
      setStatus("idle");
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      {errors.form ? (
        <p className={styles.errorMessage} role="alert">
          {errors.form}
        </p>
      ) : null}

      {status === "success" ? (
        <p className={styles.successMessage} role="status">
          Thanks for reaching out. Our team will get back to you soon.
        </p>
      ) : null}

      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          <label htmlFor="first-name">First name</label>
          <input
            id="first-name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            maxLength={50}
            aria-invalid={Boolean(errors.firstName)}
            aria-describedby={errors.firstName ? "first-name-error" : undefined}
            required
          />
          <FieldError id="first-name-error" message={errors.firstName} />
        </div>

        <div className={styles.field}>
          <label htmlFor="last-name">Last name</label>
          <input
            id="last-name"
            name="lastName"
            type="text"
            autoComplete="family-name"
            maxLength={50}
            aria-invalid={Boolean(errors.lastName)}
            aria-describedby={errors.lastName ? "last-name-error" : undefined}
            required
          />
          <FieldError id="last-name-error" message={errors.lastName} />
        </div>
      </div>

      <div className={styles.fieldGrid}>
        <div className={styles.field}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "email-error" : undefined}
            required
          />
          <FieldError id="email-error" message={errors.email} />
        </div>

        <div className={styles.field}>
          <label htmlFor="phone">Phone number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={25}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          <FieldError id="phone-error" message={errors.phone} />
        </div>
      </div>

      <div className={styles.field}>
        <label htmlFor="subject">Subject</label>
        <input
          id="subject"
          name="subject"
          type="text"
          maxLength={120}
          aria-invalid={Boolean(errors.subject)}
          aria-describedby={errors.subject ? "subject-error" : undefined}
          required
        />
        <FieldError id="subject-error" message={errors.subject} />
      </div>

      <div className={styles.field}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows={6}
          maxLength={2_000}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "message-error" : undefined}
          required
        />
        <FieldError id="message-error" message={errors.message} />
      </div>

      <button className={styles.submitButton} type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
