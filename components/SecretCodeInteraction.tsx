import React, { useState } from 'react';

const CORRECT_ANSWER = '一百八一杯';
const MAX_ATTEMPTS = 3;

/** 接头暗号：用户输入下一句，正确显示"暗号正确"，错误则震动并提示剩余次数，三次后展示正确答案 */
export default function SecretCodeInteraction() {
  const [input, setInput] = useState('');
  const [success, setSuccess] = useState(false);
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [showFinalAnswer, setShowFinalAnswer] = useState(false);
  const [message, setMessage] = useState('');
  const [shaking, setShaking] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;

    if (trimmed === CORRECT_ANSWER) {
      setSuccess(true);
      setMessage('');
      return;
    }

    // 输入错误
    setShaking(true);
    window.dispatchEvent(new CustomEvent('chapter3-shake'));
    setTimeout(() => setShaking(false), 600);

    const nextLeft = attemptsLeft - 1;
    setAttemptsLeft(nextLeft);
    setInput('');

    if (nextLeft > 0) {
      setMessage(`暗号错误，还剩 ${nextLeft} 次机会`);
    } else {
      setMessage('');
      setShowFinalAnswer(true);
    }
  };

  // 答对了：显示金色答案 + 暗号正确
  if (success) {
    return (
      <div className="mt-8">
        <div className="animate-golden-reveal">
          <div className="inline-block px-10 py-6 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 text-black font-black text-3xl md:text-4xl tracking-widest shadow-[0_0_40px_rgba(234,179,8,0.5)] border-2 border-amber-300/50">
            {CORRECT_ANSWER}
          </div>
          <p className="text-yellow-400/80 text-sm mt-3 font-medium">✓ 暗号正确</p>
        </div>
      </div>
    );
  }

  // 三次都错：只展示正确答案
  if (showFinalAnswer) {
    return (
      <div className="mt-8">
        <p className="text-red-400/90 text-sm mb-2">三次机会已用尽，正确答案：</p>
        <div className="inline-block px-10 py-6 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-400 to-amber-600 text-black font-black text-3xl md:text-4xl tracking-widest shadow-[0_0_40px_rgba(234,179,8,0.5)] border-2 border-amber-300/50">
          {CORRECT_ANSWER}
        </div>
      </div>
    );
  }

  // 输入区
  return (
    <div className={`mt-8 transition-transform ${shaking ? 'animate-screen-shake' : ''}`}>
      <p className="text-yellow-500/90 text-sm mb-2">宫廷玉液酒，下一句是？</p>
      <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="请输入下一句"
          className="flex-1 min-w-[180px] px-4 py-3 rounded-xl border-2 border-yellow-500/50 bg-black/40 text-white placeholder-white/40 font-medium focus:border-yellow-500 focus:outline-none"
          autoComplete="off"
        />
        <button
          type="submit"
          className="px-6 py-3 rounded-xl border-2 border-yellow-500/60 bg-yellow-500/20 text-yellow-500 font-black hover:bg-yellow-500/30 transition-colors"
        >
          确认
        </button>
      </form>
      {message && (
        <p className="text-red-400/90 text-sm mt-3 font-medium">{message}</p>
      )}
    </div>
  );
}
