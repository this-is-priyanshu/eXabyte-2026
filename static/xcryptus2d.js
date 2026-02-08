// Prevent scroll restoration
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}
window.scrollTo(0, 0);

// --- UPDATED HORIZONTAL SCROLL SYSTEM ---
const track = document.getElementById('timelineTrack');
const viewport = document.querySelector('.projects-viewport');

let currentScrollX = 0;
let targetScrollX = 0;
const friction = 0.08;
let maxScrollBounds = 0;

// Function to check if we are on mobile
const isMobile = () => window.innerWidth <= 768;

const updateBounds = () => {
    // Only calculate bounds if NOT mobile
    if (!isMobile()) {
        maxScrollBounds = Math.max(0, track.scrollWidth - viewport.clientWidth);
        document.body.style.height = '100vh'; // Lock height on desktop
        document.body.style.overflow = 'hidden';
    } else {
        // Reset styles for mobile
        track.style.transform = '';
        document.body.style.height = 'auto';
        document.body.style.overflowY = 'auto';
    }
};

window.addEventListener('wheel', (e) => {
    // Disable custom scroll logic on Mobile
    if (isMobile()) return;

    e.preventDefault();
    targetScrollX += e.deltaY * 1.5;
    targetScrollX = Math.max(0, Math.min(targetScrollX, maxScrollBounds));

}, { passive: false });

const animateScroll = () => {
    // Only run animation frame if NOT mobile
    if (!isMobile()) {
        currentScrollX += (targetScrollX - currentScrollX) * friction;
        track.style.transform = `translateX(${-currentScrollX}px)`;

        // [REMOVED] The navbar logic was here. 
        // Now the navbar will ignore scrolling and remain static.

        requestAnimationFrame(animateScroll);
    }
};

// Initialize
updateBounds();
window.addEventListener('resize', () => {
    updateBounds();
    // Re-trigger animation loop if resizing from mobile to desktop
    if (!isMobile()) requestAnimationFrame(animateScroll);
});

if (!isMobile()) animateScroll();


// --- CARD SLIDER WITH MOBILE SWIPE SUPPORT ---

document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.card-slide');
    const indicators = document.querySelectorAll('.indicator');
    const sliderContainer = document.querySelector('.card-slider');

    let currentIndex = 0;
    const slideInterval = 5000;
    let isAnimating = false;

    const showSlide = (index) => {
        if (isAnimating || index === currentIndex) return;
        isAnimating = true;

        const currentSlide = slides[currentIndex];
        const currentIndicator = indicators[currentIndex];

        currentSlide.classList.remove('active');
        currentSlide.classList.add('exit');
        currentIndicator.classList.remove('active');

        setTimeout(() => {
            currentSlide.classList.remove('exit');
            isAnimating = false;
        }, 600);

        currentIndex = index;
        slides[currentIndex].classList.add('active');
        indicators[currentIndex].classList.add('active');
    };

    const nextSlide = () => showSlide((currentIndex + 1) % slides.length);
    const prevSlide = () => showSlide((currentIndex - 1 + slides.length) % slides.length);

    let sliderTimer = setInterval(nextSlide, slideInterval);

    // --- TOUCH / SWIPE LOGIC ---
    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        const threshold = 50;
        if (touchStartX - touchEndX > threshold) {
            clearInterval(sliderTimer);
            nextSlide();
            sliderTimer = setInterval(nextSlide, slideInterval);
        }
        if (touchEndX - touchStartX > threshold) {
            clearInterval(sliderTimer);
            prevSlide();
            sliderTimer = setInterval(nextSlide, slideInterval);
        }
    };
    // ---------------------------

    indicators.forEach((ind, index) => {
        ind.addEventListener('click', () => {
            clearInterval(sliderTimer);
            showSlide(index);
            sliderTimer = setInterval(nextSlide, slideInterval);
        });
    });
});


// --- PREVIEW MODAL LOGIC --- //

const projectDetails = [
    {
        title: "Quantum Enigma",
        desc: "An in-depth look at how quantum states are revolutionizing cryptography. We explore the latest breakthroughs in qubit stability and error correction.",
        link: "https://drive.google.com/your-file-link-1"
    },
    {
        title: "Neuro Link",
        desc: "Bridging the gap between biological neurons and silicon chips. This edition covers the ethics and engineering of brain-computer interfaces.",
        link: "https://drive.google.com/your-file-link-2"
    },
    {
        title: "Chit Chat",
        desc: "The rise of LLMs and what it means for human communication. Is the Turing test still relevant in 2026? Find out in our exclusive report.",
        link: "https://drive.google.com/your-file-link-3"
    },
    {
        title: "Backend Architecture",
        desc: "Scalability isn't just a buzzword. We dive deep into microservices, serverless computing, and database sharding for the modern web.",
        link: "https://drive.google.com/your-file-link-4"
    },
    {
        title: "Game of Life",
        desc: "Simulating cellular automata to understand complex biological systems. A tribute to John Conway and the rules that govern chaos.",
        link: "https://drive.google.com/your-file-link-5"
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('preview-modal');
    const closeBtn = document.getElementById('close-modal');
    const projectCards = document.querySelectorAll('.project-card');

    const modalImg = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalLink = document.getElementById('modal-link');

    projectCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            const data = projectDetails[index];
            const imgSrc = card.querySelector('img').src;

            modalImg.src = imgSrc;
            modalTitle.innerText = data.title;
            modalDesc.innerText = data.desc;
            modalLink.href = data.link;

            modal.classList.add('active');
        });
    });

    const closeModal = () => {
        modal.classList.remove('active');
    };

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
});