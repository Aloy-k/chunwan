import React, { useRef, useState, useEffect } from 'react';
import { Play } from 'lucide-react';

const INTRO_TEXT = '下面进入Law&Order_春晚版';

/** 案例二 Step3：先显示黑底白字 intro，用户点击后开始播放视频流；离开视口自动暂停，回到视口继续播放 */
interface IntroVideoPlayerProps {
  videoUrl: string;
  visible: boolean;
}

export default function IntroVideoPlayer({ videoUrl, visible }: IntroVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);

  // 离开视口暂停，回到视口继续播放（仅对已点击开始的视频生效）
  useEffect(() => {
    if (!started) return;
    const el = videoRef.current;
    if (!el) return;
    if (visible) {
      el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [visible, started]);

  const handleClick = () => {
    setStarted(true);
    videoRef.current?.play().catch(() => {});
  };

  return (
    <div className="w-full max-w-4xl">
      <div
        className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-red-900/40 shadow-2xl bg-black cursor-pointer"
        onClick={!started ? handleClick : undefined}
        role={!started ? 'button' : undefined}
        aria-label={!started ? '点击播放视频' : undefined}
      >
        {!started ? (
          /* 首帧：黑底白字 + 点击播放提示 */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-black p-8">
            <p className="text-white text-xl md:text-2xl font-bold tracking-wide text-center whitespace-pre-line">
              {INTRO_TEXT}
            </p>
            <div className="flex items-center gap-2 text-white/70 text-sm">
              <Play className="flex-shrink-0" size={20} />
              <span>点击画面播放</span>
            </div>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              src={videoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              controls
              playsInline
              preload="auto"
              aria-label="Law and Order 春晚版"
            />
          </>
        )}
      </div>
      <p className="mt-1.5 text-center text-[10px] text-white/40">
        该视频素材来源于小红书平台
      </p>
    </div>
  );
}
