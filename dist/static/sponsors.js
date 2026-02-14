//not generating summary for dis cuz pretty organized already with comments


/* =========================================
   2. UNIFIED VERTICAL SCROLLER
   ========================================= */

// Configuration for each tier
const TIER_CONFIG = {
    gold:   { title: "SPONSORS",   subtitle: "The elixir of eXabyte 2026",          color: "#ffea00", shadow: "rgba(255, 234, 0, 0.5)" },
    silver: { title: "SPONSORS", subtitle: "The elixir of eXabyte 2026", color: "#C0C0C0", shadow: "rgba(192, 192, 192, 0.5)" },
    bronze: { title: "SPONSORS", subtitle: "The elixir of eXabyte 2026",      color: "#cd7f32", shadow: "rgba(205, 127, 50, 0.5)" }
};

/* =========================================
   PASTE THIS OVER YOUR UnifiedSlider CLASS
   ========================================= */
class UnifiedSlider {
    constructor(element) {
        if (!element) return;
        
        this.container = element; 
        this.cards = Array.from(element.querySelectorAll('.card'));
        
        if (this.cards.length === 0) return;

        // Physics variables
        this.currentY = 0;
        this.targetY = 0;
        this.isDragging = false;
        this.startY = 0;
        this.startCurrentY = 0;
        this.currentIndex = 0; // NEW: Track which card is active
        
        // Find start indices
        this.tierIndices = {
            gold: this.cards.findIndex(c => c.dataset.tier === 'gold'),
            silver: this.cards.findIndex(c => c.dataset.tier === 'silver'),
            bronze: this.cards.findIndex(c => c.dataset.tier === 'bronze')
        };

        // Initialize Dimensions
        this.updateDimensions(); // NEW: Extracted to a function

        this.initEvents();
        this.animate();
        this.snapToIndex(0);

        // NEW: Listen for resize to fix layout instantly
        window.addEventListener('resize', () => this.handleResize());
    }

    // NEW FUNCTION: Recalculates sizes when screen changes
    updateDimensions() {
        const style = window.getComputedStyle(this.container);
        const gap = parseFloat(style.gap) || 0;
        // Force a read of the new card height from CSS
        this.cardHeight = this.cards[0].offsetHeight || 300; 
        this.itemStride = this.cardHeight + gap;
    }

    // NEW FUNCTION: Handles the resize event
    handleResize() {
        this.updateDimensions();
        // Snap back to the current card so we don't get lost
        this.snapToIndex(this.currentIndex);
    }

    initEvents() {
        // ... (Keep your existing initEvents code exactly the same) ...
        // COPY PASTE YOUR OLD initEvents HERE
        // OR JUST LEAVE IT ALONE IF YOU ARE EDITING IN PLACE
        
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
        const screenCenterOffset = (window.innerHeight / 2) - (this.cardHeight / 2);
        const maxScroll = screenCenterOffset; 
        const minScroll = screenCenterOffset - ((this.cards.length - 1) * this.itemStride);
        
        if (this.targetY > maxScroll + 50) this.targetY = maxScroll + 50;
        if (this.targetY < minScroll - 50) this.targetY = minScroll - 50;
    }

    snapToNearest() {
        const screenCenterOffset = (window.innerHeight / 2) - (this.cardHeight / 2);
        let index = Math.round((screenCenterOffset - this.targetY) / this.itemStride);
        index = Math.max(0, Math.min(index, this.cards.length - 1));
        this.snapToIndex(index);
    }

    snapToIndex(index) {
        this.currentIndex = index; // UPDATE: Save the index!
        
        const screenCenterOffset = (window.innerHeight / 2) - (this.cardHeight / 2);
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
        // FIX 1: Select ALL elements with this ID (hack for duplicate IDs in your HTML)
        const titleElements = document.querySelectorAll('[id="tierTitle"]');
        const subtitleElements = document.querySelectorAll('[id="tierSubtitle"]');
        const historyPanel = document.getElementById('historyPanel');
        const historyText = document.getElementById('historyText');
        
        // FIX 2: Loop through all title elements (Desktop Sidebar + Mobile Header)
        titleElements.forEach(titleEl => {
            // Apply Color INSTANTLY (Don't wait for text change)
            titleEl.style.color = config.color;
            titleEl.style.textShadow = `0 0 20px ${config.shadow}`;
            
            // Only fade/animate if the TEXT actually needs to change
            if (titleEl.innerText !== config.title) {
                titleEl.innerText = config.title;
            }
        });

        if(historyPanel) {
            // THIS LINE overrides the CSS "border-left" color dynamically
            historyPanel.style.borderLeftColor = config.color; 
        }

        if(historyText) {
            historyText.innerText = activeCard.getAttribute('data-history') || "";
            historyText.style.color = config.color;
            historyText.style.textShadow = `0 0 10px ${config.shadow}`;
        }

        // Update Subtitles
        subtitleElements.forEach(subEl => {
            if (subEl.innerText !== config.subtitle) {
                subEl.innerText = config.subtitle;
            }
            // Optional: Match subtitle color to tier color
             subEl.style.color = "whitesmoke"; // Or config.color if you want that too
        });

        // Update Nav Pills (Your existing logic)
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

        // Update History Panel
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
        
        const focalPoint = (window.innerHeight / 2);
        const isDesktop = window.innerWidth > 900;

        this.cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const centerY = rect.top + rect.height / 2;
            const dist = Math.abs(focalPoint - centerY);
            
            let normDist = Math.min(dist / (window.innerHeight * 0.5), 1);
            
            let maxScale = isDesktop ? 1.5 : 1.2;
            let minScale = isDesktop ? 0.6 : 0.2;

            const scaleDropoff = Math.pow(normDist, 2); 
            let scale = maxScale - (scaleDropoff * (maxScale - minScale));
            if (scale < minScale) scale = minScale;

            card.style.transform = `scale(${scale})`;
            card.style.filter = `blur(${normDist * 10}px) brightness(${1 - normDist * 0.5})`;
            card.style.opacity = Math.max(1 - normDist, 0.3);
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
    
//     function applySmartZoom() {
//         const width = window.outerWidth; 
//         if (width > 1600) {
//             document.body.style.zoom = "125%";
//         } else {
//             document.body.style.zoom = "100%";
//         }
//     }
//     applySmartZoom();
//     window.addEventListener('resize', applySmartZoom);
// } else {
//     console.error("CRITICAL ERROR: #mainGrid not found in HTML.");
}
