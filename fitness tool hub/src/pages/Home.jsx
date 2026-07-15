import React, { useEffect, useRef, useState } from "react";
import { track } from "@/lib/analytics";

import CalculatorWizard from "@/components/calculator/CalculatorWizard";
import Hero from "@/components/calculator/Hero";
import Results from "@/components/calculator/Results";
import CTA from "@/components/sections/CTA";
import FAQSection from "@/components/sections/FAQSection";
import Footer from "@/components/sections/Footer";
import RelatedTools from "@/components/sections/RelatedTools";
import { calculateResults } from "@/lib/calculator";
import { getRelatedTools } from "@/lib/tools-data";
import { usePageSeo } from "@/lib/seo";

const RELATED = getRelatedTools("macro-calculator");

const SUBMISSIONS_KEY = "db_workouts_calculator_submissions";
const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free Macro & Calorie Calculator",
  url: "https://dbworkouts.co.uk/tools/macro-calculator",
  applicationCategory: "HealthApplication",
  operatingSystem: "Any",
  publisher: {
    "@type": "Organization",
    name: "DB's Workouts",
    url: "https://dbworkouts.co.uk",
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "GBP",
  },
};

function getSavedSubmissions() {
  try {
    return JSON.parse(window.localStorage.getItem(SUBMISSIONS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveSubmission(submission) {
  const submissions = getSavedSubmissions();
  window.localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify([submission, ...submissions].slice(0, 100)));
}

export default function Home() {
  usePageSeo({
    title: "Free Macro & Calorie Calculator | DB's Workouts",
    description: "Calculate your calories, macros and personalised training recommendations in less than 60 seconds with DB's Workouts.",
    canonical: "https://dbworkouts.co.uk/tools/macro-calculator",
    schema: pageSchema,
  });

  const calculatorRef = useRef(null);
  const [data, setData] = useState({ workout_days: 3, equipment: [] });
  const [results, setResults] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("r");

    if (!encoded) return;

    try {
      const decoded = JSON.parse(atob(encoded));
      if (decoded.goal_calories) {
        const { goal_calories, maintenance_calories, protein_g, carbs_g, fat_g, ...inputData } = decoded;
        setData({
          workout_days: 3,
          equipment: [],
          ...inputData,
        });
        setResults({
          ...decoded,
          goal_calories,
          maintenance_calories,
          protein_g,
          carbs_g,
          fat_g,
        });
      }
    } catch {
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  const onChange = (partial) => setData((prev) => ({ ...prev, ...partial }));

  const handleStart = () => {
    calculatorRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleCalculate = () => {
    setIsCalculating(true);

    window.setTimeout(() => {
      const calculated = calculateResults(data);
      setResults(calculated);
      track('tool_calculation', { tool_name: 'macro_calculator' });
      setIsCalculating(false);

      const shareData = { ...data, ...calculated };
      window.history.replaceState({}, "", `${window.location.pathname}?r=${btoa(JSON.stringify(shareData))}`);
      saveSubmission({
        ...shareData,
        id: crypto.randomUUID?.() || String(Date.now()),
        created_date: new Date().toISOString(),
      });
    }, 450);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <Hero onStart={handleStart} />

      <main ref={calculatorRef} className="scroll-mt-6">
        <CalculatorWizard
          data={data}
          onChange={onChange}
          onCalculate={handleCalculate}
          isCalculating={isCalculating}
        />

        {results && (
          <>
            <Results data={data} results={results} />
            <CTA />
          </>
        )}
      </main>

      <FAQSection />
      <div className="mx-auto max-w-5xl px-4 pb-6">
        <RelatedTools tools={RELATED} />
      </div>
      <Footer />
    </div>
  );
}
