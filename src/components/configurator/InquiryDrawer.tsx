"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Mail, MessageCircle, Phone, Send, X } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** Workshop contact endpoints used by the direct-request buttons. */
const WHATSAPP_NUMBER = "36301234567";
const CONTACT_EMAIL = "terrarisztika1@gmail.com";
const CONTACT_PHONE = "+36301234567";

export default function InquiryDrawer({
  open,
  onClose,
  summary,
  priceLabel,
  t,
  defaultName = "",
  defaultEmail = "",
}: {
  open: boolean;
  onClose: () => void;
  summary: { label: string; value: string }[];
  priceLabel: string;
  t: Dictionary["bespoke"];
  defaultName?: string;
  defaultEmail?: string;
}) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({
    name: defaultName,
    email: defaultEmail,
    phone: "",
    message: "",
  });

  useEffect(() => {
    if (open) {
      setStep(0);
      setDone(false);
    }
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  /** The configuration, rendered once as plain text for every channel. */
  const configText = useMemo(
    () =>
      [
        `${t.formConfig}:`,
        ...summary.map((r) => `• ${r.label}: ${r.value}`),
        `• ${t.estPrice}: ${priceLabel}`,
        form.message ? `\n${form.message}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    [summary, priceLabel, t, form.message]
  );

  const waHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(configText)}`;
  const mailHref = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    t.inquiryTitle
  )}&body=${encodeURIComponent(configText)}`;

  const contactValid = form.name.trim() !== "" && /.+@.+\..+/.test(form.email);

  const fieldCls =
    "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm text-[#f3f4f6] placeholder-[#5f676d] outline-none transition-colors focus:border-[#e58a3c]/60 focus:bg-white/[0.07]";

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-[70] flex justify-end"
          role="dialog"
          aria-modal="true"
          aria-label={t.inquiryTitle}
        >
          <motion.button
            aria-label={t.close}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          />

          <motion.div
            className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-white/10 bg-[#0b0c0e] text-[#f3f4f6]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 32 }}
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/10 px-6 py-5">
              <div>
                <h3 className="font-display text-lg font-semibold tracking-tight">
                  {t.inquiryTitle}
                </h3>
                {!done && (
                  <p className="mt-0.5 text-[11px] uppercase tracking-cinematic text-[#889096]">
                    {step === 0 ? t.stepContact : t.stepReview} · {step + 1}/2
                  </p>
                )}
              </div>
              <button
                onClick={onClose}
                aria-label={t.close}
                className="rounded-lg p-2 text-[#889096] transition-colors hover:bg-white/5 hover:text-white"
              >
                <X className="h-5 w-5" strokeWidth={1.75} />
              </button>
            </div>

            {done ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e58a3c]/15 text-[#e58a3c]">
                  <Check className="h-8 w-8" strokeWidth={2.5} />
                </span>
                <h4 className="font-display text-xl font-semibold">{t.successTitle}</h4>
                <p className="text-sm leading-relaxed text-[#889096]">{t.successText}</p>
                <button
                  onClick={onClose}
                  className="mt-2 rounded-xl bg-[#e58a3c] px-6 py-2.5 text-sm font-semibold text-[#1a0f06] transition-colors hover:bg-[#f0a05c]"
                >
                  {t.close}
                </button>
              </div>
            ) : (
              <div className="flex flex-1 flex-col">
                <p className="px-6 pt-5 text-sm leading-relaxed text-[#889096]">
                  {t.inquirySubtitle}
                </p>

                {step === 0 && (
                  <motion.div
                    className="flex flex-col gap-4 px-6 py-6"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28 }}
                  >
                    <Field label={t.formName}>
                      <input
                        className={fieldCls}
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        autoFocus
                      />
                    </Field>
                    <Field label={t.formEmail}>
                      <input
                        type="email"
                        className={fieldCls}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </Field>
                    <Field label={t.formPhone}>
                      <input
                        type="tel"
                        className={fieldCls}
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      />
                    </Field>
                    <Field label={t.formMessage}>
                      <textarea
                        rows={3}
                        className={`${fieldCls} resize-none`}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                      />
                    </Field>
                  </motion.div>
                )}

                {step === 1 && (
                  <motion.div
                    className="flex flex-col gap-4 px-6 py-6"
                    initial={{ opacity: 0, x: 12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.28 }}
                  >
                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                      <p className="mb-3 text-[10px] font-semibold uppercase tracking-cinematic text-[#e58a3c]">
                        {t.formConfig}
                      </p>
                      <dl className="flex flex-col gap-2 text-sm">
                        {summary.map((row) => (
                          <div key={row.label} className="flex justify-between gap-3">
                            <dt className="text-[#889096]">{row.label}</dt>
                            <dd className="text-right font-medium text-[#f3f4f6]">{row.value}</dd>
                          </div>
                        ))}
                        <div className="mt-1 flex justify-between gap-3 border-t border-white/10 pt-2">
                          <dt className="font-semibold text-[#c9ced3]">{t.estPrice}</dt>
                          <dd className="text-right font-bold text-[#e58a3c]">{priceLabel}</dd>
                        </div>
                      </dl>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm">
                      <p className="font-medium text-[#f3f4f6]">{form.name}</p>
                      <p className="text-[#889096]">{form.email}</p>
                      {form.phone && <p className="text-[#889096]">{form.phone}</p>}
                      {form.message && <p className="mt-2 text-[#889096]">{form.message}</p>}
                    </div>

                    {/* Direct channels — each one carries the configuration */}
                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-cinematic text-[#889096]">
                        {t.contactDirect}
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        <Channel href={waHref} icon={<MessageCircle className="h-4 w-4" />} label={t.viaWhatsapp} />
                        <Channel href={mailHref} icon={<Mail className="h-4 w-4" />} label={t.viaEmail} />
                        <Channel href={`tel:${CONTACT_PHONE}`} icon={<Phone className="h-4 w-4" />} label={t.viaPhone} />
                      </div>
                    </div>
                  </motion.div>
                )}

                <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 px-6 py-4">
                  {step === 1 ? (
                    <button
                      onClick={() => setStep(0)}
                      className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-[#c9ced3] transition-colors hover:bg-white/5"
                    >
                      <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                      {t.prev}
                    </button>
                  ) : (
                    <span />
                  )}

                  {step === 0 ? (
                    <button
                      disabled={!contactValid}
                      onClick={() => setStep(1)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#e58a3c] px-5 py-2.5 text-sm font-semibold text-[#1a0f06] transition-colors hover:bg-[#f0a05c] disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {t.next}
                      <ChevronRight className="h-4 w-4" strokeWidth={2} />
                    </button>
                  ) : (
                    <button
                      onClick={() => setDone(true)}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-[#e58a3c] px-5 py-2.5 text-sm font-semibold text-[#1a0f06] transition-colors hover:bg-[#f0a05c]"
                    >
                      <Send className="h-4 w-4" strokeWidth={2} />
                      {t.submit}
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-[11px] font-medium uppercase tracking-wide text-[#889096]">
      {label}
      {children}
    </label>
  );
}

function Channel({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.03] py-3 text-[11px] font-medium text-[#c9ced3] transition-colors hover:border-[#e58a3c]/50 hover:bg-[#e58a3c]/10 hover:text-white"
    >
      <span className="text-[#e58a3c]">{icon}</span>
      {label}
    </a>
  );
}
