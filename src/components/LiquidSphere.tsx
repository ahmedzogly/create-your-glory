import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * LiquidSphere — futuristic iridescent fluid sphere rendered in WebGL.
 * Used as a premium background accent for sections like Projects.
 */
export const LiquidSphere = ({ className = "" }: { className?: string }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(1, 64);

    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
    };

    const vertexShader = /* glsl */ `
      uniform float uTime;
      uniform vec2 uMouse;
      varying vec3 vNormal;
      varying vec3 vPos;
      varying float vDistort;

      // Simplex-ish noise
      vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
      vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
      vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
      float snoise(vec3 v){
        const vec2 C = vec2(1.0/6.0, 1.0/3.0);
        const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy));
        vec3 x0 = v - i + dot(i, C.xxx);
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min(g.xyz, l.zxy);
        vec3 i2 = max(g.xyz, l.zxy);
        vec3 x1 = x0 - i1 + C.xxx;
        vec3 x2 = x0 - i2 + C.yyy;
        vec3 x3 = x0 - D.yyy;
        i = mod289(i);
        vec4 p = permute(permute(permute(
                  i.z + vec4(0.0, i1.z, i2.z, 1.0))
                + i.y + vec4(0.0, i1.y, i2.y, 1.0))
                + i.x + vec4(0.0, i1.x, i2.x, 1.0));
        float n_ = 0.142857142857;
        vec3 ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_);
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4(x.xy, y.xy);
        vec4 b1 = vec4(x.zw, y.zw);
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
        vec3 p0 = vec3(a0.xy, h.x);
        vec3 p1 = vec3(a0.zw, h.y);
        vec3 p2 = vec3(a1.xy, h.z);
        vec3 p3 = vec3(a1.zw, h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
        p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
      }

      void main() {
        vec3 pos = position;
        float t = uTime * 0.35;
        float n1 = snoise(pos * 1.6 + vec3(t, t * 0.7, 0.0));
        float n2 = snoise(pos * 3.2 - vec3(0.0, t * 1.1, t));
        float distort = n1 * 0.28 + n2 * 0.12;
        distort += 0.08 * sin(pos.y * 4.0 + t * 2.0);

        vec3 newPos = pos + normal * distort;
        vNormal = normalize(normalMatrix * normal);
        vPos = newPos;
        vDistort = distort;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
      }
    `;

    const fragmentShader = /* glsl */ `
      precision highp float;
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vPos;
      varying float vDistort;

      // Iridescent palette using cosine gradient (Inigo Quilez)
      vec3 palette(float t) {
        vec3 a = vec3(0.5, 0.5, 0.5);
        vec3 b = vec3(0.5, 0.5, 0.5);
        vec3 c = vec3(1.0, 1.0, 1.0);
        vec3 d = vec3(0.10, 0.50, 0.85); // violet → blue → cyan shift
        return a + b * cos(6.28318 * (c * t + d));
      }

      void main() {
        vec3 viewDir = normalize(-vPos);
        float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 2.4);

        float hue = vDistort * 1.5 + uTime * 0.05 + dot(vNormal, vec3(0.3, 0.6, 0.2));
        vec3 iridescent = palette(hue);

        // Subtle rim glow
        vec3 rim = vec3(0.55, 0.35, 1.0) * fresnel * 1.4;

        // Inner refraction shimmer
        float shimmer = 0.5 + 0.5 * sin(vPos.x * 8.0 + vPos.y * 6.0 + uTime * 1.2);
        vec3 inner = mix(iridescent, vec3(0.9, 0.95, 1.0), shimmer * 0.25);

        vec3 color = inner * 0.55 + rim;
        // Soft falloff for premium look
        color = pow(color, vec3(0.95));

        // Alpha edge softening for elegant blend
        float alpha = smoothstep(0.0, 0.6, fresnel + 0.35);
        gl_FragColor = vec4(color, alpha);
      }
    `;

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Soft ambient halo behind sphere
    const haloGeo = new THREE.PlaneGeometry(6, 6);
    const haloMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: uniforms.uTime },
      vertexShader: `varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
      fragmentShader: `
        varying vec2 vUv;
        uniform float uTime;
        void main(){
          vec2 p = vUv - 0.5;
          float d = length(p);
          float glow = smoothstep(0.5, 0.0, d) * 0.5;
          vec3 col = mix(vec3(0.45,0.20,0.95), vec3(0.20,0.55,1.0), 0.5 + 0.5*sin(uTime*0.4));
          gl_FragColor = vec4(col * glow, glow);
        }
      `,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.z = -1.2;
    scene.add(halo);

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const onMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      uniforms.uMouse.value.set(x, y);
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    let visible = true;
    const io = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; });
    io.observe(mount);

    const start = performance.now();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = (performance.now() - start) / 1000;
      uniforms.uTime.value = t;
      sphere.rotation.y = t * 0.15 + uniforms.uMouse.value.x * 0.4;
      sphere.rotation.x = Math.sin(t * 0.2) * 0.15 + uniforms.uMouse.value.y * 0.3;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      ro.disconnect();
      io.disconnect();
      geometry.dispose();
      material.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode) renderer.domElement.parentNode.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
};
