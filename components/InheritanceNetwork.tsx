
import React, { useState, useMemo, useEffect } from 'react';
import { Share2, User, Trophy, Calendar, Users, X, ZoomIn, ZoomOut, Maximize2, Sparkles } from 'lucide-react';
import { ActorStats, NetworkNode, NetworkLink } from '../types';

// 导入全量数据 (基于用户提供的41年春晚节目单)
const RAW_DATA = `
1983、《逛厂甸》、斯琴高娃、严顺开
1983、《弹钢琴》、严顺开
1983、《阿Q的独白》、严顺开
1984、《淋浴》、游本昌
1984、《吃面条》、陈佩斯、朱时茂
1984、《电视纠纷》、王景愚、李辉
1985、《拍电影》、陈佩斯、朱时茂
1986、《送礼》、李婉芬、周国治
1986、《羊肉串》、陈佩斯、朱时茂
1987、《家庭宴会》、王明玉、李扬
1987、《恩爱夫妻》、王馥荔、陈裕德
1987、《拔牙》、赵连甲、王刚
1987、《产房门前》、郭达、杨蕾、高兰村、邹小茜
1988、《急诊》、游本昌、赵丽蓉、王丽云、薛培培
1988、《清官难断家务事》、牛得草、朱世慧、郭达、杨蕾、石富宽、崔喜跃
1988、《狗娃与黑妞》、陈佩斯、小香玉
1988、《接妻》、沈伐、岳红
1988、《门铃声声》、李文启、熊小田
1989、《英雄母亲的一天》、赵丽蓉、侯耀文
1989、《招聘》、笑林、师胜杰、黄宏、方青卓
1989、《懒汉相亲》、雷恪生、赵连甲、宋丹丹
1989、《胡椒面》、陈佩斯、朱时茂
1990、《相亲》、赵本山、黄晓娟
1990、《拷红》、郑岩、小香玉、李玲玉、雷英、吴琼
1990、《打麻将》、岳红、巩汉林
1990、《难兄难弟》、严顺开、黄宏
1990、《举重》、王景愚
1990、《主角与配角》、陈佩斯、朱时茂
1991、《手拉手》、黄宏、宋丹丹
1991、《陌生人》、巩汉林、蔡明
1991、《洞房花烛夜》、白淑贤、张寄蝶
1991、《小九老乐》、赵本山、杨蕾
1991、《乡音》、魏积安、赵连甲、常佩双
1991、《警察与小偷》、陈佩斯、朱时茂
1991、《除夕之夜话<渴望>》、张凯丽、韩影、杨青、庞敏、邸英、孟秀、孙松
1991、《争先恐后》、姬晓廷、李宝东、都广友
1992、《秧歌情》、黄宏、宋丹丹
1992、《戒赌》、宋小林、喻海燕、刘玉梅
1992、《我想有个家》、赵本山、黄晓娟
1992、《超生游击队》、上海人民杂技团
1992、《妈妈的今天》、赵丽蓉、巩汉林、李文启
1992、《草台班子》、郭昶、黎舒兰、潘长江
1992、《姐夫与小舅子》、陈佩斯、朱时茂
1992、《拜年》、南京军区前线话剧团
1993、《擦皮鞋》、黄宏、魏积安
1993、《群丑争春》、朱世慧、寇春华、牛得草、张寄蝶、刘异龙、林继凡、李笑非、任廷芳、王道正
1993、《老拜年》、赵本山、王中青、苏杰、阎淑萍
1993、《张三其人》、严顺开、赵玲琪、杨新鸣、徐小帆、鞠波
1993、《桥》、潘长江、黄晓娟
1993、《射雕》、王馥荔、邓婕、陈小艺
1993、《推销》、张国立、刘亚津、张敬
1993、《多多关照》、陆鸣、孙仲江
1993、《黄土坡》、郭达、蔡明
1993、《市场速写》、郭冬临、张慈、法比奥
1994、《越洋电话》、郭达、蔡明
1994、《密码》、高秀敏、赵世林
1994、《八哥来信》、王馥荔、戚慧、赵亮
1994、《吃饺子》、赵丽蓉、李文启、王涛
1994、《打扑克》、黄宏、侯耀文
1994、《上梁下梁》、郭柏松、杨瑞瑞
1994、《大变活人》、陈佩斯、朱时茂
1994、《拆迁变奏曲》、魏积安、杨蕾、韩善续
1995、《找焦点》、黄宏、杨蕾
1995、《如此包装》、赵丽蓉、巩汉林、孟薇
1995、《父亲》、郭达、蔡明、赵保乐、于海伦
1995、《人体复印机》、李博成、李博良
1995、《牛大叔“提干”》、赵本山、范伟、张玉屏
1995、《有事您说话》、郭冬临、李文启、买红妹
1995、《纠察》、孙涛、郭月
1996、《机器人趣话》、蔡明、郭达
1996、《过河》、潘长江、阎淑萍
1996、《一个钱包》、李丁、刘淑萍、杨新鸣、魏启明、童正维、何冰、李琦、句号、王艳梅
1996、《打工奇遇》、赵丽蓉、巩汉林、金珠
1996、《今晚直播》、黄宏、徐帆
1996、《路口》、郭冬临、魏积安、赵亮
1996、《三鞭子》、赵本山、范伟、李海
1997、《柳暗花明》、魏积安、高秀敏
1997、《过年》、郭达、蔡明、郭冬临
1997、《三姐妹当兵》、孙涛、景风凌、王景、郭月
1997、《鞋钉》、黄宏、巩汉林
1997、《红高粱模特队》、赵本山、范伟
1997、《戏里戏外》、牟洋、于海伦、黄玉玲
1998、《我在马路边》、严顺开、杜宁琳、赵玲琪、蒋小涵
1998、《回家》、黄宏、宋丹丹
1998、《拜年》、赵本山、高秀敏、范伟
1998、《一张邮票》、潘长江、黑妹、大山
1998、《东西南北兵》、范明、赵亮、林永健、范雷、吴军、田梅荣、马静、高音、管琳娜、王霞
1998、《王爷与邮差》、陈佩斯、朱时茂
1999、《将心比心》、高秀敏、范伟、黑妹
1999、《老将出马》、赵丽蓉、巩汉林、金珠
1999、《爱父如爱子》、严顺开、张凯丽、李丁、王景
1999、《真情30秒》、孙涛、林永健、毛孩、周炜、范雷
1999、《打气儿》、黄宏、句号
1999、《昨天今天明天》、赵本山、宋丹丹、崔永元
1999、《球迷》、郭达、蔡明、郭冬临
1999、《减肥变奏曲》、曾志伟、沈殿霞、潘长江、李琦、张立、孙福明、郑琦、刘小梅、张海燕、刘流
2000、《同桌的她》、潘长江、巩汉林、王思懿
2000、《钟点工》、赵本山、宋丹丹
2000、《爱笑的女孩》、蔡明、句号、文兴宇
2000、《小站故事》、黄宏、凌峰
2000、《青春之约》、郭达、孙涛、唐静、苏岩
2001、《红娘》、郭达、蔡明、刘桂娟、刘小梅
2001、《得寸进尺》、冯巩、郭冬临、郭月
2001、《家有老爸》、黄宏、林永健、黑妹
2001、《动物运动会》、巩汉林、刘流
2001、《卖拐》、赵本山、高秀敏、范伟
2001、《说声对不起》、句号、洪剑涛、唐静
2001、《三号楼长》、潘长江、黄晓娟、闫学晶、孙坤元
2002、《花盆儿》、黄宏、巩汉林、张凯丽
2002、《智力闯关》、王小丫、李咏、鞠萍、秦梦瑶、刘小源、王子腾
2002、《卖车》、赵本山、高秀敏、范伟
2002、《邻里之间》、牛群、蔡明、郭达
2002、《圆梦》、魏积安、杨蕾、刘敏
2003、《我和爸爸换角色》、郭冬临、金玉婷、小叮当
2003、《足疗》、黄宏、牛莉、沈畅
2003、《都是亲人》、郭达、蔡明、李文启、刘晓梅
2003、《心病》、赵本山、高秀敏、范伟
2004、《好人不打折》、郭冬临、郭达、杨蕾
2004、《讲故事》、严顺开、洪剑涛、小叮当
2004、《兄弟》、黄宏、程煜
2004、《都市外乡人》、巩汉林、韩再芬、柏青
2004、《送水工》、赵本山、范伟、高秀敏
2004、《婚礼》、蔡明、英壮、李咏、王晴、李恺悦
2005、《祝寿》、魏积安、刘小梅、黄晓娟、孙涛、宋宁、小叮当
2005、《装修》、黄宏、巩汉林、林永健
2005、《男子汉大丈夫》、郭冬临、牛莉、李根
2005、《魔力奥运》、邹德江、潘长江、刘亚津、陈寒柏、王志伟、傅琰东、汪燕飞、奥运冠军、中国女排
2005、《浪漫的事》、郭达、蔡明、韩影、于恒
2005、《功夫》、赵本山、范伟、蔡维利、王小虎
2005、《汇报咏叹调》、许晓明、魏真柏、朱丹萍
2005、《明日之星》、李咏、魏三、孙小宝
2006、《马大姐外传》、蔡明、郭达、岳秀清
2006、《招聘》、周锦堂、余信杰、尹北琛、田克兢
2006、《打工幼儿园》、牛群、刘小梅、闫学晶
2006、《邻居》、黄宏、巩汉林、林永健、刘亚津
2006、《实诚人》、郭冬临、魏积安、黄晓娟
2006、《说事儿》、赵本山、宋丹丹、崔永元
2006、《耳朵》、张德高、赵亮、张玺
2007、《送礼》、郭达、蔡明、句号、王晴
2007、《将爱情进行到底》、潘长江、金玉婷
2007、《考验》、黄宏、牛莉、雷恪生
2007、《回家》、郭冬临、邵峰
2007、《策划》、赵本山、宋丹丹、牛群
2007、《假话真情》、严顺开、林永健、刘小梅、刘桂娟
2008、《街头卫士》、句号、韩雪、周炜
2008、《梦幻家园》、郭达、蔡明、王平
2008、《军嫂上岛》、孙涛、黄晓娟、金玉婷、尹北琛
2008、《新闻人物》、郭冬临、周涛
2008、《开锁》、黄宏、巩汉林、林永健、董卿
2008、《火炬手》、赵本山、宋丹丹、刘流
2009、《吉祥三保》、孙涛、邵峰、徐囡楠
2009、《黄豆黄》、黄宏、巩汉林、魏积安、黄晓娟
2009、《水下除夕夜》、尚大庆、范雷、杨大鹏、王红波、金洋、胡洋、侯世甲
2009、《北京欢迎你》、郭达、蔡明
2009、《暖冬》、冯巩、金玉婷
2009、《不差钱》、赵本山、毕福剑、小沈阳、丫蛋
2010、《一句话的事儿》、郭冬临、牛莉、刘鉴
2010、《美丽的尴尬》、金玉婷、黄宏、巩汉林、林永健
2010、《我心飞翔》、殷桃、闫妮、刘敏、柴权、刘思言、陈维涵
2010、《五十块钱》、周锦堂、尹北琛、李铁
2010、《家有毕业生》、蔡明、郭达、郭笑、黄杨
2010、《捐助》、赵本山、小沈阳、王小利、孙立荣、于洋
2011、《午夜电话亭》、李小冉、邵峰
2011、《美好时代》、黄海波、海清
2011、《“聪明”丈夫》、黄宏、陈数、孙涛、张凯丽
2011、《新房》、蔡明、刘威、宋阳、徐囡楠
2011、《同桌的你》、赵本山、王小利、李琳、小沈阳
2012、《天网恢恢》、蔡明、王宁、常远、郭丰周
2012、《荆轲刺秦》、黄宏、沙溢、邵峰
2012、《今天的幸福》、沈腾、黄杨、艾伦
2012、《爱的代驾》、冯巩、牛莉、闫学晶
2012、《面试》、郭冬临、魏积安、何军、傅浚淇
2013、《我要上春晚》、周炜、刘大成、石头、张尧、丁德龙、张玉娇、孙朝阳、张学敏、吴介贤
2013、《想跳就跳》、潘长江、蔡明、穆雪峰、高粼粼、刘畅
2013、《大城小事》、艾伦、王宁、常远
2013、《你摊上事儿了》、秦海璐、王茜华、孙涛、方清平
2013、《今天的幸福2》、沈腾、马丽、杜晓宇、王琦
2013、《搭把手不孤独》、冯巩、郭冬临、阎学晶
2014、《扰民了你》、蔡明、华少、大鹏、岳云鹏、穆雪峰
2014、《扶不扶》、沈腾、马丽、杜晓宇
2014、《我就这么个人》、冯巩、曹随风、蒋诗萌
2014、《人到礼到》、郭冬临、牛莉、邵峰
2015、《喜乐街》、贾玲、沙溢、李菁、瞿颖
2015、《车站奇遇》、蔡明、潘长江、穆雪峰
2015、《小棉袄》、冯巩、高晓攀、尤宪超、张小斐
2015、《投其所好》、沈腾、马丽、杜晓宇
2015、《高手在民间》、毕福剑、杨帆、杨子一、孙丽霞、周丽珍、李立秋、贺东
2015、《一定找到你》、郭冬临、刘涛、郭丰周、富俊淇、吴江、于健
2015、《社区民警于三快》、孙涛、邵峰、宋阳、李菁菁
2016、《快乐老爸》、冯巩、徐帆、白凯南、王孝天
2016、《放心吧》、孙涛、邵峰、王宏坤、李屹伦
2016、《将军与士兵》、侯勇、句号、于恒
2016、《快递小乔》、乔杉、修睿、娄艺潇
2016、《是谁呢》、郭冬临、黄杨、刘亚津、马天宇、关晓彤
2016、《网购奇遇》、蔡明、潘长江、高粼粼
2017、《大城小爱》、刘亮、白鸽、郭金杰
2017、《老伴》、蔡明、潘长江、潘斌龙
2017、《真情永驻》、孙涛、闫学晶、刘仪伟
2017、《一个女婿半个儿》、沈腾、艾伦、魏翔、吴江、杨沅翰
2017、《天山情》、阿布都沙拉木、迪丽呼玛尔、尚大庆
2017、《阿峰其人》、董其峰、方菁萍、李想、钦婉云
2018、《真假老师》、贾玲、张小斐、许君聪、何欢
2018、《学车》、蔡明、潘长江、贾冰
2018、《回家》、方芳、张晨光、王姬、杜宁林、狄志杰
2018、《提意见》、孙涛、秦海璐、王宏坤
2018、《同喜同乐》、郑恺、娄乃鸣、大兵、周埃乐、蒙内铁路乘务组、Zaouty面具舞团
2018、《为您服务》、林永健、杨少华、李明启、王丽云、李琦、李诚儒、戴春荣、李建义、张立、杨紫、白凯南、蒋诗萌、郭金杰
2019、《站台》、尚大庆、李文启、黄晓娟、佟大为、杨紫、王自健、孙茜、李闯
2019、《办公室的故事》、闫妮、周一围、吴海龙、张维威、沈月、李栋、李佳旭
2019、《“儿子”来了》、葛优、蔡明、潘长江、乔杉、翟天临、郭晓小
2019、《占位子》、沈腾、马丽、艾伦、常远、魏翔
2019、《演戏给你看》、孙涛、林永健、句号
2019、《啼笑皆非》、贾玲、张小斐、许君聪
2019、《爱的代驾》、郭冬临、邵峰
2020、《婆婆妈妈》、贾玲、张小斐、许君聪、卜钰、孙集斌
2020、《走过场》、沈腾、马丽、黄才伦、陶亮、刘坤、魏玮
2020、《风雪饺子情》、贾冰、秦岚、张若昀、沙溢、吴磊
2020、《机场姐妹花》、黄晓明、金靖、宋祖儿、王自健、孙芳雅、钟佳颖、代月明
2020、《父母爱情》、郭涛、梅婷、刘琳、李文启、尚大庆、张立、张龄心、张陆、柳明明、彭婧、柳欣言
2020、《喜欢你喜欢我》、谢娜、肖战、鞠婧祎、杨迪、刘维、蒋诗萌
2020、《快乐其实很简单》、孙涛、闫妮、王迅
2021、《一波三折》、贾玲、张小斐、许君聪、卜钰、泰维、刘宏禄、孙集斌
2021、《阳台》、李文启、黄晓娟、尚大庆、佟大为、王丽坤、秦昊、王砚辉、王圣迪、孙茜、娄艺潇
2021、《大扫除》、孙涛、王迅、秦海璐、黄子韬
2021、《开往春天的幸福》、贾冰、倪妮、包贝尔、唐艺昕、杨迪、张雨绮、曾舜晞、胡杏儿
2021、《每逢佳节被催婚》、张凯丽、张国强、万茜、任嘉伦、吴海龙、张维威
2022、《父与子》、孙涛、王雷、颖儿、方向、王弋萱
2022、《还不还》、沈腾、马丽、常远、艾伦、王成思、许文赫
2022、《喜上加喜》、贾玲、张小斐、许君聪、泰维、刘宏禄
2022、《发红包》、贾冰、沙溢、包贝尔、任梓慧、余钦南、闫强
2022、《休息区的故事》、郭冬临、邵峰、韩云云、黄杨、姜力琳、张大宝
2023、《初见照相馆》、于震、孙茜、白宇帆、张佳宁、马旭东、吕腾飞、李红佳
2023、《马上到》、王宝强、杨紫、王宁
2023、《坑》、沈腾、马丽、艾伦、常远、宋阳、于健
2023、《上热搜了》、孙涛、秦岚、黄杨、黄才伦
2023、《对视50秒》、金靖、周铁男、闫佩伦
2024、《那能一样吗》、蒋诗萌、何欢、章若楠、任梓慧、张弛
2024、《开不了口》、郭耘奇、谢泽成、闫佩伦、张祐维、滕哲
2024、《寒舍不寒》、沈腾、马丽、艾伦
2024、《咱家来客了》、于洋、朱天福、王继续、钟雅婷、关景天
2025、《借伞》、赵雅芝、叶童、闫佩伦、阎鹤祥、张小婉、管乐、郭霄、李晨、谭清怡、苏美琪、周星雨、唐纬、陈丽君、宋蔚林、赵袁晨、杨鑫灵、何青青、王金洪
2025、《花架子》、王宏坤、尚大庆、张海燕、李川、孙仲秋
2025、《金龟婿》、沈腾、马丽、孙千、宋阳
2025、《点点关注》、艾伦、姚尧、李源澈
2025、《小明一家》、刘旸、松天硕、宇文秋实
1983、《山村小景》、马季、赵炎
1983、《小小雷锋》、马季、赵炎
1983、《说一不二》、马季、赵炎
1983、《错走了这一步》、姜昆、李文华
1983、《对口词》、姜昆、李文华
1983、《战士之歌》、姜昆、李文华
1983、《讲礼貌》、侯耀文、石富宽
1983、《-》、姜昆、马季
1983、《戏剧杂谈》、侯宝林 、郭全宝
1984、《宇宙牌香烟》、马季
1984、《春联》、马季、赵炎
1984、《夸家乡》、姜昆、李文华
1985、《大乐特乐》、马三立
1985、《-》、马季
1985、《看电视》、姜昆、王金宝
1986、《虎年谈虎》、刘伟、冯巩
1986、《怪声独唱》、笑林、李国盛
1986、《戏迷》、侯耀文、石富宽
1986、《照相》、姜昆、唐杰忠
1986、《唱歌的姿势》、姜昆、唐杰忠
1987、《巧对影联》、刘伟、冯巩
1987、《学播音》、笑林、李国盛
1987、《虎口遐想》、姜昆、唐杰忠
1987、《打岔》、侯耀文、石富宽
1987、《五官争功》、马季、赵炎、王金宝、冯巩、刘伟
1988、《求全责备》、刘伟、冯巩、牛振华、李艺、戴志诚、郑健、赵保乐
1988、《对话趣谈》、常宝华、常远、单联丽、王荃、李博成、李博良、卡尔罗、李立山
1988、《攀比》、笑林、李国盛
1988、《电梯奇遇》、姜昆、唐杰忠
1988、《巧立名目》、牛群、李立山
1989、《送春联》、李金斗、陈涌泉、于世猷、石富宽
1989、《送别》、刘伟、马季
1989、《生日祝辞》、冯巩、牛群
1989、《捕风捉影》、姜昆、唐杰忠
1989、《太挤了》、笑林、李国盛
1990、《学唱歌》、姜昆、唐杰忠
1990、《无所适从》、牛群、冯巩
1990、《三顾茅庐》、刘伟、刘惠
1990、《二重唱》、戴志诚、郑健
1991、《着急》、姜昆、唐杰忠
1991、《亚运之最》、牛群、冯巩
1991、《笑星劝酒》、阎月明、常佩业、笑林、李国盛
1991、《学唱》、白桦、邓小林
1991、《训徒》、马季、赵炎、史可达
1992、《小站联欢会》、侯耀文、石富宽
1992、《美丽畅想曲》、姜昆、唐杰忠
1992、《办晚会》、牛群、冯巩
1992、《民族乐》、克里木、常佩业
1992、《宠物热》、李金斗、陈涌泉
1992、《论捧》、阎月明、李建华、王平
1992、《改门脸》、唐爱国、齐立强
1993、《楼道曲》、姜昆、唐杰忠
1993、《拍卖》、牛群、冯巩
1993、《8字迷》、杨振华、杨瑞库
1993、《侯大明白》、侯耀文、石富宽
1993、《新名词》、高洪胜、李立山
1994、《跑题》、李金斗、石富宽、阎月明、单联丽
1994、《点子公司》、冯巩、牛群
1995、《谁有毛病》、刘俊杰、赵炎
1995、《最差先生》、牛群、冯巩
1995、《新春乐》、李金斗、石富宽、常贵田、阎月明
1996、《一样不一样》、王平、唐杰忠、王谦祥、李增瑞、常贵田、王培元
1996、《其实你不懂我的心》、姜昆、戴志诚、北京国安足球队、上海申花足球俱乐部队
1996、《明天会更好》、牛群、冯巩
1996、《老少乐》、马季、刘伟
1997、《两个人的世界》、冯巩、牛群
1997、《送福》、唐杰忠、刘流、银河少年电视艺术团
1997、《送春联》、笑林、李国盛
1997、《送您一支歌》、姜昆、戴志诚
1997、《京九演义》、侯耀文、石富宽
1997、《打传呼》、师胜杰、赵保乐
1998、《坐享其成》、牛群、冯巩
1998、《同桌的你》、师胜杰、孙晨
1999、《同喜同乐》、大山、卡尔罗、露露、莫大伟
1999、《瞧这俩爹》、冯巩、牛群
1999、《白吃》、奇志、大兵
2000、《旧曲新歌》、冯巩、郭冬临
2000、《谈情说爱》、姜昆、戴志诚
2001、《踩脚》、姜昆、戴志诚
2001、《戏迷》、刘俊杰、唐杰忠
2001、《咱也试一把》、笑林、王平、尹卓林、赵保乐
2002、《台上台下》、冯巩、郭冬临、陆鸣
2002、《马年赛马》、侯耀文、石富宽、师胜杰、王平、刘流
2002、《妙趣网生》、姜昆、戴志诚
2002、《谁怕贝勒爷》、金士杰、赵自强、倪敏然、李建常
2003、《马路情歌》、冯巩、周涛
2003、《今非昔比》、陈寒柏、王敏
2003、《说广告》、王振华、何军
2004、《十二生肖大拜年》、侯耀文、石富宽、刘亚津、刘俊杰、刘全刚、郑健、刘惠、李嘉存、陈寒柏、王敏、刘流、张大礼
2004、《让一让，生活真美好》、冯巩、刘金山、李志强、周涛、朱军
2004、《如此指导》、尹博林、尹卓林
2005、《咨询热线》、李伟健、武宾
2005、《笑谈人生》、冯巩、朱军、蔡明
2005、《鸡年说鸡》、侯耀文、石富宽、郑健、李嘉存
2006、《跟着媳妇当保姆》、冯巩、牛莉、朱军
2006、《谁让你是优秀》、大兵、赵卫国
2006、《新说绕口令》、刘增锴、朱德刚
2007、《咱村里的事》、冯巩、李志强
2007、《免费电话》、李金斗、大兵、赵卫国
2007、《我惯着他》、赵炎、周炜
2008、《疯狂股迷》、武宾、李伟健
2008、《公交协奏曲》、冯巩、闫学晶、王宝强、潘斌龙
2009、《我有点晕》、姜昆、戴志诚
2009、《团团圆圆》、李伟健、武宾、樊光耀、朱德刚、董卿
2009、《五官新说》、刘伟、郑健、马东、大山、周炜
2010、《不能让他走》、冯巩、刘金山、邵峰、闫学晶、韩雪
2010、《和谁说相声》、姜昆、戴志诚、赵津生
2010、《大话捧逗》、贾玲、白凯南
2010、《超级大卖场》、李伟健、武宾
2011、《专家指导》、姜昆、戴志诚、郑健、周炜、李伟健
2011、《独家录制》、李菁、何云伟
2011、《还钱》、冯巩、牛莉、小宋佳、刘金山
2011、《四海之内皆兄弟》、大山、艾迪、夏天、李天翼、梅友、茹丝
2011、《芝麻开门》、贾玲、白凯南
2012、《小合唱》、王宏伟、佟铁鑫、吕继宏、刘和刚、周炜
2012、《奋斗》、曹云金、刘云天
2013、《这事儿不赖我》、曹云金、刘云天
2013、《败家子》、郭德纲、于谦
2013、《东西南北大拜年》、赵炎、逗笑、逗乐、大新、程刚、张钢、张华伟、张攀、刘铨淼
2014、《说你什么好》、曹云金、刘云天
2015、《我忍不了》、岳云鹏、孙越
2015、《圈子》、周炜、武宾
2015、《这不是我的》、苗阜、王声
2016、《我知道》、李寅飞、李丁
2017、《姥说》、高晓攀、尤宪超
2017、《新虎口遐想》、姜昆、戴志诚
2017、《信任》、冯巩、林永健、宋宁、傅园慧
2018、《我爱诗词》、冯巩、贾旭明、曹随风、侯林林
2018、《单车问答》、董建春、李丁
2019、《妙言趣语》、岳云鹏、孙越
2020、《生活趣谈》、岳云鹏、孙越
2021、《年三十的歌》、岳云鹏、孙越
2021、《如此家长》、金霏、陈曦
2021、《叫卖》、李寅飞、叶篷
2022、《欢乐方言》、姜昆、戴志诚
2022、《像不像》、卢鑫、玉浩
2023、《我的变、变、变》、岳云鹏、孙越
2024、《我要不一样》、岳云鹏、孙越
2024、《导演的“心事”》、金霏、陈曦、董建春、李丁、盛伟、周鹏飞、小虎、安吉鹏、高嘉豪
2025、《我们一起说相声》、岳云鹏、孙越
2025、《没那么简单》、金霏、陈曦、盛伟、董建春、李丁

`;

const InheritanceNetwork: React.FC = () => {
  const [selectedActorId, setSelectedActorId] = useState<string | null>(null);
  const [hoveredActorId, setHoveredActorId] = useState<string | null>(null);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(0.65);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  // 1. 数据解析逻辑
  const { nodes, links, actorMap } = useMemo(() => {
    const actors = new Map<string, ActorStats>();
    const cooperations = new Map<string, number>();
    const lines = RAW_DATA.trim().split('\n');

    lines.forEach(line => {
      const parts = line.split('、');
      if (parts.length < 3) return;
      const year = parseInt(parts[0]);
      const work = parts[1];
      const cast = parts.slice(2).filter(n => n && n !== '-');

      cast.forEach(name => {
        if (!actors.has(name)) {
          actors.set(name, { id: name, name, count: 0, partners: new Map(), years: [], works: [] });
        }
        const stats = actors.get(name)!;
        stats.count++;
        stats.years.push(year);
        stats.works.push(work);

        cast.forEach(partner => {
          if (partner !== name) {
            stats.partners.set(partner, (stats.partners.get(partner) || 0) + 1);
            const pair = [name, partner].sort().join('::');
            cooperations.set(pair, (cooperations.get(pair) || 0) + 1);
          }
        });
      });
    });

    const networkNodes: NetworkNode[] = Array.from(actors.values()).map(stats => ({
      id: stats.id,
      name: stats.name,
      count: stats.count,
      stats: stats,
    }));

    const networkLinks: NetworkLink[] = Array.from(cooperations.entries()).map(([pair, weight]) => {
      const [source, target] = pair.split('::');
      return { source, target, weight };
    });

    return { nodes: networkNodes, links: networkLinks, actorMap: actors };
  }, []);

  // 2. 视觉映射系统
  const getVisuals = (count: number) => {
    let color = '#98876bff'; 
    let r = 18;
    let fontSize = 9;

    if (count >= 20) { color = '#ff2200'; r = 45; fontSize = 16; }
    else if (count >= 15) { color = '#ff5500'; r = 38; fontSize = 14; }
    else if (count >= 10) { color = '#ffa200'; r = 32; fontSize = 12; }
    else if (count >= 5) { color = '#ffcc00'; r = 26; fontSize = 11; }
    else if (count >= 2) { color = '#d4af37'; r = 21; fontSize = 10; }

    return { r, color, fontSize };
  };

  // 3. 仿重力“有机星云”布局
  const [simulationNodes, setSimulationNodes] = useState<NetworkNode[]>([]);
  
  useEffect(() => {
    const VIEW_W = 1200;
    const VIEW_H = 900;
    const centerX = VIEW_W / 2;
    const centerY = VIEW_H / 2;

    const arranged = nodes.map((node) => {
      // 引入大量随机扰动 (Jitter)
      const jitterX = (Math.random() - 0.5) * 60;
      const jitterY = (Math.random() - 0.5) * 60;
      
      let radius: number;
      let angle: number;

      // 核心区随机化 (不再是完美的同心圆)
      if (node.count >= 10) {
        // 大佬们在中心区域，但增加位置抖动，使他们错开
        radius = (1 - (node.count / 45)) * 180 + (Math.random() * 40); 
        angle = Math.random() * Math.PI * 2;
      } 
      // 中频区
      else if (node.count >= 3) {
        radius = 240 + Math.random() * 200;
        angle = Math.random() * Math.PI * 2;
      }
      // 边缘散落区
      else {
        // 低频演职员像星云尘埃一样散落在外围
        radius = 450 + Math.random() * 200;
        angle = Math.random() * Math.PI * 2;
      }

      return {
        ...node,
        x: centerX + Math.cos(angle) * radius + jitterX,
        y: centerY + Math.sin(angle) * radius + jitterY
      };
    });

    setSimulationNodes(arranged);
  }, [nodes]);

  const activeActor = selectedActorId ? actorMap.get(selectedActorId) : null;

  // 交互判断逻辑
  const isNodeHighlighted = (id: string) => {
    if (!hoveredActorId && !selectedActorId && !selectedLinkId) return true;
    if (selectedLinkId) {
      const [s, t] = selectedLinkId.split('::');
      return id === s || id === t;
    }
    const focusId = hoveredActorId || selectedActorId;
    if (id === focusId) return true;
    return actorMap.get(focusId!)?.partners.has(id);
  };

  const isLinkHighlighted = (link: NetworkLink) => {
    const sId = typeof link.source === 'string' ? link.source : link.source.id;
    const tId = typeof link.target === 'string' ? link.target : link.target.id;
    const linkKey = [sId, tId].sort().join('::');
    
    if (selectedLinkId) return linkKey === selectedLinkId;
    if (!hoveredActorId && !selectedActorId) return true;
    const focusId = hoveredActorId || selectedActorId;
    return sId === focusId || tId === focusId;
  };

  return (
    <div className="relative w-full h-[850px] bg-[#030303] rounded-[4rem] border border-white/5 overflow-hidden shadow-[inset_0_0_150px_rgba(0,0,0,1)] flex items-center justify-center cursor-default group/main">
      
      {/* 动态背景星光 */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
         {[...Array(50)].map((_, i) => (
           <div 
             key={i}
             className="absolute w-0.5 h-0.5 bg-yellow-500 rounded-full animate-pulse"
             style={{ 
               top: `${Math.random() * 100}%`, 
               left: `${Math.random() * 100}%`,
               animationDelay: `${Math.random() * 5}s`
             }}
           ></div>
         ))}
      </div>

      {/* 顶部HUD */}
      <div className="absolute top-10 left-10 z-30 space-y-4 pointer-events-none">
         <div className="flex items-center gap-4 bg-red-950/40 px-6 py-3 rounded-2xl border border-red-800/30 backdrop-blur-2xl">
            <Sparkles className="text-yellow-500 animate-pulse" size={24} />
            <div>
               <h3 className="text-xl font-black text-white tracking-tighter uppercase">春晚幽默演职关系星图</h3>
               <p className="text-[10px] text-yellow-500/60 font-bold tracking-[0.2em]">GALA ACTOR ORGANIC NEBULA (1983-2025)</p>
            </div>
         </div>
      </div>

      {/* SVG 画布 */}
      <div 
        className="relative w-full h-full transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{ transform: `scale(${zoom}) translate(${offset.x}px, ${offset.y}px)` }}
        onClick={() => { setSelectedActorId(null); setSelectedLinkId(null); }}
      >
        <svg className="w-full h-full" viewBox="0 0 1200 900" style={{ overflow: 'visible' }}>
          <defs>
            <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 连线层 */}
          <g>
            {links.map((link, i) => {
              const sNode = simulationNodes.find(n => n.id === (typeof link.source === 'string' ? link.source : link.source.id));
              const tNode = simulationNodes.find(n => n.id === (typeof link.target === 'string' ? link.target : link.target.id));
              if (!sNode || !tNode) return null;

              const highlighted = isLinkHighlighted(link);
              const linkKey = [sNode.id, tNode.id].sort().join('::');
              const isSelected = selectedLinkId === linkKey;

              return (
                <line
                  key={`link-${i}`}
                  x1={sNode.x} y1={sNode.y} x2={tNode.x} y2={tNode.y}
                  stroke={isSelected ? "#fff" : (highlighted ? "#d3b14cff" : "rgba(255, 255, 255, 0.04)")}
                  strokeWidth={link.weight * (highlighted ? 0.9 : 0.1)}
                  strokeOpacity={highlighted ? (isSelected ? 1 : 0.4) : 0.08}
                  className="transition-all duration-700 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedLinkId(linkKey);
                    setSelectedActorId(null);
                  }}
                />
              );
            })}
          </g>

          {/* 节点层 */}
          <g>
            {simulationNodes.map((node) => {
              const { r, color, fontSize } = getVisuals(node.count);
              const highlighted = isNodeHighlighted(node.id);
              const isSelected = selectedActorId === node.id;
              const isHovered = hoveredActorId === node.id;

              return (
                <g 
                  key={node.id} 
                  transform={`translate(${node.x}, ${node.y})`}
                  className={`cursor-pointer transition-all duration-700 ${highlighted ? 'opacity-100' : 'opacity-10 grayscale-[0.8]'}`}
                  onMouseEnter={() => setHoveredActorId(node.id)}
                  onMouseLeave={() => setHoveredActorId(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedActorId(node.id);
                    setSelectedLinkId(null);
                  }}
                >
                  {/* 发光底层 - 仅在大佬或选中时显现 */}
                  {(isSelected || isHovered || node.count >= 15) && (
                    <circle r={r + 10} fill={color} opacity={isSelected ? 0.3 : 0.15} filter="url(#nodeGlow)" />
                  )}
                  
                  {/* 主圆形背景 */}
                  <circle 
                    r={isSelected ? r * 1.15 : r} 
                    fill={isSelected ? '#fff' : color} 
                    stroke={isSelected ? '#eab308' : 'rgba(255,255,255,0.05)'} 
                    strokeWidth={isSelected ? 3 : 1}
                    className="transition-all duration-300"
                  />
                  
                  {/* 名字文本 */}
                  <text 
                    dy=".35em" 
                    textAnchor="middle" 
                    fill={isSelected ? '#000' : (node.count >= 2 ? '#fff' : 'rgba(255,255,255,0.45)')}
                    className="font-black pointer-events-none tracking-tighter select-none"
                    style={{ fontSize: isSelected ? fontSize * 1.1 : fontSize }}
                  >
                    {node.name}
                  </text>

                  {/* 次数微章 */}
                  {highlighted && node.count > 1 && !isSelected && (
                    <g transform={`translate(${r * 0.75}, ${-r * 0.75})`}>
                       <circle r="7" fill="#000" stroke={color} strokeWidth="1" />
                       <text textAnchor="middle" dy=".35em" fontSize="6" fill="#fff" fontWeight="900">{node.count}</text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* 侧边信息卡片 */}
      {activeActor && (
        <div className="absolute right-12 top-1/2 -translate-y-1/2 w-[380px] z-50 animate-in slide-in-from-right-20 duration-500">
           <div className="bg-[#111]/95 backdrop-blur-3xl rounded-[3rem] p-10 border-l-[12px] border-yellow-500 shadow-[0_50px_100px_rgba(0,0,0,0.9)] relative overflow-hidden">
              <div className="absolute -top-10 -right-10 text-[10rem] font-black text-white/[0.03] italic pointer-events-none select-none">
                 {activeActor.count}
              </div>
              <button onClick={() => setSelectedActorId(null)} className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"><X size={20} /></button>
              <div className="flex items-center gap-5 mb-10">
                 <div className="w-20 h-20 rounded-3xl bg-yellow-500 flex items-center justify-center shadow-2xl rotate-3"><User size={40} className="text-red-950" /></div>
                 <div>
                    <h4 className="text-3xl font-black text-white tracking-tighter">{activeActor.name}</h4>
                    <span className="text-[10px] font-black text-yellow-500/60 uppercase tracking-widest block mt-1">Archive Entry Profile</span>
                 </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-10">
                 <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2"><Trophy size={14} className="text-yellow-500" /><span className="text-[9px] font-black text-white/40 uppercase tracking-widest">出场频次</span></div>
                    <div className="text-2xl font-black text-white">{activeActor.count} <span className="text-xs opacity-30">场</span></div>
                 </div>
                 <div className="bg-white/5 p-5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-2 mb-2"><Users size={14} className="text-blue-500" /><span className="text-[9px] font-black text-white/40 uppercase tracking-widest">合作规模</span></div>
                    <div className="text-2xl font-black text-white">{activeActor.partners.size} <span className="text-xs opacity-30">人</span></div>
                 </div>
              </div>
              <div className="space-y-6">
                 <div>
                    <span className="text-[9px] font-black text-yellow-500/40 uppercase tracking-[0.2em] block mb-3">核心搭档 / Partners</span>
                    <div className="flex flex-wrap gap-2">
                       {Array.from(activeActor.partners.entries()).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name, count])=>(
                         <div key={name} className="px-4 py-2 bg-yellow-500/10 rounded-xl border border-yellow-500/20 text-xs text-yellow-500 font-black">{name} <span className="opacity-40 text-[9px] ml-1">{count}次</span></div>
                       ))}
                    </div>
                 </div>
                 <div>
                    <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em] block mb-3">代表剧目 / Work History</span>
                    <div className="max-h-32 overflow-y-auto pr-2 custom-scrollbar space-y-2">
                        {Array.from(new Set(activeActor.works)).slice(0, 15).map((work, i)=>(
                          <div key={i} className="flex items-center gap-3 group text-xs text-white/50 hover:text-white transition-colors"><div className="w-1 h-1 rounded-full bg-white/20"></div>{work}</div>
                        ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* 底部控制栏 */}
      <div className="absolute bottom-10 left-10 flex items-center gap-6 bg-black/60 px-6 py-4 rounded-3xl border border-white/5 backdrop-blur-xl transition-all hover:bg-black/80">
         <div className="flex items-center gap-4">
            <button onClick={() => setZoom(z => Math.max(z - 0.1, 0.2))} className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all"><ZoomOut size={16} /></button>
            <span className="text-[10px] font-mono font-black text-yellow-500 w-12 text-center">{(zoom * 100).toFixed(0)}%</span>
            <button onClick={() => setZoom(z => Math.min(z + 0.1, 2.0))} className="p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all"><ZoomIn size={16} /></button>
         </div>
         <div className="h-4 w-[1px] bg-white/10"></div>
         <button onClick={() => { setZoom(0.65); setOffset({x:0, y:0}); }} className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-lg text-white/40 hover:text-white transition-all">
            <Maximize2 size={16} /><span className="text-[9px] font-black uppercase tracking-widest">Reset</span>
         </button>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default InheritanceNetwork;
