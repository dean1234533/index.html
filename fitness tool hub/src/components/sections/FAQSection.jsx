import React from "react";

const FAQS = [
  {
    question: "Is this calculator free?",
    answer: "Yes. You can calculate your calories, macros and workout recommendation without paying or signing up.",
  },
  {
    question: "Do I need to enter an email?",
    answer: "No. Results appear straight away and no email is required.",
  },
  {
    question: "How accurate are the results?",
    answer: "They are practical estimates based on your stats, goal and activity level. Adjust after two to four weeks of tracking.",
  },
  {
    question: "Can this help with fat loss?",
    answer: "Yes. Choose fat loss and the calculator will estimate a sensible calorie target and macro split.",
  },
  {
    question: "What if I only train at home?",
    answer: "Select your available equipment and the workout split will adapt to bodyweight, bands, dumbbells or gym kit.",
  },
  {
    question: "Is this medical advice?",
    answer: "No. This calculator is for educational purposes only and is not medical advice.",
  },
];

export default function FAQSection() {
  return (
    <section className="mx-auto max-w-2xl px-4 pb-12" aria-labelledby="calculator-faq">
      <div className="mb-5 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B30018]">FAQ</p>
        <h2 id="calculator-faq" className="mt-2 text-2xl font-black text-white">Quick Questions</h2>
      </div>
      <div className="space-y-3">
        {FAQS.map((item) => (
          <details key={item.question} className="group rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <summary className="cursor-pointer list-none text-sm font-bold text-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018]">
              <span className="flex items-center justify-between gap-4">
                {item.question}
                <span className="text-lg leading-none text-[#B30018] transition-transform group-open:rotate-45" aria-hidden="true">+</span>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-6 text-zinc-400">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
