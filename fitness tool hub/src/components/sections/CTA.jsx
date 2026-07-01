import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="mx-auto max-w-2xl px-4 pb-12">
      <div className="rounded-2xl border border-[#B30018]/40 bg-zinc-950 p-6 text-center shadow-2xl shadow-black/20">
        <h2 className="text-2xl font-black text-white">Ready to take the next step?</h2>
        <p className="mt-2 text-sm text-zinc-400">Train with DB's Workouts.</p>
        <a
          href="https://dbworkouts.co.uk"
          target="_blank"
          rel="noopener"
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-md bg-[#B30018] px-6 text-sm font-bold text-white transition-colors hover:bg-[#940014] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018] focus-visible:ring-offset-2 focus-visible:ring-offset-black sm:w-auto"
        >
          Book Your Free Consultation <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
