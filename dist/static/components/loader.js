// Thanks Debaprabha for the amazing loader file, I have made some changes to fit it into the actual thing

import * as THREE from "three";

const scene = new THREE.Scene();

scene.fog = new THREE.FogExp2( 0x160D08, 0.004);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1500
);

const renderer = new THREE.WebGLRenderer({
    antialias: false,
    powerPreference: "high-performance",
    alpha: true,
    canvas: document.getElementById('loader-thingbert')
});
/*
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.left = '0px';
    renderer.domElement.style.top= '0px';
    renderer.domElement.style.zIndex= '100';
    */

renderer.setClearColor(0x160D08, 1);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));

const R = 4;     // dis be radius of cylinder 
const K = 1200;  
const lambda = 0.4; //koto ta berobe / tunnel korbe 

let tunnel_kotdur = 0;     // 0 → 1 obdhi, just kotdur tunnel ta khulechhe dekhaar jonyo 
let logoGoesFwoosh  = false;

let glitchPulsesLeft = 3;
let glitchTimer = 0;
let glitchActive = false;

let logoExitTimer = 0;
let logoExiting = false;

let animatorId = 0;
let screenRemoveTimer = 0.3;

let logoExitVelocity = 0;

const LOGO_EXIT_MAX_SPEED = 1.8;

const isMobile = /Mobi|Android/i.test(navigator.userAgent);
const starCount = isMobile ? 18000 : 60000;

const positionsArr = new Float32Array(starCount * 2 * 3);

//  Vector3[] replacement with array kaaron i'm pretty sure eibar karor phone melt hoye jaabe atp
const directions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount; i++) {

    const theta = Math.random() * Math.PI * 2;
    const z = -Math.random() * K;

    const x = R * Math.cos(theta);
    const y = R * Math.sin(theta);

    const base = i * 6;

    positionsArr[base]     = x;
    positionsArr[base + 1] = y;
    positionsArr[base + 2] = z;

    positionsArr[base + 3] = x;
    positionsArr[base + 4] = y;
    positionsArr[base + 5] = z;

    const rx = Math.cos(theta) * lambda;
    const ry = Math.sin(theta) * lambda;
    const rz = 1.0;

    const len = Math.sqrt(rx*rx + ry*ry + rz*rz);

    const di = i * 3;
    directions[di]     = rx / len;
    directions[di + 1] = ry / len;
    directions[di + 2] = rz / len;
}

const starGeometry = new THREE.BufferGeometry();
starGeometry.setAttribute('position', new THREE.BufferAttribute(positionsArr, 3));

const loadingManager = new THREE.LoadingManager();

// const texture = new THREE.TextureLoader(loadingManager).load('./star_option_3.png');

const exa_pal = [
    new THREE.Color('#C39A22'),
    new THREE.Color('#FFD700'),
    new THREE.Color('#FDDC5C'),
    new THREE.Color('#FFFFFF'),
    new THREE.Color('#FFFFF0'),
    new THREE.Color('#F5F5DC'),
    new THREE.Color('#000000'),
    new THREE.Color('#160D08'),
    new THREE.Color('#27292B')
];

const colors = new Float32Array(starCount * 2 * 3);

for (let i = 0; i < starCount; i++) {
    const c = exa_pal[Math.floor(Math.random() * exa_pal.length)];
    const base = i * 6;

    colors[base]     = c.r;
    colors[base + 1] = c.g;
    colors[base + 2] = c.b;

    colors[base + 3] = c.r;
    colors[base + 4] = c.g;
    colors[base + 5] = c.b;
}

starGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3)
);

const starMaterial = new THREE.LineBasicMaterial({
    transparent: true,
    opacity: 0.5,
    vertexColors: true,
    fog: true,
    linewidth: 1,
    depthWrite: false
});

const stars = new THREE.LineSegments(starGeometry, starMaterial);
scene.add(stars);

const logoTexture = new THREE.TextureLoader(loadingManager)
    .load('assets/logo.png');

const vertexShaderSrc = `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `;

const fragmentShaderSrc = `
        uniform sampler2D uTexture;
        uniform float uTime;
        uniform float uGlitch;
        uniform float uScanline;
        varying vec2 vUv;

        float rand(vec2 co){
          return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
        }

        void main() {

          vec2 uv = vUv;

          if (uGlitch > 0.5) {

            float line = sin((uv.y + uTime * 3.0) * 120.0) * 0.02 * uScanline;
            uv.x += line;

            float jitter = (rand(vec2(uTime, uv.y)) - 0.5) * 0.03;
            uv.x += jitter;
          }

          gl_FragColor = texture2D(uTexture, uv);
        }
      `;

const logoMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
        uTime: { value: 0 },
        uGlitch: { value: 0 },
        uScanline: { value: 0 },
        uTexture: { value: logoTexture }
    },
    vertexShader: vertexShaderSrc,
    fragmentShader: fragmentShaderSrc
});

const logo = new THREE.Mesh(
    new THREE.PlaneGeometry(3, 1),
    logoMaterial
);

logo.position.z = -2;
logo.visible = true;
logo.scale.set(0.0001, 0.0001, 1);

scene.add(logo);

let logoSettled = false;

const positions = stars.geometry.attributes.position.array;

const speedNormal = 3.2;
const speedExit = 1.6;
const spawnZ = -K;

// camera-aware visible size helpers
function getVisibleHeightAtZ(z) {
    const distance = Math.abs(camera.position.z - z);
    const vFOV = THREE.MathUtils.degToRad(camera.fov);
    return 2 * Math.tan(vFOV / 2) * distance;
}

function getVisibleWidthAtZ(z) {
    return getVisibleHeightAtZ(z) * camera.aspect;
}

let lastTime = performance.now();

function animate(now) { 

    animatorId = requestAnimationFrame(animate);

    const delta = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    tunnel_kotdur = Math.min(1, tunnel_kotdur + delta * 0.25);

    const t = Math.max(0, tunnel_kotdur - 0.25) / 0.75;
    const eased = Math.pow(t, 3);

    const targetScale = THREE.MathUtils.lerp(0.0001, 1.6, eased);

    const visibleHeight = getVisibleHeightAtZ(logo.position.z);
    const visibleWidth  = getVisibleWidthAtZ(logo.position.z);

    const logoAspect = logoTexture.image.height / logoTexture.image.width;

    const percentageLeft = 0.85

    const maxScaleFromHeight = (visibleHeight * percentageLeft) / (3 * logoAspect);
    const maxScaleFromWidth  = (visibleWidth  * percentageLeft) / 3;

    const maxAllowedScale = Math.min(
        maxScaleFromHeight * percentageLeft,
        maxScaleFromWidth * percentageLeft
    );

    const finalScale = Math.min(targetScale, maxAllowedScale);
    logo.scale.set(finalScale, finalScale, 1);

    if (finalScale >= maxAllowedScale * 0.98 && !logoSettled) {
        logoSettled = true;
        glitchPulsesLeft = 3;
        glitchTimer = 0;
    }

    if (logoSettled && glitchPulsesLeft > 0) {

        glitchTimer += delta;

        if (!glitchActive && glitchTimer > 0.35) {
            glitchActive = true;
            glitchTimer = 0;
        }

        if (glitchActive) {
            logoMaterial.uniforms.uGlitch.value = 1.0;
            logoMaterial.uniforms.uScanline.value = 1.0;

            if (glitchTimer > 0.12) {
                glitchActive = false;
                glitchTimer = 0;
                glitchPulsesLeft--;

                logoMaterial.uniforms.uGlitch.value = 0.0;
                logoMaterial.uniforms.uScanline.value = 0.0;
            }
        }
    }

    if (logoSettled && glitchPulsesLeft === 0 && !logoExiting) {
        logoExitTimer += delta;
        if (logoExitTimer > 1.0) logoExiting = true;
    }

    if (logoExiting) {
        logoExitVelocity = Math.min(LOGO_EXIT_MAX_SPEED, logoExitVelocity + delta);
        logo.position.z = Math.min(4, logo.position.z + logoExitVelocity);

        screenRemoveTimer -= delta;
        if(screenRemoveTimer <= 0)
        {
            cancelAnimationFrame(animatorId);
            renderer.domElement.remove();
            const eve = new Event('loaderLoaded')
            document.body.dispatchEvent(eve);
        }
        renderer.domElement.style.opacity = screenRemoveTimer / 0.3
    }

    const speed = logoExiting ? speedExit : speedNormal;

    for (let i = 0; i < starCount; i++) {

        const base = i * 6;
        const di = i * 3;

        // move shaamne of the line 
        positions[base]     += directions[di]     * speed;
        positions[base + 1] += directions[di + 1] * speed;
        positions[base + 2] += directions[di + 2] * speed;

        const streakLength = speed * (logoExiting ? 26.0 : 16.0);

        // move pechhone of the line ... the tail aarki
        positions[base + 3] = positions[base]     - directions[di]     * streakLength;
        positions[base + 4] = positions[base + 1] - directions[di + 1] * streakLength;
        positions[base + 5] = positions[base + 2] - directions[di + 2] * streakLength;

        if (positions[base + 2] > camera.position.z) {
            positions[base + 2] = spawnZ;
            positions[base + 5] = spawnZ;
        }
    }

    logoMaterial.uniforms.uTime.value += delta;
    stars.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}

loadingManager.onLoad = () => {
    animate(performance.now());
};

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
