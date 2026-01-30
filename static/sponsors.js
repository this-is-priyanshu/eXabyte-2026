import * as THREE from "three";

const cs_navbar_observer = new IntersectionObserver((e) => {
    const who = document.querySelector('.cs-navbar')
    if (e[0].isIntersecting) {
        who.classList.add('cs-navbar-collapsed');
        who.classList.remove('cs-navbar-expanded');
    } else {
        who.classList.remove('cs-navbar-collapsed');
        who.classList.add('cs-navbar-expanded');
    }
}, { threshold: 1.0 });

const checker = document.querySelector('.cs-navbar-view-checker');
if (checker) cs_navbar_observer.observe(checker);

const cs_navbar_dialog = document.querySelector('.cs-hamburger-dialog');
const cs_closer = document.querySelector('#cs-dailog-closer');

cs_closer.addEventListener('touchstart', (e) => { cs_navbar_dialog.close(); e.stopPropagation(); });
cs_closer.addEventListener('click', (e) => { cs_navbar_dialog.close(); e.stopPropagation(); });

const cs_navbar_hamburger_button = document.querySelector('#cs-hamburger');

function func(e) {
    cs_navbar_hamburger_button.style.transform = 'scale(0.8)';
    setTimeout(() => cs_navbar_hamburger_button.style.transform = 'scale(1)', 200);
    cs_navbar_dialog.style.display = 'block';
    cs_navbar_dialog.showModal();
}

cs_navbar_hamburger_button.addEventListener('click', func);
cs_navbar_hamburger_button.addEventListener('touchstart', func);

const title = document.querySelector('title').textContent;
for (const p of document.querySelectorAll('.cs-navbar nav a')) {
    if (p.textContent.trim() == title) p.classList.add('cs-selected');
}

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

const vertexShader = `
uniform float size; uniform float scale; uniform float time; varying float vFogDepth;
float random(vec2 co){ return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453); }
float noise(vec2 st) {
    vec2 i = floor(st); vec2 f = fract(st);
    float s00 = random(i); float s01 = random(i + vec2(0.0, 1.0));
    float s10 = random(i + vec2(1.0, 0.0)); float s11 = random(i + vec2(1.0, 1.0));
    float dx1 = s10 - s00; float dx2 = s11 - s01; float dy1 = s01 - s00; float dy2 = s11 - s10;
    float a = smoothstep(0.0, 1.0, f.x); float b = smoothstep(0.0, 1.0, f.y);
    return s00 + a * dx1 + (1.0 - a) * b * dy1 + a * b * dy2;
}
void main() {
    gl_PointSize = size;
    vec3 temp = position;
    temp.z = noise(temp.xy + vec2(0.0, time * 0.5)) * 0.3;
    vec4 mvPosition = modelViewMatrix * vec4(temp, 1.0);
    gl_PointSize *= (scale / -mvPosition.z);
    vFogDepth = -mvPosition.z;
    gl_Position = projectionMatrix * mvPosition;
}
`;

const fragmentShader = `
uniform vec3 diffuse; uniform float fogNear; uniform float fogFar; uniform float fogDensity; uniform vec3 fogColor;
varying float vFogDepth;
void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(mix(diffuse, fogColor, 0.0), 1.4 / vFogDepth);
}
`;

const scene = new THREE.Scene();
scene.fog = new THREE.Fog(0, 5, 10);

const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
const canv = document.getElementById('background');
const renderer = new THREE.WebGLRenderer({ canvas: canv });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

const geometry = new THREE.BufferGeometry();
const height = 12;
const width = 5;
const res = 180;
const position = new Float32Array(res * res * 3);

for (let i = 0; i < res; i++) {
    for (let j = 0; j < res; j++) {
        const x = width * (2 * j / (res - 1) - 1);
        const y = height * i / (res - 1);
        const idx = (i * res + j) * 3;
        position[idx] = x + (i % 2 === 0 ? width / res : 0);
        position[idx + 1] = y;
        position[idx + 2] = 0;
    }
}

geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));

const material = new THREE.ShaderMaterial(THREE.ShaderLib.points);
material.uniforms.diffuse.value = new THREE.Color(0xFFDA00);
material.uniforms.size.value = 20;
material.uniforms.time = { value: 0 };
material.defines.USE_SIZEATTENUATION = true;
material.fog = true;
material.transparent = true;
material.fragmentShader = fragmentShader;
material.vertexShader = vertexShader;

const plane = new THREE.Points(geometry, material);
scene.add(plane);
scene.add(new THREE.AmbientLight(0xFFFFFF, 1));

camera.position.z = 0.3;
camera.position.y = 1;
camera.rotation.x = Math.PI / 2;
camera.rotation.z = -Math.PI / 6;

const clock = new THREE.Clock();

function animate() {
    material.uniforms.time.value += clock.getDelta();
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
