"""Build the mobile sports massage pages (hub, area pages and guides).

Run from the site root: python3 generate_massage_page.py

Every page reuses the head styles, navigation and footer of
online-personal-training.html (the site's current design) and swaps in its own
copy, photos and schema. The script also keeps the sitemap, llms.txt,
llms-full.txt and the pricing page in step with the pages it creates.
"""
from pathlib import Path
from html import escape
import json
import re

ROOT = Path(__file__).resolve().parent
DOMAIN = "https://dbworkouts.co.uk"
HUB_SLUG = "mobile-sports-massage-east-london"
MODIFIED = "2026-10-30"
MODIFIED_TEXT = "30 October 2026"
PRICE = "100.00"
PHOTO_1 = ("/pics/optimized/mobile-sports-massage-1.webp", 603, 866)
PHOTO_2 = ("/pics/optimized/mobile-sports-massage-2.webp", 603, 955)
BASE_LAT, BASE_LON = "51.5450", "-0.0553"         # Hackney Central: where the therapist is based
FIVE_MILES_M = "8047"

HERO_STYLE = '''<style>
.massage-hero-photo{height:auto!important;overflow:visible!important;max-width:400px;width:100%;margin-inline:auto;background:none}
.massage-hero-photo img{height:auto;aspect-ratio:603/866;object-fit:cover;border-radius:var(--r) var(--r) 64px var(--r)}
.massage-hero-photo:after{display:none}
.massage-hero-photo figcaption{position:static;margin-top:16px}
.massage-facts{width:100%;border-collapse:collapse;margin-top:18px;max-width:62ch}
.massage-facts th,.massage-facts td{text-align:left;padding:12px 0;border-top:1px solid var(--border-h);font-size:14px;line-height:1.5;vertical-align:top}
.massage-facts th{width:36%;color:var(--text-dim);font-weight:600;padding-right:16px}
.massage-facts tr:last-child th,.massage-facts tr:last-child td{border-bottom:1px solid var(--border-h)}
.massage-updated{font-size:12px;color:var(--text-dim);margin-top:24px}
</style>
'''

DISCLAIMER = ("This page is general information, not medical advice. If you have an injury, pain that worries you or a "
              "medical condition, speak to your GP or a physiotherapist, and tell us about it when you book.")

# ---------------------------------------------------------------- areas
# band (measured from Hackney, where the therapist is based; my estimates): inside = within about 5 miles, border = close to the 5-mile line, outside = further out.
AREAS = [
    dict(slug="stratford", name="Stratford", postcodes="E15 and E20", band="inside", pt="personal-trainer-stratford",
         near=["west-ham", "forest-gate", "bow", "canning-town", "leyton"]),
    dict(slug="west-ham", name="West Ham", postcodes="E15 and E13", band="border", pt="personal-trainer-west-ham",
         near=["stratford", "plaistow", "forest-gate", "canning-town", "east-ham"]),
    dict(slug="plaistow", name="Plaistow", postcodes="E13 and E16", band="outside", pt="personal-trainer-plaistow",
         near=["west-ham", "east-ham", "canning-town", "stratford", "forest-gate"]),
    dict(slug="forest-gate", name="Forest Gate", postcodes="E7", band="border", pt="personal-trainer-forest-gate",
         near=["stratford", "west-ham", "east-ham", "wanstead", "leytonstone"]),
    dict(slug="east-ham", name="East Ham", postcodes="E6", band="outside", pt="personal-trainer-east-ham",
         near=["plaistow", "west-ham", "forest-gate", "barking", "stratford"]),
    dict(slug="leytonstone", name="Leytonstone", postcodes="E11", band="inside", pt="personal-trainer-leytonstone",
         near=["leyton", "wanstead", "forest-gate", "walthamstow", "stratford"]),
    dict(slug="leyton", name="Leyton", postcodes="E10", band="inside", pt="personal-trainer-leyton",
         near=["leytonstone", "walthamstow", "hackney", "stratford", "bow"]),
    dict(slug="wanstead", name="Wanstead", postcodes="E11 and E12", band="border", pt="personal-trainer-wanstead",
         near=["leytonstone", "forest-gate", "ilford", "leyton", "stratford"]),
    dict(slug="walthamstow", name="Walthamstow", postcodes="E17", band="inside", pt="outdoor-pt-walthamstow",
         near=["leyton", "leytonstone", "hackney", "wanstead", "stratford"]),
    dict(slug="hackney", name="Hackney", postcodes="E8 and E9", band="inside", pt="personal-trainer-hackney",
         near=["bow", "leyton", "stratford", "walthamstow", "leytonstone"]),
    dict(slug="bow", name="Bow", postcodes="E3 and E2", band="inside", pt="personal-trainer-bow",
         near=["stratford", "hackney", "canning-town", "west-ham", "leyton"]),
    dict(slug="canning-town", name="Canning Town", postcodes="E16", band="border", pt="personal-trainer-canning-town",
         near=["plaistow", "west-ham", "stratford", "bow", "east-ham"]),
    dict(slug="ilford", name="Ilford", postcodes="IG1 and IG3", band="outside", pt="personal-trainer-ilford",
         near=["wanstead", "barking", "forest-gate", "east-ham", "romford"]),
    dict(slug="barking", name="Barking", postcodes="IG11", band="outside", pt="personal-trainer-barking",
         near=["east-ham", "ilford", "dagenham", "plaistow", "forest-gate"]),
    dict(slug="dagenham", name="Dagenham", postcodes="RM8 and RM10", band="outside", pt="personal-trainer-dagenham",
         near=["barking", "ilford", "romford", "east-ham", "plaistow"]),
    dict(slug="romford", name="Romford", postcodes="RM1", band="outside", pt="personal-trainer-romford",
         near=["dagenham", "ilford", "barking", "east-ham", "forest-gate"]),
]
AREA_BY_SLUG = {a["slug"]: a for a in AREAS}


def area_page_slug(a):
    return f"mobile-sports-massage-{a['slug']}"


def travel_text(a):
    n = a["name"]
    if a["slug"] == "hackney":
        return ("Jay is based in Hackney, so the price is the standard £100 for a one-hour session, "
                "with no travel charge.")
    if a["band"] == "inside":
        return (f"{n} is within about 5 miles of Hackney, so the price is the standard £100 for a one-hour session. "
                "We confirm this from your postcode before you book.")
    if a["band"] == "border":
        return (f"{n} is close to the 5-mile line from Hackney. A one-hour session is £100, or £120 if your address is "
                "more than 5 miles away. We confirm which applies from your postcode before you book.")
    return (f"{n} is more than 5 miles from Hackney, so the £20 travel charge applies: a one-hour session is £120 "
            "(£100 plus £20 travel).")


def travel_short(a):
    return {"inside": "No travel charge within 5 miles of Hackney.",
            "border": "£20 travel is added beyond 5 miles from Hackney.",
            "outside": "£120 a session including £20 travel."}[a["band"]]


def travel_lead(a):
    return {"inside": "£100 a session, with no travel charge",
            "border": "£100 a session, plus £20 if you are more than 5 miles out",
            "outside": "£120 a session including travel"}[a["band"]]


# --------------------------------------------------------------- guides
GUIDES = [
    dict(slug="sports-massage-for-runners-east-london",
         title="Sports Massage for Runners East London | DB's Workouts",
         description="Mobile sports massage for East London runners: a one-hour session at your home with Jay for £100. Book after a long run.",
         name="Sports Massage for Runners", h1="Sports Massage for Runners in East London", photo=2,
         lead="A one-hour sports massage at your home, built around your running. £100 a session, with no clinic trip after a long run.",
         quick="Mobile sports massage for runners in East London is a one-hour session with Jay at your home, for £100. Tell us about your mileage, any races and where you feel tight when you book. Travel beyond 5 miles from Hackney adds £20.",
         sections=[
             ("Massage that fits around your running", "Runners train around work and family, and a trip to a clinic can be the thing that stops a massage happening. Jay comes to your home, so you can book a session after a long run or between training blocks without travelling. Tell us how many miles you run, what you are training for and which areas feel tight, and the hour is spent where it matters to you."),
             ("Where East London runners train", "East London has plenty of places to run, including Queen Elizabeth Olympic Park, the Lee Valley towpaths, Wanstead Flats and Hackney Marshes. Whichever route you use, our mobile service covers the surrounding areas, so you can book from home after you finish."),
             ("Booking around races and long runs", "If you have a race or a big training week coming up, mention it when you message us. We will talk through the timing of your session with you and confirm availability and the total price before you book."),
             ("One hour, one person", "Each session is a one-hour massage with Jay. DB's Workouts also offers personal training, run by Dean Burt, a REPs Level 3 certified personal trainer. If you want strength work alongside your running, ask us about personal training too."),
         ],
         faqs=[("How much is a sports massage for runners in East London?", "A one-hour mobile sports massage costs £100. If your home is more than 5 miles from Hackney, travel adds £20, so the session is £120."),
               ("Can I book a massage after a long run?", "Yes. Tell us when you book and we will talk through timing with you and confirm availability."),
               ("Do I need to be a competitive runner?", "No. The session is for anyone who runs regularly, from weekend joggers to people training for events."),
               ("Is this a medical treatment?", "No. It is a one-hour sports massage session. If you have an injury or pain that worries you, speak to your GP or a physiotherapist first and tell us about it when you book.")]),
    dict(slug="gym-recovery-sports-massage-east-london",
         title="Gym Recovery Sports Massage East London | DB's Workouts",
         description="Sports massage for gym-goers in East London: a one-hour session at your home with Jay, a Level 3 qualified personal trainer and fully insured sports masseur, for £100.",
         name="Gym Recovery Massage", h1="Gym Recovery Sports Massage in East London", photo=1,
         lead="A one-hour sports massage at your home from a personal trainer who understands lifting. £100 a session.",
         quick="Gym recovery sports massage in East London is a one-hour session with Jay at your home, for £100. Tell us about your programme and the lifts that leave you tight. DB's Workouts also offers personal training. Travel beyond 5 miles from Hackney adds £20.",
         sections=[
             ("Recovery that fits around your training", "If you lift or train several times a week, a massage is one more thing to fit into your week. Jay is a Level 3 qualified personal trainer as well as a sports masseur. Tell us about your programme, your split or the exercises that leave you stiff, and the hour is shaped around how you train."),
             ("Recovery at home, on your schedule", "Gym sessions already take up your week. A mobile massage means no extra journey: Jay comes to your home and the session takes one hour. Message us with your postcode and the times that suit you."),
             ("Training and massage together", "If you also want coaching, DB's Workouts offers one-to-one personal training in East London parks and home gardens, online coaching and pair sessions, run by Dean Burt, a REPs Level 3 certified personal trainer. Ask us how a massage could fit around your training."),
             ("What to tell us when you book", "Mention how often you train, the areas that feel tight and any injuries or conditions. We use this to plan the session and will confirm availability and the total price before you book."),
         ],
         faqs=[("How much is a gym recovery massage in East London?", "A one-hour mobile sports massage costs £100. If your home is more than 5 miles from Hackney, travel adds £20, so the session is £120."),
               ("Does DB's Workouts also offer personal training?", "Yes. DB's Workouts, run by Dean Burt, a REPs Level 3 certified personal trainer, offers one-to-one personal training, online coaching and pair sessions."),
               ("Can I book a massage and personal training?", "Yes. DB's Workouts offers both. Message us to discuss how to fit a massage around your training."),
               ("Do I need to go to a clinic?", "No. Jay comes to your home in East London.")]),
    dict(slug="sports-massage-for-desk-workers-east-london",
         title="Sports Massage for Desk Workers East London | DB's Workouts",
         description="Mobile sports massage for desk workers in East London: a one-hour session at your home with Jay for £100. No clinic commute.",
         name="Massage for Desk Workers", h1="Sports Massage for Desk Workers in East London", photo=2,
         lead="A one-hour massage at home for people who sit for a living. £100 a session, with no extra commute.",
         quick="Sports massage for desk workers in East London is a one-hour mobile session with Jay at your home, for £100. Tell us where you feel tight after long days at a desk when you book. Travel beyond 5 miles from Hackney adds £20.",
         sections=[
             ("For people who sit all day", "You do not have to be an athlete to book a sports massage. Plenty of people spend long hours at a desk or on a laptop and feel it in their neck, shoulders and back. Tell us where you feel tight and what your working day looks like, and the hour is spent there."),
             ("No commute to a clinic", "If you already commute to work, another journey for a massage is hard to justify. Jay comes to your home, so a session can fit around working from home or a day off. Ask us about the times available."),
             ("Pair it with movement", "DB's Workouts also offers personal training, run by Dean Burt, a REPs Level 3 certified personal trainer. If you want to move more as well, ask us about one-to-one training outdoors, online coaching or pair sessions."),
             ("Tell us what is going on", "Mention any pain, injuries or conditions when you book. We confirm availability and the total price before the session, and you can ask us anything beforehand."),
         ],
         faqs=[("How much is a massage for desk workers in East London?", "A one-hour mobile sports massage costs £100. If your home is more than 5 miles from Hackney, travel adds £20, so the session is £120."),
               ("Do I need to be sporty to book?", "No. The session suits anyone, including people who mostly sit during the day."),
               ("Can I book if I work from home?", "Yes. Jay comes to your home. Message us with your postcode and the times that suit you."),
               ("Should I see a doctor first?", "If you have pain that worries you or a medical condition, speak to your GP or a physiotherapist, and tell us about it when you book.")]),
    dict(slug="sports-massage-cost-east-london",
         title="Sports Massage Cost East London | £100 | DB's Workouts",
         description="How much is a sports massage in East London? £100 for a one-hour session at your home with Jay. £20 extra beyond 5 miles.",
         name="Sports Massage Cost", h1="How Much Is a Sports Massage in East London?", photo=1,
         lead="A one-hour mobile sports massage costs £100. If you are more than 5 miles from Hackney, travel adds £20.",
         quick="A mobile sports massage with Jay costs £100 for a one-hour session at your home in East London. If your home is more than 5 miles from Hackney, travel adds £20, so the session is £120.",
         sections=[
             ("The price", "A one-hour mobile sports massage with Jay is £100. The session takes place at your home, so there is no studio fee and no travel for you."),
             ("When the travel charge applies", "If your home is more than 5 miles from Hackney, travel adds £20 for a one-hour session, so the total is £120. Jay is based in Hackney, so areas such as Hackney, Bow, Stratford, Leyton, Leytonstone and Walthamstow are within the standard zone. Wanstead, West Ham, Forest Gate and Canning Town are close to the line, and Plaistow, East Ham, Ilford, Barking, Dagenham and Romford are further out. We confirm the total from your postcode before you book."),
             ("What the price covers", "The price covers a one-hour session with Jay at your home, including travel within 5 miles of Hackney. We confirm the total price with you before the session, so there are no surprises on the day."),
             ("Booking more than one session", "If you want more than one session, ask us when you message. We will confirm availability and the price for the sessions you want."),
         ],
         faqs=[("How much is a sports massage in East London?", "A one-hour mobile sports massage with Jay costs £100 at your home. Beyond 5 miles from Hackney, travel adds £20, so the session is £120."),
               ("Is there a travel charge?", "Only beyond 5 miles from Hackney, when travel adds £20 for a one-hour session."),
               ("How long is a session?", "One hour."),
               ("How do I find out my exact price?", "Send us your postcode through the contact page or WhatsApp. He will confirm the total before you book.")]),
    dict(slug="what-to-expect-mobile-sports-massage",
         title="What to Expect from a Mobile Sports Massage | DB's Workouts",
         description="What happens in a mobile sports massage at your home in East London: how to book, what to prepare and what to tell us Burt.",
         name="What to Expect", h1="What to Expect from a Mobile Sports Massage", photo=2,
         lead="How a one-hour mobile sports massage works, from booking to the end of the session.",
         quick="A mobile sports massage with Jay is a one-hour session at your home in East London, costing £100 (plus £20 travel beyond 5 miles from Hackney). You message us, confirm the details, prepare a quiet room and tell us about any injuries before the session.",
         sections=[
             ("Booking", "Send us your postcode and the times that suit you through the contact page or WhatsApp. We confirm availability and the total price, including any travel charge, before the session."),
             ("Getting ready at home", "Choose a quiet room with enough space to lie down comfortably. Confirm anything else you need to set up when you book, and wear or have ready something comfortable."),
             ("What to tell us", "Mention how you train or work, the areas you want focused on, and any injuries, pain or medical conditions. Tell us what you are comfortable with so the hour suits you."),
             ("During and after the session", "The session lasts one hour. Afterwards, ask us for any advice for the rest of your day or week. If something worries you, speak to your GP or a physiotherapist."),
         ],
         faqs=[("How long does a mobile sports massage last?", "One hour."),
               ("Where does it take place?", "At your home. Jay comes to you across East London."),
               ("What should I tell you before the session?", "Tell us about your training or work, the areas to focus on and any injuries, pain or medical conditions."),
               ("How much does it cost?", "£100 for a one-hour session, plus £20 travel if your home is more than 5 miles from Hackney.")]),
]


# ---------------------------------------------------------------- helpers
def url_for(slug):
    return f"{DOMAIN}/{slug}"


def faq_html(faqs):
    return "\n".join(
        f'<details><summary>{escape(q)}<span aria-hidden="true">+</span></summary><p>{escape(a)}</p></details>'
        for q, a in faqs)


def pills(items):
    return "\n".join(f'<a class="area-pill" href="/{slug}">{escape(label)}</a>' for slug, label in items)


def hub_links_section():
    guides = pills([(g["slug"], g["name"]) for g in GUIDES])
    areas = pills([(area_page_slug(a), a["name"]) for a in AREAS])
    return (f'<section class="seo-section"><h2>Mobile sports massage by area</h2><p>Jay is based in Hackney and travels across East London. '
            f'Choose your area to see the price and nearby areas:</p><div class="areas-grid">{areas}</div></section>\n'
            f'<section class="seo-section"><h2>Sports massage guides</h2><p>Read more about booking and what to expect:</p>'
            f'<div class="areas-grid">{guides}</div></section>')


def final_section(kicker, h2, text, note):
    return (f'<section class="seo-final"><p class="seo-kicker">{kicker}</p><h2>{h2}</h2><p>{text}</p>'
            f'<div class="seo-actions"><a class="db-btn db-btn-primary" href="/contact">Book a session <span aria-hidden="true">↗</span></a>'
            f'<a class="seo-text-link" href="https://wa.me/447752300937">Message us on WhatsApp <span aria-hidden="true">↗</span></a></div>'
            f'<p class="seo-note">{note}</p></section>')


def hero(kicker, h1, lead, note, photo, alt, caption):
    src, w, h = photo
    return (f'<section class="seo-hero"><div class="seo-wrap seo-hero-grid">\n'
            f'<div><p class="seo-kicker">{kicker}</p><h1>{escape(h1)}</h1>\n<p class="seo-lead">{escape(lead)}</p>\n'
            f'<div class="seo-actions"><a class="db-btn db-btn-primary" href="/contact">Book a session <span aria-hidden="true">↗</span></a>'
            f'<a class="seo-text-link" href="#overview">Read more <span aria-hidden="true">↓</span></a></div>\n'
            f'<p class="seo-note">{note}</p></div>\n'
            f'<figure class="seo-hero-photo massage-hero-photo"><img src="{src}" alt="{escape(alt)}" width="{w}" height="{h}" '
            f'fetchpriority="high" decoding="async"><figcaption><span>DB&#x27;S WORKOUTS · MOBILE MASSAGE</span>'
            f'<strong>{escape(caption)}</strong></figcaption></figure>\n</div></section>')


def trust_bar(items):
    return '<div class="seo-trust"><div class="seo-wrap">' + "".join(
        f"<span><b>{escape(a)}</b>{escape(b)}</span>" for a, b in items) + "</div></div>"


def updated_line():
    return f'<p class="massage-updated">Last updated {MODIFIED_TEXT}. {escape(DISCLAIMER)}</p>'


def breadcrumb(name, url, parent=None):
    items = [{"@type": "ListItem", "position": 1, "name": "Home", "item": DOMAIN + "/"}]
    if parent:
        items.append({"@type": "ListItem", "position": 2, "name": "Mobile Sports Massage", "item": url_for(HUB_SLUG)})
        items.append({"@type": "ListItem", "position": 3, "name": name, "item": url})
    else:
        items.append({"@type": "ListItem", "position": 2, "name": name, "item": url})
    return {"@type": "BreadcrumbList", "itemListElement": items}


def faq_schema(faqs):
    return {"@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faqs]}


JAY_SPECIALITIES = ["Muscle building", "Fat loss and body toning", "Functional fitness", "Strength and conditioning",
                    "Beginner fitness", "Advanced training"]
JAY_NODE = {"@type": "Person", "@id": DOMAIN + "/#jay", "name": "Jay Marson", "givenName": "Jay", "familyName": "Marson",
            "jobTitle": "Sports masseur and personal trainer",
            "description": "Personal trainer with 8 years of experience, working freelance with DB's Workouts as a mobile "
                           "sports masseur based in Hackney. Level 3 qualified and fully insured.",
            "knowsAbout": JAY_SPECIALITIES,
            "worksFor": {"@id": DOMAIN + "/#business"},
            "workLocation": {"@type": "Place", "name": "Hackney, London"},
            "hasCredential": {"@type": "EducationalOccupationalCredential", "credentialCategory": "certificate",
                              "name": "Level 3 personal training qualification"}}

JAY_SECTION = (
    '<section class="seo-section" id="jay"><p class="seo-kicker">MEET JAY</p><h2>Meet Jay Marson</h2>'
    '<p>Jay Marson is a personal trainer with 8 years of experience who works with DB&#x27;s Workouts as a freelance sports masseur. '
    'He is Level 3 qualified and fully insured, and is based in Hackney. '
    'Jay starts by understanding your goals and your needs, so the hour suits you.</p></section>')


PROVIDER = {"@type": "LocalBusiness", "@id": DOMAIN + "/#business", "name": "DB's Workouts", "url": DOMAIN + "/"}


def offers(url, band=None):
    spec = lambda p, t: {"@type": "UnitPriceSpecification", "price": p, "priceCurrency": "GBP", "unitText": t}
    if band == "outside":
        return {"@type": "Offer", "price": "120.00", "priceCurrency": "GBP", "url": url,
                "priceSpecification": spec("120.00", "one-hour session including £20 travel")}
    return {"@type": "Offer", "price": PRICE, "priceCurrency": "GBP", "url": url,
            "priceSpecification": spec(PRICE, "one-hour session")}


def render(slug, title, description, main_html, graph, og_image=PHOTO_1, placename="East London"):
    """Assemble a full page from the online training page's head, nav and footer."""
    base = (ROOT / "online-personal-training.html").read_text()
    head, rest = base.split("</head>", 1)
    url = url_for(slug)
    t = escape(title, quote=True)
    d = escape(description, quote=True)
    head = re.sub(r"<title>.*?</title>", lambda _: f"<title>{t}</title>", head, count=1, flags=re.S)
    head = re.sub(r'(<meta (?:name="(?:description|twitter:description)"|property="og:description") content=")[^"]*', lambda m: m[1] + d, head)
    head = re.sub(r'(<meta (?:name="twitter:title"|property="og:title") content=")[^"]*', lambda m: m[1] + t, head)
    head = head.replace(f"{DOMAIN}/online-personal-training", url)
    head = re.sub(r'(<meta (?:property="og:image"|name="twitter:image") content=")[^"]*', lambda m: m[1] + DOMAIN + og_image[0], head)
    head = re.sub(r'(<meta property="og:image:width" content=")[^"]*', lambda m: m[1] + str(og_image[1]), head)
    head = re.sub(r'(<meta property="og:image:height" content=")[^"]*', lambda m: m[1] + str(og_image[2]), head)
    head = re.sub(r'(<meta name="geo\.placename" content=")[^"]*', lambda m: m[1] + escape(placename, quote=True), head)
    head = re.sub(r'<script type="application/ld\+json">.*?</script>', "", head, flags=re.S)
    head += '<script type="application/ld+json">' + json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False) + "</script>\n"
    body_start = rest.index("<main")
    after = rest[rest.index("</main>") + len("</main>"):]
    after = "\n      " + after[after.index("<footer"):].lstrip()   # drop the video modal block
    page = head + "</head>" + rest[:body_start] + HERO_STYLE + main_html + after
    page = "\n".join(line.rstrip() for line in page.splitlines()) + "\n"
    (ROOT / f"{slug}.html").write_text(page)
    print("Created:", slug)


def webpage_node(slug, title, description):
    url = url_for(slug)
    return {"@type": "WebPage", "@id": url + "#webpage", "url": url, "name": title, "description": description,
            "inLanguage": "en-GB", "isPartOf": {"@id": DOMAIN + "/#website"}, "about": {"@id": url + "#service"},
            "dateModified": MODIFIED,
            "speakable": {"@type": "SpeakableSpecification", "cssSelector": [".seo-quick", "h1"]}}


# ------------------------------------------------------------------ hub
JAY_FAQ = ("Who gives the sports massage?", "Jay Marson, a sports masseur and personal trainer based in Hackney. Jay is Level 3 qualified, has 8 years of experience as a personal trainer and is fully insured.")

HUB_FAQS = [
    JAY_FAQ,
    ("How much does mobile sports massage cost?",
     "A one-hour mobile sports massage costs £100. If your home is more than 5 miles from Hackney, travel adds £20, so a one-hour session is £120."),
    ("What is a mobile sports massage?",
     "It is a one-hour sports massage that Jay brings to your home, so you do not travel to a clinic or studio."),
    ("Where does the session take place?",
     "Jay comes to your home. Share your postcode when you message us and we will confirm that we can reach you."),
    ("When is the extra £20 travel charge added?",
     "The charge applies when travel is more than 5 miles from Hackney. It is £20 for a one-hour session, added to the £100 session price."),
    ("How long is a session?", "Each session is one hour."),
    ("Do I need to be an athlete to book?",
     "No. Sports massage suits people who run, lift or play sport, and people who spend long hours at a desk. Tell us about your training or your working day when you book."),
    ("What should I prepare at home?",
     "Choose a quiet room with enough space to lie down comfortably, and tell us about any injuries or areas of concern when you book. Confirm anything else you need to set up when you arrange the session."),
    ("Can I book more than one session?",
     "Yes. Message us with the sessions you would like and we will confirm availability and the total price."),
    ("Is this medical advice or treatment?",
     "No. It is a one-hour sports massage session. If you have an injury or pain that worries you, speak to your GP or a physiotherapist and tell us about it when you book."),
    ("How do I book?",
     "Send us your postcode and preferred times through the contact page or WhatsApp. He will confirm availability and any travel charge before the session."),
]


def build_hub():
    slug = HUB_SLUG
    title = "Mobile Sports Massage East London | £100 | DB's Workouts"
    description = ("Mobile sports massage in East London with Jay: a one-hour session at your home for £100. "
                   "Travel beyond 5 miles adds £20. Message us to book.")
    url = url_for(slug)
    facts = ('<table class="massage-facts"><caption class="visually-hidden" style="position:absolute;left:-9999px">Mobile sports massage at a glance</caption><tbody>'
             '<tr><th scope="row">Service</th><td>Mobile sports massage with Jay</td></tr>'
             '<tr><th scope="row">Length</th><td>One hour</td></tr>'
             '<tr><th scope="row">Price</th><td>£100 per session</td></tr>'
             '<tr><th scope="row">Travel charge</th><td>£20 extra if more than 5 miles from Hackney (£120 total)</td></tr>'
             '<tr><th scope="row">Location</th><td>At your home across East London</td></tr>'
             '<tr><th scope="row">How to book</th><td>Message us through the contact page or WhatsApp (07752 300937)</td></tr>'
             '</tbody></table>')
    main = f'''<main id="main-content" class="seo-page">
{hero("MOBILE SPORTS MASSAGE · EAST LONDON", "Mobile Sports Massage in East London", "A one-hour sports massage with Jay, at your home. £100 a session, with no studio and no travel for you.", "Jay comes to you · One-hour sessions · Message us to book", PHOTO_1, "A sports masseur giving a sports massage to a client's back", "A one-hour massage, at your home.")}
{trust_bar([("£100 a session", "One-hour mobile massage"), ("At your home", "Jay travels to you"), ("Within 5 miles", "Further adds £20 travel"), ("Fully insured", "Level 3 qualified trainer")])}
<div class="seo-wrap seo-content" id="overview"><aside class="seo-quick"><h2>Quick answer</h2><p>Mobile sports massage with DB&#x27;s Workouts is a one-hour massage session with Jay at your home in East London. It costs £100. If your home is more than 5 miles from Hackney, travel adds £20 for a one-hour session.</p></aside>
<section class="seo-section"><h2>Mobile sports massage at a glance</h2>{facts}</section>
<section class="seo-section seo-session"><div><h2>Sports massage, without leaving home</h2><p>Jay brings the session to you, so you can book a massage without travelling to a studio or fitting a trip around your day. Each session lasts one hour and is built around what you tell us about your training, your work and any areas you want focused on.</p><p>Sports massage is commonly used by people who train regularly, play sport or spend long hours at a desk. Tell us how you move and where you feel tight when you book.</p></div><div><ol class="seo-steps"><li><span>01</span><div><h3>Message us</h3><p>Send your postcode and preferred times.</p></div></li><li><span>02</span><div><h3>Confirm the details</h3><p>We confirm availability and any travel charge.</p></div></li><li><span>03</span><div><h3>Your one-hour session</h3><p>Jay comes to your home for a 60-minute massage.</p></div></li></ol></div></section>
<section class="seo-proof seo-section" style="grid-template-columns:minmax(0,1fr) minmax(220px,340px)"><div><p class="seo-kicker">YOUR SPORTS MASSEUR</p><h2>Jay.<br>One hour. At your door.</h2><p>Your massage is with Jay Marson, a sports masseur based in Hackney who works with DB&#x27;s Workouts. Tell us about your goals and any injuries before you book so the hour is spent where it matters to you.</p><a class="seo-text-link" href="#jay">Read Jay&#x27;s profile <span aria-hidden="true">↓</span></a></div><img src="{PHOTO_2[0]}" alt="A sports masseur giving a back massage during a mobile sports massage session" width="{PHOTO_2[1]}" height="{PHOTO_2[2]}" loading="lazy" decoding="async" style="max-height:440px;margin-inline:auto"></section>
{JAY_SECTION}
<section class="seo-section"><h2>Clear pricing</h2><p>A one-hour mobile sports massage costs £100. There is one extra charge: if your home is more than 5 miles from Hackney, travel adds £20, so a one-hour session is £120. We confirm the total with you before you book.</p><ul><li><b>£100</b> for a one-hour session within 5 miles of Hackney</li><li><b>£120</b> for a one-hour session more than 5 miles away (£100 plus £20 travel)</li></ul><p><a class="seo-text-link" href="/sports-massage-cost-east-london">See the full price guide <span aria-hidden="true">↗</span></a></p></section>
{hub_links_section()}
<section class="seo-section seo-faq-section"><div class="seo-faq"><h2>Your questions answered</h2>{faq_html(HUB_FAQS)}</div></section>
<section class="seo-section"><h2>More from DB&#x27;s Workouts</h2><p>DB&#x27;s Workouts also offers personal training in East London parks and home gardens, online coaching and pair sessions:</p><div class="areas-grid">{pills([("mobile-personal-trainer-east-london", "Mobile Personal Training"), ("online-personal-training", "Online Personal Training"), ("pair-personal-training-east-london", "Pair Personal Training"), ("boxing-fitness-east-london", "Boxing Fitness"), ("pricing", "Pricing")])}</div>{updated_line()}</section>
{final_section("BOOK YOUR SESSION", "Ready for a massage at home?<br>Message us.", "Send your postcode and the times that suit you. We will confirm availability and the total price.", "£100 per hour · Travel beyond 5 miles adds £20 · At your home")}</div></main>'''
    webpage = webpage_node(slug, title, description)
    service = {"@type": "Service", "@id": url + "#service", "name": "Mobile Sports Massage",
               "serviceType": "Mobile sports massage", "description": description, "url": url,
               "areaServed": [{"@type": "GeoCircle", "geoMidpoint": {"@type": "GeoCoordinates", "latitude": BASE_LAT, "longitude": BASE_LON},
                               "geoRadius": FIVE_MILES_M}] + [{"@type": "Place", "name": a["name"]} for a in AREAS],
               "provider": PROVIDER, "performer": {"@id": DOMAIN + "/#jay"},
               "availableChannel": {"@type": "ServiceChannel", "serviceType": "At the customer's home"},
               "hasOfferCatalog": {"@type": "OfferCatalog", "name": "Mobile sports massage prices", "itemListElement": [
                   {"@type": "Offer", "name": "One-hour mobile sports massage", "price": "100.00", "priceCurrency": "GBP", "url": url},
                   {"@type": "Offer", "name": "One-hour mobile sports massage with travel beyond 5 miles", "price": "120.00", "priceCurrency": "GBP", "url": url}]},
               "offers": offers(url), "image": DOMAIN + PHOTO_1[0]}
    howto = {"@type": "HowTo", "name": "How to book a mobile sports massage with Jay", "totalTime": "PT1H",
             "estimatedCost": {"@type": "MonetaryAmount", "currency": "GBP", "value": "100"},
             "step": [{"@type": "HowToStep", "position": 1, "name": "Message us", "text": "Send your postcode and preferred times through the contact page or WhatsApp."},
                      {"@type": "HowToStep", "position": 2, "name": "Confirm the details", "text": "We confirm availability and any £20 travel charge for addresses more than 5 miles from Hackney."},
                      {"@type": "HowToStep", "position": 3, "name": "Have your one-hour session", "text": "Jay comes to your home for a one-hour sports massage."}]}
    image = {"@type": "ImageObject", "@id": url + "#image", "contentUrl": DOMAIN + PHOTO_1[0], "url": DOMAIN + PHOTO_1[0],
             "caption": "A sports masseur giving a sports massage to a client's back", "width": PHOTO_1[1], "height": PHOTO_1[2]}
    render(slug, title, description, main, [webpage, service, howto, image, JAY_NODE, breadcrumb("Mobile Sports Massage", url), faq_schema(HUB_FAQS)])


# ---------------------------------------------------------------- areas
def build_area(a):
    slug = area_page_slug(a)
    n = a["name"]
    url = url_for(slug)
    title = f"Mobile Sports Massage {n} | {'£120' if a['band'] == 'outside' else '£100'} | DB's Workouts"
    price = "£120 including travel" if a["band"] == "outside" else "£100"
    description = (f"Mobile sports massage in {n} ({a['postcodes']}): a one-hour session at your home with Jay "
                   f"for {price}. {travel_short(a) if a['band'] != 'outside' else ''}").strip()
    faqs = [
        (f"Who gives the sports massage in {n}?", JAY_FAQ[1]),
        (f"How much is a mobile sports massage in {n}?",
         "A one-hour session costs £100 at your home." + (" " + travel_text(a) if a["band"] != "inside" else " There is no travel charge within 5 miles of Hackney.")),
        (f"Does Jay come to my home in {n}?",
         f"Yes. Jay travels to homes in {n} ({a['postcodes']}). Send your postcode and we will confirm availability."),
        (f"Is there a travel charge in {n}?", travel_text(a)),
        ("How do I book?", "Send us your postcode and preferred times through the contact page or WhatsApp. We confirm availability and the total price before the session."),
    ]
    near = [AREA_BY_SLUG[s] for s in a["near"]]
    near_pills = pills([(area_page_slug(x), x["name"]) for x in near])
    guides = pills([(g["slug"], g["name"]) for g in GUIDES])
    quick = (f"Mobile sports massage in {n} with Jay is a one-hour session at your home, for "
             f"{'£120 including travel' if a['band'] == 'outside' else '£100'}. {travel_text(a)}")
    main = f'''<main id="main-content" class="seo-page">
{hero(f"MOBILE SPORTS MASSAGE · {n.upper()}", f"Mobile Sports Massage in {n}", f"A one-hour sports massage at your home in {n}, with Jay. {travel_lead(a)[0].upper() + travel_lead(a)[1:]}.", f"Jay comes to you in {a['postcodes']} · One-hour sessions · Message us to book", PHOTO_1, f"A sports masseur giving a sports massage at a client's home in {n}", f"A one-hour massage, at your home in {n}.")}
{trust_bar([("One hour", "At your home"), ("£100 a session" if a["band"] != "outside" else "£120 a session", {"inside": "No travel charge within 5 miles", "border": "£20 travel beyond 5 miles", "outside": "Including £20 travel"}[a["band"]]), (a["postcodes"], f"Covering {n}"), ("Fully insured", "Level 3 qualified trainer")])}
<div class="seo-wrap seo-content" id="overview"><aside class="seo-quick"><h2>Quick answer</h2><p>{escape(quick)}</p></aside>
<section class="seo-section"><h2>Sports massage at home in {escape(n)}</h2><p>Jay comes to your home in {escape(n)} ({escape(a['postcodes'])}) for a one-hour sports massage. You do not need to travel to a clinic or studio, or fit a journey around your day. Tell us about your training, your work and any areas you want focused on when you book. <a href="/{HUB_SLUG}#jay">Meet Jay Marson</a>, a Level 3 qualified personal trainer and fully insured sports masseur.</p><p>DB&#x27;s Workouts is run by Dean Burt, a REPs Level 3 certified personal trainer. <a href="/{a['pt']}">See personal training in {escape(n)}</a>.</p></section>
<section class="seo-section"><h2>Price in {escape(n)}</h2><p>{escape(travel_text(a))}</p><ul><li><b>£100</b> for a one-hour session within 5 miles of Hackney</li><li><b>£120</b> for a one-hour session more than 5 miles away (£100 plus £20 travel)</li></ul></section>
<section class="seo-section"><h2>Who books mobile sports massage in {escape(n)}?</h2><p>Runners, gym-goers, people who play sport and people who spend long hours at a desk all book sessions. Read more about what suits you:</p><div class="areas-grid">{guides}</div></section>
<section class="seo-section"><h2>Mobile sports massage near {escape(n)}</h2><p>We also cover these nearby areas:</p><div class="areas-grid">{near_pills}<a class="area-pill" href="/{HUB_SLUG}">All areas</a></div></section>
<section class="seo-section seo-faq-section"><div class="seo-faq"><h2>Questions about mobile sports massage in {escape(n)}</h2>{faq_html(faqs)}</div>{updated_line()}</section>
{final_section("BOOK YOUR SESSION", f"Ready for a massage at home in {escape(n)}?<br>Message us.", "Send your postcode and the times that suit you. We will confirm availability and the total price.", f"{travel_short(a)} · At your home")}</div></main>'''
    service = {"@type": "Service", "@id": url + "#service", "name": f"Mobile Sports Massage in {n}",
               "serviceType": "Mobile sports massage", "description": description, "url": url,
               "areaServed": {"@type": "Place", "name": f"{n}, East London"}, "provider": PROVIDER, "performer": {"@id": DOMAIN + "/#jay"},
               "availableChannel": {"@type": "ServiceChannel", "serviceType": "At the customer's home"},
               "offers": offers(url, a["band"])}
    render(slug, title, description, main,
           [webpage_node(slug, title, description), service, JAY_NODE, breadcrumb(f"Mobile Sports Massage in {n}", url, parent=True), faq_schema(faqs)],
           placename=f"{n}, East London")


# --------------------------------------------------------------- guides
def build_guide(g):
    g = dict(g, faqs=g["faqs"] + [JAY_FAQ])
    slug = g["slug"]
    url = url_for(slug)
    photo = PHOTO_1 if g["photo"] == 1 else PHOTO_2
    sections = "\n".join(f"<section class=\"seo-section\"><h2>{escape(h)}</h2><p>{escape(p)}</p></section>" for h, p in g["sections"])
    guides = pills([(x["slug"], x["name"]) for x in GUIDES if x["slug"] != slug])
    areas = pills([(area_page_slug(a), a["name"]) for a in AREAS])
    main = f'''<main id="main-content" class="seo-page">
{hero("MOBILE SPORTS MASSAGE · EAST LONDON", g["h1"], g["lead"], "Jay comes to you · One-hour sessions · Message us to book", photo, "A sports masseur giving a mobile sports massage to a client", "A one-hour massage, at your home.")}
{trust_bar([("£100 a session", "One-hour mobile massage"), ("At your home", "Jay travels to you"), ("Within 5 miles", "Further adds £20 travel"), ("Fully insured", "Level 3 qualified trainer")])}
<div class="seo-wrap seo-content" id="overview"><aside class="seo-quick"><h2>Quick answer</h2><p>{escape(g["quick"])}</p></aside>
{sections}
<section class="seo-section"><h2>Where we travel</h2><p>Mobile sessions cover East London. Choose your area for the price and nearby areas:</p><div class="areas-grid">{areas}</div></section>
<section class="seo-section"><h2>More guides</h2><div class="areas-grid"><a class="area-pill" href="/{HUB_SLUG}">Mobile Sports Massage</a>
{guides}</div></section>
<section class="seo-section seo-faq-section"><div class="seo-faq"><h2>Your questions answered</h2>{faq_html(g["faqs"])}</div>{updated_line()}</section>
{final_section("BOOK YOUR SESSION", "Ready to book?<br>Message us.", "Send your postcode and the times that suit you. We will confirm availability and the total price.", "£100 per hour · Travel beyond 5 miles adds £20 · At your home")}</div></main>'''
    service = {"@type": "Service", "@id": url + "#service", "name": g["name"], "serviceType": "Mobile sports massage",
               "description": g["description"], "url": url, "areaServed": {"@type": "Place", "name": "East London"},
               "provider": PROVIDER, "performer": {"@id": DOMAIN + "/#jay"}, "availableChannel": {"@type": "ServiceChannel", "serviceType": "At the customer's home"},
               "offers": offers(url)}
    render(slug, g["title"], g["description"], main,
           [webpage_node(slug, g["title"], g["description"]), service, JAY_NODE, breadcrumb(g["name"], url, parent=True), faq_schema(g["faqs"])],
           og_image=photo)


# --------------------------------------------------- site-wide wiring
def all_slugs():
    return [HUB_SLUG] + [area_page_slug(a) for a in AREAS] + [g["slug"] for g in GUIDES]


def update_sitemap():
    p = ROOT / "sitemap.xml"
    s = p.read_text()
    for slug in all_slugs():
        loc = f"<loc>{url_for(slug)}</loc>"
        entry = f"  <url>{loc}<lastmod>{MODIFIED}</lastmod></url>\n"
        if loc in s:
            s = re.sub(rf"  <url>{re.escape(loc)}.*?</url>\n", lambda _: entry, s, count=1)
        else:
            s = s.replace("</urlset>", entry + "</urlset>")
    p.write_text(s)


def update_llms():
    hub_line = (f"- [Mobile Sports Massage]({url_for(HUB_SLUG)}): Mobile sports massage in East London with Jay: "
                "a one-hour session at your home for £100. Travel beyond 5 miles from Hackney adds £20.\n")
    block = "\n## Mobile sports massage\n" + hub_line
    for g in GUIDES:
        block += f"- [{g['name']}]({url_for(g['slug'])}): {g['description']}\n"
    for a in AREAS:
        block += f"- [Mobile Sports Massage {a['name']}]({url_for(area_page_slug(a))}): {a['name']} ({a['postcodes']}): one-hour session at your home. {travel_short(a)}\n"
    for name in ("llms.txt", "llms-full.txt"):
        p = ROOT / name
        s = p.read_text()
        s = re.sub(r"- \[Mobile Sports Massage\]\([^)]*\)[^\n]*\n", "", s)            # drop the earlier single line
        s = re.sub(r"\n## Mobile sports massage\n.*?(?=\n## |\Z)", "", s, flags=re.S)  # drop an earlier block
        p.write_text(s.rstrip("\n") + "\n" + block)


def update_pricing():
    p = ROOT / "pricing.html"
    s = p.read_text()
    if 'id="massage-pricing"' in s:
        return
    marker = 'aria-labelledby="pair-pricing"'
    i = s.index(marker)
    end = s.index("</section>", i) + len("</section>")
    section = ('\n<section class="pricing-section" aria-labelledby="massage-pricing"><div class="db-container">'
               '<h2 id="massage-pricing">Mobile sports massage</h2>'
               '<p style="margin-top:16px;max-width:760px">A one-hour sports massage at your home costs <strong>£100</strong>. '
               'If your home is more than 5 miles from Hackney, travel adds £20, so a one-hour session is £120.</p>'
               '<a href="/mobile-sports-massage-east-london" class="db-btn db-btn-primary" style="margin-top:20px">Explore mobile sports massage</a>'
               '</div></section>')
    p.write_text(s[:end] + section + s[end:])


def main():
    build_hub()
    for a in AREAS:
        build_area(a)
    for g in GUIDES:
        build_guide(g)
    update_sitemap()
    update_llms()
    update_pricing()
    print(f"Done: {len(all_slugs())} pages")


if __name__ == "__main__":
    main()
