import * as THREE from "three";

const track = document.getElementById('track');
const navPill = document.getElementById('navPill');
const navItems = document.querySelectorAll('.nav-item');
const sidebarText = document.getElementById('sidebarText');
const tierTitle = document.getElementById('tierTitle');
const tierSubtitle = document.getElementById('tierSubtitle');

const tiers = [
    { title: "GOLD PARTNERS", subtitle: "The Biggest Gs", color: "#ffea00", shadow: "0 0 20px rgba(255, 234, 0, 0.7)" },
    { title: "SILVER PARTNERS", subtitle: "The Rock Solid Supports", color: "#C0C0C0", shadow: "0 0 20px rgba(192, 192, 192, 0.7)" },
    { title: "BRONZE PARTNERS", subtitle: "The Trusted Allies", color: "#cd7f32", shadow: "0 0 20px rgba(205, 127, 50, 0.7)" }
];

let currentIndex = 0;
const sections = document.querySelectorAll('.tier-section');
sections[currentIndex].classList.add('active');

navItems.forEach(item => {
    item.addEventListener('click', () => {
        const index = parseInt(item.getAttribute('data-index'));
        currentIndex = index;
        updateSlider();
    });
});

function updateSlider() {
    const percentage = currentIndex * -33.3333;
    track.style.transform = `translateX(${percentage}%)`;

    sections.forEach((section, index) => {
        const grid = section.querySelector('.cards-grid');
        if (index === currentIndex) {
            section.classList.add('active');
            if (grid && grid.__sliderInstance) {
                grid.__sliderInstance.snapToIndex(0);
            }
        } else {
            section.classList.remove('active');
        }
    });

    navItems.forEach((item, index) => {
        item.classList.toggle('active', index === currentIndex);
    });

    const currentTier = tiers[currentIndex];
    navPill.style.borderColor = currentTier.color;

    sidebarText.classList.add('fade-out');

    setTimeout(() => {
        tierTitle.innerText = currentTier.title;
        tierSubtitle.innerText = currentTier.subtitle;
        tierTitle.style.color = currentTier.color;
        tierTitle.style.textShadow = currentTier.shadow;
        sidebarText.classList.remove('fade-out');
    }, 300);
}

class VerticalSlider {
    constructor(element) {
        this.container = element.querySelector('.cards-grid');
        this.cards = Array.from(element.querySelectorAll('.card'));
        this.eventTarget = element;
        this.verticalOffset = 0;
        this.currentY = 0;
        this.targetY = 0;
        this.isDragging = false;
        this.startY = 0;
        this.startCurrentY = 0;
        this.scrollTimeout = null;

        if (element.classList.contains('tier-silver')) {
            this.activeColor = '#C0C0C0';
            this.activeShadow = 'rgba(192, 192, 192, 0.5)';
        } else if (element.classList.contains('tier-bronze')) {
            this.activeColor = '#cd7f32';
            this.activeShadow = 'rgba(205, 127, 50, 0.5)';
        } else {
            this.activeColor = '#ffea00';
            this.activeShadow = 'rgba(255, 234, 0, 0.5)';
        }

        const style = window.getComputedStyle(this.container);
        const gap = parseFloat(style.gap) || 0;
        this.cardHeight = this.cards[0].offsetHeight;
        this.itemStride = this.cardHeight + gap;
        this.currentIndex = 0;

        this.initEvents();
        this.animate();
        this.snapToIndex(0);
        this.currentY = this.targetY;
    }

    initEvents() {
        this.container.addEventListener('mousedown', e => { e.preventDefault(); this.startDrag(e.clientY); });
        window.addEventListener('mousemove', e => this.onDrag(e.clientY));
        window.addEventListener('mouseup', () => this.endDrag());

        this.container.addEventListener('touchstart', e => this.startDrag(e.touches[0].clientY));
        window.addEventListener('touchmove', e => this.onDrag(e.touches[0].clientY));
        window.addEventListener('touchend', () => this.endDrag());

        this.eventTarget.addEventListener('wheel', e => this.onWheel(e), { passive: false });
    }

    onWheel(e) {
        e.preventDefault();
        this.container.style.transition = 'none';
        this.targetY -= e.deltaY * 0.8;

        const screenCenterOffset = (window.innerHeight / 2) - (this.cardHeight / 2) - this.verticalOffset;
        const maxTarget = screenCenterOffset;
        const minTarget = screenCenterOffset - ((this.cards.length - 1) * this.itemStride);

        if (this.targetY > maxTarget + 50) this.targetY = maxTarget + 50;
        if (this.targetY < minTarget - 50) this.targetY = minTarget - 50;

        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => this.endScroll(), 100);
    }

    endScroll() {
        const screenCenterOffset = (window.innerHeight / 2) - (this.cardHeight / 2) - this.verticalOffset;
        let newIndex = Math.round((screenCenterOffset - this.targetY) / this.itemStride);
        newIndex = Math.max(0, Math.min(newIndex, this.cards.length - 1));
        this.snapToIndex(newIndex);
    }

    startDrag(y) {
        this.isDragging = true;
        this.startY = y;
        this.startCurrentY = this.currentY;
        this.container.style.transition = 'none';
    }

    onDrag(y) {
        if (!this.isDragging) return;
        this.targetY = this.startCurrentY + (y - this.startY);
        this.currentY = this.targetY;
    }

    endDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.endScroll();
    }

    snapToIndex(index) {
        this.currentIndex = index;
        const screenCenterOffset = (window.innerHeight / 2) - (this.cardHeight / 2) - this.verticalOffset;
        this.targetY = screenCenterOffset - (index * this.itemStride);

        const parentSection = this.container.closest('.tier-section');
        if (!parentSection.classList.contains('active')) return;

        const activeCard = this.cards[index];
        const historyText = document.getElementById('historyText');
        const historyPanel = document.getElementById('historyPanel');
        const focusFrame = document.getElementById('focus-frame');

        if (activeCard && historyText) {
            const newContent = activeCard.getAttribute('data-history') || "";

            if (focusFrame) {
                focusFrame.style.borderColor = this.activeColor;
                focusFrame.style.boxShadow = `0 0 40px ${this.activeShadow}`;
            }

            if (historyPanel && window.innerWidth > 900) {
                historyPanel.style.borderColor = this.activeColor;
                historyPanel.style.boxShadow = `0 0 15px ${this.activeColor}40`;
            }

            historyText.style.color = this.activeColor;
            historyText.style.opacity = '0';

            setTimeout(() => {
                historyText.innerText = newContent;
                historyText.style.opacity = '1';
                historyText.style.textShadow = `0 0 10px ${this.activeColor}80`;
            }, 150);
        }
    }

    updateVisuals() {
        const focalPoint = (window.innerHeight / 2) - this.verticalOffset;

        this.cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const dist = Math.abs(focalPoint - (rect.top + rect.height / 2));
            const factor = Math.min(dist / (window.innerHeight * 0.6), 1);

            card.style.transform = `scale(${1.0 - factor * 0.25})`;
            card.style.filter = `blur(${factor * 5}px) brightness(${1 - factor * 0.3})`;
            card.style.opacity = Math.max(1 - factor * 0.5, 0.2);
            card.style.zIndex = Math.round(100 - factor * 100);
        });
    }

    animate() {
        if (!this.isDragging) {
            this.currentY += (this.targetY - this.currentY) * 0.1;
        }
        this.container.style.transform = `translate(-50%, ${this.currentY}px)`;
        this.updateVisuals();
        requestAnimationFrame(() => this.animate());
    }
}

document.querySelectorAll('.tier-section').forEach(section => {
    const instance = new VerticalSlider(section);
    const grid = section.querySelector('.cards-grid');
    if (grid) grid.__sliderInstance = instance;
});
