import React, { useRef, useEffect, useState, useCallback } from 'react';
import dragonBg from '../assets/dragon-bg.jpg';

const PARTICLE_COUNT = 1800;
const CONVERGE_DURATION_MS = 3200;

interface Point {
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  t: number;
}

/** 在 canvas 上绘制文本 "180"，采样不透明像素得到目标点集 */
function sampleTextTargets(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  count: number
): { x: number; y: number }[] {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = 'white';
  ctx.font = `bold ${Math.min(width * 0.35, height * 0.4)}px "Noto Sans SC", "PingFang SC", sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const textCenterX = width / 2 - width * 0.06;
  ctx.fillText('180', textCenterX, height / 2);
  ctx.restore();

  const id = ctx.getImageData(0, 0, width, height);
  const points: { x: number; y: number }[] = [];
  const step = Math.max(1, Math.floor(Math.sqrt((width * height) / count)));
  for (let y = 0; y < height; y += step) {
    for (let x = 0; x < width; x += step) {
      const i = (y * width + x) * 4;
      if (id.data[i + 3] > 128) {
        points.push({ x, y });
      }
    }
  }
  return points;
}

export interface LightPoints180Props {
  visible?: boolean;
}

export default function LightPoints180({ visible = true }: LightPoints180Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);
  const [imgError, setImgError] = useState(false);
  const particlesRef = useRef<Point[]>([]);
  const targetsRef = useRef<{ x: number; y: number }[]>([]);
  const rafRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  // 初始就绪标记（当前仅依赖静态龙图腾底图）
  useEffect(() => {
    setReady(true);
  }, []);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, t: number) => {
      // 仅绘制光点（底图由下层 <img> 提供）
      ctx.clearRect(0, 0, width, height);

      // 光点
      const particles = particlesRef.current;
      const ease = (x: number) => 1 - Math.pow(1 - x, 2);
      particles.forEach((p) => {
        const k = ease(Math.min(1, p.t));
        const x = p.startX + (p.targetX - p.startX) * k;
        const y = p.startY + (p.targetY - p.startY) * k;
        const size = 1.2 + 0.8 * k;
        const alpha = 0.4 + 0.6 * k;
        ctx.fillStyle = `rgba(255, 220, 120, ${alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      });
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ready || !visible) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    // 初始化目标点（从 "180" 文字采样）
    if (targetsRef.current.length === 0) {
      const targets = sampleTextTargets(ctx, width, height, PARTICLE_COUNT);
      targetsRef.current = targets;
    }

    const targets = targetsRef.current;
    if (targets.length === 0) {
      draw(ctx, width, height, 0);
      return;
    }

    // 初始化粒子：从随机位置到目标；每次进入视口重新开始动画
    if (particlesRef.current.length !== targets.length) {
      const particles: Point[] = targets.map((tg, i) => {
        const angle = (i / targets.length) * Math.PI * 2 + Math.random() * 0.5;
        const r = Math.min(width, height) * (0.2 + Math.random() * 0.35);
        const startX = width / 2 + Math.cos(angle) * r;
        const startY = height / 2 + Math.sin(angle) * r;
        return {
          x: startX,
          y: startY,
          startX,
          startY,
          targetX: tg.x,
          targetY: tg.y,
          t: 0
        };
      });
      particlesRef.current = particles;
    }
    startTimeRef.current = Date.now();

    const startTime = startTimeRef.current;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const t = Math.min(1, elapsed / CONVERGE_DURATION_MS);
      particlesRef.current.forEach((p) => {
        p.t = t;
      });
      draw(ctx, width, height, t);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [ready, visible, draw]);

  // 响应容器尺寸
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    const ro = new ResizeObserver(() => {
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      if (w && h && (canvas.width !== w || canvas.height !== h)) {
        canvas.width = w;
        canvas.height = h;
        targetsRef.current = [];
        particlesRef.current = [];
      }
    });
    ro.observe(parent);
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    if (w && h) {
      canvas.width = w;
      canvas.height = h;
    }
    return () => ro.disconnect();
  }, []);

  return (
    <div className="relative w-full max-w-4xl aspect-[4/3] overflow-hidden">
      {imgError ? (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-b from-amber-950/95 via-red-950/90 to-amber-950/95" aria-hidden />
      ) : (
        <img
          src={dragonBg}
          alt="龙腾底图"
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={() => setImgError(true)}
        />
      )}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
}
