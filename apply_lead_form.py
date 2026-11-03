#!/usr/bin/env python3
"""Put the same short enquiry form on every landing page and send enquiries to the DB's Workouts app.

- Existing pages (with <form id="leadForm">): fields are updated in place, the look is unchanged.
- Landing pages without a form (female PT, mobile PT, online PT, massage, ...) get the form added above their closing call-to-action.
- Enquiries go to the app dashboard (coach.dbworkouts.co.uk). If the app cannot be reached they are emailed through Formspree instead, so none are lost.
Safe to re-run (pages already updated are skipped): run it again after regenerating pages with the generate_*.py scripts.
Usage: python3 apply_lead_form.py
"""
import glob, re

API = 'https://coach.dbworkouts.co.uk/api/public/enquiries'
FORMSPREE = 'https://formspree.io/f/mjgzzowv'
MARK = 'data-lf="2"'

PT_GOALS = ['Weight Loss', 'Build Muscle', 'Improve Fitness', 'Sports Performance', 'General Health', 'Other']
MASSAGE_GOALS = ['Sports recovery', 'Muscle tension', 'Desk posture, neck and back', 'Injury or niggle', 'Relaxation', 'Other']

CSS_EXTRA = '    #leadForm .lf-check{display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.4;color:rgba(255,255,255,.8)}\n    #leadForm .lf-check input{width:auto;margin-top:3px;flex:none}\n    #leadForm .lf-check a{color:#fff}\n'

SCRIPT = r'''<script>
  (function(){
    var f=document.getElementById('leadForm'),m=document.getElementById('leadMsg');
    if(!f)return;
    var API='__API__',t0=Date.now(),sid=t0.toString(36)+Math.random().toString(36).slice(2,10),kind=f.getAttribute('data-kind')||'pt';
    f.querySelector('[name=source]').value=location.href;
    try{var rf=new URLSearchParams(location.search).get('ref');if(rf)f.querySelector('[name=referrer]').value=rf.slice(0,60);}catch(e){}
    f.querySelector('[name=_subject]').value='New enquiry from '+(document.title.split('|')[0].trim()||'website');
    function done(){f.style.display='none';m.style.display='block';m.style.color='#25D366';m.textContent=f.getAttribute('data-thanks');}
    function fail(msg){var b=f.querySelector('button');b.disabled=false;b.textContent=f.getAttribute('data-btn');m.style.display='block';m.style.color='#ff5a6e';m.textContent=msg||'Something went wrong. Please WhatsApp or call Dean on 07752 300937.';}
    f.addEventListener('submit',function(e){
      e.preventDefault();
      var b=f.querySelector('button');b.disabled=true;b.textContent='Sending...';
      var d=new FormData(f),email=(d.get('email')||'').trim(),goal=d.get('goal')||'';
      var body={submissionId:sid,startedAt:t0,hp_check:d.get('_gotcha')||'',privacyAccepted:d.get('privacy')==='yes',name:d.get('name')||'',email:email,phone:d.get('phone')||'',area:d.get('area')||'',referredBy:(d.get('referrer')||'').trim().slice(0,60),preferredContact:email?'any':'phone',mode:kind==='online'?'online':(kind==='massage'?'in_person':'either'),goals:(kind==='massage'?'Massage enquiry. Main need: ':'Main goal: ')+goal,message:'From the website page: '+(document.title.split('|')[0].trim()||location.pathname)};
      fetch(API,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
        .then(function(r){
          if(r.ok){done();return;}
          return r.json().catch(function(){return {};}).then(function(j){
            if(r.status>=400&&r.status<500&&r.status!==403){fail(j.error);return;}
            throw new Error('app');
          });
        })
        .catch(function(){
          // The app could not be reached: email the enquiry instead so it is never lost.
          fetch(f.action,{method:'POST',body:d,headers:{'Accept':'application/json'}})
            .then(function(r){if(r.ok)done();else throw new Error('mail');})
            .catch(function(){fail();});
        });
    });
  })();
  </script>'''.replace('__API__', API)


def form_html(kind, thanks, btn):
    goals = MASSAGE_GOALS if kind == 'massage' else PT_GOALS
    label = 'What do you need help with?' if kind == 'massage' else "What's your main goal?"
    opts = ''.join('<option>%s</option>' % g for g in goals)
    return f'''<form id="leadForm" action="{FORMSPREE}" method="POST" {MARK} data-kind="{kind}" data-btn="{btn}" data-thanks="{thanks}">
    <div class="lf-row">
      <input type="text" name="name" placeholder="Your name *" required autocomplete="name">
      <input type="tel" name="phone" placeholder="Phone or WhatsApp *" required autocomplete="tel">
    </div>
    <div class="lf-row">
      <input type="email" name="email" placeholder="Email (optional)" autocomplete="email">
      <input type="text" name="area" placeholder="Your area, e.g. Stratford" autocomplete="address-level2">
    </div>
    <input type="text" name="referrer" placeholder="Who referred you? (optional)" autocomplete="off">
    <select name="goal" required>
      <option value="" disabled selected>{label}</option>
      {opts}
    </select>
    <input type="hidden" name="source" value="">
    <input type="hidden" name="_subject" value="New enquiry from website page">
    <input type="text" name="_gotcha" tabindex="-1" autocomplete="off" style="display:none">
    <label class="lf-check"><input type="checkbox" name="privacy" value="yes" required><span>I agree to my details being used to reply to my enquiry, as explained in the <a href="/privacy-policy" target="_blank" rel="noopener">privacy policy</a>.</span></label>
    <button type="submit">{btn}</button>
  </form>'''


def full_block(kind):
    if kind == 'massage':
        head = 'Book your <span class="redText">mobile sports massage</span>'
        sub = "Tell us where you are and what you need and we'll get back to you within 2 hours."
        btn = 'Request a Massage'
        wa = 'Hi%2C%20I%27d%20like%20to%20book%20a%20mobile%20sports%20massage%20in%20East%20London.'
    else:
        head = 'Get your <span class="redText">free consultation call</span>'
        sub = "Leave your details and we'll get back to you within 2 hours. Free, no commitment. It's a chat about your goals, not a free training session."
        btn = 'Book My Free Consultation Call'
        wa = 'Hi%2C%20I%20found%20you%20online%20and%20I%27d%20like%20a%20free%20consultation%20call%20in%20East%20London.'
    thanks = "Thanks! We'll be in touch within 2 hours."
    return f'''<section class="seo-section"><!-- db-lead-form -->
<div class="info-block" id="free-consultation" style="margin-top:28px;">
  <style>
    #free-consultation{{background:#111;border-left:4px solid #b30018;border-radius:0 6px 6px 0;padding:20px;margin:24px auto;max-width:800px;color:#fff;font-family:"IBM Plex Serif",serif}}
    #free-consultation .redText{{color:#b30018}}
    #leadForm{{display:grid;gap:10px;margin-top:12px}}
    #leadForm input,#leadForm select{{width:100%;padding:12px 14px;border-radius:6px;border:1px solid rgba(255,255,255,.25);background:#0a0a0a;color:#fff;font:inherit;font-size:16px}}
    #leadForm .lf-row{{display:grid;grid-template-columns:1fr 1fr;gap:10px}}
    #leadForm button{{padding:14px;border-radius:6px;border:2px solid #fff;background:#b30018;color:#fff;font:700 17px/1 inherit;cursor:pointer}}
    #leadForm button:disabled{{opacity:.6;cursor:wait}}
{CSS_EXTRA}    .lf-alt{{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}}
    .lf-alt a{{padding:11px 16px;border-radius:6px;text-decoration:none;font-weight:700;font-size:15px}}
    #leadMsg{{display:none;margin-top:12px;font-weight:700}}
    @media(max-width:560px){{#leadForm .lf-row{{grid-template-columns:1fr}}}}
  </style>
  <h2 style="font-size:clamp(18px,3vw,24px);margin-top:0;">{head}</h2>
  <p>{sub}</p>
  {form_html(kind, thanks, btn)}
  <p id="leadMsg" role="status"></p>
  <div class="lf-alt">
    <a href="https://wa.me/447752300937?text={wa}" target="_blank" rel="noopener" style="background:#25D366;color:#06210f;">WhatsApp Dean</a>
    <a href="tel:+447752300937" style="border:1px solid rgba(255,255,255,.35);">Call 07752 300937</a>
  </div>
  {SCRIPT}
</div></section>
'''


FORM_RE = re.compile(r'<form id="leadForm" action="[^"]*" method="POST">.*?</form>', re.S)
SCRIPT_RE = re.compile(r"<script>\s*\(function\(\)\{\s*var f=document\.getElementById\('leadForm'\).*?\}\)\(\);\s*</script>", re.S)
CSS_ANCHOR = '    @media(max-width:560px){#leadForm .lf-row{grid-template-columns:1fr}}'


def kind_of(name):
    if 'massage' in name: return 'massage'
    if name.startswith('online-'): return 'online'
    return 'pt'


def main():
    updated = added = skipped = 0
    for f in sorted(glob.glob('*.html')):
        s = open(f, encoding='utf-8').read()
        if MARK in s:
            skipped += 1
            continue
        if 'id="leadForm"' in s:
            # Same look; new fields and the new sending script.
            kind = kind_of(f)
            n = form_html(kind, "Thanks! Dean will be in touch within 2 hours.", 'Book My Free Consultation Call')
            s2 = FORM_RE.sub(lambda m: n, s, count=1)
            s2 = SCRIPT_RE.sub(lambda m: SCRIPT, s2, count=1)
            if CSS_EXTRA not in s2:
                s2 = s2.replace(CSS_ANCHOR, CSS_EXTRA + CSS_ANCHOR, 1)
            if s2 == s or MARK not in s2 or "d.get('_gotcha')" not in s2:
                print('could not update', f); continue
            open(f, 'w', encoding='utf-8').write(s2); updated += 1
        elif '<form' not in s and '<section class="seo-final"' in s and 'class="seo-page"' in s and re.search(r'(female|womens|mobile-|pair-|beginners|weight-loss-p|online-|massage)', f):
            s2 = s.replace('<section class="seo-final"', full_block(kind_of(f)) + '<section class="seo-final"', 1)
            open(f, 'w', encoding='utf-8').write(s2); added += 1
    print(f'updated {updated}, added {added}, already done {skipped}')


if __name__ == '__main__':
    main()
