
import React, { useEffect, useState } from 'react';

const CursorMagnifier: React.FC = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    const handleMouseDown = () => setActive(true);
    const handleMouseUp = () => setActive(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div 
      className="fixed pointer-events-none z-[9999] transition-transform duration-75 ease-out"
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px`,
        transform: `translate(-25%, -25%) scale(${active ? 1.1 : 1}) rotate(-32deg)`,
        transformOrigin: 'top center'
      }}
    >
      <div className="relative flex flex-col items-center">
        {/* Tiny Glass Lens & Silver Rim */}
        <div className="w-7 h-7 rounded-full border-[2px] border-[#e5e5e5] bg-white/10 backdrop-blur-[0.5px] shadow-[0_2px_8px_rgba(0,0,0,0.5),inset_0_0_4px_rgba(255,255,255,0.4)] relative overflow-hidden z-20">
          {/* Lens Glint */}
          <div className="absolute top-0.5 left-1 w-3 h-1.5 bg-white/30 rounded-full rotate-[-30deg]"></div>
          {/* Glass detail */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10"></div>
        </div>

        {/* Tiny Neck */}
        <div className="w-1 h-1.5 bg-gradient-to-r from-[#888] via-[#f5f5f5] to-[#888] -mt-0.5 z-10"></div>

        {/* Tiny Black Polished Handle */}
        <div className="w-2 h-7 bg-gradient-to-r from-[#000] via-[#333] to-[#000] rounded-b-full shadow-md border-x border-white/10 -mt-0.5">
          <div className="mx-auto mt-0.5 w-[0.5px] h-4 bg-white/20 rounded-full"></div>
        </div>
      </div>
    </div>
  );
};

export default CursorMagnifier;
