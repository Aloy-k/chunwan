import React from 'react';

/** 案例一 Step3：滚动到该区域时，表情包图片滑下露出，极密交错，可与文字紧紧相连 */
const MEME_IMAGES = [
  './assets/image1.jpg', './assets/image2.jpg', './assets/image3.jpg', './assets/image4.jpg', './assets/image5.jpg',
  './assets/image1.jpg', './assets/image2.jpg', './assets/image3.jpg', './assets/image4.jpg', './assets/image5.jpg',
  './assets/image1.jpg', './assets/image2.jpg', './assets/image3.jpg', './assets/image4.jpg', './assets/image5.jpg',
  './assets/image1.jpg', './assets/image2.jpg', './assets/image3.jpg', './assets/image4.jpg', './assets/image5.jpg',
  './assets/image1.jpg', './assets/image2.jpg', './assets/image3.jpg', './assets/image4.jpg', './assets/image5.jpg',
  './assets/image1.jpg', './assets/image2.jpg', './assets/image3.jpg', './assets/image4.jpg', './assets/image5.jpg',
  './assets/image1.jpg', './assets/image2.jpg', './assets/image3.jpg', './assets/image4.jpg', './assets/image5.jpg'
];

/** 极密交错布局：占满区域并延伸至文字侧，z-index 交错遮挡 */
const positions = [
  { t: 0, l: 0, w: 18, h: 18, z: 1, rotate: -4, delay: 0 },
  { t: 4, l: 15, w: 16, h: 16, z: 4, rotate: 6, delay: 0.03 },
  { t: 2, l: 32, w: 20, h: 20, z: 2, rotate: -3, delay: 0.06 },
  { t: 12, l: 2, w: 14, h: 14, z: 5, rotate: 8, delay: 0.04 },
  { t: 10, l: 22, w: 22, h: 22, z: 1, rotate: -6, delay: 0.09 },
  { t: 6, l: 48, w: 18, h: 18, z: 6, rotate: 4, delay: 0.12 },
  { t: 20, l: 38, w: 16, h: 16, z: 3, rotate: 5, delay: 0.08 },
  { t: 28, l: 0, w: 20, h: 20, z: 2, rotate: -7, delay: 0.11 },
  { t: 24, l: 18, w: 14, h: 14, z: 7, rotate: 2, delay: 0.15 },
  { t: 18, l: 55, w: 18, h: 18, z: 4, rotate: -5, delay: 0.18 },
  { t: 36, l: 8, w: 16, h: 16, z: 5, rotate: 7, delay: 0.14 },
  { t: 34, l: 28, w: 22, h: 22, z: 1, rotate: -4, delay: 0.2 },
  { t: 42, l: 50, w: 14, h: 14, z: 6, rotate: 6, delay: 0.17 },
  { t: 48, l: 2, w: 18, h: 18, z: 3, rotate: -3, delay: 0.22 },
  { t: 46, l: 22, w: 16, h: 16, z: 7, rotate: 5, delay: 0.25 },
  { t: 52, l: 42, w: 20, h: 20, z: 2, rotate: -6, delay: 0.28 },
  { t: 60, l: 0, w: 14, h: 14, z: 5, rotate: 4, delay: 0.24 },
  { t: 58, l: 18, w: 18, h: 18, z: 4, rotate: -8, delay: 0.3 },
  { t: 64, l: 38, w: 16, h: 16, z: 6, rotate: 3, delay: 0.32 },
  { t: 70, l: 8, w: 20, h: 20, z: 1, rotate: -5, delay: 0.34 },
  { t: 68, l: 30, w: 14, h: 14, z: 7, rotate: 6, delay: 0.36 },
  { t: 74, l: 52, w: 18, h: 18, z: 3, rotate: -4, delay: 0.38 },
  { t: 82, l: 2, w: 16, h: 16, z: 5, rotate: 5, delay: 0.4 },
  { t: 80, l: 24, w: 14, h: 14, z: 4, rotate: -7, delay: 0.42 },
  { t: 86, l: 46, w: 18, h: 18, z: 6, rotate: 4, delay: 0.44 },
  { t: 90, l: 12, w: 16, h: 16, z: 2, rotate: -3, delay: 0.46 },
  { t: 88, l: 35, w: 14, h: 14, z: 7, rotate: 6, delay: 0.48 },
  { t: 2, l: 65, w: 18, h: 18, z: 4, rotate: -5, delay: 0.05 },
  { t: 14, l: 72, w: 16, h: 16, z: 6, rotate: 3, delay: 0.1 },
  { t: 26, l: 62, w: 20, h: 20, z: 2, rotate: 7, delay: 0.16 },
  { t: 38, l: 70, w: 14, h: 14, z: 5, rotate: -4, delay: 0.22 },
  { t: 50, l: 65, w: 18, h: 18, z: 3, rotate: 5, delay: 0.3 },
  { t: 62, l: 72, w: 16, h: 16, z: 7, rotate: -6, delay: 0.36 },
  { t: 76, l: 68, w: 14, h: 14, z: 4, rotate: 4, delay: 0.42 },
  { t: 8, l: 42, w: 16, h: 16, z: 5, rotate: -5, delay: 0.07 },
  { t: 44, l: 38, w: 18, h: 18, z: 3, rotate: 4, delay: 0.19 },
  { t: 72, l: 58, w: 14, h: 14, z: 6, rotate: -6, delay: 0.4 }
];

interface MemeRevealOnScrollProps {
  visible: boolean;
  /** 案例一 Step3 表情包图库，支持 .jpg / .gif 等，按顺序填充网格；不足 35 张会循环使用，不传则用默认图 */
  imageUrls?: string[];
}

const MemeRevealOnScroll: React.FC<MemeRevealOnScrollProps> = ({ visible, imageUrls }) => {
  const list =
    imageUrls && imageUrls.length > 0
      ? Array.from({ length: positions.length }, (_, i) => imageUrls[i % imageUrls.length])
      : MEME_IMAGES;

  return (
    <div className="relative w-full max-w-3xl md:max-w-4xl min-h-[400px] md:min-h-[480px] overflow-visible -mx-2 md:mx-0 md:-mr-16 lg:-mr-20">
      {list.map((src, i) => {
        const p = positions[i];
        return (
          <div
            key={i}
            className={`absolute rounded-xl overflow-hidden border-2 border-white/25 shadow-xl bg-black/40 transition-opacity ${
              visible ? 'opacity-100 animate-meme-slide-reveal' : 'opacity-0'
            }`}
            style={{
              top: `${p.t}%`,
              left: `${p.l}%`,
              width: `${p.w}%`,
              aspectRatio: '1',
              zIndex: p.z,
              transform: `rotate(${p.rotate}deg)`,
              animationDelay: visible ? `${p.delay}s` : '0s',
              animationFillMode: 'both'
            }}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
          </div>
        );
      })}
    </div>
  );
};

export default MemeRevealOnScroll;
