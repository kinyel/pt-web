import { useId, useRef, useState, type FormEvent } from 'react';

/**
 * Contact form, wired to Formspree.
 *
 * TRANSPORT
 * Submitted with fetch and `Accept: application/json`, which is what makes
 * Formspree answer with JSON instead of redirecting to its own thank-you page.
 * The visitor never leaves the page and never loses what they typed: on any
 * failure the field state is left exactly as it was, and only on a confirmed
 * success is it cleared.
 *
 * The endpoint is not a secret — it ships in the HTML of every Formspree form
 * by design — so it is a plain constant rather than an env var. That is
 * deliberate: the previous Web3Forms wiring read a build-time key and rendered
 * a "not configured" notice when it was missing, which meant a broken form was
 * one unset variable away. This cannot fail that way.
 *
 * SPAM
 * `_gotcha` is Formspree's honeypot. It is hidden from people and from the tab
 * order; if anything fills it, Formspree accepts the request and silently drops
 * the message, so bots get no signal that they were caught.
 *
 * ERRORS
 * Formspree returns field-level errors as `{ errors: [{ field, message }] }`.
 * Those are mapped back onto the individual inputs so the correction happens
 * where the mistake is, rather than in a banner far from the offending field.
 */

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mqpznbre';

interface Props {
  /** Product and service names, so enquiries arrive pre-labelled. */
  interests: string[];
  recipientEmail: string;
  /** Overridable so the endpoint can be pointed elsewhere for testing. */
  endpoint?: string;
}

interface Fields {
  name: string;
  email: string;
  phone: string;
  company: string;
  interest: string;
  message: string;
}

type Status = 'idle' | 'submitting' | 'success' | 'error';

const EMPTY: Fields = { name: '', email: '', phone: '', company: '', interest: '', message: '' };

const labelClass = 'text-small font-semibold text-ink-800';
const baseInput =
  'min-h-12 w-full rounded-card border bg-white px-4 py-3 text-body text-ink-900 transition-colors placeholder:text-ink-400 focus:outline-none';
/* The invalid state is carried by the border AND the message, never by colour
   alone — colour on its own is not an accessible error signal. */
const inputClass = (invalid: boolean) =>
  `${baseInput} ${invalid ? 'border-signal-500 focus:border-signal-700' : 'border-ink-200 focus:border-prime-500'}`;
const errorClass = 'text-small text-signal-700';

export default function ContactForm({ interests, recipientEmail, endpoint }: Props) {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverMessage, setServerMessage] = useState('');

  const update =
    (key: keyof Fields) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFields((prev) => ({ ...prev, [key]: event.target.value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    };

  const validate = (): Partial<Record<keyof Fields, string>> => {
    const next: Partial<Record<keyof Fields, string>> = {};
    if (!fields.name.trim()) next.name = 'Please tell us your name.';
    if (!fields.email.trim()) {
      next.email = 'Please enter an email address so we can reply.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.trim())) {
      next.email = 'That email address does not look right.';
    }
    if (!fields.message.trim()) {
      next.message = 'Please tell us what you need.';
    } else if (fields.message.trim().length < 10) {
      next.message = 'A little more detail helps us route your enquiry.';
    }
    return next;
  };

  /** Moves focus to the first field in error, so a keyboard or screen-reader
      user is taken to the problem instead of being told one exists. */
  const focusFirstError = (found: Partial<Record<keyof Fields, string>>) => {
    const order: (keyof Fields)[] = ['name', 'email', 'phone', 'company', 'interest', 'message'];
    const first = order.find((key) => found[key]);
    if (first) formRef.current?.querySelector<HTMLElement>(`#${CSS.escape(`${formId}-${first}`)}`)?.focus();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validate();
    setErrors(found);
    if (Object.keys(found).length > 0) {
      focusFirstError(found);
      return;
    }

    setStatus('submitting');
    setServerMessage('');

    const formData = new FormData(event.currentTarget);
    formData.append('_subject', `Website enquiry: ${fields.interest || 'General'}`);

    try {
      const response = await fetch(endpoint ?? FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        /* Without this header Formspree replies with a redirect to its own
           hosted thank-you page instead of JSON. */
        headers: { Accept: 'application/json' },
      });

      if (response.ok) {
        setStatus('success');
        setFields(EMPTY);
        setErrors({});
        return;
      }

      /* Map Formspree's field errors back onto the inputs where possible. */
      const data = await response.json().catch(() => null);
      const list: { field?: string; message?: string }[] = data?.errors ?? [];
      const mapped: Partial<Record<keyof Fields, string>> = {};
      const general: string[] = [];

      for (const item of list) {
        const key = item.field as keyof Fields | undefined;
        if (key && key in EMPTY && item.message) mapped[key] = item.message;
        else if (item.message) general.push(item.message);
      }

      setStatus('error');
      setErrors(mapped);
      if (Object.keys(mapped).length > 0) focusFirstError(mapped);

      setServerMessage(
        general.join(' ') ||
          (Object.keys(mapped).length > 0
            ? 'Please check the highlighted fields and try again.'
            : `We could not send your message. Please try again, or email us at ${recipientEmail}.`),
      );
    } catch {
      /* Network-level failure: offline, DNS, blocked request. Nothing typed is
         lost, so the visitor can simply retry. */
      setStatus('error');
      setServerMessage(
        'We could not reach the server. Check your connection and try again, or call us directly.',
      );
    }
  };

  if (status === 'success') {
    return (
      <div
        className="rounded-panel border border-ink-200 bg-white p-8 text-center"
        role="status"
        aria-live="polite"
      >
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-prime-50 text-prime-700">
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h2 className="mt-4 font-display text-h3 text-ink-950">Message sent</h2>
        <p className="mt-2 text-body text-ink-600">
          Thank you. Our team will be in touch. For anything urgent, call us directly on the numbers
          listed on this page.
        </p>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-6 min-h-11 rounded-full border border-ink-200 px-5 py-2.5 text-small font-semibold text-ink-900 transition-colors hover:border-ink-400"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={handleSubmit}
      action={endpoint ?? FORMSPREE_ENDPOINT}
      method="POST"
      noValidate
      aria-busy={status === 'submitting'}
      className="flex flex-col gap-5 rounded-panel border border-ink-200 bg-white p-6 md:p-8"
    >
      {/* Formspree's honeypot. Hidden from people and from the tab order; if a
          bot fills it the submission is accepted and quietly discarded. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ display: 'none' }}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formId}-name`} className={labelClass}>
            Name <span className="text-signal-700">*</span>
          </label>
          <input
            id={`${formId}-name`}
            name="name"
            value={fields.name}
            onChange={update('name')}
            autoComplete="name"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${formId}-name-error` : undefined}
            className={inputClass(Boolean(errors.name))}
          />
          {errors.name && (
            <p id={`${formId}-name-error`} className={errorClass}>
              {errors.name}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formId}-company`} className={labelClass}>
            Company
          </label>
          <input
            id={`${formId}-company`}
            name="company"
            value={fields.company}
            onChange={update('company')}
            autoComplete="organization"
            className={inputClass(false)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formId}-email`} className={labelClass}>
            Email <span className="text-signal-700">*</span>
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            inputMode="email"
            value={fields.email}
            onChange={update('email')}
            autoComplete="email"
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? `${formId}-email-error` : undefined}
            className={inputClass(Boolean(errors.email))}
          />
          {errors.email && (
            <p id={`${formId}-email-error`} className={errorClass}>
              {errors.email}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formId}-phone`} className={labelClass}>
            Phone
          </label>
          <input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            value={fields.phone}
            onChange={update('phone')}
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? `${formId}-phone-error` : undefined}
            className={inputClass(Boolean(errors.phone))}
          />
          {errors.phone && (
            <p id={`${formId}-phone-error`} className={errorClass}>
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-interest`} className={labelClass}>
          What are you interested in?
        </label>
        <select
          id={`${formId}-interest`}
          name="interest"
          value={fields.interest}
          onChange={update('interest')}
          className={inputClass(false)}
        >
          <option value="">Select an option</option>
          {interests.map((interest) => (
            <option key={interest} value={interest}>
              {interest}
            </option>
          ))}
          <option value="Something else">Something else</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor={`${formId}-message`} className={labelClass}>
          Message <span className="text-signal-700">*</span>
        </label>
        <textarea
          id={`${formId}-message`}
          name="message"
          rows={5}
          value={fields.message}
          onChange={update('message')}
          required
          placeholder="Tell us about your fleet, cargo or team: size, locations, and what you need to track."
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? `${formId}-message-error` : undefined}
          className={`${inputClass(Boolean(errors.message))} min-h-32 resize-y`}
        />
        {errors.message && (
          <p id={`${formId}-message-error`} className={errorClass}>
            {errors.message}
          </p>
        )}
      </div>

      {status === 'error' && serverMessage && (
        <p
          className="rounded-card border border-signal-500/30 bg-signal-100 px-4 py-3 text-small text-signal-700"
          role="alert"
        >
          {serverMessage}
        </p>
      )}

      {/* Black on brand orange, matching Button.astro's primary variant. White
          on prime-600 is 3.7:1 and fails AA; ink-950 on prime-500 is 7.2:1. */}
      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-prime-500 px-7 py-3 font-semibold text-ink-950 transition duration-[var(--duration-base)] ease-[var(--ease-prime)] hover:-translate-y-0.5 hover:bg-prime-400 hover:shadow-lift active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none"
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>

      {/* Announces the in-flight state to assistive tech without stealing focus. */}
      <span className="sr-only" role="status" aria-live="polite">
        {status === 'submitting' ? 'Sending your message' : ''}
      </span>

      <p className="text-small text-ink-500">
        Prefer to talk? Call us on the numbers beside this form. They go straight to our Lagos
        office.
      </p>
    </form>
  );
}
