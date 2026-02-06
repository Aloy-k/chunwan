import React, { useState, useEffect, useRef } from 'react';

const START_YEAR = 1996;
const END_YEAR = 2019;
const FLIP_DURATION_MS = 160;
const GAP_BETWEEN_FLIPS_MS = 70;
const MORPH_DURATION_MS = 1800;

/** 案例二 Step2：快速翻动日历 1996→2019 + 画面从 4:3 低清电视逐渐变为 9:16 竖屏，最终呈现苹果经典手机框。支持 4:3 底图与 9:16 手机底图。 */
export interface TimeMachineCalendarProps {
  visible?: boolean;
  /** 4:3 电视框底图，日历在其上翻转 */
  tvBackgroundUrl?: string;
  /** 9:16 手机框底图，最终阶段展示 */
  phoneBackgroundUrl?: string;
}

export default function TimeMachineCalendar({
  visible = true,
  tvBackgroundUrl,
  phoneBackgroundUrl
}: TimeMachineCalendarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [started, setStarted] = useState(false);
  const [year, setYear] = useState(START_YEAR);
  const [rotateY, setRotateY] = useState(0);
  const [phase, setPhase] = useState<'flipping' | 'morphing' | 'done'>('flipping');
  const [isFlipping, setIsFlipping] = useState(false);
  const timerRef = useRef<number>(0);

  // 用 IntersectionObserver 检测本组件是否进入用户视觉区域，只有进入后才算 inView
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0.35, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // 仅当：父级 step 可见 且 本组件进入视口 时，才启动动画（且只启动一次）
  useEffect(() => {
    if (visible && inView && !started) {
      setStarted(true);
      setYear(START_YEAR);
      setRotateY(0);
      setPhase('flipping');
      setIsFlipping(false);
    }
  }, [visible, inView, started]);

  // 快速翻页：1996 → 2019
  useEffect(() => {
    if (!started || phase !== 'flipping') return;

    const flipNext = () => {
      if (year >= END_YEAR) {
        setPhase('morphing');
        return;
      }
      if (isFlipping) return;
      setIsFlipping(true);
      setRotateY(-180);
    };

    const delay = year === START_YEAR ? 600 : GAP_BETWEEN_FLIPS_MS;
    timerRef.current = window.setTimeout(flipNext, delay);
    return () => clearTimeout(timerRef.current);
  }, [started, phase, year, isFlipping]);

  // 翻到背面时更新年份并翻回正面
  useEffect(() => {
    if (rotateY !== -180) return;
    const t = window.setTimeout(() => {
      setYear((y) => (y < END_YEAR ? y + 1 : y));
      setRotateY(0);
      setIsFlipping(false);
    }, FLIP_DURATION_MS);
    return () => clearTimeout(t);
  }, [rotateY]);

  // 形态过渡结束后进入 done
  useEffect(() => {
    if (phase !== 'morphing') return;
    const t = window.setTimeout(() => setPhase('done'), MORPH_DURATION_MS + 200);
    return () => clearTimeout(t);
  }, [phase]);

  const is4by3 = phase === 'flipping';
  const isMorphing = phase === 'morphing';
  const isDone = phase === 'done';

  // 用 padding-bottom 做可过渡的宽高比：4:3 = 75%，9:16 竖屏 = 16/9 ≈ 177.78%
  const paddingBottomPercent = is4by3 ? 75 : (16 / 9) * 100;

  return (
    <div ref={containerRef} className="w-full max-w-[280px] md:max-w-[320px] mx-auto">
      {/* 外框：4:3 电视 → 9:16 竖屏；最终阶段套上苹果经典手机框（圆角 + 深色边框 + 底部 Home 条） */}
      <div
        className={`relative w-full overflow-visible transition-all duration-500 ${
          isDone
            ? 'rounded-[2.75rem] p-2.5 pt-2.5 pb-10 bg-[#1c1c1e] shadow-[0_0_0_2px_rgba(255,255,255,0.06),0_0_0_1px_rgba(0,0,0,0.3),0_25px_60px_-12px_rgba(0,0,0,0.5)]'
            : 'rounded-2xl overflow-hidden'
        }`}
        style={{
          borderWidth: isDone ? 0 : '2px',
          borderColor: is4by3 ? 'rgba(180, 83, 9, 0.6)' : 'rgba(255,255,255,0.2)',
          boxShadow: is4by3 && !isDone
            ? '0 25px 50px -12px rgba(0,0,0,0.5)'
            : isDone
              ? undefined
              : '0 25px 50px -12px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)',
          background: isDone ? undefined : is4by3 ? '#0a0a0a' : 'linear-gradient(to bottom right, #1e293b, #0f172a)'
        }}
      >
        <div
          className={`relative w-full transition-[padding-bottom] ease-out ${isDone ? 'rounded-[2rem] overflow-hidden bg-black' : 'bg-black'}`}
          style={{
            paddingBottom: `${paddingBottomPercent}%`,
            transitionDuration: `${MORPH_DURATION_MS}ms`
          }}
        >
          {/* 底图：4:3 阶段用电视底图，9:16 阶段用手机底图 */}
          {tvBackgroundUrl && (is4by3 || isMorphing) && (
            <div
              className="absolute inset-0 rounded-2xl overflow-hidden transition-opacity duration-700"
              style={{ opacity: is4by3 ? 1 : isMorphing ? 0.35 : 0 }}
              aria-hidden
            >
              <img
                src={tvBackgroundUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" aria-hidden />
            </div>
          )}
          {phoneBackgroundUrl && isDone && (
            <div className="absolute inset-0 rounded-[2rem] overflow-hidden" aria-hidden>
              <img
                src={phoneBackgroundUrl}
                alt=""
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30"
                aria-hidden
              />
            </div>
          )}

          {/* 内容区：绝对定位填满上面的 padding 区域（日历 + 文案叠在底图上） */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
            {/* 日历翻页：3D 翻转年份 */}
            <div
              className="relative w-32 h-40 transition-opacity duration-500"
              style={{
                opacity: isMorphing ? 0 : 1,
                perspective: '520px',
                transformStyle: 'preserve-3d'
              }}
            >
              <div
                className="absolute inset-0"
                style={{
                  transform: `rotateY(${rotateY}deg)`,
                  transition: `transform ${FLIP_DURATION_MS}ms ease-in`,
                  transformStyle: 'preserve-3d'
                }}
              >
                <div
                  className="absolute inset-0 rounded-xl bg-amber-950 border-2 border-amber-600/70 shadow-2xl flex items-center justify-center"
                  style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
                >
                  <span className="text-6xl font-black text-amber-200 font-mono tabular-nums drop-shadow-lg">
                    {year}
                  </span>
                </div>
                <div
                  className="absolute inset-0 rounded-xl bg-amber-950 border-2 border-amber-600/70 shadow-2xl flex items-center justify-center"
                  style={{
                    transform: 'rotateY(180deg)',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden'
                  }}
                >
                  <span className="text-6xl font-black text-amber-200 font-mono tabular-nums drop-shadow-lg">
                    {year < END_YEAR ? year + 1 : year}
                  </span>
                </div>
              </div>
            </div>

            <p className="mt-4 text-center text-sm text-white/60">
              {is4by3 && '赵丽蓉 · 打工奇遇'}
              {isMorphing && '……'}
              {isDone && '暗号激活 · 全民反谍'}
            </p>
          </div>

          {/* 低清电视滤镜：仅 4:3 阶段明显，morphing 时渐隐 */}
          <div
            className="absolute inset-0 pointer-events-none rounded-2xl transition-opacity duration-700"
            style={{
              opacity: is4by3 ? 1 : isMorphing ? 0.2 : 0
            }}
            aria-hidden
          >
            <div className="absolute inset-0 crt-scanlines" />
            <div className="absolute inset-0 crt-screen" />
            {is4by3 && <div className="absolute inset-0 crt-flicker" />}
            <div
              className="absolute inset-0 transition-opacity duration-700"
              style={{
                background: 'linear-gradient(180deg, rgba(0,0,0,0.08) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.06) 100%)'
              }}
            />
          </div>

        </div>

        {/* 苹果经典手机框：仅 done 时显示 - 底部「下巴」上的 Home 指示条 */}
        {isDone && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center pt-2 pointer-events-none">
            <div
              className="w-24 h-1 rounded-full bg-white/35"
              style={{ boxShadow: '0 0 6px rgba(255,255,255,0.2)' }}
              aria-hidden
            />
          </div>
        )}
      </div>

      {/* 下方小字提示 */}
      {started && is4by3 && (
        <p className="mt-2 text-center text-[10px] text-amber-600/80 font-mono">
          日历飞速翻动中 · 1996 → 2019
        </p>
      )}
      {isMorphing && (
        <p className="mt-2 text-center text-[10px] text-white/50 font-mono animate-pulse">
          画面由电视屏变为手机屏 …
        </p>
      )}
      {isDone && (
        <p className="mt-2 text-center text-[10px] text-white/40 font-mono">
          暗号激活 · 全民反谍
        </p>
      )}
    </div>
  );
}
