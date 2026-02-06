import React, { useRef, useEffect, useState } from 'react';
import { MemeTrend } from '../types';
import { ChevronDown } from 'lucide-react';
import MemeWaterfall from './MemeWaterfall';
import MemeRevealOnScroll from './MemeRevealOnScroll';
import MemeChatBubbles from './MemeChatBubbles';
import MemeDanmakuImage from './MemeDanmakuImage';
import SecretCodeInteraction from './SecretCodeInteraction';
import RetroTVVideo from './RetroTVVideo';
import TimeMachineCalendar from './TimeMachineCalendar';
import IntroVideoPlayer from './IntroVideoPlayer';
import LightPoints180 from './LightPoints180';

interface MemeStorylineBlockProps {
  data: MemeTrend;
  index: number;
  onStepVisible?: (imageUrl: string, hasMemeWaterfall: boolean) => void;
}

const MemeStorylineBlock: React.FC<MemeStorylineBlockProps> = ({ data, index, onStepVisible }) => {
  const steps = data.visualHistory.map((vis, i) => ({
    ...vis,
    imageUrl: data.storySteps?.[i]?.imageUrl ?? vis.imageUrl,
    title: data.storySteps?.[i]?.title ?? vis.label,
    body: data.storySteps?.[i]?.body ?? '',
    specialComponent: data.storySteps?.[i]?.specialComponent,
    imageUrls: data.storySteps?.[i]?.imageUrls,
    videoUrl: data.storySteps?.[i]?.videoUrl,
    tvBackgroundUrl: data.storySteps?.[i]?.tvBackgroundUrl,
    phoneBackgroundUrl: data.storySteps?.[i]?.phoneBackgroundUrl
  }));

  if (steps.length === 0) return null;

  const caseLabel = index === 0 ? '案例一' : '案例二';

  return (
    <section className="relative">
      <div className="py-14 md:py-20 px-6 text-center border-b border-red-900/30 bg-gradient-to-b from-transparent via-red-950/10 to-transparent">
        <span className="ch3-case-label inline-block text-yellow-500/85 mb-4">
          {caseLabel}
        </span>
        <h2 className="ch3-case-title text-2xl sm:text-3xl md:text-4xl text-white mb-2">
          {data.hashtag}
        </h2>
        <p className="ch3-case-period text-white/55">{data.period}</p>
      </div>

      {steps.map((step, stepIndex) => (
        <ScrollytellingStep
          key={stepIndex}
          step={step}
          stepIndex={stepIndex}
          stepsLength={steps.length}
          onVisible={() =>
            onStepVisible?.(step.imageUrl, step.specialComponent === 'memeWaterfall')
          }
        />
      ))}

      <div className="py-10 md:py-12 flex justify-center">
        <ChevronDown className="text-white/25" size={28} strokeWidth={2} />
      </div>
    </section>
  );
};

interface ScrollytellingStepProps {
  step: {
    imageUrl: string;
    label: string;
    title: string;
    body: string;
    specialComponent?: 'memeWaterfall' | 'memeReveal' | 'memeChat' | 'memeDanmaku' | 'timeMachine' | 'secretCode' | 'introVideo' | 'lightPoints180';
    imageUrls?: string[];
    videoUrl?: string;
    tvBackgroundUrl?: string;
    phoneBackgroundUrl?: string;
  };
  stepIndex: number;
  stepsLength: number;
  onVisible?: () => void;
}

const ScrollytellingStep: React.FC<ScrollytellingStepProps> = ({
  step,
  stepIndex,
  stepsLength,
  onVisible
}) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const now = entry.isIntersecting;
        setVisible(now);
        if (now) onVisible?.();
      },
      { threshold: 0.25, rootMargin: '-5% 0px -5% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [onVisible]);

  const isEven = stepIndex % 2 === 0;
  const textOrder = isEven ? 'order-2 md:order-2' : 'order-2 md:order-1';
  const imageOrder = isEven ? 'order-1 md:order-1' : 'order-1 md:order-2';
  const hasMemeWaterfall = step.specialComponent === 'memeWaterfall';
  const hasMemeReveal = step.specialComponent === 'memeReveal';
  const hasMemeChat = step.specialComponent === 'memeChat';
  const hasMemeDanmaku = step.specialComponent === 'memeDanmaku';
  const hasTimeMachine = step.specialComponent === 'timeMachine';
  const hasSecretCode = step.specialComponent === 'secretCode';
  const hasIntroVideo = step.specialComponent === 'introVideo';
  const hasLightPoints180 = step.specialComponent === 'lightPoints180';

  return (
    <div
      ref={sectionRef}
      className="relative min-h-screen flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 px-6 py-20 md:py-32"
    >
      {/* 背景由 ChapterThreeStorylines 统一管理 */}

      {/* 滚动覆盖内容：文字随滚动淡入淡出 */}
      <div
        className={`flex-1 container mx-auto flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 ch3-step-fade ${
          visible ? 'opacity-100' : 'opacity-20'
        }`}
      >
        <div
          className={`flex flex-col justify-center ${textOrder} ${
            hasMemeDanmaku ? 'w-full md:w-2/5 md:max-w-sm' : 'w-full md:w-1/2'
          }`}
        >
          <h3 className="ch3-step-title text-xl sm:text-2xl md:text-3xl text-white mb-4">
            {step.title}
          </h3>
          {step.body && (
            <p
              className={`ch3-step-body text-white/85 ${
                hasMemeDanmaku ? 'text-sm md:text-base max-w-xs' : 'text-base md:text-lg'
              }`}
            >
              {step.body}
            </p>
          )}
          {hasSecretCode && (
            <div className="relative flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <SecretCodeInteraction />
              </div>
              <div className="relative flex-shrink-0 pt-6 group">
                <span
                  className="inline-flex w-6 h-6 items-center justify-center rounded-full bg-amber-500/30 text-amber-400 text-sm font-bold cursor-help border border-amber-500/50"
                  title="暗号也可以在视频中找到哦～"
                  aria-label="提示：暗号也可以在视频中找到哦"
                >
                  ❓
                </span>
                <span className="absolute right-0 bottom-full mb-1 w-[200px] px-3 py-2 rounded-lg bg-black/95 text-white text-xs leading-relaxed border border-amber-500/30 shadow-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-20 text-center">
                  暗号也可以在视频中找到哦～
                </span>
              </div>
            </div>
          )}
        </div>

        <div
          className={`flex justify-center ${imageOrder} ${
            hasMemeDanmaku ? 'w-full md:w-3/5 md:flex-1' : 'w-full md:w-1/2'
          }`}
        >
          {step.videoUrl && hasIntroVideo ? (
            <IntroVideoPlayer videoUrl={step.videoUrl} visible={visible} />
          ) : step.videoUrl ? (
            <RetroTVVideo videoUrl={step.videoUrl} visible={visible} />
          ) : hasMemeReveal ? (
            <MemeRevealOnScroll visible={visible} imageUrls={step.imageUrls} />
          ) : hasMemeChat ? (
            <MemeChatBubbles visible={visible} imageUrls={step.imageUrls} />
          ) : hasMemeDanmaku ? (
            <MemeDanmakuImage imageUrl={step.imageUrl} visible={visible} />
          ) : hasTimeMachine ? (
            <TimeMachineCalendar
              visible={visible}
              tvBackgroundUrl={step.tvBackgroundUrl}
              phoneBackgroundUrl={step.phoneBackgroundUrl}
            />
          ) : hasLightPoints180 ? (
            <LightPoints180 visible={visible} />
          ) : step.imageUrls && step.imageUrls.length >= 2 ? (
            <div className="w-full max-w-2xl flex gap-4 justify-center items-stretch">
              {step.imageUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative flex-1 min-w-0 rounded-2xl overflow-hidden border-2 border-red-900/40 shadow-2xl bg-black/30 aspect-[4/3]"
                >
                  <img
                    src={url}
                    alt={`${step.label} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              ))}
            </div>
          ) : (
            <div className="relative w-full max-w-md aspect-[4/3] rounded-2xl overflow-hidden border-2 border-red-900/40 shadow-2xl bg-black/30">
              <img
                src={step.imageUrl}
                alt={step.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="ch3-card-label text-yellow-500">
                  {step.label}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemeStorylineBlock;
