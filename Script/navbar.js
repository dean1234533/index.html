const nav = document.querySelector(".navBar")
const btn = document.querySelector(".Navbtn")
const waBtn = document.querySelector(".callBackStickyButton")

function dropDown() {
    nav.classList.toggle("Active")
    if (waBtn) waBtn.style.display = nav.classList.contains("Active") ? "none" : ""
}

btn.addEventListener("click", () => {
    dropDown()
})

// Blog dropdown — tap to toggle on mobile
const blogToggle = document.querySelector(".nav-dropdown-toggle")
if (blogToggle) {
    blogToggle.addEventListener("click", function(e) {
        if (window.innerWidth < 1200) {
            e.preventDefault()
            this.closest(".nav-dropdown").classList.toggle("open")
        }
    })
}

// Close dropdown when nav closes
btn.addEventListener("click", () => {
    if (!nav.classList.contains("Active")) {
        const dropdown = document.querySelector(".nav-dropdown")
        if (dropdown) dropdown.classList.remove("open")
    }
})


let firstTouch = true;
document.addEventListener('touchstart', function() {
    if (firstTouch) {
        firstTouch = false;
        window.scrollTo(0, 1);
        setTimeout(() => window.scrollTo(0, 0), 10);
    }
}, { passive: true });

// GA4 event helper — safe to call even before gtag loads
function gaEvent(name, params) {
    if (typeof gtag === 'function') gtag('event', name, params);
}

// Track consultation / book-now button clicks
document.addEventListener('click', function(e) {
    const btn = e.target.closest('.consultation-btn, .consultation-button, .Nav-consultation-button, .cta-submit-btn');
    if (btn) gaEvent('cta_click', { button_text: btn.innerText.trim() });
});

// Track outbound link clicks
document.addEventListener('click', function(e) {
    const a = e.target.closest('a[href]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href && href.startsWith('http') && !href.includes('dbworkouts.co.uk')) {
        gaEvent('outbound_click', { url: href });
    }
});

// Track contact form submission (FormSubmit redirects with ?sent=true)
if (window.location.search.includes('sent=true')) {
    gaEvent('form_submission', { form_id: 'contact_form' });
}

// Intercept contact form submit to fire event before redirect
var contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function() {
        gaEvent('form_submission', { form_id: 'contact_form' });
    });
}









