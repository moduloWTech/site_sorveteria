'use client';

import { useState } from 'react';
import Image from 'next/image';

interface FlavorDetail {
  id: string;
  name: string;
  origin: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
}

const MENU_FLAVORS: FlavorDetail[] = [
  {
    id: 'pistache',
    name: 'Pistache Siciliano',
    origin: 'Bronte, Sicília • D.O.P.',
    category: 'Especialidade',
    description: 'Pistaches tostados lentamente e moídos em pedra vulcânica, revelando textura aveludada e notas amanteigadas.',
    tags: ['Sem Glúten', 'Pistache 100% Puro', 'Receita Clássica'],
    image: '/images/hero/flavor-pistache.webp',
  },
  {
    id: 'chocolate',
    name: 'Chocolate Belga 70%',
    origin: 'Cacau Callebaut • Origem Sustentável',
    category: 'Intenso',
    description: 'Massa densa de cacau puro com raspas crocantes e finalização em calda morna artesanal.',
    tags: ['Cacau Nobre', 'Baixo Açúcar', 'Intensidade 5/5'],
    image: '/images/hero/flavor-chocolate.webp',
  },
  {
    id: 'frutas-vermelhas',
    name: 'Frutas Vermelhas & Amarena',
    origin: 'Frutas Frescas da Estação',
    category: 'Frutado',
    description: 'Combinação refrescante de amoras silvestres, morangos e framboesas com toque cítrico aromático.',
    tags: ['100% Vegano', 'Sem Lactose', 'Zero Conservantes'],
    image: '/images/hero/flavor-frutas-vermelhas.webp',
  },
  {
    id: 'maracuja',
    name: 'Maracujá com Ninho Tostado',
    origin: 'Cerrado Brasileiro',
    category: 'Autoral',
    description: 'Contraste sublime entre a acidez tropical da polpa fresca e a maciez aconchegante do leite ninho tostado.',
    tags: ['Sabor Autoral', 'Equilíbrio Doce-Ácido'],
    image: '/images/hero/flavor-maracuja.webp',
  },
];

export function FlavorShowcase() {
  const [activeFlavorId, setActiveFlavorId] = useState<string>(MENU_FLAVORS[0].id);

  const activeFlavor = MENU_FLAVORS.find((f) => f.id === activeFlavorId) || MENU_FLAVORS[0];

  return (
    <div className="flavor-showcase-wrapper">
      {/* Peça 1 do Quebra-Cabeça: Header Editorial (surge primeiro, descendo suavemente) */}
      <div className="flavor-showcase-header puzzle-piece puzzle-header">
        <span className="flavor-kicker">NOSSO CARDÁPIO ARTESANAL</span>
        <h2 className="flavor-title">Sabores Que Marcam</h2>
        <p className="flavor-subtitle">
          Criados diariamente em pequenos lotes com ingredientes de denominação de origem protegida e leite orgânico selecionado.
        </p>
      </div>

      {/* Peça 2 do Quebra-Cabeça: Lista Seletora (cada item entra em cascata com ângulo de rotação) */}
      <div className="flavor-selector-list" role="tablist" aria-label="Sabores em destaque">
        {MENU_FLAVORS.map((flavor, index) => {
          const isSelected = flavor.id === activeFlavorId;
          return (
            <button
              key={flavor.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              className={`flavor-selector-item puzzle-piece puzzle-item puzzle-item-${index} ${isSelected ? 'is-active' : ''}`}
              onClick={() => setActiveFlavorId(flavor.id)}
              onMouseEnter={() => setActiveFlavorId(flavor.id)}
            >
              <div className="flavor-selector-left">
                <span className="flavor-item-index">0{index + 1}</span>
                <div className="flavor-item-info">
                  <span className="flavor-item-name">{flavor.name}</span>
                  <span className="flavor-item-origin">{flavor.origin}</span>
                </div>
              </div>
              <span className="flavor-item-arrow" aria-hidden="true">→</span>
            </button>
          );
        })}
      </div>

      {/* Peça 3 do Quebra-Cabeça: Card de Detalhes Glassmorphism (encaixa vindo com rotação 3D sutil) */}
      <div className="flavor-detail-card puzzle-piece puzzle-card" aria-live="polite">
        <div className="flavor-detail-inner">
          <div className="flavor-detail-thumb">
            <Image
              src={activeFlavor.image}
              alt={activeFlavor.name}
              width={76}
              height={76}
              className="flavor-detail-img"
            />
          </div>

          <div className="flavor-detail-text">
            <span className="flavor-detail-category">{activeFlavor.category}</span>
            <p className="flavor-detail-desc">{activeFlavor.description}</p>
            <div className="flavor-detail-tags">
              {activeFlavor.tags.map((tag) => (
                <span key={tag} className="flavor-tag-pill">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Peça 4 do Quebra-Cabeça: CTA Final (trava a montagem exatamente no último frame) */}
      <div className="flavor-showcase-cta puzzle-piece puzzle-cta">
        <button type="button" className="btn-primary-peach">
          <span>Montar Meu Pote</span>
          <span className="cta-arrow" aria-hidden="true">→</span>
        </button>
        <span className="flavor-cta-note">Disponível em copinhos, casquinhas e embalagens térmicas de 500g e 1kg</span>
      </div>
    </div>
  );
}
