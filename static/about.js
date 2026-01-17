const elements = document.getElementsByClassName('team-division');

window.addEventListener('scroll', () => {
    const vh = window.innerHeight;
    const stickyThreshold = vh * 0.15;

    const elementsArray = Array.from(elements);

    elementsArray.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.top < vh - (el.offsetHeight * 0.3)) {
            el.style.opacity = "1";
        } else {
            el.style.opacity = "0";
        }
        const nextEl = elementsArray[index + 1];
        if (nextEl) {
            const nextRect = nextEl.getBoundingClientRect();
            if (nextRect.top <= stickyThreshold + 1) {
                el.style.opacity = "0";
            }
        }
    });
});