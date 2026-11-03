import Image from 'next/image';

interface FlavorItem {
  id: string;
  name: string;
  image: string;
}

const FLAVORS: FlavorItem[] = [
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

export default function DolceviaHome() {
  return (
    <div className="dolcevia-wrapper">
      {/* 1. Header / Navbar Superior */}
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

      {/* 2. Hero Protagonista (Estrutura Visual Limpa sem sorvete e adereços) */}
      <section id="hero" className="dolcevia-hero-section">
        {/* Camada de Fundo: Fitas Esculturais Azuis e Base Travertino */}
        <div className="hero-stage-backdrop" aria-hidden="true" />

        <div className="hero-grid">
          {/* Coluna Editorial (Esquerda - 42% no desktop) */}
          <div className="hero-editorial-col">
            <div className="editorial-header-block">
              <span className="hero-kicker">MAIS QUE SORVETE,</span>
              <h1 className="hero-title-serif">
                Uma experiência<br />
                sensorial
              </h1>
              <p className="hero-subtitle-text">
                Gelatos artesanais feitos com ingredientes selecionados e combinações surpreendentes para momentos inesquecíveis.
              </p>

              {/* Ações / CTAs */}
              <div className="hero-cta-group">
                <button className="btn-primary-peach" type="button">
                  <span>Descubra nossos sabores</span>
                  <span className="cta-arrow" aria-hidden="true">→</span>
                </button>

                <button className="btn-video-glass" type="button">
                  <span className="play-circle-icon" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </span>
                  <span>ASSISTA AO VÍDEO</span>
                </button>
              </div>
            </div>

            {/* Destaques de Sabores (4 Cards Glassmorphism) */}
            <div className="hero-highlights-block">
              <span className="highlights-label">NOSSOS DESTAQUES</span>
              <div className="highlights-grid">
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

            {/* Barra Inferior / Indicador de Scroll */}
            <div className="hero-bottom-bar">
              <div className="scroll-pill-icon" aria-hidden="true">
                <div className="scroll-dot" />
              </div>
              <span className="scroll-text-label">ROLE PARA EXPLORAR</span>
            </div>
          </div>

          {/* Coluna Visual Hero (Direita - 58% no desktop) */}
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

      {/* 3. Rodapé Comercial Dolcevia */}
      <footer className="dolcevia-footer">
        <div>© 2026 Dolcevia Gelato Artesanal — Todos os direitos reservados.</div>
        <div>Vitrine Comercial desenvolvida por <strong>MW Technology</strong></div>
      </footer>
    </div>
  );
}
