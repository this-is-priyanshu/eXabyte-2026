// Navigation Bar
const cs_navbar_observer = new IntersectionObserver((e) => {
    const who = document.querySelector('.cs-navbar')
    if(e[0].isIntersecting) {
        who.classList.add('cs-navbar-collapsed')
        who.classList.remove('cs-navbar-expanded')
    }
    else {
        who.classList.remove('cs-navbar-collapsed')
        who.classList.add('cs-navbar-expanded')
    }
}, {
    root: null,
    rootMargin: "0px",
    scrollMargin: "0px",
    threshold: 1.0,
});

// cs_navbar_observer.observe(document.querySelector('.cs-navbar-view-checker'))

const cs_navbar_dialog = document.querySelector('.cs-hamburger-dialog');
const cs_closer = document.querySelector('#cs-dailog-closer')
cs_closer.addEventListener('touchstart', (e) => {cs_navbar_dialog.close(); e.stopPropagation();})
cs_closer.addEventListener('click', (e) => {cs_navbar_dialog.close(); e.stopPropagation();})

const cs_navbar_hamburger_button = document.querySelector('#cs-hamburger')
function func(e){
    cs_navbar_hamburger_button.style.transform = 'scale(0.8)'
    setTimeout(() => cs_navbar_hamburger_button.style.transform = 'scale(1)', 200)

    console.log(e)

    cs_navbar_dialog.style.display = 'block';
    cs_navbar_dialog.showModal()
}
cs_navbar_hamburger_button.addEventListener('click', func)
cs_navbar_hamburger_button.addEventListener('touchstart', func)


const title = document.querySelector('title').textContent
for(const p of document.querySelectorAll('.cs-navbar nav a')) {
    if(p.textContent.match(/\w+/g)[0].toLowerCase() == title.match(/\w+/g)[0].toLowerCase()) {
        p.classList.add('cs-selected')
    }
}
