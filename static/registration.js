import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js";

// --- Mobile Menu Toggle ---
const menuToggle = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
menuToggle.addEventListener('click', () => mobileMenu.classList.toggle('active'));


// --- Three.js Background Animation ---

// 1. Setup Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('background'), alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.set(0, 1, 0.3); 
camera.rotation.set(Math.PI/2, 0, -Math.PI/6);

// 2. Shaders (Vertex & Fragment)
const vertexShader = `
    uniform float size; 
    uniform float scale; 
    uniform float time;
    varying float vFogDepth;

    float random(vec2 co){ return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453); }
    
    float noise(vec2 st) {
        vec2 i = floor(st); vec2 f = fract(st);
        float a = random(i); float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0)); float d = random(i + vec2(1.0, 1.0));
        vec2 u = f*f*(3.0-2.0*f);
        return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
    }

    void main() {
        vec3 temp = position;
        // Add wave movement via noise
        temp.z = noise(temp.xy + vec2(0.0, time * 0.5)) * 0.3;
        
        vec4 mvPosition = modelViewMatrix * vec4(temp, 1.0);
        gl_PointSize = size * ( scale / - mvPosition.z );
        vFogDepth = -mvPosition.z;
        gl_Position = projectionMatrix * mvPosition;
    }
`;

const fragmentShader = `
    uniform vec3 diffuse; 
    varying float vFogDepth; 
    void main() { 
        // Create circle particles
        if (length(gl_PointCoord - 0.5) > 0.5) discard; 
        // Fade distant particles
        gl_FragColor = vec4(diffuse, 1.4 / vFogDepth); 
    }
`;

// 3. Create Grid Geometry
const geometry = new THREE.BufferGeometry();
const res = 180; // Grid resolution
const pos = new Float32Array(res * res * 3);

for(let i = 0; i < res; i++) {
    for(let j = 0; j < res; j++) {
        const index = (i * res + j) * 3;
        pos[index + 0] = 5 * (2 * j / (res - 1) - 1); // X
        pos[index + 1] = 12 * i / (res - 1);          // Y
        // Z is handled by shader
    }
}
geometry.setAttribute('position', new THREE.BufferAttribute(pos, 3));

// 4. Material & Mesh
const material = new THREE.ShaderMaterial({ 
    uniforms: { 
        diffuse: { value: new THREE.Color(0xFFD700) }, 
        size: { value: 20 }, 
        scale: { value: 1 }, 
        time: { value: 0 } 
    }, 
    vertexShader, 
    fragmentShader, 
    transparent: true 
});

scene.add(new THREE.Points(geometry, material));

// 5. Animation Loop
const clock = new THREE.Clock();

function animate() { 
    material.uniforms.time.value += clock.getDelta(); 
    renderer.render(scene, camera); 
    requestAnimationFrame(animate); 
}
animate();

// 6. Handle Resize
window.addEventListener('resize', () => { 
    camera.aspect = window.innerWidth / window.innerHeight; 
    camera.updateProjectionMatrix(); 
    renderer.setSize(window.innerWidth, window.innerHeight); 
});