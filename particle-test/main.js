import * as THREE from 'three';

// --- Scene Setup ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 8;
camera.position.y = -2;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// --- Shader Material ---
const uniforms = {
    uTime: { value: 0.0 }
};

const vertexShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float uTime;

    void main() {
        vNormal = normalize(normalMatrix * normal);
        vec3 pos = position;
        
        // Create a repeating drip cycle (0.0 to 1.0)
        float cycle = fract(uTime * 0.4); 
        float dripProgress = smoothstep(0.0, 0.8, cycle);
        
        // Only deform the bottom half of the cylinder
        if (pos.y < 1.0) {
            // Move downwards
            pos.y -= dripProgress * 6.0;
            
            // Calculate "necking" effect based on vertical position
            // This thins the mesh as it stretches
            float neck = 1.0 - (dripProgress * exp(-pow(pos.y + 1.0, 2.0) * 0.5));
            pos.xz *= max(neck, 0.1); 
        }
        
        vPosition = pos;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
`;

const fragmentShader = `
    varying vec3 vPosition;
    varying vec3 vNormal;
    uniform float uTime;

    void main() {
        // Heat calculation based on vertical position and flicker
        float noise = sin(vPosition.y * 5.0 - uTime * 15.0) * 0.1;
        float heat = 0.6 + 0.4 * sin(vPosition.y * 1.5 + noise);
        
        // Cooling effect at the very tip of the drip
        heat *= smoothstep(-7.0, -1.0, vPosition.y);

        // Color Ramp: Black -> Deep Red -> Orange -> Yellow-White
        vec3 cold = vec3(0.1, 0.0, 0.0);
        vec3 mid = vec3(1.0, 0.2, 0.0);
        vec3 hot = vec3(1.0, 0.9, 0.6);
        
        vec3 color = mix(cold, mid, heat);
        color = mix(color, hot, pow(heat, 5.0));
        
        // Simple rim lighting (Fresnel)
        float fresnel = pow(1.0 - max(dot(vNormal, vec3(0,0,1)), 0.0), 3.0);
        color += fresnel * 0.3;

        gl_FragColor = vec4(color, 1.0);
    }
`;

const material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    side: THREE.DoubleSide
});

// --- Geometry ---
// High segment count is CRITICAL for smooth deformation
const geometry = new THREE.CylinderGeometry(0.5, 0.5, 4, 64, 128);
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// --- Animation Loop ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    // Update time uniform
    uniforms.uTime.value = clock.getElapsedTime();
    
    // Rotate slightly for 3D effect
    mesh.rotation.y += 0.005;
    
    renderer.render(scene, camera);
}

// Handle Resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();