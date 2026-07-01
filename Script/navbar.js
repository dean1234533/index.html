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









