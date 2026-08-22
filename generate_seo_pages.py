"""Generate DB's Workouts location SEO pages — run once then delete."""
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

LOCATIONS = [
    {
        "slug": "dagenham",
        "name": "Dagenham",
        "postcode": "RM10",
        "postcodes": ["RM8", "RM10"],
        "region": "East London",
        "park_hero": "Central Park Dagenham",
        "parks": ["Central Park, RM10", "Valence Park", "Scrattons Farm Open Space", "Thames View Open Space", "Your home garden"],
        "park_desc": "Central Park in Dagenham is one of the borough's most popular green spaces — a spacious, well-kept park that's perfect for outdoor circuits, sprint work, and strength training sessions away from the gym.",
        "local_note": "Dagenham's residential streets and open parks give you everything you need for a high-quality outdoor session without travelling far. Whether you're in RM8 or RM10, Dean comes to you.",
    },
    {
        "slug": "leyton",
        "name": "Leyton",
        "postcode": "E10",
        "postcodes": ["E10", "E11"],
        "region": "East London",
        "park_hero": "Leyton Jubilee Park",
        "parks": ["Leyton Jubilee Park", "Hackney Marshes", "Coronation Gardens", "Leyton Flats (Epping Forest)", "Your home garden"],
        "park_desc": "Leyton sits right on the edge of Hackney Marshes — one of the largest open green spaces in London. It's the ideal setting for outdoor PT sessions, offering open fields, flat running routes, and space for bodyweight and equipment-based training.",
        "local_note": "E10 is a well-connected, active community with excellent green space. Whether you prefer sessions near the marshes or closer to home in Leyton, Dean delivers structured training that fits around your schedule.",
    },
    {
        "slug": "upton-park",
        "name": "Upton Park",
        "postcode": "E13",
        "postcodes": ["E13", "E6"],
        "region": "East London",
        "park_hero": "West Ham Park",
        "parks": ["West Ham Park", "Plashet Park", "Upton Park Recreation Ground", "Central Park East Ham", "Your home garden"],
        "park_desc": "West Ham Park is one of the finest Royal Parks in East London — beautifully maintained, easily accessible, and spacious enough for all training styles. It's just minutes from Upton Park, making it the go-to venue for outdoor PT sessions in E13.",
        "local_note": "Upton Park and the surrounding E13 area is a densely connected neighbourhood with great transport links and excellent park provision. Dean works around your availability to deliver consistent, results-driven sessions close to where you live.",
    },
    {
        "slug": "manor-park",
        "name": "Manor Park",
        "postcode": "E12",
        "postcodes": ["E12", "E7"],
        "region": "East London",
        "park_hero": "Wanstead Flats",
        "parks": ["Wanstead Flats", "Manor Park Recreation Ground", "Aldersbrook Open Space", "City of London Cemetery grounds", "Your home garden"],
        "park_desc": "Wanstead Flats is a vast stretch of open common land bordering Manor Park — one of the few genuinely open, unobstructed outdoor spaces in East London. It's ideal for sprint drills, hill work, and functional fitness sessions with plenty of room to move.",
        "local_note": "Manor Park is a growing, community-focused neighbourhood in E12, and access to the Flats makes it one of the best postcodes in East London for outdoor training. Dean brings the equipment; you bring the effort.",
    },
    {
        "slug": "seven-kings",
        "name": "Seven Kings",
        "postcode": "IG2",
        "postcodes": ["IG2", "IG3"],
        "region": "East London",
        "park_hero": "Seven Kings Park",
        "parks": ["Seven Kings Park", "Goodmayes Park", "Valentines Park (Ilford)", "Chadwell Heath Recreation Ground", "Your home garden"],
        "park_desc": "Seven Kings Park is a well-maintained local park with open grass areas ideal for outdoor training. For larger sessions or more variety, Valentines Park in nearby Ilford — one of East London's most popular parks — is just minutes away.",
        "local_note": "IG2 sits at the crossroads of Ilford and Goodmayes, putting you within easy reach of multiple excellent training locations. Dean comes to you and selects the best local venue for your session goals.",
    },
    {
        "slug": "becontree",
        "name": "Becontree",
        "postcode": "RM8",
        "postcodes": ["RM8", "RM9"],
        "region": "East London",
        "park_hero": "Barking Park",
        "parks": ["Barking Park", "Central Park Dagenham", "Valence Park", "Becontree Heath", "Your home garden"],
        "park_desc": "Barking Park is a large, well-loved green space close to the Becontree estate — offering open lawns, paths, and a relaxed environment for outdoor PT sessions. Valence Park in Dagenham is another excellent option for clients in RM8.",
        "local_note": "The Becontree estate is the largest council housing estate in the UK and home to a growing community of people serious about their health. Dean has worked with clients across RM8 and RM9 delivering outdoor sessions that fit into real, busy lives.",
    },
    {
        "slug": "hornchurch",
        "name": "Hornchurch",
        "postcode": "RM11",
        "postcodes": ["RM11", "RM12"],
        "region": "East London / Essex border",
        "park_hero": "Harrow Lodge Park",
        "parks": ["Harrow Lodge Park", "Hornchurch Country Park", "Elm Park", "Pages Wood", "Your home garden"],
        "park_desc": "Harrow Lodge Park in Hornchurch is an excellent outdoor training location — a large, open park with a lake, grass areas, and woodland paths, perfect for a full range of PT sessions. Hornchurch Country Park offers even more space for those who want nature in their workout.",
        "local_note": "Hornchurch and the surrounding RM11/RM12 area sits on the East London and Essex border, giving residents access to some of the greenest training environments Dean covers. If you're looking for outdoor PT that feels genuinely fresh, this is it.",
    },
    {
        "slug": "chingford",
        "name": "Chingford",
        "postcode": "E4",
        "postcodes": ["E4", "IG8"],
        "region": "North East London",
        "park_hero": "Chingford Plain",
        "parks": ["Chingford Plain (Epping Forest)", "Highams Park Lake", "Friday Hill Open Space", "Larks Wood", "Your home garden"],
        "park_desc": "Chingford is the gateway to Epping Forest — thousands of acres of ancient woodland that offers the most dramatic outdoor training environment in East London. Chingford Plain alone is vast enough for sprints, hill reps, and circuit training, with fresh air and zero gym fees.",
        "local_note": "E4 is a leafy, ambitious postcode with a strong fitness culture. The easy access to forest and open common land makes Chingford one of the best locations Dean trains in — if you want outdoor PT that feels like a genuine escape, this is it.",
    },
    {
        "slug": "woodford",
        "name": "Woodford",
        "postcode": "IG8",
        "postcodes": ["IG8", "E18"],
        "region": "North East London",
        "park_hero": "Epping Forest",
        "parks": ["Epping Forest (Woodford)", "Roding Valley Recreation Ground", "Woodford Green Common", "Ray Park", "Your home garden"],
        "park_desc": "Woodford Green's common and the adjoining Epping Forest create one of the finest natural training environments in outer East London. Whether you want forest runs, hill sprints on the common, or open-field circuits, the variety here is unmatched.",
        "local_note": "Woodford is a well-established, affluent residential area in IG8, with access to outstanding green space. Dean has trained clients across the Woodford area who value the outdoor environment as much as the results — and consistently deliver both.",
    },
    {
        "slug": "barkingside",
        "name": "Barkingside",
        "postcode": "IG6",
        "postcodes": ["IG6", "IG2"],
        "region": "East London",
        "park_hero": "Hainault Forest",
        "parks": ["Hainault Forest Country Park", "Fairlop Waters", "Fullwell Cross Recreation Ground", "Barkingside Recreation Ground", "Your home garden"],
        "park_desc": "Hainault Forest Country Park is one of East London's hidden gems — over 300 acres of forest, open meadows, and lake, offering a spectacular setting for outdoor PT sessions that feel nothing like a conventional workout.",
        "local_note": "Barkingside in IG6 gives you access to outdoor training environments that most East Londoners don't know exist. Dean trains clients here who are done with the gym and ready for something that actually keeps them coming back.",
    },
    {
        "slug": "gants-hill",
        "name": "Gants Hill",
        "postcode": "IG2",
        "postcodes": ["IG2", "IG4"],
        "region": "East London",
        "park_hero": "Valentines Park",
        "parks": ["Valentines Park, Ilford", "Wanstead Park", "Seven Kings Park", "Cranbrook Park", "Your home garden"],
        "park_desc": "Gants Hill sits right between Valentines Park and Wanstead Park — two of the best outdoor training locations in East London. Both offer open green space, wooded areas, and room to run, making every session a genuinely great experience outdoors.",
        "local_note": "IG2 is a busy, community-oriented postcode, and the access to quality parks makes it ideal for outdoor PT. Dean trains clients regularly across the Gants Hill area, delivering results-focused sessions tailored to your schedule and goals.",
    },
    {
        "slug": "south-woodford",
        "name": "South Woodford",
        "postcode": "E18",
        "postcodes": ["E18", "E11"],
        "region": "North East London",
        "park_hero": "Wanstead Flats",
        "parks": ["Wanstead Flats", "George Green, South Woodford", "Epping Forest (Roding Valley)", "Snaresbrook Crown Court Green", "Your home garden"],
        "park_desc": "South Woodford is surrounded by outstanding outdoor space. Wanstead Flats — a huge expanse of open common land — sits on the doorstep, while Epping Forest is just minutes away. It's one of the most well-placed areas in East London for outdoor training.",
        "local_note": "E18 is a popular commuter suburb with a growing health-conscious community. Dean has trained clients across South Woodford who've made the switch from expensive gyms to purposeful outdoor PT — and haven't looked back.",
    },
    {
        "slug": "bow",
        "name": "Bow",
        "postcode": "E3",
        "postcodes": ["E3", "E2"],
        "region": "East London",
        "park_hero": "Victoria Park",
        "parks": ["Victoria Park", "Mile End Park", "Bow Recreation Ground", "Tredegar Square Garden", "Your home garden"],
        "park_desc": "Victoria Park is East London's most iconic outdoor space — a 200-acre Royal Park widely known as the 'People's Park', with wide open lawns, lakes, and dedicated running routes. It's the perfect training ground for outdoor PT sessions in E3.",
        "local_note": "Bow and the surrounding E3 area has been transformed over the past decade. A young, active population, proximity to Victoria Park, and excellent transport links make it one of the most in-demand areas Dean covers. Sessions are busy here — don't wait to book.",
    },
    {
        "slug": "canary-wharf",
        "name": "Canary Wharf",
        "postcode": "E14",
        "postcodes": ["E14", "E3"],
        "region": "East London",
        "park_hero": "Mudchute Park & Farm",
        "parks": ["Mudchute Park & Farm", "Millwall Park", "Island Gardens", "Crossrail Place Roof Garden", "Your home garden"],
        "park_desc": "Mudchute Park & Farm is one of the largest city farms in Europe and an outstanding outdoor training location — wide open, elevated, and with stunning views across Canary Wharf. It's a rare hidden gem that makes every session feel like a genuine escape from the city below.",
        "local_note": "Canary Wharf is home to thousands of busy professionals who struggle to fit exercise into their working day. Dean specialises in early morning and lunchtime outdoor sessions around E14 — effective, time-efficient, and a world away from the office.",
    },
    {
        "slug": "upminster",
        "name": "Upminster",
        "postcode": "RM14",
        "postcodes": ["RM14", "RM11"],
        "region": "East London / Essex border",
        "park_hero": "Upminster Park",
        "parks": ["Upminster Park", "Hornchurch Country Park", "Pages Wood", "Broadstone Road Recreation Ground", "Your home garden"],
        "park_desc": "Upminster sits at the far end of the District line on the edge of Essex — and the green space here is exceptional. Hornchurch Country Park, just minutes away, offers over 400 acres of open fields and river valley for outdoor training sessions that feel genuinely rural.",
        "local_note": "RM14 is one of the most desirable postcodes on the East London periphery. Clients here value the quieter, more open training environment — and Dean delivers sessions tailored to those who want effective results without battling into the city.",
    },
    {
        "slug": "harold-wood",
        "name": "Harold Wood",
        "postcode": "RM3",
        "postcodes": ["RM3", "RM1"],
        "region": "East London / Essex border",
        "park_hero": "Harold Wood Park",
        "parks": ["Harold Wood Park", "Pages Wood", "Havelock Playing Fields", "Raphael Park (Romford)", "Your home garden"],
        "park_desc": "Harold Wood Park is a quiet, well-maintained local park in RM3 — perfect for early morning or weekend outdoor sessions without the crowds. Pages Wood offers a more natural, forest-edge environment for clients who prefer training with trees overhead.",
        "local_note": "Harold Wood is a settled, family-oriented suburb close to the Essex border. Dean trains clients here who want reliable, professional outdoor PT close to home — without commuting to a gym or paying city-centre prices.",
    },
    {
        "slug": "newbury-park",
        "name": "Newbury Park",
        "postcode": "IG2",
        "postcodes": ["IG2", "IG6"],
        "region": "East London",
        "park_hero": "Valentines Park",
        "parks": ["Valentines Park, Ilford", "Goodmayes Park", "Wanstead Park", "Hainault Forest (nearby)", "Your home garden"],
        "park_desc": "Newbury Park is ideally placed for outdoor training — Valentines Park is within easy reach, and Goodmayes Park is just down the road. Both offer excellent green space for a structured 60-minute outdoor PT session without driving anywhere.",
        "local_note": "IG2 clients in Newbury Park benefit from Dean's knowledge of the best local spots for every type of session — whether you're after HIIT, strength circuits, or a more measured weight-loss programme. The parks here make training feel like a reward, not a chore.",
    },
    {
        "slug": "rainham",
        "name": "Rainham",
        "postcode": "RM13",
        "postcodes": ["RM13", "RM10"],
        "region": "East London",
        "park_hero": "Rainham Recreation Ground",
        "parks": ["Rainham Recreation Ground", "Rainham Marshes (RSPB)", "Thames Gateway open space", "Dovers Corner Recreation Ground", "Your home garden"],
        "park_desc": "Rainham Marshes is one of East London's most unique outdoor environments — managed by the RSPB and offering wide open riverside landscapes unlike anything you'll find closer to the city. For clients in RM13 who want fresh air and genuine nature in their training, this is exceptional.",
        "local_note": "Rainham is an underrated postcode that gives you more green space per square mile than most of East London. Dean trains clients here who want the benefits of professional outdoor PT in an environment that's calm, open, and free from the usual city pressure.",
    },
    {
        "slug": "loughton",
        "name": "Loughton",
        "postcode": "IG10",
        "postcodes": ["IG10", "CM16"],
        "region": "Essex / East London border",
        "park_hero": "Epping Forest",
        "parks": ["Epping Forest (Loughton)", "Roding Valley Meadows", "Loughton Brook trail", "Baldwins Hill Pond area", "Your home garden"],
        "park_desc": "Loughton sits directly on the edge of Epping Forest — one of the oldest and most extensive ancient forests in England. For outdoor PT sessions, it's as good as it gets: forest trails, open glades, hill climbs, and completely fresh air. No gym can compete.",
        "local_note": "IG10 is a prosperous, active community that takes fitness seriously. Dean trains clients in Loughton who want high-quality, coach-led outdoor sessions in a genuinely stunning natural environment — and that's exactly what he delivers.",
    },
    {
        "slug": "hackney",
        "name": "Hackney",
        "postcode": "E8",
        "postcodes": ["E8", "E9"],
        "region": "East London",
        "park_hero": "London Fields",
        "parks": ["London Fields", "Hackney Downs", "Clissold Park (nearby)", "Hackney Marshes", "Your home garden"],
        "park_desc": "London Fields is one of East London's most vibrant and well-used parks — a central open space in the heart of Hackney with great facilities, open lawns, and a lido nearby. For outdoor PT sessions in E8, it's the perfect backdrop for structured, high-quality training.",
        "local_note": "Hackney is one of London's most active boroughs, with a culture built around fitness, food, and community. Dean trains clients across E8 and E9 who want expert-led outdoor sessions that match the energy of the neighbourhood — serious results, great environment.",
    },
]

NAV_HTML = """  <div class="navContainer">
    <nav class="navBar">
      <div class="logoContainer">
        <img src="./pics/IMG_8070-removebg-preview.png" alt="DB's Workouts outdoor personal training logo" fetchpriority="high">
      </div>
      <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/pricing">Services &amp; Pricing</a></li>
        <li><a href="/testimonials">Testimonials</a></li>
        <li><a href="/Active-Living-1">Blog</a></li>
        <li><a href="/ai-plans">AI Plans</a></li>
        <li><a href="/contact">Contact</a></li>
        <li><a href="/contact" class="Nav-consultation-button">Book Now</a></li>
      </ul>
      <button class="Navbtn" aria-label="Open navigation menu">
        <span class="line1"></span>
        <span class="line2"></span>
        <span class="line3"></span>
      </button>
    </nav>
  </div>"""

FOOTER_HTML = """  <footer>
    <div class="footer-columns">
      <div class="footer-col">
        <p class="footer-brand">DB's Workouts</p>
        <p class="footer-tagline">Outdoor PT &middot; East London</p>
        <p class="footer-tagline">&#9733;&#9733;&#9733;&#9733;&#9733;&nbsp; 5.0 &middot; 69 Reviews</p>
      </div>
      <div class="footer-col">
        <p class="footer-heading">Pages</p>
        <a href="/">Home</a>
        <a href="/about">About</a>
        <a href="/pricing">Services &amp; Pricing</a>
        <a href="/testimonials">Testimonials</a>
        <a href="/contact">Contact</a>
        <a href="/Active-Living-1">Blog</a>
        <a href="/ai-plans">AI Plans</a>
        <a href="/smart-app">Smart App</a>
      </div>
      <div class="footer-col">
        <p class="footer-heading">Contact</p>
        <a href="https://wa.me/447752300937" target="_blank" rel="noopener">
          <img src="./pics/whatsapp 3.png" width="22" height="22" loading="lazy" decoding="async" alt="WhatsApp"> WhatsApp
        </a>
        <a href="mailto:dbs-workouts@yahoo.com" target="_blank" rel="noopener">
          <img src="./pics/mail.png" width="22" height="22" loading="lazy" decoding="async" alt="Email"> Email
        </a>
        <a href="https://www.instagram.com/dbs_workouts" target="_blank" rel="noopener">
          <img src="./pics/instagram 2.png" width="22" height="22" loading="lazy" decoding="async" alt="Instagram"> Instagram
        </a>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 DB&#39;s Workouts &middot; Dean Burt &nbsp;&middot;&nbsp;
        <a href="/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a> &nbsp;&middot;&nbsp;
        <a href="/terms-and-conditions" target="_blank" rel="noopener">Terms &amp; Conditions</a>
      </p>
    </div>
  </footer>"""

STYLES = """    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0a; color: white; font-family: "IBM Plex Serif", serif; font-size: clamp(15px, 2vw, 18px); overflow-x: hidden; }
    .redText { color: #b30018; }
    h1 { font-size: clamp(28px, 6vw, 52px); font-weight: 900; line-height: 1.15; margin: 0 0 16px; }
    h2 { font-size: clamp(22px, 4vw, 34px); font-weight: 700; margin: 32px 0 14px; line-height: 1.2; }
    p { line-height: 1.7; }
    a { color: inherit; }
    .hero-local { background: linear-gradient(135deg, #0d0d0d 0%, #1a0005 100%); padding: 110px 20px 60px; text-align: center; border-bottom: 2px solid #b30018; }
    .hero-local > p:first-child { font-size: 11px; letter-spacing: 0.22em; text-transform: uppercase; color: #b30018; margin-bottom: 12px; }
    .hero-local > p:last-of-type { font-size: clamp(14px, 2vw, 17px); color: rgba(255,255,255,0.7); margin-top: 8px; }
    .page-content { max-width: 800px; margin: 0 auto; padding: 40px 20px 60px; }
    .areas-grid { display: flex; flex-wrap: wrap; gap: 10px; margin: 16px 0; }
    .area-pill { background: #1a1a1a; border: 1px solid #b30018; border-radius: 20px; padding: 7px 14px; font-size: clamp(13px, 2vw, 15px); white-space: nowrap; }
    .cta-btn { display: inline-block; padding: clamp(11px,2vw,14px) clamp(20px,4vw,28px); background-color: #b30018; color: white; border: 2px solid white; border-radius: 6px; text-decoration: none; font-size: clamp(14px,2.5vw,18px); font-weight: 700; margin: 20px 0; transition: background 0.2s; }
    .cta-btn:hover { background-color: #9c1022; color: white; }
    .cta-btn.block { display: block; text-align: center; max-width: 320px; margin: 30px auto; width: 100%; }
    .info-block { background: #111; border-left: 4px solid #b30018; border-radius: 0 6px 6px 0; padding: 20px; margin: 24px 0; }
    .info-block h2 { font-size: clamp(17px, 3vw, 22px); margin-top: 0; }
    .local-footer { background: #0d0d0d; border-top: 1px solid rgba(255,255,255,0.08); padding: 32px 20px; text-align: center; font-size: 13px; color: rgba(255,255,255,0.45); }
    @media (max-width: 480px) { .hero-local { padding: 96px 16px 48px; } .page-content { padding: 28px 16px 48px; } .cta-btn.block { max-width: 100%; } .info-block { padding: 16px; } }"""


def build_page(loc):
    name = loc["name"]
    slug = loc["slug"]
    postcode = loc["postcode"]
    postcodes = loc["postcodes"]
    region = loc["region"]
    park_hero = loc["park_hero"]
    parks = loc["parks"]
    park_desc = loc["park_desc"]
    local_note = loc["local_note"]

    pc_str = " / ".join(postcodes)
    keywords = ", ".join([
        f"personal trainer {name}",
        f"outdoor personal training {name}",
        f"PT {name} {postcode}",
        f"fitness coach {name}",
        f"outdoor PT {name}",
        f"personal trainer {postcode}",
        f"outdoor gym {name}",
        f"{park_hero} personal trainer",
    ])

    schema_area = ", ".join([f'{{"@type":"Place","name":"{p}"}}' for p in postcodes])

    pills_html = "\n        ".join(
        f'<span class="area-pill">{p}</span>' for p in parks
    )

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Personal Trainer {name} | DB's Workouts – Outdoor PT {region}</title>
  <meta name="description" content="Looking for a personal trainer in {name}? DB's Workouts offers outdoor 1-to-1 PT sessions at {park_hero} and local parks ({pc_str}). From £44. Book a free consultation.">
  <meta name="keywords" content="{keywords}">
  <meta name="author" content="Dean Burt">
  <meta name="robots" content="index, follow">
  <meta name="geo.region" content="GB-ENG">
  <meta name="geo.placename" content="{name}, {region}">
  <meta name="theme-color" content="#000000">
  <link rel="canonical" href="https://dbworkouts.co.uk/personal-trainer-{slug}">
  <link rel="apple-touch-icon" sizes="180x180" href="./pics/IMG_8070-removebg-preview.png">
  <link rel="icon" href="./pics/IMG_8101.JPG" type="image/png" sizes="128x128">
  <meta property="og:title" content="Personal Trainer {name} | DB's Workouts – Outdoor PT">
  <meta property="og:description" content="Outdoor personal training in {name}, {region}. 1-to-1 PT sessions at {park_hero} and local parks. REPs certified. Book free.">
  <meta property="og:url" content="https://dbworkouts.co.uk/personal-trainer-{slug}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="DB's Workouts">
  <meta property="og:image" content="https://dbworkouts.co.uk/pics/IMG_8101.JPG">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Personal Trainer {name} | DB's Workouts – Outdoor PT">
  <meta name="twitter:description" content="Outdoor PT in {name} {pc_str}. Sessions from £44. REPs certified. {park_hero} and local parks. Free consultation available.">
  <meta name="twitter:image" content="https://dbworkouts.co.uk/pics/IMG_8101.JPG">
  <script type="application/ld+json">
  [
    {{
      "@context": "https://schema.org",
      "@type": "LocalBusiness",
      "@id": "https://dbworkouts.co.uk/#business",
      "name": "DB's Workouts – Personal Trainer {name}",
      "description": "Outdoor 1-to-1 personal training sessions in {name}, {region}. REPs Level 3 certified PT Dean Burt. Sessions at {park_hero} and surrounding areas {pc_str}.",
      "url": "https://dbworkouts.co.uk/personal-trainer-{slug}",
      "telephone": "+447752300937",
      "priceRange": "££",
      "image": "https://dbworkouts.co.uk/pics/IMG_8101.JPG",
      "logo": "https://dbworkouts.co.uk/pics/IMG_8070-removebg-preview.png",
      "address": {{"@type": "PostalAddress", "addressLocality": "{name}", "addressRegion": "{region}", "postalCode": "{postcode}", "addressCountry": "GB"}},
      "aggregateRating": {{"@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": "69", "bestRating": "5"}},
      "areaServed": [{schema_area}],
      "sameAs": ["https://www.facebook.com/dbs.workouts1","https://www.instagram.com/dbs_workouts","https://www.linkedin.com/in/db-s-workouts-2aa057214"]
    }},
    {{
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://dbworkouts.co.uk"}},
        {{"@type": "ListItem", "position": 2, "name": "Personal Trainer {name}", "item": "https://dbworkouts.co.uk/personal-trainer-{slug}"}}
      ]
    }}
  ]
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,400;0,500;1,400;1,500&family=Libre+Baskerville:wght@400;700&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
  <link rel="stylesheet" href="./Styles/navbar.css">
  <style>
{STYLES}
  </style>
</head>
<body>
{NAV_HTML}

  <div class="hero-local">
    <p>OUTDOOR PT &middot; {name.upper()}</p>
    <h1>Personal Trainer in <span class="redText">{name}</span></h1>
    <p>Outdoor PT &amp; strength coaching sessions at {park_hero} and local parks across {pc_str}. No gym needed.</p>
    <a href="/contact" class="cta-btn">Book a Free Consultation</a>
    <p style="font-size:14px;color:#999;">Free &middot; No commitment &middot; {name}, {region}</p>
  </div>

  <div class="page-content">
    <h2>Outdoor Personal Training in <span class="redText">{name}</span>, {region}</h2>
    <p>If you're searching for a personal trainer in {name}, DB's Workouts brings expert outdoor fitness coaching straight to your local park. Dean Burt is a REPs Level 3 certified personal trainer with over 12 years of experience delivering results-driven 1-to-1 sessions across {pc_str}. No gym membership, no commute — just effective training in the fresh air.</p>

    <div class="info-block">
      <h2 style="font-size:22px;margin-top:0;">Training Locations in {name}</h2>
      <div class="areas-grid">
        {pills_html}
      </div>
    </div>

    <h2>What's <span class="redText">Included</span></h2>
    <p>Every 60-minute {name} outdoor PT session includes a structured warm-up, a tailored main workout — whether that's strength training, HIIT, boxing pads, or cardio circuits — and a cool-down. Each session is built around your specific goals. Dean creates personalised programmes focused on body composition, strength, or overall fitness. Progress tracking is included at no extra cost.</p>

    <div class="info-block">
      <h2 style="font-size:22px;margin-top:0;">Why Train Outdoors in {name}?</h2>
      <p style="margin-top:8px;">{park_desc}</p>
    </div>

    <h2>About <span class="redText">DB's Workouts</span></h2>
    <p>{local_note}</p>
    <p style="margin-top:16px;">Dean holds a REPs Level 3 Personal Training qualification and has worked with hundreds of clients across East London — from complete beginners to experienced gym-goers looking for a new challenge. His approach is straightforward: understand your goals, design a programme that works, and hold you accountable every session.</p>

    <h2>Pricing for <span class="redText">{name} PT Sessions</span></h2>
    <p>Sessions from <strong>£44</strong> per session. Block bookings available from £37.40/session. <a href="/pricing" style="color:#b30018;">View full pricing.</a></p>

    <a href="/contact" class="cta-btn block">Book a Free Consultation</a>
  </div>

{FOOTER_HTML}

  <script defer src="./Script/navbar.js"></script>
  <script>
    if ('serviceWorker' in navigator) {{
      navigator.serviceWorker.getRegistrations().then(function(regs) {{
        regs.forEach(function(r) {{ r.unregister(); }});
      }});
    }}
  </script>
</body>
</html>"""


def main():
    for loc in LOCATIONS:
        filename = f"personal-trainer-{loc['slug']}.html"
        filepath = os.path.join(BASE_DIR, filename)
        html = build_page(loc)
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(html)
        print(f"  Created: {filename}")
    print(f"\nDone — {len(LOCATIONS)} pages generated.")


if __name__ == "__main__":
    main()
