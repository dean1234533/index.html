import React from "react";
import Navbar from "../components/landing/Navbar";
import HeroSection from "../components/landing/HeroSection";
import ProblemSection from "../components/landing/ProblemSection";
import FeaturesSection from "../components/landing/FeaturesSection";
import CredibilitySection from "../components/landing/CredibilitySection";
import PricingSection from "../components/landing/PricingSection";
import FreeToolCTA from "../components/landing/FreeToolCTA";
import FinalCTA from "../components/landing/FinalCTA";
import Footer from "../components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <ProblemSection />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <FeaturesSection />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <CredibilitySection />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <PricingSection />
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
        <FreeToolCTA />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}