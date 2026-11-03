import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { track } from "@/lib/analytics";
import { bookingLink, tool, whatsappLink } from "@/lib/booking";

// A slim bar that appears once someone has scrolled into a calculator, so booking is always one tap away.
export default function StickyBookBar() {
  const { pathname } = useLocation();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);
  const t = tool(pathname);
  return (
    <>
      <div aria-hidden="true" className="h-16" />
      <div
        className={`fixed inset-x-0 bottom-0 z-40 flex items-center justify-center gap-3 border-t border-zinc-800 bg-black/95 px-4 py-3 transition-transform duration-200 ${show ? "translate-y-0" : "translate-y-full"}`}
      >
        <a
          href={bookingLink(t.slug, "tools_bar")}
          target="_blank"
          rel="noopener"
          onClick={() => track("book_consultation_click", { tool: t.slug, placement: "tools_bar", kind: "book" })}
          className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md bg-[#B30018] px-4 text-sm font-bold text-white hover:bg-[#940014] sm:max-w-xs"
        >
          Free consultation call
        </a>
        <a
          href={whatsappLink(t)}
          target="_blank"
          rel="noopener"
          onClick={() => track("book_consultation_click", { tool: t.slug, placement: "tools_bar", kind: "whatsapp" })}
          className="inline-flex min-h-10 items-center justify-center rounded-md border border-zinc-600 px-4 text-sm font-bold text-white hover:bg-zinc-900"
        >
          WhatsApp
        </a>
      </div>
    </>
  );
}
