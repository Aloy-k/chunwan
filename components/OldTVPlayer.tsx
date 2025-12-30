
import React, { useRef, useState, useEffect } from 'react';
import { VideoData, HumorPoint, WordCloudItem } from '../types';
import { Info, Play, Pause, RotateCcw, Zap, Tv, Settings2, SkipForward, Database, FileSearch, ChartBar } from 'lucide-react';

interface OldTVPlayerProps {
  data: VideoData;
}

const OldTVPlayer: React.FC<OldTVPlayerProps> = ({ data }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const lastTimeRef = useRef<number>(0);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [activeAnalysis, setActiveAnalysis] = useState<HumorPoint | null>(null);
  const [isLaughterGap, setIsLaughterGap] = useState(false);
  const [seenPoints, setSeenPoints] = useState<Set<number>>(new Set());
  const [showWordCloud, setShowWordCloud] = useState(false);
  const [cloudScanning, setCloudScanning] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleTimeUpdate = () => {
      const time = video.currentTime;
      setCurrentTime(time);

      if (time < lastTimeRef.current - 1) {
        setSeenPoints(new Set());
      }
      lastTimeRef.current = time;

      const point = data.humorPoints.find(p => 
        Math.abs(time - p.timestamp) < 0.4 && !seenPoints.has(p.timestamp)
      );

      if (point && !activeAnalysis && !isLaughterGap) {
        setSeenPoints(prev => new Set(prev).add(point.timestamp));
        setIsLaughterGap(true);
        
        setTimeout(() => {
          if (videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
            setIsLaughterGap(false);
            setActiveAnalysis(point);
          }
        }, 1200); 
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [data.humorPoints, activeAnalysis, isLaughterGap, seenPoints]);

  const togglePlay = () => {
    if (showWordCloud) {
        handleReset();
        return;
    }
    if (activeAnalysis) {
      setActiveAnalysis(null);
      videoRef.current?.play();
      setIsPlaying(true);
    } else if (isPlaying) {
      videoRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleReset = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      lastTimeRef.current = 0;
      setSeenPoints(new Set());
      setActiveAnalysis(null);
      setIsLaughterGap(false);
      setShowWordCloud(false);
      setCloudScanning(false);
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const onVideoEnd = () => {
    setIsPlaying(false);
    setCloudScanning(true);
    setTimeout(() => {
        setCloudScanning(false);
        setShowWordCloud(true);
    }, 2000);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressBarRef.current || !videoRef.current || showWordCloud) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickedValue = (x / rect.width) * duration;
    
    videoRef.current.currentTime = clickedValue;
    setCurrentTime(clickedValue);
    setActiveAnalysis(null);
    setIsLaughterGap(false);
    videoRef.current.play();
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="relative w-full max-w-5xl mx-auto mb-56 p-2 bg-[#2a1810] rounded-[4rem] shadow-[0_80px_150px_rgba(0,0,0,0.8)] border-t-[18px] border-[#3e2723] group/tv transition-all duration-700 hover:scale-[1.01]">
      <div className="absolute inset-0 rounded-[3.8rem] bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')] opacity-30 pointer-events-none"></div>
      
      <div className="relative flex flex-col lg:flex-row gap-0 p-8 md:p-12">
        <div className={`flex-1 relative aspect-[4/3] bg-[#050505] rounded-[4rem] p-5 border-[16px] border-[#151515] shadow-[inset_0_0_120px_rgba(0,0,0,1)] crt-screen overflow-hidden transition-all duration-500 ${isLaughterGap || cloudScanning ? 'scale-[1.03] shadow-[0_0_100px_rgba(234,179,8,0.3)]' : ''}`}>
          
          <div className="absolute inset-0 crt-glow pointer-events-none z-10"></div>
          
          <video 
            ref={videoRef}
            src={data.videoUrl}
            poster={data.poster}
            className={`w-full h-full object-cover rounded-[3rem] transition-all duration-1000 animate-[tv-flicker_0.15s_infinite] ${isLaughterGap || cloudScanning || showWordCloud ? 'brightness-[0.15] blur-md grayscale' : 'opacity-95 contrast-110'}`}
            onEnded={onVideoEnd}
            onClick={togglePlay}
          />

          {/* OSD */}
          <div className="absolute top-8 left-10 z-30 font-mono text-[#00ff41] text-xs tracking-widest pointer-events-none opacity-80 flex flex-col gap-1">
             <div className="flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${isPlaying ? 'bg-[#00ff41] animate-pulse shadow-[0_0_10px_#00ff41]' : 'bg-red-600'}`}></div>
                <span className="font-black">
                    {showWordCloud ? 'GENE-MAP' : cloudScanning ? 'SCANNING' : isPlaying ? 'VCR-PLAY' : 'VCR-STOP'}
                </span>
             </div>
             <div className="text-sm">{formatTime(currentTime)} <span className="opacity-40">/ {formatTime(duration)}</span></div>
          </div>

          {/* 词云图展示层 */}
          {showWordCloud && (
            <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-12">
               <div className="mb-8 flex flex-col items-center gap-2">
                  <div className="px-4 py-1.5 bg-[#800] text-yellow-500 text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-yellow-500/30 mb-2">
                    Mechanism Analysis Result
                  </div>
                  <h3 className="text-4xl font-black text-white italic tracking-tighter">《{data.type}》幽默基因图谱</h3>
               </div>
               
               <div className="relative w-full h-64 flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                  {data.wordCloud.map((item, idx) => (
                    <div 
                      key={item.text}
                      className="animate-in fade-in zoom-in duration-700"
                      style={{ 
                        animationDelay: `${idx * 100}ms`,
                        fontSize: `${12 + item.weight * 3}px`,
                        color: item.weight > 8 ? '#facc15' : item.weight > 5 ? '#ffffff' : '#9ca3af',
                        opacity: 0.5 + (item.weight / 10) * 0.5
                      }}
                    >
                      <span className={`font-black tracking-tighter hover:scale-110 transition-transform cursor-default ${item.weight > 8 ? 'drop-shadow-[0_0_15px_rgba(234,179,8,0.4)]' : ''}`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
               </div>

               <button 
                 onClick={handleReset}
                 className="mt-12 flex items-center gap-3 px-8 py-3 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:bg-white/10 transition-all"
               >
                 <RotateCcw size={14} /> 回放归档视频
               </button>
            </div>
          )}

          {/* 扫描动画层 */}
          {cloudScanning && (
            <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/40">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent shadow-[0_0_20px_#eab308] animate-[scan_2s_linear_infinite]"></div>
                <div className="flex flex-col items-center gap-6">
                    <div className="p-5 bg-yellow-500 rounded-3xl animate-pulse">
                        <Database size={40} className="text-red-950" />
                    </div>
                    <div className="space-y-2 text-center">
                        <p className="text-yellow-500 font-black text-xl tracking-tighter">正在提取幽默机制基因...</p>
                        <p className="text-white/20 font-mono text-[10px] uppercase tracking-[0.3em]">Processing Archive ID: {data.id.toUpperCase()}</p>
                    </div>
                </div>
            </div>
          )}

          <div className="absolute bottom-8 left-10 right-10 z-40">
            {!showWordCloud && (
                <div className="group/seek-box py-4 cursor-pointer" onClick={handleSeek}>
                    <div ref={progressBarRef} className="h-1.5 w-full bg-white/5 rounded-full relative overflow-visible transition-all group-hover/seek-box:h-4">
                    <div className="absolute top-0 left-0 h-full bg-[#00ff41] shadow-[0_0_15px_#00ff41] transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
                    <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-2xl border-2 border-[#00ff41] transition-all opacity-0 group-hover/seek-box:opacity-100 scale-0 group-hover/seek-box:scale-100" style={{ left: `calc(${progressPercent}% - 8px)` }}></div>
                    {data.humorPoints.map(p => {
                        const isPassed = currentTime >= p.timestamp;
                        return (
                        <div key={p.timestamp} className={`absolute top-0 w-2 h-full z-50 transition-all duration-500 ${isPassed ? 'bg-yellow-400 scale-y-125' : 'bg-red-600/50'} group-hover/seek-box:w-3`} style={{ left: `${(p.timestamp / duration) * 100}%` }}>
                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover/seek-box:opacity-100 transition-all scale-75 group-hover/seek-box:scale-100">
                                <Zap size={12} className={isPassed ? 'text-yellow-400' : 'text-white/20'} />
                            </div>
                        </div>
                        );
                    })}
                    </div>
                </div>
            )}
            
            <div className="flex justify-between items-center mt-1 px-1">
               <span className="text-[9px] font-mono text-[#00ff41]/40 uppercase tracking-widest flex items-center gap-1">
                 <Settings2 size={10} /> REC SYNC ACTIVE
               </span>
               <span className="text-[9px] font-mono text-white/20 uppercase tracking-[0.2em]">
                 TIMELINE 5'00"
               </span>
            </div>
          </div>

          {isLaughterGap && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-in zoom-in-50 duration-300">
               <div className="flex flex-col items-center gap-4 bg-yellow-500 text-black px-8 py-6 rounded-[2.5rem] shadow-[0_0_80px_rgba(234,179,8,0.8)] border-4 border-black/10">
                  <Zap size={32} fill="currentColor" className="animate-pulse" />
                  <span className="font-black text-xl tracking-tighter italic">笑点触发分析中...</span>
               </div>
            </div>
          )}

          {activeAnalysis && (
            <div className="absolute inset-0 flex items-center justify-center p-8 z-[60]">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-in fade-in duration-700"></div>
              <div className="relative bg-[#fafafa] text-black w-full max-w-lg rounded-[3rem] shadow-[0_60px_120px_rgba(0,0,0,1)] border-l-[14px] border-[#800] transform animate-in slide-in-from-bottom-20 duration-500 flex flex-col p-8 overflow-hidden">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-red-800 rounded-2xl flex items-center justify-center text-white rotate-6 shadow-xl">
                      <Info size={24} />
                  </div>
                  <div>
                    <span className="font-black text-[10px] tracking-[0.2em] text-red-800/60 uppercase block mb-0.5">Humor Logic</span>
                    <h4 className="font-black text-2xl text-red-950 tracking-tighter">内源幽默机制剖析</h4>
                  </div>
                </div>
                <div className="mb-6"><h3 className="relative z-10 text-xl font-black italic border-l-6 border-yellow-500 pl-6 py-4 bg-yellow-50/50 rounded-r-[2rem] text-red-950 leading-tight">“{activeAnalysis.content}”</h3></div>
                <div className="space-y-4 mb-8">
                  <div className="space-y-1"><span className="text-[10px] font-black uppercase tracking-widest text-red-800">触发逻辑 / Logic</span><p className="text-lg font-black text-gray-900 leading-tight">{activeAnalysis.mechanism}</p></div>
                  <div className="space-y-1"><span className="text-[10px] font-black uppercase tracking-widest text-blue-800">深度解读 / Mechanism</span><p className="text-sm leading-relaxed text-gray-700 font-bold italic opacity-80">{activeAnalysis.analysis}</p></div>
                </div>
                <button onClick={togglePlay} className="w-full py-6 bg-[#1a1a1a] text-white rounded-2xl font-black text-lg hover:bg-red-800 transition-all active:scale-95 flex items-center justify-center gap-4 shadow-3xl group/btn overflow-hidden relative">
                  <span className="relative z-10 flex items-center gap-3">继续播放 <SkipForward size={20} className="group-hover/btn:translate-x-1 transition-transform" /></span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-900 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-700"></div>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-full lg:w-56 bg-[#151515] rounded-r-[4rem] lg:rounded-l-none border-l-4 border-black/20 flex flex-col items-center py-12 px-8 gap-12 shadow-[inset_15px_0_40px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col gap-10 items-center w-full">
            <div className="relative group/knob w-full flex flex-col items-center">
               <button onClick={togglePlay} className="w-20 h-20 rounded-full bg-gradient-to-br from-[#444] to-[#0a0a0a] border-4 border-[#252525] shadow-[0_15px_30px_rgba(0,0,0,0.9),inset_0_2px_5px_rgba(255,255,255,0.1)] flex items-center justify-center transition-all duration-500 hover:scale-105 active:scale-90">
                  <div className={`w-2.5 h-10 bg-white/5 rounded-full transition-transform duration-700 ${isPlaying ? 'rotate-90' : 'rotate-0'}`}></div>
                  <div className="absolute inset-0 flex items-center justify-center">{isPlaying ? <Pause className="text-[#00ff41] opacity-30" size={28} /> : <Play className="text-white/10" size={28} />}</div>
               </button>
               <span className="mt-4 text-[9px] font-black text-white/30 tracking-[0.3em] uppercase">Control</span>
            </div>
            <div className="relative group/knob2 w-full flex flex-col items-center">
               <button onClick={handleReset} className="w-12 h-12 rounded-full bg-gradient-to-br from-[#333] to-[#0a0a0a] border-2 border-[#222] shadow-[0_10px_20px_rgba(0,0,0,0.8)] flex items-center justify-center transition-all duration-500 hover:rotate-[-90deg] active:scale-75"><RotateCcw className="text-white/20" size={16} /></button>
               <span className="mt-2 text-[8px] font-black text-white/20 tracking-[0.2em] uppercase">Reset</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="w-4 h-36 bg-black/50 rounded-full p-1 border border-white/5 relative overflow-hidden flex flex-col justify-end">
               {[...Array(12)].map((_, i) => (
                 <div key={i} className={`w-full h-1.5 mb-0.5 rounded-sm transition-all duration-300 ${ (12 - i) / 12 * 100 <= progressPercent ? 'bg-yellow-500 shadow-[0_0_5px_rgba(234,179,8,0.5)]' : 'bg-white/5' }`}></div>
               ))}
            </div>
            <div className="text-center"><span className="text-[9px] text-yellow-600 font-black uppercase tracking-widest block">Sync</span><div className="font-mono text-[8px] text-white/20">{(progressPercent).toFixed(1)}%</div></div>
          </div>
          <div className="flex flex-col gap-1.5 w-full mt-auto">{[...Array(8)].map((_, i) => (<div key={i} className="h-0.5 bg-black/80 rounded-full border-t border-white/5 opacity-30"></div>))}</div>
        </div>
      </div>

      <div className="absolute -bottom-10 left-16 px-10 py-6 bg-[#a31a1a] text-white font-black rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.7)] border-2 border-white/10 flex items-center gap-6 z-50 transform -rotate-1 hover:rotate-0 transition-all duration-500">
        <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center border border-white/5"><Tv size={20} className="text-yellow-400" /></div>
        <div className="flex flex-col"><span className="text-[9px] uppercase tracking-[0.3em] text-white/40 font-bold">Archive V.2025</span><span className="text-xl tracking-tighter italic whitespace-nowrap">《{data.title}》</span></div>
        <div className="ml-6 px-4 py-1.5 bg-yellow-500 text-red-950 text-[10px] rounded-full font-black uppercase tracking-widest border border-yellow-400/50">{data.type}</div>
      </div>
    </div>
  );
};

export default OldTVPlayer;
