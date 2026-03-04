const nav = document.querySelector(".navBar")
const btn = document.querySelector(".Navbtn")

function dropDown() {
    nav.classList.toggle("Active")
}

btn.addEventListener("click", () => {
    dropDown()
})


let firstTouch = true;
document.addEventListener('touchstart', function() {
    if (firstTouch) {
        firstTouch = false;
        window.scrollTo(0, 1);
        setTimeout(() => window.scrollTo(0, 0), 10);
    }
}, { passive: true });









