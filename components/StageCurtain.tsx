
import React, { useEffect, useState } from 'react';

interface StageCurtainProps {
  onOpened: () => void;
}

const StageCurtain: React.FC<StageCurtainProps> = ({ onOpened }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullyOpen, setIsFullyOpen] = useState(false);

  useEffect(() => {
    // Start opening after a short delay
    const timer = setTimeout(() => setIsOpen(true), 600);
    // Notify parent when animation finishes
    const finishTimer = setTimeout(() => {
        setIsFullyOpen(true);
        onOpened();
    }, 2800);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
    };
  }, [onOpened]);

  // Decorative pleats for the curtain
  const renderPleats = (count: number) => {
    return [...Array(count)].map((_, i) => (
      <div 
        key={i} 
        className="h-full flex-1 border-x border-black/20"
        style={{
          background: 'linear-gradient(90deg, rgba(0,0,0,0.3) 0%, rgba(255,255,255,0.1) 50%, rgba(0,0,0,0.3) 100%)'
        }}
      ></div>
    ));
  };

  return (
    <div className={`fixed inset-0 z-[100] flex overflow-hidden pointer-events-none ${isFullyOpen ? 'hidden' : 'block'}`}>
      
      {/* Left Curtain */}
      <div 
        className={`relative w-1/2 h-full bg-[#800] transition-transform duration-[2200ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] origin-left flex shadow-[20px_0_50px_rgba(0,0,0,0.8)] z-20 ${isOpen ? '-translate-x-[110%] skew-x-[-2deg]' : 'translate-x-0'}`}
        style={{ 
            backgroundImage: 'repeating-linear-gradient(90deg, #600 0px, #800 40px, #a00 80px, #800 120px, #600 160px)',
            backgroundSize: '20% 100%' 
        }}
      >
        <div className="absolute inset-0 flex">{renderPleats(12)}</div>
        {/* Gold Trim Edge */}
        <div className="absolute right-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-yellow-700 via-yellow-400 to-yellow-800 shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
        {/* Tassel cord detail */}
        <div className={`absolute top-1/4 -right-4 w-8 h-32 transition-all duration-1000 delay-300 ${isOpen ? 'opacity-0 scale-50' : 'opacity-100'}`}>
            <div className="w-1 h-full bg-yellow-600 mx-auto rounded-full"></div>
            <div className="w-6 h-10 bg-yellow-500 rounded-b-xl mx-auto -mt-2 shadow-lg border border-yellow-700/30"></div>
        </div>
      </div>

      {/* Right Curtain */}
      <div 
        className={`relative w-1/2 h-full bg-[#800] transition-transform duration-[2200ms] ease-[cubic-bezier(0.645,0.045,0.355,1)] origin-right flex shadow-[-20px_0_50px_rgba(0,0,0,0.8)] z-20 ${isOpen ? 'translate-x-[110%] skew-x-[2deg]' : 'translate-x-0'}`}
        style={{ 
            backgroundImage: 'repeating-linear-gradient(90deg, #600 0px, #800 40px, #a00 80px, #800 120px, #600 160px)',
            backgroundSize: '20% 100%' 
        }}
      >
        <div className="absolute inset-0 flex">{renderPleats(12)}</div>
        {/* Gold Trim Edge */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-yellow-700 via-yellow-400 to-yellow-800 shadow-[0_0_15px_rgba(234,179,8,0.5)]"></div>
        {/* Tassel cord detail */}
        <div className={`absolute top-1/4 -left-4 w-8 h-32 transition-all duration-1000 delay-300 ${isOpen ? 'opacity-0 scale-50' : 'opacity-100'}`}>
            <div className="w-1 h-full bg-yellow-600 mx-auto rounded-full"></div>
            <div className="w-6 h-10 bg-yellow-500 rounded-b-xl mx-auto -mt-2 shadow-lg border border-yellow-700/30"></div>
        </div>
      </div>

      {/* Top Valance (The decorative top piece) */}
      <div 
        className={`absolute top-0 left-0 right-0 h-40 bg-[#700] z-30 transition-transform duration-[1800ms] ease-in-out border-b-4 border-yellow-500 shadow-2xl flex items-end justify-center pb-6 ${isOpen ? '-translate-y-full' : 'translate-y-0'}`}
        style={{ 
            backgroundImage: 'linear-gradient(180deg, #500 0%, #700 80%, #900 100%)',
            clipPath: 'polygon(0 0, 100% 0, 100% 85%, 95% 100%, 90% 85%, 85% 100%, 80% 85%, 75% 100%, 70% 85%, 65% 100%, 60% 85%, 55% 100%, 50% 85%, 45% 100%, 40% 85%, 35% 100%, 30% 85%, 25% 100%, 20% 85%, 15% 100%, 10% 85%, 5% 100%, 0 85%)'
        }}
      >
          <div className="flex flex-col items-center gap-1 opacity-50">
             <div className="w-16 h-1 bg-yellow-500 rounded-full"></div>
             <span className="text-[10px] font-black text-yellow-500/80 uppercase tracking-[0.5em]">Gala Tracking System</span>
          </div>
      </div>

      {/* Center Opening Flare */}
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200vw] h-[200vh] bg-radial-gradient from-white/20 to-transparent transition-opacity duration-1000 z-10 ${isOpen ? 'opacity-0' : 'opacity-100'}`}></div>

      <style>{`
        @keyframes sway {
            0%, 100% { transform: rotate(-1deg); }
            50% { transform: rotate(1deg); }
        }
      `}</style>
    </div>
  );
};

export default StageCurtain;
