"use client";

import { useMemo, useState } from "react";
import { useI18n } from "./I18nProvider";
import type { Dictionary } from "@/app/[lang]/dictionaries";
import { LeafIcon, SparklesIcon, LemonIcon, CheckIcon, EnvelopeIcon } from "./Icons";

type Guest = {
  name: string;
  phone: string;
};

type FormState = {
  attending: "yes" | "no" | "";
  guestCount: number;
  guests: Guest[];
  wishes: string;
};

const EMPTY_GUEST: Guest = { name: "", phone: "" };
const PHONE_RE = /^[+\d][\d\s\-()]{6,}$/;

export function RSVPForm() {
  const { t } = useI18n();

  const initial: FormState = useMemo(
    () => ({
      attending: "",
      guestCount: 1,
      guests: [{ ...EMPTY_GUEST }],
      wishes: "",
    }),
    []
  );

  const [form, setForm] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  function setAttending(value: "yes" | "no") {
    setForm((f) => ({ ...f, attending: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next.attending;
      return next;
    });
  }

  function setGuestCount(n: number) {
    const safe = Math.min(10, Math.max(1, Math.floor(n) || 1));
    setForm((f) => {
      const guests = [...f.guests];
      if (safe > guests.length) {
        while (guests.length < safe) guests.push({ ...EMPTY_GUEST });
      } else {
        guests.length = safe;
      }
      return { ...f, guestCount: safe, guests };
    });
  }

  function setGuest(i: number, patch: Partial<Guest>) {
    setForm((f) => {
      const guests = f.guests.map((g, idx) =>
        idx === i ? { ...g, ...patch } : g
      );
      return { ...f, guests };
    });
  }

  function setWishes(value: string) {
    setForm((f) => ({ ...f, wishes: value }));
  }

  function validate(): Record<string, string> {
    const errs: Record<string, string> = {};
    if (!form.attending) errs.attending = t.rsvp.errors.attendance;

    if (form.attending === "yes") {
      if (!form.guestCount || form.guestCount < 1) {
        errs.guestCount = t.rsvp.errors.guestCount;
      }
      form.guests.forEach((g, i) => {
        if (!g.name.trim()) errs[`name-${i}`] = t.rsvp.errors.name;
        if (!g.phone.trim() || !PHONE_RE.test(g.phone.trim())) {
          errs[`phone-${i}`] = t.rsvp.errors.phone;
        }
      });
    } else if (form.attending === "no") {
      const primary = form.guests[0];
      if (!primary.name.trim()) errs["name-0"] = t.rsvp.errors.name;
      if (!primary.phone.trim() || !PHONE_RE.test(primary.phone.trim())) {
        errs["phone-0"] = t.rsvp.errors.phone;
      }
    }
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const firstKey = Object.keys(errs)[0];
      const el = document.querySelector(`[data-field="${firstKey}"]`);
      if (el && "scrollIntoView" in el) {
        (el as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      return;
    }

    setSubmitting(true);

    const locale =
      typeof window !== "undefined"
        ? (document.cookie.match(/(?:^|; )locale=([^;]+)/)?.[1] ?? "en")
        : "en";

    const wishesText = form.wishes.trim();

    try {
      // 1. Persist the RSVP to Postgres.
      const rsvpRes = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attending: form.attending,
          guestCount: form.guestCount,
          guests: form.guests,
          wishes: wishesText || null,
          locale,
        }),
      });

      if (!rsvpRes.ok) {
        const payload = (await rsvpRes.json().catch(() => null)) as
          | { error?: string }
          | null;
        throw new Error(payload?.error ?? "RSVP submission failed");
      }

      // 2. If the user left a wish, persist it separately to Postgres.
      if (wishesText) {
        try {
          await fetch("/api/wishes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: form.guests[0].name.trim(),
              message: wishesText,
              locale,
            }),
          });
        } catch {
          // Wish persistence is best-effort; the RSVP itself succeeded.
        }
      }
    } catch (err) {
      setSubmitting(false);
      setErrors({
        _form:
          err instanceof Error
            ? err.message
            : "Could not submit. Please try again.",
      });
      return;
    }

    setSubmitting(false);
    setDone(true);
  }

  function reset() {
    setForm(initial);
    setErrors({});
    setDone(false);
  }

  if (done) return <SuccessPanel onAnother={reset} t={t} />;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={t.rsvp.title}
      className="relative max-w-xl mx-auto px-6 sm:px-10 py-10 sm:py-12 space-y-10 rounded-[28px]"
      style={{
        // Invitation-card surface: cream wash + soft shadow +
        // hairline border that picks up the printed invite frame.
        background:
          "linear-gradient(180deg, rgba(255,251,235,0.85) 0%, rgba(254,249,239,0.78) 100%)",
        border: "1px solid rgba(66, 92, 44, 0.18)",
        boxShadow:
          "0 30px 60px -30px rgba(45, 74, 34, 0.25), 0 1px 0 rgba(255,255,255,0.6) inset",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        // Body text inside the form (buttons, textarea, error
        // message) uses Minion Display for legibility. The
        // field labels and the submit CTA explicitly override
        // fontFamily below to keep their script feel.
        fontFamily:
          '"Minion Display", "Cormorant Garamond", "Playfair Display", Georgia, serif',
      }}
    >
      {/* Inner lemon cluster — small, soft, watermark-y */}
      <img
        src="/illustrations/lemons-set-3.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -top-6 -left-6 w-24 sm:w-28 opacity-50 mix-blend-multiply"
        style={{ filter: "saturate(0.92) brightness(1.02) hue-rotate(-4deg)" }}
      />
      <img
        src="/illustrations/lemons-set-4.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-6 -right-6 w-24 sm:w-28 opacity-50 mix-blend-multiply"
        style={{ filter: "saturate(0.92) brightness(1.02)" }}
      />

      {/* Hairline frame to match the printed invitation border */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-[22px]"
        style={{ border: "1px solid rgba(66, 92, 44, 0.18)" }}
      />

      {errors._form && (
        <p
          role="alert"
          className="rounded-2xl px-4 py-3 text-sm"
          style={{
            background: "rgba(220, 38, 38, 0.08)",
            border: "1px solid rgba(220, 38, 38, 0.25)",
            color: "#991b1b",
          }}
        >
          {errors._form}
        </p>
      )}
      <AttendanceField
        value={form.attending}
        error={errors.attending}
        onChange={setAttending}
        t={t}
      />

      {form.attending === "yes" && (
        <GuestCountField
          value={form.guestCount}
          error={errors.guestCount}
          onChange={setGuestCount}
          t={t}
        />
      )}

      {(form.attending === "yes" || form.attending === "no") && (
        <GuestList
          guests={form.guests}
          errors={errors}
          onChange={setGuest}
          t={t}
        />
      )}

      <div data-field="wishes">
        <label htmlFor="wishes" className="field-label">
          {t.rsvp.wishes}
        </label>
        <textarea
          id="wishes"
          className="field-textarea"
          style={{ minHeight: "110px" }}
          value={form.wishes}
          onChange={(e) => setWishes(e.target.value)}
          placeholder={t.rsvp.wishesPlaceholder}
          maxLength={500}
        />
      </div>

      <div className="pt-2 pb-6 -mt-6 flex justify-center">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center gap-2 rounded-full px-9 py-3 tracking-wide transition disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
          style={{
            fontFamily:
              '"Minion Display", "Cormorant Garamond", "Playfair Display", Georgia, serif',
            fontSize: "1.25rem",
            fontStyle: "italic",
            color: "var(--cream)",
            background:
              "linear-gradient(135deg, var(--leaf-500), var(--leaf-700))",
            border: "1px solid rgba(45, 68, 34, 0.4)",
            boxShadow:
              "0 6px 18px -4px rgba(45, 74, 34, 0.45), 0 1px 0 rgba(255,255,255,0.15) inset",
          }}
        >
          {submitting ? t.rsvp.submitting : t.rsvp.submit}
        </button>
      </div>
    </form>
  );
}

function AttendanceField({
  value,
  error,
  onChange,
  t,
}: {
  value: "yes" | "no" | "";
  error?: string;
  onChange: (v: "yes" | "no") => void;
  t: Dictionary;
}) {
  return (
    <fieldset data-field="attending">
      <legend className="field-label">{t.rsvp.attending}</legend>
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onChange("yes")}
          className="rounded-2xl border-2 px-4 py-3 transition inline-flex items-center justify-center gap-2 hover:shadow-md"
          style={{
            fontFamily:
              '"Minion Display", "Cormorant Garamond", "Playfair Display", Georgia, serif',
            fontSize: "1.1rem",
            ...(value === "yes"
              ? {
                  borderColor: "var(--leaf-500)",
                  background: "var(--leaf-50)",
                  color: "var(--highlight)",
                }
              : {
                  borderColor: "var(--leaf-200)",
                  color: "var(--text-body)",
                  background: "transparent",
                }),
          }}
        >
          <CheckIcon size={18} />
          <span>{t.rsvp.yes}</span>
        </button>
        <button
          type="button"
          onClick={() => onChange("no")}
          className="rounded-2xl border-2 px-4 py-3 transition inline-flex items-center justify-center gap-2 hover:shadow-md"
          style={{
            fontFamily:
              '"Minion Display", "Cormorant Garamond", "Playfair Display", Georgia, serif',
            fontSize: "1.1rem",
            ...(value === "no"
              ? {
                  borderColor: "var(--text-body)",
                  background: "var(--lemon-50)",
                  color: "var(--text-body)",
                }
              : {
                  borderColor: "var(--leaf-200)",
                  color: "var(--text-body)",
                  background: "transparent",
                }),
          }}
        >
          <EnvelopeIcon size={18} />
          <span>{t.rsvp.no}</span>
        </button>
      </div>
      {error && <p className="field-error">{error}</p>}
    </fieldset>
  );
}

function GuestCountField({
  value,
  error,
  onChange,
  t,
}: {
  value: number;
  error?: string;
  onChange: (n: number) => void;
  t: Dictionary;
}) {
  return (
    <div data-field="guestCount">
      <label htmlFor="guestCount" className="field-label">
        {t.rsvp.guestCount}
      </label>
      <div className="flex items-center gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => onChange(value - 1)}
          className="btn btn-ghost"
          style={{ width: "44px", height: "44px", padding: 0, fontSize: "1.25rem" }}
          aria-label="−"
        >
          −
        </button>
        <input
          id="guestCount"
          type="number"
          inputMode="numeric"
          min={1}
          max={10}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="field-input text-center"
          style={{ width: "84px" }}
        />
        <button
          type="button"
          onClick={() => onChange(value + 1)}
          className="btn btn-ghost"
          style={{ width: "44px", height: "44px", padding: 0, fontSize: "1.25rem" }}
          aria-label="+"
        >
          +
        </button>
        <span className="text-xs italic ml-2" style={{ color: "var(--text-body)" }}>
          {t.rsvp.guestCountHint}
        </span>
      </div>
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function GuestList({
  guests,
  errors,
  onChange,
  t,
}: {
  guests: Guest[];
  errors: Record<string, string>;
  onChange: (i: number, patch: Partial<Guest>) => void;
  t: Dictionary;
}) {
  return (
    <div className="space-y-10">
      {guests.map((g, i) => (
        <div
          key={i}
          className="space-y-5"
          style={{
            paddingTop: i === 0 ? 0 : "2rem",
            borderTop: i === 0 ? "none" : "1px solid var(--hairline)",
          }}
        >
          <p
            className="text-center"
            style={{
              fontFamily:
                '"High Spirited", "Lucy Rose PERSONAL", cursive',
              fontSize: "1.25rem",
              color: "var(--highlight)",
              letterSpacing: "0.04em",
            }}
          >
            — {t.rsvp.guestName} #{i + 1} —
          </p>
          <div data-field={`name-${i}`}>
            <label htmlFor={`name-${i}`} className="field-label">
              {t.rsvp.guestName}
            </label>
            <input
              id={`name-${i}`}
              type="text"
              className={`field-input ${errors[`name-${i}`] ? "error" : ""}`}
              value={g.name}
              onChange={(e) => onChange(i, { name: e.target.value })}
              placeholder={t.rsvp.guestNamePlaceholder}
              autoComplete="name"
            />
            {errors[`name-${i}`] && (
              <p className="field-error">{errors[`name-${i}`]}</p>
            )}
          </div>
          <div data-field={`phone-${i}`}>
            <label htmlFor={`phone-${i}`} className="field-label">
              {t.rsvp.phone}
            </label>
            <input
              id={`phone-${i}`}
              type="tel"
              className={`field-input ${errors[`phone-${i}`] ? "error" : ""}`}
              value={g.phone}
              onChange={(e) => onChange(i, { phone: e.target.value })}
              placeholder={t.rsvp.phonePlaceholder}
              autoComplete="tel"
            />
            {errors[`phone-${i}`] && (
              <p className="field-error">{errors[`phone-${i}`]}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function SuccessPanel({
  onAnother,
  t,
}: {
  onAnother: () => void;
  t: Dictionary;
}) {
  return (
    <div
      className="relative max-w-xl mx-auto px-6 sm:px-10 py-12 sm:py-16 text-center space-y-6 rounded-[28px] page-rise"
      style={{
        background:
          "linear-gradient(180deg, rgba(255,251,235,0.85) 0%, rgba(254,249,239,0.78) 100%)",
        border: "1px solid rgba(66, 92, 44, 0.18)",
        boxShadow:
          "0 30px 60px -30px rgba(45, 74, 34, 0.25), 0 1px 0 rgba(255,255,255,0.6) inset",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
      }}
    >
      {/* Lemon corner illustrations */}
      <img
        src="/illustrations/lemons-set-3.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -top-6 -left-6 w-24 sm:w-28 opacity-50 mix-blend-multiply"
        style={{ filter: "saturate(0.92) brightness(1.02) hue-rotate(-4deg)" }}
      />
      <img
        src="/illustrations/lemons-set-4.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute -bottom-6 -right-6 w-24 sm:w-28 opacity-50 mix-blend-multiply"
        style={{ filter: "saturate(0.92) brightness(1.02)" }}
      />

      {/* Inner hairline frame */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-3 rounded-[22px]"
        style={{ border: "1px solid rgba(66, 92, 44, 0.18)" }}
      />

      {/* Heart + leaf + sparkle row */}
      <div
        className="inline-flex items-center justify-center gap-2 relative"
        style={{ color: "var(--highlight)" }}
        aria-hidden
      >
        <LeafIcon size={28} />
        <SparklesIcon size={22} />
        <LemonIcon size={28} />
      </div>

      <h2
        className="relative"
        style={{
          fontFamily:
            '"High Spirited", "Lucy Rose PERSONAL", cursive',
          fontSize: "clamp(2.4rem, 6vw, 3.2rem)",
          color: "var(--highlight)",
          lineHeight: 1.1,
          textShadow: "0 1px 0 rgba(255,255,255,0.6)",
        }}
      >
        {t.rsvp.successTitle}
      </h2>

      <p
        className="relative max-w-md mx-auto italic"
        style={{
          fontFamily: "var(--font-serif)",
          color: "var(--text-body)",
        }}
      >
        {t.rsvp.successMessage}
      </p>

      <button
        type="button"
        onClick={onAnother}
        className="relative inline-flex items-center justify-center rounded-full px-7 py-2.5 transition hover:-translate-y-0.5"
        style={{
          fontFamily:
            '"High Spirited", "Lucy Rose PERSONAL", cursive',
          fontSize: "1.25rem",
          color: "var(--highlight)",
          background: "var(--lemon-50)",
          border: "1px solid var(--leaf-300)",
          boxShadow: "0 4px 12px -2px rgba(45, 74, 34, 0.18)",
        }}
      >
        {t.rsvp.another}
      </button>
    </div>
  );
}
