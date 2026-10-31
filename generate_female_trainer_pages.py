"""Build the female personal trainer pages (hub, area pages and guides) for Jasmin.

Run from the site root: python3 generate_female_trainer_pages.py

Pages reuse the head, navigation and footer of online-personal-training.html (via
generate_massage_page.render) and swap in their own copy, photos and schema. The
script also keeps sitemap.xml, llms.txt, llms-full.txt and pricing.html in step.

Facts used about Jasmin (from Dean): she is a female personal trainer at DB's
Workouts, offers boxing fitness padwork one to one, can train clients in a gym as
well as outdoors, and her own bio (variety of training methods, experience with a
variety of clients). Dean also confirmed she is Level 3 qualified and fully
insured. Her surname and price are NOT known, so no page states them.
"""
from html import escape
from pathlib import Path
import re

import generate_massage_page as gm

ROOT = gm.ROOT
DOMAIN = gm.DOMAIN
HUB_SLUG = "female-personal-trainer-east-london"
MODIFIED = "2026-10-31"
MODIFIED_TEXT = "31 October 2026"
PHOTO_1 = ("/pics/optimized/jasmin-boxing-1.webp", 900, 932)
PHOTO_2 = ("/pics/optimized/jasmin-boxing-2.webp", 868, 1100)
AREAS = gm.AREAS
AREA_BY_SLUG = gm.AREA_BY_SLUG
PROVIDER = gm.PROVIDER

STYLE = '''<style>
.seo-proof-photo{grid-template-columns:minmax(0,1fr) minmax(220px,340px)}
@media(max-width:700px){.seo-proof-photo{grid-template-columns:minmax(0,1fr);gap:24px}.seo-proof-photo>img{max-height:380px!important}}
.trainer-hero-photo{height:auto!important;overflow:visible!important;max-width:400px;width:100%;margin-inline:auto;background:none}
.trainer-hero-photo img{height:auto;aspect-ratio:868/1100;object-fit:cover;border-radius:var(--r) var(--r) 64px var(--r)}
.trainer-hero-photo:after{display:none}
.trainer-hero-photo figcaption{position:static;margin-top:16px}
.trainer-facts{width:100%;border-collapse:collapse;margin-top:18px;max-width:62ch}
.trainer-facts th,.trainer-facts td{text-align:left;padding:12px 0;border-top:1px solid var(--border-h);font-size:14px;line-height:1.5;vertical-align:top}
.trainer-facts th{width:36%;color:var(--text-dim);font-weight:600;padding-right:16px}
.trainer-facts tr:last-child th,.trainer-facts tr:last-child td{border-bottom:1px solid var(--border-h)}
.trainer-updated{font-size:12px;color:var(--text-dim);margin-top:24px}
</style>
'''
gm.HERO_STYLE = STYLE     # gm.render() injects this block into every page

DISCLAIMER = ("This page is general information, not medical advice. If you have an injury, a health condition or pain that "
              "worries you, speak to your GP or a physiotherapist before you start training, and tell us when you book.")

JASMIN_BIO = [
    "Fitness plays an essential role in my life and equally I believe it should play a key role in everybody else's life too.",
    "Being committed to my role, I'm dedicated towards helping others reaching desired outcomes.",
    "Specialising in a variety of training methods and holding experience in working with a variety of clients, "
    "I have full confidence in being able to support anyone throughout their life.",
]

JASMIN_NODE = {
    "@type": "Person", "@id": DOMAIN + "/#jasmin", "name": "Jasmin", "givenName": "Jasmin", "gender": "Female",
    "jobTitle": "Personal trainer",
    "description": "Level 3 qualified, fully insured female personal trainer at DB's Workouts offering one-to-one boxing fitness and personal training in a gym "
                   "or outdoors across East London. Specialises in a variety of training methods and has experience working "
                   "with a variety of clients.",
    "knowsAbout": ["Personal training", "Boxing fitness", "Gym training"],
    "hasCredential": {"@type": "EducationalOccupationalCredential", "name": "Level 3 personal trainer qualification",
                      "credentialCategory": "Qualification"},
    "worksFor": {"@id": DOMAIN + "/#business"},
    "workLocation": {"@type": "Place", "name": "East London"},
    "image": DOMAIN + PHOTO_2[0],
}

JASMIN_FAQ = ("Does DB's Workouts have a female personal trainer?",
              "Yes. Jasmin is a Level 3 qualified, fully insured female personal trainer at DB's Workouts. She offers one-to-one boxing fitness and personal "
              "training, and can train you in a gym as well as outdoors across East London. Message us to ask for Jasmin.")

JASMIN_SECTION = (
    '<section class="seo-section" id="jasmin"><p class="seo-kicker">MEET JASMIN</p><h2>Meet Jasmin</h2>'
    + "".join(f"<p>{escape(p)}</p>" for p in JASMIN_BIO)
    + '<p>Jasmin is a Level 3 qualified, fully insured personal trainer at DB&#x27;s Workouts. She can train you in a gym as well as outdoors, '
      'and offers one-to-one boxing fitness. <a href="/boxing-fitness-east-london#jasmin">See Jasmin on the boxing fitness page</a>.</p></section>')


# ---------------------------------------------------------------- helpers
def area_slug(a):
    return f"female-personal-trainer-{a['slug']}"


def url_for(slug):
    return gm.url_for(slug)


def hero(kicker, h1, lead, note, photo, alt, caption):
    src, w, h = photo
    return (f'<section class="seo-hero"><div class="seo-wrap seo-hero-grid">\n'
            f'<div><p class="seo-kicker">{kicker}</p><h1>{escape(h1)}</h1>\n<p class="seo-lead">{escape(lead)}</p>\n'
            f'<div class="seo-actions"><a class="db-btn db-btn-primary" href="/contact">Book a session <span aria-hidden="true">↗</span></a>'
            f'<a class="seo-text-link" href="#overview">Read more <span aria-hidden="true">↓</span></a></div>\n'
            f'<p class="seo-note">{note}</p></div>\n'
            f'<figure class="seo-hero-photo trainer-hero-photo"><img src="{src}" alt="{escape(alt)}" width="{w}" height="{h}" '
            f'fetchpriority="high" decoding="async"><figcaption><span>DB&#x27;S WORKOUTS · FEMALE PERSONAL TRAINER</span>'
            f'<strong>{escape(caption)}</strong></figcaption></figure>\n</div></section>')


def updated_line():
    return f'<p class="trainer-updated">Last updated {MODIFIED_TEXT}. {escape(DISCLAIMER)}</p>'


def trust():
    return gm.trust_bar([("Level 3 qualified", "Fully insured trainer"), ("Gym or outdoors", "Your choice"),
                         ("One to one", "Built around you"), ("Free consultation", "Message us to start")])


def final(h2, text="Message us and ask for Jasmin. We will confirm availability and the details before your first session."):
    return gm.final_section("BOOK WITH JASMIN", h2, text, "Female personal trainer · Gym or outdoors · East London")


def breadcrumb(name, url, parent=False):
    items = [{"@type": "ListItem", "position": 1, "name": "Home", "item": DOMAIN + "/"}]
    if parent:
        items.append({"@type": "ListItem", "position": 2, "name": "Female Personal Trainer East London", "item": url_for(HUB_SLUG)})
        items.append({"@type": "ListItem", "position": 3, "name": name, "item": url})
    else:
        items.append({"@type": "ListItem", "position": 2, "name": name, "item": url})
    return {"@type": "BreadcrumbList", "itemListElement": items}


def webpage_node(slug, title, description):
    n = gm.webpage_node(slug, title, description)
    n["dateModified"] = MODIFIED
    return n


def service_node(url, name, description, area):
    return {"@type": "Service", "@id": url + "#service", "name": name, "serviceType": "Personal training",
            "description": description, "url": url, "areaServed": area, "provider": PROVIDER,
            "performer": {"@id": DOMAIN + "/#jasmin"},
            "image": DOMAIN + PHOTO_2[0]}


def clean(d):
    return {k: v for k, v in d.items() if v is not None}


def render(slug, title, description, main, graph, og=PHOTO_1, placename="East London"):
    gm.MODIFIED = MODIFIED
    gm.render(slug, title, description, main, graph, og_image=og, placename=placename)


# --------------------------------------------------------------- guides
GUIDES = [
    dict(slug="female-personal-trainer-for-beginners-east-london",
         title="Female Personal Trainer for Beginners East London",
         description="Starting out? Train one to one with Jasmin, a female personal trainer at DB's Workouts in East London. Gym or outdoors. Free consultation.",
         name="Female Personal Trainer for Beginners", h1="Female Personal Trainer for Beginners in East London", photo=1,
         lead="Never trained before, or coming back after a break? Start at your own pace with Jasmin, one to one.",
         quick="A female personal trainer for beginners in East London: Jasmin at DB's Workouts trains you one to one in a gym or outdoors, at a pace that suits you. You do not need experience. Message us to book a free consultation.",
         sections=[
             ("Starting out with a female personal trainer",
              "Walking into a gym or a park session for the first time can feel like a big step. Some people find it easier to start with a woman beside them, and that is a perfectly good reason to ask for Jasmin. Sessions are one to one, so the focus is on you and what you want to achieve, not on keeping up with anyone else."),
             ("You do not need any experience",
              "Jasmin works with a variety of clients, from people trying training for the first time to people who already know their way around. Tell us where you are starting from and what you would like to change, and the sessions are built from there."),
             ("Gym or outdoors",
              "You can choose how you train. Jasmin can train you in a gym, and DB's Workouts also trains clients outdoors across East London. Tell us which you prefer when you message us and we will confirm the options near you."),
             ("Building up at your own pace",
              "A good first few weeks are about learning the movements, getting comfortable and building a routine you can keep. Boxing fitness padwork is one way to start if you would like something different from a standard workout. See the boxing fitness page for more."),
         ],
         faqs=[
             ("Do I need to be fit to start?", "No. Sessions are one to one and built around where you are now. Tell us about your experience and any worries when you message us."),
             ("Can I train in a gym with Jasmin?", "Yes. Jasmin can train you in a gym as well as outdoors. Tell us your preference and area when you book."),
             ("Is the first step a free consultation?", "DB's Workouts offers a free consultation. Message us to arrange one and ask for Jasmin."),
             ("Can I try boxing fitness as a beginner?", "Yes. Boxing fitness padwork suits beginners because it is one to one and you work at your own pace."),
         ]),
    dict(slug="womens-personal-training-east-london",
         title="Women's Personal Training East London | DB's Workouts",
         description="Personal training for women in East London with Jasmin, a female trainer at DB's Workouts. One to one, in a gym or outdoors.",
         name="Women's Personal Training", h1="Women's Personal Training in East London", photo=2,
         lead="One-to-one personal training with a female trainer, built around your goals. Gym or outdoors, across East London.",
         quick="Women's personal training in East London with DB's Workouts means one-to-one sessions with Jasmin, a female personal trainer, in a gym or outdoors. Sessions are built around your goals. Message us to book.",
         sections=[
             ("Personal training for women in East London",
              "If you would like to train with a female personal trainer, Jasmin is the trainer to ask for at DB's Workouts. Every session is one to one, planned around what you want from your training."),
             ("What can you work on?",
              "Jasmin has experience working with a variety of clients and uses a variety of training methods. Tell her what matters to you, whether that is general fitness, confidence, strength or trying boxing fitness, and the sessions are shaped around it."),
             ("Why some women choose a female trainer",
              "Some clients simply feel more at ease training with a woman, particularly when they are new to training or returning after a break. There is no wrong reason to ask. You can request Jasmin when you message us."),
             ("Gym or outdoors",
              "Jasmin can train you in a gym, and DB's Workouts also trains outdoors across East London. We confirm the options near you when you book."),
         ],
         faqs=[
             ("Is Jasmin the only female trainer at DB's Workouts?", "Jasmin is the female personal trainer you can ask for at DB's Workouts. Dean Burt, who runs DB's Workouts, is also a personal trainer."),
             ("Are sessions one to one?", "Yes. Sessions with Jasmin are one to one."),
             ("Where can I train?", "In a gym or outdoors across East London. Message us your area and preference and we will confirm."),
             ("How do I ask for a female trainer?", "Message us through the contact page or WhatsApp and say you would like to train with Jasmin."),
         ]),
    dict(slug="boxing-fitness-with-a-female-trainer-east-london",
         title="Boxing Fitness with a Female Trainer East London",
         description="Try one-to-one boxing fitness padwork with Jasmin, a female trainer at DB's Workouts in East London. Gym or outdoors. No experience needed.",
         name="Boxing Fitness with a Female Trainer", h1="Boxing Fitness with a Female Trainer in East London", photo=1,
         lead="Padwork, one to one, with Jasmin. A workout that meets you where you are, in a gym or outdoors.",
         quick="Boxing fitness with a female trainer in East London: Jasmin at DB's Workouts offers one-to-one boxing padwork in a gym or outdoors. You do not need any boxing experience. Message us to book a free consultation.",
         sections=[
             ("One-to-one boxing fitness",
              "Boxing fitness is padwork and conditioning rather than fighting. You wear gloves, your trainer holds the pads, and you work through combinations at your own pace. Jasmin trains you one to one, so each session is built around you."),
             ("No boxing experience needed",
              "Many people try boxing fitness for the first time with a personal trainer. Jasmin will show you the basics and build from there. Tell us about your fitness and any injuries when you book."),
             ("In a gym or outdoors",
              "Jasmin can run your boxing fitness session in a gym, and DB's Workouts also offers boxing fitness outdoors. Read about the outdoor sessions on the boxing fitness page."),
             ("Ask for Jasmin",
              "When you message us, say you would like to train with Jasmin. We confirm availability and the details before your first session. Learn more about boxing fitness at DB's Workouts on our boxing fitness page."),
         ],
         faqs=[
             ("Do I need boxing experience?", "No. Boxing fitness padwork suits beginners and experienced clients alike."),
             ("Is it a fighting class?", "No. It is a fitness session using gloves and focus pads, one to one with your trainer."),
             ("Can I do boxing fitness in a gym?", "Yes. Jasmin can train you in a gym as well as outdoors."),
             ("How do I start?", "Message us, ask for Jasmin and we will arrange your free consultation."),
         ]),
    dict(slug="female-personal-trainer-gym-east-london",
         title="Female Personal Trainer for Gym Sessions East London",
         description="Train in a gym with Jasmin, a female personal trainer at DB's Workouts. One-to-one gym sessions and boxing fitness across East London.",
         name="Female Personal Trainer for Gym Sessions", h1="Female Personal Trainer for Gym Sessions in East London", photo=2,
         lead="Prefer to train indoors? Jasmin can train you one to one in a gym as well as outdoors.",
         quick="A female personal trainer for gym sessions in East London: Jasmin at DB's Workouts can train you one to one in a gym, and also outdoors. Tell us your area and message us to arrange a free consultation.",
         sections=[
             ("Gym sessions with a female personal trainer",
              "If you would rather train indoors, Jasmin can train you in a gym. Sessions are one to one, so you have a trainer's attention for the whole session instead of working it out on your own."),
             ("Gym and outdoor training",
              "DB's Workouts is known for outdoor training in East London parks, and Jasmin can train you outdoors too. Some clients mix the two, depending on the weather and their routine."),
             ("Boxing fitness in the gym",
              "Padwork is one of the sessions Jasmin offers, and it works well in a gym. Ask about boxing fitness if you would like variety in your training."),
             ("Choosing a gym",
              "Tell us your area and which gyms you already use or would like to use when you message us, and we will confirm what is possible before you book."),
         ],
         faqs=[
             ("Can Jasmin train me in a gym?", "Yes. Jasmin can train you in a gym as well as outdoors."),
             ("Do I need a gym membership?", "Tell us your situation when you message us and we will confirm the details before your first session."),
             ("Are gym sessions one to one?", "Yes."),
             ("Can I switch between gym and outdoor sessions?", "Ask us when you book. DB's Workouts offers both gym sessions with Jasmin and outdoor training."),
         ]),
    dict(slug="first-session-with-a-female-personal-trainer-east-london",
         title="First Session with a Female Personal Trainer | East London",
         description="What to expect from your first session with Jasmin, a female personal trainer at DB's Workouts in East London. Free consultation first.",
         name="First Session with a Female Personal Trainer", h1="What to Expect From Your First Session With a Female Personal Trainer", photo=1,
         lead="Nervous about a first session? Here is what to expect when you train one to one with Jasmin.",
         quick="Your first session with a female personal trainer at DB's Workouts starts with a free consultation. You tell Jasmin your goals and any injuries, then train one to one in a gym or outdoors at a pace that suits you.",
         sections=[
             ("Start with a free consultation",
              "DB's Workouts begins with a free consultation. You talk through your goals, your experience and anything you are worried about, and ask for Jasmin if you would like to train with a female trainer."),
             ("Tell us about injuries and health",
              "Mention any injuries, health conditions or areas of concern before you start. If something worries you, speak to your GP or a physiotherapist first."),
             ("Your first session",
              "Sessions are one to one. Expect to be asked about how you feel as you go, and to work at a pace that suits you. If you try boxing fitness, you will learn the basics of padwork first."),
             ("Gym or outdoors, and what next",
              "Jasmin can train you in a gym as well as outdoors. After the first session you can talk through how it felt and what you want to do next."),
         ],
         faqs=[
             ("What should I wear?", "Comfortable clothes and trainers you can move in. Confirm anything else with us when you book."),
             ("How long is the first session?", "Message us and we will confirm the session length and details when you book."),
             ("What if I have never trained before?", "That is fine. Jasmin works with a variety of clients and builds sessions around where you are starting."),
             ("Can I ask for a female trainer?", "Yes. Message us and ask to train with Jasmin."),
         ]),
]


# ------------------------------------------------------------------ hub
HUB_FAQS = [
    JASMIN_FAQ,
    ("Is Jasmin qualified and insured?", "Yes. Jasmin is a Level 3 qualified personal trainer and is fully insured."),
    ("Who is Jasmin?", "Jasmin is a Level 3 qualified, fully insured personal trainer at DB's Workouts. She specialises in a variety of training methods, has experience working with a variety of clients and offers one-to-one boxing fitness."),
    ("Can Jasmin train me in a gym?", "Yes. Jasmin can train you in a gym as well as outdoors. Tell us your area and preference when you message us."),
    ("Are sessions one to one?", "Yes. Sessions with Jasmin are one to one and built around your goals."),
    ("Where does DB's Workouts cover?", "DB's Workouts covers East London, including Stratford, Hackney, Ilford, Walthamstow, Wanstead, Forest Gate and more. Message us your area and we will confirm what is possible."),
    ("Can I try boxing fitness with Jasmin?", "Yes. Jasmin offers boxing fitness padwork. No boxing experience is needed."),
    ("Do I need to be fit to start?", "No. Jasmin works with a variety of clients, including beginners. Tell us where you are starting from."),
    ("How much does it cost?", "We confirm the price and the details when you book. Current DB's Workouts session prices are on the pricing page."),
    ("How do I book a session with Jasmin?", "Message us through the contact page or WhatsApp (07752 300937) and ask for Jasmin. A free consultation comes first."),
    ("Is this medical advice?", "No. It is personal training. If you have an injury, a health condition or pain that worries you, speak to your GP or a physiotherapist and tell us when you book."),
]


def hub_links():
    guides = gm.pills([(g["slug"], g["name"]) for g in GUIDES])
    areas = gm.pills([(area_slug(a), a["name"]) for a in AREAS])
    return (f'<section class="seo-section"><h2>Female personal trainer by area</h2><p>DB&#x27;s Workouts covers East London. '
            f'Choose your area to see how to train with Jasmin and nearby areas:</p><div class="areas-grid">{areas}</div></section>\n'
            f'<section class="seo-section"><h2>Guides to training with a female trainer</h2><p>Read more about starting and what to expect:</p>'
            f'<div class="areas-grid">{guides}</div></section>')


def build_hub():
    slug = HUB_SLUG
    title = "Female Personal Trainer East London | DB's Workouts"
    description = ("Train with Jasmin, a female personal trainer at DB's Workouts in East London. One to one, in a gym or outdoors, "
                   "including boxing fitness. Message us to book.")
    url = url_for(slug)
    facts = ('<table class="trainer-facts"><caption class="visually-hidden" style="position:absolute;left:-9999px">Female personal trainer at a glance</caption><tbody>'
             '<tr><th scope="row">Trainer</th><td>Jasmin, personal trainer at DB&#x27;s Workouts</td></tr>'
             '<tr><th scope="row">Qualification</th><td>Level 3 qualified, fully insured</td></tr>'
             '<tr><th scope="row">Training</th><td>One-to-one personal training and boxing fitness</td></tr>'
             '<tr><th scope="row">Where</th><td>In a gym or outdoors across East London</td></tr>'
             '<tr><th scope="row">Price</th><td>Confirmed when you book (see the pricing page)</td></tr>'
             '<tr><th scope="row">First step</th><td>Free consultation</td></tr>'
             '<tr><th scope="row">How to book</th><td>Message us through the contact page or WhatsApp (07752 300937)</td></tr>'
             '</tbody></table>')
    main = f'''<main id="main-content" class="seo-page">
{hero("FEMALE PERSONAL TRAINER · EAST LONDON", "Female Personal Trainer in East London", "Train one to one with Jasmin, a personal trainer at DB's Workouts. In a gym or outdoors, including boxing fitness.", "Gym or outdoors · One-to-one sessions · Free consultation", PHOTO_2, "Boxing padwork session with a female personal trainer at DB's Workouts", "Train with Jasmin.")}
{trust()}
<div class="seo-wrap seo-content" id="overview"><aside class="seo-quick"><h2>Quick answer</h2><p>Yes, DB&#x27;s Workouts has a female personal trainer. Jasmin is Level 3 qualified and fully insured, and trains clients one to one across East London, in a gym or outdoors, and offers boxing fitness. Message us to ask for Jasmin and book a free consultation.</p></aside>
<section class="seo-section"><h2>Female personal trainer at a glance</h2>{facts}</section>
<section class="seo-section seo-session"><div><h2>A female personal trainer in East London</h2><p>Some people prefer to train with a woman, and DB&#x27;s Workouts has a female personal trainer you can ask for. Jasmin works with a variety of clients and uses a variety of training methods, so your sessions are built around your goals and where you are starting from.</p><p>You can train in a gym or outdoors, and try boxing fitness padwork if you would like something different from a standard workout.</p></div><div><ol class="seo-steps"><li><span>01</span><div><h3>Message us</h3><p>Ask for Jasmin and tell us your area.</p></div></li><li><span>02</span><div><h3>Free consultation</h3><p>Talk through your goals and any injuries.</p></div></li><li><span>03</span><div><h3>Start training</h3><p>One-to-one sessions in a gym or outdoors.</p></div></li></ol></div></section>
<section class="seo-proof seo-proof-photo seo-section"><div><p class="seo-kicker">YOUR TRAINER</p><h2>Jasmin.<br>One to one. Your pace.</h2><p>Jasmin is a personal trainer at DB&#x27;s Workouts. She can train you in a gym as well as outdoors, and offers one-to-one boxing fitness. Tell her about your goals and any injuries before you book.</p><a class="seo-text-link" href="#jasmin">Read Jasmin&#x27;s profile <span aria-hidden="true">↓</span></a></div><img src="{PHOTO_1[0]}" alt="One-to-one boxing padwork with a DB&#x27;s Workouts trainer" width="{PHOTO_1[1]}" height="{PHOTO_1[2]}" loading="lazy" decoding="async" style="max-height:440px;margin-inline:auto"></section>
{JASMIN_SECTION}
<section class="seo-section"><h2>Why people choose a female trainer</h2><p>People ask for a female trainer for many reasons. Some are new to training, some are returning after a break, and some simply feel more comfortable. Whatever your reason, you can ask for Jasmin when you message us, and sessions stay one to one.</p></section>
{hub_links()}
<section class="seo-section seo-faq-section"><div class="seo-faq"><h2>Your questions answered</h2>{gm.faq_html(HUB_FAQS)}</div></section>
<section class="seo-section"><h2>More from DB&#x27;s Workouts</h2><p>DB&#x27;s Workouts also offers boxing fitness, training for beginners and weight loss coaching across East London:</p><div class="areas-grid">{gm.pills([("boxing-fitness-east-london", "Boxing Fitness"), ("personal-training-for-beginners-east-london", "Training for Beginners"), ("weight-loss-personal-trainer-east-london", "Weight Loss Coaching"), ("mobile-personal-trainer-east-london", "Mobile Personal Training"), ("pricing", "Pricing"), ("about", "About Dean")])}</div>{updated_line()}</section>
{final("Ready to train with Jasmin?<br>Message us.")}</div></main>'''
    service = clean(service_node(url, "Female Personal Trainer in East London", description,
                                 [{"@type": "Place", "name": a["name"]} for a in AREAS]))
    service["availableChannel"] = [{"@type": "ServiceChannel", "serviceType": "In a gym"}, {"@type": "ServiceChannel", "serviceType": "Outdoors"}]
    howto = {"@type": "HowTo", "name": "How to book a session with Jasmin",
             "step": [{"@type": "HowToStep", "position": 1, "name": "Message us", "text": "Message us through the contact page or WhatsApp and ask for Jasmin."},
                      {"@type": "HowToStep", "position": 2, "name": "Have a free consultation", "text": "Talk through your goals, experience and any injuries."},
                      {"@type": "HowToStep", "position": 3, "name": "Start training", "text": "Train one to one with Jasmin in a gym or outdoors."}]}
    image = {"@type": "ImageObject", "@id": url + "#image", "contentUrl": DOMAIN + PHOTO_2[0], "url": DOMAIN + PHOTO_2[0],
             "caption": "Boxing padwork session with a female personal trainer at DB's Workouts", "width": PHOTO_2[1], "height": PHOTO_2[2]}
    render(slug, title, description, main,
           [webpage_node(slug, title, description), service, howto, image, JASMIN_NODE, breadcrumb("Female Personal Trainer East London", url), gm.faq_schema(HUB_FAQS)],
           og=PHOTO_1)


# ---------------------------------------------------------------- areas
def build_area(a):
    slug = area_slug(a)
    n = a["name"]
    url = url_for(slug)
    title = f"Female Personal Trainer {n} | DB's Workouts"
    description = (f"Train with Jasmin, a female personal trainer at DB's Workouts, in {n} ({a['postcodes']}). One to one, in a gym "
                   "or outdoors, including boxing fitness.")
    faqs = [
        (f"Is there a female personal trainer in {n}?",
         f"DB's Workouts covers {n} ({a['postcodes']}) and has a female personal trainer, Jasmin, who is Level 3 qualified and fully insured. Message us your postcode and ask for Jasmin, and we will confirm her availability."),
        (f"Can Jasmin train me in a gym near {n}?",
         f"Jasmin can train you in a gym as well as outdoors. Tell us you are in {n} and which you prefer, and we will confirm the options."),
        (f"Can I try boxing fitness in {n}?", "Yes. Jasmin offers one-to-one boxing fitness padwork, and no experience is needed."),
        ("Are sessions one to one?", "Yes. Sessions with Jasmin are one to one and built around your goals."),
        ("How do I book?", "Message us through the contact page or WhatsApp and ask for Jasmin. A free consultation comes first."),
    ]
    near_pills = gm.pills([(area_slug(AREA_BY_SLUG[s]), AREA_BY_SLUG[s]["name"]) for s in a["near"]])
    guides = gm.pills([(g["slug"], g["name"]) for g in GUIDES])
    quick = (f"DB's Workouts has a female personal trainer for {n}. Jasmin is Level 3 qualified, fully insured and trains clients one to one in a gym or outdoors, and offers "
             f"boxing fitness. Message us your postcode ({a['postcodes']}) and ask for Jasmin to book a free consultation.")
    main = f'''<main id="main-content" class="seo-page">
{hero(f"FEMALE PERSONAL TRAINER · {n.upper()}", f"Female Personal Trainer in {n}", f"One-to-one personal training and boxing fitness with Jasmin, a personal trainer at DB's Workouts. Covering {n} and {a['postcodes']}.", f"Gym or outdoors · {a['postcodes']} · Free consultation", PHOTO_2, f"Boxing padwork with a female personal trainer for clients in {n}", f"Train with Jasmin in {n}.")}
{trust()}
<div class="seo-wrap seo-content" id="overview"><aside class="seo-quick"><h2>Quick answer</h2><p>{escape(quick)}</p></aside>
<section class="seo-section"><h2>Train with a female personal trainer in {escape(n)}</h2><p>If you live or work in {escape(n)} ({escape(a['postcodes'])}) and would like to train with a woman, you can ask for Jasmin at DB&#x27;s Workouts. She works with a variety of clients and builds one-to-one sessions around your goals. <a href="/{HUB_SLUG}#jasmin">Meet Jasmin</a>.</p><p>Message us your postcode and tell us whether you prefer a gym or outdoors. We confirm Jasmin&#x27;s availability and the details before your first session.</p></section>
<section class="seo-section"><h2>Gym, outdoors or boxing fitness</h2><p>Jasmin can train you in a gym as well as outdoors, and offers one-to-one boxing fitness padwork if you would like something different from a standard workout. <a href="/boxing-fitness-east-london">Read about boxing fitness</a>.</p><p>DB&#x27;s Workouts is run by Dean Burt, a REPs Level 3 certified personal trainer. <a href="/{a['pt']}">See personal training in {escape(n)}</a>.</p></section>
<section class="seo-section"><h2>Guides</h2><p>Read more about training with a female personal trainer:</p><div class="areas-grid">{guides}</div></section>
<section class="seo-section"><h2>Female personal trainer near {escape(n)}</h2><p>We also cover these nearby areas:</p><div class="areas-grid">{near_pills}<a class="area-pill" href="/{HUB_SLUG}">All areas</a></div></section>
<section class="seo-section seo-faq-section"><div class="seo-faq"><h2>Questions about training with a female trainer in {escape(n)}</h2>{gm.faq_html(faqs)}</div>{updated_line()}</section>
{final(f"Ready to train with Jasmin in {escape(n)}?<br>Message us.", f"Send your postcode and ask for Jasmin. We will confirm availability and the details before your first session.")}</div></main>'''
    service = clean(service_node(url, f"Female Personal Trainer in {n}", description, {"@type": "Place", "name": f"{n}, East London"}))
    render(slug, title, description, main,
           [webpage_node(slug, title, description), service, JASMIN_NODE, breadcrumb(f"Female Personal Trainer in {n}", url, parent=True), gm.faq_schema(faqs)],
           og=PHOTO_1, placename=f"{n}, East London")


# --------------------------------------------------------------- guides
def build_guide(g):
    g = dict(g, faqs=g["faqs"] + [JASMIN_FAQ])
    slug = g["slug"]
    url = url_for(slug)
    photo = PHOTO_1 if g["photo"] == 1 else PHOTO_2
    sections = "\n".join(f"<section class=\"seo-section\"><h2>{escape(h)}</h2><p>{escape(p)}</p></section>" for h, p in g["sections"])
    guides = gm.pills([(x["slug"], x["name"]) for x in GUIDES if x["slug"] != slug])
    areas = gm.pills([(area_slug(a), a["name"]) for a in AREAS])
    main = f'''<main id="main-content" class="seo-page">
{hero("FEMALE PERSONAL TRAINER · EAST LONDON", g["h1"], g["lead"], "Gym or outdoors · One-to-one sessions · Free consultation", PHOTO_2, "Boxing padwork session with a female personal trainer at DB's Workouts", "Train with Jasmin.")}
{trust()}
<div class="seo-wrap seo-content" id="overview"><aside class="seo-quick"><h2>Quick answer</h2><p>{escape(g["quick"])}</p></aside>
{sections}
<section class="seo-section"><h2>Where Jasmin can train you</h2><p>DB&#x27;s Workouts covers East London. Choose your area for more:</p><div class="areas-grid">{areas}</div></section>
<section class="seo-section"><h2>More guides</h2><div class="areas-grid"><a class="area-pill" href="/{HUB_SLUG}">Female Personal Trainer East London</a>
{guides}</div></section>
<section class="seo-section seo-faq-section"><div class="seo-faq"><h2>Your questions answered</h2>{gm.faq_html(g["faqs"])}</div>{updated_line()}</section>
{final("Ready to book?<br>Message us.")}</div></main>'''
    service = clean(service_node(url, g["name"], g["description"], {"@type": "Place", "name": "East London"}))
    render(slug, g["title"], g["description"], main,
           [webpage_node(slug, g["title"], g["description"]), service, JASMIN_NODE, breadcrumb(g["name"], url, parent=True), gm.faq_schema(g["faqs"])],
           og=photo)


# --------------------------------------------------- site-wide wiring
def all_slugs():
    return [HUB_SLUG] + [area_slug(a) for a in AREAS] + [g["slug"] for g in GUIDES]


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
    block = ("\n## Female personal trainer\n"
             f"- [Female Personal Trainer East London]({url_for(HUB_SLUG)}): DB's Workouts has a female personal trainer, Jasmin, who is Level 3 qualified and fully insured and trains clients one to one in a gym or outdoors across East London.\n")
    for g in GUIDES:
        block += f"- [{g['name']}]({url_for(g['slug'])}): {g['description']}\n"
    for a in AREAS:
        block += f"- [Female Personal Trainer {a['name']}]({url_for(area_slug(a))}): Train with Jasmin in {a['name']} ({a['postcodes']}), one to one, in a gym or outdoors.\n"
    for name in ("llms.txt", "llms-full.txt"):
        p = ROOT / name
        s = p.read_text()
        s = re.sub(r"\n## Female personal trainer\n.*?(?=\n## |\Z)", "", s, flags=re.S)
        p.write_text(s.rstrip("\n") + "\n" + block)


def update_pricing():
    p = ROOT / "pricing.html"
    s = p.read_text()
    if 'id="female-trainer-pricing"' in s:
        return
    marker = 'aria-labelledby="massage-pricing"'
    i = s.index(marker)
    end = s.index("</section>", i) + len("</section>")
    section = ('\n<section class="pricing-section" aria-labelledby="female-trainer-pricing"><div class="db-container">'
               '<h2 id="female-trainer-pricing">Train with Jasmin</h2>'
               '<p style="margin-top:16px;max-width:760px">DB&#x27;s Workouts has a female personal trainer, Jasmin, who is Level 3 qualified and fully insured and trains clients one to one in a gym '
               'or outdoors and offers boxing fitness. Message us to ask for Jasmin and we will confirm the price and the details before you book.</p>'
               '<a href="/female-personal-trainer-east-london" class="db-btn db-btn-primary" style="margin-top:20px">Meet our female personal trainer</a>'
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
