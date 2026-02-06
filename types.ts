
export enum AppState {
  HOME = 'HOME',
  TRANSITION_TO_HOME = 'TRANSITION_TO_HOME',
  TRANSITION_TO_CH1 = 'TRANSITION_TO_CH1',
  CHAPTER_ONE = 'CHAPTER_ONE',
  TRANSITION_TO_CH2 = 'TRANSITION_TO_CH2',
  CHAPTER_TWO = 'CHAPTER_TWO',
  TRANSITION_TO_CH3 = 'TRANSITION_TO_CH3',
  CHAPTER_THREE = 'CHAPTER_THREE'
}

export type SubTab = 'ORIGINS' | 'EVOLUTION' | 'CONSTELLATION' | 'NETWORK' | 'TRENDS';

export type HumorType = '语言包袱' | '人物反差' | '逻辑乌龙' | '民生吐槽' | '夸张视听' | '无' | '其他';

export interface HumorPoint {
  timestamp: number;
  content: string;
  mechanism: string;
  analysis: string;
}

export interface WordCloudItem {
  text: string;
  weight: number; 
}

export interface VideoData {
  id: string;
  title: string;
  type: '小品' | '相声' | '魔术';
  videoUrl: string;
  poster: string;
  humorPoints: HumorPoint[];
  wordCloud: WordCloudItem[];
}

export interface EvolutionProgram {
  id: string;
  name: string;
  year: number;
  tags: string[];
  composition: {
    type: HumorType;
    ratio: number;
  }[];
}

export interface Performer {
  id: string;
  name: string;
  firstYear: number;
  totalWorks: number;
  bio: string;
  quotes: string[];
  role: string;
}

export interface Relation {
  source: string;
  target: string;
  type: string;
}

/** 特殊组件类型：用于第三篇章沉浸式滚动叙事的动态效果 */
export type StorySpecialComponent = 'memeWaterfall' | 'memeReveal' | 'memeChat' | 'memeDanmaku' | 'timeMachine' | 'secretCode' | 'introVideo' | 'lightPoints180';

/** 故事线单步：用于第三篇章下拉故事叙事，与 visualHistory 按索引一一对应 */
export interface StoryStep {
  title: string;
  body: string;
  /** 可选：点击播放音频（如"宫廷玉液酒"点击播放"一百八一杯"原声） */
  audioUrl?: string;
  /** 可选：点击播放时展示的按钮/提示文案 */
  audioPrompt?: string;
  /** 可选：特殊视觉/交互组件（表情包瀑布、时光穿梭机、接头暗号） */
  specialComponent?: StorySpecialComponent;
  /** 可选：本步用多图（如两个 GIF）时填写，覆盖单图；与 visualHistory 本步的 imageUrl 二选一 */
  imageUrls?: string[];
  /** 可选：本步主图覆盖（如案例一 Step4 弹幕大图），不填则用 visualHistory 本步的 imageUrl */
  imageUrl?: string;
  /** 可选：本步右侧用视频流展示（如案例二 Step1《打工奇遇》），路径指向本地 mp4 */
  videoUrl?: string;
  /** 可选：时光机 4:3 电视框底图（案例二 Step2） */
  tvBackgroundUrl?: string;
  /** 可选：时光机 9:16 手机框底图（案例二 Step2） */
  phoneBackgroundUrl?: string;
}

export interface MemeTrend {
  id: string;
  hashtag: string;
  period: string;
  totalData: number;
  points: {
    date: string;
    posts: number;
    likes: number;
    comments: number;
  }[];
  visualHistory: {
    offset: number;
    imageUrl: string;
    label: string;
  }[];
  /** 可选：下拉故事线文案，与 visualHistory 长度一致时用于故事线区块 */
  storySteps?: StoryStep[];
}

export interface ActorStats {
  id: string;
  name: string;
  count: number;
  partners: Map<string, number>;
  years: number[];
  works: string[];
}

export interface SimulationNodeDatum {
  index?: number;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number;
  fy?: number;
}

export interface SimulationLinkDatum<NodeDatum extends SimulationNodeDatum> {
  index?: number;
  source: string | NodeDatum;
  target: string | NodeDatum;
}

export interface NetworkNode extends SimulationNodeDatum {
  id: string;
  name: string;
  count: number;
  stats: ActorStats;
}

export interface NetworkLink extends SimulationLinkDatum<NetworkNode> {
  weight: number;
}
