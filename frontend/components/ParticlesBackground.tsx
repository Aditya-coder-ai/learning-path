import { useEffect, useRef } from "react";
import * as THREE from "three";

const NODE_COUNT = 56;
const STAR_COUNT = 1800;
const CONNECT_DIST = 2.7;
const MAX_CONNECTIONS = (NODE_COUNT * (NODE_COUNT - 1)) / 2;

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      52,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 13);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const clock = new THREE.Clock();
    const networkGroup = new THREE.Group();
    scene.add(networkGroup);

    const ambientLight = new THREE.AmbientLight(0x88aaff, 0.65);
    const rimLight = new THREE.PointLight(0x7c3aed, 4.5, 28, 2);
    rimLight.position.set(4, 2, 8);
    const fillLight = new THREE.PointLight(0x22d3ee, 3.6, 30, 2);
    fillLight.position.set(-6, -2, 6);
    scene.add(ambientLight, rimLight, fillLight);

    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.55, 1),
      new THREE.MeshStandardMaterial({
        color: 0x9fb5ff,
        emissive: 0x4338ca,
        emissiveIntensity: 1.35,
        metalness: 0.15,
        roughness: 0.2,
        transparent: true,
        opacity: 0.4,
        flatShading: true,
      })
    );
    networkGroup.add(core);

    const coreShell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.1, 1),
      new THREE.MeshBasicMaterial({
        color: 0x818cf8,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      })
    );
    networkGroup.add(coreShell);

    const orbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.9, 0.015, 16, 220),
      new THREE.MeshBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.3,
      })
    );
    orbitRing.rotation.x = Math.PI / 2.8;
    orbitRing.rotation.y = Math.PI / 5;
    networkGroup.add(orbitRing);

    const nodeGeometry = new THREE.SphereGeometry(0.09, 12, 12);
    const nodes: THREE.Mesh[] = [];
    const basePositions: THREE.Vector3[] = [];
    const phases: number[] = [];
    const amplitudes: number[] = [];

    for (let i = 0; i < NODE_COUNT; i++) {
      const radius = 2.8 + Math.random() * 3.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const position = new THREE.Vector3(
        radius * Math.sin(phi) * Math.cos(theta),
        radius * 0.58 * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta) - 1.2
      );

      basePositions.push(position);
      phases.push(Math.random() * Math.PI * 2);
      amplitudes.push(0.18 + Math.random() * 0.22);

      const color = new THREE.Color().setHSL(
        0.58 + Math.random() * 0.12,
        0.78,
        0.68
      );
      const material = new THREE.MeshStandardMaterial({
        color,
        emissive: color.clone().multiplyScalar(0.5),
        emissiveIntensity: 1.3,
        roughness: 0.15,
        metalness: 0.12,
        transparent: true,
        opacity: 0.88,
      });

      const node = new THREE.Mesh(nodeGeometry, material);
      const scale = 0.8 + Math.random() * 1.65;
      node.scale.setScalar(scale);
      node.position.copy(position);
      nodes.push(node);
      networkGroup.add(node);
    }

    const linePositions = new Float32Array(MAX_CONNECTIONS * 6);
    const lineGeometry = new THREE.BufferGeometry();
    const lineAttribute = new THREE.BufferAttribute(linePositions, 3);
    lineAttribute.setUsage(THREE.DynamicDrawUsage);
    lineGeometry.setAttribute("position", lineAttribute);
    lineGeometry.setDrawRange(0, 0);

    const lines = new THREE.LineSegments(
      lineGeometry,
      new THREE.LineBasicMaterial({
        color: 0x818cf8,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
      })
    );
    networkGroup.add(lines);

    const starPositions = new Float32Array(STAR_COUNT * 3);
    const starColors = new Float32Array(STAR_COUNT * 3);
    const colorA = new THREE.Color(0x818cf8);
    const colorB = new THREE.Color(0x67e8f9);
    const colorC = new THREE.Color(0xffffff);

    for (let i = 0; i < STAR_COUNT; i++) {
      const radius = 12 + Math.random() * 22;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      starPositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = radius * Math.cos(phi) * 0.75;
      starPositions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) - 10;

      const blended = colorA
        .clone()
        .lerp(colorB, Math.random())
        .lerp(colorC, Math.random() * 0.35);
      starColors[i * 3] = blended.r;
      starColors[i * 3 + 1] = blended.g;
      starColors[i * 3 + 2] = blended.b;
    }

    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute("color", new THREE.BufferAttribute(starColors, 3));

    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        size: 0.05,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        sizeAttenuation: true,
      })
    );
    scene.add(stars);

    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(320 * 3);
    for (let i = 0; i < 320; i++) {
      dustPositions[i * 3] = (Math.random() - 0.5) * 18;
      dustPositions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      dustPositions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    }
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));

    const dust = new THREE.Points(
      dustGeometry,
      new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.03,
        transparent: true,
        opacity: 0.16,
        depthWrite: false,
      })
    );
    scene.add(dust);

    const pointer = new THREE.Vector2();
    const pointerSmooth = new THREE.Vector2();
    let animationFrame = 0;

    const handlePointerMove = (event: PointerEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("resize", handleResize);

    const animate = () => {
      animationFrame = window.requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      pointer.set(mouseRef.current.x, mouseRef.current.y);
      pointerSmooth.lerp(pointer, 0.05);

      let segmentCount = 0;

      nodes.forEach((node, index) => {
        const base = basePositions[index];
        const phase = phases[index];
        const amplitude = amplitudes[index];
        const drift = 1 + amplitude * 0.5;

        node.position.x =
          base.x +
          Math.sin(elapsed * 0.65 + phase) * amplitude +
          Math.cos(elapsed * 0.32 + index) * 0.08;
        node.position.y =
          base.y +
          Math.cos(elapsed * 0.8 + phase * 1.1) * amplitude * 0.85 +
          pointerSmooth.y * drift;
        node.position.z =
          base.z +
          Math.sin(elapsed * 0.52 + phase * 1.7) * amplitude * 1.4 +
          pointerSmooth.x * drift;

        node.scale.setScalar(
          0.78 + Math.sin(elapsed * 1.8 + phase) * 0.12 + amplitudes[index] * 2.8
        );

        const material = node.material as THREE.MeshStandardMaterial;
        material.emissiveIntensity = 0.95 + Math.sin(elapsed * 2.2 + phase) * 0.35;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const distance = nodes[i].position.distanceTo(nodes[j].position);
          if (distance < CONNECT_DIST && segmentCount < MAX_CONNECTIONS) {
            const offset = segmentCount * 6;
            linePositions[offset] = nodes[i].position.x;
            linePositions[offset + 1] = nodes[i].position.y;
            linePositions[offset + 2] = nodes[i].position.z;
            linePositions[offset + 3] = nodes[j].position.x;
            linePositions[offset + 4] = nodes[j].position.y;
            linePositions[offset + 5] = nodes[j].position.z;
            segmentCount += 1;
          }
        }
      }

      lineGeometry.setDrawRange(0, segmentCount * 2);
      lineAttribute.needsUpdate = true;

      networkGroup.rotation.y += 0.0012;
      networkGroup.rotation.x = pointerSmooth.y * 0.12;
      networkGroup.position.x = pointerSmooth.x * 0.6;
      networkGroup.position.y = -pointerSmooth.y * 0.45;

      core.rotation.x = elapsed * 0.22;
      core.rotation.y = elapsed * 0.3;
      coreShell.rotation.x = -elapsed * 0.12;
      coreShell.rotation.y = elapsed * 0.18;
      orbitRing.rotation.z = elapsed * 0.24;

      stars.rotation.y = elapsed * 0.012;
      stars.rotation.x = -elapsed * 0.006;
      dust.rotation.y = -elapsed * 0.024;
      dust.position.x = pointerSmooth.x * 0.45;
      dust.position.y = -pointerSmooth.y * 0.3;

      camera.position.x += (pointerSmooth.x * 1.1 - camera.position.x) * 0.035;
      camera.position.y += (-pointerSmooth.y * 0.9 - camera.position.y) * 0.035;
      camera.lookAt(0, 0, -1.5);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", handleResize);

      nodeGeometry.dispose();
      (core.geometry as THREE.BufferGeometry).dispose();
      (core.material as THREE.Material).dispose();
      (coreShell.geometry as THREE.BufferGeometry).dispose();
      (coreShell.material as THREE.Material).dispose();
      (orbitRing.geometry as THREE.BufferGeometry).dispose();
      (orbitRing.material as THREE.Material).dispose();
      nodes.forEach((node) => {
        (node.material as THREE.Material).dispose();
      });
      lineGeometry.dispose();
      (lines.material as THREE.Material).dispose();
      starGeometry.dispose();
      (stars.material as THREE.Material).dispose();
      dustGeometry.dispose();
      (dust.material as THREE.Material).dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="particles-canvas"
      style={{ zIndex: 0, pointerEvents: "none" }}
    />
  );
}
