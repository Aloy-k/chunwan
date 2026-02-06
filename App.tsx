
import React, { useState, useEffect} from 'react';
import { AppState, SubTab } from './types';
import { VIDEOS, loadTrendData, INITIAL_TREND_DATA } from './constants';
import chunwanBg from './assets/chunwan-bg.png';
import FilmstripBackground from './components/FilmstripBackground';
import CursorMagnifier from './components/CursorMagnifier';
import StageCurtain from './components/StageCurtain';
import OldTVPlayer from './components/OldTVPlayer';
import HumorEvolutionGrid from './components/HumorEvolutionGrid';
import HumorEvolutionScroll from './components/HumorEvolutionScroll';
import BigDipperConstellation from './components/BigDipperConstellation';
import InheritanceNetwork from './components/InheritanceNetwork';
import MemeTrendStream from './components/MemeTrendStream';
import ChapterThreeStorylines from './components/ChapterThreeStorylines';
import { ArrowDown, Tv, BarChart3, Radio, Sparkles, Network, ArrowRight, ArrowLeft, Activity, Share2, RotateCcw } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.HOME);
  const [activeTab, setActiveTab] = useState<SubTab>('ORIGINS');

  const handleToHome = () => setState(AppState.TRANSITION_TO_HOME);
  const handleToChapterOne = () => setState(AppState.TRANSITION_TO_CH1);
  const handleToChapterTwo = () => setState(AppState.TRANSITION_TO_CH2);
  const handleToChapterThree = () => setState(AppState.TRANSITION_TO_CH3);
  const [trends, setTrends] = useState(INITIAL_TREND_DATA);
  const [screenShake, setScreenShake] = useState(false);

  useEffect(() => {
    loadTrendData().then((finalData) => {
      setTrends(finalData);
    });
  }, []);

  useEffect(() => {
    const onShake = () => {
      setScreenShake(true);
      setTimeout(() => setScreenShake(false), 500);
    };
    window.addEventListener('chapter3-shake', onShake);
    return () => window.removeEventListener('chapter3-shake', onShake);
  }, []);

  

  const handleCurtainOpened = () => {
    switch(state) {
      case AppState.TRANSITION_TO_HOME:
        setState(AppState.HOME);
        break;
      case AppState.TRANSITION_TO_CH1:
        setState(AppState.CHAPTER_ONE);
        setActiveTab('ORIGINS');
        break;
      case AppState.TRANSITION_TO_CH2:
        setState(AppState.CHAPTER_TWO);
        setActiveTab('CONSTELLATION');
        break;
      case AppState.TRANSITION_TO_CH3:
        setState(AppState.CHAPTER_THREE);
        setActiveTab('TRENDS');
        break;
    }
  };

  const isTransitioning = [
    AppState.TRANSITION_TO_HOME,
    AppState.TRANSITION_TO_CH1, 
    AppState.TRANSITION_TO_CH2, 
    AppState.TRANSITION_TO_CH3
  ].includes(state);

  return (
    <div className="relative min-h-screen cursor-none select-none overflow-x-hidden">
      <CursorMagnifier />

      {state === AppState.HOME && (
        <div className="relative h-screen flex flex-col items-center justify-center overflow-hidden transition-opacity duration-1000 bg-[#a00]" onClick={handleToChapterOne}>
          <FilmstripBackground />
          <div className="z-10 text-center space-y-8 p-4 py-14 px-20">
            <div className="inline-block px-4 py-1.5 bg-yellow-500 text-red-950 text-[10px] font-black tracking-[0.6em] mb-4 uppercase rounded-full shadow-lg">
              Spring Festival Gala Humor Tracker
            </div>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter drop-shadow-2xl text-yellow-300">
              救命！这个好好笑
            </h1>
            <p className="text-3xl md:text-4xl font-black text-white tracking-[0.3em]">
              春晚笑点追综仪
            </p>
            <p className="text-xl text-yellow-100/90 font-medium tracking-widest max-w-2xl mx-auto italic font-cursive">
              追踪笑点的诞生、演化与社会回响
            </p>
            <div className="pt-12 animate-bounce">
              <div className="flex flex-col items-center gap-2">
                <span className="text-[10px] uppercase tracking-[0.4em] text-yellow-200/80 font-bold">点击开启追踪</span>
                <ArrowDown className="text-yellow-400" size={20} />
              </div>
            </div>
          </div>
        </div>
      )}

      {isTransitioning && (
        <StageCurtain key={state} onOpened={handleCurtainOpened} />
      )}

      {state === AppState.CHAPTER_ONE && (
        <div className="relative min-h-screen animate-in fade-in duration-1000">
          <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${chunwanBg})` }} aria-hidden />
          <div className="fixed inset-0 z-0 bg-black/42" aria-hidden />
          <header className="fixed top-0 left-0 right-0 z-50 bg-[#700]/95 backdrop-blur-2xl border-b border-yellow-500/20 py-5 px-10 flex justify-between items-center shadow-xl">
            <div className="flex items-center gap-6">
                <button onClick={handleToHome} className="p-2 hover:bg-yellow-500/20 rounded-lg transition-colors group" title="回溯首页">
                  <RotateCcw className="text-yellow-500 group-hover:rotate-[-45deg] transition-transform" size={20} />
                </button>
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-yellow-500 rounded-xl shadow-lg shadow-yellow-500/20"><Tv className="text-red-950" size={22} /></div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-white">第一篇章：笑点的“内源机制”</h2>
                        <p className="text-[10px] text-yellow-400/70 uppercase tracking-[0.3em] font-black">CHAPTER 01: THREE MODALITIES OF HUMOR</p>
                    </div>
                </div>
            </div>
            <div className="hidden md:flex gap-10 text-[11px] font-black tracking-[0.2em] uppercase">
                <button onClick={() => setActiveTab('ORIGINS')} className={`flex items-center gap-2 pb-1 transition-all ${activeTab === 'ORIGINS' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-white/40 hover:text-white'}`}><Radio size={14} /> 内源机制</button>
                <button onClick={() => setActiveTab('EVOLUTION')} className={`flex items-center gap-2 pb-1 transition-all ${activeTab === 'EVOLUTION' ? 'text-yellow-400 border-b-2 border-yellow-400' : 'text-white/40 hover:text-white'}`}><BarChart3 size={14} /> 笑点演变</button>
            </div>
          </header>

          <main className="relative z-10 container mx-auto pt-24 pb-24 px-6 min-h-screen">
            {activeTab === 'ORIGINS' ? (
              <div className="animate-in fade-in duration-700">
                <div className="max-w-4xl mx-auto mb-24 text-center space-y-8">
                    <p className="text-3xl leading-relaxed text-yellow-50/90 font-cursive">
                      幽默的三副面孔：从小品的生活解构，到相声的语言艺术，再到魔术的意外惊喜。
                    </p>
                    <div className="flex justify-center gap-12 text-[10px] font-black text-yellow-500/50 uppercase tracking-[0.3em]">
                       <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500"></div> 小品 SKIT</span>
                       <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div> 相声 CROSS-TALK</span>
                       <span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> 魔术 MAGIC</span>
                    </div>
                </div>
                
                {/* 核心展示区：三个电视机 */}
                <div className="flex flex-col gap-56">
                  {VIDEOS.map((video, idx) => (
                    <div key={video.id} className="relative">
                      {/* 类别装饰背板 */}
                      <div className="absolute -top-12 -left-12 opacity-5 select-none pointer-events-none">
                         <span className="text-[15rem] font-black italic text-white uppercase leading-none">
                           0{idx + 1}
                         </span>
                      </div>
                      <div className="absolute top-0 right-0 p-4 bg-yellow-500 text-red-950 font-black text-xs rounded-bl-3xl shadow-xl z-50">
                        {video.type} CATEGORY
                      </div>
                      <OldTVPlayer data={video} />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="animate-in fade-in duration-700 relative">
                <HumorEvolutionScroll />
                <div className="mt-40 flex flex-col md:flex-row items-center justify-center gap-8">
                   <button onClick={handleToHome} className="group relative inline-flex items-center gap-4 px-12 py-6 border-2 border-yellow-500/30 text-yellow-500 rounded-2xl font-black text-xl hover:bg-yellow-500 hover:text-red-950 transition-all">
                     <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
                     <span>回溯首页</span>
                   </button>
                   <button onClick={handleToChapterTwo} className="group relative inline-flex items-center gap-4 px-12 py-6 bg-yellow-500 text-red-950 rounded-2xl font-black text-xl shadow-[0_20px_40px_rgba(234,179,8,0.3)] hover:scale-105 active:scale-95 transition-all">
                     <span>开启追踪第二篇章：笑点的“推手”</span>
                     <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                   </button>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {state === AppState.CHAPTER_TWO && (
        <div className="relative min-h-screen animate-in fade-in duration-1000">
          <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${chunwanBg})` }} aria-hidden />
          <div className="fixed inset-0 z-0 bg-black/62" aria-hidden />
          <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-2xl border-b border-white/5 py-5 px-10 flex justify-between items-center shadow-2xl">
            <div className="flex items-center gap-6">
                <button onClick={handleToChapterOne} className="p-2 hover:bg-red-700/20 rounded-lg transition-colors group" title="回溯第一篇章">
                  <RotateCcw className="text-red-600 group-hover:rotate-[-45deg] transition-transform" size={20} />
                </button>
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-red-700 rounded-xl shadow-lg shadow-red-700/20"><Sparkles className="text-white" size={22} /></div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-white">{activeTab === 'CONSTELLATION' ? '第二篇章：人物篇 · 北斗七星' : '第二篇章：人物篇 · 传承网'}</h2>
                        <p className="text-[10px] text-red-500 uppercase tracking-[0.3em] font-black">CHAPTER 02: SHAPERS OF HUMOR</p>
                    </div>
                </div>
            </div>
            <div className="hidden md:flex gap-10 text-[11px] font-black tracking-[0.2em] uppercase">
                <button onClick={() => setActiveTab('CONSTELLATION')} className={`flex items-center gap-2 pb-1 transition-all ${activeTab === 'CONSTELLATION' ? 'text-red-500 border-b-2 border-red-500' : 'text-white/40 hover:text-white'}`}><Sparkles size={14} /> 北斗七星</button>
                <button onClick={() => setActiveTab('NETWORK')} className={`flex items-center gap-2 pb-1 transition-all ${activeTab === 'NETWORK' ? 'text-red-500 border-b-2 border-red-500' : 'text-white/40 hover:text-white'}`}><Network size={14} /> 传承网脉</button>
            </div>
          </header>

          <main className="relative z-10 container mx-auto pt-24 pb-24 px-6 min-h-screen">
            <div className="max-w-3xl mx-auto mb-20 text-center space-y-6">
                <h2 className="text-5xl font-black text-white italic tracking-tighter">幽默的火炬，在星辰间传递。</h2>
                <p className="text-xl text-white/60 font-medium">寻找那些编织快乐的人，探寻他们如何塑造一个时代的集体记忆。</p>
            </div>
            {activeTab === 'CONSTELLATION' ? (
              <div className="flex flex-col gap-20">
                <BigDipperConstellation />
                <div className="flex justify-center gap-8">
                  <button onClick={handleToChapterOne} className="group relative inline-flex items-center gap-4 px-12 py-6 border-2 border-red-900/30 text-red-500 rounded-2xl font-black text-xl hover:bg-red-700 hover:text-white transition-all">
                    <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
                    <span>回溯第一篇章</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-20">
                <InheritanceNetwork />
                <div className="text-center pb-20 flex flex-col md:flex-row items-center justify-center gap-8">
                  <button onClick={handleToChapterOne} className="group relative inline-flex items-center gap-4 px-12 py-6 border-2 border-red-900/30 text-red-500 rounded-2xl font-black text-xl hover:bg-red-700 hover:text-white transition-all">
                    <ArrowLeft size={24} className="group-hover:-translate-x-2 transition-transform" />
                    <span>回溯第一篇章</span>
                  </button>
                  <button onClick={handleToChapterThree} className="group relative inline-flex items-center gap-4 px-12 py-6 bg-red-700 text-white rounded-2xl font-black text-xl shadow-[0_20px_40px_rgba(185,28,28,0.3)] hover:scale-105 active:scale-95 transition-all">
                    <span>开启追踪第三篇章：笑点的“外延”</span>
                    <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      )}

      {state === AppState.CHAPTER_THREE && (
        <div className={`relative min-h-screen animate-in fade-in duration-1000 ${screenShake ? 'animate-screen-shake' : ''}`}>
          <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${chunwanBg})` }} aria-hidden />
          <div className="fixed inset-0 z-0 bg-black/52" aria-hidden />
           <header className="fixed top-0 left-0 right-0 z-50 bg-[#2d0a0a]/90 backdrop-blur-2xl border-b border-red-900/50 py-5 px-10 flex justify-between items-center shadow-2xl">
            <div className="flex items-center gap-6">
                <button onClick={handleToChapterTwo} className="p-2 hover:bg-yellow-600/20 rounded-lg transition-colors group" title="回溯第二篇章">
                  <RotateCcw className="text-yellow-600 group-hover:rotate-[-45deg] transition-transform" size={20} />
                </button>
                <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-yellow-600 rounded-xl shadow-lg shadow-yellow-600/20"><Activity className="text-white" size={22} /></div>
                    <div>
                        <h2 className="text-xl font-black tracking-tight text-white">第三篇章：笑点的“外延”</h2>
                        <p className="text-[10px] text-yellow-500 uppercase tracking-[0.3em] font-black">CHAPTER 03: DIGITAL REVERBERATION</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-4">
               <div className="px-4 py-2 bg-red-950/50 border border-red-800/30 rounded-lg flex items-center gap-2">
                 <Share2 size={14} className="text-yellow-500" />
                 <span className="text-[10px] font-black text-white/60 uppercase">全网多维传播追踪</span>
               </div>
            </div>
          </header>
          <main className="relative z-10 overflow-x-hidden pt-24">
             {/* 开篇引言：统一第三篇章字体层级 */}
             <div className="container mx-auto py-20 md:py-28 px-6 md:px-12">
               <div className="max-w-4xl mx-auto mb-20 md:mb-28 text-center">
                  <div className="inline-flex items-center gap-3 bg-red-900/30 px-5 py-2.5 rounded-full border border-red-800/50 mb-10 ch3-intro-badge text-yellow-500">
                     <span className="w-2 h-2 rounded-full bg-yellow-500 animate-ping" aria-hidden></span>
                     <span>三、 “笑点”的网络传播与社会热点关联</span>
                  </div>
                  <h2 className="ch3-display text-4xl sm:text-5xl md:text-6xl text-white italic mb-14 md:mb-20 leading-snug">当笑声越过屏幕，<br/>在数字海洋泛起涟漪。</h2>
                  <p className="ch3-intro-lead text-base md:text-lg text-white/50 max-w-3xl mx-auto px-4">
                  春晚不仅是一台晚会，它是中国流行文化的“造词机”和“基因库”。在这里，我们解构两个“笑点”案例，看它们如何穿越时间，从电视荧幕走向你的手机屏幕，最终融入我们的生活方式。
                  </p>
                  <div className="ch3-section-divider mt-16 md:mt-20 w-full max-w-md mx-auto" style={{ height: '1px' }} />
               </div>
             </div>

             {/* 沉浸式滚动叙事：固定背景 + 滚动覆盖 */}
             <ChapterThreeStorylines trends={trends} />

             {/* 衔接：从故事线到数据区块的视觉过渡 */}
             <div className="ch3-section-bridge h-24 md:h-32 relative z-10" aria-hidden />

             {/* 传播数据可视化区块 */}
             <div className="container mx-auto py-20 md:py-28 px-6 md:px-12 relative z-10">
               <div className="max-w-4xl mx-auto mb-14 md:mb-20 text-center">
                 <span className="ch3-step-label text-yellow-500/80">传播数据追踪</span>
                 <h3 className="ch3-title text-2xl md:text-3xl text-white mt-3">全网互动与博文量</h3>
               </div>
               <div className="space-y-32">
                 {trends
                   .filter((trend) => trend.id !== 'haojian-shenteng')
                   .map((trend) => (
                     <MemeTrendStream key={trend.id} data={trend} />
                   ))}
               </div>
             </div>

             {/* 网络结语：与开篇呼应的收束 */}
             <div className="container mx-auto px-6 md:px-12 pb-20 md:pb-28 relative z-10">
               <div className="ch3-section-divider mb-20 md:mb-24 w-full max-w-sm mx-auto" style={{ height: '1px' }} />
               <div className="mt-0 p-10 md:p-16 bg-red-950/15 rounded-[2.5rem] md:rounded-[3rem] border border-red-900/25 text-center flex flex-col items-center gap-8 md:gap-10">
                 <p className="ch3-lead text-white/65 max-w-2xl mx-auto text-lg md:text-xl">
                   春晚也许会老去，但文化记忆永远年轻。
                 </p>
                 <p className="ch3-body text-white/50 max-w-2xl mx-auto text-base md:text-lg">
                   无论是沈腾的表情包，还是赵丽蓉的Rap，它们都已融入这片土地的日常，成为了我们交流的语言，确认彼此的信物。这，就是流行文化的中国故事。
                 </p>
                 <button onClick={handleToChapterTwo} className="group mt-2 inline-flex items-center gap-3 px-10 py-5 border-2 border-yellow-600/40 text-yellow-500 rounded-2xl ch3-font-sans font-bold text-lg hover:bg-yellow-600 hover:text-white hover:border-yellow-500 transition-all duration-300">
                   <ArrowLeft size={22} className="group-hover:-translate-x-1 transition-transform" />
                   <span>回溯第二篇章：笑点的"推手"</span>
                 </button>
                 <div className="relative flex justify-center mt-6 group/source">
                   <span
                     className="inline-flex w-5 h-5 items-center justify-center rounded-full bg-amber-500/25 text-amber-400 text-xs font-bold cursor-help border border-amber-500/40 hover:bg-amber-500/35"
                     title="数据来源"
                     aria-label="查看数据来源"
                   >
                     !
                   </span>
                   <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-[90vw] max-w-md px-4 py-3 rounded-xl bg-black/95 text-white text-xs leading-relaxed border border-amber-500/30 shadow-xl opacity-0 pointer-events-none group-hover/source:opacity-100 transition-opacity duration-200 z-20 whitespace-pre-line text-left">
                     {`本项目参考数据来源为：
1.微博平台的转发，评论，点赞量数据
2.学术参考文献：近十年春晚相声小品的多模态话语研究（知网）
[1]谢冰.央视春晚小品中幽默机制的聚类分析[J].宿州学院学报,2018,33(11):67-71.
[2]魏亚娥.幽默的产生与逻辑规律的违反——以沈腾春晚小品为例[J].今古文创,2022,(02):95-97.
[3]赵澜霖.从语用学角度看幽默形成机制——以岳云鹏相声为例[J].今古文创,2022,(24):90-92.
[4]谢旭慧,牟玉华.构造喜剧小品语言幽默的语音手段[J].戏剧文学,2008,(05):61-64.DOI:10.14043/j.cnki.xjwx.2008.05.009.
[5]方成.幽默定义[J].武汉大学学报(人文科学版),2003,(06):732-736.`}
                   </div>
                 </div>
               </div>
             </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
