"""Build service landing pages using the site's existing local-page design.

Run after generate_seo_pages.py. Copy is based on existing services and prices;
the shared navigation, footer and styles come from personal-trainer-ilford.html.
"""
from refresh_seo_design import refresh_html
from pathlib import Path
from html import escape
import json
import re

ROOT = Path(__file__).resolve().parent
DOMAIN = "https://dbworkouts.co.uk"
SERVICES = [
    {
        "slug": "boxing-fitness-east-london",
        "name": "Boxing Fitness",
        "title": "Boxing Fitness East London | 1-to-1 Padwork | DB's Workouts",
        "description": "Boxing fitness in East London with Dean Burt. Outdoor 1-to-1 padwork and conditioning, tailored to your level. £45 per session. Free consultation.",
        "heading": "Boxing Fitness in East London",
        "intro": "Build fitness and confidence with 1-to-1 boxing padwork and conditioning in your local park. A personalised session with Dean, at your pace.",
        "sections": [
            ("Boxing fitness built around you", "Boxing fitness gives your outdoor training a different focus: padwork, movement and conditioning, coached one-to-one. Dean combines boxing pads with cardio and strength work to suit your current fitness and the goals you discuss together. You can make boxing fitness the focus of your sessions or include it in a wider personal training programme."),
            ("What happens in a boxing fitness session?", "A session starts with a warm-up, followed by coached padwork and exercises selected for your level. Dean adjusts the pace, work periods and recovery as you progress. The aim is to develop coordination, stamina and confidence through manageable challenges. Your session finishes with a cool-down, so you leave knowing what you worked on and what comes next."),
            ("Starting boxing fitness as a beginner", "You do not need to arrive fit or know how to use boxing pads. During your free consultation, discuss your experience, any limitations and what you want from training. Dean starts from your current ability, explains the exercises and builds the session around you. If you are returning to exercise, the workload can increase gradually as your confidence grows."),
            ("Padwork, strength and conditioning outdoors", "Sessions take place in East London parks or a suitable home garden, with the training equipment provided. Boxing padwork can be combined with resistance bands, bodyweight exercises and portable kit. Tell Dean whether your priority is general fitness, strength, weight management or simply finding exercise you enjoy. Results depend on your starting point, consistency and habits between sessions."),
        ],
        "faqs": [
            ("Do you offer boxing fitness in East London?", "Yes. DB's Workouts offers 1-to-1 boxing fitness with outdoor padwork and conditioning across East London. Book a free consultation with Dean to discuss your goals and location."),
            ("Can beginners book boxing fitness sessions?", "Yes. Dean adapts padwork and conditioning to your starting fitness level and experience. You do not need previous boxing fitness experience."),
            ("Is this boxing fitness or competitive boxing coaching?", "These sessions focus on fitness, padwork and conditioning. If you want sparring or competitive boxing preparation, discuss that separately with Dean before booking."),
            ("Do I need to bring boxing equipment?", "Dean provides the training equipment. Wear comfortable training clothes and suitable footwear, and confirm any personal equipment requirements during your consultation."),
            ("How much does boxing fitness cost?", "A 1-to-1 session costs £45 pay as you go. Blocks cost £214 for 5, £406 for 10 or £576 for 15 sessions. Arrange the boxing fitness focus with Dean when booking."),
        ],
    },
    {
        "slug": "weight-loss-personal-trainer-east-london",
        "name": "Weight Loss Coaching",
        "title": "Weight Loss Personal Trainer East London | DB's Workouts",
        "description": "Weight loss personal training in East London: outdoor strength and cardio coaching with practical nutrition support. From £45. Free consultation.",
        "heading": "Weight Loss Personal Training in East London",
        "intro": "Outdoor strength and cardio sessions, practical nutrition support and a programme you can keep following. Start with a free conversation about your goals.",
        "sections": [
            ("A sustainable approach to weight loss", "If weight loss is your goal, Dean helps you build a routine around your starting point and everyday life. Personal training combines coached exercise, progress tracking and practical support with consistency. The focus is on habits you can maintain, rather than a fixed promise about how much weight you will lose in a set number of weeks."),
            ("Strength training and cardio in your local park", "Your outdoor sessions can combine resistance training, bodyweight exercises, cardio circuits and boxing pads. Dean chooses the mix according to your ability, preferences and goals. You do not need a gym membership, and all session equipment is provided. A structured warm-up and cool-down are part of the session."),
            ("Nutrition and workout plans between sessions", "Every block of 5, 10 or 15 sessions includes a personalised nutrition plan and workout plan in the DB's Workouts app. Dean sends you a personal access link so you can follow the programme between coached sessions. Pay-as-you-go sessions do not include these app plans. Practical nutrition guidance supports the training, with changes discussed around your routine."),
            ("Progress beyond the number on the scales", "Discuss the measures that matter to you during your consultation: body composition, strength, fitness, confidence or consistency. Progress tracking helps Dean adjust the programme as your needs change. Your results depend on your starting point, attendance and habits between sessions; the consultation helps you choose a realistic approach."),
        ],
        "faqs": [
            ("Can a beginner book weight loss personal training?", "Yes. Dean starts with a consultation and assessment, then adapts sessions to your current fitness level. You do not need to get fit before starting."),
            ("Do session blocks include a nutrition plan?", "Yes. Blocks of 5, 10 or 15 sessions include personalised nutrition and workout plans in the DB's Workouts app. Pay-as-you-go sessions do not include the app plans."),
            ("How often should I train?", "Dean recommends a schedule during your consultation based on your goals, fitness and availability. Your programme should fit your life so you can follow it consistently."),
            ("Do you guarantee a particular amount of weight loss?", "No. Weight loss varies with your starting point, training consistency, food habits and other factors. Dean helps you set realistic goals and track progress."),
        ],
    },
    {
        "slug": "personal-training-for-beginners-east-london",
        "name": "Beginner Personal Training",
        "title": "Personal Training for Beginners East London | DB's Workouts",
        "description": "Beginner personal training in East London parks and home gardens. Build fitness and confidence with REPs Level 3 PT Dean Burt. Free consultation.",
        "heading": "Personal Training for Beginners in East London",
        "intro": "New to exercise or returning after a break? Start with supportive 1-to-1 outdoor coaching, at a level that works for you. No gym membership needed.",
        "sections": [
            ("You can start from where you are", "You do not need to be fit, confident or experienced before your first session. Dean begins with a conversation about your goals, fitness history and any limitations you want him to understand. An assessment helps shape the programme, so the exercises and pace reflect your starting point rather than someone else's routine."),
            ("What your first personal training session involves", "Your session includes a warm-up, a main workout adapted to your level and a cool-down. Dean explains the movements and coaches you through them. Exercises can use bodyweight, resistance bands and portable kit. As you learn the movements, the programme can build towards more strength, stamina and confidence."),
            ("Returning to exercise after a break", "If you have had time away from training, share what has changed and what you want to work towards. Dean can adjust the workload and help you build consistency gradually. You can choose a local park or discuss a suitable home garden, making training easier to fit around work and family commitments."),
            ("Support between your sessions", "Session blocks include personalised workout and nutrition plans in the DB's Workouts app. These give you a programme to follow between coached sessions. Start with a £45 pay-as-you-go session or discuss a block after your free consultation. There is no contract or minimum commitment."),
        ],
        "faqs": [
            ("Do I need to get fit before booking a personal trainer?", "No. Dean builds sessions around your starting ability. Beginners and people returning after a break are welcome."),
            ("What should I bring to an outdoor PT session?", "Wear comfortable training clothes and suitable footwear, and bring water. Dean provides the session equipment."),
            ("Can I try a session without buying a block?", "Yes. Pay-as-you-go personal training is £45 per session. You can start there without a contract or minimum commitment."),
            ("What happens in the free consultation?", "It is a 20-minute conversation, in person or by phone, about your goals, fitness history and whether Dean's outdoor personal training is a good fit."),
        ],
    },
    {
        "slug": "mobile-personal-trainer-east-london",
        "name": "Mobile Personal Training",
        "title": "Mobile Personal Trainer East London | Park & Garden PT",
        "description": "Mobile personal trainer in East London: Dean brings equipment to your local park or home garden. 1-to-1 sessions from £45. Free consultation.",
        "heading": "Mobile Personal Trainer in East London",
        "intro": "Dean comes to your local park or suitable home garden with the equipment. Personalised 1-to-1 coaching, without a gym membership or a trip to a studio.",
        "sections": [
            ("Personal training that comes to you", "Mobile outdoor personal training means choosing a convenient location with Dean, then following a programme built around your goals. Sessions can take place in a local park or suitable home garden. Share your postcode during the free consultation so you can agree a practical venue and check availability before booking."),
            ("Local park or home garden?", "A park gives you room for circuits, cardio and portable strength equipment. A suitable home garden offers another outdoor option closer to your door. Dean helps you choose a space that works for the session and brings the kit. This service focuses on outdoor training; discuss your space with Dean before arranging a garden session."),
            ("Training around work and family life", "Early mornings, evenings and weekends can be discussed around your availability. You do not need to organise equipment or pay a gym membership. Each 1-to-1 session includes a warm-up, coached exercises and a cool-down, with the programme adjusted to your level. Confirm your preferred time and location during the consultation."),
            ("Strength, fitness and boxing padwork", "Your mobile PT programme can include strength work, cardio circuits, boxing fitness or a mix of exercises. Dean adapts the training to what you want to achieve. Blocks of 5, 10 or 15 sessions also include personalised nutrition and workout plans in the DB's Workouts app to support your routine between sessions."),
        ],
        "faqs": [
            ("Which areas does your mobile personal trainer cover?", "DB's Workouts covers East London, including Ilford, Goodmayes, Stratford, Wanstead, Walthamstow, Romford, Barking and nearby areas. Send your postcode to Dean to confirm a venue and availability."),
            ("Can you train me in my home garden?", "Yes, a suitable home garden is an outdoor training option. Discuss the available space with Dean during your consultation."),
            ("Do I need a gym membership or my own equipment?", "No. Dean provides portable training equipment for your outdoor session. A gym membership is not required."),
            ("How much does mobile personal training cost?", "Pay as you go is £45 per session. Blocks are £214 for 5, £406 for 10 or £576 for 15 sessions. Confirm your location and availability before booking."),
        ],
    },
    {'slug': 'pair-personal-training-east-london',
     'name': 'Pair Personal Training',
     'title': "Pair Personal Training East London | DB's Workouts",
     'description': 'Outdoor pair personal training in East London. Two people train together for 1.5 times the '
                    'one-person price: £67.50 total pay as you go. Free consultation.',
     'heading': 'Pair Personal Training in East London',
     'intro': 'Train outdoors with a friend or partner. Personal coaching for two people, at 1.5 times the '
              'corresponding one-person price. Pay as you go is £67.50 total for the pair.',
     'sections': [('Two people. One shared session.',
                   "Pair personal training combines Dean's coaching with the encouragement of training alongside "
                   'a friend or partner. Discuss both of your goals, starting fitness levels and preferred East '
                   'London location during your free consultation.'),
                  ('Different starting points, personal coaching',
                   'Tell Dean about your individual experience and goals. Exercises and pace can be adapted so '
                   'you can train together while working at levels that suit you. Sessions can include '
                   'bodyweight movements, strength work and portable equipment.'),
                  ('Choose a location that works for both of you',
                   'Agree a local park or suitable home garden and a time that suits you both. Dean brings the '
                   'equipment. Discuss any limitations and training preferences before booking, and check '
                   'availability directly with Dean.'),
                  ('Clear pricing for the pair',
                   'Pair sessions are for two people and cost 1.5 times the corresponding one-person price. Pay '
                   'as you go is £67.50 total for both people per session. A one-person pay-as-you-go session is '
                   '£45, so the pair pays £45 × 1.5 = £67.50 together. The same 1.5-times rule applies to the '
                   'corresponding one-person session block. See the pricing page or message Dean to arrange your '
                   'sessions.')],
     'faqs': [('How many people can train in a pair session?',
               'Two people train together with Dean. Pair sessions are designed for a friend or partner joining '
               'you.'),
              ('How much does a pair session cost?',
               'Pair sessions are for two people and cost 1.5 times the corresponding one-person price. Pay as '
               'you go is £67.50 total for both people per session.'),
              ('Can we train together with different fitness levels?',
               'Yes. Discuss both of your starting points and goals with Dean. Exercises and pace can be adapted '
               "to each person's level."),
              ('Do we need to bring equipment?',
               'No. Dean provides the session equipment. Bring water and wear comfortable training clothes and '
               'suitable footwear.')]},
]


def service_links():
    return "\n".join(f'<a class="area-pill" href="/{s["slug"]}">{escape(s["name"])}</a>' for s in SERVICES)


def build_page(service, template):
    slug = service["slug"]
    url = f"{DOMAIN}/{slug}"
    head = template.split("</head>", 1)[0]
    head = re.sub(r"<title>.*?</title>", f'<title>{escape(service["title"])}</title>', head)
    head = re.sub(r'<meta name="keywords"[^>]*>\s*', '', head)
    head = re.sub(r'(<meta (?:name="(?:description|twitter:description)"|property="og:description") content=")[^"]*', lambda m: m[1] + escape(service["description"], quote=True), head)
    head = re.sub(r'(<meta (?:name="twitter:title"|property="og:title") content=")[^"]*', lambda m: m[1] + escape(service["title"], quote=True), head)
    head = head.replace(f"{DOMAIN}/personal-trainer-ilford", url)
    head = head.replace('content="Ilford, East London"', 'content="East London"')
    head = re.sub(r'<script type="application/ld\+json">.*?</script>', '', head, flags=re.S)
    schema = {"@context": "https://schema.org", "@graph": [
        {"@type": "WebPage", "@id": url + "#webpage", "url": url, "name": service["title"], "description": service["description"], "inLanguage": "en-GB", "isPartOf": {"@id": DOMAIN + "/#website"}, "about": {"@id": url + "#service"}},
        {"@type": "Service", "@id": url + "#service", "name": service["heading"], "serviceType": service["name"], "description": service["description"], "url": url, "provider": {"@type": "LocalBusiness", "@id": DOMAIN + "/#business", "name": "DB's Workouts", "url": DOMAIN + "/"}, "areaServed": {"@type": "Place", "name": "East London"}},
        {"@type": "BreadcrumbList", "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": DOMAIN + "/"}, {"@type": "ListItem", "position": 2, "name": service["name"], "item": url}]},
        {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in service["faqs"]]},
    ]}
    head += '\n<script type="application/ld+json">' + json.dumps(schema, ensure_ascii=False) + '</script>\n</head>'
    nav = re.split(r'<main\b|<div class="hero-local">', template.split('<body>', 1)[1], maxsplit=1)[0]
    nav = re.sub(r'<a class="seo-skip".*?</a>', '', nav)
    footer = '      <footer' + template.split('      <footer', 1)[1]
    sections = '\n'.join(f'<h2>{escape(h)}</h2><p>{escape(p)}</p>' for h, p in service["sections"])
    faqs = '\n'.join(f'<h3>{escape(q)}</h3><p>{escape(a)}</p>' for q, a in service["faqs"])
    area_links = '\n'.join(f'<a class="area-pill" href="/{path}">{name}</a>' for path, name in [
        ('personal-trainer-ilford', 'Ilford'), ('personal-trainer-goodmayes', 'Goodmayes'), ('personal-trainer-stratford', 'Stratford'), ('personal-trainer-wanstead', 'Wanstead'), ('outdoor-pt-walthamstow', 'Walthamstow'), ('personal-trainer-romford', 'Romford')])
    content = f'''<main>
<div class="hero-local">
  <p>OUTDOOR PERSONAL TRAINING · EAST LONDON</p>
  <h1>{escape(service["heading"])}</h1>
  <p>{escape(service["intro"])}</p>
  <a href="/contact" class="cta-btn">Book a Free Consultation</a>
  <p>REPs Level 3 certified · Qualified since 2019 · No gym membership needed</p>
</div>
<div class="page-content">
  {sections}
  <div class="info-block">
    <h2>Training locations across East London</h2>
    <p>Choose a convenient local park or discuss a suitable home garden with Dean. Send your postcode to confirm the location and availability.</p>
    <div class="areas-grid">{area_links}</div>
    <p><a href="/park-guide">Explore the East London park training guide</a>.</p>
  </div>
  <h2>Book with Dean Burt</h2>
  <p>Dean is a REPs Level 3 certified personal trainer, qualified since 2019. Start with a free consultation to discuss your goals and the right session format. <a href="/about">Meet Dean</a> and <a href="/testimonials">read client reviews</a>.</p>
  <p>1-to-1 prices are £45 pay as you go, £214 for 5 sessions, £406 for 10 or £576 for 15 (£38.40 per session). Session blocks include free app nutrition and workout plans. Pair sessions are for two people and cost 1.5 times the corresponding one-person price. Pay as you go is £67.50 total for both people per session. <a href="/pricing">See full personal training prices and packages</a>.</p>
  <div class="info-block"><h2>Your questions answered</h2>{faqs}</div>
  <div class="info-block"><h2>Explore your training options</h2><div class="areas-grid">{service_links()}</div></div>
  <a href="/contact" class="cta-btn block">Book a Free Consultation</a>
</div>
</main>
'''
    output = '\n'.join(line.rstrip() for line in (head + '\n<body>\n' + nav + content + footer).splitlines()) + '\n'
    output = re.sub(r'<link rel="stylesheet" href="/Styles/seo-pages.css[^"]*">', '', output)
    return refresh_html(output)


def main():
    template = (ROOT / 'personal-trainer-ilford.html').read_text()
    for service in SERVICES:
        # Preserve the bespoke boxing page; it is maintained directly in HTML.
        if service["slug"] == "boxing-fitness-east-london":
            print("Preserved bespoke page:", service["slug"])
            continue
        (ROOT / (service['slug'] + '.html')).write_text(build_page(service, template))
        print('Created:', service['slug'])


if __name__ == '__main__':
    main()
