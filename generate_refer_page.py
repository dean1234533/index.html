#!/usr/bin/env python3
"""Builds refer-a-friend.html from the mobile personal trainer page (same header, footer and styles).
Re-run after changing the offer text below, then add the page to the sitemap if it is not there."""
import re, html

SRC = 'mobile-personal-trainer-east-london.html'
OUT = 'refer-a-friend.html'
URL = 'https://dbworkouts.co.uk/refer-a-friend'
TITLE = "Refer a Friend | Bonus Session for You | DB's Workouts"
DESC = "Refer a friend to DB's Workouts. When they book a session block, you get an extra session added to yours. How it works and the rules."

s = open(SRC, encoding='utf-8').read()
e = lambda x: html.escape(x, quote=True)
# head
s = re.sub(r'<title>.*?</title>', '<title>' + html.escape(TITLE, quote=False) + '</title>', s, count=1, flags=re.S)
s = re.sub(r'(<meta name="description" content=")[^"]*(")', lambda m: m.group(1) + e(DESC) + m.group(2), s, count=1)
s = re.sub(r'(<link rel="canonical" href=")[^"]*(")', lambda m: m.group(1) + URL + m.group(2), s, count=1)
for tag, val in [('og:title', TITLE), ('twitter:title', TITLE), ('og:description', DESC), ('twitter:description', DESC), ('og:url', URL)]:
    s = re.sub(r'(<meta (?:property|name)="%s" content=")[^"]*(")' % tag, lambda m: m.group(1) + e(val) + m.group(2), s, count=1)
faq = [("Is the extra session a discount?", "No. It is a bonus training session added to your block, not money off. It is added once your friend has paid for a block of 5, 10 or 15 sessions."),
       ("What if my friend only books a single session?", "The bonus applies when a new client pays for a session block. A single pay-as-you-go session does not qualify, but a block can follow later."),
       ("Is there a limit?", "No. You get a bonus session for every new client you refer who pays for a block."),
       ("Is my friend's first consultation a free session?", "No. The free consultation call is a conversation about their goals, not a training session.")]
ld = '{"@context":"https://schema.org","@graph":[{"@type":"WebPage","@id":"%s#page","url":"%s","name":"%s","description":"%s","isPartOf":{"@id":"https://dbworkouts.co.uk/#website"}},{"@type":"FAQPage","mainEntity":[%s]}]}' % (
    URL, URL, TITLE.replace('"', "'"), DESC.replace('"', "'"),
    ','.join('{"@type":"Question","name":"%s","acceptedAnswer":{"@type":"Answer","text":"%s"}}' % (q, a) for q, a in faq))
s = re.sub(r'<script type="application/ld\+json">.*?</script>', '<script type="application/ld+json">' + ld + '</script>', s, count=1, flags=re.S)
# body
faq_html = ''.join('<details><summary>%s<span aria-hidden="true">+</span></summary><p>%s</p></details>' % (html.escape(q), html.escape(a)) for q, a in faq)
main = f'''<main id="main-content" class="seo-page">
<section class="seo-hero"><div class="seo-wrap"><div><p class="seo-kicker">REFER A FRIEND</p><h1>Train together. Get a bonus session.</h1>
<p class="seo-lead">Know someone who would love training outdoors? When they book a block of sessions with DB's Workouts, we add an extra session to yours as a thank you.</p>
<div class="seo-actions"><a class="db-btn db-btn-primary" href="#share">Share your link <span aria-hidden="true">↓</span></a><a class="seo-text-link" href="/contact">Book a free consultation call <span aria-hidden="true">↗</span></a></div>
<p class="seo-note">For current clients · A bonus session, not a discount</p></div></div></section>
<div class="seo-wrap seo-content">
<section class="seo-section"><h2>How it <span class="redText">works</span></h2>
<ol style="margin:12px 0 0 20px;line-height:1.8;list-style:decimal">
<li><strong>Send your friend your link.</strong> Use the button below. It opens WhatsApp with a message ready to send.</li>
<li><strong>They book a free consultation call.</strong> The call is a chat about their goals, not a training session. Your name comes through with their enquiry.</li>
<li><strong>They book a block.</strong> Once your friend has paid for a block of 5, 10 or 15 sessions, we add one extra session to your block.</li></ol></section>
<section class="seo-section" id="share"><div class="info-block" style="background:#111;border-left:4px solid #b30018;border-radius:0 6px 6px 0;padding:20px;color:#fff">
<h2 style="font-size:clamp(18px,3vw,24px);margin-top:0">Your <span class="redText">referral link</span></h2>
<p>Type your first name and send your friend a ready-made WhatsApp message.</p>
<p style="display:grid;gap:10px;margin-top:12px"><input id="refName" type="text" maxlength="40" placeholder="Your first name" autocomplete="given-name" style="width:100%;padding:12px 14px;border-radius:6px;border:1px solid rgba(255,255,255,.25);background:#0a0a0a;color:#fff;font:inherit;font-size:16px">
<a id="refWa" class="db-btn db-btn-primary" href="#" rel="noopener" target="_blank">Share on WhatsApp</a></p>
<p class="seo-note" id="refLink"></p></div>
<script>
(function(){{
  var n=document.getElementById('refName'),a=document.getElementById('refWa'),l=document.getElementById('refLink');
  function upd(){{
    var name=(n.value||'').trim().slice(0,40),url='https://dbworkouts.co.uk/contact'+(name?'?ref='+encodeURIComponent(name):'');
    a.href='https://wa.me/?text='+encodeURIComponent("Hi! I train with DB's Workouts, outdoor personal training in East London, and I'd recommend it. You can book a free consultation call here: "+url);
    l.textContent=name?'Your link: '+url:'';
  }}
  n.addEventListener('input',upd);upd();
}})();
</script></section>
<section class="seo-section"><h2>The <span class="redText">rules</span></h2>
<ul style="margin:12px 0 0 20px;line-height:1.8;list-style:disc">
<li>The offer is for current clients of DB's Workouts.</li>
<li>Your friend must be new to DB's Workouts and pay for a block of 5, 10 or 15 sessions.</li>
<li>The bonus is one extra training session added to your block. It is not money off and has no cash value.</li>
<li>There is no limit: you earn one bonus session for every new client you refer who pays for a block.</li>
<li>We may change or end the offer at any time. Sessions already earned still stand.</li></ul></section>
<section class="seo-section seo-faq-section"><div class="seo-faq"><h2>Frequently Asked <span class="redText">Questions</span></h2>{faq_html}</div></section>
<section class="seo-final"><p class="seo-kicker">NEW HERE?</p><h2>Start with a free<br>consultation call.</h2><p>A chat about your goals with Dean, with no commitment. It is a conversation, not a training session.</p><div class="seo-actions"><a class="db-btn db-btn-primary" href="/contact">Book a free consultation call <span aria-hidden="true">↗</span></a><a class="seo-text-link" href="https://wa.me/447752300937">Message Dean on WhatsApp <span aria-hidden="true">↗</span></a></div></section>
</div></main>'''
i = s.find('<main'); j = s.find('</main>') + len('</main>')
s = s[:i] + main + s[j:]
open(OUT, 'w', encoding='utf-8').write(s)
print('wrote', OUT, len(s))
