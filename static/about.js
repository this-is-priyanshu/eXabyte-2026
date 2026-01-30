const cards = document.querySelectorAll('.people-card');

cards.forEach(card => {
    card.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
            this.classList.toggle('is-tapped');
            cards.forEach(c => { if (c !== this) c.classList.remove('is-tapped'); });
        }
    });
});