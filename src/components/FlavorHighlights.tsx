'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';

export interface FlavorItem {
  id: string;
  name: string;
  image: string;
}

export const FLAVORS: FlavorItem[] = [
  {
    id: 'frutas-vermelhas',
    name: 'Frutas Vermelhas',
    image: '/images/hero/flavor-frutas-vermelhas.webp',
  },
  {
    id: 'pistache',
    name: 'Pistache Siciliano',
    image: '/images/hero/flavor-pistache.webp',
  },
  {
    id: 'chocolate',
    name: 'Chocolate Belga',
    image: '/images/hero/flavor-chocolate.webp',
  },
  {
    id: 'maracuja',
    name: 'Maracujá com Ninho',
    image: '/images/hero/flavor-maracuja.webp',
  },
];

// Triplicamos os itens para criar o loop infinito perfeito para os dois lados (esquerda e direita)
const INFINITE_FLAVORS = [
  ...FLAVORS.map((item) => ({ ...item, uid: `set0-${item.id}` })),
  ...FLAVORS.map((item) => ({ ...item, uid: `set1-${item.id}` })),
  ...FLAVORS.map((item) => ({ ...item, uid: `set2-${item.id}` })),
];

export function FlavorHighlights() {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    let rafId: number | null = null;
    let isDragging = false;
    let startX = 0;
    let lastX = 0;
    let lastTime = 0;
    let velocity = 0;
    let offset = 0;
    let singleSetWidth = 0;
    let resumeAutoPlayTimer: ReturnType<typeof setTimeout> | null = null;
    let isAutoPlaying = true;

    const AUTO_SPEED = 0.45; // Velocidade suave do carrossel contínuo

    const measureSetWidth = () => {
      const cards = track.querySelectorAll<HTMLElement>('.flavor-card-mobile');
      if (cards.length < FLAVORS.length * 2) return;
      // Distância exata entre o primeiro card do set 0 e o primeiro card do set 1
      const firstCardSet0 = cards[0];
      const firstCardSet1 = cards[FLAVORS.length];
      const measured = firstCardSet1.offsetLeft - firstCardSet0.offsetLeft;
      if (measured > 0) {
        singleSetWidth = measured;
        if (offset === 0) {
          offset = -singleSetWidth;
        }
      }
    };

    const normalizeOffset = () => {
      if (singleSetWidth <= 0) return;
      // Mantém o offset sempre no intervalo [-2 * singleSetWidth, -singleSetWidth] sem salto visual
      while (offset <= -singleSetWidth * 2) {
        offset += singleSetWidth;
      }
      while (offset > -singleSetWidth) {
        offset -= singleSetWidth;
      }
    };

    const applyTransform = () => {
      track.style.transform = `translate3d(${offset.toFixed(2)}px, 0, 0)`;
    };

    const step = () => {
      if (singleSetWidth === 0) {
        measureSetWidth();
      }

      if (!isDragging) {
        if (Math.abs(velocity) > 0.08) {
          // Inércia suave após soltar o arraste
          offset += velocity;
          velocity *= 0.94;
        } else if (isAutoPlaying) {
          velocity = 0;
          offset -= AUTO_SPEED;
        }
        normalizeOffset();
        applyTransform();
      }

      rafId = requestAnimationFrame(step);
    };

    measureSetWidth();
    applyTransform();
    rafId = requestAnimationFrame(step);

    const handlePointerDown = (e: PointerEvent) => {
      // Apenas botão principal do mouse ou toque
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      measureSetWidth();
      isDragging = true;
      isAutoPlaying = false;
      if (resumeAutoPlayTimer) clearTimeout(resumeAutoPlayTimer);

      startX = e.clientX;
      lastX = e.clientX;
      lastTime = performance.now();
      velocity = 0;

      track.classList.add('is-dragging');
      try {
        track.setPointerCapture(e.pointerId);
      } catch {
        // Ignora caso o ponteiro não suporte capture
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      const dt = Math.max(1, now - lastTime);

      offset += dx;
      // Calcula velocidade instantânea suavizada para a inércia ao soltar
      velocity = dx * (16 / dt) * 0.85;

      lastX = e.clientX;
      lastTime = now;

      normalizeOffset();
      applyTransform();
    };

    const handlePointerUpOrCancel = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('is-dragging');
      try {
        if (track.hasPointerCapture(e.pointerId)) {
          track.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignora
      }

      // Retoma o movimento contínuo suave após a inércia terminar
      resumeAutoPlayTimer = setTimeout(() => {
        isAutoPlaying = true;
      }, 1400);
    };

    const handleResize = () => {
      measureSetWidth();
      normalizeOffset();
      applyTransform();
    };

    track.addEventListener('pointerdown', handlePointerDown);
    track.addEventListener('pointermove', handlePointerMove);
    track.addEventListener('pointerup', handlePointerUpOrCancel);
    track.addEventListener('pointercancel', handlePointerUpOrCancel);
    window.addEventListener('resize', handleResize);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (resumeAutoPlayTimer) clearTimeout(resumeAutoPlayTimer);
      track.removeEventListener('pointerdown', handlePointerDown);
      track.removeEventListener('pointermove', handlePointerMove);
      track.removeEventListener('pointerup', handlePointerUpOrCancel);
      track.removeEventListener('pointercancel', handlePointerUpOrCancel);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="hero-highlights-block">
      <span className="highlights-label">NOSSOS DESTAQUES</span>

      {/* Grade estática de 4 colunas para Desktop */}
      <div className="highlights-grid highlights-desktop-only">
        {FLAVORS.map((flavor) => (
          <article key={flavor.id} className="flavor-card">
            <div className="flavor-thumb-wrapper">
              <Image
                src={flavor.image}
                alt={`Gelato ${flavor.name}`}
                width={84}
                height={84}
                className="flavor-thumb-img"
                priority
                draggable={false}
              />
            </div>
            <div className="flavor-info-row">
              <span className="flavor-name">{flavor.name}</span>
              <span className="flavor-arrow" aria-hidden="true">→</span>
            </div>
          </article>
        ))}
      </div>

      {/* Carrossel Infinito e Arrastável (Drag + Inércia + Auto-loop) para Mobile */}
      <div className="highlights-carousel-viewport highlights-mobile-only" aria-label="Carrossel de sabores em destaque">
        <div ref={trackRef} className="highlights-carousel-track">
          {INFINITE_FLAVORS.map((flavor) => (
            <article key={flavor.uid} className="flavor-card flavor-card-mobile">
              <div className="flavor-thumb-wrapper">
                <Image
                  src={flavor.image}
                  alt={`Gelato ${flavor.name}`}
                  width={84}
                  height={84}
                  className="flavor-thumb-img"
                  priority
                  draggable={false}
                />
              </div>
              <div className="flavor-info-row">
                <span className="flavor-name">{flavor.name}</span>
                <span className="flavor-arrow" aria-hidden="true">→</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

