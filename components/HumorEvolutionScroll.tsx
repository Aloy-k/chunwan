import React, { useEffect, useRef, useState } from 'react';

// 语言包袱阶段示意图
import langImg1 from '../assets/lang1.png';
import langImg2 from '../assets/lang2.png';
import langImg3 from '../assets/lang3.png';
import langImg4 from '../assets/lang4.png';
import langImg5 from '../assets/lang5.png';
import langImg6 from '../assets/lang6.png';

// 夸张试听阶段示意图
import audioImg1 from '../assets/audio1.png';
import audioImg2 from '../assets/audio2.png';
import audioImg3 from '../assets/audio3.png';
import audioImg4 from '../assets/audio4.png';
import audioImg5 from '../assets/audio5.png';

// 人物反差阶段示意图
import contrastImg1 from '../assets/cont1.png';
import contrastImg2 from '../assets/cont2.png';
import contrastImg3 from '../assets/cont3.png';
import contrastImg4 from '../assets/cont4.png';
import contrastImg5 from '../assets/cont5.png';

// 民生吐槽阶段示意图
import socialImg1 from '../assets/social1.png';
import socialImg2 from '../assets/social2.png';
import socialImg3 from '../assets/social3.png';
import socialImg4 from '../assets/social4.png';
import socialImg5 from '../assets/social5.png';
import socialImg6 from '../assets/social6.png';

// 顶部进度条：四大幽默机制，每个下面有 4 个「时间 / 形态阶段」
const CATEGORIES = [
  {
    id: 'language',
    label: '语言包袱',
    steps: [
      { title: '80 年代初：传统文字游戏（谐音 / 对仗）', description: '以经典汉语言文字技巧为核心，通过谐音、对仗、顺口溜制造笑点，语言质朴且朗朗上口，契合当时观众的文化认知的娱乐需求。案例：1983 年相声《说一不二》中 "说一不说二，说二不说一" 的对仗式绕口令，通过重复递进的文字逻辑制造幽默。', image: langImg1 },
      { title: '80 年代末 - 90 年代初：民间俗语改编', description: '提取生活中流传的俗语、歇后语进行艺术加工，保留乡土气息和通俗性，让笑点更具生活共鸣，适合全国不同地域观众理解。案例：1989 年小品《懒汉相亲》中 宋丹丹的台词"俺娘说了：女儿大了要出门，要找找个勤快人"。用到的则是民间俗语。', image: langImg2 },
      { title: '90 年代中 - 2000 年初：方言特色包袱', description: '融入不同地域的方言词汇和表达习惯，通过方言的独特韵律和文化差异制造笑点，同时展现地域文化特色，增强节目亲和力。1999 年小品《昨天今天明天》中赵本山和宋丹丹的东北方言台词带来了诸多笑点，方言韵味让文字包袱更具记忆点。', image: langImg3 },
      { title: '2000-2010 年代：网络热词移植', description: '直接吸纳当年火爆的网络流行语、社会热词，快速贴近年轻观众语境，让笑点具有强烈的时代时效性，引发全民话题传播。2010 年小品《不能让他走》中的台词 "别崇拜哥，哥只是个传说"，"我妈叫我回家吃饭"等，均为当年全民流行语。', image: langImg4 },
      { title: '2010-2020 年代：梗文化融合', description: '将网络梗、段子文化与传统语言包袱结合，笑点更具 "碎片化""互动性"，需结合网络语境理解，精准对接年轻受众的笑点偏好。2019 年小品《占位子》中 "学区房""位置决定成绩" 等梗，均为当年网络热议的内卷式教育话题。', image: langImg5 },
      { title: '2020 年后：短视频热梗适配', description: '吸纳短视频平台的爆款梗、口头禅，笑点更简洁直接、节奏感强，适配短视频传播场景，同时保留春晚的正向价值观导向。2023 年小品《上热搜了》中 "直播带货""给我的直播间涨涨粉" 的融合使用，既贴合网络热梗，又呼应社会热点。', image: langImg6 },
    ],
  },
  {
    id: 'audiovisual',
    label: '夸张试听',
    steps: [
      { title: '80 年代：纯肢体夸张居多', description: '依赖演员的肢体动作放大生活场景，通过夸张的表情、姿态模拟真实情境，道具极简甚至无道具，核心靠表演功底支撑笑点。1983 年小品《吃鸡》中，王景愚通过夸张的肢体动作模拟 "吃鸡卡喉咙" 的场景，无多余道具却极具喜剧效果。', image: audioImg1 },
      { title: '80 年代末 - 90 年代：简易道具配合肢体', description: '加入低成本、生活化的简易道具，通过道具与肢体动作的配合放大夸张效果，道具多为日常用品，观众代入感强。1994 年小品《打扑克》）中，用名片作为 "扑克牌" 进行博弈，通过夸张的出牌动作和表情，强化剧情的荒诞感。', image: audioImg2 },
      { title: '90 年代 - 2000 年代：精致服化道+场景搭建', description: '通过精致的服装道具辅助，结合背景屏，快速构建出真实可感的舞台场景，场景不再仅凭表演和观众想象，小品中融合歌曲舞蹈等多元艺术元素，进一步丰富感官体验。1996年小品《打工奇遇》中，用屏风、桌椅、牌匾等道具，搭配宫廷服饰，再辅以两块背景屏的画面衬托，一举打造出极具烟火气与戏剧感的 "太后大酒楼" 场景，为幽默桥段的展开奠定了扎实的场景基础。', image: audioImg3 },
      { title: '2000-2020 年代：多媒体互动融合，舞台特效加持，全景屏幕', description: '全景屏幕的动态铺陈、舞台特效的精准渲染，搭配升降道具台的灵活调度，让小品场景得以高度真实还原；再辅以舞台灯光的层次化切换、音效与多媒体的深度互动，不仅为观众打造出沉浸式的感官体验，更能助推观众快速代入剧情，深刻理解故事内核与情感表达。2017年小品《大城小爱》，全景屏幕还原高空场景，升降台铺陈室内展示，融合人物的生活故事，尽显人间温情。', image: audioImg4 },
      { title: '2020 年后：科技场景模拟', description: '引入 VR、AR 等技术，或模拟元宇宙、AI 相关的科技场景，通过 "科技赋能" 制造沉浸感和未来感等，贴合观众对科技的认知，紧扣时代发展主题。2025 年小品《借伞》用 3D全息投影技术在舞台上打造了西湖场景，结合戏曲元素，给观众打造了沉浸式体验。', image: audioImg5 },
    ],
  },
  {
    id: 'contrast',
    label: '人物反差',
    steps: [
      { title: '80 年代：城乡身份反差', description: '聚焦 "农民进城""城市人下乡" 的时代场景，通过城乡生活习惯、认知水平的差异制造笑点，反映当时城乡发展的社会背景。案例：1986 年小品《羊肉串》（陈佩斯、朱时茂）中，陈佩斯饰演的农村小贩与朱时茂饰演的城市管理人员，因生活场景差异产生一系列冲突笑点。', image: contrastImg1 },
      { title: '80 年代末 - 90 年代：职业角色反差', description: '围绕不同职业的职责、形象差异设计冲突，比如 "干部与群众""老板与员工"，通过打破职业刻板印象制造笑点，贴合当时的社会职业结构。《如此包装》中老板的 "离谱改编" 被艺人当成 "胡闹"，艺人的 "传统唱腔" 被老板当成 "过时"，用价值观认知偏差制造笑点，同时讽刺过度商业化的乱象。', image: contrastImg2 },
      { title: '2000 年代左右：性格气质反差', description: '弱化社会身份，聚焦人物内在性格的对立，比如 "老实人与精明人""急躁与沉稳"，通过性格碰撞推动剧情，笑点更侧重人物本身。2002 年小品《卖车》中，范伟饰演的 "老实人" 与赵本山饰演的 "精明忽悠者"，性格反差成为核心笑点来源。', image: contrastImg3 },
      { title: '2010-2020 年代：标签化身份反差', description: '用 "女神 vs 女汉子""高富帅 vs 穷屌丝" 等流行标签定义人物，通过标签的强烈对立制造笑点，贴合当时的网络文化和身份认知趋。2015年小品《喜乐街》中，主要通过贾玲的"女汉子"形象和瞿颖的"女神"形象反差制造笑点。', image: contrastImg4 },
      { title: '2020 年后：生活方式反差，代际观念反差', description: '聚焦 "父母与子女""长辈与晚辈" 的观念冲突，围绕 "传统生活 vs 新潮生活" 设计冲突，比如 "线下购物 vs 直播带货""养生党 vs 熬夜党"，贴合当代人多元的生活选择，笑点更具现实代入感。2025年小品《点点关注》中，父亲对直播、短视频等新事物持警惕态度，女儿和奶奶主动拥抱流行文化，保守观念与开放态度的对立是代际笑点的底色。', image: contrastImg5 },
    ],
  },
  {
    id: 'social',
    label: '民生吐槽',
    steps: [
      { title: '80 年代：社会转型的集体性痛点', description: '吐槽当时全民关注的集体性民生痛点，比如物资短缺、物价波动、代际观念等，话题具有广泛的社会共鸣，吐槽风格相对委婉含蓄。1987 年小品《产房门口》中，直接围绕生男生女的话题展开，既吐槽传统生育观念的陋习，又反映当时 "男女平等" 观念逐渐普及的社会变化。', image: socialImg1 },
      { title: '80 年代末 - 90 年代：市场化转型痛点', description: '聚焦改革开放后市场化转型带来的新问题，比如职工下岗、国企改革、下海创业风险，反映社会结构调整期的集体焦虑。1998 年小品《打气儿》中，"工人要为国家想，我不下岗谁下岗" 的台词，既吐槽了下岗潮的压力，反映了这一社会问题，同时传递了积极的心态。', image: socialImg2 },
      { title: '90 年代末 - 2000 年代：基础民生保障问题', description: '关注住房、教育、医疗等基础民生领域的新挑战，比如买房难、子女上学贵，话题更贴近家庭生活，吐槽带有强烈的生活质感。2008 年小品《梦幻家园》中，吐槽了房产质量差、物业不作为的社会痛点，引发广泛民主的共鸣。', image: socialImg3 },
      { title: '2000-2010 年代：中产阶层成长焦虑', description: '聚焦职场竞争、教育内卷、养老压力等中产阶层关注的话题，吐槽更具针对性，贴合社会结构中中产群体扩大的趋势。2007 年小品《送礼》中，通过两位家长为了孩子升学给主任送礼的剧情，展示了中产阶层的教育内卷以及生活焦虑，同时不提倡这种不正之风，抚平大家的焦虑心理。', image: socialImg4 },
      { title: '2010-2020 年代：个体化生活困扰', description: '吐槽更细分的个人化生活问题，比如职场 PUA、育儿内卷、社交压力，话题更精准，贴近年轻人的生活体验。2013 年小品《你摊上事儿了》中，讲述了大厦保安和赵总经理因进门证件引发冲突的故事，反映了农民工欠薪等个体化生活问题，以及双户籍和贪腐等社会问题。', image: socialImg5 },
      { title: '2020 年后：数字时代新矛盾', description: '聚焦互联网、数字技术带来的新民生问题以及社会问题，比如网络诈骗、直播带货乱象、线上办事繁琐，贴合数字时代的生活场景。2024年小品《寒舍不寒》中，融合了"榜一大哥在直播间一掷千金"的素材，将当下热门的直播购物元素融入了表演之中，具有强烈的现实意义。', image: socialImg6 },
    ],
  },
] as const;

const HumorEvolutionScroll: React.FC = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<string>(CATEGORIES[0].id);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const activeCategory = CATEGORIES.find((c) => c.id === activeCategoryId)!;
  const steps = activeCategory.steps;

  useEffect(() => {
    const sections = sectionRefs.current.filter(
      (el): el is HTMLDivElement => el !== null
    );
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0));
        if (visible[0]) {
          const idx = sections.indexOf(visible[0].target as HTMLDivElement);
          if (idx !== -1) setActiveStepIndex(idx);
        }
      },
      { threshold: [0.3, 0.5], rootMargin: '-10% 0px -40% 0px' }
    );
    sections.forEach((sec) => observer.observe(sec));
    return () => observer.disconnect();
  }, [activeCategoryId, steps.length]);

  const handleCategoryChange = (id: string) => {
    setActiveCategoryId(id);
    setActiveStepIndex(0);
    sectionRefs.current = [];
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const visibleImageCount = Math.min(steps.length, activeStepIndex + 1);

  return (
    <div className="relative max-w-6xl mx-auto">
      <div className="fixed top-24 left-0 right-0 z-30">
        <div className="max-w-6xl mx-auto bg-[#800]/85 backdrop-blur-xl border border-yellow-500/15 rounded-2xl px-8 py-4 shadow-[0_18px_40px_rgba(0,0,0,0.6)]">
          <div className="flex items-center justify-between gap-4">
            {CATEGORIES.map((cat) => {
              const isActive = cat.id === activeCategoryId;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.id)}
                  className={`flex-1 group flex flex-col items-center gap-2 text-[11px] font-black tracking-[0.2em] uppercase transition-all ${
                    isActive ? 'text-yellow-300' : 'text-white/30 hover:text-white/80'
                  }`}
                >
                  <div className="w-full h-1 rounded-full overflow-hidden bg-black/40">
                    <div
                      className={`h-full rounded-full transition-all ${
                        isActive ? 'bg-yellow-300' : 'bg-white/10 group-hover:bg-white/30'
                      }`}
                      style={{ width: '100%' }}
                    />
                  </div>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="h-32" />

      <div className="space-y-40">
        {steps.map((step, index) => {
          const isActive = index === activeStepIndex;
          return (
            <section
              key={step.title}
              ref={(el) => { sectionRefs.current[index] = el as HTMLDivElement | null; }}
              className={`min-h-[80vh] flex items-center justify-center transition-all duration-700 ${
                isActive
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-25 scale-95 translate-y-6'
              }`}
            >
              <div className="relative w-full max-w-3xl mx-auto bg-[#300]/80 border border-yellow-500/20 rounded-3xl px-10 py-12 shadow-[0_24px_80px_rgba(0,0,0,0.6)]">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-yellow-500/10 via-transparent to-red-500/10 pointer-events-none" />
                <div className="relative space-y-6 text-center">
                  <div className="inline-flex items-center gap-3 px-4 py-1 rounded-full bg-black/40 border border-yellow-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
                    <span className="text-[10px] font-black tracking-[0.3em] text-yellow-200/70">
                      {activeCategory.label.toUpperCase()} · STEP 0{index + 1}
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-yellow-50 tracking-tight leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-yellow-100/80 leading-relaxed text-left md:text-justify">
                    {step.description}
                  </p>
                </div>
              </div>
            </section>
          );
        })}
      </div>

      <div className="pointer-events-none">
        <div className="fixed bottom-24 left-0 right-0 z-30">
          <div className="max-w-6xl mx-auto flex justify-center gap-6 px-6">
            {steps.map((step, idx) => {
              const isVisible = idx < visibleImageCount;
              return (
                <div
                  key={idx}
                  className="w-44 h-32 md:w-64 md:h-40 rounded-3xl overflow-hidden border border-yellow-500/40 bg-black/70 shadow-[0_18px_45px_rgba(0,0,0,0.8)] transform origin-bottom transition-all duration-500"
                  style={{
                    opacity: isVisible ? 0.35 + (idx + 1) / (steps.length + 1) : 0,
                    translate: `0 ${isVisible && idx === visibleImageCount - 1 ? '-6px' : '0px'}`,
                    scale: isVisible ? 1 : 0.9,
                  }}
                >
                  <img
                    src={step.image}
                    alt={`humor-stage-${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HumorEvolutionScroll;
