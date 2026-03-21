import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
camera.position.z = 1;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.PlaneGeometry(2, 2);

const uniforms = {
    uTime: { value: 0.0 },
    uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) }
};

const vertexShader = `
    varying vec2 vUv;
    void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
    }
`;

const fragmentShader = `
    uniform float uTime;
    uniform vec2 uResolution;
    varying vec2 vUv;

    // Polynomial smooth minimum for organic blending (Surface Tension)
    float smin(float a, float b, float k) {
        float h = max(k - abs(a - b), 0.0) / k;
        return min(a, b) - h * h * k * (1.0 / 4.0);
    }

    float sdSphere(vec3 p, float s) {
        return length(p) - s;
    }

    // The Scene SDF
    float map(vec3 p) {
        float cycle = fract(uTime * 0.3);
        float dripY = mix(1.2, -1.8, cycle);
        
        // 1. The main source mass (top)
        float source = sdSphere(p - vec3(0.0, 0.8, 0.0), 0.4);
        
        // 2. The falling drop
        // We stretch the sphere on the Y axis as it falls to simulate viscosity
        vec3 dropPos = p - vec3(0.0, dripY, 0.0);
        float stretch = 1.0 + smoothstep(0.0, 0.5, cycle) * 0.5;
        dropPos.y /= stretch; 
        float drop = sdSphere(dropPos, 0.25);
        
        // 3. Blend them with a high 'k' value for high surface tension
        return smin(source, drop, 0.6);
    }

    void main() {
        vec2 uv = (vUv * 2.0 - 1.0) * (uResolution.xy / min(uResolution.x, uResolution.y));
        vec3 ro = vec3(0.0, 0.0, 2.0); // Ray origin
        vec3 rd = normalize(vec3(uv, -1.5)); // Ray direction
        
        // Raymarching
        float t = 0.0;
        for(int i = 0; i < 64; i++) {
            float d = map(ro + rd * t);
            if(d < 0.01 || t > 10.0) break;
            t += d;
        }

        if(t < 10.0) {
            vec3 pos = ro + rd * t;
            
            // Calculate Normal for lighting
            vec2 e = vec2(0.01, 0.0);
            vec3 nor = normalize(vec4(
                map(pos + e.xyy) - map(pos - e.xyy),
                map(pos + e.yxy) - map(pos - e.yxy),
                map(pos + e.yyx) - map(pos - e.yyx),
                0.0
            ).xyz);

            // Thermal Gradient Logic
            float heat = smoothstep(-1.0, 1.0, pos.y + sin(uTime * 5.0) * 0.1);
            vec3 cold = vec3(0.2, 0.0, 0.0);
            vec3 mid = vec3(1.0, 0.3, 0.0);
            vec3 hot = vec3(1.0, 0.9, 0.5);
            
            vec3 color = mix(cold, mid, heat);
            color = mix(color, hot, pow(heat, 4.0));
            
            // Specular highlight for metallic look
            float spec = pow(max(dot(reflect(rd, nor), vec3(0, 1, 0)), 0.0), 32.0);
            color += spec * 0.5;

            gl_FragColor = vec4(color, 1.0);
        } else {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        }
    }
`;

const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

function animate() {
    requestAnimationFrame(animate);
    uniforms.uTime.value = performance.now() / 1000;
    renderer.render(scene, camera);
}
animate();