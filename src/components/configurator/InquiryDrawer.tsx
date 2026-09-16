"use client";

import { useEffect, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Send, X } from "lucide-react";

export type InquiryLabels = {
  inquiryTitle: string;
  inquirySubtitle: string;
  stepContact: string;
  stepReview: string;
  formName: string;
  formEmail: string;
  formPhone: string;
  formMessage: string;
  formConfig: string;
  next: string;
  prev: string;
  submit: string;
  successTitle: string;
  successText: string;
  close: string;
};

export default function InquiryDrawer({
  open,
  onClose,
  summary,
  priceLabel,
  labels,
  defaultName = "",
  defaultEmail = "",
}: {
  open: boolean;
  onClose: () => void;
  summary: { label: string; value: string }[];
  priceLabel: string;
  labels: InquiryLabels;
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

  if (!open) return null;

  const contactValid = form.name.trim() && /.+@.+\..+/.test(form.email);

  const fieldCls =
    "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-stone-100 placeholder-stone-500 outline-none transition-colors focus:border-brand-400 focus:bg-white/10";

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label={labels.inquiryTitle}
    >
      {/* backdrop */}
      <button
        aria-label={labels.close}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{ animation: "fadeIn 0.25s ease" }}
      />

      {/* panel */}
      <div
        className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-white/10 bg-stone-950 text-stone-100 shadow-2xl"
        style={{ animation: "slideInRight 0.32s cubic-bezier(0.22,1,0.36,1)" }}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">
              {labels.inquiryTitle}
            </h3>
            {!done && (
              <p className="mt-0.5 text-xs text-stone-400">
                {step === 0 ? labels.stepContact : labels.stepReview}
                <span className="text-stone-600"> · {step + 1}/2</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label={labels.close}
            className="rounded-lg p-2 text-stone-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <X className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        {done ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-500/15 text-brand-400">
              <Check className="h-8 w-8" strokeWidth={2.5} />
            </span>
            <h4 className="text-xl font-semibold">{labels.successTitle}</h4>
            <p className="text-sm leading-relaxed text-stone-400">
              {labels.successText}
            </p>
            <button
              onClick={onClose}
              className="mt-2 rounded-xl bg-brand-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
            >
              {labels.close}
            </button>
          </div>
        ) : (
          <div className="flex flex-1 flex-col">
            <p className="px-6 pt-5 text-sm leading-relaxed text-stone-400">
              {labels.inquirySubtitle}
            </p>

            {/* Step 0 – contact */}
            {step === 0 && (
              <div
                className="flex flex-col gap-4 px-6 py-6"
                style={{ animation: "fadeIn 0.3s ease" }}
              >
                <label className="flex flex-col gap-1.5 text-xs font-medium text-stone-300">
                  {labels.formName}
                  <input
                    className={fieldCls}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    autoFocus
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-medium text-stone-300">
                  {labels.formEmail}
                  <input
                    type="email"
                    className={fieldCls}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-medium text-stone-300">
                  {labels.formPhone}
                  <input
                    type="tel"
                    className={fieldCls}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </label>
                <label className="flex flex-col gap-1.5 text-xs font-medium text-stone-300">
                  {labels.formMessage}
                  <textarea
                    rows={3}
                    className={`${fieldCls} resize-none`}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                </label>
              </div>
            )}

            {/* Step 1 – review */}
            {step === 1 && (
              <div
                className="flex flex-col gap-4 px-6 py-6"
                style={{ animation: "fadeIn 0.3s ease" }}
              >
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-brand-300">
                    {labels.formConfig}
                  </p>
                  <dl className="flex flex-col gap-2 text-sm">
                    {summary.map((row) => (
                      <div key={row.label} className="flex justify-between gap-3">
                        <dt className="text-stone-400">{row.label}</dt>
                        <dd className="text-right font-medium text-stone-100">
                          {row.value}
                        </dd>
                      </div>
                    ))}
                    <div className="mt-1 flex justify-between gap-3 border-t border-white/10 pt-2">
                      <dt className="font-semibold text-stone-200">
                        {labels.formConfig}
                      </dt>
                      <dd className="text-right font-bold text-brand-300">
                        {priceLabel}
                      </dd>
                    </div>
                  </dl>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
                  <p className="font-medium text-stone-100">{form.name}</p>
                  <p className="text-stone-400">{form.email}</p>
                  {form.phone && <p className="text-stone-400">{form.phone}</p>}
                  {form.message && (
                    <p className="mt-2 text-stone-400">{form.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Footer nav */}
            <div className="mt-auto flex items-center justify-between gap-3 border-t border-white/10 px-6 py-4">
              {step === 1 ? (
                <button
                  onClick={() => setStep(0)}
                  className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-stone-300 transition-colors hover:bg-white/5"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                  {labels.prev}
                </button>
              ) : (
                <span />
              )}

              {step === 0 ? (
                <button
                  disabled={!contactValid}
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  {labels.next}
                  <ChevronRight className="h-4 w-4" strokeWidth={2} />
                </button>
              ) : (
                <button
                  onClick={() => setDone(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-500"
                >
                  <Send className="h-4 w-4" strokeWidth={2} />
                  {labels.submit}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
