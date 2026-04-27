import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Interactive WebGL background:
 * - Shader-driven deforming grid mesh (ripple on mouse)
 * - Glowing particle system that reacts to cursor proximity
 * - Pure GLSL, additive blending, low overdraw, capped DPR for perf
 */
export const WebGLBackground = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // ---------- Renderer / Scene / Camera ----------
    const renderer = new THREE.WebGLRenderer({
      antialias: false,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 6);

    // ---------- Shared uniforms ----------
    const mouse = new THREE.Vector2(0, 0); // normalized -1..1
    const mouseTarget = new THREE.Vector2(0, 0);
    const uniforms = {
      uTime: { value: 0 },
      uMouse: { value: mouse },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uColorA: { value: new THREE.Color(0x8b5cf6) }, // neon violet
      uColorB: { value: new THREE.Color(0x3b82f6) }, // electric blue
    };

    // ---------- Wave Mesh (grid of squares via subdivided plane) ----------
    const planeGeo = new THREE.PlaneGeometry(18, 12, 120, 80);
    const meshMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec2 vUv;
        varying float vDisp;
        varying float vRipple;

        void main() {
          vUv = uv;
          vec3 pos = position;

          // Ambient wave field
          float wave =
              sin(pos.x * 0.6 + uTime * 0.8) * 0.18
            + cos(pos.y * 0.7 - uTime * 0.6) * 0.18
            + sin((pos.x + pos.y) * 0.4 + uTime * 0.4) * 0.12;

          // Mouse ripple in world-space (mouse is -1..1)
          vec2 mWorld = uMouse * vec2(9.0, 6.0);
          float d = distance(pos.xy, mWorld);
          float ripple = sin(d * 3.0 - uTime * 4.0) * exp(-d * 0.45) * 0.9;

          pos.z += wave + ripple;
          vDisp = wave;
          vRipple = ripple;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uTime;
        varying vec2 vUv;
        varying float vDisp;
        varying float vRipple;

        void main() {
          // Square grid cells
          vec2 grid = fract(vUv * vec2(120.0, 80.0));
          vec2 edge = smoothstep(0.0, 0.06, grid) * smoothstep(0.0, 0.06, 1.0 - grid);
          float cell = 1.0 - (edge.x * edge.y);

          // Color mix driven by displacement + ripple energy
          float t = clamp(0.5 + vDisp * 1.2 + vRipple * 0.8, 0.0, 1.0);
          vec3 col = mix(uColorA, uColorB, t);

          // Vignette toward edges so it sits behind content
          float vignette = smoothstep(1.1, 0.2, distance(vUv, vec2(0.5)));

          float alpha = cell * (0.18 + abs(vRipple) * 0.6) * vignette;
          gl_FragColor = vec4(col * (0.6 + abs(vRipple) * 1.2), alpha);
        }
      `,
    });
    const waveMesh = new THREE.Mesh(planeGeo, meshMat);
    waveMesh.rotation.x = -0.35;
    waveMesh.position.z = -1.5;
    scene.add(waveMesh);

    // ---------- Particle System ----------
    const PARTICLE_COUNT = 350;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const seeds = new Float32Array(PARTICLE_COUNT);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
      seeds[i] = Math.random() * 1000;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particleGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 1));

    const particleMat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms,
      vertexShader: /* glsl */ `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform vec2 uResolution;
        attribute float aSeed;
        varying float vGlow;

        void main() {
          vec3 pos = position;
          // Smooth random drift
          pos.x += sin(uTime * 0.3 + aSeed) * 0.6;
          pos.y += cos(uTime * 0.25 + aSeed * 1.3) * 0.5;
          pos.z += sin(uTime * 0.4 + aSeed * 0.7) * 0.3;

          // Cursor attraction (subtle)
          vec2 mWorld = uMouse * vec2(8.0, 5.0);
          vec2 toMouse = mWorld - pos.xy;
          float dist = length(toMouse);
          float pull = smoothstep(3.0, 0.0, dist) * 0.4;
          pos.xy += normalize(toMouse + 0.0001) * pull;

          vGlow = 0.4 + smoothstep(3.0, 0.0, dist) * 1.4;

          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = (8.0 + vGlow * 18.0) * (uResolution.y / 900.0) * (1.0 / -mv.z);
        }
      `,
      fragmentShader: /* glsl */ `
        precision highp float;
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying float vGlow;

        void main() {
          vec2 uv = gl_PointCoord - 0.5;
          float d = length(uv);
          if (d > 0.5) discard;
          float core = smoothstep(0.5, 0.0, d);
          float halo = smoothstep(0.5, 0.15, d);
          vec3 col = mix(uColorB, uColorA, vGlow * 0.5);
          float a = (core * 0.9 + halo * 0.3) * vGlow;
          gl_FragColor = vec4(col * (0.8 + vGlow), a);
        }
      `,
    });
    const points = new THREE.Points(particleGeo, particleMat);
    scene.add(points);

    // ---------- Interaction ----------
    const onPointerMove = (e: PointerEvent) => {
      mouseTarget.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseTarget.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    const onResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      uniforms.uResolution.value.set(w, h);
    };
    window.addEventListener("resize", onResize);

    // ---------- Animation Loop ----------
    const clock = new THREE.Clock();
    let raf = 0;
    let visible = true;
    const onVisibility = () => {
      visible = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibility);

    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      const t = clock.getElapsedTime();
      uniforms.uTime.value = prefersReducedMotion ? 0 : t;
      // Smooth mouse easing
      mouse.x += (mouseTarget.x - mouse.x) * 0.06;
      mouse.y += (mouseTarget.y - mouse.y) * 0.06;
      renderer.render(scene, camera);
    };
    tick();

    // ---------- Cleanup ----------
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      planeGeo.dispose();
      meshMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ contain: "strict", zIndex: 0 }}
    />
  );
};
