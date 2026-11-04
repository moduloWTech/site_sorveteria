'use client';

import { useRef } from 'react';
import { SmoothScroll } from '@/components/poc/SmoothScroll';
import { HeroScrollFrames } from '@/components/HeroScrollFrames';
import { FlavorHighlights } from '@/components/FlavorHighlights';
import { PromoBanner } from '@/components/PromoBanner';

export default function DolceviaHome() {
  const heroSectionRef = useRef<HTMLElement>(null);

  return (
    <SmoothScroll>
      <div className="dolcevia-wrapper">
        {/* 1. Hero Protagonista na Primeira Dobra (Pinned Scroll + Sequência WebP 240 Frames) */}
        <section ref={heroSectionRef} id="hero" className="dolcevia-hero-section">
          {/* Header / Navbar Superior integrado na primeira dobra */}
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

          {/* Sequência de 240 Frames WebP controlada pelo Scroll */}
          <HeroScrollFrames triggerRef={heroSectionRef} />

          <div className="hero-grid">
            {/* Coluna Editorial (Esquerda - Destaques e Indicador de Scroll) */}
            <div className="hero-editorial-col">
              {/* Destaques de Sabores (Grid no Desktop / Carrossel Infinito Arrastável no Mobile) */}
              <FlavorHighlights />

              {/* Barra Inferior / Indicador de Scroll */}
              <div className="hero-bottom-bar">
                <div className="scroll-pill-icon" aria-hidden="true">
                  <div className="scroll-dot" />
                </div>
                <span className="scroll-text-label">ROLE PARA EXPLORAR</span>
              </div>
            </div>

            {/* Coluna Visual Hero (Direita - 56% no desktop) */}
            <div className="hero-visual-col">
              {/* Paginação Lateral Direita */}
              <div className="hero-pagination-vertical" aria-hidden="true">
                <span className="pagination-num-active">01</span>
                <div className="pagination-track-line" />
                <span className="pagination-num-total">04</span>
              </div>
            </div>
          </div>
        </section>

        {/* Modal Promocional que abre no carregamento */}
        <PromoBanner />
      </div>
    </SmoothScroll>
  );
}
