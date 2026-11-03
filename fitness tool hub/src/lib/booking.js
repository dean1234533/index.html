// Links from the tools to the main DB's Workouts site, tagged so Google Analytics shows which calculator sent the visit.
const SITE = "https://dbworkouts.co.uk";
const WHATSAPP = "https://wa.me/447752300937";

const TOOLS = {
  "body-fat-calculator": { name: "body fat calculator", heading: "Know your body fat? Let's turn it into a plan." },
  "bmi-calculator": { name: "BMI calculator", heading: "Know your BMI? Let's build a plan around it." },
  "macro-calculator": { name: "macro calculator", heading: "Got your macros? Let's make them work for you." },
  "tdee-calculator": { name: "TDEE calculator", heading: "Know your daily calories? Let's put them to work." },
  "protein-calculator": { name: "protein calculator", heading: "Got your protein target? Let's build the training to match." },
  "water-intake-calculator": { name: "water intake calculator", heading: "Sorted your hydration? Let's sort the training too." },
  "one-rep-max-calculator": { name: "one rep max calculator", heading: "Know your one rep max? Let's get you stronger." },
  "running-pace-calculator": { name: "running pace calculator", heading: "Know your pace? Let's help you go further." },
  "calorie-burn-calculator": { name: "calorie burn calculator", heading: "Know what you burn? Let's turn it into results." },
  "outdoor-workout-generator": { name: "outdoor workout generator", heading: "Enjoyed that workout? Train with Dean in your local park." },
  "workout-plan-generator": { name: "workout plan generator", heading: "Got a plan? Let's make sure it works for you." },
};

export function tool(pathname = "") {
  const slug = pathname.replace(/^\/tools\/?/, "").replace(/\/+$/, "");
  const t = TOOLS[slug];
  return { slug: slug || "tools", name: t?.name ?? "calculators", heading: t?.heading ?? "Want help turning this into results?" };
}

export const bookingLink = (slug, placement) =>
  `${SITE}/contact?utm_source=tools&utm_medium=${placement}&utm_campaign=${encodeURIComponent(slug)}`;

export const whatsappLink = (t) => `${WHATSAPP}?text=${encodeURIComponent(`Hi Dean, I just used the ${t.name} on your website and I'd like help with my goals.`)}`;
