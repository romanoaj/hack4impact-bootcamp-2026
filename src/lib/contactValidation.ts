export const CONTACT_LIMITS = {
  firstName: 50,
  lastName: 50,
  email: 254,
  phone: 25,
  subject: 120,
  message: 2_000,
} as const;

export type ContactFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type ContactField = keyof ContactFormData;

export type ContactValidationErrors = Partial<Record<ContactField, string>> & {
  form?: string;
};

export type ContactValidationResult =
  { success: true; data: ContactFormData } | { success: false; errors: ContactValidationErrors };

const NAME_PATTERN = /^[\p{L}\p{M}][\p{L}\p{M}'’. -]*$/u;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d().\s-]+$/;
const HTML_TAG_PATTERN = /<\s*\/?\s*[a-z][^>]*>/i;
const UNSAFE_CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function sanitizeText(value: unknown, preserveLineBreaks = false): string {
  if (typeof value !== "string") return "";

  const withoutControlCharacters = value.normalize("NFKC").replace(UNSAFE_CONTROL_CHARACTERS, "");

  if (preserveLineBreaks) {
    return withoutControlCharacters
      .replace(/\r\n?/g, "\n")
      .replace(/[^\S\n]+/g, " ")
      .replace(/\n +/g, "\n")
      .replace(/ +\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  return withoutControlCharacters.replace(/\s+/g, " ").trim();
}

/**
 * Normalize and validate contact form data. The returned data contains only
 * the fields accepted by the contact endpoint, so callers can safely send it
 * instead of forwarding the original form or request body.
 */
export function validateContactForm(input: unknown): ContactValidationResult {
  if (!isRecord(input)) {
    return { success: false, errors: { form: "Please submit a valid contact form." } };
  }

  const data: ContactFormData = {
    firstName: sanitizeText(input.firstName),
    lastName: sanitizeText(input.lastName),
    email: sanitizeText(input.email).toLowerCase(),
    phone: sanitizeText(input.phone),
    subject: sanitizeText(input.subject),
    message: sanitizeText(input.message, true),
  };
  const errors: ContactValidationErrors = {};

  if (!data.firstName) {
    errors.firstName = "First name is required.";
  } else if (data.firstName.length > CONTACT_LIMITS.firstName || !NAME_PATTERN.test(data.firstName)) {
    errors.firstName = "Enter a valid first name.";
  }

  if (!data.lastName) {
    errors.lastName = "Last name is required.";
  } else if (data.lastName.length > CONTACT_LIMITS.lastName || !NAME_PATTERN.test(data.lastName)) {
    errors.lastName = "Enter a valid last name.";
  }

  if (!data.email) {
    errors.email = "Email is required.";
  } else if (data.email.length > CONTACT_LIMITS.email || !EMAIL_PATTERN.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (data.phone) {
    const digitCount = data.phone.replace(/\D/g, "").length;

    if (
      data.phone.length > CONTACT_LIMITS.phone ||
      !PHONE_PATTERN.test(data.phone) ||
      digitCount < 7 ||
      digitCount > 15
    ) {
      errors.phone = "Enter a valid phone number or leave this field blank.";
    }
  }

  if (!data.subject) {
    errors.subject = "Subject is required.";
  } else if (data.subject.length > CONTACT_LIMITS.subject || HTML_TAG_PATTERN.test(data.subject)) {
    errors.subject = "Enter a subject without HTML tags.";
  }

  if (!data.message) {
    errors.message = "Message is required.";
  } else if (data.message.length > CONTACT_LIMITS.message || HTML_TAG_PATTERN.test(data.message)) {
    errors.message = "Enter a message without HTML tags.";
  }

  return Object.keys(errors).length > 0 ? { success: false, errors } : { success: true, data };
}
