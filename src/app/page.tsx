'use client';

import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { SmoothScroll } from '@/components/poc/SmoothScroll';
import { HeroScrollFrames } from '@/components/HeroScrollFrames';
import { SecondFoldScrollFrames } from '@/components/SecondFoldScrollFrames';
import { FlavorHighlights } from '@/components/FlavorHighlights';
import { FlavorShowcase } from '@/components/FlavorShowcase';
import { PromoBanner } from '@/components/PromoBanner';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function DolceviaHome() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const secondFoldRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const container = containerRef.current;
      const hero = heroSectionRef.current;
      const secondFold = secondFoldRef.current;

      if (!container || !hero || !secondFold) return;

      // Timeline mestre pinando o container:
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '+=420%',
          pin: true,
          scrub: true,
          anticipatePin: 1,
        },
      });

      // 1. Duração do primeiro vídeo (0 a 1.2s)
      tl.to({}, { duration: 1.25 })
        // 2. Transição da segunda dobra deslizando da direita (1.25s a 2.25s)
        .fromTo(
          secondFold,
          { x: '100%' },
          { x: '0%', ease: 'power2.inOut', duration: 1.0 }
        );

      // 3. EFEITO QUEBRA-CABEÇA:
      // À medida que o segundo vídeo rueda (2.25s a 4.25s), cada peça do cardápio
      // surge de diferentes ângulos/distâncias e se encaixa no lugar perfeito
      // concluindo exatamente no último frame do vídeo.
      const puzzleStartTime = 2.25;

      // Peça 1: Cabeçalho (entra descendo e alinhando)
      tl.fromTo(
        '.puzzle-header',
        { y: -36, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', ease: 'power1.out', duration: 0.65 },
        puzzleStartTime
      );

      // Peça 2: Itens do menu entram em cascata com leve rotação como blocos encaixando
      tl.fromTo(
        '.puzzle-item-0',
        { x: -50, y: -10, rotation: -3, opacity: 0, scale: 0.94 },
        { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, ease: 'power2.out', duration: 0.55 },
        puzzleStartTime + 0.25
      );

      tl.fromTo(
        '.puzzle-item-1',
        { x: -50, y: -5, rotation: 2, opacity: 0, scale: 0.94 },
        { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, ease: 'power2.out', duration: 0.55 },
        puzzleStartTime + 0.45
      );

      tl.fromTo(
        '.puzzle-item-2',
        { x: -50, y: 5, rotation: -2, opacity: 0, scale: 0.94 },
        { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, ease: 'power2.out', duration: 0.55 },
        puzzleStartTime + 0.65
      );

      tl.fromTo(
        '.puzzle-item-3',
        { x: -50, y: 10, rotation: 3, opacity: 0, scale: 0.94 },
        { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, ease: 'power2.out', duration: 0.55 },
        puzzleStartTime + 0.85
      );

      // Peça 3: Card de detalhes sensorial do sabor (sobe com efeito de encaixe 3D)
      tl.fromTo(
        '.puzzle-card',
        { y: 45, x: 20, rotation: 2, opacity: 0, scale: 0.92, filter: 'blur(6px)' },
        { y: 0, x: 0, rotation: 0, opacity: 1, scale: 1, filter: 'blur(0px)', ease: 'power2.out', duration: 0.75 },
        puzzleStartTime + 1.05
      );

      // Peça 4: CTA e nota de rodapé (trava o quebra-cabeça exatamente no último frame)
      tl.fromTo(
        '.puzzle-cta',
        { y: 25, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, ease: 'power1.out', duration: 0.5 },
        puzzleStartTime + 1.45
      );
    },
    { scope: containerRef }
  );

  return (
    <SmoothScroll>
      <div ref={containerRef} className="dolcevia-experience-container">
        {/* 1. Primeira Dobra: Hero com vídeo 1 controlado por scroll */}
        <section ref={heroSectionRef} id="hero" className="dolcevia-hero-section">
          {/* Header / Navbar Superior */}
          <header className="dolcevia-navbar">
            <a href="#hero" className="brand-wrapper" aria-label="Dolcevia Gelato Artesanal">
              <div className="brand-crest">
                <svg width="34" height="34" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M20 5C14.5 5 11 9.5 11 14.5C11 17.5 13 19.5 15.5 21C13 22.5 10 24.8 10 28C10 32.5 14.5 35 20 35C25.5 35 30 32.5 30 28C30 24.8 27 22.5 24.5 21C27 19.5 29 17.5 29 14.5C29 9.5 25.5 5 20 5Z"
                    stroke="#FCD7B0"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15.5 14C15.5 10.5 17.5 7.5 20 7.5C22.5 7.5 24.5 10.5 24.5 14"
                    stroke="#FCD7B0"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                  <path
                    d="M14 27.5C16 25.5 18 24.5 20 24.5C22 24.5 24 25.5 26 27.5"
                    stroke="#FCD7B0"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div className="brand-text-group">
                <span className="brand-name">Dolcevia</span>
                <span className="brand-tagline">GELATO ARTESANAL</span>
              </div>
            </a>

            <nav aria-label="Navegação Principal">
              <ul className="nav-links">
                <li><a href="#sabores" className="nav-link">Sabores</a></li>
                <li><a href="#processo" className="nav-link">Processo</a></li>
                <li><a href="#historia" className="nav-link">História</a></li>
                <li><a href="#loja" className="nav-link">Nossa loja</a></li>
              </ul>
            </nav>

            <div className="nav-actions">
              <button className="btn-contact-peach" type="button">
                Fale conosco
              </button>
              <button className="btn-search-glass" type="button" aria-label="Buscar sabor ou produto">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </button>
            </div>
          </header>

          {/* Camada de Fundo Base */}
          <div className="hero-stage-backdrop" aria-hidden="true" />

          {/* Sequência de 240 Frames WebP sincronizada com o ScrollTrigger mestre */}
          <HeroScrollFrames triggerRef={containerRef} />

          <div className="hero-grid">
            <div className="hero-editorial-col">
              <FlavorHighlights />

              <div className="hero-bottom-bar">
                <div className="scroll-pill-icon" aria-hidden="true">
                  <div className="scroll-dot" />
                </div>
                <span className="scroll-text-label">ROLE PARA EXPLORAR</span>
              </div>
            </div>

            <div className="hero-visual-col">
              <div className="hero-pagination-vertical" aria-hidden="true">
                <span className="pagination-num-active">01</span>
                <div className="pagination-track-line" />
                <span className="pagination-num-total">04</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Segunda Dobra: Desliza da direita e monta o cardápio como quebra-cabeça sincronizado com o vídeo */}
        <section ref={secondFoldRef} id="segunda-dobra" className="dolcevia-second-fold">
          {/* Mesmo fundo da primeira dobra */}
          <div className="hero-stage-backdrop" aria-hidden="true" />

          {/* Sequência de 72 Frames WebP do 2º vídeo controlada pelo scroll */}
          <SecondFoldScrollFrames triggerRef={containerRef} />

          <div className="second-fold-content">
            <div className="second-fold-grid">
              {/* Coluna Esquerda: Showcase Interativo dos Sabores montando como quebra-cabeça */}
              <div className="second-fold-left-col">
                <FlavorShowcase />
              </div>

              {/* Coluna Direita: Espaço reservado para o protagonismo do vídeo 72 frames */}
              <div className="second-fold-right-col" aria-hidden="true">
                <div className="hero-pagination-vertical">
                  <span className="pagination-num-active">02</span>
                  <div className="pagination-track-line" />
                  <span className="pagination-num-total">04</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Modal Promocional inicial */}
        <PromoBanner />
      </div>
    </SmoothScroll>
  );
}
