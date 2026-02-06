import React from 'react';

/** 案例一 Step4：大图 + 浅色 + 飘彩色弹幕，充满整个屏幕 */

const DANMAKU_BASE = [
  '长在笑点上的男人', '看到他就想笑', '沈腾yyds', '笑不活了', '绝了绝了',
  '哈哈哈哈哈哈', '我DNA动了', '年度最佳', '承包我一年笑点', '笑死',
  '太有梗了', '表情包大户', '这谁顶得住', '沈腾绝了', '笑到肚子疼',
  '我的快乐源泉', '笑不活了家人们', '经典永流传', '笑死我了', '绝绝子',
  '哈哈哈哈', '笑到裂开', '我的天', '太搞笑了', '绝了', 'yyds',
  '笑死', '绝了', 'DNA动了', '人间清醒', '虽丧尤爱', '表情包自由',
  '长在笑点上', '看到就想笑', '沈腾', '笑不活', '绝绝子', '哈哈哈'
];

/** 扩充到 120+ 条，充满整屏 */
const DANMAKU_TEXTS = Array.from({ length: 128 }, (_, i) => DANMAKU_BASE[i % DANMAKU_BASE.length]);

const COLORS = [
  '#ff6b6b', '#ffd93d', '#6bcb77', '#4d96ff', '#ff85a2',
  '#a78bfa', '#22d3ee', '#fbbf24', '#f472b6', '#34d399',
  '#fb923c', '#a3e635', '#38bdf8', '#c084fc', '#f87171'
];

interface MemeDanmakuImageProps {
  imageUrl: string;
  visible: boolean;
}

const ROW_COUNT = 24;

function MemeDanmakuImage({ imageUrl, visible }: MemeDanmakuImageProps) {
  const danmakuList = DANMAKU_TEXTS.map((text, i) => {
    const color = COLORS[i % COLORS.length];
    const row = i % ROW_COUNT;
    const topPct = 2 + (row / ROW_COUNT) * 96;
    return (
      <div
        key={i}
        className="absolute animate-danmaku whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold shadow-lg border border-white/25"
        style={{
          top: `${topPct}%`,
          left: '100%',
          color: '#fff',
          backgroundColor: color,
          boxShadow: `0 0 8px ${color}90`,
          animationDuration: `${6 + (i % 10) * 1.2}s`,
          animationDelay: `-${(i * 0.35) % 18}s`,
          opacity: visible ? 0.92 : 0
        }}
      >
        {text}
      </div>
    );
  });

  return (
    <div className="relative w-full max-w-3xl xl:max-w-4xl mx-auto">
      {/* 平板外框：圆角 + 边框 + 顶部摄像头，区域更大 */}
      <div className="relative rounded-[2rem] md:rounded-[2.5rem] p-3 md:p-5 bg-slate-800/90 shadow-2xl border-2 border-slate-600/50">
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-slate-700 border border-slate-600 z-10" />
        <div className="relative rounded-[1.25rem] md:rounded-[1.5rem] overflow-hidden aspect-[4/3] min-h-[340px] md:min-h-[420px] xl:min-h-[480px] bg-black">
          <img
            src={imageUrl}
            alt=""
            className={`w-full h-full object-cover transition-opacity duration-700 ${
              visible ? 'opacity-90 brightness-110' : 'opacity-60'
            }`}
          />
          <div className="absolute inset-0 bg-black/15" />
          {/* 弹幕层：允许完整划过，上方多行 */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {danmakuList}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemeDanmakuImage;
