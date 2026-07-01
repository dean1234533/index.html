import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 py-7">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-between gap-3 px-4 text-center sm:flex-row sm:text-left">
        <div className="flex items-center gap-2">
          <img src={import.meta.env.BASE_URL + 'logo.png'} alt="DB's Workouts" className="h-7 w-7 rounded object-cover" />
          <span className="text-xs text-zinc-500">© {new Date().getFullYear()} DB's Workouts</span>
        </div>
        <a href="https://dbworkouts.co.uk" target="_blank" rel="noopener" className="text-xs font-semibold text-[#B30018] hover:text-[#D0182E]">
          dbworkouts.co.uk
        </a>
      </div>
    </footer>
  );
}
