import React from "react";
import { useLocation } from "react-router-dom";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { track } from "@/lib/analytics";
import { bookingLink, tool, whatsappLink } from "@/lib/booking";

// Shown under every calculator. It says what the call is (a chat, not a session) and gives two ways to get in touch.
export default function CTA() {
  const { pathname } = useLocation();
  const t = tool(pathname);
  const click = (kind) => track("book_consultation_click", { tool: t.slug, placement: "tools_cta", kind });
  return (
    <section className="mx-auto max-w-2xl px-4 pb-12">
      <div className="rounded-2xl border border-[#B30018]/40 bg-zinc-950 p-6 text-center shadow-2xl shadow-black/20">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#e0334a]">Personal training in East London</p>
        <h2 className="mt-2 text-2xl font-black text-white">{t.heading}</h2>
        <p className="mt-2 text-sm text-zinc-400">
          Book a free consultation call with Dean, a REPs Level 3 personal trainer. It is a chat about your goals and where to start, not a free training session.
        </p>
        <div className="mt-5 flex flex-col items-stretch justify-center gap-3 sm:flex-row">
          <a
            href={bookingLink(t.slug, "tools_cta")}
            target="_blank"
            rel="noopener"
            onClick={() => click("book")}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-[#B30018] px-6 text-sm font-bold text-white transition-colors hover:bg-[#940014] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#B30018] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            Book a free consultation call <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </a>
          <a
            href={whatsappLink(t)}
            target="_blank"
            rel="noopener"
            onClick={() => click("whatsapp")}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-zinc-600 px-6 text-sm font-bold text-white transition-colors hover:bg-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" /> Message Dean on WhatsApp
          </a>
        </div>
        <p className="mt-3 text-xs text-zinc-500">Free · No commitment · A reply within 2 hours</p>
      </div>
    </section>
  );
}
