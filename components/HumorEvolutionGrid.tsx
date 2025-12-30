
import React, { useState, useMemo } from 'react';
import { EVOLUTION_DATA, HUMOR_COLORS } from '../constants';
import { EvolutionProgram, HumorType } from '../types';
import { MousePointer2, Sparkles, Filter, Fingerprint } from 'lucide-react';

const HumorEvolutionGrid: React.FC = () => {
  const data = useMemo(() => EVOLUTION_DATA, []);
  
  const [selectedType, setSelectedType] = useState<HumorType | null>(null);
  const [hoveredProgram, setHoveredProgram] = useState<EvolutionProgram | null>(null);

  // 统计各标签出现频次，完全匹配参考图右侧面板逻辑
  const stats = useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach(prog => {
      prog.composition.forEach(comp => {
        // 如果该项占比大于0，则计入频次
        if (comp.ratio > 0) {
          counts[comp.type] = (counts[comp.type] || 0) + 1;
        }
      });
    });
    const types: HumorType[] = ['语言包袱', '人物反差', '逻辑乌龙', '民生吐槽', '夸张视听'];
    return types.map(t => ({
      type: t,
      count: counts[t] || 0,
      color: HUMOR_COLORS[t]
    })).sort((a, b) => b.count - a.count);
  }, [data]);

  const handleToggleFilter = (type: HumorType) => {
    setSelectedType(prev => prev === type ? null : type);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 bg-[#0f172a] p-8 rounded-[1rem] border border-white/10 min-h-[700px] shadow-2xl relative overflow-hidden font-sans">
      
      {/* 左侧：紧凑型演化矩阵 */}
      <div className="flex-[3] flex flex-col">
        <div className="mb-6 flex items-center justify-between border-b border-white/5 pb-4">
           <div className="flex items-center gap-3">
              <Fingerprint size={20} className="text-yellow-500" />
              <h3 className="text-sm font-bold text-white/90 tracking-widest uppercase">
                Chunwan Humor Evolution Matrix / 演变矩阵
              </h3>
           </div>
           <div className="flex items-center gap-2 text-[10px] text-white/40 font-medium">
             <Filter size={12} />
             <span>{selectedType ? `Filtering: ${selectedType}` : 'Total Archives: ' + data.length}</span>
           </div>
        </div>

        {/* 矩阵核心：纵向长方形格点，参考图风格 */}
        {/* 将数字改大即可，例如这里改成了 50 */}
        <div className="grid grid-cols-12 sm:grid-cols-20 md:grid-cols-28 lg:grid-cols-32 gap-1 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
          {data.map((prog) => {
            const isMatch = !selectedType || prog.composition.some(c => c.type === selectedType);
            
            return (
              <div 
                key={prog.id}
                onMouseEnter={() => setHoveredProgram(prog)}
                onMouseLeave={() => setHoveredProgram(null)}
                className={`relative h-12 w-full transition-all duration-300 rounded-[1px] overflow-hidden cursor-crosshair border border-black/20 ${isMatch ? 'opacity-100 scale-100' : 'opacity-10 grayscale'}`}
              >
                {/* 多色占比显示 - 纵向切分或横向切分（参考图为横向条带组成的纵向块） */}
                <div className="flex flex-col h-full w-full">
                  {prog.composition.map((comp, idx) => (
                    <div 
                      key={idx}
                      style={{ 
                        height: `${comp.ratio * 100}%`,
                        backgroundColor: HUMOR_COLORS[comp.type]
                      }}
                      className="w-full relative transition-all"
                    >
                      {/* 筛选激活效果 */}
                      {selectedType === comp.type && (
                        <div className="absolute inset-0 bg-white/20 animate-pulse border-y border-white/30"></div>
                      )}
                    </div>
                  ))}
                </div>
                {/* 悬停微光 */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-white/10 transition-opacity"></div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex items-center gap-3 text-[9px] font-bold text-white/20 uppercase tracking-widest">
           <MousePointer2 size={10} className="text-yellow-500" /> 
           Grid items represent specific programs from 1983 to 2025
        </div>
      </div>

      {/* 右侧：统计面板，对齐参考图样式 */}
      <div className="flex-1 flex flex-col gap-6">
        <div className="space-y-6">
          <div className="flex flex-col gap-1">
            <h4 className="text-xs font-black text-white/60 tracking-widest uppercase">Subjects</h4>
            <p className="text-[10px] text-white/30 italic">Click to select one or more subjects</p>
          </div>

          <div className="flex flex-col gap-2">
            {stats.map((item) => (
              <button
                key={item.type}
                onClick={() => handleToggleFilter(item.type as HumorType)}
                className={`group flex items-center justify-between p-3 rounded-md transition-all border ${selectedType === item.type ? 'bg-white/10 border-white/20' : 'bg-white/5 border-transparent hover:bg-white/[0.08]'}`}
                style={{ borderLeftColor: item.color, borderLeftWidth: '4px' }}
              >
                <span className={`text-xs font-bold transition-colors ${selectedType === item.type ? 'text-white' : 'text-white/50 group-hover:text-white'}`}>
                  {item.type}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-mono text-white/40 uppercase tracking-tighter">Occurrences</span>
                  <span className="text-xs font-black text-white/80 w-8 text-right">{item.count}</span>
                </div>
              </button>
            ))}
          </div>

          {/* 实时详情卡片 - 浮动感知 */}
          <div className={`mt-8 transition-all duration-500 ${hoveredProgram ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
             <div className="bg-[#1e293b] rounded-xl p-5 border border-white/10 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-3 opacity-[0.03]">
                  <Sparkles size={60} />
                </div>
                
                <div className="flex justify-between items-start mb-4">
                   <div className="px-2 py-0.5 bg-yellow-500/10 text-yellow-500 text-[9px] font-black rounded border border-yellow-500/20">ARCHIVE {hoveredProgram?.year}</div>
                </div>

                <h5 className="text-lg font-black text-white mb-4 tracking-tighter">《{hoveredProgram?.name}》</h5>
                
                <div className="space-y-3">
                   {hoveredProgram?.composition?.map((comp, idx) => (
                     <div key={idx} className="space-y-1">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                           <span className="text-white/50">{comp.type}</span>
                           <span className="text-white/90">{(comp.ratio * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                           <div 
                             className="h-full transition-all duration-500" 
                             style={{ 
                               width: `${comp.ratio * 100}%`, 
                               backgroundColor: HUMOR_COLORS[comp.type] 
                             }}
                           ></div>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        </div>
      </div>

      <style>{`
        .grid-cols-28 { grid-template-columns: repeat(28, minmax(0, 1fr)); }
        .grid-cols-32 { grid-template-columns: repeat(32, minmax(0, 1fr)); }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.1); }
      `}</style>
    </div>
  );
};

export default HumorEvolutionGrid;
