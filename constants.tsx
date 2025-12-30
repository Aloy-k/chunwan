
import { VideoData, EvolutionProgram, HumorType, Performer, Relation, MemeTrend } from './types';
import Papa from 'papaparse'; // 需要在这里引入
import rawEvolutionData from './data/xiaodian_type.json';


export const HUMOR_COLORS: Record<HumorType, string> = {
  '语言包袱': '#cc6666ff', // 柔红 (Rose)
  '人物反差': '#2ea063ff', // 翠绿 (Emerald)
  '逻辑乌龙': '#3aa6d4ff', // 蔚蓝 (Sky)
  '民生吐槽': '#e9b415f0', // 琥珀 (Amber)
  '夸张视听': '#885ce7ff', // 靛青 (Indigo)
  '无': '#334155',       // 板岩 (Slate)
  '其他': '#475569',     // 灰蓝
};

// 1. 定义 ID 和 CSV 文件路径的映射关系
// 请确保你的 public/data 文件夹下有这三个文件，名字要对应上
const CSV_FILES: Record<string, string> = {
  'nigemaiti-fail': '/data/nige.csv',      // 尼格买提的数据文件
  'baiyun-heitu': '/data/baiyun.csv',      // 白云黑土的数据文件
  'gongting-yuyejiu': '/data/wine.csv'     // 宫廷玉液酒的数据文件
};

const HUMOR_TYPES: HumorType[] = ['语言包袱', '人物反差', '逻辑乌龙', '民生吐槽', '夸张视听', '无'];

export const VIDEOS: VideoData[] = [
  { 
    id: 'skit-zlr', 
    title: '昨天今天明天 (赵本山/宋丹丹/崔永元)', 
    type: '小品', 
    //videoUrl: './assets/yesterdaytodaytomorrow.mp4', 
    // 🟢 现在的写法 (粘贴你刚才复制的链接)：
    videoUrl: 'https://github.com/Aloy-k/final1/releases/download/v1.0/yesterdaytodaytomorrow.mp4',
    poster: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800', 
    humorPoints: [
      { 
        timestamp: 49, 
        content: '白云：俺们隔壁那吴老二，瞅我一眼就浑身发抖 黑土：吴老二脑血栓，看谁都哆嗦', 
        mechanism: '“拆台”“捧哏”机制', 
        analysis: '白云大妈基于虚荣心和主观臆断，对“吴老二发抖”这一现象进行自我美化。黑土大爷介入，提供“客观事实”（脑血栓），将白云大妈营造的浪漫/魅力场景拉回现实，打破了观众的错误预期，制造出乎意料的幽默。' 
      },
      {
        timestamp: 390, 
        content: '白云：非要给我朗诵诗歌：啊！白云，黑土向你道歉，来到你门前，请你睁开眼，看我多可怜。今天的你我怎样重复昨天的故事。我这张旧船票还能否登上你的破船。', 
        mechanism: '语言错位、风格杂糅、反差颠覆', 
        analysis: '从“啊！白云，黑土向你道歉”这种略显夸张却又真挚的呼唤，到“今天的你我怎样重复昨天的故事”的文学式感叹，——“你的破船”的粗俗现实，诗歌内部风格的巨大跳跃构成幽默。白云大妈特有的东北口音和语气去“深情”演绎，与诗歌的“浪漫”气质形成反差。“破船”——引爆点，将前文营造的全部浪漫与哀怨一扫而空，用极度不匹配的贬义词语终结了诗意，形成剧烈的预期违背和语义脚本对立。' 
      },
      {
        timestamp: 465, 
        content: '伺候月子', 
        mechanism: '谐音梗 身份喜剧 解构', 
        analysis: '“日子”与“月子”发音相近，语言游戏。黑土大爷的“伺候月子”，形成一种比你还惨/还琐碎的自我调侃或竞赛式幽默，让笑点层层加码。' 
      }
    ],
    wordCloud: [
      { text: '滑稽动作', weight: 10 },
      { text: '社会讽刺', weight: 8 },
      { text: '夸张的表情', weight: 9 },
      { text: '生活解构', weight: 9 },
      { text: '反转', weight: 9 },
      { text: '顺口溜', weight: 5 },
      { text: '吐槽', weight: 5 },
      { text: '社会讽刺', weight: 5 },
      { text: '荒诞化改编', weight: 3 },
      { text: '荒诞化改编', weight: 3 },
      { text: '凡尔赛', weight: 8 }
    ]
  },
  { 
    id: 'crosstalk-mj', 
    title: '宇宙牌香烟 (马季)', 
    type: '相声', 
    videoUrl: './assets/cigarette.mp4', 
    poster: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800', 
    humorPoints: [
      { 
        timestamp: 34, 
        content: '蜣螂虫牌，后面一翻字典才知道，感觉蜣螂虫是屎壳郎啊，这能不不臭么，感觉这个牌子都臭了', 
        mechanism: '信息不对称、误解引发认知反转', 
        analysis: '眼睛的“傲慢”其实是职场分功心态的缩影。将器官人格化，让观众产生智力上的愉悦感。' 
      },
      { 
        timestamp: 71, 
        content: '苗条淑女赛天仙，不爱红妆爱香烟', 
        mechanism: '戏仿 制造反差 颠覆审美', 
        analysis: '原诗句“苗条淑女赛天仙，不爱红妆爱武装”，将“爱武装”替换为“爱香烟”这种高级美学与世俗行为之间的剧烈反差，以及对传统诗意的解构，引发了听众的会心一笑。' 
      },
      { 
        timestamp: 254, 
        content: '你最少买我八盒香烟，金陵12钗，你买我12套，足抗36景，买我36盒，108将买我108盒，500罗汉买我500盒，我那还有百万雄狮下江南。', 
        mechanism: '逻辑错位 夸张 解构', 
        analysis: '为了收集一个系列的“收藏品”，顾客必须购买与该系列人物/景点数量完全对应的香烟数量，这种机械且非理性的捆绑逻辑本身就荒诞可笑。对“八仙”、“金陵十二钗”等文化符号的解构，从8、12、36、108到500，数字不断攀升，逐渐夸张脱离普通消费的范畴。' 
      }
    ],
    wordCloud: [
      { text: '语言节奏', weight: 10 },
      { text: '谐音误会', weight: 7 },
      { text: '吹牛', weight: 8 },
      { text: '装傻', weight: 3 },
      { text: '讲歪理', weight: 5 },
      { text: '抖包袱', weight: 6 },
      { text: '滑稽的模仿', weight: 4 },
      { text: '顺口溜', weight: 8 },
      { text: '反差', weight: 5 },
      { text: '三番四抖', weight: 3 }
    ]
  },
  { 
    id: 'magic-lq', 
    title: '守岁共此时 (刘谦/尼格买提)', 
    type: '魔术', 
    videoUrl: './assets/magic.mp4', 
    poster: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=800', 
    humorPoints: [
      { 
        timestamp: 330, 
        content: '尼格买提牌没对上 (名场面)', 
        mechanism: '非预期性“穿帮”', 
        analysis: '在追求极致精准的专业舞台上，一个极其真实的尴尬瞬间成为了最强的笑点。这种“真实感”往往比设计好的台词更有生命力。' 
      }
    ],
    wordCloud: [
      { text: '意外搞砸', weight: 10 },
      { text: '真实窘态', weight: 10 },
      { text: '自嘲玩梗', weight: 7 },
      { text: '观众的反应', weight: 8 }
    ]
  }
];

export const EVOLUTION_DATA: EvolutionProgram[] = rawEvolutionData.map(
  (item, index) => {
    const total = item.laughComposition.reduce(
      (sum: number, c: any) => sum + c.percentage,
      0
    );

    return {
      id: `${item.year}-${index}`,
      name: item.name,
      year: item.year,
      tags: [
        String(item.year),
        item.laughComposition?.[0]?.typeId ?? '无',
      ],
      composition: item.laughComposition.map((comp: any) => ({
        type: HUMOR_TYPES.includes(comp.typeId as HumorType)
          ? (comp.typeId as HumorType)
          : '其他',
        ratio: total > 0 ? comp.percentage / total : 0,
      })),
    };
  }
);



// const RAW_EVOLUTION_JSON = [
//   {"name": "今天的幸福", "year": 2012, "laughComposition": [{ "typeId": "人物反差", "percentage": 50 }, { "typeId": "逻辑乌龙", "percentage": 50 }]},
//   {"name": "扶不扶", "year": 2014, "laughComposition": [{ "typeId": "语言包袱", "percentage": 34 }, { "typeId": "人物反差", "percentage": 33 }, { "typeId": "民生吐槽", "percentage": 33 }]},
//   {"name": "车站奇遇", "year": 2015, "laughComposition": [{ "typeId": "语言包袱", "percentage": 34 }, { "typeId": "人物反差", "percentage": 33 }, { "typeId": "逻辑乌龙", "percentage": 33 }]},
//   {"name": "坑", "year": 2023, "laughComposition": [{ "typeId": "语言包袱", "percentage": 34 }, { "typeId": "人物反差", "percentage": 33 }, { "typeId": "民生吐槽", "percentage": 33 }]},
//   {"name": "金龟婿", "year": 2025, "laughComposition": [{ "typeId": "人物反差", "percentage": 50 }, { "typeId": "民生吐槽", "percentage": 50 }]}
// ];

//将原始JSON转换为 EvolutionProgram 格式
// export const EVOLUTION_DATA: EvolutionProgram[] = RAW_EVOLUTION_JSON.map((item, idx) => ({
//   id: `prog-${idx}`,
//   name: item.name,
//   year: item.year,
//   tags: [String(item.year), item.laughComposition[0].typeId],
//   composition: item.laughComposition.map(comp => ({
//     type: (HUMOR_TYPES.includes(comp.typeId as HumorType) ? comp.typeId : '其他') as HumorType,
//     ratio: comp.percentage / 100
//   }))
// }));

export const PERFORMERS: Performer[] = [
  { id: 'ZBS', name: '赵本山', firstYear: 1990, totalWorks: 21, bio: '作为东北乡土喜剧的代表，被称作 “黑土地长出的喜剧图腾”。以东北方言为鲜明特色，擅长塑造 “大忽悠” 等性格鲜明的农村或市井角色。作品充满黑土地的乡土气息，既有着强烈的地域文化特色，又能借小人物的故事折射世道人心，如《卖拐》系列、《昨天今天明天》均成为国民级经典。', quotes: ['要啥自行车'], role: '奠基人' },
  { id: 'FG', name: '冯巩', firstYear: 1986, totalWorks: 34, bio: '有着 “津味快嘴王” 之称，标志性开场白 “我想死你们了” 深入人心。表演以津味语言为特色，语速快且包袱密集，擅长塑造市井小人物形象。作品既含对官僚作风等现象的辛辣讽刺，如《小偷公司》折射体制弊端；又捕捉市井温情，像《马路情歌》展现市民智慧，兼具思想性与人文关怀。', quotes: ['我想死你们了'], role: '奠基人' },
  { id: 'GD', name: '郭达', firstYear: 1987, totalWorks: 19, bio: '有着 “陕派喜剧代言人” 的称号，常运用关中腔调增强作品平民化特色。擅长以憨厚外表掩饰内在狡黠，表演更注重用动作制造喜剧效果，动作爆发力强，常通过夸张动作放大笑点。作品聚焦市井与社会热点，如《产房门前》消解重男轻女观念，与蔡明搭档开创年龄反差喜剧范式。', quotes: ['当官不为民做主，不如回家卖红薯'], role: '中坚' },
  { id: 'CM', name: '蔡明', firstYear: 1991, totalWorks: 28, bio: '被誉为 “百变毒舌女王”，角色跨度极大，从清纯少女到毒舌老太均能驾驭。打破女性喜剧刻板印象，既有机器人追星族等先锋人设，转型毒舌路线后更产出诸多网络热梗。与郭达等搭档时，常以犀利台词制造年龄或性格反差，形成独特的反差喜剧效果。', quotes: ['为什么呢'], role: '中坚' }, 
  { id: 'JK', name: '姜昆', firstYear: 1983, totalWorks: 25, bio: '秉持相声 “根在生活，刺在时弊” 的理念，喜剧风格以讽刺见长。作品聚焦社会现象，从《虎口遐想》到《精准推送》，始终以敏锐视角捕捉不同时代的社会痛点。表演兼顾传统相声韵味与时代感，既会运用经典相声创作手法，也会融入网言网语等新元素，让观众在笑声中引发对现实的思考。', quotes: ['好嘛，这照相的比那造原子弹的谱还大呢'], role: '中坚' },
  { id: 'HH', name: '黄宏', firstYear: 1989, totalWorks: 24, bio: '堪称 “政策幽默化旗手”，连续 24 年登春晚的作品堪称 “春晚社会观察窗”。擅长将房改、下岗、计划生育等社会议题融入喜剧，如《超生游击队》让国策在笑声中传播，《开锁》折射行政弊病。以幽默解构社会命题，用荒诞设定剖开社会现象，让作品在搞笑之余兼具社会关怀与反思价值。', quotes: ['小锤40，大锤80'], role: '中坚' },
  { id: 'GDL', name: '郭冬临', firstYear: 1993, totalWorks: 22, bio: '以 “暖男” 形象为标志，专攻市井生活题材。擅长塑造心地善良、带点小缺点的小人物，如《有事您说话》中爱逞强的热心人，戳中大众社交焦虑等痛点。表演风格温暖接地气，包袱不低俗，常通过日常场景与反讽语法，传递生活中的小道理。', quotes: ['你用谎言去验证谎言，得到的一定是谎言'], role: '中坚' }
];

export const RELATIONS: Relation[] = [
  { source: 'ZBS', target: 'SDD', type: '搭档' },
  { source: 'ST', target: 'ML', type: '搭档' }
];

export const INITIAL_TREND_DATA: MemeTrend[] = [
  {
    id: 'nigemaiti-fail',
    hashtag: '#尼格买提魔术失败',
    period: '2024.02 - 2025.12',
    totalData: 0, 
    points: [], // 等待读取 nige.csv 填充
    visualHistory: [
      { offset: 0, imageUrl: './assets/image4.jpg', label: '舞台穿帮：原始画面' },
      { offset: 12, imageUrl: './assets/image2.jpg', label: '被提及' },
      { offset: 24, imageUrl: './assets/image3.jpg', label: '再次被提及' },
      { offset: 36, imageUrl: './assets/image1.jpg', label: '传播高潮：表情包' },
      { offset: 48, imageUrl: './assets/image5.jpg', label: '回响：25年春晚继续以全民热点重提' }
    ]
  },
  {
    id: 'baiyun-heitu',
    hashtag: '#我叫白云我叫黑土',
    period: '2015.01 - 2025.12',
    totalData: 0,
    points: [], // 等待读取 baiyun.csv 填充
    visualHistory: [
      { offset: 0, imageUrl: './assets/2image1.jpg', label: '节目经典塑造，定义春晚CP' },
      { offset: 20, imageUrl: './assets/2image2.jpg', label: '社会热梗演变' },
      { offset: 50, imageUrl: './assets/2image3.jpg', label: '社会二创，笑点循环' }
    ]
  },
  {
    id: 'gongting-yuyejiu',
    hashtag: '#眼睛一闭一睁，一天就过去了',
    period: '2009.01 - 2025.12',
    totalData: 0,
    points: [], // 等待读取 wine.csv 填充
    visualHistory: [
      { offset: 0, imageUrl: './assets/3image1.jpg', label: '春晚节目演绎' },
      { offset: 20, imageUrl: './assets/3image2.jpg', label: '融入民生生活' },
      { offset: 40, imageUrl: './assets/3image3.jpg', label: '表情包融梗创作' }
    ]
  }
];


// constants.tsx 中的 parseSingleCsv 函数

const parseSingleCsv = (url: string): Promise<{ points: any[], total: number }> => {
  return new Promise((resolve) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results: any) => {
        const rows = results.data;
        if (rows.length === 0) {
          resolve({ points: [], total: 0 });
          return;
        }

        // --- 1. 查找列名 ---
        const headers = Object.keys(rows[0]); 
        const findKey = (keyword: string) => headers.find(h => h && h.includes(keyword));

        const timeKey = findKey('时间') || findKey('日期') || findKey('Date') || findKey('time'); 
        const likeKey = findKey('点赞') || findKey('赞') || findKey('Like') || findKey('attitudes');
        const commentKey = findKey('评论') || findKey('评') || findKey('Comment');
        const postKey = findKey('转发') || findKey('Retweet') || findKey('Post') || findKey('Share');

        if (!timeKey) {
            console.error(`[严重错误] 在 ${url} 中找不到“时间”列！`);
            resolve({ points: [], total: 0 });
            return;
        }

        // --- 2. 数据处理 ---
        // 增加一个 'count' 字段来统计博文数量
        const map = new Map<string, { p: number, l: number, c: number, count: number, ts: number }>();
        let grandTotal = 0;

        rows.forEach((row: any) => {
          const dateStr = row[timeKey]; 
          if (!dateStr) return;

          const cleanDateStr = String(dateStr).trim().replace(/-/g, '/');
          const date = new Date(cleanDateStr);
          if (isNaN(date.getTime())) return;

          const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          
          // 初始化 bucket，注意 count 初始为 0
          if (!map.has(key)) map.set(key, { p: 0, l: 0, c: 0, count: 0, ts: date.getTime() });
          
          const bucket = map.get(key)!;
          
          // --- 核心修改：统计博文数 ---
          bucket.count += 1; // 每一行就是一条博文，所以 +1

          // 统计互动量
          const rawLike = likeKey ? row[likeKey] : '0';
          const rawComment = commentKey ? row[commentKey] : '0';
          const rawPost = postKey ? row[postKey] : '0';

          const l = parseInt(String(rawLike || 0).replace(/,/g, '').trim()); 
          const c = parseInt(String(rawComment || 0).replace(/,/g, '').trim());
          const p = parseInt(String(rawPost || 0).replace(/,/g, '').trim());
          
          bucket.l += isNaN(l) ? 0 : l;
          bucket.c += isNaN(c) ? 0 : c;
          bucket.p += isNaN(p) ? 0 : p;
          grandTotal += (bucket.l + bucket.c + bucket.p);
        });

        const points = Array.from(map.entries())
          .sort((a, b) => a[1].ts - b[1].ts)
          .map(([dateKey, val]) => ({
            date: dateKey,
            likes: val.l,
            comments: val.c,
            posts: val.p,       // 这是转发数 (保持原样)
            articleCount: val.count // <--- 新增字段：博文数量
          }));

        resolve({ points, total: grandTotal });
      },
      error: (err) => {
        console.error("CSV Load Error:", url, err);
        resolve({ points: [], total: 0 });
      }
    });
  });
};


// 3. 主加载函数：同时读取所有 CSV
export const loadTrendData = async (): Promise<MemeTrend[]> => {
  // 遍历初始数据，为每一条数据创建一个“去读文件”的任务
  const promises = INITIAL_TREND_DATA.map(async (trend) => {
    // 查找该 ID 对应的 CSV 路径
    const csvUrl = CSV_FILES[trend.id];

    // 如果没有配置 CSV 路径，就原样返回数据
    if (!csvUrl) return trend;

    // 等待该 CSV 解析完成
    const result = await parseSingleCsv(csvUrl);

    // 返回合并后的新数据对象
    return {
      ...trend,
      totalData: result.total > 0 ? result.total : trend.totalData, // 如果CSV有数就用CSV的，否则用默认
      points: result.points.length > 0 ? result.points : trend.points
    };
  });

  // 等待所有任务全部完成，返回最终数组
  return Promise.all(promises);
};
