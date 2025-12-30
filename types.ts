
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
