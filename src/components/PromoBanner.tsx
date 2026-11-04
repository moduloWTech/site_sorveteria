'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export function PromoBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    // Exibe o banner promocional logo que o site carrega
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 450);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 320);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`promo-modal-overlay ${isClosing ? 'is-closing' : ''}`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Promoção Especial Dolcevia"
    >
      <div
        className={`dolcevia-promo-banner promo-modal-card ${isClosing ? 'is-closing' : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botão de Fechar (X) */}
        <button
          type="button"
          className="promo-close-btn"
          onClick={handleClose}
          aria-label="Fechar promoção"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Brilho radial central de fundo */}
        <div className="promo-banner-backdrop" aria-hidden="true" />

        <div className="promo-banner-inner">
          {/* 1. Coluna Esquerda: Chamada da Oferta inclinada + Botão */}
          <div className="promo-left-col">
            <div className="promo-headline-tilt">
              <span className="promo-script-kicker">Oferta Especial</span>
              <h2 className="promo-main-heading">
                <span className="promo-line-white">COMPRE 2 BOLAS</span>
                <span className="promo-line-mixed">
                  GANHE 1 <em className="promo-highlight-pink">GRÁTIS</em>
                </span>
              </h2>
            </div>

            <div className="promo-cta-wrapper">
              <button type="button" className="promo-order-btn" onClick={handleClose}>
                <span>Peça Agora</span>
                <span className="promo-order-arrow" aria-hidden="true">→</span>
              </button>
            </div>
          </div>

          {/* 2. Coluna Central: Gelato Protagonista com Cereja, Calda, Wafer e Adereços */}
          <div className="promo-center-col" aria-hidden="true">
            <div className="promo-gelato-glow" />

            {/* Adereços flutuantes ao redor da taça/sorvete */}
            <Image
              src="/images/hero/strawberry-flying.webp"
              alt=""
              width={48}
              height={48}
              className="promo-floating-prop prop-strawberry"
            />
            <Image
              src="/images/hero/chocolate-shard-flying.webp"
              alt=""
              width={44}
              height={44}
              className="promo-floating-prop prop-chocolate"
            />
            <Image
              src="/images/hero/hazelnut-flying.webp"
              alt=""
              width={36}
              height={36}
              className="promo-floating-prop prop-hazelnut"
            />
            <Image
              src="/images/hero/caramel-drop-flying.webp"
              alt=""
              width={34}
              height={34}
              className="promo-floating-prop prop-caramel"
            />

            {/* Taça / Cúpula de Gelato com Cereja e Wafer */}
            <div className="promo-gelato-crop">
              <Image
                src="/images/hero/gelato-hero.webp"
                alt="Gelato Especial com Cereja, Calda de Chocolate e Wafer"
                width={420}
                height={620}
                className="promo-gelato-img"
                priority
              />
            </div>
          </div>

          {/* 3. Coluna Direita: Frase Manuscrita + Coração + Splash "Doces Ofertas Sempre!" */}
          <div className="promo-right-col">
            <div className="promo-handwritten-block">
              <p className="promo-handwritten-text">
                Felicidade<br />
                tem gosto<br />
                de Gelato
              </p>
              <svg
                className="promo-handwritten-heart"
                width="34"
                height="34"
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M24 40C24 40 9 29.2 9 17.5C9 12.2 13.1 8.5 17.8 8.5C20.9 8.5 23.1 10.3 24 12.6C24.9 10.3 27.1 8.5 30.2 8.5C34.9 8.5 39 12.2 39 17.5C39 29.2 24 40 24 40Z"
                  stroke="#F5EDE6"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            {/* Gotas + Splash Rosa com "DOCES OFERTAS SEMPRE!" */}
            <div className="promo-splash-wrapper">
              <svg
                className="promo-drips-svg"
                viewBox="0 0 220 240"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  d="M28 0H42C40 18 37 35 41 52C44 65 48 76 43 88C39 97 29 97 25 88C20 76 24 65 27 52C31 35 29 18 28 0Z"
                  fill="url(#pinkDripGrad)"
                />
                <path
                  d="M46 240H30C32 225 26 210 22 196C18 183 25 170 36 172C47 174 51 188 47 201C43 213 44 227 46 240Z"
                  fill="url(#pinkDripGrad)"
                />
                <circle cx="56" cy="112" r="3.5" fill="#F678A0" />
                <circle cx="18" cy="150" r="2.5" fill="#F678A0" />
                <circle cx="206" cy="64" r="5" fill="#F678A0" />

                <path
                  d="M112 28C124 22 135 33 147 30C159 27 171 19 180 27C189 35 182 50 188 61C194 72 209 76 210 89C211 102 197 111 196 124C195 137 207 150 201 162C195 174 179 171 171 181C163 191 169 211 157 216C146 221 137 204 125 203C113 202 102 214 91 208C80 202 84 186 76 176C68 166 53 166 49 154C45 142 58 130 58 117C58 104 46 92 51 80C56 68 71 70 80 61C89 52 86 35 97 29C102 26 107 30 112 28Z"
                  fill="url(#pinkSplashGrad)"
                />

                <defs>
                  <linearGradient id="pinkSplashGrad" x1="50" y1="25" x2="205" y2="215" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FF8FB3" />
                    <stop offset="55%" stopColor="#F46E97" />
                    <stop offset="100%" stopColor="#E04F7B" />
                  </linearGradient>
                  <linearGradient id="pinkDripGrad" x1="20" y1="0" x2="48" y2="240" gradientUnits="userSpaceOnUse">
                    <stop offset="0%" stopColor="#FF97B9" />
                    <stop offset="100%" stopColor="#EA5A86" />
                  </linearGradient>
                </defs>
              </svg>

              <div className="promo-splash-text">
                <span>DOCES</span>
                <span>OFERTAS</span>
                <span>SEMPRE!</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
