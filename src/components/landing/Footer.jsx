import React from "react";
import { Instagram, MessageCircle } from "lucide-react";

const footerLinks = [
  { label: "Home", href: "#" },
  { label: "About", href: "#credibility" },
  { label: "Pricing", href: "#pricing" },
  { label: "DB's Workouts", href: "https://dbworkouts.co.uk", external: true },
];

const socials = [
  { icon: Instagram, href: "https://www.instagram.com/dbsworkouts", label: "Instagram" },
  { icon: MessageCircle, href: "https://wa.me/447752300937", label: "WhatsApp" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 md:py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
          <a href="#" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#b30018] to-[#ff4444] flex items-center justify-center">
              <span className="text-white font-bold text-sm">DB</span>
            </div>
            <span className="font-display font-bold text-xl text-white">
              DB's <span className="text-[#b30018]">AI</span>
            </span>
          </a>

          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="text-[#94a3b8] hover:text-white text-sm transition-colors duration-300"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="w-10 h-10 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#94a3b8] hover:text-white transition-all duration-300"
              >
                <social.icon className="w-5 h-5" aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center">
          <p className="text-[#94a3b8]/50 text-sm">
            © 2026 DB's Workouts · Dean Burt ·{" "}
            <a href="https://dbworkouts.co.uk/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-white/70 transition-colors">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
