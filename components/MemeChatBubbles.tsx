import React, { useState, useEffect } from 'react';

/** 案例一 Step2：小头像 + 对话框，你一句我一句的动态聊天效果，模拟微博网友叽叽喳喳 */

type MessageType = { type: 'text'; content: string } | { type: 'meme'; src: string };

interface ChatMessage {
  id: number;
  side: 'left' | 'right';
  avatar: string; // emoji
  avatarColor: string;
  msg: MessageType;
  delay: number;
}

const DEFAULT_CHAT_IMAGES = ['./assets/image1.jpg', './assets/image2.jpg', './assets/image3.jpg'];

function buildMessages(imageUrls?: string[]): ChatMessage[] {
  const [img1 = DEFAULT_CHAT_IMAGES[0], img2 = DEFAULT_CHAT_IMAGES[1], img3 = DEFAULT_CHAT_IMAGES[2]] = imageUrls ?? [];
  return [
    { id: 1, side: 'left', avatar: '🌙', avatarColor: 'bg-amber-400/90', msg: { type: 'text', content: '哈哈哈哈扶不扶绝了！' }, delay: 0 },
    { id: 2, side: 'right', avatar: '⭐', avatarColor: 'bg-pink-400/90', msg: { type: 'meme', src: img1 }, delay: 0.4 },
    { id: 3, side: 'left', avatar: '🌙', avatarColor: 'bg-amber-400/90', msg: { type: 'text', content: '这表情我收了😂' }, delay: 0.9 },
    { id: 4, side: 'right', avatar: '⭐', avatarColor: 'bg-pink-400/90', msg: { type: 'text', content: '长在笑点上的男人' }, delay: 1.3 },
    { id: 5, side: 'left', avatar: '🌙', avatarColor: 'bg-amber-400/90', msg: { type: 'meme', src: img2 }, delay: 1.7 },
    { id: 6, side: 'right', avatar: '⭐', avatarColor: 'bg-pink-400/90', msg: { type: 'text', content: '截图当表情包了📸' }, delay: 2.2 },
    { id: 7, side: 'left', avatar: '🌙', avatarColor: 'bg-amber-400/90', msg: { type: 'meme', src: img3 }, delay: 2.7 },
    { id: 8, side: 'right', avatar: '⭐', avatarColor: 'bg-pink-400/90', msg: { type: 'text', content: '互联网沸腾了🔥' }, delay: 3.2 }
  ];
}

export interface MemeChatBubblesProps {
  visible: boolean;
  /** 案例一 Step2 的三张图，顺序对应聊天里出现的第 1、2、3 张。不传则用默认图。 */
  imageUrls?: string[];
}

function MemeChatBubbles({ visible, imageUrls }: MemeChatBubblesProps) {
  const MESSAGES = React.useMemo(() => buildMessages(imageUrls), [imageUrls]);
  const [shownIds, setShownIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (!visible) {
      setShownIds(new Set());
      return;
    }
    const timers: number[] = [];
    MESSAGES.forEach((m) => {
      const t = window.setTimeout(() => {
        setShownIds((prev) => new Set([...prev, m.id]));
      }, m.delay * 1000);
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
  }, [visible, MESSAGES]);

  return (
    <div className="relative w-full max-w-md min-h-[420px] rounded-2xl overflow-hidden border-2 border-white/20 bg-gradient-to-b from-slate-900/95 to-slate-950/98 shadow-2xl">
      {/* 顶部拟态：微博/聊天头部 */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/20">
        <div className="w-2 h-2 rounded-full bg-red-500/80" />
        <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
        <div className="w-2 h-2 rounded-full bg-green-500/80" />
        <span className="ml-2 text-[10px] font-bold text-white/50 uppercase tracking-widest">
          网友热议 · 2014
        </span>
      </div>

      {/* 聊天区域 */}
      <div className="px-4 py-6 space-y-4 overflow-hidden">
        {MESSAGES.map((m) => {
          const isShown = shownIds.has(m.id);
          const isLeft = m.side === 'left';

          return (
            <div
              key={m.id}
              className={`flex items-end gap-2 ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}
              style={{
                opacity: isShown ? 1 : 0,
                transform: isShown ? 'none' : 'translateY(8px) scale(0.9)',
                transition: 'opacity 0.35s ease, transform 0.35s ease'
              }}
            >
              {/* 小头像 */}
              <div
                className={`flex-shrink-0 w-9 h-9 rounded-full ${m.avatarColor} flex items-center justify-center text-lg shadow-lg ring-2 ring-white/20`}
              >
                {m.avatar}
              </div>

              {/* 气泡 */}
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 shadow-lg ${
                  isLeft
                    ? 'rounded-bl-md bg-green-600/80 text-white'
                    : 'rounded-br-md bg-slate-700/90 text-white'
                } ${isShown ? 'animate-chat-bubble-in' : ''}`}
                style={{
                  animationDelay: isShown ? '0s' : undefined,
                  animationFillMode: 'both'
                }}
              >
                {m.msg.type === 'text' ? (
                  <p className="text-sm leading-relaxed">{m.msg.content}</p>
                ) : (
                  <div className="relative">
                    <img
                      src={m.msg.src}
                      alt=""
                      className="w-24 h-24 md:w-28 md:h-28 rounded-lg object-cover border border-white/20 opacity-90 contrast-75"
                    />
                    {/* 低清截图质感 */}
                    <div className="absolute inset-0 rounded-lg bg-white/5 mix-blend-overlay" />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 底部可爱装饰 */}
      <div className="absolute bottom-2 right-4 flex gap-1 opacity-50">
        <span className="text-xs">💬</span>
        <span className="text-xs">📱</span>
      </div>
    </div>
  );
}

export default MemeChatBubbles;
