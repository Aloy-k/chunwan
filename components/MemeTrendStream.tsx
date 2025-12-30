import React, { useState, useRef, useMemo } from 'react';
import { MemeTrend } from '../types';
import { Plus, MousePointer2 } from 'lucide-react';

interface MemeTrendStreamProps {
  data: MemeTrend;
}

const MemeTrendStream: React.FC<MemeTrendStreamProps> = ({ data }) => {
  const [mouseX, setMouseX] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    setMouseX(Math.max(0, Math.min(100, x)));
  };

  const currentVisual = useMemo(() => {
    if (mouseX === null) return null;
    let closest = data.visualHistory[0];
    for (const point of data.visualHistory) {
      if (mouseX >= point.offset) {
        closest = point;
      }
    }
    return closest;
  }, [mouseX, data.visualHistory]);

  // --- 关键修改 1: 分离两个最大值 ---

  // 1. 互动量最大值 (用于 点赞、评论、转发)
  const maxEngagement = useMemo(() => {
    if (!data.points.length) return 100;
    // 找出互动数据的最大值
    const max = Math.max(...data.points.flatMap(p => [p.posts, p.likes, p.comments]));
    return max === 0 ? 100 : max * 1.1; // 留 10% 顶部空间
  }, [data.points]);

  // 2. 博文量最大值 (单独用于 博文数量)
  const maxVolume = useMemo(() => {
    if (!data.points.length) return 10;
    // 找出博文数量的最大值
    const max = Math.max(...data.points.map(p => (p as any).articleCount || 0));
    return max === 0 ? 10 : max * 1.1; // 留 10% 顶部空间
  }, [data.points]);


  // --- 关键修改 2: 生成路径时选择对应的最大值 ---
  const generateSmoothPath = (key: 'posts' | 'likes' | 'comments' | 'articleCount', isArea = false) => {
    if (data.points.length === 0) return '';
    
    // 根据 key 决定使用哪个最大值作为分母
    const currentMax = key === 'articleCount' ? maxVolume : maxEngagement;

    const points = data.points.map((p, i) => {
      const val = key === 'articleCount' ? ((p as any).articleCount || 0) : p[key];
      return {
        x: (i / (data.points.length - 1)) * 100,
        y: 100 - (val / currentMax) * 100 // 使用各自的 Max 进行归一化
      };
    });

    if (points.length === 0) return '';

    let path = `M ${points[0].x},${points[0].y}`;

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      path += ` C ${cp1x},${p0.y} ${cp1x},${p1.y} ${p1.x},${p1.y}`;
    }

    if (isArea) {
      path += ` L 100,100 L 0,100 Z`;
    }
    return path;
  };

  return (
    <div className="relative mb-40 last:mb-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-white/10 pb-6 mb-12 group/header cursor-none">
        <div className="flex items-baseline gap-8">
          <span className="text-[11px] font-black text-white/20 tracking-tighter w-12 uppercase">Index</span>
          <h3 className="text-4xl md:text-6xl font-black text-white tracking-tighter transition-colors group-hover/header:text-[#ff4d00]">
            {data.hashtag}
          </h3>
        </div>
        <div className="flex gap-16 mt-6 md:mt-0">
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">Timeframe</span>
             <span className="text-lg font-bold text-white/80">{data.period}</span>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">Engagement</span>
             <span className="text-lg font-bold text-[#ff4d00]">{data.totalData.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-16">
        <div 
          ref={containerRef}
          className="relative h-[400px] bg-white/[0.01] border border-white/5 rounded-[2.5rem] overflow-hidden cursor-none group transition-all hover:bg-white/[0.02] hover:border-white/10"
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setMouseX(null)}
        >
          <div className="absolute inset-0 flex flex-col justify-between opacity-5 pointer-events-none">
            {[...Array(5)].map((_, i) => <div key={i} className="w-full h-[1px] bg-white"></div>)}
          </div>
          <div className="absolute inset-0 flex justify-between opacity-5 pointer-events-none">
            {[...Array(10)].map((_, i) => <div key={i} className="h-full w-[1px] bg-white"></div>)}
          </div>

          <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* 1. 区域填充 (点赞) */}
            <path d={generateSmoothPath('likes', true)} fill="url(#gradient-likes)" className="transition-all duration-1000" />
            
            <defs>
              <linearGradient id="gradient-likes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff4d00" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#ff4d00" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* 2. 曲线绘制 */}
            <path d={generateSmoothPath('likes')} fill="none" stroke="#ff4d00" strokeWidth="1.2" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
            <path d={generateSmoothPath('comments')} fill="none" stroke="#ffffff" strokeWidth="0.8" strokeDasharray="2,1" vectorEffect="non-scaling-stroke" className="opacity-40" />
            <path d={generateSmoothPath('posts')} fill="none" stroke="#ffffff" strokeWidth="0.5" vectorEffect="non-scaling-stroke" className="opacity-20" />

            {/* 博文数 (使用独立比例) */}
            <path d={generateSmoothPath('articleCount')} fill="none" stroke="#22d3ee" strokeWidth="1.5" vectorEffect="non-scaling-stroke" strokeLinecap="round" className="drop-shadow-lg" />
          
          </svg>

          {/* Mouse Hover Tracker */}
          {mouseX !== null && (
            <>
              <div 
                className="absolute top-0 bottom-0 w-[1px] bg-[#ff4d00]/40 z-20 pointer-events-none"
                style={{ left: `${mouseX}%` }}
              >
                <div className="absolute top-4 -translate-x-1/2 flex flex-col items-center">
                  <Plus className="text-[#ff4d00]" size={16} />
                </div>
              </div>
              <div className="absolute bottom-6 left-8 flex gap-6 z-30 pointer-events-none">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black text-white/30 uppercase tracking-widest">Index At Offset</span>
                  <span className="text-xl font-black text-white">{mouseX.toFixed(1)}%</span>
                </div>
              </div>
            </>
          )}

          {/* Legend */}
          <div className="absolute top-8 right-10 flex flex-col gap-3 z-10 pointer-events-none">
             <div className="flex items-center justify-end gap-3">
                {/* 提示用户这是双轴图 */}
                <span className="text-[9px] font-black text-[#22d3ee] uppercase tracking-widest">博文量 (独立比例)</span>
                <div className="w-8 h-[2px] bg-[#22d3ee]"></div>
             </div>

             <div className="flex items-center justify-end gap-3">
                <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">点赞数</span>
                <div className="w-8 h-[2px] bg-[#ff4d00]"></div>
             </div>
             <div className="flex items-center justify-end gap-3">
                <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">评论量</span>
                <div className="w-8 h-[1px] bg-white/40 border-t border-dashed border-white/20"></div>
             </div>
             <div className="flex items-center justify-end gap-3">
                <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">转发数</span>
                <div className="w-8 h-[1px] bg-white/10"></div>
             </div>
          </div>
        </div>

        {/* Dynamic Image Preview */}
        <div className="relative">
          <div className="sticky top-32 group/preview">
            <div className="relative w-full aspect-square bg-[#0a0a0a] rounded-[3rem] overflow-hidden border border-white/5 shadow-2xl transition-all duration-700 hover:border-[#ff4d00]/30">
              {currentVisual ? (
                <div key={currentVisual.imageUrl} className="absolute inset-0 animate-in fade-in zoom-in-95 duration-700">
                  <img src={currentVisual.imageUrl} className="w-full h-full object-cover transition-all duration-1000 scale-105 group-hover/preview:scale-100" alt="Evolution Stage" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                  <div className="absolute bottom-10 left-10 right-10">
                     <div className="inline-block px-3 py-1 bg-[#ff4d00] text-black text-[9px] font-black uppercase tracking-[0.2em] mb-3">
                       Stage. {data.visualHistory.indexOf(currentVisual) + 1}
                     </div>
                     <h4 className="text-3xl font-black text-white leading-tight tracking-tighter uppercase">{currentVisual.label}</h4>
                  </div>
                </div>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-16 opacity-20">
                  <MousePointer2 className="mb-6 text-white" size={40} />
                  <p className="text-xs font-black uppercase tracking-[0.3em] text-white leading-loose italic">
                    Scrub the timeline<br/>to reveal visual archive
                  </p>
                </div>
              )}
            </div>
            
            <div className="absolute -bottom-16 -left-12 text-[15rem] font-black text-white/[0.02] pointer-events-none select-none italic leading-none z-[-1]">
              DATA
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemeTrendStream;