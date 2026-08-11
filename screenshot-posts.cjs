const puppeteer = require('/Users/deantyroneburtburt/.npm/_npx/7d92d9a2d2ccc630/node_modules/puppeteer');
const path = require('path');
const fs = require('fs');

const OUT_DIR = path.join(__dirname, 'instagram-exports');
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR);

const BASE = 'http://127.0.0.1:3000/NewBusinessWebSite';

const posts = [
  { id: '01-homepage-mobile',    url: `${BASE}/index.html`,            mobile: true  },
  { id: '02-homepage-desktop',   url: `${BASE}/index.html`,            mobile: false },
  { id: '03-pricing-mobile',     url: `${BASE}/pricing.html`,          mobile: true  },
  { id: '04-free-plan-desktop',  url: `${BASE}/free-workout-plan.html`,mobile: false },
  { id: '05-ai-plans-mobile',    url: `${BASE}/ai-plans.html`,         mobile: true  },
];

// Instagram post page — wraps a screenshot in a device mockup frame, 1080x1080
function makeHtml(screenshotB64, isMobile) {
  if (isMobile) {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{width:540px;height:540px;overflow:hidden;background:#060606;display:flex;align-items:center;justify-content:center;font-family:system-ui}
.glow{position:absolute;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle,rgba(179,0,24,.22) 0%,transparent 70%);top:-60px;left:-60px;pointer-events:none}
.phone{position:relative;width:208px;height:426px;background:#1a1a1a;border-radius:38px;border:2px solid #333;box-shadow:0 0 0 1px #111,0 40px 80px rgba(0,0,0,.85),inset 0 0 0 1px #2a2a2a;overflow:hidden}
.phone::before{content:'';position:absolute;top:12px;left:50%;transform:translateX(-50%);width:68px;height:18px;background:#111;border-radius:100px;z-index:10}
.screen{position:absolute;inset:0;border-radius:36px;overflow:hidden}
.screen img{width:390px;height:844px;object-fit:cover;object-position:top;transform-origin:top left;transform:scale(${208/390});display:block}
.brand{position:absolute;bottom:22px;left:50%;transform:translateX(-50%);white-space:nowrap;background:rgba(179,0,24,.15);border:1px solid rgba(179,0,24,.35);border-radius:100px;padding:5px 16px;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.55)}
</style></head><body>
<div class="glow"></div>
<div class="phone"><div class="screen"><img src="data:image/png;base64,${screenshotB64}"></div></div>
<div class="brand">dbworkouts.co.uk</div>
</body></html>`;
  } else {
    return `<!DOCTYPE html><html><head><meta charset="UTF-8"><style>
*{box-sizing:border-box;margin:0;padding:0}
body{width:540px;height:540px;overflow:hidden;background:#06060a;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:system-ui}
.glow{position:absolute;width:500px;height:300px;border-radius:50%;background:radial-gradient(ellipse,rgba(20,0,179,.14) 0%,rgba(179,0,24,.08) 50%,transparent 70%);bottom:-40px;right:-60px;pointer-events:none}
.laptop{position:relative;width:438px}
.lid{background:#1c1c1c;border-radius:10px 10px 0 0;border:2px solid #333;border-bottom:none;padding:10px 10px 0;position:relative}
.lid::before{content:'';position:absolute;top:5px;left:50%;transform:translateX(-50%);width:5px;height:5px;border-radius:50%;background:#2a2a2a}
.screen{overflow:hidden;border-radius:3px;height:248px;background:#000}
.screen img{width:1280px;height:800px;object-fit:cover;object-position:top;transform-origin:top left;transform:scale(${416/1280});display:block}
.base{background:linear-gradient(180deg,#2a2a2a,#1a1a1a);height:16px;border-radius:0 0 4px 4px;border:2px solid #333;border-top:none}
.foot{height:5px;background:#1e1e1e;border-radius:0 0 6px 6px;margin:0 22px;border:1.5px solid #2a2a2a;border-top:none}
.brand{margin-top:18px;white-space:nowrap;background:rgba(179,0,24,.15);border:1px solid rgba(179,0,24,.35);border-radius:100px;padding:5px 16px;font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.55)}
</style></head><body>
<div class="glow"></div>
<div class="laptop">
  <div class="lid"><div class="screen"><img src="data:image/png;base64,${screenshotB64}"></div></div>
  <div class="base"></div><div class="foot"></div>
</div>
<div class="brand">dbworkouts.co.uk</div>
</body></html>`;
  }
}

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', protocolTimeout: 120000 });

  for (const post of posts) {
    console.log(`Capturing ${post.id}...`);

    // 1. Screenshot the actual website page
    const sitePage = await browser.newPage();
    if (post.mobile) {
      await sitePage.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 });
    } else {
      await sitePage.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    }
    await sitePage.goto(post.url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    const siteShot = await sitePage.screenshot({ encoding: 'base64' });
    await sitePage.close();

    // 2. Render that screenshot inside a device frame, at 540x540
    const framePage = await browser.newPage();
    await framePage.setViewport({ width: 540, height: 540, deviceScaleFactor: 2 }); // 2x = 1080x1080
    await framePage.setContent(makeHtml(siteShot, post.mobile), { waitUntil: 'load' });
    await new Promise(r => setTimeout(r, 500));
    const outPath = path.join(OUT_DIR, `post-${post.id}.png`);
    await framePage.screenshot({ path: outPath, clip: { x: 0, y: 0, width: 540, height: 540 } });
    await framePage.close();

    console.log(`✓  post-${post.id}.png`);
  }

  await browser.close();
  console.log(`\nAll 5 posts saved to:\n${OUT_DIR}`);
})();
