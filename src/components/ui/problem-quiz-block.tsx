"use client";

import { useMemo, useState } from "react";

import type { QuizStep } from "@/types/content";

type ProblemQuizBlockProps = {
  title: string;
  steps: QuizStep[];
};

type FormState = {
  step1: string[];
  step2: string[];
  brandName: string;
  siteUrl: string;
  city: string;
  monthlyBudget: string;
  name: string;
  phone: string;
};

export function ProblemQuizBlock({ title, steps }: ProblemQuizBlockProps) {
  const quizSteps = useMemo(() => steps.slice(0, 4), [steps]);
  const totalSteps = quizSteps.length || 4;
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    step1: [],
    step2: [],
    brandName: "",
    siteUrl: "",
    city: "",
    monthlyBudget: "",
    name: "",
    phone: "",
  });

  const progressPercent = (currentStep / totalSteps) * 100;
  const activeStep = quizSteps[currentStep - 1];
  const canGoNext =
    currentStep === 1
      ? form.step1.length > 0
      : currentStep === 2
        ? form.step2.length > 0
        : currentStep === 3
          ? form.brandName.trim().length > 0 && form.siteUrl.trim().length > 0
          : false;

  const toggleOption = (field: "step1" | "step2", value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
    }));
  };

  return (
    <section className="section-space">
      <div className="mx-auto w-full max-w-7xl px-6 lg:px-10">
        <div className="rounded-[1.5rem] border border-white/10 bg-[#0C0E4A] shadow-none">
          <div className="grid min-h-[560px] lg:grid-cols-[0.42fr_0.58fr]">
            <div className="flex flex-col border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-4xl">
                <span aria-hidden>🎁</span>
              </div>
              <h2 className="mt-8 font-display text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
                {title}
              </h2>
            </div>

            <div className="flex flex-col p-6 sm:p-8">
              <div className="space-y-4">
                <p className="text-sm font-semibold text-[var(--color-accent)]">Шаг {currentStep} из {totalSteps}</p>
                <div className="h-2 w-full rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              <div className="mt-8 flex-1">
                <h3 className="mt-2 text-2xl font-semibold text-white sm:text-3xl">
                  {activeStep?.title ?? ""}
                </h3>

                {currentStep <= 2 ? (
                  <div className="mt-6 grid gap-3">
                    {(activeStep?.options ?? []).map((option) => {
                      const field = currentStep === 1 ? "step1" : "step2";
                      const checked = form[field].includes(option);
                      return (
                        <label
                          key={option}
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
                            checked
                              ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10"
                              : "border-white/15 bg-white/[0.04] hover:bg-white/[0.08]"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleOption(field, option)}
                            className="h-4 w-4 accent-[var(--color-accent)]"
                          />
                          <span className="text-base text-white/90">{option}</span>
                        </label>
                      );
                    })}
                  </div>
                ) : null}

                {currentStep === 3 ? (
                  <div className="mt-6 grid gap-3">
                    <input
                      value={form.brandName}
                      onChange={(e) => setForm((prev) => ({ ...prev, brandName: e.target.value }))}
                      placeholder="Название бренда*"
                      className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/50 focus:border-[var(--color-accent)]"
                    />
                    <input
                      value={form.siteUrl}
                      onChange={(e) => setForm((prev) => ({ ...prev, siteUrl: e.target.value }))}
                      placeholder="Ссылка на сайт*"
                      className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/50 focus:border-[var(--color-accent)]"
                    />
                    <input
                      value={form.city}
                      onChange={(e) => setForm((prev) => ({ ...prev, city: e.target.value }))}
                      placeholder="Город"
                      className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/50 focus:border-[var(--color-accent)]"
                    />
                    <input
                      value={form.monthlyBudget}
                      onChange={(e) => setForm((prev) => ({ ...prev, monthlyBudget: e.target.value }))}
                      placeholder="Рекламный бюджет на продвижение в месяц"
                      className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/50 focus:border-[var(--color-accent)]"
                    />
                  </div>
                  ) : null}

                {currentStep === 4 ? (
                  <div className="mt-6 space-y-4">
                    <p className="text-sm leading-6 text-white/70">
                      Оставьте свои контактные данные для уточнения деталей
                    </p>
                    <div className="grid gap-3">
                      <input
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Имя*"
                        className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/50 focus:border-[var(--color-accent)]"
                      />
                      <input
                        value={form.phone}
                        onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="Телефон*"
                        className="rounded-xl border border-white/15 bg-white/[0.04] px-4 py-3 text-white outline-none placeholder:text-white/50 focus:border-[var(--color-accent)]"
                      />
                      <button
                        type="button"
                        className="rounded-xl bg-[var(--color-accent)] px-5 py-3 text-base font-semibold text-[#1c2338] transition hover:brightness-95"
                      >
                        Получить бонусы
                      </button>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="mt-8 flex items-center justify-between gap-3">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((step) => Math.max(1, step - 1))}
                    className="rounded-xl border border-white/20 px-5 py-2.5 text-base font-semibold text-white/75 transition hover:bg-white/10"
                  >
                    ← Назад
                  </button>
                ) : (
                  <span />
                )}
                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep((step) => Math.min(totalSteps, step + 1))}
                    disabled={!canGoNext}
                    className="rounded-xl bg-[var(--color-accent)] px-6 py-2.5 text-base font-semibold text-[#1c2338] transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Далее →
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
