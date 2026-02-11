/* =========================================
   2. UNIFIED VERTICAL SCROLLER (LOWER ACTIVE CARD ON MOBILE)
   ========================================= */

// Configuration for each tier
const TIER_CONFIG = {
    gold:   { title: "SPONSORS",   subtitle: "The elixir of eXabyte 2026",          color: "#ffd700", shadow: "rgba(255, 234, 0, 0.5)" },
    silver: { title: "SPONSORS", subtitle: "The elixir of eXabyte 2026", color: "#C0C0C0", shadow: "rgba(192, 192, 192, 0.5)" },
    bronze: { title: "SPONSORS", subtitle: "The elixir of eXabyte 2026",      color: "#cd7f32", shadow: "rgba(205, 127, 50, 0.5)" }
};

class UnifiedSlider {
    constructor(element) {
        if (!element) return;
        
        this.container = element; 
        this.cards = Array.from(element.querySelectorAll('.card'));
        this.focusFrame = document.getElementById('focus-frame'); 

        if (this.cards.length === 0) return;

        // Physics variables
        this.currentY = 0;
        this.targetY = 0;
        this.isDragging = false;
        this.startY = 0;
        this.startCurrentY = 0;
        this.currentIndex = 0; 
        
        // Find start indices
        this.tierIndices = {
            gold: this.cards.findIndex(c => c.dataset.tier === 'gold'),
            silver: this.cards.findIndex(c => c.dataset.tier === 'silver'),
            bronze: this.cards.findIndex(c => c.dataset.tier === 'bronze')
        };

        // Initialize Dimensions
        this.updateDimensions(); 

        this.initEvents();
        this.animate();
        this.snapToIndex(0);

        // Listen for resize to fix layout instantly
        window.addEventListener('resize', () => this.handleResize());
    }

    // --- NEW HELPER: Determines how much to shift down ---
    getMobileOffset() {
        // If width < 1400px, shift down by 10% of viewport height (approx 80-100px)
        return window.innerWidth < 1400 ? window.innerHeight * 0.001 : 0;
    }
    // ----------------------------------------------------

    updateDimensions() {
        const style = window.getComputedStyle(this.container);
        const gap = parseFloat(style.gap) || 0;
        this.cardHeight = this.cards[0].offsetHeight || 300; 
        this.itemStride = this.cardHeight + gap;
    }

    handleResize() {
        this.updateDimensions();
        this.snapToIndex(this.currentIndex);
    }

    initEvents() {
        // --- DESKTOP ---
        window.addEventListener('mousedown', e => { 
            if(e.target.closest('.nav-pill') || e.target.closest('.cs-navbar')) return;
            this.startDrag(e.clientY); 
        });
        
        window.addEventListener('mousemove', e => {
            if(this.isDragging) {
                e.preventDefault(); 
                this.onDrag(e.clientY);
            }
        });
        
        window.addEventListener('mouseup', () => this.endDrag());

        // --- MOBILE (TOUCH) ---
        window.addEventListener('touchstart', e => { 
            if(e.target.closest('.nav-pill') || 
               e.target.closest('.cs-navbar') || 
               e.target.closest('.cs-hamburger-dialog')) {
                return;
            }
            this.startDrag(e.touches[0].clientY); 
        }, { passive: false }); 

        window.addEventListener('touchmove', e => {
            if (this.isDragging) {
                e.preventDefault(); 
                this.onDrag(e.touches[0].clientY);
            }
        }, { passive: false }); 

        window.addEventListener('touchend', () => this.endDrag());

        // --- WHEEL ---
        window.addEventListener('wheel', e => this.onWheel(e), { passive: false });
    }

    onWheel(e) {
        e.preventDefault();
        this.targetY -= e.deltaY * 0.8;
        this.clampTarget();
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => this.snapToNearest(), 100);
    }

    startDrag(y) {
        this.isDragging = true;
        this.startY = y;
        this.startCurrentY = this.currentY;
        
        this.targetY = this.currentY; 
        this.container.style.cursor = 'grabbing';
    }

    onDrag(y) {
        if (!this.isDragging) return;
        const delta = y - this.startY;
        this.targetY = this.startCurrentY + delta * 1.5; 
    }

    endDrag() {
        if (!this.isDragging) return;
        this.isDragging = false;
        this.container.style.cursor = 'grab';
        this.snapToNearest();
    }

    clampTarget() {
        const shift = this.getMobileOffset();
        // Add 'shift' to the center offset logic
        const screenCenterOffset = (window.innerHeight / 2) - (this.cardHeight / 2) + shift;
        
        const maxScroll = screenCenterOffset; 
        const minScroll = screenCenterOffset - ((this.cards.length - 1) * this.itemStride);
        
        if (this.targetY > maxScroll + 50) this.targetY = maxScroll + 50;
        if (this.targetY < minScroll - 50) this.targetY = minScroll - 50;
    }

    snapToNearest() {
        const shift = this.getMobileOffset();
        const screenCenterOffset = (window.innerHeight / 2) - (this.cardHeight / 2) + shift;

        let index = Math.round((screenCenterOffset - this.targetY) / this.itemStride);
        index = Math.max(0, Math.min(index, this.cards.length - 1));
        this.snapToIndex(index);
    }

    snapToIndex(index) {
        this.currentIndex = index; 
        
        const shift = this.getMobileOffset();
        const screenCenterOffset = (window.innerHeight / 2) - (this.cardHeight / 2) + shift;

        this.targetY = screenCenterOffset - (index * this.itemStride);
        
        const activeCard = this.cards[index];
        if(!activeCard) return;

        const tier = activeCard.dataset.tier || 'gold'; 
        const config = TIER_CONFIG[tier];

        if (config) {
            this.updateInterface(tier, config, activeCard);
        }
    }

    updateInterface(tier, config, activeCard) {
        const titleElements = document.querySelectorAll('[id="tierTitle"]');
        const subtitleElements = document.querySelectorAll('[id="tierSubtitle"]');
        const historyPanel = document.getElementById('historyPanel');
        const historyText = document.getElementById('historyText');
        
        titleElements.forEach(titleEl => {
            titleEl.style.color = config.color;
            titleEl.style.textShadow = `0 0 20px ${config.shadow}`;
            if (titleEl.innerText !== config.title) {
                titleEl.innerText = config.title;
            }
        });

        if(historyPanel) {
            historyPanel.style.borderLeftColor = config.color; 
        }

        if(this.focusFrame) {
            this.focusFrame.style.borderColor = config.color;
            this.focusFrame.style.boxShadow = `0 0 40px ${config.shadow}`;
        }

        if(historyText) {
            historyText.innerText = activeCard.getAttribute('data-history') || "";
            historyText.style.color = config.color;
            historyText.style.textShadow = `0 0 10px ${config.shadow}`;
        }

        subtitleElements.forEach(subEl => {
            if (subEl.innerText !== config.subtitle) {
                subEl.innerText = config.subtitle;
            }
             subEl.style.color = "whitesmoke"; 
        });

        document.querySelectorAll('.nav-item').forEach(item => {
            const isTarget = item.dataset.targetTier === tier;
            item.classList.toggle('active', isTarget);
            
            if (isTarget) {
                const pill = document.getElementById('navPill');
                if(pill) pill.style.borderColor = config.color;
                
                item.style.background = config.color;
                item.style.boxShadow = `0 0 15px ${config.shadow}`;
                item.style.color = 'black';
            } else {
                item.style.background = 'transparent';
                item.style.boxShadow = 'none';
                item.style.color = 'rgba(255,255,255,0.5)';
            }
        });

        if(historyText) {
            historyText.innerText = activeCard.getAttribute('data-history') || "";
            historyText.style.color = config.color;
            historyText.style.textShadow = `0 0 10px ${config.shadow}`;
        }
    }

    scrollToTier(tierName) {
        const index = this.tierIndices[tierName];
        if (index !== -1 && index !== undefined) {
            this.snapToIndex(index);
        }
    }

    animate() {
        if (!this.isDragging) {
            this.currentY += (this.targetY - this.currentY) * 0.1;
        }

        this.container.style.transform = `translate(-50%, ${this.currentY}px)`;
        
        // --- 1. Get Shift Amount ---
        const shift = this.getMobileOffset();
        
        // --- 2. Shift the "Focal Point" down by that amount ---
        const focalPoint = (window.innerHeight / 2) + shift;
        
        const isDesktop = window.innerWidth > 900; 
        
        let maxScale = isDesktop ? 1.5 : 1.2;
        let minScale = isDesktop ? 0.6 : 0.2;

        // --- 3. Shift the Focus Frame down using CSS calc() ---
        if (this.focusFrame) {
            this.focusFrame.style.transform = `translate(-50%, calc(-50% + ${shift}px)) scale(${maxScale})`;
        }

        this.cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const dist = Math.abs(focalPoint - centerY);
            
            let normDist = Math.min(dist / (window.innerHeight * 0.5), 1);
            
            const scaleDropoff = Math.pow(normDist, 2); 
            let scale = maxScale - (scaleDropoff * (maxScale - minScale));
            if (scale < minScale) scale = minScale;

            card.style.transform = `scale(${scale})`;

          // --- OPACITY FIX ---
            // 1. Calculate opacity based on distance. 
            //    The '* 1.5' makes it fade faster. Higher number = faster fade.
            let activeOpacity = Math.max(0.45, 1 - (normDist * 1.5)); 

            // 2. Apply opacity to the WHOLE card (this fades the circle/logo too)
            card.style.opacity = activeOpacity;
            // -------------------

            // Update background and shadow to match
            card.style.background = `linear-gradient(135deg, rgba(11, 11, 11, ${ activeOpacity}) 0%, rgba(0, 0, 0, ${activeOpacity}) 100%)`;
            card.style.boxShadow = `0 0 3.5px rgba(255, 255, 255, ${.25 * activeOpacity})`;
            
            // Blur effect
            card.style.filter = `blur(${normDist * 10}px)`; 
            
            card.style.zIndex = Math.round(100 - normDist * 100);
        });

        requestAnimationFrame(() => this.animate());
    }
}

// === INITIALIZATION ===
const gridElement = document.getElementById('mainGrid');

if(gridElement) {
    const slider = new UnifiedSlider(gridElement);

    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const tier = item.dataset.targetTier;
            slider.scrollToTier(tier);
        });
    });
}
