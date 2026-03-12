"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

type Transform = { x: number; y: number; z: number };

const HERO_COLORS = ["#ff3b30", "#38bdf8", "#a78bfa", "#f472b6", "#fbbf24", "#84cc16", "#34d399", "#22d3ee"];
const CENTER_COLOR = 0xffd700;
const HERO_TRANSFORMS: Transform[] = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
  const r = 420;
  return { x: r * Math.cos(angle), y: 0, z: r * Math.sin(angle) };
});

export type AvatarStagePhase = "gather" | "scatter";

interface HeroAvatarStageWebGLProps {
  transforms?: Transform[];
  colors?: string[];
  layoutMode?: "arc" | "circle" | "spiral";
  avatarStagePhase?: AvatarStagePhase;
  className?: string;
  /** Без фона (прозрачный слой фигур поверх подложки) */
  transparentBackground?: boolean;
}

export function HeroAvatarStageWebGL({
  transforms = HERO_TRANSFORMS,
  colors = HERO_COLORS,
  layoutMode = "circle",
  avatarStagePhase,
  className,
  transparentBackground = false,
}: HeroAvatarStageWebGLProps) {
  const mountRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<AvatarStagePhase | undefined>(undefined);
  const phaseStartRef = useRef(0);
  const clockRef = useRef<THREE.Clock | null>(null);
  const mousePosRef = useRef({ x: 0, y: 0 });
  const isBoostingRef = useRef(false);
  const boostAmountRef = useRef(0);

  useEffect(() => {
    phaseRef.current = avatarStagePhase;
    if (avatarStagePhase && clockRef.current) phaseStartRef.current = clockRef.current.getElapsedTime();
  }, [avatarStagePhase]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;
      const rect = mount.getBoundingClientRect();
      // Нормализуем координаты от -1 до 1
      mousePosRef.current = {
        x: ((x - rect.left) / rect.width) * 2 - 1,
        y: ((y - rect.top) / rect.height) * 2 - 1
      };
    };

    const handleMouseDown = () => (isBoostingRef.current = true);
    const handleMouseUp = () => (isBoostingRef.current = false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchstart', handleMouseMove);
    window.addEventListener('touchstart', handleMouseDown);
    window.addEventListener('touchend', handleMouseUp);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 3000);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NoToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    // --- Окружение для отражений (Environment Map) ---
    // Для стекла критически важно иметь что-то, что в нем отражается.
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();

    const envScene = new THREE.Scene();
    // Больше и ярче источников для бликов
    const envLight1 = new THREE.Mesh(new THREE.SphereGeometry(60, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    envLight1.position.set(300, 300, 150);
    envScene.add(envLight1);
    const envLight2 = new THREE.Mesh(new THREE.SphereGeometry(50, 16, 16), new THREE.MeshBasicMaterial({ color: 0x00ffff }));
    envLight2.position.set(-300, 200, -100);
    envScene.add(envLight2);
    const envLight3 = new THREE.Mesh(new THREE.SphereGeometry(50, 16, 16), new THREE.MeshBasicMaterial({ color: 0xff00ff }));
    envLight3.position.set(0, -300, 100);
    envScene.add(envLight3);
    const envLight4 = new THREE.Mesh(new THREE.SphereGeometry(60, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffff00 }));
    envLight4.position.set(100, -100, -200);
    envScene.add(envLight4);
    const envLight5 = new THREE.Mesh(new THREE.SphereGeometry(30, 16, 16), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    envLight5.position.set(-100, 400, 200);
    envScene.add(envLight5);

    const envRT = pmremGenerator.fromScene(envScene, 0.0);
    scene.environment = envRT.texture;

    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambient);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x1b2238, 0.4);
    scene.add(hemi);

    const topRightLight = new THREE.DirectionalLight(0xffffff, 2.5);
    topRightLight.position.set(500, 500, 200);
    scene.add(topRightLight);

    // Дополнительный заполняющий свет
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-200, 200, 300);
    scene.add(fillLight);

    const coinRadius = 60.48;
    const escortThickness = 22; // Потолще для спутников (было 10)
    const coinThickness = 10;   // Базовая толщина для расчетов
    const glassTint = 0xd8e8f8;
    // Треугольная призма (объёмный треугольник): цилиндр с 3 гранями, вершина вверх
    const geometry = new THREE.CylinderGeometry(coinRadius, coinRadius, escortThickness, 3, 1, false);
    geometry.rotateX(Math.PI / 2);
    geometry.rotateZ(Math.PI);
    geometry.scale(1, 1.25, 1); // Чуть меньше вытягиваем (было 1.4)

    // --- Helper: Асимметрия (скошенное основание) ---
    const applyAsymmetry = (geom: THREE.BufferGeometry, slantFactor: number) => {
      const pos = geom.attributes.position;
      const count = pos.count;
      // Находим нос (максимальный Y)
      let maxY = -Infinity;
      for (let i = 0; i < count; i++) {
        const y = pos.getY(i);
        if (y > maxY) maxY = y;
      }

      for (let i = 0; i < count; i++) {
        const x = pos.getX(i);
        const y = pos.getY(i);
        // Если это не нос (с запасом 1ед), наклоняем основание
        if (y < maxY - 1) {
          pos.setY(i, y + x * slantFactor);
        }
      }
      pos.needsUpdate = true;
    };

    applyAsymmetry(geometry, 0.25); // Перекос основания

    // --- Helper: Легкий градиент через Vertex Colors ---
    const applyGradient = (geom: THREE.BufferGeometry, baseColor: THREE.Color) => {
      const pos = geom.attributes.position;
      const count = pos.count;
      const colors = new Float32Array(count * 3);

      let minY = Infinity, maxY = -Infinity;
      for (let i = 0; i < count; i++) {
        const y = pos.getY(i);
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }

      for (let i = 0; i < count; i++) {
        const y = pos.getY(i);
        const t = (maxY - y) / (maxY - minY);
        // Нос яркий, хвост уходит в чистый белый (прозрачное стекло)
        const finalColor = baseColor.clone().lerp(new THREE.Color(0xffffff), Math.pow(t, 1.2));
        colors[i * 3] = finalColor.r;
        colors[i * 3 + 1] = finalColor.g;
        colors[i * 3 + 2] = finalColor.b;
      }
      geom.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      return { minY, maxY };
    };



    // --- Helper: Прозрачность по градиенту через Shader Injection ---
    const applyTransparencyFade = (mat: THREE.MeshPhysicalMaterial, limits: { minY: number, maxY: number }) => {
      mat.onBeforeCompile = (shader) => {
        shader.uniforms.uFadeLimits = { value: new THREE.Vector2(limits.minY, limits.maxY) };
        shader.vertexShader = shader.vertexShader.replace(
          '#include <common>',
          `#include <common>\nvarying float vFadeY;`
        ).replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>\nvFadeY = position.y;`
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <common>',
          `#include <common>\nvarying float vFadeY;\nuniform vec2 uFadeLimits;`
        ).replace(
          '#include <output_fragment>',
          `
          float fadeFactor = smoothstep(uFadeLimits.x, uFadeLimits.y, vFadeY);
          // Делаем хвост почти невидимым (0.01), а нос полностью плотным
          gl_FragColor.a *= (0.01 + 0.99 * fadeFactor);
          #include <output_fragment>
          `
        );
      };
    };

    // Текстура для размытых частиц (мягкий круг)
    const createCircleTexture = () => {
      const size = 64;
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
        gradient.addColorStop(0, 'rgba(255,255,255,1)');
        gradient.addColorStop(0.2, 'rgba(255,255,255,0.8)');
        gradient.addColorStop(0.5, 'rgba(255,255,255,0.2)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, size, size);
      }
      return new THREE.CanvasTexture(canvas);
    };
    const softParticleTexture = createCircleTexture();
    const palette = colors.map(c => new THREE.Color(c));

    // Большой центральный треугольник (крутится вокруг своей оси)
    const centerRadius = coinRadius * 5.0; // Еще больше (было 3.3)
    const centerThickness = coinThickness * 5.0; // Еще больше (было 3.3)
    const centerGeometry = new THREE.CylinderGeometry(centerRadius, centerRadius, centerThickness, 3, 1, false);
    centerGeometry.rotateX(Math.PI / 2);
    centerGeometry.rotateZ(Math.PI);
    centerGeometry.scale(1, 1.25, 1); // Тоже чуть меньше
    applyAsymmetry(centerGeometry, 0.25); // Перекос основания
    const centerLimits = applyGradient(centerGeometry, new THREE.Color(CENTER_COLOR));

    const centerGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1.0,              // Нос будет полностью непрозрачным
      roughness: 0.05,
      metalness: 0.0,
      transmission: 1.0,
      ior: 1.45,
      thickness: 10,
      attenuationColor: CENTER_COLOR,
      attenuationDistance: 1500, // Увеличил, чтобы свет проходил свободнее
      vertexColors: true,
      emissive: CENTER_COLOR,
      emissiveIntensity: 0.012,
      iridescence: 1.0,
      iridescenceIOR: 1.8,
      iridescenceThicknessRange: [100, 400],
      clearcoat: 1.0,
      clearcoatRoughness: 0.0,
      sheen: 0.4,
      sheenColor: 0xffffff,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    applyTransparencyFade(centerGlassMaterial, centerLimits);
    const centerTriangleMesh = new THREE.Mesh(centerGeometry, centerGlassMaterial);

    const centerGroup = new THREE.Group();
    const centerStartY = -800; // Увеличил дистанцию вылета (было -380)
    centerGroup.position.set(0, centerStartY, 0);
    centerGroup.scale.setScalar(0.7);
    centerGroup.add(centerTriangleMesh);
    const layoutScale = 0.5;
    const coinsGroup = new THREE.Group();
    coinsGroup.add(centerGroup);
    scene.add(coinsGroup);

    const PHASE1_DURATION = 1.0; // Сделал чуть быстрее (было 1.2)
    const PHASE2_DURATION = 1.4;
    const PHASE3_CAMERA_DURATION = 1.0;
    const centerEndY = 0;

    const coinGroups: THREE.Group[] = [];
    const targetPositions: THREE.Vector3[] = [];
    const materialsToDispose: THREE.Material[] = [];
    const itemCount =
      layoutMode === "arc"
        ? transforms.length
        : layoutMode === "spiral"
          ? 8
          : Math.max(transforms.length, 8);
    const spiralTurns = 2.2;
    const spiralRadiusNear = coinRadius * 3.1;
    const spiralRadiusFar = coinRadius * 0.95;
    const spiralDepthRange = coinRadius * 8.4;
    const circleOrbitRadius = coinRadius * 6.2; // радиус окружности (чуть меньше)
    const FIGURE_SCALE = 0.7; // фигуры на 30% меньше
    const circleAvatarScale = (160 / (2 * coinRadius)) * FIGURE_SCALE;
    const getSpiralPosition = (i: number, time: number) => {
      const denom = Math.max(1, itemCount - 1);
      const phase = i / denom;
      const baseAngle = -Math.PI / 2 + phase * Math.PI * 2 * spiralTurns;
      const spin = -time * 1.05;
      const radiusBase = spiralRadiusNear + (spiralRadiusFar - spiralRadiusNear) * phase;
      const radiusPulse = 0.94 + 0.06 * Math.sin(time * 1.2 + i * 0.45);
      const radius = radiusBase * radiusPulse;
      // По мере роста phase аватарка уходит дальше от камеры (вглубь сцены).
      const z = -phase * spiralDepthRange;
      const angle = baseAngle + spin;
      return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, z);
    };

    // Линии скорости (стрики) от треугольников — воздушные, с градиентом и волной
    const streakWidth = 32;
    const streakLength = 150;
    const streakGeom = new THREE.PlaneGeometry(streakWidth, streakLength, 2, 28);
    const posAttr = streakGeom.attributes.position;
    const waveAmp = 3.5;
    const waveFreq = 0.04;
    for (let i = 0; i < posAttr.count; i++) {
      const y = posAttr.getY(i);
      posAttr.setX(i, posAttr.getX(i) + waveAmp * Math.sin(y * waveFreq));
    }
    streakGeom.computeVertexNormals();
    streakGeom.translate(0, -streakLength / 2, 0);
    const streakGradientCanvas = document.createElement('canvas');
    streakGradientCanvas.width = 64;
    streakGradientCanvas.height = 256;
    const streakGradientCtx = streakGradientCanvas.getContext('2d')!;
    const streakGradient = streakGradientCtx.createLinearGradient(0, 0, 0, 256);
    streakGradient.addColorStop(0, 'rgba(255,255,255,0)');
    streakGradient.addColorStop(0.2, 'rgba(255,255,255,0.25)');
    streakGradient.addColorStop(0.5, 'rgba(255,255,255,0.9)');
    streakGradient.addColorStop(0.8, 'rgba(255,255,255,0.25)');
    streakGradient.addColorStop(1, 'rgba(255,255,255,0)');
    streakGradientCtx.fillStyle = streakGradient;
    streakGradientCtx.fillRect(0, 0, 64, 256);
    const streakGradientTex = new THREE.CanvasTexture(streakGradientCanvas);
    streakGradientTex.wrapS = THREE.ClampToEdgeWrapping;
    streakGradientTex.wrapT = THREE.ClampToEdgeWrapping;
    const streakMat = new THREE.MeshBasicMaterial({
      map: streakGradientTex,
      color: 0xffffff,
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const createStreaksForGroup = (planeMesh: THREE.Mesh, geom: THREE.BufferGeometry, isBig: boolean, color?: THREE.Color) => {
      const streaks: THREE.Mesh[] = [];
      const posAttr = geom.attributes.position;
      const v1 = new THREE.Vector3();
      const v2 = new THREE.Vector3();
      v1.set(posAttr.getX(1), posAttr.getY(1), posAttr.getZ(1));
      v2.set(posAttr.getX(2), posAttr.getY(2), posAttr.getZ(2));
      const baseCenter = new THREE.Vector3((v1.x + v2.x) / 2, (v1.y + v2.y) / 2, 0);
      const streakMatInstance = streakMat.clone();
      if (color) streakMatInstance.color.copy(color);
      const streak = new THREE.Mesh(streakGeom, streakMatInstance);
      streak.position.set(baseCenter.x, baseCenter.y, 0);
      streak.scale.set(isBig ? 1.4 : 1, 1, 1);
      planeMesh.add(streak);
      streaks.push(streak);
      return streaks;
    };

    const centerStreaks = createStreaksForGroup(centerTriangleMesh, centerGeometry, true, new THREE.Color(CENTER_COLOR));
    (centerGroup as any).streaks = centerStreaks;

    for (let i = 0; i < itemCount; i += 1) {
      const t = transforms[i];
      const colorIndex = i % colors.length;
      const escortColor = colors[colorIndex];

      const escortColorObj = new THREE.Color(escortColor);
      const escortGeometry = geometry.clone();
      const escortLimits = applyGradient(escortGeometry, escortColorObj);

      const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.9,
        roughness: 0.05,
        metalness: 0.0,
        transmission: 1.0,
        ior: 1.4,
        thickness: 12, // Увеличил толщину материала для преломлений
        attenuationColor: escortColorObj,
        attenuationDistance: 1500,
        vertexColors: true,
        emissive: escortColorObj,
        emissiveIntensity: 0.01,
        iridescence: 0.8,
        iridescenceIOR: 1.6,
        iridescenceThicknessRange: [100, 300],
        clearcoat: 0.8,
        clearcoatRoughness: 0.0,
        sheen: 0.3,
        sheenColor: 0xffffff,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      applyTransparencyFade(glassMaterial, escortLimits);
      const coinMesh = new THREE.Mesh(escortGeometry, glassMaterial);

      const targetPosition =
        layoutMode === 'circle'
          ? (() => {
            const count = Math.max(1, itemCount);
            const angle = -Math.PI / 2 + (i / count) * Math.PI * 2;
            const radius = circleOrbitRadius;
            return new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, 0);
          })()
          : layoutMode === 'spiral'
            ? getSpiralPosition(i, 0)
            : new THREE.Vector3((t?.x || 0) * layoutScale, 0, (t?.z || 0) * layoutScale);
      targetPositions.push(targetPosition);

      const coinGroup = new THREE.Group();
      coinGroup.position.set(0, centerStartY, 0);
      coinGroup.add(coinMesh);

      const smallStreaks = createStreaksForGroup(coinMesh, escortGeometry, false, escortColorObj);
      (coinGroup as any).streaks = smallStreaks;

      coinsGroup.add(coinGroup);
      coinGroups.push(coinGroup);
      materialsToDispose.push(glassMaterial);
    }
    materialsToDispose.push(centerGlassMaterial);

    const fitCameraToGroup = (width: number, height: number) => {
      const box = new THREE.Box3().setFromObject(coinsGroup);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      if (layoutMode === 'spiral' || layoutMode === 'circle') {
        // Для спирали и круга (Hero) фиксируем центр, но сдвигаем вправо (400),
        // чтобы не перекрывать текст на левой стороне.
        coinsGroup.position.set(400, 0, 0);
      } else {
        coinsGroup.position.sub(center);
      }

      // Небольшой safe-padding, чтобы крайние аватарки не подрезались у границ.
      const fitPadding = 1.08;
      const halfW =
        layoutMode === 'circle'
          ? coinRadius * 4.7
          : Math.max(40, size.x * 0.56 * fitPadding);
      const halfH =
        layoutMode === 'circle'
          ? coinRadius * 4.7
          : Math.max(40, size.y * 0.56 * fitPadding);
      const fovRad = (camera.fov * Math.PI) / 180;
      const fitDistH = halfH / Math.tan(fovRad / 2);
      const fitDistW = halfW / (Math.tan(fovRad / 2) * (width / height));
      let distance = Math.max(fitDistH, fitDistW) + 240;
      if (layoutMode === 'circle') {
        // Для ava3 делаем сцену ближе: изменения размера аватарок становятся заметны.
        distance *= 0.78;
      }

      camera.position.set(0, 0, distance);
      camera.lookAt(0, 0, 0);
      camera.near = 0.1;
      camera.far = distance + 2000;
      camera.updateProjectionMatrix();
      return distance;
    };
    let cameraDistance = 800;

    let rafId = 0;
    const clock = new THREE.Clock();
    clockRef.current = clock;

    const TARGET_FPS = 30;
    const frameInterval = 1000 / TARGET_FPS;
    let lastFrameTime = 0;

    const resize = () => {
      const rect = mount.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height, true);
      camera.aspect = width / height;
      const d = fitCameraToGroup(width, height);
      if (d != null) cameraDistance = d;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (document.visibilityState === 'hidden') return;
      const now = performance.now();
      const elapsed = now - lastFrameTime;
      if (elapsed < frameInterval) return;
      lastFrameTime = now - (elapsed % frameInterval);
      const t = clock.getElapsedTime();

      if (layoutMode === 'circle') {
        const phase1End = PHASE1_DURATION;
        const phase2Start = phase1End;
        const phase2Duration = 1.2;
        const phase3Start = phase2Start + phase2Duration;
        const phase3Duration = 1.6;

        const t3 = Math.max(0, t - phase3Start);
        const p3 = Math.min(1, t3 / phase3Duration);
        const ease3 = Math.sin((p3 * Math.PI) / 2); // easeOutSine

        // Базовые углы курса (вправо-вверх)
        const targetRotX = (Math.PI / 4.5) * ease3;
        const targetRotY = (Math.PI / 9) * ease3;
        const targetRotZ = (-Math.PI / 4) * ease3;

        // --- Эффекты "жизни" (Wobble) ---
        // Индивидуальные покачивания для каждого самолета
        const getWobble = (offset: number, scale = 1) => {
          const time = t + offset;
          return {
            x: Math.sin(time * 1.5) * 0.10 * scale, // Было 0.05
            y: Math.cos(time * 1.2) * 0.10 * scale, // Было 0.05
            z: Math.sin(time * 0.8) * 0.08 * scale, // Было 0.03
            pos: Math.sin(time * 2.0) * 6 * scale  // Было 2
          };
        };

        const centerWobble = getWobble(0, 1);

        // Phase 1: Big Triangle Fly-out
        const p1 = Math.min(1, t / phase1End);
        const ease1 = p1 === 1 ? 1 : 1 - Math.pow(2, -10 * p1);
        centerGroup.position.set(
          centerWobble.x * 5,
          centerStartY + (0 - centerStartY) * ease1 + centerWobble.pos,
          0
        );
        centerGroup.rotation.set(
          targetRotX + centerWobble.x,
          targetRotY + centerWobble.y,
          targetRotZ + centerWobble.z
        );
        centerTriangleMesh.rotation.y = t * 1.2; // Вращение вокруг собственной оси (Roll)

        // Phase 2: Small Triangles Appearance
        if (t > phase2Start) {
          const t2 = t - phase2Start;
          const progress2 = Math.min(1, t2 / phase2Duration);

          coinGroups.forEach((group, i) => {
            const targetPosition = targetPositions[i];
            if (!targetPosition) return;

            group.visible = true;
            const stagger = (i / Math.max(1, itemCount)) * 0.4;
            const localP = Math.min(1, Math.max(0, (progress2 - stagger) / (1 - stagger)));

            // Инерционный разлет (overshoot)
            // easeOutBack: c1 * x^3 - c2 * x^2 + c3 * x
            const c1 = 1.70158;
            const c3 = c1 + 1;
            const ease2 = localP === 1 ? 1 : 1 + c3 * Math.pow(localP - 1, 3) + c1 * Math.pow(localP - 1, 2);

            const wobble = getWobble(i * 10, 0.7);

            // Разлет в круг, без перестроения на третьей фазе — держим фиксированную формацию
            const timeSinceP3 = Math.max(0, t - phase3Start - phase3Duration);
            if (timeSinceP3 <= 0) {
              group.position.lerpVectors(
                new THREE.Vector3(0, 0, 0),
                new THREE.Vector3(targetPosition.x, targetPosition.y, 0),
                ease2
              );
            } else {
              group.position.set(targetPosition.x, targetPosition.y, 0);
            }

            // Добавляем микро-движение
            group.position.y += wobble.pos;
            group.position.x += wobble.x * 20; // Небольшой рыск в стороны
            group.scale.setScalar(circleAvatarScale * localP); // Масштаб без овершута для аккуратности

            // Индивидуальный маневр: самолет №2 делает бочку
            let extraRoll = 0;
            if (i === 2 && t > phase3Start) {
              const rollP = Math.min(1, (t - phase3Start) / (phase3Duration * 0.8));
              extraRoll = rollP * Math.PI * 2;
            }

            group.rotation.set(
              targetRotX + wobble.x + extraRoll,
              targetRotY + wobble.y,
              targetRotZ + wobble.z
            );
            // Вращение меша внутри группы вокруг локальной оси Y (носа)
            (group.children[0] as THREE.Mesh).rotation.y = t * 1.8 + i;
          });
        } else {
          coinGroups.forEach((g) => (g.visible = false));
        }

        // --- Новая логика взаимодействия (Tilt & Boost) ---
        const mouseXRot = mousePosRef.current.y * 0.15;
        const mouseYRot = mousePosRef.current.x * 0.15;

        // Плавное приближение к состоянию Boost
        const boostTarget = isBoostingRef.current ? 1.0 : 0.0;
        boostAmountRef.current = THREE.MathUtils.lerp(boostAmountRef.current, boostTarget, 0.1);
        const boostAmount = boostAmountRef.current;

        // Применяем наклон к основной группе
        coinsGroup.rotation.x = THREE.MathUtils.lerp(coinsGroup.rotation.x, mouseXRot, 0.05);
        coinsGroup.rotation.y = THREE.MathUtils.lerp(coinsGroup.rotation.y, mouseYRot, 0.05);

        // Камера с эффектом "ручной съемки" + реакция на буст
        const shakeIntensity = 10 + boostAmount * 15;
        const camShakeX = Math.sin(t * 0.5) * shakeIntensity;
        const camShakeY = Math.cos(t * 0.4) * shakeIntensity;
        camera.position.set(camShakeX, camShakeY, cameraDistance * (2.2 - boostAmount * 0.2));
        camera.lookAt(camShakeX * 0.5, camShakeY * 0.5, 0);

        // Стрики: в фазе 3 через 2 с выходят на 100%; по клику — сразу 100%
        const timeInPhase3 = Math.max(0, t - phase3Start);
        const rampDuration = 2;
        const rampMult = Math.min(1, timeInPhase3 / rampDuration);
        const streakActivityMult = isBoostingRef.current ? 1.0 : 0.5 + 0.5 * rampMult;

        const updateStreaks = (group: THREE.Group, speedFactor: number) => {
          const streaks = (group as any).streaks as THREE.Mesh[] | undefined;
          if (!streaks) return;
          let adjustedSpeed = Math.max(0.15, speedFactor + boostAmount * 2);
          adjustedSpeed *= streakActivityMult;
          const opacityBase = adjustedSpeed * 1.2;
          const streakOpacity = Math.min(0.75, opacityBase) * (0.7 + Math.random() * 0.6);
          streaks.forEach(s => {
            s.visible = true;
            const mat = s.material as THREE.MeshBasicMaterial;
            mat.opacity = streakOpacity;
            s.scale.y = adjustedSpeed * 2.0 + (Math.sin(t * 30) * 0.2);
            s.scale.x = (group === centerGroup ? 2 : 1) * (0.8 + Math.random() * 0.4);
          });
        };
        const phase1Progress = Math.min(1, t / phase1End);
        const centerSpeed = phase1Progress < 1 ? Math.abs(Math.sin(phase1Progress * Math.PI)) : 0.08;
        updateStreaks(centerGroup, centerSpeed);
        coinGroups.forEach((group, i) => {
          if (!group.visible) return;
          const t2 = Math.max(0, t - phase2Start);
          const progress2 = Math.min(1, t2 / phase2Duration);
          const stagger = (i / Math.max(1, itemCount)) * 0.4;
          const localP = Math.min(1, Math.max(0, (progress2 - stagger) / (1 - stagger)));
          let speed = 0.08;
          if (localP > 0 && localP < 1) speed = Math.abs(Math.sin(localP * Math.PI)) * 1.5;
          updateStreaks(group, speed);
        });

        } else {
        centerGroup.rotation.y = t * 0.85;
        centerGroup.rotation.z = t * 0.32;
        camera.position.set(0, 0, cameraDistance);
        camera.lookAt(0, 0, 0);
      }
      const spawnPoint = new THREE.Vector3(0, 0, 0);
      const center = new THREE.Vector3(0, 0, 0);
      const scatterRadius = circleOrbitRadius * 1.85;
      const phase = phaseRef.current;
      const phaseStart = phaseStartRef.current;

      coinGroups.forEach((group, i) => {
        if (layoutMode === 'circle') return;
        const targetPosition = targetPositions[i];
        if (targetPosition) {
          group.position.lerpVectors(spawnPoint, targetPosition, 1);
        }

        if (layoutMode === 'arc') {
          group.visible = true;
          group.scale.setScalar(1);
          group.rotation.y = 0;
          group.rotation.z = t * 0.5;
          return;
        }
        if (layoutMode === 'spiral') {
          const cyclePeriodSec = 9.6;
          const basePhase = (t / cyclePeriodSec) % 1;
          const phaseOffset = i / Math.max(1, itemCount);
          const cyclePhase = ((basePhase - phaseOffset) % 1 + 1) % 1;
          const localTime = t - phaseOffset * cyclePeriodSec;
          const phaseAEnd = 0.72;
          const phaseBEnd = 0.92;
          const maxRadius = coinRadius * 6.0;
          const extraRadius = coinRadius * 4.0;
          const depthRange = coinRadius * 12.5;
          const totalSpiralTurns = Math.PI * 2 * 2.1;

          if (cyclePhase < phaseAEnd) {
            const p = cyclePhase / phaseAEnd;
            const angle = -Math.PI / 2 - p * totalSpiralTurns;
            const radius = maxRadius * p;
            const z = -(1 - p) * depthRange;
            group.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, z);
            group.scale.setScalar(0.28 + p * 1.12);
            group.visible = true;
          } else if (cyclePhase < phaseBEnd) {
            const p = (cyclePhase - phaseAEnd) / (phaseBEnd - phaseAEnd);
            const angle = -Math.PI / 2 - (1 + p * 0.18) * totalSpiralTurns;
            const radius = maxRadius + extraRadius * p;
            const z = 0;
            group.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, z);
            const phaseBStartScale = 1.4;
            const phaseBEndScale = 2.9;
            const smooth = p * p * (3 - 2 * p);
            group.scale.setScalar(phaseBStartScale + (phaseBEndScale - phaseBStartScale) * smooth);
            group.visible = true;
          } else {
            group.visible = false;
            group.position.set(0, 0, -depthRange);
            group.scale.setScalar(0.001);
          }

          group.rotation.x = localTime * 0.95;
          group.rotation.y = localTime * 1.45;
          group.rotation.z = 0;
          return;
        }

        group.visible = true;
        group.scale.setScalar(1);
        group.rotation.y = 0;
        group.rotation.z = t * 0.5;
      });
      renderer.render(scene, camera);
    };

    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    resize();
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchstart', handleMouseMove);
      window.removeEventListener('touchstart', handleMouseDown);
      window.removeEventListener('touchend', handleMouseUp);
      if (mount && renderer.domElement.parentElement === mount) {
        mount.removeChild(renderer.domElement);
      }
      ro.disconnect();
      cancelAnimationFrame(rafId);
      // Очистка ресурсов WebGL
      renderer.dispose();
      materialsToDispose.forEach(m => m.dispose());
      geometry.dispose();
      centerGeometry.dispose();
      streakGeom.dispose();
      streakGradientTex.dispose();
    };
  }, [transforms, colors, layoutMode]);

  return (
    <div
      ref={mountRef}
      className={className ? `absolute inset-0 w-full h-full overflow-hidden ${className}` : "absolute inset-0 w-full h-full overflow-hidden"}
      style={
        transparentBackground
          ? undefined
          : {
              background: `
          radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.4) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(124, 58, 237, 0.3) 0%, transparent 70%),
          #1e1b4b
        `
            }
      }
    />
  );
}
