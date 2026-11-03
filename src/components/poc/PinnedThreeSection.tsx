'use client';

import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export function PinnedThreeSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const metricValRef = useRef<HTMLSpanElement>(null);

  // Valor imperativo de progresso (State Bridge direto sem re-render React)
  const progressRef = useRef(0);

  // Referência para descarte determinístico de recursos Three.js
  const threeCleanupRef = useRef<(() => void) | null>(null);

  // 1. Inicialização e Ciclo de Vida do Three.js
  useEffect(() => {
    const container = canvasContainerRef.current;
    if (!container) return;

    // Teste precoce de suporte a WebGL 2
    let hasWebGL = false;
    try {
      const c = document.createElement('canvas');
      hasWebGL = !!(window.WebGL2RenderingContext && c.getContext('webgl2'));
    } catch {
      hasWebGL = false;
    }

    if (!hasWebGL) {
      container.classList.add('has-no-webgl');
      return;
    }

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 500;

    // Criação do renderizador WebGL na Main Thread com pixel ratio governado
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.1;

    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50);
    camera.position.set(0, 0, 5.8);

    // Iluminação rica inspirada em alta gastronomia (tons quentes e rim light)
    const ambientLight = new THREE.AmbientLight(0xfff8f0, 1.2);
    const keyLight = new THREE.DirectionalLight(0xffecd1, 2.8);
    keyLight.position.set(4, 5, 4);

    const rimLight = new THREE.DirectionalLight(0x9bb58d, 2.0); // Acento pistache
    rimLight.position.set(-4, -2, -3);

    const fillLight = new THREE.DirectionalLight(0xf4d58d, 1.0); // Acento dourado
    fillLight.position.set(0, -3, 3);

    scene.add(ambientLight, keyLight, rimLight, fillLight);

    // Geometria orgânica autoral: espiral helicoidal representando o movimento de extração do gelato
    const geometry = new THREE.TorusKnotGeometry(1.05, 0.36, 128, 32, 2, 3);
    
    // Material com clearcoat e reflexos acetinados (simulando textura sedosa e brilhante)
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xd4a373), // Caramelo / avelã tostada
      roughness: 0.28,
      metalness: 0.05,
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
      sheen: 0.4,
      sheenColor: new THREE.Color(0xf4d58d),
      emissive: new THREE.Color(0x3d2c25),
      emissiveIntensity: 0.15,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Anéis de partículas orbitais decorativas
    const particleCount = 48;
    const particleGeo = new THREE.SphereGeometry(0.035, 12, 12);
    const particleMat = new THREE.MeshStandardMaterial({
      color: 0x9bb58d, // Partículas de pistache
      roughness: 0.5,
    });

    const particlesGroup = new THREE.Group();
    const particleOffsets: { radius: number; speed: number; angle: number; y: number }[] = [];

    for (let i = 0; i < particleCount; i++) {
      const pMesh = new THREE.Mesh(particleGeo, particleMat);
      const radius = 1.8 + Math.random() * 0.9;
      const angle = (i / particleCount) * Math.PI * 2;
      const y = (Math.random() - 0.5) * 1.6;
      pMesh.position.set(Math.cos(angle) * radius, y, Math.sin(angle) * radius);
      particlesGroup.add(pMesh);
      particleOffsets.push({ radius, speed: (0.2 + Math.random() * 0.3) * (i % 2 === 0 ? 1 : -1), angle, y });
    }
    scene.add(particlesGroup);

    let isRunning = true;
    let clock = 0;

    const render = () => {
      if (!isRunning) return;
      clock += 0.016;

      const p = progressRef.current;
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (!prefersReduced) {
        // Resposta bidirecional controlada milimetricamente pelo progresso de scroll
        mesh.rotation.y = p * Math.PI * 3 + Math.sin(clock * 0.5) * 0.05;
        mesh.rotation.x = Math.sin(p * Math.PI) * 0.5 + Math.cos(clock * 0.4) * 0.04;
        mesh.position.y = (p - 0.5) * 0.6 + Math.sin(clock * 1.2) * 0.04;
        mesh.scale.setScalar(0.92 + Math.sin(p * Math.PI) * 0.25);

        // Movimento suave das partículas
        particlesGroup.rotation.y = clock * 0.3 + p * Math.PI;
      } else {
        // Repouso estático caso usuário tenha sensibilidade ao movimento
        mesh.rotation.set(0.3, 0.6, 0);
        mesh.position.set(0, 0, 0);
        mesh.scale.setScalar(1);
      }

      renderer.render(scene, camera);
      requestAnimationFrame(render);
    };

    render();

    // Redimensionamento responsivo sem layout reflow
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w < 2 || h < 2) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // Registro da função de limpeza estrita
    threeCleanupRef.current = () => {
      isRunning = false;
      resizeObserver.disconnect();
      geometry.dispose();
      material.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };

    return () => {
      threeCleanupRef.current?.();
    };
  }, []);

  // 2. Orquestração do ScrollTrigger via hook oficial useGSAP
  useGSAP(
    () => {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefersReduced) {
        progressRef.current = 0.5;
        if (progressBarRef.current) progressBarRef.current.style.width = '50%';
        if (metricValRef.current) metricValRef.current.textContent = '50%';
        return;
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=150%',
        pin: true,
        scrub: 0.5, // Suavização de retorno milimétrica (scrub reversível)
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          progressRef.current = p;

          // Atualização de elementos de telemetria visual da PoC
          if (progressBarRef.current) {
            progressBarRef.current.style.width = `${(p * 100).toFixed(1)}%`;
          }
          if (metricValRef.current) {
            metricValRef.current.textContent = `${Math.round(p * 100)}%`;
          }
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="pin-section">
      <div className="pin-grid">
        <div className="pin-content">
          <span className="pin-kicker">Prova de Conceito • Core Interativo</span>
          <h2 className="pin-title">Escultura em Movimento: A Física da Cremosa Densidade</h2>
          <p className="pin-description">
            A forma helicoidal tridimensional reage em tempo real à velocidade e direção da sua rolagem. 
            Experimente avançar e recuar: o motor sincroniza perfeitamente o cálculo virtual do Lenis, 
            os nós do ScrollTrigger e a renderização física do Three.js a 60 fps constantes.
          </p>

          <div className="progress-metric-card">
            <div className="metric-header">
              <span>Sincronização de Scroll (Scrub Reversível)</span>
              <span ref={metricValRef} className="metric-value">0%</span>
            </div>
            <div className="progress-track">
              <div ref={progressBarRef} className="progress-fill" />
            </div>
          </div>
        </div>

        <div ref={canvasContainerRef} className="pin-canvas-container">
          {/* Fallback elegante exibido apenas se WebGL2 não for suportado */}
          <div className="gl-fallback-static" aria-hidden="true" />
        </div>
      </div>
    </section>
  );
}
