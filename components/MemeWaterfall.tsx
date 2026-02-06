import React, { useMemo } from 'react';

/** 沈腾表情包/微信气泡瀑布：模拟源源不断掉落的视觉效果 */
const MEME_IMAGES = ['./assets/image1.jpg', './assets/image2.jpg', './assets/image3.jpg', './assets/image4.jpg'];

const BUBBLE_TEXTS = ['不想上班', '你过来啊', '尴尬', '无奈', '无语', '瘫', '冷笑', '凡尔赛'];

interface MemeWaterfallProps {
  className?: string;
}

const MemeWaterfall: React.FC<MemeWaterfallProps> = ({ className = '' }) => {
  const items = useMemo(() => {
    const list: { type: 'image' | 'bubble'; content: string; delay: number; x: number; duration: number }[] = [];
    for (let i = 0; i < 24; i++) {
      if (i % 3 === 0) {
        list.push({
          type: 'image',
          content: MEME_IMAGES[i % MEME_IMAGES.length],
          delay: i * 0.8 + Math.random() * 2,
          x: 5 + (i % 5) * 22,
          duration: 12 + Math.random() * 6
        });
      } else {
        list.push({
          type: 'bubble',
          content: BUBBLE_TEXTS[i % BUBBLE_TEXTS.length],
          delay: i * 0.6 + Math.random() * 1.5,
          x: 8 + (i % 6) * 15,
          duration: 10 + Math.random() * 5
        });
      }
    }
    return list;
  }, []);

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* 半透明暗色遮罩，保证前景文字可读 */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 z-10" />
      {items.map((item, i) => (
        <div
          key={i}
          className="absolute animate-meme-fall"
          style={{
            left: `${item.x}%`,
            top: '-10%',
            animationDelay: `${item.delay}s`,
            animationDuration: `${item.duration}s`
          }}
        >
          {item.type === 'image' ? (
            <div className="w-16 h-16 md:w-24 md:h-24 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-black/50">
              <img src={item.content} alt="" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="px-4 py-2 rounded-2xl bg-green-600/90 text-white text-xs font-bold shadow-lg max-w-[80px] text-center border border-green-500/50">
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default MemeWaterfall;
