# Briefing técnico para agente de IA — experiência web premium

## Objetivo
Construir uma experiência web ORIGINAL em Next.js + TypeScript, inspirada nos **princípios técnicos** observados no site de referência Tòpas (bar-topas.ch). NÃO copiar layout, textos, logotipo, paleta, ilustrações, modelos 3D, conteúdo ou código proprietário. Antes de implementar, definir identidade, narrativa, conteúdo, público e efeitos necessários ao novo projeto.

## Fonte da análise
Arquivos fornecidos pelo usuário: `app_ja.txt`, `scroll_js.txt`, `intro_js.txt`, `preload_js.txt`, `sections_js.txt`, `stage_js.txt`, `scenes_js.txt`, `food_js.txt`, `textures_js.txt`, `noice_js.txt`, `cursor_js.txt`, `status_js.txt`, `vmap_js.txt`, `credit_js.txt`, `main_css.txt`. Observação: `scenes_js.txt` importa `emg-topas/gl/dishes`, mas `dishes.js` não consta entre os 15 arquivos. Não afirmar que a implementação 3D foi integralmente reconstruída.

## Arquitetura observada (referência, não implementação obrigatória)
- `app.js` atua como orquestrador: inicializa status/créditos, verifica preferência por movimento reduzido, registra plugins GSAP, prepara Lenis e cursor, espera o loader ser pintado, inicia carregamento 3D e imagens em paralelo, revela o hero e libera a rolagem.
- `scroll.js`: Lenis integrado a ScrollTrigger: `lenis.on('scroll', ScrollTrigger.update)` e `gsap.ticker.add(time => lenis.raf(time * 1000))`.
- `sections.js`: animações DOM e `ScrollTrigger` atualizam um estado compartilhado: `state.hero.p`, `state.build.p`, `state.drinks.p`, `state.rain.active`; há também interação de ponteiro.
- `stage.js`: cria um único `THREE.WebGLRenderer`, monta cenas separadas, usa `ResizeObserver` e `IntersectionObserver`, pré-compila shaders e faz pré-renderização. Desenha cada cena visível em um canvas WebGL compartilhado e copia a saída para canvases 2D por seção (`drawImage`). Há ajuste descendente de resolução se o desempenho ficar ruim.
- `scenes.js`: exporta quatro fábricas (`hero`, `build`, `drinks`, `rain`), cada qual retorna `scene`, `camera`, `update(dt,t,w,h)` e, quando aplicável, `pointer`. A função `update` lê o estado compartilhado. A montagem de alimentos usa intervalos de progresso (`range(P, início, fim)`), permitindo scrub bidirecional.
- `food.js` e `textures.js`: geometrias e materiais procedurais; texturas criadas com Canvas 2D e ruído; `scenes.js` também depende de `dishes.js`, não fornecido.
- `intro.js` e `preload.js`: loader de múltiplas etapas, carregamento de fontes/imagens/3D, animação de abertura e transição para hero. O carregamento tem limite de espera e a 3D pode aparecer depois, com fade.
- `main.css`: tokens, tipografia, layout responsivo, animações e fallbacks visuais.

## Fluxo lógico
1. HTML e CSS exibem imediatamente o loader.
2. Client bootstrap detecta recursos e `prefers-reduced-motion`.
3. Inicializa GSAP/ScrollTrigger/Lenis apenas no cliente.
4. Dispara pré-carregamento de ativos e inicialização 3D em paralelo.
5. Compila e aquece recursos gráficos antes da transição, com timeout/fallback.
6. Registra triggers de seção; conclui intro; libera scroll.
7. Lenis alimenta ScrollTrigger; triggers escrevem `progress` normalizado (0..1) no estado.
8. Render loop lê o estado, atualiza câmeras/objetos e desenha apenas cenas visíveis.
9. Resize, navegação e unmount limpam observers, listeners, timelines e recursos GPU.

## Recomendação de implementação em Next.js
- Usar App Router + TypeScript; seções e conteúdo sem dependência de browser podem ser Server Components; animações e WebGL devem ser Client Components, carregados dinamicamente quando necessário.
- Usar GSAP + ScrollTrigger e Lenis. Usar Three.js diretamente ou React Three Fiber **apenas se** fizer sentido para a arquitetura escolhida; não misturar dois render loops sem necessidade.
- Criar `ExperienceProvider` ou módulo controlador com `progress`/estado mutável compartilhado para atualizações por frame; evitar `setState` React a cada frame.
- Criar `ScrollController`, `IntroController`, `SceneManager`, `SectionTriggers`, `AssetLoader`, `QualityManager` e componentes de seção independentes. Nomes são sugestão de arquitetura, não nomes originais.
- Começar com UMA cena e UMA seção scroll-driven; só depois expandir para múltiplas cenas.
- Avaliar custo de copiar WebGL para canvas 2D por frame; essa é a estratégia observada, mas não necessariamente a melhor para todo projeto. Comparar com canvas WebGL fixo e múltiplos viewports/scissor, conforme layout.
- Fallback estático em ausência de WebGL, falha de import e `prefers-reduced-motion`; garantir conteúdo e navegação acessíveis.
- Respeitar touch/mobile; limitar DPR, renderizar somente o visível, não criar objetos pesados durante scroll, cancelar e liberar recursos no unmount.

## Entregáveis solicitados à agente — antes de codar
1. `ARCHITECTURE.md`: diagrama do fluxo de inicialização e responsabilidades por módulo.
2. `ANIMATION_SPEC.md`: tabela por seção com gatilho, progresso 0..1, propriedades animadas, comportamento mobile e reduced-motion.
3. `PERFORMANCE.md`: orçamento de pixels, estratégia de visibilidade, carregamento, métricas e fallback.
4. `IMPLEMENTATION_PLAN.md`: plano incremental com critérios de aceite e riscos.
5. Perguntas objetivas sobre marca, conteúdo e narrativa visual que ainda não foram definidos.

## Fases de execução e critérios de aceite
**Fase 1 — prova de conceito:** Next.js com hero, uma seção pinada, Lenis/ScrollTrigger, objeto 3D genérico original e scrub reversível. Sem erros no console, sem hydration mismatch, funcionando desktop/mobile.

**Fase 2 — experiência:** intro curta e opcional, transições DOM, seções independentes, conteúdo real e identidade visual própria.

**Fase 3 — robustez:** lazy loading, fallback sem WebGL, reduced motion, cleanup, testes de resize/navegação, análise de performance em aparelho intermediário.

## Instrução pronta para a agente
"Você é a engenheira responsável por arquitetar e implementar uma experiência digital premium ORIGINAL em Next.js/TypeScript. Os 15 arquivos anexados são material de estudo técnico, não código a copiar. Primeiro produza ARCHITECTURE.md, ANIMATION_SPEC.md, PERFORMANCE.md e IMPLEMENTATION_PLAN.md com base nos arquivos e destaque o que não está demonstrado (incluindo a ausência de dishes.js). Explique o pipeline bootstrap → loader → Lenis/ScrollTrigger → estado compartilhado → Three.js → renderização → cleanup. Proponha uma arquitetura adequada ao nosso projeto, que pode diferir da referência. Não comece a implementação antes de apresentar o plano e obter aprovação. Priorize qualidade visual, desempenho, acessibilidade, mobile e manutenção."
