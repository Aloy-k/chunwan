
import React, { useState } from 'react';
import { PERFORMERS } from '../constants';
import { Performer } from '../types';
import { Star, Quote, Award, Sparkles, MapPin, X } from 'lucide-react';

// Coordinates calibrated to form Big Dipper constellation shape
// 北斗七星布局：勺子形状（6颗星）+ 指极星（1颗星）
const DIPPER_PERFORMERS = [
  { id: 'GD', x: 16, y: 36, label: '郭达' },     // 指极星（北极星指向）
  { id: 'FG', x: 30, y: 28, label: '冯巩' },       // 勺口上
  { id: 'CM', x: 45, y: 38, label: '蔡明' },       // 勺口上
  { id: 'JK', x: 55, y: 44, label: '姜昆' },    // 勺底
  { id: 'HH', x: 60, y: 59, label: '黄宏' },    // 勺底
  { id: 'GDL', x: 80, y: 53, label: '郭冬临' },    // 勺口下
  { id: 'ZBS', x: 90, y: 30, label: '赵本山' },       // 勺柄
];

const BigDipperConstellation: React.FC = () => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const performersData = DIPPER_PERFORMERS.map(p => {
    const data = PERFORMERS.find(per => per.id === p.id) || PERFORMERS[0];
    return { ...p, data };
  });

  const activePerformer = hoveredIndex !== null ? performersData[hoveredIndex] : null;

  // Generate the curved path using SVG Bezier - forming Big Dipper shape
  // 北斗七星路径：勺子形状连接
  const pathD = "M 16 36 L 30 28 L 45 38 L 55 44 L 60 59 L 80 53 L 90 24";

  return (
    <div className="relative w-full h-[850px] mt-10 overflow-hidden bg-[#1a0505] rounded-[3rem] border border-red-900/20 shadow-[0_0_100px_rgba(0,0,0,0.8)]">
      
      {/* Background Star Field */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(150)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-white rounded-full animate-twinkle"
            style={{ 
              width: Math.random() * 1.5 + 0.5 + 'px', 
              height: Math.random() * 1.5 + 0.5 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              opacity: Math.random() * 0.7,
              animationDelay: Math.random() * 5 + 's',
              animationDuration: (Math.random() * 4 + 2) + 's'
            }}
          ></div>
        ))}
      </div>

      {/* Header Info */}
      <div className="absolute top-12 left-0 right-0 text-center z-30 space-y-4 pointer-events-none">
          <h2 className="text-5xl font-black text-yellow-500 font-cursive tracking-wider drop-shadow-[0_4px_10px_rgba(0,0,0,1)]">
            群星璀璨：春晚“北斗七星”
          </h2>
          <p className="text-white/40 text-sm font-medium italic tracking-widest">鼠标悬停于星点，探寻传奇演艺生涯</p>
      </div>

      {/* Constellation SVG Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path 
          d={pathD}
          fill="none"
          stroke="rgba(234, 179, 8, 0.2)"
          strokeWidth="0.25"
          strokeDasharray="1, 1.5"
          className="animate-path-flow"
        />
      </svg>

      {/* Performer Stars & Hover Cards */}
      {performersData.map((p, i) => {
        const isHovered = hoveredIndex === i;
        // Determine pop-up side based on x position to prevent screen clipping
        const side = p.x > 50 ? 'left' : 'right';

        return (
          <div 
            key={p.id}
            className="absolute z-20"
            style={{ top: `${p.y}%`, left: `${p.x}%`, transform: 'translate(-50%, -50%)' }}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="relative flex flex-col items-center">
               {/* Star Core & Halo */}
               <div className="relative flex items-center justify-center">
                  <div className={`absolute w-12 h-12 bg-yellow-600/30 rounded-full blur-xl transition-all duration-700 ${isHovered ? 'scale-150 opacity-100' : 'scale-100 opacity-40'}`}></div>
                  <div className={`w-4 h-4 rounded-full border-[1.5px] border-yellow-400 bg-white shadow-[0_0_20px_rgba(234,179,8,1)] transition-all duration-300 ${isHovered ? 'scale-150 rotate-45' : ''}`}></div>
               </div>

               {/* Name Label */}
               <div className={`mt-3 transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}>
                 <span className={`font-cursive text-xl tracking-tighter whitespace-nowrap drop-shadow-md transition-colors duration-300 ${isHovered ? 'text-white' : 'text-yellow-500/80'}`}>
                   {p.label}
                 </span>
               </div>

               {/* POP-UP 科普卡片 (Floating Info Card) */}
               {isHovered && (
                 <div 
                   className={`absolute top-0 z-[100] w-[320px] pointer-events-none animate-in fade-in zoom-in-95 duration-300 ${side === 'right' ? 'left-16 origin-left' : 'right-16 origin-right text-right'}`}
                 >
                   <div className="bg-white/95 backdrop-blur-3xl rounded-[2rem] p-6 shadow-[0_30px_60px_rgba(0,0,0,0.6)] border-t-8 border-red-800">
                      <div className={`flex items-center gap-4 mb-4 ${side === 'right' ? 'flex-row' : 'flex-row-reverse'}`}>
                          <div className="p-3 bg-red-800 rounded-2xl shadow-lg">
                            <Sparkles className="text-white" size={20} />
                          </div>
                          <div>
                            <h3 className="text-2xl font-black text-red-950 tracking-tighter">{p.data.name}</h3>
                            <div className={`flex items-center gap-2 ${side === 'right' ? '' : 'justify-end'}`}>
                               <span className="px-1.5 py-0.5 bg-red-100 text-red-800 text-[8px] font-black uppercase tracking-widest rounded">{p.data.role}</span>
                               <span className="text-[8px] text-gray-400 font-bold uppercase tracking-widest">{p.data.firstYear}年首秀</span>
                            </div>
                          </div>
                      </div>

                      <div className="space-y-4">
                         <div className="flex gap-2">
                            <div className="flex-1 bg-red-50/50 p-3 rounded-2xl border border-red-100/50">
                               <span className="text-[8px] font-black text-red-800/40 uppercase tracking-widest block mb-0.5">作品存量</span>
                               <div className="text-lg font-black text-red-950">{p.data.totalWorks} <span className="text-[10px] font-medium opacity-50">部经典</span></div>
                            </div>
                            <div className="flex-1 bg-red-50/50 p-3 rounded-2xl border border-red-100/50 text-left">
                               <span className="text-[8px] font-black text-red-800/40 uppercase tracking-widest block mb-0.5">演艺地位</span>
                               <div className="text-xs font-black text-red-950 flex items-center gap-1">
                                  <Award size={12} className="text-yellow-600" /> 一代宗师
                               </div>
                            </div>
                         </div>

                         <div className={`relative py-1 ${side === 'right' ? 'pl-4 border-l-2' : 'pr-4 border-r-2'} border-red-100`}>
                            <p className="text-xs text-red-950 font-medium leading-relaxed italic">
                              "{p.data.bio}"
                            </p>
                         </div>

                         <div className="pt-2 border-t border-red-50">
                            <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-2">经典金句</span>
                            <div className={`flex flex-wrap gap-1.5 ${side === 'right' ? '' : 'justify-end'}`}>
                               {p.data.quotes.slice(0, 2).map(quote => (
                                 <div key={quote} className="px-3 py-1.5 bg-red-50 text-red-900 font-bold text-[10px] rounded-lg">
                                    “{quote}”
                                 </div>
                               ))}
                            </div>
                         </div>
                      </div>
                   </div>
                   
                   {/* Visual Link Line (Connector) */}
                   <div className={`absolute top-1/2 -translate-y-1/2 w-8 h-[1px] bg-gradient-to-r ${side === 'right' ? 'from-yellow-500/0 to-yellow-500 -left-12' : 'from-yellow-500 to-yellow-500/0 -right-12'}`}></div>
                 </div>
               )}
            </div>
          </div>
        );
      })}

      {/* Decorative Corner Elements */}
      <div className="absolute top-10 left-10 pointer-events-none select-none opacity-10">
         <div className="text-[10rem] font-black italic tracking-tighter text-white uppercase leading-none">Legend</div>
      </div>
      <div className="absolute bottom-10 right-10 pointer-events-none select-none opacity-10 transform rotate-180">
         <div className="text-[10rem] font-black italic tracking-tighter text-white uppercase leading-none">Iconic</div>
      </div>

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.15); }
        }
        .animate-twinkle {
          animation: twinkle var(--duration, 4s) ease-in-out infinite;
        }
        @keyframes pathFlow {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        .animate-path-flow {
          stroke-dasharray: 2;
          animation: pathFlow 30s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default BigDipperConstellation;
