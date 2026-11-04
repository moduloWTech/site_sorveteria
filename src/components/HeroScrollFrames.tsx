'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TOTAL_FRAMES = 240;

function getFramePath(index: number): string {
  const padded = String(index).padStart(3, '0');
  return `/frames/frame_${padded}.webp`;
}

interface HeroScrollFramesProps {
  triggerRef: React.RefObject<HTMLElement>;
}

export function HeroScrollFrames({ triggerRef }: HeroScrollFramesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<(ImageBitmap | HTMLImageElement | null)[]>(
    new Array(TOTAL_FRAMES).fill(null)
  );
  const currentFrameRef = useRef<number>(0);
  const leftFadeGradRef = useRef<CanvasGradient | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Renderiza o frame diretamente no canvas (chamado já dentro do RAF do GSAP Ticker)
  const renderFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    const clampedIndex = Math.max(0, Math.min(TOTAL_FRAMES - 1, frameIndex));
    let source = framesRef.current[clampedIndex];

    // Fallback para o frame decodificado mais próximo caso ainda esteja carregando
    if (!source) {
      for (let offset = 1; offset < TOTAL_FRAMES; offset++) {
        const prev = clampedIndex - offset;
        const next = clampedIndex + offset;
        if (prev >= 0 && framesRef.current[prev]) {
          source = framesRef.current[prev];
          break;
        }
        if (next < TOTAL_FRAMES && framesRef.current[next]) {
          source = framesRef.current[next];
          break;
        }
      }
    }

    if (!source) return;

    const cw = canvas.width;
    const ch = canvas.height;
    const iw = source instanceof HTMLImageElement ? source.naturalWidth : source.width;
    const ih = source instanceof HTMLImageElement ? source.naturalHeight : source.height;
    if (!iw || !ih) return;

    ctx.globalCompositeOperation = 'source-over';
    ctx.clearRect(0, 0, cw, ch);

    // Ajustamos a escala (cover limpo pelo topo/centro) para manter proporção elegante
    const scale = (ch / ih) * 1.06;
    const drawWidth = iw * scale;
    const drawHeight = ih * scale;
    const offsetX = (cw - drawWidth) * 0.55;
    const offsetY = -Math.round(drawHeight - ch); // Encosta a base real do vídeo no fundo da tela

    ctx.drawImage(source, offsetX, offsetY, drawWidth, drawHeight);

    // Suaviza apenas a borda esquerda para fundir com a coluna de texto, preservando 100% do brilho do sorvete
    if (leftFadeGradRef.current) {
      ctx.globalCompositeOperation = 'destination-in';
      ctx.fillStyle = leftFadeGradRef.current;
      ctx.fillRect(0, 0, cw, ch);
      ctx.globalCompositeOperation = 'source-over';
    }
  };

  // Preload com decodificação antecipada em ImageBitmap para zero travamento durante o scroll
  useEffect(() => {
    let isCancelled = false;

    const buildHorizontalFade = (ctx: CanvasRenderingContext2D, cw: number) => {
      const grad = ctx.createLinearGradient(0, 0, cw, 0);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
      grad.addColorStop(0.12, 'rgba(0, 0, 0, 0.25)');
      grad.addColorStop(0.26, 'rgba(0, 0, 0, 0.85)');
      grad.addColorStop(0.36, 'rgba(0, 0, 0, 1)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 1)');
      leftFadeGradRef.current = grad;
    };

    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;

      const width = Math.round(parent.clientWidth || window.innerWidth);
      const height = Math.round(parent.clientHeight || window.innerHeight);

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
      if (ctx) {
        buildHorizontalFade(ctx, width);
      }

      renderFrame(currentFrameRef.current);
    };

    updateCanvasSize();

    const loadAndDecodeFrame = async (frameIdx: number): Promise<void> => {
      try {
        const url = getFramePath(frameIdx + 1);
        if (typeof window.createImageBitmap === 'function') {
          const res = await fetch(url, { priority: frameIdx === 0 ? 'high' : 'low' } as RequestInit);
          const blob = await res.blob();
          const bitmap = await createImageBitmap(blob);
          if (isCancelled) {
            bitmap.close();
            return;
          }
          framesRef.current[frameIdx] = bitmap;
        } else {
          const img = new window.Image();
          img.decoding = 'async';
          img.src = url;
          await img.decode();
          if (isCancelled) return;
          framesRef.current[frameIdx] = img;
        }

        if (frameIdx === 0) {
          setIsLoaded(true);
          updateCanvasSize();
        } else if (currentFrameRef.current === frameIdx) {
          renderFrame(frameIdx);
        }
      } catch {
        // Ignora falha individual de frame mantendo fallback para o frame vizinho
      }
    };

    // 1. Carrega e decodifica o frame 0 imediatamente
    loadAndDecodeFrame(0);

    // 2. Fila em duas etapas: keyframes a cada 4 frames primeiro, depois intermediários
    const loadQueue: number[] = [];
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      if (i % 4 === 0) loadQueue.push(i);
    }
    for (let i = 1; i < TOTAL_FRAMES; i++) {
      if (i % 4 !== 0) loadQueue.push(i);
    }

    let pointer = 0;
    const CONCURRENCY = 6;

    const worker = async () => {
      while (!isCancelled && pointer < loadQueue.length) {
        const idx = loadQueue[pointer++];
        await loadAndDecodeFrame(idx);
      }
    };

    for (let c = 0; c < CONCURRENCY; c++) {
      worker();
    }

    const resizeObserver = new ResizeObserver(() => {
      updateCanvasSize();
    });

    if (canvasRef.current?.parentElement) {
      resizeObserver.observe(canvasRef.current.parentElement);
    }

    window.addEventListener('resize', updateCanvasSize);

    return () => {
      isCancelled = true;
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateCanvasSize);
      framesRef.current.forEach((f) => {
        if (f && typeof (f as ImageBitmap).close === 'function') {
          (f as ImageBitmap).close();
        }
      });
    };
  }, []);

  // Sincronização com o scroll:
  // Os frames avançam suavemente até o final ao longo de 70% do scroll total.
  // A transição da segunda dobra começa antes (em 52%), cobrindo a fase final enquanto os frames concluem
  useGSAP(
    () => {
      const triggerEl = triggerRef.current;
      if (!triggerEl) return;

      ScrollTrigger.create({
        trigger: triggerEl,
        start: 'top top',
        end: '+=320%',
        scrub: true,
        fastScrollEnd: true,
        onUpdate: (self) => {
          // Distribui a reprodução do vídeo até 70% do scroll
          const videoProgress = Math.min(1, self.progress / 0.7);
          const nextFrame = Math.min(
            TOTAL_FRAMES - 1,
            Math.max(0, Math.round(videoProgress * (TOTAL_FRAMES - 1)))
          );
          if (nextFrame !== currentFrameRef.current) {
            currentFrameRef.current = nextFrame;
            renderFrame(nextFrame);
          }
        },
      });
    },
    { dependencies: [triggerRef] }
  );

  return (
    <div className="hero-frames-stage" aria-hidden="true">
      <canvas
        ref={canvasRef}
        className={`hero-frames-canvas ${isLoaded ? 'is-loaded' : ''}`}
      />
    </div>
  );
}
