import React, { useRef, useEffect, useState } from 'react';
import { Play, Pause } from 'lucide-react';

const HIGHLIGHT_TIME_SEC = 11 * 60 + 30; // 11:30 暗号出现位置

function formatTime(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

/** 案例二 Step1：1996 春晚《打工奇遇》视频流 + 进度条（11:30 高亮）+ 复古老电视滤镜，支持声音与播放/暂停 */
interface RetroTVVideoProps {
  videoUrl: string;
  visible: boolean;
}

export default function RetroTVVideo({ videoUrl, visible }: RetroTVVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    if (visible) {
      el.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      el.pause();
      setIsPlaying(false);
    }
  }, [visible]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    const onTimeUpdate = () => setCurrentTime(el.currentTime);
    const onLoadedMetadata = () => setDuration(el.duration);
    const onDurationChange = () => setDuration(el.duration);
    el.addEventListener('timeupdate', onTimeUpdate);
    el.addEventListener('loadedmetadata', onLoadedMetadata);
    el.addEventListener('durationchange', onDurationChange);
    return () => {
      el.removeEventListener('timeupdate', onTimeUpdate);
      el.removeEventListener('loadedmetadata', onLoadedMetadata);
      el.removeEventListener('durationchange', onDurationChange);
    };
  }, [videoUrl]);

  const togglePlayPause = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      el.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const el = videoRef.current;
    if (!el) return;
    const t = Number(e.target.value);
    el.currentTime = t;
    setCurrentTime(t);
  };

  const highlightPercent = duration > 0 ? Math.min(100, (HIGHLIGHT_TIME_SEC / duration) * 100) : 0;

  return (
    <div className="relative w-full max-w-4xl aspect-video rounded-2xl overflow-hidden border-2 border-amber-900/50 shadow-2xl bg-black crt-flicker">
      <video
        ref={videoRef}
        src={videoUrl}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        playsInline
        preload="metadata"
        aria-label="1996年春晚打工奇遇赵丽蓉唱RAP"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      {/* CRT 扫描线 */}
      <div className="absolute inset-0 pointer-events-none crt-scanlines rounded-2xl" aria-hidden />
      <div className="absolute inset-0 pointer-events-none crt-screen rounded-2xl" aria-hidden />
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl opacity-[0.12] mix-blend-overlay"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px'
        }}
      />
      <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 rounded text-[10px] text-amber-400/90 font-mono">
        1996 春晚 · 打工奇遇
      </div>
      {/* 播放/暂停按钮 */}
      <button
        type="button"
        onClick={togglePlayPause}
        className="absolute bottom-12 right-2 w-11 h-11 rounded-full bg-amber-500/90 hover:bg-amber-500 flex items-center justify-center shadow-lg transition-colors pointer-events-auto z-10"
        aria-label={isPlaying ? '暂停' : '播放'}
      >
        {isPlaying ? (
          <Pause className="text-amber-950" size={22} strokeWidth={2.5} />
        ) : (
          <Play className="text-amber-950 ml-0.5" size={22} strokeWidth={2.5} />
        )}
      </button>

      {/* 进度条区域 */}
      <div className="absolute left-0 right-0 bottom-0 h-10 px-3 flex items-center gap-2 bg-gradient-to-t from-black/90 to-transparent pointer-events-auto">
        <span className="text-[10px] text-amber-400/90 font-mono tabular-nums w-9">
          {formatTime(currentTime)}
        </span>
        <div className="flex-1 relative h-2 flex items-center">
          {/* 11:30 高亮标记：暗号位置 */}
          {duration >= HIGHLIGHT_TIME_SEC && (
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-yellow-400 border-2 border-amber-900 shadow-[0_0_8px_rgba(234,179,8,0.8)] z-[2]"
              style={{ left: `${highlightPercent}%`, marginLeft: -4 }}
              title="暗号在这里"
              aria-hidden
            />
          )}
          <input
            type="range"
            min={0}
            max={duration || 100}
            step={0.1}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 rounded-full appearance-none bg-white/20 accent-amber-500 cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-amber-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:shadow-md"
            aria-label="视频进度"
          />
        </div>
        <span className="text-[10px] text-amber-400/70 font-mono tabular-nums w-9">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}
