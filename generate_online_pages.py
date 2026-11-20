"""Build the online personal training hub and its supporting SEO pages.

Uses the site's current SEO-page design (Styles/seo-pages.css), the shared
navigation and the footer from weight-loss-personal-trainer-east-london.html.
These pages are written for online 1-to-1 training only: do not run
generate_service_pages.py to rebuild them, it keeps them as bespoke pages.

Facts used (keep copy to these): 45-minute 1-to-1 online sessions at £30,
a personalised workout and nutrition plan in the DB's Workouts app (personal
access link sent by email), regular check-ins, free consultation call, REPs Level 3
since 2019, 5.0 stars from 70 Google reviews. Outdoor sessions from £50.
"""
import json
import re
import sys
from datetime import date
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))
from shared_navigation import navigation  # noqa: E402

DOMAIN = "https://dbworkouts.co.uk"
HUB = "online-personal-training"
TODAY = date.today().isoformat()
YOUTUBE = "https://www.youtube.com/shorts/atRa1bg30lU"
YOUTUBE_ID = "atRa1bg30lU"

# ---------------------------------------------------------------- content
SESSION = "45-minute 1-to-1 online sessions with Dean"
INCLUDES = [
    "45-minute 1-to-1 online sessions with Dean Burt",
    "A personalised workout plan in the DB's Workouts app",
    "A personalised nutrition plan in the DB's Workouts app",
    "Regular check-ins to keep you on track",
    "A free initial consultation call",
]

PAGES = [
    {
        "slug": "online-personal-trainer-uk",
        "crumb": "Online Personal Trainer UK",
        "title": "Online Personal Trainer UK | 1-to-1 from £30 | DB's Workouts",
        "desc": "Online personal trainer in the UK: 1-to-1 sessions with REPs Level 3 coach Dean Burt, £30 for 45 minutes, plus an app workout and nutrition plan and check-ins.",
        "kicker": "ONLINE PERSONAL TRAINER · UK",
        "h1": "Online Personal Trainer in the UK",
        "lead": "Work one-to-one with a qualified personal trainer from wherever you live. 45-minute online sessions, a personalised workout and nutrition plan in the app, and regular check-ins.",
        "quick": "Dean Burt is a REPs Level 3 personal trainer offering online 1-to-1 personal training anywhere in the UK. Sessions are 45 minutes and cost £30, with a workout and nutrition plan in the DB's Workouts app and regular check-ins included.",
        "photo": ("50% 18%", "ONLINE PERSONAL TRAINER", "A qualified coach, wherever you live."),
        "area": {"@type": "Country", "name": "United Kingdom"},
        "sections": [
            ("What an online personal trainer does", [
                "An online personal trainer coaches you remotely instead of in person. You get a plan built around your goals, sessions where your trainer talks you through the training and coaches how you move, and ongoing support between sessions. Distance changes the setting, not the coaching: you train at home, in your own gym or anywhere you have space."]),
            ("One-to-one coaching, not an app on its own", [
                "Many online fitness products are apps or pre-written programmes. With DB's Workouts the coaching comes from Dean. The DB's Workouts app is where your workout and nutrition plan live, but every session is just you and Dean, and your plan is adjusted at your check-ins as you progress."]),
            ("Qualified and registered", [
                "Dean Burt is a REPs Level 3 certified personal trainer, qualified since 2019, with a 5.0 rating from 70 Google reviews. Read his story on the [about page](/about) and what clients say on the [reviews page](/testimonials)."]),
            ("Training anywhere in the UK", [
                "You do not need to live near East London. You need an internet connection, a device for your session and somewhere to train. Tell Dean where you will be training and what equipment you have, and the plan is written around it."]),
            ("How to get started", [
                "Book a free consultation call to talk through your goals, fitness history and any limitations. Dean then sets you up in the DB's Workouts app, sends you a personal access link by email, and you begin your 45-minute sessions. [Book a free consultation call](/contact)."]),
        ],
        "faqs": [
            ("Do you offer online personal training across the UK?", "Yes. Online 1-to-1 personal training with DB's Workouts is available wherever you are, as long as you have an internet connection and space to train."),
            ("How much is an online personal trainer?", "Online 1-to-1 sessions with DB's Workouts cost £30 per 45-minute session, including your workout and nutrition plan in the app and regular check-ins."),
            ("Is Dean Burt a qualified personal trainer?", "Yes. Dean is a REPs Level 3 certified personal trainer, qualified since 2019, with a 5.0 rating from 70 Google reviews."),
            ("Is online training a class or one-to-one?", "It is one-to-one. Every session is just you and Dean, so the training is built around your goals and fitness level."),
            ("What do I need to start online personal training?", "A device with an internet connection for your session, somewhere to train and any equipment you have. You do not need a gym membership, and Dean plans around what you can access."),
            ("How do I book an online personal trainer?", "Book a free consultation call through the contact page or message Dean on WhatsApp on 07752 300937 to talk through your goals first."),
        ],
    },
    {
        "slug": "online-personal-trainer-london",
        "crumb": "Online Personal Trainer London",
        "title": "Online Personal Trainer London | From £30 | DB's Workouts",
        "desc": "Online personal trainer for Londoners: 1-to-1 sessions from East London coach Dean Burt, £30 for 45 minutes, with an app workout and nutrition plan and check-ins.",
        "kicker": "ONLINE PERSONAL TRAINER · LONDON",
        "h1": "Online Personal Trainer in London",
        "lead": "Train one-to-one with a London personal trainer without the commute. 45-minute online sessions that fit around work and family, with a workout and nutrition plan in the app.",
        "quick": "DB's Workouts offers online 1-to-1 personal training for people in London. Dean Burt, a REPs Level 3 personal trainer based in East London, runs 45-minute sessions for £30, with a workout and nutrition plan in the DB's Workouts app and regular check-ins.",
        "photo": ("50% 14%", "ONLINE · LONDON", "No commute. Just coaching."),
        "area": {"@type": "Place", "name": "London"},
        "sections": [
            ("Personal training that fits a London schedule", [
                "Getting to a gym or studio takes time many Londoners do not have. Online sessions remove the travel, so you can train from home before work, at lunchtime or in the evening. Talk through the times that suit you with Dean when you book your free consultation call."]),
            ("Based in East London", [
                "Dean Burt runs DB's Workouts in East London and has trained clients in parks across the area. His online clients get the same one-to-one coaching from wherever they are in London. See the [areas Dean covers](/personal-trainer-east-london-areas)."]),
            ("Small flat? No problem", [
                "You do not need a gym or a spare room. Tell Dean what space and equipment you have, whether that is a living-room floor and a pair of dumbbells or a full home gym, and the training is planned around it."]),
            ("Prefer to train outside?", [
                "If you would rather train in person, Dean also offers outdoor sessions in East London parks and gardens from £50. Compare them on the [pricing page](/pricing) or read about [mobile personal training](/mobile-personal-trainer-east-london)."]),
            ("What you get", ["__INCLUDES__"]),
        ],
        "faqs": [
            ("Do you offer online personal training in London?", "Yes. Online 1-to-1 personal training with DB's Workouts is available to anyone in London, with 45-minute sessions at £30 each."),
            ("How much does an online personal trainer cost in London?", "DB's Workouts online sessions cost £30 per 45-minute session, with your workout and nutrition plan in the app and regular check-ins included."),
            ("Can I train outdoors with Dean instead?", "Yes. Dean also offers outdoor personal training in East London parks and suitable home gardens, with pay-as-you-go sessions from £50."),
            ("Do I need a gym membership or equipment?", "No. Tell Dean what space and equipment you have access to and he builds the plan around it."),
            ("Which parts of London do you cover?", "Online training works anywhere in London. Dean's outdoor sessions are in East London, including Ilford, Stratford, Wanstead, Walthamstow and Romford."),
        ],
    },
    {
        "slug": "online-weight-loss-personal-training",
        "crumb": "Online Weight Loss Coaching",
        "title": "Online Weight Loss Personal Training | From £30",
        "desc": "Online weight loss personal training: 1-to-1 sessions with Dean Burt, £30 for 45 minutes, plus a nutrition and workout plan in the app and regular check-ins.",
        "kicker": "ONLINE WEIGHT LOSS COACHING",
        "h1": "Online Weight Loss Personal Training",
        "lead": "Practical weight loss coaching, one-to-one and online. A workout and nutrition plan written for you, 45-minute sessions with Dean and regular check-ins to keep you consistent.",
        "quick": "DB's Workouts offers online weight loss personal training for £30 per 45-minute session. It combines 1-to-1 coaching with a personalised workout and nutrition plan in the DB's Workouts app and regular check-ins. Results vary and are not guaranteed.",
        "photo": ("50% 20%", "ONLINE WEIGHT LOSS COACHING", "Sustainable habits. Real support."),
        "area": {"@type": "Country", "name": "United Kingdom"},
        "sections": [
            ("A sustainable approach, not a quick fix", [
                "Weight loss that lasts comes from habits you can keep up, so the focus is a routine that fits your life: training you can repeat each week and food choices you can live with. Dean does not promise a set amount of weight loss in a set number of weeks, because results depend on your starting point, consistency and habits between sessions."]),
            ("Training and nutrition in one plan", [
                "Your workout plan and nutrition plan sit together in the DB's Workouts app. Sessions with Dean cover how you are training, and your check-ins cover how the plan is working in real life, so it can be adjusted around your routine, food preferences and progress."]),
            ("Strength and cardio you can do at home", [
                "Sessions can combine resistance training, bodyweight exercises and cardio, chosen for your fitness level and the equipment you have. You do not need a gym membership."]),
            ("Measuring progress", [
                "The scales are one measure among several. Talk to Dean about what matters to you, such as body composition, strength, fitness, energy or confidence, and your check-ins track it.",
                "Nutrition guidance from a personal trainer is general guidance, not medical or dietetic advice. If you have a medical condition or take medication, speak to your GP before changing how you eat or train."]),
            ("What it costs", [
                "Online sessions are £30 each for 45 minutes, with your plans and check-ins included. See [how much an online personal trainer costs](/online-personal-trainer-cost-uk) or compare with outdoor [weight loss coaching in East London](/weight-loss-personal-trainer-east-london)."]),
        ],
        "faqs": [
            ("Do you guarantee a certain amount of weight loss?", "No. Weight loss varies with your starting point, consistency, food habits and other factors. Dean helps you set realistic goals and tracks your progress at your check-ins."),
            ("Does online weight loss training include a nutrition plan?", "Yes. You get a personalised nutrition plan and workout plan in the DB's Workouts app, with regular check-ins, as part of the £30 per session price."),
            ("How much does online weight loss coaching cost?", "Online sessions cost £30 per 45-minute session, including your workout and nutrition plans and regular check-ins."),
            ("Can beginners do online weight loss training?", "Yes. Dean starts with a free consultation call and builds the training at a level that suits your current fitness. You do not need to get fit before starting."),
            ("Do I need gym equipment?", "No. Dean plans your sessions around the space and equipment you have, including bodyweight-only training."),
        ],
    },
    {
        "slug": "online-personal-training-for-beginners",
        "crumb": "Online Training for Beginners",
        "title": "Online Personal Training for Beginners | £30 | DB's Workouts",
        "desc": "Online personal training for beginners: supportive 1-to-1 sessions with Dean Burt, £30 for 45 minutes, plus an app workout and nutrition plan and regular check-ins.",
        "kicker": "ONLINE TRAINING · BEGINNERS WELCOME",
        "h1": "Online Personal Training for Beginners",
        "lead": "New to exercise, or coming back after a break? Start with a supportive 1-to-1 online session at a level that suits you, with a clear plan to follow in between.",
        "quick": "Beginners are welcome. DB's Workouts online personal training starts with a free consultation call, then 45-minute 1-to-1 sessions at £30 with a workout and nutrition plan in the DB's Workouts app and regular check-ins, all built around your current fitness.",
        "photo": ("50% 16%", "ONLINE · BEGINNERS WELCOME", "Start where you are."),
        "area": {"@type": "Country", "name": "United Kingdom"},
        "sections": [
            ("You can start from where you are", [
                "You do not need to be fit, confident or experienced before your first session. Dean begins with a conversation about your goals, your fitness history and anything you want him to know, then builds the training around your starting point."]),
            ("What your first sessions involve", [
                "Dean talks you through each exercise, shows you what you are aiming for and coaches how you do it, so you build good habits from the start. The pace is yours, and the plan moves on only when you are ready for it."]),
            ("Training at home as a beginner", [
                "You can start with no equipment at all. Many beginners begin with bodyweight exercises and add a mat, resistance bands or a pair of dumbbells later. Tell Dean what you have and he plans around it. See [online training at home](/online-personal-training-at-home)."]),
            ("A plan that does not overwhelm you", [
                "Your workout and nutrition plan live in the DB's Workouts app, so you always know what to do between sessions. Regular check-ins keep you steady and let Dean adjust the plan if it is too easy, too hard or does not fit your week."]),
            ("Returning after time off or an injury", [
                "If you have an injury or a health condition, speak to your GP before you start and tell Dean about it in your consultation so he can plan around it."]),
        ],
        "faqs": [
            ("Can complete beginners do online personal training?", "Yes. Dean builds each programme around your current fitness and experience, and you do not need to get fit before starting."),
            ("Do I need any equipment as a beginner?", "No. You can start with bodyweight exercises. Tell Dean what you have access to and he builds the plan around it."),
            ("What happens in the free consultation call?", "You talk through your goals, fitness history and any limitations with Dean, and decide whether online personal training suits you."),
            ("How much does online personal training cost?", "Online 1-to-1 sessions cost £30 per 45-minute session, including your workout and nutrition plan in the app and regular check-ins."),
            ("Will I be on my own between sessions?", "No. Your plan is in the DB's Workouts app and regular check-ins keep you on track."),
        ],
    },
    {
        "slug": "online-personal-training-at-home",
        "crumb": "Online Training at Home",
        "title": "Online Personal Trainer for Home Workouts | £30",
        "desc": "Home workouts with an online personal trainer: 1-to-1 sessions with Dean Burt, £30 for 45 minutes, planned around your space and equipment, plus app plans.",
        "kicker": "ONLINE TRAINING · AT HOME",
        "h1": "Home Workouts With an Online Personal Trainer",
        "lead": "Train at home with a coach, not a video. 1-to-1 online sessions planned around your space and equipment, with a workout and nutrition plan in the app and regular check-ins.",
        "quick": "You can train at home with DB's Workouts online personal training. Dean Burt plans your 45-minute 1-to-1 sessions, £30 each, around the space and equipment you have, with a workout and nutrition plan in the DB's Workouts app and regular check-ins.",
        "photo": ("50% 22%", "ONLINE · AT HOME", "Your space. Your plan."),
        "area": {"@type": "Country", "name": "United Kingdom"},
        "sections": [
            ("Everything you need is where you already are", [
                "Training at home saves the journey and the membership. Your sessions are one-to-one with Dean, so the exercises, intensity and pace are chosen for you, not for a room full of people."]),
            ("What equipment do you need?", [
                "Nothing is required to begin. If you want to add equipment, these are useful, inexpensive starting points:",
                "__LIST__:A mat or a clear patch of floor|Resistance bands|A pair of dumbbells or a kettlebell|A sturdy chair or bench",
                "Tell Dean what you have, or have nothing at all, and the plan is written around it."]),
            ("Making space to train safely", [
                "Choose a spot where you can move freely, wear supportive footwear and keep water nearby. If anything hurts or feels wrong, stop and tell Dean. If you have an injury or health condition, speak to your GP before starting."]),
            ("Coaching between sessions", [
                "Your personalised workout plan and nutrition plan live in the DB's Workouts app, so you always know what the next workout is. Regular check-ins let Dean adjust the plan as you progress."]),
            ("Prefer a gym or the outdoors?", [
                "Online training works at home, in a gym or anywhere with space. If you would rather train outside in person, see [outdoor personal training in East London](/mobile-personal-trainer-east-london)."]),
        ],
        "faqs": [
            ("Can I really get a good workout at home?", "Yes. Dean plans sessions around your space and equipment, and bodyweight training can be challenging and effective at any level."),
            ("What equipment do I need for online personal training at home?", "None to start. Resistance bands, dumbbells, a kettlebell or a mat can help, and Dean builds the plan around whatever you have."),
            ("Is this a video or a live session with a coach?", "It is 1-to-1 personal training with Dean, in 45-minute online sessions, with your plan in the DB's Workouts app."),
            ("How much does it cost?", "Online sessions are £30 per 45-minute session, including your workout and nutrition plan and regular check-ins."),
            ("Do I need a lot of space?", "No. A clear area where you can move freely is enough, and Dean can plan exercises around small spaces."),
        ],
    },
    {
        "slug": "online-strength-training-coach",
        "crumb": "Online Strength Training Coach",
        "title": "Online Strength Training Coach | From £30 | DB's Workouts",
        "desc": "Online strength training coaching: 1-to-1 sessions with Dean Burt, £30 for 45 minutes, a progressive plan in the DB's Workouts app and regular check-ins.",
        "kicker": "ONLINE STRENGTH COACHING",
        "h1": "Online Strength Training Coach",
        "lead": "Get stronger with a coach who plans your training around you. 45-minute 1-to-1 online sessions, a progressive workout plan in the app and regular check-ins.",
        "quick": "DB's Workouts offers online strength training coaching: 45-minute 1-to-1 sessions with Dean Burt for £30, a personalised progressive workout plan and nutrition plan in the DB's Workouts app, and regular check-ins to adjust your training.",
        "photo": ("50% 18%", "ONLINE STRENGTH COACHING", "Progress you can measure."),
        "area": {"@type": "Country", "name": "United Kingdom"},
        "sections": [
            ("Strength training, coached one-to-one", [
                "Good strength training is about doing the right exercises, with good technique, in a sensible order. In your sessions Dean talks you through the movements and coaches how you perform them, whether you train with a barbell, dumbbells, bands or just your bodyweight."]),
            ("A plan that progresses with you", [
                "Strength comes from gradually asking a little more of your body over time, by adding weight, repetitions or difficulty when you are ready. Your workout plan in the DB's Workouts app is built that way, and your check-ins give Dean the information to change it when something is too easy, too hard or stalling."]),
            ("Technique first", [
                "Moving well comes before lifting heavy. Dean starts at a level that suits you, so your technique is solid before the load increases."]),
            ("At home or in the gym", [
                "You can follow your plan at home with minimal kit or in a gym if you have one. Tell Dean what you have access to and he plans around it. See [online training at home](/online-personal-training-at-home)."]),
            ("Fuel for your training", [
                "Your plan includes a personalised nutrition plan to support your training. Nutrition guidance from a personal trainer is general guidance, not medical or dietetic advice."]),
        ],
        "faqs": [
            ("Can I build strength with online personal training?", "Yes. Dean plans progressive strength training around your goals and the equipment you have, and adjusts it at your regular check-ins."),
            ("Do I need weights at home?", "Not to begin. Dean can start with bodyweight and bands, and you can add dumbbells, a kettlebell or gym access later."),
            ("Will Dean check my technique?", "Yes. Your 45-minute sessions are one-to-one, and Dean coaches how you perform each movement."),
            ("How much does online strength coaching cost?", "£30 per 45-minute session, including your workout and nutrition plan in the app and regular check-ins."),
            ("Is it suitable for beginners?", "Yes. Beginners are welcome, and the training starts at a level that suits you. See [online training for beginners](/online-personal-training-for-beginners)."),
        ],
    },
    {
        "slug": "online-personal-training-with-nutrition-plan",
        "crumb": "Online Training With a Nutrition Plan",
        "title": "Online Personal Training With Nutrition Plan | £30",
        "desc": "Online personal training with a nutrition plan: 1-to-1 sessions with Dean Burt, £30 for 45 minutes, plus a workout and nutrition plan in the app and check-ins.",
        "kicker": "ONLINE TRAINING · NUTRITION PLAN",
        "h1": "Online Personal Training With a Nutrition Plan",
        "lead": "Training and nutrition planned together. 1-to-1 online sessions with Dean, a workout and nutrition plan written for you in the app, and regular check-ins.",
        "quick": "Every DB's Workouts online personal training client gets a personalised workout plan and nutrition plan in the DB's Workouts app, plus 45-minute 1-to-1 sessions with Dean Burt and regular check-ins, for £30 per session.",
        "photo": ("50% 12%", "ONLINE · NUTRITION PLAN", "Train it. Fuel it. Track it."),
        "area": {"@type": "Country", "name": "United Kingdom"},
        "sections": [
            ("Training and nutrition, planned together", [
                "Your results depend on how you train and how you eat, and the two work best when they are planned together. Your sessions with Dean cover the training, and your nutrition plan supports it."]),
            ("Where your plans live", [
                "Dean sets you up in the DB's Workouts app and sends you a personal access link by email. Your workout plan and nutrition plan are both there, written for you, so you can follow them between sessions."]),
            ("Check-ins keep it realistic", [
                "A plan only works if it fits your life. Regular check-ins let you say what is working and what is not, and Dean adjusts your plan around your routine, preferences and progress."]),
            ("What to expect from nutrition guidance", [
                "Nutrition guidance from a personal trainer is general guidance to support your training, not medical or dietetic advice. If you have a medical condition, allergies, or take medication, speak to your GP or a registered dietitian first."]),
            ("Who it suits", [
                "It suits people who want one place for their training and nutrition, with a real coach behind it. Read about [online weight loss coaching](/online-weight-loss-personal-training) or [online strength training](/online-strength-training-coach)."]),
        ],
        "faqs": [
            ("Is a nutrition plan included in online personal training?", "Yes. You get a personalised nutrition plan and workout plan in the DB's Workouts app as part of online personal training, with 45-minute sessions at £30 each."),
            ("How do I get my nutrition plan?", "Dean sets you up in the DB's Workouts app and sends you a personal access link by email. Your plans are there."),
            ("Can the plan be adjusted?", "Yes. Regular check-ins let Dean adjust your workout and nutrition plans around your progress and routine."),
            ("Is the nutrition guidance medical advice?", "No. It is general guidance from a personal trainer. For medical conditions or allergies, speak to your GP or a registered dietitian."),
            ("How much does it cost?", "£30 per 45-minute online session, with your plans and regular check-ins included."),
        ],
    },
    {
        "slug": "online-personal-trainer-cost-uk",
        "crumb": "Online Personal Trainer Cost",
        "title": "Online Personal Trainer Cost UK | £30 a Session",
        "desc": "How much does an online personal trainer cost? DB's Workouts online 1-to-1 sessions are £30 for 45 minutes, including an app workout and nutrition plan and check-ins.",
        "kicker": "ONLINE PERSONAL TRAINER · PRICING",
        "h1": "How Much Does an Online Personal Trainer Cost?",
        "lead": "A clear breakdown of what online personal training costs with DB's Workouts, what is included, and what to check when you compare coaches.",
        "quick": "Online 1-to-1 personal training with DB's Workouts costs £30 per 45-minute session. That includes a personalised workout and nutrition plan in the DB's Workouts app and regular check-ins. Training once a week is about £120 over four weeks.",
        "photo": ("50% 18%", "ONLINE PERSONAL TRAINER", "Simple, honest pricing."),
        "area": {"@type": "Country", "name": "United Kingdom"},
        "sections": [
            ("DB's Workouts online pricing", [
                "Online 1-to-1 personal training costs £30 per 45-minute session. You pay per session, so your cost depends on how often you train."]),
            ("What is included", ["__INCLUDES__"]),
            ("Monthly cost: once or twice a week", [
                "Training once a week is four sessions over four weeks, which is £120. Training twice a week is eight sessions, which is £240. Talk through the right pace for your goals and budget with Dean in your free consultation call."]),
            ("What affects the cost of online personal training", [
                "Prices vary between coaches. These are the factors that usually make the difference:",
                "__LIST__:Whether sessions are one-to-one or in a group|How long each session is|Whether a workout and nutrition plan is included or charged separately|How much check-in support you get between sessions|The coach's qualifications and registration"]),
            ("How to compare online personal trainers", [
                "Ask each coach what is included in the price, whether you train one-to-one, whether they are qualified and registered (look for REPs), and how check-ins work. Dean is a REPs Level 3 certified personal trainer, qualified since 2019, with a 5.0 rating from 70 Google reviews."]),
            ("Online or in person?", [
                "Online sessions are £30 for 45 minutes. Outdoor sessions in East London are £50 for 60 minutes pay as you go, with blocks of 5, 10 or 15 sessions from £42.50 per session. See the [full pricing page](/pricing)."]),
        ],
        "faqs": [
            ("How much does an online personal trainer cost in the UK?", "Prices vary by coach. With DB's Workouts, online 1-to-1 personal training costs £30 per 45-minute session, with your workout and nutrition plan in the app and regular check-ins included."),
            ("What is included in the £30 online session?", "A 45-minute 1-to-1 online session with Dean, a personalised workout and nutrition plan in the DB's Workouts app, and regular check-ins."),
            ("Is there a free consultation call?", "Yes. You can talk through your goals with Dean before you start, with no commitment."),
            ("How much is online training once a week?", "One session a week is four sessions over four weeks, which is £120 at £30 per session."),
            ("Is online personal training cheaper than in person?", "Per session, yes: online is £30 for 45 minutes, and outdoor pay-as-you-go sessions are £50 for 60 minutes. Outdoor blocks lower the per-session price."),
        ],
    },
]
# ---- extra guides (added 2026-11-20): topical pages, each with its own search intent ----
_UK = {"@type": "Country", "name": "United Kingdom"}
_PHOTO = ("50% 18%", "ONLINE PERSONAL TRAINING", "A qualified coach, wherever you are.")
_Q_PRICE = ("How much does online personal training cost?", "Online 1-to-1 personal training costs £30 per 45-minute session. Your workout and nutrition plan in the DB's Workouts app and your regular check-ins are included.")
_Q_BOOK = ("How do I get started?", "Book a free consultation call through the contact page or message Dean on WhatsApp on 07752 300937. You can talk through your goals before you start.")
_Q_GUARANTEE = ("Do you guarantee results?", "No. Results depend on your starting point, consistency and habits between sessions. Dean helps you set realistic goals and tracks your progress with regular check-ins.")
_GET_STARTED = ("How to get started", [
    "Book a free consultation call to talk through your goals, fitness history and any limitations. Dean then sets you up in the DB's Workouts app, sends you a personal access link by email, and you begin your 45-minute sessions. [Book a free consultation call](/contact)."])
_COST = ("What it costs", [
    "Online 1-to-1 sessions cost £30 per 45-minute session, and your workout and nutrition plan in the app and regular check-ins are included. Training once a week for four weeks is four sessions, which is £120. The [online personal training cost page](/online-personal-trainer-cost-uk) has more examples."])

EXTRA = [
    {
        "slug": "online-personal-training-for-busy-people",
        "crumb": "Online Training for Busy People",
        "title": "Online Personal Training for Busy People | DB's Workouts",
        "desc": "Online personal training that fits a busy week: 45-minute 1-to-1 sessions with REPs Level 3 trainer Dean Burt, £30 a session, no travel. Free consultation call.",
        "kicker": "ONLINE PERSONAL TRAINING · BUSY PEOPLE",
        "h1": "Online Personal Training for Busy People",
        "lead": "Train one to one without the commute. 45-minute online sessions, a plan built around the time and equipment you actually have, and check-ins that keep it on track when your week changes.",
        "quick": "Online personal training suits busy people because there is no travel: you train from home or anywhere with an internet connection. Sessions with Dean Burt are 45 minutes and cost £30, with a workout and nutrition plan in the DB's Workouts app and regular check-ins.",
        "photo": _PHOTO, "area": _UK,
        "sections": [
            ("Training that fits around work and family", [
                "For most people the hard part of training is not knowing what to do. It is finding the time. Online personal training removes the journey to a gym or studio, so a session is 45 minutes of your day and not an hour and a half once you add the travel.",
                "Tell Dean which days and times suit you when you book your free consultation call, and he will confirm what is available."]),
            ("A plan built around your week", [
                "Your plan is written around what you can realistically do, not an ideal week. If two sessions a week is what fits, the plan is built that way. Dean also asks what equipment you have, so you are never given exercises you cannot do at home."]),
            ("Between sessions, your plan is in your pocket", [
                "Your workout and nutrition plan live in the DB's Workouts app. Dean sends you a personal access link by email, so on the days you are not in a session you can open your plan and see exactly what to do."]),
            ("When your week changes", [
                "Busy weeks do not stay the same. Regular check-ins give you a chance to tell Dean what is working and what is not, and your plan is adjusted as you progress or as your schedule changes. [See how online personal training works](/online-personal-training)."]),
            _COST, _GET_STARTED,
        ],
        "faqs": [
            ("How long is each online session?", "Each session is 45 minutes, one to one with Dean."),
            ("Can I train in the mornings or evenings?", "Tell Dean the days and times that suit you when you book your free consultation call, and he will confirm what is available."),
            ("What if my week changes?", "Let Dean know as early as you can. Your plan is reviewed at your check-ins, so it can change as your schedule changes."),
            ("Do I need to go to a gym?", "No. You can train at home. Tell Dean what equipment you have and the plan is built around it."),
            _Q_PRICE, _Q_BOOK,
        ],
    },
    {
        "slug": "online-personal-training-for-women",
        "crumb": "Online Training for Women",
        "title": "Online Personal Training for Women | DB's Workouts",
        "desc": "Online personal training for women: 1-to-1 sessions with REPs Level 3 trainer Dean Burt, £30 for 45 minutes, plus a workout and nutrition plan. Free consultation.",
        "kicker": "ONLINE PERSONAL TRAINING · WOMEN",
        "h1": "Online Personal Training for Women",
        "lead": "Private, one-to-one coaching from home. A plan written around your goals and your fitness level, with a nutrition plan and regular check-ins, and no gym floor to walk onto.",
        "quick": "Online personal training for women with DB's Workouts is one-to-one coaching with Dean Burt, a REPs Level 3 trainer, from home or wherever you have space. Sessions are 45 minutes and cost £30, with a workout and nutrition plan in the DB's Workouts app. If you would prefer a female trainer in person, Jasmin trains clients in East London.",
        "photo": _PHOTO, "area": _UK,
        "sections": [
            ("Train privately, at home, on your terms", [
                "Plenty of women prefer to start training away from a busy gym, and online personal training lets you do that. Sessions are one to one, at home or wherever you have space, so there is nobody to compare yourself with and no equipment to queue for."]),
            ("A plan for your goals", [
                "Whether you want to lose weight, get stronger, feel fitter or build a routine you can keep, your plan is written around your goals, your fitness level and any limitations. Tell Dean about any injuries or health concerns on your free consultation call, and speak to your GP first if something worries you."]),
            ("Workout and nutrition plan in the app", [
                "Every online client is set up in the DB's Workouts app with a personalised workout plan and nutrition plan. Dean sends you a personal access link by email, and checks in with you regularly so the plan changes as you do."]),
            ("If you would prefer a female trainer", [
                "Online sessions at DB's Workouts are with Dean Burt. If you would rather train in person with a woman, DB's Workouts also has a female personal trainer, Jasmin, who is Level 3 qualified and fully insured and trains clients one to one across East London. See the [female personal trainer page](/female-personal-trainer-east-london)."]),
            _COST, _GET_STARTED,
        ],
        "faqs": [
            ("Do I need to be fit to start online personal training?", "No. Dean starts with a free consultation call to understand your goals, fitness history and any limitations, then builds the training at a level that works for you."),
            ("Can I train with a female online trainer?", "Online sessions are with Dean Burt. If you would prefer to train in person with a woman in East London, Jasmin is a female personal trainer at DB's Workouts, Level 3 qualified and fully insured."),
            ("Will I get a nutrition plan?", "Yes. Your personalised nutrition plan is in the DB's Workouts app alongside your workout plan. It is practical guidance, not medical advice."),
            ("Do I need a gym membership?", "No. Tell Dean what equipment you have access to, whether that is a few dumbbells or just your bodyweight, and the plan is built around it."),
            _Q_PRICE, _Q_GUARANTEE,
        ],
    },
    {
        "slug": "online-personal-training-for-men",
        "crumb": "Online Training for Men",
        "title": "Online Personal Training for Men | DB's Workouts",
        "desc": "Online personal training for men: 1-to-1 sessions with REPs Level 3 trainer Dean Burt, £30 for 45 minutes, plus a workout and nutrition plan. Free consultation.",
        "kicker": "ONLINE PERSONAL TRAINING · MEN",
        "h1": "Online Personal Training for Men",
        "lead": "Put structure behind your training. One-to-one coaching, a workout and nutrition plan written for you, and regular check-ins so you can see your progress.",
        "quick": "Online personal training for men with DB's Workouts is one-to-one coaching with Dean Burt, a REPs Level 3 trainer. Sessions are 45 minutes and cost £30, with a workout and nutrition plan in the DB's Workouts app and regular check-ins, whether you train at home or in a gym.",
        "photo": _PHOTO, "area": _UK,
        "sections": [
            ("Structure when you train on your own", [
                "Many men train hard but without a plan, so the effort goes into whatever feels right on the day. A personal trainer gives you a plan with a purpose, and online coaching gives you that without needing to book a trainer into a gym slot."]),
            ("Strength, fat loss or getting back into it", [
                "Your plan is built around your goal, whether that is getting stronger, losing weight, building a routine again after a break or simply feeling fitter. Dean asks about your training history, your schedule and any injuries before he writes anything. See also the [online strength training coach page](/online-strength-training-coach)."]),
            ("Progress you can see", [
                "Regular check-ins mean your plan does not stay the same once it stops working. You tell Dean how training is going, and your workouts and nutrition plan in the DB's Workouts app are adjusted as you progress."]),
            ("At home or in a gym", [
                "You do not need a gym membership, but you can use one. Tell Dean where you will be training and what equipment is available, and your plan is written around it. [Read about training at home](/online-personal-training-at-home)."]),
            _COST, _GET_STARTED,
        ],
        "faqs": [
            ("Can I do online personal training if I already train?", "Yes. Dean asks about your training history and builds the plan from where you are now, so it is not a beginner programme unless you are a beginner."),
            ("Do I need a gym membership?", "No. Dean plans around the equipment you have, whether that is a full gym, a few dumbbells or just your bodyweight."),
            ("Is it a class or one to one?", "It is one to one. Every session is just you and Dean, with no group classes."),
            ("Will my plan change as I progress?", "Yes. Your plan is reviewed at regular check-ins and adjusted as you progress."),
            _Q_PRICE, _Q_BOOK,
        ],
    },
    {
        "slug": "online-personal-training-for-gym-members",
        "crumb": "Online Training for Gym Members",
        "title": "Online Personal Training for Gym Members | DB's Workouts",
        "desc": "Already pay for a gym? Online personal training with REPs Level 3 trainer Dean Burt gives you a plan for the gym you have: 1-to-1 sessions, £30 for 45 minutes.",
        "kicker": "ONLINE PERSONAL TRAINING · GYM MEMBERS",
        "h1": "Online Personal Training for Gym Members",
        "lead": "You already pay for the gym. Add a trainer who writes the plan, checks in on your progress and keeps you accountable, without paying for a trainer on the gym floor.",
        "quick": "Online personal training for gym members with DB's Workouts means Dean Burt, a REPs Level 3 trainer, plans your training around the gym you already use. Sessions are 45 minutes, one to one, and cost £30, with a workout and nutrition plan in the DB's Workouts app and regular check-ins.",
        "photo": _PHOTO, "area": _UK,
        "sections": [
            ("Keep your membership, add a plan", [
                "A gym membership gives you the equipment. It does not give you a plan, someone to check your progress or someone who notices when you have stalled. Online personal training adds those, and you keep the membership you already pay for."]),
            ("A plan written for your gym", [
                "Tell Dean which equipment your gym has, what you like using and what you avoid, and your plan is written around it. Your workouts and nutrition plan are in the DB's Workouts app, so you can open them at the gym or at home."]),
            ("Accountability between sessions", [
                "Regular check-ins give you someone to report to, and Dean adjusts your plan as you progress. If a machine is always taken or your week gets in the way, say so, and the plan changes."]),
            ("Not sure what to do when you get there?", [
                "Many people walk into a gym unsure what to do first. A plan with the exercises, order and goal already decided takes that away. See the [online personal training for beginners page](/online-personal-training-for-beginners) if you are newer to training."]),
            _COST, _GET_STARTED,
        ],
        "faqs": [
            ("Do I need to cancel my gym membership?", "No. Online personal training works alongside the gym you already use. Dean writes your plan around the equipment your gym has."),
            ("Do I train at the gym during the online session?", "Tell Dean where you will be training and how you would like the sessions to work, and he will plan it with you on your free consultation call."),
            ("Can I use the plan at home as well?", "Yes. Your plan is in the DB's Workouts app, and Dean can write it for the gym, for home or for a mix of both."),
            ("Is it one to one?", "Yes. Every session is just you and Dean, with no group classes."),
            _Q_PRICE, _Q_BOOK,
        ],
    },
    {
        "slug": "online-vs-in-person-personal-training",
        "crumb": "Online vs In-Person Training",
        "title": "Online vs In-Person Personal Training | DB's Workouts",
        "desc": "Online or in-person personal training? Compare price, convenience and coaching with DB's Workouts: online from £30 for 45 minutes, outdoor East London from £50.",
        "kicker": "ONLINE VS IN-PERSON PERSONAL TRAINING",
        "h1": "Online vs In-Person Personal Training: Which Is Right for You?",
        "lead": "Both are one-to-one coaching with Dean Burt. The difference is where you train, what it costs and how you like to be coached. Here is an honest comparison.",
        "quick": "With DB's Workouts, online personal training is £30 for a 45-minute session from wherever you are, and in-person outdoor training in East London is £50 for a 60-minute session, or £45 a session on a block of 10. Online suits distance and busy schedules. In person suits people in East London who want Dean beside them.",
        "photo": _PHOTO, "area": _UK,
        "sections": [
            ("The main differences", [
                "__LIST__:Online: 45-minute 1-to-1 sessions at £30, anywhere in the UK, with a workout and nutrition plan in the app and regular check-ins|In person: 60-minute 1-to-1 outdoor sessions in East London parks or home gardens at £50 pay as you go, or £45 a session on a block of 10|Online: you use the equipment you have, and Dean plans around it|In person: equipment is provided|Pay-as-you-go outdoor sessions do not include the app plans. Online sessions, and outdoor session blocks, do"]),
            ("When online personal training suits you", [
                "Online suits you if you live outside East London, want to train privately at home, have a schedule where travel is the problem, or want one-to-one coaching at a lower cost per session. You need an internet connection, a device and somewhere to train. [See how online training works](/online-personal-training)."]),
            ("When in-person training suits you", [
                "In-person training suits you if you live or work in East London and would rather have your trainer beside you, like training outdoors, or prefer not to rely on a screen. Sessions take place in local parks or your home garden. [Explore outdoor personal training](/mobile-personal-trainer-east-london)."]),
            ("Which costs less?", [
                "Per session, online is lower: £30 for 45 minutes against £50 for 60 minutes outdoors pay as you go. On a block of 10 outdoor sessions the price is £450, which is £45 a session. See the full [pricing page](/pricing)."]),
            ("Not sure? Ask on the free call", [
                "Tell Dean where you live, what you want from training and how you like to be coached on your free consultation call, and he will tell you which option fits. You can ask whether combining the two would work for you. [Book a free consultation call](/contact)."]),
        ],
        "faqs": [
            ("Is online personal training as good as in person?", "Both are one-to-one coaching with Dean. Online has the same personal attention through video, with your plan in the app. In person has Dean beside you. Which is better depends on where you live and how you like to train."),
            ("Which is cheaper per session?", "Online is £30 for a 45-minute session. Outdoor pay as you go is £50 for a 60-minute session, and £45 a session on a block of 10 (£450)."),
            ("Can I do online training if I live outside East London?", "Yes. Online personal training is available wherever you are, with an internet connection and somewhere to train."),
            ("Can I combine online and in-person sessions?", "Ask Dean on your free consultation call whether a mix would work for you."),
            _Q_BOOK,
        ],
    },
    {
        "slug": "is-online-personal-training-worth-it",
        "crumb": "Is Online Personal Training Worth It?",
        "title": "Is Online Personal Training Worth It? | DB's Workouts",
        "desc": "Is online personal training worth the money? An honest look at when it works, when it does not, and what £30 a session with Dean Burt includes.",
        "kicker": "ONLINE PERSONAL TRAINING · IS IT WORTH IT?",
        "h1": "Is Online Personal Training Worth It?",
        "lead": "It depends on what you want from it. Here is when online personal training tends to be worth the money, when it may not be, and what you pay for.",
        "quick": "Online personal training is worth it if you want a plan, accountability and a qualified coach, and you can train without someone beside you. It may not suit you if you want a hands-on trainer or a group atmosphere. With DB's Workouts it is £30 a session, and no results are guaranteed.",
        "photo": _PHOTO, "area": _UK,
        "sections": [
            ("When online personal training is worth it", [
                "It is usually worth it if you have tried training alone and drifted, if you are not sure what to do or in what order, if travel to a trainer is the barrier, or if you want regular accountability from a qualified person. One-to-one coaching means the plan is built around you and not around a group."]),
            ("When it may not be", [
                "It may not suit you if you want a trainer physically beside you, if you need the energy of a group class, or if you will not follow a plan without someone standing next to you. In that case in-person training may be a better fit. [Compare online and in-person training](/online-vs-in-person-personal-training)."]),
            ("What you pay for", [
                "__LIST__:45-minute 1-to-1 online sessions with Dean Burt, a REPs Level 3 trainer|A personalised workout plan and nutrition plan in the DB's Workouts app|Regular check-ins, so your plan changes as you progress|A free consultation call before you start",
                "Sessions are £30 each. Four sessions, one a week for a month, are £120."]),
            ("What affects your results", [
                "Your plan matters, but so does what you do between sessions: how consistently you follow it, your eating and your daily habits. No trainer can guarantee a result, and Dean does not. What he does is set realistic goals, track your progress and adjust the plan when something is not working."]),
            ("How to decide", [
                "The free consultation call is there so you can decide with no commitment. Talk through your goals and what you have tried, ask anything you like, and then decide whether it is worth it for you. [Book a free consultation call](/contact)."]),
        ],
        "faqs": [
            ("Is online personal training worth the money?", "It can be if you want a plan, accountability and a qualified coach. It may not be if you want a trainer beside you or a group class. The free consultation call helps you decide."),
            ("Is online personal training better than an app?", "An app gives you a plan. With DB's Workouts the coaching comes from Dean in one-to-one sessions, and the app is where your workout and nutrition plan live."),
            ("How much does it cost?", "£30 per 45-minute session, including your workout and nutrition plan in the app and regular check-ins."),
            _Q_GUARANTEE, _Q_BOOK,
        ],
    },
    {
        "slug": "what-to-expect-from-online-personal-training",
        "crumb": "What to Expect Online",
        "title": "What to Expect From Online Personal Training | DB's Workouts",
        "desc": "New to online personal training? Here is what happens from the free consultation call to your first 45-minute 1-to-1 session with Dean Burt, and what you need.",
        "kicker": "ONLINE PERSONAL TRAINING · WHAT TO EXPECT",
        "h1": "What to Expect From Online Personal Training",
        "lead": "From the first conversation to your first session: what happens, what you need and what comes after.",
        "quick": "Online personal training with DB's Workouts starts with a free consultation call, then Dean Burt sets you up in the DB's Workouts app with a personal link sent by email. You train in 45-minute one-to-one sessions that cost £30 each, and regular check-ins keep your plan on track.",
        "photo": _PHOTO, "area": _UK,
        "sections": [
            ("Step 1: the free consultation call", [
                "You talk through your goals, your fitness history, how much time you have and anything you are worried about, such as injuries. There is no commitment, and it is a good time to ask Dean anything. If something worries you, speak to your GP or a physiotherapist and tell Dean."]),
            ("Step 2: you are set up in the app", [
                "Dean writes your workout plan and nutrition plan in the DB's Workouts app and sends you a personal access link by email. This is where you will find your plan between sessions."]),
            ("What you need", [
                "__LIST__:A device with an internet connection for your session|Somewhere to train, with enough space to move|Any equipment you have, even if that is only a pair of dumbbells or your bodyweight|Comfortable clothes and trainers"]),
            ("Your sessions", [
                "Each session is 45 minutes and just you and Dean, with no group. It is built around the goals and information you gave on your consultation call, and Dean talks you through the training and coaches how you move."]),
            ("After the first session", [
                "Regular check-ins give you the chance to say how training is going, and your plan is adjusted as you progress. Sessions are £30 each. [See how online personal training works](/online-personal-training)."]),
        ],
        "faqs": [
            ("What happens on the free consultation call?", "You talk through your goals, fitness history and any limitations with Dean. There is no commitment."),
            ("What do I need for an online session?", "A device with an internet connection, somewhere to train and any equipment you have. You do not need a gym membership."),
            ("How long is a session?", "Each online session is 45 minutes, one to one with Dean."),
            ("How do I get my plan?", "Dean sends you a personal access link by email to the DB's Workouts app, where your workout and nutrition plan live."),
            _Q_PRICE, _Q_BOOK,
        ],
    },
    {
        "slug": "online-personal-trainer-near-me",
        "crumb": "Online Personal Trainer Near Me",
        "title": "Online Personal Trainer Near Me | DB's Workouts",
        "desc": "An online personal trainer is near you wherever you are: 1-to-1 sessions with REPs Level 3 trainer Dean Burt, £30 for 45 minutes. Train in person in East London too.",
        "kicker": "ONLINE PERSONAL TRAINER · NEAR ME",
        "h1": "Online Personal Trainer Near Me",
        "lead": "With online personal training, your trainer is as near as your phone or laptop. One-to-one coaching from wherever you live, and in person too if you are in East London.",
        "quick": "An online personal trainer is near you wherever you have an internet connection. Dean Burt of DB's Workouts offers 45-minute one-to-one online sessions for £30 anywhere in the UK, with a workout and nutrition plan in the app. If you live in East London you can also train with him in person outdoors.",
        "photo": _PHOTO, "area": _UK,
        "sections": [
            ("Near you means wherever you are", [
                "You do not need a trainer who lives down the road to get one-to-one coaching. Online sessions run over video, so what matters is that you have an internet connection and somewhere to train. Dean coaches clients online across the UK."]),
            ("What you get", [
                "__INCLUDES__"]),
            ("Prefer someone in person? East London", [
                "If you live in East London you can train with Dean in person outdoors, in a local park or your home garden, from £50 a session. Dean covers areas from Stratford and Hackney to Ilford, Walthamstow and Romford. See [personal training in East London](/personal-trainer-east-london-areas) and the [pricing page](/pricing)."]),
            ("Which is right for you?", [
                "Online suits people who live further away, train at home or have a schedule where travel is the problem. In person suits people in East London who want their trainer beside them. [Compare online and in-person training](/online-vs-in-person-personal-training)."]),
            _GET_STARTED,
        ],
        "faqs": [
            ("Can I get an online personal trainer wherever I live?", "Yes. Online personal training with DB's Workouts is available wherever you are in the UK, as long as you have an internet connection and somewhere to train."),
            ("Do I need to live near East London?", "No. Online sessions run over video. You only need to live in East London if you want in-person outdoor sessions."),
            _Q_PRICE,
            ("Is it one to one?", "Yes. Every session is just you and Dean, with no group classes."),
            _Q_BOOK,
        ],
    },
]
PAGES += EXTRA

PAGES_BY_SLUG = {p["slug"]: p for p in PAGES}

HUB_PAGE = {
    "slug": HUB,
    "crumb": "Online Personal Training",
    "title": "Online Personal Training | £30 Sessions | DB's Workouts",
    "desc": "Online 1-to-1 personal training with Dean Burt: 45-minute sessions for £30, plus a workout and nutrition plan in the DB's Workouts app and regular check-ins. Free consultation call.",
    "kicker": "ONLINE 1-TO-1 · WITH DEAN BURT",
    "h1": "Online Personal Training",
    "lead": "One-to-one coaching in 45-minute online sessions, with a personalised workout and nutrition plan in the DB's Workouts app and regular check-ins. Train wherever you are, for £30 a session.",
    "quick": "Online personal training with DB's Workouts is 1-to-1 coaching with Dean Burt, a REPs Level 3 personal trainer. Sessions are 45 minutes and cost £30, and include a personalised workout and nutrition plan in the DB's Workouts app and regular check-ins.",
    "photo": ("50% 18%", "DB'S WORKOUTS · ONLINE COACHING", "Your coach. Your plan. Wherever you are."),
    "area": {"@type": "Country", "name": "United Kingdom"},
    "faqs": [
        ("How much does online personal training cost?", "Online 1-to-1 personal training costs £30 per 45-minute session. Your workout and nutrition plan in the DB's Workouts app and your regular check-ins are included."),
        ("Is online training a class or one-to-one?", "It is one-to-one. Every session is just you and Dean, so the session is built around your goals, your fitness level and the equipment you have, with no group classes."),
        ("What is included with online personal training?", "You get 45-minute 1-to-1 online sessions with Dean Burt, a personalised workout plan and nutrition plan in the DB's Workouts app, and regular check-ins to keep you on track."),
        ("How do I get my workout and nutrition plan?", "Dean sets you up in the DB's Workouts app and sends you a personal access link by email. Your workout and nutrition plan live there, so you can follow them between sessions."),
        ("Do I need a gym membership or equipment?", "No gym membership is required. Tell Dean what equipment you have access to, whether that is a full gym, a few dumbbells or just your bodyweight, and he will build the plan around it."),
        ("Can beginners do online personal training?", "Yes. Dean starts with a free consultation call to understand your goals, fitness history and any limitations, then builds the training at a level that works for you."),
        ("Do you guarantee results?", "No. Results depend on your starting point, consistency and habits between sessions. Dean helps you set realistic goals and tracks your progress with regular check-ins."),
        ("How do I book online personal training?", "Book a free consultation call through the contact page or message Dean on WhatsApp on 07752 300937. You can talk through your goals before you start."),
    ],
}

PRICE_CARDS = (
    '<div class="seo-prices"><article><p class="seo-kicker">TRAIN ONLINE</p><h3>Online 1-to-1 session</h3>'
    '<p class="seo-price">£30<span> / 45-min session</span></p>'
    '<p>Includes your workout and nutrition plan in the app and regular check-ins.</p>'
    '<a href="/contact" class="seo-text-link">Book a free consultation call ↗</a></article>'
    '<article><p class="seo-kicker">PREFER IN PERSON?</p><h3>Outdoor pay as you go</h3>'
    '<p class="seo-price">£50<span> / 60-min session</span></p>'
    '<p>One-to-one coaching in an East London park or home garden.</p>'
    '<a href="/mobile-personal-trainer-east-london" class="seo-text-link">Explore outdoor training ↗</a></article>'
    '<article><p class="seo-kicker">BUILD YOUR ROUTINE</p><h3>Outdoor 10-session block</h3>'
    '<p class="seo-price">£450<span> / block</span></p>'
    '<p>£45 per session. Includes app nutrition and workout plans.</p>'
    '<a href="/pricing" class="seo-text-link">Compare all packages ↗</a></article></div>'
)

# ------------------------------------------------------------- rendering
TEMPLATE = (ROOT / "weight-loss-personal-trainer-east-london.html").read_text(encoding="utf-8")


def text(t):
    """Escape text and turn [label](/path) into links."""
    t = escape(t, quote=True)
    return re.sub(r"\[([^\]]+)\]\((/[^)]*)\)", r'<a href="\2">\1</a>', t)


def render_section(heading, paras):
    out = [f"<h2>{escape(heading)}</h2>"]
    for para in paras:
        if para == "__INCLUDES__":
            out.append("<ul>" + "".join(f"<li>{escape(i)}</li>" for i in INCLUDES) + "</ul>")
        elif para.startswith("__LIST__:"):
            out.append("<ul>" + "".join(f"<li>{escape(i)}</li>" for i in para[9:].split("|")) + "</ul>")
        else:
            out.append(f"<p>{text(para)}</p>")
    return '<section class="seo-section">' + "\n".join(out) + "</section>"


# Each page links to the hub plus five closely related pages, not all of them
RELATED = {
    "online-personal-trainer-uk": ["online-personal-trainer-near-me", "online-personal-trainer-london", "online-personal-trainer-cost-uk", "online-vs-in-person-personal-training", "what-to-expect-from-online-personal-training"],
    "online-personal-trainer-london": ["online-personal-trainer-uk", "online-personal-trainer-near-me", "online-personal-trainer-cost-uk", "online-vs-in-person-personal-training", "online-personal-training-at-home"],
    "online-weight-loss-personal-training": ["online-personal-training-with-nutrition-plan", "online-personal-training-for-beginners", "online-personal-training-for-women", "online-personal-trainer-cost-uk", "is-online-personal-training-worth-it"],
    "online-personal-training-for-beginners": ["what-to-expect-from-online-personal-training", "online-personal-training-for-women", "online-personal-training-at-home", "online-personal-training-for-busy-people", "online-personal-trainer-cost-uk"],
    "online-personal-training-at-home": ["online-strength-training-coach", "online-personal-training-for-busy-people", "online-personal-training-for-women", "online-personal-training-for-men", "online-vs-in-person-personal-training"],
    "online-strength-training-coach": ["online-personal-training-for-men", "online-personal-training-for-gym-members", "online-personal-training-at-home", "online-personal-training-with-nutrition-plan", "online-personal-trainer-cost-uk"],
    "online-personal-training-with-nutrition-plan": ["online-weight-loss-personal-training", "online-personal-trainer-cost-uk", "online-strength-training-coach", "online-personal-training-for-women", "is-online-personal-training-worth-it"],
    "online-personal-trainer-cost-uk": ["online-vs-in-person-personal-training", "is-online-personal-training-worth-it", "what-to-expect-from-online-personal-training", "online-personal-trainer-uk", "online-weight-loss-personal-training"],
    "online-personal-training-for-busy-people": ["online-personal-training-at-home", "online-personal-training-for-beginners", "online-personal-training-for-women", "online-personal-training-for-men", "online-personal-trainer-cost-uk"],
    "online-personal-training-for-women": ["online-personal-training-for-beginners", "online-weight-loss-personal-training", "online-personal-training-for-busy-people", "online-personal-training-at-home", "what-to-expect-from-online-personal-training"],
    "online-personal-training-for-men": ["online-strength-training-coach", "online-personal-training-for-gym-members", "online-personal-training-at-home", "online-personal-training-for-busy-people", "is-online-personal-training-worth-it"],
    "online-personal-training-for-gym-members": ["online-strength-training-coach", "online-personal-training-for-men", "online-personal-training-for-beginners", "online-vs-in-person-personal-training", "online-personal-trainer-cost-uk"],
    "online-vs-in-person-personal-training": ["is-online-personal-training-worth-it", "online-personal-trainer-cost-uk", "online-personal-trainer-near-me", "online-personal-trainer-uk", "online-personal-training-at-home"],
    "is-online-personal-training-worth-it": ["online-vs-in-person-personal-training", "online-personal-trainer-cost-uk", "what-to-expect-from-online-personal-training", "online-personal-training-for-beginners", "online-weight-loss-personal-training"],
    "what-to-expect-from-online-personal-training": ["online-personal-training-for-beginners", "online-personal-trainer-cost-uk", "online-personal-trainer-uk", "online-personal-training-at-home", "is-online-personal-training-worth-it"],
    "online-personal-trainer-near-me": ["online-personal-trainer-uk", "online-personal-trainer-london", "online-vs-in-person-personal-training", "online-personal-trainer-cost-uk", "what-to-expect-from-online-personal-training"],
}


def _pill(slug, name, current=None):
    cur = ' aria-current="page"' if slug == current else ""
    return f'<a class="area-pill" href="/{slug}"{cur}>{escape(name)}</a>'


def related_pills(current):
    names = {p["slug"]: p["crumb"] for p in PAGES}
    items = [(HUB, "Online Personal Training")] + [(s, names[s]) for s in RELATED.get(current, []) if s in names]
    return "\n".join(_pill(s, n, current) for s, n in items)


def hub_guide_pills():
    """Hub: a short list on show, the rest behind a Show all button."""
    shown = ["online-personal-trainer-uk", "online-personal-training-for-beginners", "online-weight-loss-personal-training",
             "online-personal-training-for-women", "online-personal-training-for-men", "online-personal-trainer-cost-uk"]
    names = {p["slug"]: p["crumb"] for p in PAGES}
    rest = [p["slug"] for p in PAGES if p["slug"] not in shown]
    top = "".join(_pill(s, names[s]) for s in shown)
    more = "".join(_pill(s, names[s]) for s in rest)
    return (f'<div class="areas-grid">{top}</div><details class="more-guides"><summary>Show all online guides</summary>'
            f'<div class="areas-grid">{more}</div></details>')


def explore_pills():
    base = [("boxing-fitness-east-london", "Boxing Fitness"), ("weight-loss-personal-trainer-east-london", "Weight Loss Coaching"),
            ("personal-training-for-beginners-east-london", "Beginner Personal Training"),
            ("mobile-personal-trainer-east-london", "Mobile Personal Training"), ("pair-personal-training-east-london", "Pair Personal Training")]
    return "\n".join(f'<a class="area-pill" href="/{s}">{escape(n)}</a>' for s, n in base)


def schema_for(page, hub=False):
    url = f"{DOMAIN}/{page['slug']}"
    desc = page["desc"]
    offer = {"@type": "Offer", "price": "30.00", "priceCurrency": "GBP", "url": url,
             "priceSpecification": {"@type": "UnitPriceSpecification", "price": "30.00", "priceCurrency": "GBP", "unitText": "45-minute session"}}
    graph = [
        {"@type": "WebPage", "@id": url + "#webpage", "url": url, "name": page["title"], "description": desc, "inLanguage": "en-GB",
         "isPartOf": {"@id": DOMAIN + "/#website"}, "about": {"@id": url + "#service"}, "dateModified": TODAY,
         "speakable": {"@type": "SpeakableSpecification", "cssSelector": [".seo-quick", "h1"]}},
        {"@type": "Service", "@id": url + "#service", "name": "Online 1-to-1 Personal Training", "serviceType": "Online personal training",
         "description": desc, "url": url, "areaServed": page["area"],
         "provider": {"@type": "LocalBusiness", "@id": DOMAIN + "/#business", "name": "DB's Workouts", "url": DOMAIN + "/"},
         "availableChannel": {"@type": "ServiceChannel", "serviceType": "Online"}, "offers": offer},
        {"@type": "BreadcrumbList", "itemListElement": (
            [{"@type": "ListItem", "position": 1, "name": "Home", "item": DOMAIN + "/"},
             {"@type": "ListItem", "position": 2, "name": "Online Personal Training", "item": f"{DOMAIN}/{HUB}"}]
            + ([] if hub else [{"@type": "ListItem", "position": 3, "name": page["crumb"], "item": url}]))},
        {"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": re.sub(r"\[([^\]]+)\]\(/[^)]*\)", r"\1", a)}} for q, a in page["faqs"]]},
    ]
    if hub:
        graph.append({"@type": "VideoObject", "@id": url + "#video", "name": "Online personal training client testimonial | DB's Workouts",
                      "description": "A video testimonial from a DB's Workouts online personal training client. Online 1-to-1 training with Dean Burt: 45-minute sessions, a workout and nutrition plan in the app and regular check-ins.",
                      "thumbnailUrl": DOMAIN + "/pics/optimized/online-training-poster.webp", "uploadDate": "2026-10-28T09:00:00+00:00", "duration": "PT55S",
                      "contentUrl": DOMAIN + "/pics/online-training.mp4", "embedUrl": f"https://www.youtube.com/embed/{YOUTUBE_ID}", "publisher": {"@id": DOMAIN + "/#business"}})
        graph.append({"@type": "HowTo", "name": "How online personal training with DB's Workouts works", "totalTime": "PT10M",
                      "step": [{"@type": "HowToStep", "position": 1, "name": "Book a free consultation call", "text": "Talk through your goals, fitness history and any limitations with Dean."},
                               {"@type": "HowToStep", "position": 2, "name": "Get set up in the app", "text": "Dean sends you a personal access link by email to the DB's Workouts app, where your workout and nutrition plan live."},
                               {"@type": "HowToStep", "position": 3, "name": "Train and check in", "text": "Train in 45-minute 1-to-1 online sessions and check in regularly so your plan keeps adapting."}]})
    return {"@context": "https://schema.org", "@graph": graph}


LIST_CSS = """<style>
.seo-section>ul{list-style:none;margin:18px 0 0;padding:0;max-width:62ch}
.seo-section>ul li{position:relative;padding:12px 0 12px 26px;border-top:1px solid var(--border-h);color:var(--text-dim);font-size:14px;line-height:1.6}
.seo-section>ul li:last-child{border-bottom:1px solid var(--border-h)}
.seo-section>ul li::before{content:'→';position:absolute;left:0;top:12px;color:var(--seo-accent,#e0364c);font-weight:700}
.seo-section>p+ul{margin-top:20px}
.seo-session>div>ul{list-style:none;margin:18px 0 0;padding:0}
.seo-session>div>ul li{position:relative;padding:12px 0 12px 26px;border-top:1px solid var(--border-h);color:var(--text-dim);font-size:14px;line-height:1.6}
.seo-session>div>ul li:last-child{border-bottom:1px solid var(--border-h)}
.seo-session>div>ul li::before{content:'→';position:absolute;left:0;top:12px;color:var(--seo-accent,#e0364c);font-weight:700}
.seo-session>div>p+ul{margin-top:20px}
.seo-session figure.guide-figure img{width:100%;height:auto}
.seo-session figure.guide-figure.tall img{width:auto;max-width:100%;height:auto;max-height:400px;margin-inline:auto}
.guide-page .seo-session>div>p:not(.seo-kicker),.guide-page .seo-session>div>ul li,.guide-page .seo-section>ul li{font-size:16px;line-height:1.8}
.guide-page .seo-quick p{font-size:15px;line-height:1.75}
.guide-page .seo-faq summary{font-size:15px}
.guide-page .seo-faq details p{font-size:15px;line-height:1.75}
.guide-page .seo-prices article p:not(.seo-price):not(.seo-kicker){font-size:14px;line-height:1.7}
.guide-page .seo-proof>div>p:not(.seo-kicker){font-size:15px;line-height:1.75}
.guide-page figcaption{font-size:13px}
.seo-section .area-pill{white-space:normal;overflow-wrap:anywhere}
.seo-section details.more-guides{margin-top:22px}
.seo-section details.more-guides summary{cursor:pointer;display:inline-block;padding:11px 18px;border:1px solid var(--border-h);border-radius:8px;font-size:14px;color:var(--text)}
.seo-section details.more-guides[open] summary{margin-bottom:6px}
</style>"""


def head_for(page, hub=False):
    url = f"{DOMAIN}/{page['slug']}"
    esc = lambda t: escape(t, quote=True)
    head = TEMPLATE.split("</head>", 1)[0]
    head = re.sub(r"<title>.*?</title>", f"<title>{esc(page['title'])}</title>", head, flags=re.S)
    head = re.sub(r'(<meta (?:name="(?:description|twitter:description)"|property="og:description") content=")[^"]*', lambda m: m[1] + esc(page["desc"]), head)
    head = re.sub(r'(<meta (?:name="twitter:title"|property="og:title") content=")[^"]*', lambda m: m[1] + esc(page["title"]), head)
    head = head.replace(f"{DOMAIN}/weight-loss-personal-trainer-east-london", url)
    head = re.sub(r'<script type="application/ld\+json">.*?</script>', "", head, flags=re.S)
    if 'rel="alternate" hreflang' not in head:
        head = head.replace('<link rel="canonical"', f'<link rel="alternate" hreflang="en-GB" href="{url}">\n  <link rel="canonical"', 1)
    if 'name="geo.position"' not in head:
        head = head.replace('<meta name="geo.placename"', '<meta name="geo.position" content="51.5375;0.0058">\n  <meta name="ICBM" content="51.5375, 0.0058">\n  <meta name="geo.placename"', 1)
    head = head.replace('<meta name="robots" content="index, follow">', '<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">')
    return head + '\n' + LIST_CSS + '\n<script type="application/ld+json">' + json.dumps(schema_for(page, hub), ensure_ascii=False) + "</script>\n</head>"


MODAL = (ROOT / "online_video_modal.html").read_text(encoding="utf-8") if (ROOT / "online_video_modal.html").exists() else ""


def common_top(page, hub=False):
    pos, cap_k, cap_s = page["photo"]
    btn = '<a class="db-btn db-btn-primary" href="/contact">Book a free consultation call <span aria-hidden="true">↗</span></a>'
    note = "Just you and Dean · Not a group class · Free consultation call"
    return f'''<main id="main-content" class="seo-page guide-page">
<section class="seo-hero"><div class="seo-wrap seo-hero-grid">
<div><p class="seo-kicker">{escape(page["kicker"])}</p><h1>{escape(page["h1"])}</h1>
<p class="seo-lead">{text(page["lead"])}</p>
<div class="seo-actions">{btn}<a class="seo-text-link" href="#overview">Read more <span aria-hidden="true">↓</span></a></div>
<p class="seo-note">{note}</p></div>
<figure class="seo-hero-photo"><img src="/pics/optimized/dean-portrait.webp" alt="Dean Burt, REPs Level 3 personal trainer at DB’s Workouts" width="599" height="800" fetchpriority="high" decoding="async" style="object-position:{pos}"><figcaption><span>{escape(cap_k)}</span><strong>{escape(cap_s)}</strong></figcaption></figure>
</div></section>
<div class="seo-trust"><div class="seo-wrap"><a href="/testimonials"><b>5.0 ★★★★★</b><span>70 Google reviews</span></a><span><b>£30 a session</b>45-minute 1-to-1 online</span><span><b>Plans in the app</b>Workout and nutrition, with check-ins</span><span><b>Free consultation call</b>A conversation with Dean</span></div></div>
<div class="seo-wrap seo-content" id="overview"><aside class="seo-quick"><h2>Quick answer</h2><p>{text(page["quick"])}</p></aside>
'''


def faq_block(page):
    items = "\n".join(f"<details><summary>{escape(q)}<span aria-hidden=\"true\">+</span></summary><p>{text(a)}</p></details>" for q, a in page["faqs"])
    return f'<section class="seo-section seo-faq-section"><div class="seo-faq"><h2>Your questions answered</h2>{items}</div></section>'


def closing(slug, title_line, hub=False):
    btn = '<a class="db-btn db-btn-primary" href="/contact">Book a free consultation call <span aria-hidden="true">↗</span></a>'
    more = '' if hub else f'<section class="seo-section"><div class="info-block"><h2>More on online personal training</h2><div class="areas-grid">{related_pills(slug)}</div></div></section>'
    return (more +
            f'<section class="seo-section"><div class="info-block"><h2>Explore your training options</h2><div class="areas-grid">{explore_pills()}</div></div></section>'
            f'<section class="seo-final"><p class="seo-kicker">LET’S GET STARTED</p><h2>{title_line}</h2><p>Tell Dean what you want from training. Find your starting point together.</p>'
            f'<div class="seo-actions">{btn}<a class="seo-text-link" href="https://wa.me/447752300937">Message Dean on WhatsApp <span aria-hidden="true">↗</span></a></div>'
            f'<p class="seo-note">Free consultation call · No commitment · Personal advice</p></section></div></main>\n')


def pricing_section():
    return f'<section class="seo-section"><p class="seo-kicker">PRICING</p><h2>Simple, clear pricing.</h2>{PRICE_CARDS}</section>'


# ---- photos and video for the guide pages -------------------------------------
IMG = {
    "7853": ("training-7853", 640, 360, "A client training outdoors at sunrise"),
    "7856": ("training-7856", 640, 360, "Clients doing lunges in a park training session"),
    "7858": ("training-7858", 640, 360, "A one-to-one boxing padwork session in a park"),
    "7859": ("training-7859", 640, 360, "Two clients stretching on mats in a park"),
    "7860": ("training-7860", 640, 360, "A training group at an outdoor gym"),
    "7883": ("training-7883", 585, 329, "Clients doing sit-ups on mats in a park"),
    "7889": ("training-7889", 585, 329, "A client jogging during a park training session"),
    "7933": ("training-7933", 585, 329, "Clients doing side planks in a park"),
    "8096": ("training-8096", 640, 360, "Clients training with dumbbells in a park"),
    "dean": ("hero-dean", 585, 879, "Dean Burt coaching a client with boxing pads"),
    "jas1": ("jasmin-boxing-1", 900, 932, "Jasmin holding pads for a boxing fitness session in a gym"),
    "jas2": ("jasmin-boxing-2", 868, 1100, "One-to-one boxing padwork in a gym"),
}
CAPTION = "In-person training in East London. Online clients train from home or wherever they have space."
# One-to-one photos (a trainer with a single client) go beside coaching and plan sections;
# group photos only beside location and outdoor sections.
PAGE_IMAGES = {
    "online-personal-trainer-uk": ("7858", "7853"), "online-personal-trainer-london": ("7856", "7853"),
    "online-weight-loss-personal-training": ("7889", "7858"), "online-personal-training-for-beginners": ("7858", "7889"),
    "online-personal-training-at-home": ("7853", "7858"), "online-strength-training-coach": ("7858", "jas2"),
    "online-personal-training-with-nutrition-plan": ("7889", "7853"), "online-personal-trainer-cost-uk": ("7858", "7889"),
    "online-personal-training-for-busy-people": ("7853", "7889"), "online-personal-training-for-women": ("jas2", "jas1"),
    "online-personal-training-for-men": ("7858", "jas2"), "online-personal-training-for-gym-members": ("jas2", "jas1"),
    "online-vs-in-person-personal-training": ("7853", "7858"), "is-online-personal-training-worth-it": ("7889", "7853"),
    "what-to-expect-from-online-personal-training": ("7853", "7858"), "online-personal-trainer-near-me": ("7858", "7853"),
}


GYM_CAPTION = "A gym training session. Online clients can train at home or in any gym they use."


def figure(key):
    f, w, h, alt = IMG[key]
    cap = GYM_CAPTION if key.startswith("jas") else CAPTION
    tall = " tall" if h > w else ""
    return (f'<figure class="guide-figure{tall}"><img src="/pics/optimized/{f}.webp" alt="{escape(alt)}" width="{w}" height="{h}" loading="lazy" decoding="async">'
            f'<figcaption>{escape(cap)}</figcaption></figure>')


def split_section(heading, paras, key, image_first=False):
    inner = "".join([f"<h2>{escape(heading)}</h2>"] + [
        ("<ul>" + "".join(f"<li>{escape(i)}</li>" for i in (INCLUDES if para == "__INCLUDES__" else para[9:].split("|"))) + "</ul>")
        if (para == "__INCLUDES__" or para.startswith("__LIST__:")) else f"<p>{text(para)}</p>" for para in paras])
    parts = [f"<div>{inner}</div>", figure(key)]
    if image_first:
        parts.reverse()
    return '<section class="seo-section seo-session">' + "".join(parts) + "</section>"


def video_block():
    yt = f'<a class="seo-text-link" href="{YOUTUBE}" rel="noopener" target="_blank">Watch on YouTube <span aria-hidden="true">↗</span></a>'
    return ('<section class="seo-section seo-session"><div><p class="seo-kicker">CLIENT TESTIMONIAL</p><h2>Hear from an online client</h2>'
            f'<p>Press play to hear from a DB&#x27;s Workouts online personal training client, in their own words.</p>{yt}</div>'
            '<div><div class="vid-thumb" role="button" tabindex="0" aria-label="Play the online client testimonial video" '
            "onclick=\"openVid('/pics/online-training.mp4')\" onkeydown=\"if(event.key==='Enter'||event.key===' '){event.preventDefault();openVid('/pics/online-training.mp4')}\">"
            '<img src="/pics/optimized/online-training-poster.webp" alt="Video testimonial from a DB&#x27;s Workouts online personal training client" width="720" height="1282" loading="lazy" decoding="async">'
            '<div class="vid-play"><svg viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg></div><div class="vid-label"><span>Watch Video</span></div></div></div></section>')


def proof_block():
    return ('<section class="seo-proof seo-section"><div><p class="seo-kicker">YOUR COACH</p><h2>A real coach.<br>A plan that fits you.</h2>'
            "<p>Dean Burt is a REPs Level 3 certified personal trainer, qualified since 2019. Start with a free conversation about your goals, your experience and what you have available to train with.</p>"
            '<a class="seo-text-link" href="/about">Meet Dean <span aria-hidden="true">↗</span></a></div>'
            '<img src="/pics/optimized/hero-dean.webp" alt="Dean Burt coaching a client with boxing pads" width="585" height="879" loading="lazy" decoding="async">'
            '<blockquote><span class="seo-stars" aria-label="5 stars">★★★★★</span><p>“Dean genuinely cares about your progress. He checks in between sessions, adjusts your plan when needed, and celebrates every milestone.”</p>'
            '<cite>Laura J. · Google review</cite><a class="seo-text-link" href="/testimonials">More client stories <span aria-hidden="true">↗</span></a></blockquote></section>')


def build_cluster_page(page):
    keys = PAGE_IMAGES.get(page["slug"], ("7856", "8096"))
    secs = page["sections"]
    body = common_top(page)
    for i, (h, ps) in enumerate(secs):
        if i == 1:
            body += split_section(h, ps, keys[0])
        elif i == 3:
            body += split_section(h, ps, keys[1], image_first=True)
        else:
            body += render_section(h, ps)
        if i == 0:
            body += video_block()
    body += proof_block() + pricing_section() + faq_block(page)
    body += closing(page["slug"], "Ready to train online?<br>Start with a conversation.")
    return assemble(page, body, modal=True)


def build_hub():
    page = HUB_PAGE
    yt = f'<a class="seo-text-link" href="{YOUTUBE}" rel="noopener" target="_blank">Watch on YouTube <span aria-hidden="true">↗</span></a>'
    video = (f'<section class="seo-section seo-session"><div><p class="seo-kicker">CLIENT TESTIMONIAL</p><h2>Hear from an online client</h2>'
             f'<p>Press play to hear from a DB&#x27;s Workouts online personal training client, in their own words.</p>{yt}</div>'
             '<div><div class="vid-thumb" role="button" tabindex="0" aria-label="Play the online client testimonial video" '
             "onclick=\"openVid('/pics/online-training.mp4')\" onkeydown=\"if(event.key==='Enter'||event.key===' '){event.preventDefault();openVid('/pics/online-training.mp4')}\">"
             '<img src="/pics/optimized/online-training-poster.webp" alt="Video testimonial from a DB&#x27;s Workouts online personal training client" width="720" height="1282" loading="lazy" decoding="async">'
             '<div class="vid-play"><svg viewBox="0 0 24 24" fill="#fff"><path d="M8 5v14l11-7z"/></svg></div><div class="vid-label"><span>Watch Video</span></div></div></div></section>')
    included = ('<section class="seo-section seo-session"><div><h2>Personal training, without the travel</h2>'
                "<p>Online personal training gives you the same one-to-one attention as training in person, from wherever suits you. Each 45-minute session is just you and Dean, with exercises and pace chosen for your goals and fitness level. It is personal coaching, not a group class.</p>"
                "<p>Between sessions you follow your own workout and nutrition plan in the DB&#x27;s Workouts app, and regular check-ins keep you accountable and let Dean adjust the plan as you progress.</p></div>"
                '<div><ol class="seo-steps"><li><span>01</span><div><h3>1-to-1 online sessions</h3><p>45 minutes with Dean Burt, built around you.</p></div></li>'
                '<li><span>02</span><div><h3>Workout and nutrition plan</h3><p>Personalised plans in the DB&#x27;s Workouts app.</p></div></li>'
                '<li><span>03</span><div><h3>Regular check-ins</h3><p>Stay on track and keep your progress moving.</p></div></li></ol></div></section>')
    proof = ('<section class="seo-proof seo-section"><div><p class="seo-kicker">YOUR COACH</p><h2>A real coach.<br>A plan that fits you.</h2>'
             "<p>Dean Burt is a REPs Level 3 certified personal trainer, qualified since 2019. Start with a free conversation about your goals, your experience and what you have available to train with.</p>"
             '<a class="seo-text-link" href="/about">Meet Dean <span aria-hidden="true">↗</span></a></div>'
             '<img src="/pics/optimized/hero-dean.webp" alt="Dean Burt coaching a client with boxing pads" width="585" height="879" loading="lazy" decoding="async">'
             '<blockquote><span class="seo-stars" aria-label="5 stars">★★★★★</span><p>“Dean genuinely cares about your progress. He checks in between sessions, adjusts your plan when needed, and celebrates every milestone.”</p>'
             '<cite>Laura J. · Google review</cite><a class="seo-text-link" href="/testimonials">More client stories <span aria-hidden="true">↗</span></a></blockquote></section>')
    blocks = [
        ("How online personal training works", ["Start with a free consultation call. Dean talks through your goals, your fitness history and any limitations. He then sets you up in the DB's Workouts app, where your personalised workout and nutrition plan live, and sends you a personal access link by email. From there you train in 45-minute sessions and check in regularly, so your plan keeps adapting as you progress."]),
        ("Built around the equipment you have", ["You do not need a gym membership. Tell Dean what you can access, whether that is a full gym, a few dumbbells, resistance bands or just your bodyweight, and the training is planned around it. Online training also suits busy schedules, travel and anyone who lives outside East London."]),
        ("Your workout and nutrition plan in the app", ["Every online client is set up in the DB's Workouts app with a workout plan and a nutrition plan written for them. It is the place to follow your programme between sessions, with Dean checking in on how it is going. The app is where your plans live. The coaching itself comes from Dean."]),
    ]
    guides = ('<section class="seo-section"><h2>Online personal training guides</h2><p>Explore online training by goal and situation:</p>' + hub_guide_pills() + '</section>')
    body = common_top(page, hub=True) + included + proof + video
    body += "\n".join(render_section(h, ps) for h, ps in blocks)
    body += pricing_section() + faq_block(page) + guides
    body += closing(HUB, "Ready to train online?<br>Start with a conversation.", hub=True)
    return assemble(page, body, hub=True)


def assemble(page, body, hub=False, modal=False):
    nav = navigation("/" + page["slug"])
    footer = TEMPLATE[TEMPLATE.index("      <footer"):]
    return (head_for(page, hub) + '\n<body>\n<a class="seo-skip" href="#main-content">Skip to content</a>\n' + nav + "\n" + body + (MODAL if (hub or modal) else "") + footer)


def main():
    (ROOT / f"{HUB}.html").write_text(build_hub(), encoding="utf-8")
    print("Built hub:", HUB)
    for page in PAGES:
        (ROOT / f"{page['slug']}.html").write_text(build_cluster_page(page), encoding="utf-8")
        print("Built:", page["slug"])


if __name__ == "__main__":
    main()
