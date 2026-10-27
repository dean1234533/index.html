const badges = [
  { href: 'https://fazier.com', src: 'https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=launched&amp;theme=light', alt: 'Fazier badge', width: 120 },
  { href: 'https://twelve.tools', src: 'https://twelve.tools/badge2-dark.svg', alt: 'Featured on Twelve Tools', width: 148, height: 40 },
  { href: 'https://neeed.directory/products/db-s-workouts-fitness-tools-hub?utm_source=db-s-workouts-fitness-tools-hub', src: 'https://neeed.directory/badges/neeed-badge-light.svg', alt: 'Featured on neeed.directory', width: 139, height: 20 },
  { href: 'https://deeplaunch.io', src: 'https://deeplaunch.io/badge/badge_dark.svg', alt: 'Featured on DeepLaunch.io', width: 200, height: 54 },
  { href: 'https://tooldirs.com', src: 'https://tooldirs.com/badge/badge_dark.svg', alt: 'Featured on ToolDirs', width: 200, height: 54 },
  { href: 'https://smollaunch.com', src: 'https://smollaunch.com/badges/featured.svg', alt: 'Featured on Smol Launch', width: 250, height: 60 },
  { href: 'https://saasfame.com/item/db-s-workouts-fitness-tools-hub', src: 'https://saasfame.com/badge-light.svg', alt: 'Featured on saasfame.com', width: 170, height: 54 },
  { href: 'https://findly.tools/db-s-workouts-fitness-tools-hub?utm_source=db-s-workouts-fitness-tools-hub', src: 'https://findly.tools/badges/findly-tools-badge-light.svg', alt: 'Featured on Findly.tools', width: 175, height: 55 },
  { href: 'https://uno.directory', src: 'https://uno.directory/uno-directory.svg', alt: 'Listed on Uno Directory', width: 120, height: 30 },
  { href: 'https://productwatch.io/products/db-s-workouts-fitness-tools-hub?utm_source=badge', src: 'https://productwatch.io/backend/api/v1/badge/featured?productId=0b9f3339-5a58-4a4b-9159-4f775231a75f&amp;darkMode=false', alt: "DB's Workouts Fitness Tools Hub", width: 250 },
  { href: 'https://saascity.io', src: 'https://saascity.io/badges/featured-dark.svg', alt: 'Featured on SaaSCity', width: 150, height: 54 },
  { href: 'https://toolfame.com/item/db-s-workouts-fitness-tools-hub', src: 'https://toolfame.com/badge-light.svg', alt: 'Featured on toolfame.com', width: 170, height: 54 },
];

export const TOOL_BADGE_CAROUSEL = `
<section class="directory-carousel" data-tool-badge-carousel data-directory-carousel role="region" aria-roledescription="carousel" aria-label="Directory badges">
  <div class="directory-carousel-heading">
    <h2>Discover more tools</h2>
    <div class="directory-controls" hidden>
      <button type="button" data-directory-prev aria-label="Previous directory">←</button>
      <button type="button" data-directory-pause aria-label="Pause directory carousel">Pause</button>
      <button type="button" data-directory-next aria-label="Next directory">→</button>
    </div>
  </div>
  <div class="directory-track" tabindex="0" aria-label="Directory links; swipe or use arrow keys">
${badges.map(badge => `    <a class="directory-badge" href="${badge.href}" target="_blank" rel="noopener"><img src="${badge.src}" alt="${badge.alt}" width="${badge.width}"${badge.height ? ` height="${badge.height}"` : ''} /></a>`).join('\n')}
  </div>
</section>`;

export function addToolBadgeCarousel(html) {
  html = html.replace(/\/tools\/badge-carousel\.(css|js)(?:\?[^\"']*)?/g, '/tools/badge-carousel.$1?v=20261026-app');
  // Refresh a built carousel from the shared badge list and discard extra copies.
  let replaced = false;
  html = html.replace(/<section\b[^>]*data-tool-badge-carousel[^>]*>[\s\S]*?<\/section>/gi, () => {
    if (replaced) return '';
    replaced = true;
    return TOOL_BADGE_CAROUSEL.trimStart();
  });
  if (replaced) return html;
  // Remove the old footer row and badges saved from earlier rendered responses.
  html = html.replace(/<div\b[^>]*class="tools-directory-badges"[^>]*>[\s\S]*?<\/div>/gi, '');
  html = html.replace(/<a\b[^>]*href="https:\/\/(?:fazier\.com|twelve\.tools)\/?"[^>]*>\s*<[^>]*\balt="(?:Fazier badge|Featured on Twelve Tools)"[^>]*>\s*<\/a>/gi, '');
  return html
    .replace('</head>', '<link rel="stylesheet" href="/tools/badge-carousel.css?v=20261026-app" />\n</head>')
    .replace('</body>', TOOL_BADGE_CAROUSEL + '\n<script src="/tools/badge-carousel.js?v=20261026-app" defer></script>\n</body>');
}
