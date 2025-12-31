import * as THREE from "three";
import { gsap } from "gsap";

// We create a map from the loaded data
export class Map {
    constructor(data) {

        // Load all the normal data man
        this.eyeLevel = data.eyeLevel
        this.voxelSize = data.voxelSize
        this.voxelHeight = data.voxelHeight
        this.corridorLength = data.corridorLength
        this.corridorCount = data.corridorCount
        this.startPosition = data.startPosition

        // Generate walk geometry and other nonsense
        this.currentWalkPoint = -1
        this.walkPoints = []
        this.walkGeometry = []
        this.generateWalkPoints()
        this.walkPointsAnimation = null;

        // If we are animating movements and stuff, do not register more triggers
        this.isAnimatingMovement = false

        // Load the particle volumes
        this.particleTextures = []
        this.banners = []

        this.textureLoader = new THREE.TextureLoader();
        for(const v of data.volumes) {
            const tex = this.textureLoader.load(v, (boop) => {
                boop.colorSpace = THREE.SRGBColorSpace
            })
            this.particleTextures.push(tex)
        }

        console.log(this.particleTextures)
    }

    generateTexturePlanes(scene, camera) {

        const start = {...this.startPosition}

        for(let i = 0; i < this.corridorCount; i++) {
            const pos = {...start}
            pos.y = this.eyeLevel
            let rot = 0
            
            const k = this.corridorLength * this.voxelSize
            if(i % 2 == 0) {
                pos.z += k * 1.5
                start.z += k
                rot = 0
            }
            else {
                pos.x += k * 1.5
                start.x += k
                rot = -Math.PI/2
            }

            // The 175 by 248 number was picked up from the picture size,
            // don't change this aspect ratio this year
            pos.z *= -1
            const p = new ParticleVolumes(pos, 3 * this.voxelSize * 175/248,
                3 * this.voxelSize, rot, this.particleTextures[i], scene, i, this.corridorCount - 1)
            p.addToScene(scene)

            // keep it disabled people
            p.points.visible = false;

            this.banners.push(p)
        }
    }

    // Generates a bunch of walkpoints where the weird folks can walk on
    generateWalkPoints() {

        const start = {...this.startPosition}

        // Direction of look
        const box = new THREE.BoxGeometry(this.voxelSize * 1.2, this.voxelHeight/3, this.voxelSize * 1.2);

        const colors = new Float32Array(6 * 4 * 4);
        for(let i = 0; i < colors.length; i += 4) {

            colors[i + 0] = 0xFD / 8;
            colors[i + 1] = 0xDC / 8;
            colors[i + 2] = 0x5C / 8;
            colors[i + 3] = 1.0;
        }

        colors[0 * 16 + 3 + 0] = 0.0;
        colors[0 * 16 + 3 + 4] = 0.0;

        colors[1 * 16 + 3 + 0] = 0.0;
        colors[1 * 16 + 3 + 4] = 0.0;

        colors[4 * 16 + 3 + 0] = 0.0;
        colors[4 * 16 + 3 + 4] = 0.0;

        colors[5 * 16 + 3 + 0] = 0.0;
        colors[5 * 16 + 3 + 4] = 0.0;

        colors[2 * 16 + 3 + 0] = 0.0;
        colors[2 * 16 + 3 + 4] = 0.0;
        colors[2 * 16 + 3 + 8] = 0.0;
        colors[2 * 16 + 3 + 12] = 0.0;

        box.setAttribute('color', new THREE.BufferAttribute(colors, 4));


        for(let i = 0; i <= this.corridorCount; i += 1) {

            const material = new THREE.MeshStandardMaterial({vertexColors: true, transparent: true, side: THREE.DoubleSide});

            const mesh = new THREE.Mesh(box, material);

            this.walkPoints.push({...start})

            mesh.position.x = start.x * this.voxelSize
            mesh.position.y = -this.voxelHeight/3.;
            mesh.position.z = -start.z * this.voxelSize

            this.walkGeometry.push(mesh)

            if(i % 2 == 0) {

                // Flip direction mate
                start.z += this.corridorLength
            }
            else {

                // Flip direction mate
                start.x += this.corridorLength
            }
        }

        this.currentWalkPoint = 0
    }

    // Get a a bunch of Surface Carpets, for fun
    // We also add a bunch of lights here because otherwise everything is just damn ugly
    generateCarpet(scene) {

        const light = new THREE.AmbientLight('white', 0.5);
        scene.add(light)

        const depth = 1.0;
        const plane = new THREE.BoxGeometry(this.voxelSize * 1.2, this.voxelSize * (this.corridorLength - 1.2), depth);
        const material = new THREE.MeshStandardMaterial({ color: 0x27292b });
        const othermaterial = new THREE.MeshStandardMaterial({ color: 'gold' });

        for(let i = 0; i < this.walkGeometry.length; i++) {
            const newlight = new THREE.PointLight('white', 8000.0);
            const thing = {...this.walkGeometry[i].position}
            newlight.position.set(thing.x, this.eyeLevel * 2., thing.z)
            scene.add(newlight)
        }

        //const onsidebox = new THREE.BoxGeometry(1.0, this.voxelSize * 1.2, this.voxelSize * (this.corridorLength - 1.2));
        //const material = new THREE.MeshStandardMaterial({ color: 0xFDD5C });

        for(let i = 1; i <= this.corridorCount; i++) {
  
            const start = this.walkGeometry[i].position
            //const end = this.walkGeometry[i + 1].position

            let x = start.x;
            let z = start.z;
            const y = -this.voxelHeight / 2;

            const mesh = new THREE.Mesh(plane, material);
            mesh.position.set(x, y + depth/2.0, z);
            mesh.rotation.x = -Math.PI/2;

            // Horizontal corridor
            if(i % 2 == 0) {
                z += this.corridorLength * this.voxelSize;
                mesh.rotation.z = -Math.PI/2;
                mesh.position.x -= this.corridorLength * this.voxelSize * 0.5
            }
            // Vertical corridor
            else {
                x += this.corridorLength * this.voxelSize;
                mesh.position.z += this.corridorLength * this.voxelSize * 0.5
            }

            mesh.scale.y = 0.99
            scene.add(mesh);

            const cooker = mesh.clone()
            cooker.material = othermaterial 
            cooker.scale.set(1.2, 1.391, 1.2)
            cooker.position.y -= depth+0.2;
            scene.add(cooker);
        }
    }

    visibilityAccessor(camera) {
        // for sanity check some stuff.
        for(let i = 0; i < this.banners.length; i++)
        {
            if(Math.abs(this.currentWalkPoint - 1 - i) <= 1)
            {
                gsap.to(this.banners[i].points.material.uniforms.size, {
                    value: window.devicePixelRatio,
                    onComplete: () => {
                        this.banners[i].points.visible = true;
                    }
                });
            }
            else {
                if(this.banners[i].points.visible) {
                    gsap.to(this.banners[i].points.material.uniforms.size, {
                        value: 0.0,
                        onComplete: () => {
                            this.banners[i].points.visible = false;
                        }
                    });
                }
            }
        }
    }

    // This will control walks and stuff
    generateListeners(camera, canvas) {

        let touchWho = null;
        const raycaster = new THREE.Raycaster();

        // Either you click or you  touch eitherway its the same thing

        const click_handler = (eve) => {
            // Do nothing
            if(this.isAnimatingMovement)
                return;
            else
            {
                // First Thing is to check if we are hitting any actual Walk Points.
                // Otherwise we can just keep on cooking normally.
                const rect = canvas.getBoundingClientRect()
                const x = (eve.clientX - rect.left) * canvas.width / rect.width;
                const y = (eve.clientY - rect.top) * canvas.height / rect.height;
                const rx = x / canvas.width * 2 - 1;
                const ry = 1 - y / canvas.height * 2;

                const tar = {x: rx, y: ry};

                // Project ray into scene
                raycaster.setFromCamera(tar, camera);

                let who = undefined 
                if(this.currentWalkPoint <= 0)
                    who = raycaster.intersectObjects([ this.walkGeometry[this.currentWalkPoint + 1] ]);

                else if(this.currentWalkPoint >= this.corridorCount)
                    who = raycaster.intersectObjects([ this.walkGeometry[this.currentWalkPoint - 1] ]);

                else
                    who = raycaster.intersectObjects([ this.walkGeometry[this.currentWalkPoint - 1],
                                                       this.walkGeometry[this.currentWalkPoint + 1] ]);

                console.log(who, this.currentWalkPoint)
                if(who.length > 0)
                {
                    this.oldWalkPoint = this.currentWalkPoint

                    let walk_back = false;
                    if( who[0].object == this.walkGeometry[this.currentWalkPoint - 1] )
                    {
                        walk_back = true;
                        this.currentWalkPoint--;
                    }
                    else if( who[0].object == this.walkGeometry[this.currentWalkPoint + 1] )
                        this.currentWalkPoint++;

                    this.isAnimatingMovement = true;

                    console.log(who[0].object.material)
                    const old = who[0].object.material.color.b;
                    who[0].object.material.color.b = 0xFF;

                    gsap.to(camera.position, {
                        x: who[0].object.position.x,
                        z: who[0].object.position.z,
                        y: this.eyeLevel,
                        duration: 2,
                        onStart: () => {
                            // Reset to original state if something is there to reset
                            this.banners[this.oldWalkPoint - 1]?.reverse()
                        },
                        onComplete: () => {
                            this.isAnimatingMovement = false
                            who[0].object.material.color.b = old;

                            // Plays an animation after bro reaches the correct spot
                            this.banners[this.currentWalkPoint - 1]?.play()

                            this.visibilityAccessor(camera);
                        }
                    })

                    let angle = (this.currentWalkPoint % 2 - 1) * Math.PI/2;
                    if(this.currentWalkPoint == 0)
                        angle = 0;
                    gsap.to(camera.rotation, {
                        y: angle,
                        duration: 2
                    })
                }
            }
        }

        const rotation_handler = eve => {

            if(this.isAnimatingMovement)
                return;

            const rect = canvas.getBoundingClientRect()
            const px = (eve.clientX - rect.left) / rect.width;

            // Don't rotate at all if dude is zero
            if(this.currentWalkPoint == 0)
                return;

            if(this.currentWalkPoint == this.walkGeometry.length - 1) {
                gsap.to(camera.rotation, {
                    y: -Math.PI,
                    onComplete: () => {
                        this.isAnimatingMovement = false
                    }
                })
                return;
            }

            if(px < 0.3) {

                // Don't rotate left is dude is odd
                if(this.currentWalkPoint % 2 != 0)
                    return;

                let angle = camera.rotation.y + Math.PI / 2

                this.isAnimatingMovement = true;

                gsap.to(camera.rotation, {
                    y: angle,
                    onComplete: () => {
                        this.isAnimatingMovement = false
                    }
                })
            }
            if(px > 0.7) {

                // Don't rotate right is dude is even
                if(this.currentWalkPoint % 2 == 0)
                    return;

                const angle = camera.rotation.y - Math.PI / 2

                this.isAnimatingMovement = true;

                gsap.to(camera.rotation, {
                    y: angle,
                    onComplete: () => {
                        this.isAnimatingMovement = false
                    }
                })
            }
        }

        window.addEventListener('click', click_handler)
        window.addEventListener('touchstart', click_handler)

        const k = document.querySelectorAll('.clicker');
        for(const t of k) {
            t.addEventListener('click', rotation_handler)
            t.addEventListener('touchstart', rotation_handler)
        }
    }
}

const vertexShader = `
    varying float vFogDepth;

    uniform float size;
    uniform float time;
    uniform float dooup;
    attribute vec2 angles;

    uniform mat3 uvTransform;
    varying vec2 vUV;

    float weird(float angle) {
        return (cos(angle * 3.0) - 0.8 * sin(angle * 5.0) + 0.5 * cos(7.0 * angle) + 5.0) * 10.0 * dooup;
    }

    void main() {

        vec3 temp = position;

        vUV = (uvTransform * vec3(uv, 1.0)).xy;

        float mt = time * 1.2;

        temp.x += weird(time * 0.1) * sin(angles.x + mt * 0.7) * cos(angles.y + mt * 0.3);
        temp.y += weird(time * 0.1) * sin(angles.x + mt * 0.7) * sin(angles.y + mt * 0.3);
        temp.z += weird(time * 0.1) * cos(angles.x + mt * 0.7);

        vec4 mvPosition = modelViewMatrix * vec4(temp, 1.0);
        gl_Position = projectionMatrix * mvPosition;

        gl_PointSize = size * (2400.0 / -mvPosition.z) * (cos((temp.y + temp.z)/3.0 + 2.0*mt) * dooup + 2.0) / 2.0;
        vFogDepth = -mvPosition.z;
    }
`;

const fragmentShader = `

    uniform float dooup;
    uniform sampler2D tex;
    varying vec2 vUV;

    uniform float fogNear;
    uniform float fogFar;
    uniform float fogDensity;
    uniform vec3  fogColor;
    varying float vFogDepth;

    void main() {

        float t = distance(gl_PointCoord.xy, vec2(0.5, 0.5));
        if(t > max(1.0 - dooup, 0.5))
            discard;

        vec4 color = texture(tex, vUV);
        color.r = pow(color.r, 0.25);
        color.g = pow(color.g, 0.25);
        color.b = pow(color.b, 0.25);

        color = mix(vec4(1.0, 0.8, 0.4, 1.0) * color * 3.0, color, 1.0 - dooup);

        float fogFactor = pow(smoothstep(fogNear, fogFar, vFogDepth), 10.0);

        gl_FragColor = vec4(mix(color.rgb, fogColor, fogFactor), max(5.0 * (1.0 - dooup), 0.25));
    }
`;

// we create a volume of particles
// particles move about randomly slowly
export class ParticleVolumes {
    constructor(pos, width, height, rot, texture, scene, indx, last) {
        this.pos = pos

        this.indx = indx
        this.last = last

        // MAIN PICTURE
        this.geometry = new THREE.PlaneGeometry(width, height, 1, 1)

        this.basicPlanerMaterial = new THREE.MeshBasicMaterial({ color: 'white', map: texture });

        this.mesh = new THREE.Mesh(this.geometry, this.basicPlanerMaterial);
        this.mesh.rotation.y = rot
        this.mesh.position.x = pos.x - Math.sin(rot)
        this.mesh.position.y = pos.y
        this.mesh.position.z = pos.z - Math.cos(rot)

        // BACK PLANE
        this.backplaneGeom = new THREE.PlaneGeometry(width + 2, height + 2, 1, 1)
        this.backplaneMatr = new THREE.MeshStandardMaterial({ color: new THREE.Color(1000, 255, 255) })
        this.backplane = new THREE.Mesh(this.backplaneGeom, this.backplaneMatr)

        this.backplane.rotation.y = rot
        this.backplane.position.x = pos.x - Math.sin(rot) * 1.01
        this.backplane.position.y = pos.y
        this.backplane.position.z = pos.z - Math.cos(rot) * 1.01

        // The Pixels
        this.pixelMaterial = new THREE.ShaderMaterial( {
            uniforms: {
                time: { value: 0 },
                tex: {value: texture},
                dooup: {value: 1.0},
                size: {value: window.devicePixelRatio},
                uvTransform: {value: texture.matrix},
                fogNear: {value: scene.fog.near},
                fogFar: {value: scene.fog.far},
                fogDensity: {value: 2.0},
                fogColor: {value: scene.fog.color}
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            fog: true
        });

        console.log(this.pixelMaterial)

        // Don't fk with the segment count, ik the points are huge, but perf will die otherwise
        this.crook = new THREE.PlaneGeometry(width, height, 8, 11)

        const angles = new Float32Array(9 * 12 * 2);
        for(let i = 0; i < angles.length; i++)
            angles[i] = Math.random() * Math.PI * 2;
        this.crook.setAttribute('angles', new THREE.BufferAttribute(angles, 2));

        this.points = new THREE.Points(this.crook, this.pixelMaterial);
        this.points.rotation.y = rot
        this.points.position.x = pos.x
        this.points.position.y = pos.y
        this.points.position.z = pos.z

        this.animation = gsap.timeline({paused: true, ease: 'elastic'});
        this.animation
        .fromTo(this.pixelMaterial.uniforms.dooup, {
            value: 1.0,
            duration: 1.8,
        }, {
            value: 0.0,
            duration: 1.8,
        }, 0)

        .fromTo(this.backplane, {
            visible: false,
            duration: 0.01
        }, {
            visible: true,
            duration: 0.01
        }, 1.8)

        .fromTo(this.mesh, {
            visible: false,
            duration: 0.01
        }, {
            visible: true,
            duration: 0.01
        }, 1.8)

        .fromTo(this.pixelMaterial.uniforms.size, {
            value: window.devicePixelRatio,
            duration: 0.8,
        }, {
            value: 0.0,
            duration: 0.8,
        })

        .fromTo(this.points, {
            visible: true,
            duration: 0.01
        }, {
            visible: false,
            duration: 0.01
        })

        if(this.indx + 1 != 0) {
            
            let selector = '';
            if(this.indx == this.last) {
                selector = '.clicker'
            }
            else if(this.indx % 2 == 0) {
                selector = '.right-gradient'
            }
            else {
                selector = '.left-gradient'
            }

            this.animation
            .fromTo(selector, {
                opacity: 0.0,
                duration: 0.5
            }, {
                opacity: 1.0,
                duration: 0.5
            })
        }
    }

    addToScene(scene) {
        this.points.visible = true
        this.mesh.visible = false
        this.backplane.visible = false

        scene.add(this.mesh)
        scene.add(this.backplane)
        scene.add(this.points)
    }

    play() {
        this.animation.play()
    }

    reverse() {
        this.animation.reverse()
    }

    update() {
        if(this.points.visible)
            this.pixelMaterial.uniforms.time.value = performance.now()/1000
    }
}

const data = {
    eyeLevel: 2,
    voxelSize: 16,
    voxelHeight: 24,
    corridorLength: 8,
    corridorCount: 5,
    startPosition: {
        x: 0,
        z: 0
    },
    volumes: [
        "assets/x-cryptus/vol1.jpg",
        "assets/x-cryptus/vol2.jpg",
        "assets/x-cryptus/vol3.jpg",
        "assets/x-cryptus/vol4.jpg",
        "assets/x-cryptus/vol4.jpg"
    ]
}

// Setting up the renderer
const canvas = document.getElementById('xcryptus');
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight, false);

// Setting up the camera
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, data.corridorLength * 1.5 * data.voxelSize + 100);

// Update the canvas on resize of things
window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight, false);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

// Setting up the scene
const scene = new THREE.Scene();
scene.fog = new THREE.Fog('black', 1, data.corridorLength * 1.5 * data.voxelSize + 80);

const map = new Map(data)
map.generateTexturePlanes(scene, camera);
map.generateCarpet(scene);
map.visibilityAccessor(camera);

camera.position.set(0, map.eyeLevel, 0);

for(const m of map.walkGeometry)
    scene.add(m)

map.generateListeners(camera, canvas);
//console.log(map.particleTextures[0])
//
function renderScene(time) {
    time *= 0.001; // Convert to seconds

    for(const k of map.banners)
        k.update()

    renderer.render(scene, camera);
}

renderer.setAnimationLoop(renderScene)

console.log(map.walkPoints)

console.log('Done!')
