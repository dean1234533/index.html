# DB's Workouts: outdoor personal training website

**The production website for DB's Workouts, an outdoor personal training business in East London. It is built to turn visitors into consultation bookings, with local SEO pages, free fitness tools, and Stripe checkout.**

[![Live site](https://img.shields.io/badge/live-dbworkouts.co.uk-16a34a?style=flat-square)](https://dbworkouts.co.uk)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-F38020?style=flat-square&logo=cloudflare&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=flat-square&logo=stripe&logoColor=white)

**Live:** [dbworkouts.co.uk](https://dbworkouts.co.uk)

---

## Screenshots

<!-- Add images to docs/screenshots/ and uncomment. -->
<!--
| Home | Local area page | Free tools |
|---|---|---|
| ![](docs/screenshots/home.png) | ![](docs/screenshots/area.png) | ![](docs/screenshots/tools.png) |
-->

_Screenshots coming soon. For now, see the [live site](https://dbworkouts.co.uk)._

---

## Overview

This is a full redesign of a template-style site, rebuilt from scratch with
conversion as the main goal. Visitors are guided from a bold hero section to
booking a free consultation, with social proof at every step.

## Features

- **Conversion-focused landing page** with a hero CTA, a five-step "how to
  start" flow, services, and pricing
- **Social proof.** Client before-and-after photos, video testimonials, and
  Google review highlights.
- **Local SEO at scale.** More than 35 generated location pages (for example,
  "Personal trainer in Stratford" and "Ilford"), a sitemap, and `llms.txt` files
  for AI search engines.
- **Free fitness tools.** A React macro and training goal calculator served at
  `/tools`, plus free workout plans and a fat-loss guide.
- **AI training plans** page linking to [DB's AI Trainer](https://github.com/dean1234533/PT-AI_Helper)
- **Blog**, testimonials, a park guide, and programme pages
- **Stripe Checkout** through a Cloudflare Pages Function
- PWA manifest, service worker, cookie consent, and a dark theme

---

## Tech stack

| Layer | Technology |
|---|---|
| Site | Hand-written HTML5, CSS3 (Flexbox and Grid), and vanilla JavaScript |
| Tools hub | React, Vite, and Tailwind CSS (`fitness tool hub/`) |
| Edge | Cloudflare Pages and Pages Functions (Stripe checkout, `/tools` SPA fallback, `/smart` proxy) |
| Payments | Stripe |
| Automation | Python scripts for SEO page generation and site-wide nav and theme updates |

---

## Getting started

```bash
git clone https://github.com/dean1234533/index.html.git
cd index.html
```

The static site needs no build step, so you can open `index.html` in a browser.
For the full build, which includes the React tools hub and Pages Functions:

```bash
./build.sh                     # builds the tools hub and assembles dist/
npx wrangler pages dev dist    # run locally with functions
```

---

## Project structure

```
index.html, about.html, pricing.html …   main site pages
personal-trainer-*.html                  generated local SEO pages
fitness tool hub/                        React macro & goal calculator (/tools)
functions/                               Cloudflare Pages Functions (api, tools, smart)
generate_seo_pages.py, apply_*.py        site generation / maintenance scripts
Styles/, Script/, pics/, vids/           assets
```

---

## What I learned

- Redesigning a real business site with conversion as the main goal
- Structuring pages to guide visitors towards a single clear action
- Building trust with social proof: reviews, transformations, and testimonials
- Scaling local SEO with generated pages, and running a production site on a
  custom domain

---

## Author

Built by **Dean Da Dev**, a UK full-stack developer building web apps, websites,
and AI tools.

🌐 [dean-da-dev.co.uk](https://www.dean-da-dev.co.uk/) · 💼 [More projects](https://www.dean-da-dev.co.uk/portfolio) · 🐙 [GitHub](https://github.com/dean1234533)
