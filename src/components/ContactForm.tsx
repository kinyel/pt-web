import { useId, useState, type FormEvent } from 'react';

/**
 * Contact form wired to Web3Forms (build brief §D, option 1).
 *
 * Submissions are delivered to the address configured on the Web3Forms account
 * that owns the access key. Until PUBLIC_WEB3FORMS_KEY is set the form renders
 * a visible configuration notice rather than silently failing — a form that
 * looks like it sent and did not is worse than one that says it cannot.
 */

interface Props {
  accessKey?: string;
  /** Product and service names, so enquiries arrive pre-labelled. */
  interests: string[];
  recipientEmail: string;
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
const inputClass =
  'min-h-12 w-full rounded-card border border-ink-200 bg-white px-4 py-3 text-body text-ink-900 transition-colors placeholder:text-ink-400 focus:border-prime-500 focus:outline-none';
const errorClass = 'text-small text-signal-600';

export default function ContactForm({ accessKey, interests, recipientEmail }: Props) {
  const formId = useId();
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [serverMessage, setServerMessage] = useState('');

  const update = (key: keyof Fields) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    setFields((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const validate = (): boolean => {
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
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validate()) return;

    if (!accessKey) {
      setStatus('error');
      setServerMessage(
        'This form is not connected yet. Please email or call us using the details on this page.',
      );
      return;
    }

    setStatus('submitting');
    const formData = new FormData(event.currentTarget);
    formData.append('access_key', accessKey);
    formData.append('subject', `Website enquiry: ${fields.interest || 'General'}`);
    formData.append('from_name', 'PrimeTrack website');

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();

      if (response.ok && result.success) {
        setStatus('success');
        setFields(EMPTY);
      } else {
        setStatus('error');
        setServerMessage(
          result?.message ?? 'Something went wrong sending your message. Please try again.',
        );
      }
    } catch {
      setStatus('error');
      setServerMessage(
        'We could not reach the server. Check your connection, or call us directly.',
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
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-prime-50 text-prime-600">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
        <h2 className="mt-4 font-display text-h3 text-ink-950">Message sent</h2>
        <p className="mt-2 text-body text-ink-600">
          Thank you. Our team will be in touch. For anything urgent, call us directly on the
          numbers listed on this page.
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
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-panel border border-ink-200 bg-white p-6 md:p-8"
    >
      {!accessKey && (
        <p className="rounded-card border border-prime-200 bg-prime-50 px-4 py-3 text-small text-prime-900">
          <strong className="font-semibold">Setup required:</strong> set{' '}
          <code className="font-mono">PUBLIC_WEB3FORMS_KEY</code> so submissions reach{' '}
          {recipientEmail}. Until then this form cannot send.
        </p>
      )}

      {/* Honeypot — hidden from people, tempting to bots. */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formId}-name`} className={labelClass}>
            Name <span className="text-signal-600">*</span>
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
            className={inputClass}
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
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor={`${formId}-email`} className={labelClass}>
            Email <span className="text-signal-600">*</span>
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
            className={inputClass}
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
            className={inputClass}
          />
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
          className={inputClass}
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
          Message <span className="text-signal-600">*</span>
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
          className={`${inputClass} min-h-32 resize-y`}
        />
        {errors.message && (
          <p id={`${formId}-message-error`} className={errorClass}>
            {errors.message}
          </p>
        )}
      </div>

      {status === 'error' && (
        <p className="rounded-card border border-signal-500/30 bg-signal-100 px-4 py-3 text-small text-signal-700" role="alert">
          {serverMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-prime-600 px-7 py-3 font-semibold text-white transition-colors hover:bg-prime-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'submitting' ? 'Sending…' : 'Send message'}
      </button>

      <p className="text-small text-ink-500">
        Prefer to talk? Call us on the numbers beside this form. They go straight to our Lagos
        office.
      </p>
    </form>
  );
}
