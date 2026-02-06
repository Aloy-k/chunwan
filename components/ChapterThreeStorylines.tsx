import React, { useState, useCallback } from 'react';
import { MemeTrend } from '../types';
import MemeStorylineBlock from './MemeStorylineBlock';
import MemeWaterfall from './MemeWaterfall';
import chunwanBg from '../assets/chunwan-bg.png';

interface ChapterThreeStorylinesProps {
  trends: MemeTrend[];
}

/** 第三篇章故事线容器：统一春晚底图 + 固定背景遮罩，滚动时仅瀑布流等动态层切换 */
const ChapterThreeStorylines: React.FC<ChapterThreeStorylinesProps> = ({ trends }) => {
  const storyTrends = trends.filter((t) => t.storySteps && t.storySteps.length > 0).slice(0, 2);
  const firstHasWaterfall = storyTrends[0]?.storySteps?.[0]?.specialComponent === 'memeWaterfall';

  const [activeBg, setActiveBg] = useState<{ hasMemeWaterfall: boolean }>(() => ({
    hasMemeWaterfall: !!firstHasWaterfall
  }));

  const handleStepVisible = useCallback(
    (_imageUrl: string, hasMemeWaterfall: boolean) => {
      setActiveBg({ hasMemeWaterfall });
    },
    []
  );

  return (
    <div className="relative">
      {/* 全屏固定背景层：与全站一致的春晚底图 + 遮罩，不随步骤换图 */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${chunwanBg})`,
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="absolute inset-0 bg-black/52" />
        {activeBg.hasMemeWaterfall && <MemeWaterfall />}
      </div>

      {storyTrends.map((trend, idx) => (
        <MemeStorylineBlock
          key={trend.id}
          data={trend}
          index={idx}
          onStepVisible={handleStepVisible}
        />
      ))}
    </div>
  );
};

export default ChapterThreeStorylines;
