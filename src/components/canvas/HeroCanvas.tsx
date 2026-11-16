'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { createShapePointClouds, SHAPE_COLORS, SHAPE_PARTICLE_TINT } from '@/lib/shapes';

export function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gradRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const widthFn = () => container.clientWidth || window.innerWidth;
    const heightFn = () => container.clientHeight || window.innerHeight;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch (e) {
      console.warn('WebGL not supported', e);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(widthFn(), heightFn());
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    // Environment background texture
    const envCanvas = document.createElement('canvas');
    envCanvas.width = 1024;
    envCanvas.height = 512;
    const ctx = envCanvas.getContext('2d')!;
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 512);
    bgGrad.addColorStop(0, '#6f97a3');
    bgGrad.addColorStop(0.42, '#31505b');
    bgGrad.addColorStop(1, '#12222a');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 512);

    const drawRadial = (x: number, y: number, r: number, col: string) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, col);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 1024, 512);
    };
    drawRadial(300, 150, 260, 'rgba(219,176,87,0.55)');
    drawRadial(760, 220, 240, 'rgba(138,203,193,0.5)');
    drawRadial(520, 60, 180, 'rgba(255,255,255,0.85)');

    const envTexture = new THREE.CanvasTexture(envCanvas);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;

    // Sky sphere
    const skySphere = new THREE.Mesh(
      new THREE.SphereGeometry(40, 48, 48),
      new THREE.MeshBasicMaterial({ map: envTexture, side: THREE.BackSide, color: 0x2f434c })
    );
    skySphere.renderOrder = -2;
    scene.add(skySphere);

    // Camera
    const camera = new THREE.PerspectiveCamera(42, widthFn() / heightFn(), 0.1, 100);
    camera.position.set(0, 0, 5.9);

    // Constellation group
    const constellationGroup = new THREE.Group();
    constellationGroup.position.set(0, 0, 0);
    scene.add(constellationGroup);

    // Soft sprite texture
    const spriteCanvas = document.createElement('canvas');
    spriteCanvas.width = spriteCanvas.height = 64;
    const sCtx = spriteCanvas.getContext('2d')!;
    const spriteGrad = sCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    spriteGrad.addColorStop(0, 'rgba(255,255,255,1)');
    spriteGrad.addColorStop(0.55, 'rgba(255,255,255,1)');
    spriteGrad.addColorStop(0.78, 'rgba(255,255,255,0.55)');
    spriteGrad.addColorStop(1, 'rgba(255,255,255,0)');
    sCtx.fillStyle = spriteGrad;
    sCtx.fillRect(0, 0, 64, 64);
    const spriteTexture = new THREE.CanvasTexture(spriteCanvas);

    // 350 particles point cloud
    const pt = 350;
    const { shapes, shapeInfo } = createShapePointClouds(pt);

    const initialSpherePoints: THREE.Vector3[] = [];
    for (let G = 0; G < pt; G++) {
      const radius = 0.6 + Math.random() * 1.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      initialSpherePoints.push(
        new THREE.Vector3(
          radius * Math.sin(phi) * Math.cos(theta),
          radius * Math.sin(phi) * Math.sin(theta),
          radius * Math.cos(phi)
        )
      );
    }

    const posArray = new Float32Array(pt * 3);
    const colArray = new Float32Array(pt * 3);
    colArray.fill(1);

    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colArray, 3));

    const pointsMaterial = new THREE.PointsMaterial({
      size: 4.5,
      sizeAttenuation: false,
      map: spriteTexture,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
    constellationGroup.add(pointsMesh);

    // Connected lines
    const linePairs: [number, number][] = [];
    const thresholdDist = 0.72;
    for (let G = 0; G < pt; G++) {
      for (let J = G + 1; J < pt; J++) {
        if (initialSpherePoints[G].distanceTo(initialSpherePoints[J]) < thresholdDist) {
          linePairs.push([G, J]);
        }
      }
    }

    const linePosArray = new Float32Array(linePairs.length * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePosArray, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.16,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const lineMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    constellationGroup.add(lineMesh);

    // Random phases & seeds for organic movement
    const randomPhases = initialSpherePoints.map(() => Math.random() * Math.PI * 2);
    const seedP = new Float32Array(pt);
    const seedW = new Float32Array(pt);
    for (let G = 0; G < pt; G++) {
      const J = Math.sin(G * 12.9898) * 43758.5453;
      seedP[G] = J - Math.floor(J);
      const we = Math.sin(G * 78.233) * 24634.6345;
      seedW[G] = we - Math.floor(we);
    }

    // Ambient floating stars / particles
    const starCount = widthFn() < 700 ? 560 : 950;
    const starPos = new Float32Array(starCount * 3);
    const starCol = new Float32Array(starCount * 3);
    const colGold = new THREE.Color('#dbb057');
    const colTeal = new THREE.Color('#8acbc1');
    const colWhite = new THREE.Color('#ffffff');

    for (let G = 0; G < starCount; G++) {
      const z = 5.2 - Math.pow(Math.random(), 1.3) * 21;
      const spread = 3 + (5.2 - z) * 0.5;
      starPos[G * 3] = (Math.random() - 0.5) * 2 * spread;
      starPos[G * 3 + 1] = (Math.random() - 0.5) * 2 * spread;
      starPos[G * 3 + 2] = z;
      const c = Math.random() < 0.33 ? colGold : Math.random() < 0.5 ? colTeal : colWhite;
      starCol[G * 3] = c.r;
      starCol[G * 3 + 1] = c.g;
      starCol[G * 3 + 2] = c.b;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starCol, 3));

    const starMaterial = new THREE.PointsMaterial({
      size: 0.045,
      map: spriteTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });
    const starMesh = new THREE.Points(starGeometry, starMaterial);
    scene.add(starMesh);

    // Volumetric smoke background shader
    const smokeMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uAspect: { value: widthFn() / heightFn() },
        uTeal: { value: new THREE.Color('#5a8aa2') },
        uGold: { value: new THREE.Color('#dbb057') },
        uAmp: { value: 0.12 },
        uZoom: { value: 1 },
      },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform float uAspect;
        uniform vec3 uTeal;
        uniform vec3 uGold;
        uniform float uAmp;
        uniform float uZoom;
        varying vec2 vUv;

        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
        }

        float vnoise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(
            mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
            mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
            u.y
          );
        }

        float fbm(vec2 p) {
          float v = 0.0;
          float a = 0.5;
          for (int i = 0; i < 5; i++) {
            v += a * vnoise(p);
            p = p * 2.0;
            a *= 0.5;
          }
          return v;
        }

        void main() {
          vec2 p = vec2(vUv.x * uAspect, vUv.y);
          vec2 ctr = vec2(0.5 * uAspect, 0.5);
          vec2 uv = (ctr + (p - ctr) / uZoom) * 2.4;
          float t = uTime * 0.045;
          vec2 q = vec2(fbm(uv + vec2(0.0, t * 1.3)), fbm(uv + vec2(5.2, -t)));
          vec2 r = vec2(fbm(uv + 2.0 * q + vec2(1.7, 9.2) + t * 0.4), fbm(uv + 2.0 * q + vec2(8.3, 2.8) - t * 0.3));
          float f = fbm(uv + 2.2 * r);
          f = smoothstep(0.12, 0.95, f);
          vec3 col = uTeal * f + uGold * smoothstep(0.72, 1.0, f) * 0.5;
          gl_FragColor = vec4(col * uAmp, 1.0);
        }
      `,
    });
    const smokeMesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), smokeMaterial);
    smokeMesh.frustumCulled = false;
    smokeMesh.renderOrder = -1;
    scene.add(smokeMesh);

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const dirLight1 = new THREE.DirectionalLight(0xdbb057, 2.2);
    dirLight1.position.set(4, 3, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8acbc1, 1.8);
    dirLight2.position.set(-5, -2, 2);
    scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight3.position.set(0, 4, -4);
    scene.add(dirLight3);

    // Mouse & Touch Tracking
    const isCoarse = window.matchMedia('(pointer: coarse)').matches;
    const mouseNorm = { x: 0, y: 0 };
    const mouseNDC = { x: 0, y: 0 };
    let mouseSpeed = 0;
    let prevMouse: { x: number; y: number } | null = null;

    const onPointerMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth;
      const ny = e.clientY / window.innerHeight;
      mouseNorm.x = nx - 0.5;
      mouseNorm.y = ny - 0.5;
      mouseNDC.x = nx * 2 - 1;
      mouseNDC.y = -(ny * 2 - 1);

      const prev = prevMouse || { x: nx, y: ny };
      const dist = Math.hypot(nx - prev.x, ny - prev.y);
      prevMouse = { x: nx, y: ny };
      mouseSpeed = Math.min(0.85, mouseSpeed + dist * 3.5);
    };

    if (!isCoarse) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
    }

    // Resize Handler
    const onResize = () => {
      const w = widthFn();
      const h = heightFn();
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      smokeMaterial.uniforms.uAspect.value = w / h;
    };
    window.addEventListener('resize', onResize);

    const smoothstep = (min: number, max: number, value: number) => {
      const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
      return x * x * (3 - 2 * x);
    };

    // State
    let currentShapeKey = 'fplus';
    let morphWeight = 0;
    let shapeSettled = false;
    let candidateShape = '';
    let candidateCount = 0;

    const currentPoints: THREE.Vector3[] = shapes['fplus'].map((p) => p.clone());
    const tempDisplacement = new Float32Array(pt * 3);

    const currentColor = new THREE.Color('#22363e');
    const targetColor = new THREE.Color('#22363e');
    const currentParticleColor = new THREE.Color('#ffffff');
    const targetParticleColor = new THREE.Color('#ffffff');

    const clock = new THREE.Clock();
    let animId = 0;
    let isRunning = true;

    let rotY = 0;
    let rotX = 0;
    let posX = 0;
    let posY = 0;
    let breathScale = 1;

    const euler = new THREE.Euler();
    const quat = new THREE.Quaternion();
    const offsetVec = new THREE.Vector3();
    const unprojectVec = new THREE.Vector3();

    // Render loop
    const animate = () => {
      if (!isRunning) return;
      animId = requestAnimationFrame(animate);

      const elapsed = clock.getElapsedTime();
      mouseSpeed *= 0.96;
      const speed = mouseSpeed;

      const vw = widthFn();
      const vh = heightFn();
      const isHorizontal = document.documentElement.dataset.heroAxis === 'x';
      const viewportDim = isHorizontal ? vw : vh;

      // Find active section
      let maxProximity = 0;
      let activeShape = 'fplus';
      let targetCenter = viewportDim / 2;

      const shapeElements = document.querySelectorAll<HTMLElement>('[data-shape]');
      shapeElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const center = isHorizontal ? rect.left + rect.width / 2 : rect.top + rect.height / 2;
        const distFromCenter = Math.abs(center - viewportDim / 2);
        const radius = viewportDim * 0.45;
        const proximity = Math.max(0, 1 - Math.max(0, distFromCenter - radius) / (viewportDim * 0.5));
        if (proximity > maxProximity) {
          maxProximity = proximity;
          activeShape = el.dataset.shape || activeShape;
          targetCenter = center;
        }
      });

      const centerOffset = Math.max(-0.7, Math.min(0.7, (targetCenter - viewportDim / 2) / viewportDim));

      if (maxProximity > 0.05) {
        currentShapeKey = activeShape;
      } else if (window.scrollY < vh * 0.4) {
        currentShapeKey = 'fplus';
      }

      if (!shapeSettled) {
        if (maxProximity > 0.05 && activeShape === candidateShape) {
          candidateCount++;
        } else {
          candidateCount = 0;
          candidateShape = maxProximity > 0.05 ? activeShape : '';
        }
        if (candidateCount >= 6) {
          shapeSettled = true;
        }
      }

      morphWeight += (maxProximity - morphWeight) * 0.055;
      if (!shapeSettled && window.scrollY >= vh * 0.3) {
        morphWeight = Math.max(morphWeight, 0.85);
        shapeSettled = true;
      }

      const ut = morphWeight;
      const targetShapePoints = shapes[currentShapeKey] || shapes['fplus'];
      const snapDirectly = !shapeSettled || ut < 0.02;

      for (let i = 0; i < pt; i++) {
        const targetP = targetShapePoints[i];
        const curP = currentPoints[i];
        if (snapDirectly) {
          curP.copy(targetP);
        } else {
          curP.x += (targetP.x - curP.x) * 0.07;
          curP.y += (targetP.y - curP.y) * 0.07;
          curP.z += (targetP.z - curP.z) * 0.07;
        }
      }

      const invUt = 1 - ut;
      const breathAmp = 0.03 * (0.25 + 0.75 * invUt);

      // Color lerp
      const shapeBg = SHAPE_COLORS[currentShapeKey] || SHAPE_COLORS.default;
      targetColor.copy(SHAPE_COLORS.default);
      if (shapeBg) {
        targetColor.lerp(shapeBg, Math.min(1, ut * 1.35));
      }
      currentColor.lerp(targetColor, 0.05);
      skySphere.material.color.copy(currentColor);

      const shapeTint = SHAPE_PARTICLE_TINT[currentShapeKey] || SHAPE_PARTICLE_TINT.default;
      targetParticleColor.copy(shapeTint);
      currentParticleColor.lerp(targetParticleColor, 0.05);
      pointsMaterial.color.copy(currentParticleColor);

      if (gradRef.current) {
        const r255 = Math.round(currentColor.r * 255);
        const g255 = Math.round(currentColor.g * 255);
        const b255 = Math.round(currentColor.b * 255);
        gradRef.current.style.background = `linear-gradient(to top, rgba(${r255},${g255},${b255},0.82) 0%, rgba(${r255},${g255},${b255},0.34) 34%, rgba(${r255},${g255},${b255},0) 62%)`;
      }

      // Camera distance and visible view frustum calculations
      const scrollY = window.scrollY || 0;
      const maxScroll = Math.max(1, document.body.scrollHeight - vh);
      const scrollFrac = Math.min(1, scrollY / maxScroll);
      const camAngle = scrollFrac * Math.PI * 1.5 * (isHorizontal ? 2.4 : 1);
      const camRadius = 5.9 - smoothstep(0, 0.22, scrollFrac) * 2.6;
      const camPitch = Math.sin(scrollFrac * Math.PI) * 0.18;
      const camDistPlanar = Math.cos(camPitch) * camRadius;

      camera.position.x += (Math.sin(camAngle) * camDistPlanar - camera.position.x) * 0.08;
      camera.position.y += (Math.sin(camPitch) * camRadius - camera.position.y) * 0.08;
      camera.position.z += (Math.cos(camAngle) * camDistPlanar - camera.position.z) * 0.08;
      camera.lookAt(0, 0, 0);
      camera.updateMatrixWorld();

      // Detect if user is past Tropicana (entering or inside vertical flow sections below)
      let pastTropicana = 0;
      const servicesEl = document.querySelector<HTMLElement>('.services');
      if (servicesEl) {
        const sTop = servicesEl.getBoundingClientRect().top;
        if (sTop < vh) {
          pastTropicana = Math.max(0, Math.min(1, (vh - sTop) / (vh * 0.75)));
        }
      }

      // Frustum world dimensions at camera distance
      const vFovRad = (42 * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFovRad / 2) * camRadius;
      const aspect = vw / vh;
      const visibleWidth = visibleHeight * aspect;

      // Shape bounding information
      const sInfo = shapeInfo[currentShapeKey] || { cx: 0, cy: 0, w: 2.2, h: 2.0 };

      // Responsive Scale and Position
      let targetPosX = 0;
      let targetPosY = 0;
      let scaleMultiplier = 1;

      if (isHorizontal && vw >= 1024) {
        // Desktop horizontal mode: model on the right half (untouched)
        const maxShapeW = Math.max(sInfo.w, 1.8);
        const baseScale = Math.min(1.0, (visibleWidth * 0.44) / maxShapeW);
        scaleMultiplier = (1 + scrollFrac * 0.35) * (1 + ut * -0.22) * baseScale;

        const desktopX = (visibleWidth * 0.24 - sInfo.cx * scaleMultiplier);
        const desktopY = -sInfo.cy * scaleMultiplier;

        targetPosX = desktopX * ut + (visibleWidth * 0.26) * invUt;
        targetPosY = desktopY * ut + Math.sin(elapsed * 0.8) * 0.07;
      } else {
        // Mobile & Tablet vertical mode: model horizontally centered in the upper section
        // Max allowed dimensions so it never overflows screen or overlaps bottom text
        const maxAllowedW = visibleWidth * (vw < 500 ? 0.74 : 0.65);
        const maxAllowedH = visibleHeight * (vh < 700 ? 0.32 : 0.36);

        const fitScale = Math.min(
          maxAllowedW / sInfo.w,
          maxAllowedH / sInfo.h,
          vw < 500 ? 0.52 : vw < 850 ? 0.68 : 0.82
        );

        // When scrolling past Tropicana into sections below:
        // Expand scale so particles break apart and fill the entire mobile background
        const expandedScale = Math.min(1.05, (visibleWidth * 0.52) / 1.6);
        const baseMobileScale = fitScale * (0.92 + ut * 0.12);
        scaleMultiplier = THREE.MathUtils.lerp(baseMobileScale, expandedScale, pastTropicana);

        // Center horizontally
        const panelPosX = (-sInfo.cx * scaleMultiplier) * ut;
        targetPosX = THREE.MathUtils.lerp(panelPosX, 0, pastTropicana);

        // Vertical position:
        // Inside project panels: placed in upper portion above bottom text
        // In vertical sections below: centered on screen (0)
        const targetCenterY = visibleHeight * (vw < 500 ? 0.20 : 0.22);
        const shapeOffsetY = targetCenterY - sInfo.cy * scaleMultiplier;
        const heroOffsetY = visibleHeight * 0.14;
        const panelPosY = shapeOffsetY * ut + heroOffsetY * invUt;

        targetPosY = THREE.MathUtils.lerp(panelPosY, 0, pastTropicana) + Math.sin(elapsed * 0.8) * 0.05;
      }

      constellationGroup.scale.setScalar(scaleMultiplier);

      posX += (targetPosX - posX) * 0.08;
      posY += (targetPosY - posY) * 0.08;

      // Mouse repulsion in local space
      let mouseLocalX = 999;
      let mouseLocalY = 999;
      if (ut > 0.15 && !isCoarse && scrollY < vh * 0.2) {
        unprojectVec.set(mouseNDC.x, mouseNDC.y, 0.5).unproject(camera);
        unprojectVec.sub(camera.position).normalize();
        const distZ = (constellationGroup.position.z - camera.position.z) / unprojectVec.z;
        const wx = camera.position.x + unprojectVec.x * distZ;
        const wy = camera.position.y + unprojectVec.y * distZ;
        const scale = constellationGroup.scale.x || 1;
        mouseLocalX = (wx - constellationGroup.position.x) / scale;
        mouseLocalY = (wy - constellationGroup.position.y) / scale;
      }

      // Group rotation
      const targetRotY = mouseNorm.x * (1.15 + speed * 0.8) * invUt + -centerOffset * 0.3 * ut;
      rotY += (targetRotY - rotY) * 0.05 + 0.0014 * invUt;
      rotX += (mouseNorm.y * (0.85 + speed * 0.6) * invUt - rotX) * 0.05;

      const scrollVhRatio = scrollY / (vh || 1);
      breathScale += (1 + Math.sin(scrollVhRatio * 0.9) * 0.4 - breathScale) * 0.04;

      const maxRepulseDist = 0.6;
      const repulseDistSq = maxRepulseDist * maxRepulseDist;

      // Update particles
      for (let i = 0; i < pt; i++) {
        const initP = initialSpherePoints[i];
        const phase = randomPhases[i];
        const amp = (0.13 + speed * 0.3) * invUt;
        const wave = speed * 0.06 * invUt;

        const sphereX =
          initP.x * breathScale +
          Math.sin(elapsed * 0.5 + phase) * amp +
          Math.sin(elapsed * 1.4 + phase * 2.1) * wave;
        const sphereY =
          initP.y * breathScale +
          Math.cos(elapsed * 0.4 + phase) * amp +
          Math.cos(elapsed * 1.2 + phase * 1.7) * wave;
        const sphereZ =
          initP.z * breathScale +
          Math.sin(elapsed * 0.45 + phase * 1.3) * amp +
          Math.sin(elapsed * 1.6 + phase) * wave;

        const curTargetP = currentPoints[i];
        let repulseX = 0;
        let repulseY = 0;

        if (ut > 0.15) {
          const dx = mouseLocalX - curTargetP.x;
          const dy = mouseLocalY - curTargetP.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < repulseDistSq) {
            const force = 1 - (Math.sqrt(dSq) || 1e-4) / maxRepulseDist;
            const angle =
              Math.atan2(-dy, -dx) +
              (seedP[i] - 0.5) * 1.8 +
              Math.sin(elapsed * 7 + phase) * 0.25;
            const push = force * force * 0.55 * (0.45 + seedW[i] * 1.3);
            repulseX = Math.cos(angle) * push;
            repulseY = Math.sin(angle) * push;
          }
        }

        const dampX = Math.abs(repulseX) > Math.abs(tempDisplacement[i * 3]) ? 0.42 : 0.055;
        const dampY = Math.abs(repulseY) > Math.abs(tempDisplacement[i * 3 + 1]) ? 0.42 : 0.055;
        tempDisplacement[i * 3] += (repulseX - tempDisplacement[i * 3]) * dampX;
        tempDisplacement[i * 3 + 1] += (repulseY - tempDisplacement[i * 3 + 1]) * dampY;

        const shapePosX =
          (curTargetP.x + Math.sin(elapsed * 0.9 + phase) * breathAmp + tempDisplacement[i * 3]) * ut;
        const shapePosY =
          (curTargetP.y + Math.cos(elapsed * 0.8 + phase) * breathAmp + tempDisplacement[i * 3 + 1]) * ut;

        let px = sphereX * invUt + shapePosX;
        let py = sphereY * invUt + shapePosY;
        let pz = sphereZ * invUt + curTargetP.z * ut;

        if (vw < 1024 && pastTropicana > 0) {
          const disperseAmount = Math.min(1, pastTropicana * 1.15);
          const dispX = (seedW[i] - 0.5) * 3.6 * disperseAmount + Math.sin(elapsed * 0.6 + phase) * 0.22 * disperseAmount;
          const dispY = (seedP[i] - 0.5) * 4.6 * disperseAmount + Math.cos(elapsed * 0.5 + phase) * 0.22 * disperseAmount;
          const dispZ = (initialSpherePoints[i].z * 1.6 + Math.sin(phase * 2.2) * 1.0) * disperseAmount;

          px += dispX;
          py += dispY;
          pz += dispZ;
        }

        posArray[i * 3] = px;
        posArray[i * 3 + 1] = py;
        posArray[i * 3 + 2] = pz;
      }

      pointsGeometry.attributes.position.needsUpdate = true;

      // Update lines
      for (let i = 0; i < linePairs.length; i++) {
        const [idx1, idx2] = linePairs[i];
        linePosArray[i * 6] = posArray[idx1 * 3];
        linePosArray[i * 6 + 1] = posArray[idx1 * 3 + 1];
        linePosArray[i * 6 + 2] = posArray[idx1 * 3 + 2];
        linePosArray[i * 6 + 3] = posArray[idx2 * 3];
        linePosArray[i * 6 + 4] = posArray[idx2 * 3 + 1];
        linePosArray[i * 6 + 5] = posArray[idx2 * 3 + 2];
      }
      lineGeometry.attributes.position.needsUpdate = true;
      if (vw < 1024 && pastTropicana > 0) {
        lineMaterial.opacity = Math.max(0.018, 0.06 * (1 - pastTropicana * 0.6));
      } else {
        lineMaterial.opacity = 0.06;
      }

      quat.setFromEuler(euler.set(rotX, rotY, 0, 'XYZ'));
      constellationGroup.quaternion.copy(camera.quaternion).multiply(quat);

      offsetVec.set(posX, posY, -camRadius).applyQuaternion(camera.quaternion);
      constellationGroup.position.copy(camera.position).add(offsetVec);

      starMesh.rotation.y = elapsed * (isHorizontal ? 0.04 : 0.02);
      smokeMaterial.uniforms.uTime.value = elapsed;
      smokeMaterial.uniforms.uZoom.value = 5.9 / camRadius;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      isRunning = false;
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      pointsGeometry.dispose();
      lineGeometry.dispose();
      starGeometry.dispose();
      skySphere.geometry.dispose();
      smokeMesh.geometry.dispose();
      smokeMaterial.dispose();
      pointsMaterial.dispose();
      lineMaterial.dispose();
      starMaterial.dispose();
      envTexture.dispose();
      spriteTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="hero-canvas" aria-hidden="true">
      <div id="fplus-gl" ref={containerRef} className="hero-canvas__gl" />
      <div id="fplus-grad" ref={gradRef} className="hero-canvas__grad" />
    </div>
  );
}
