/**
 * ProgressBar.tsx
 * 게임 진행 바 컴포넌트 (시간 표시 + 감정 아이콘)
 * 참조: docs/05_UI_UX_Design.md, docs/03_Emotion_Stages.md
 */

import React from "react";
import { EmotionStage } from "@/types";
import { EMOTION_STAGES } from "@/lib/constants";

export interface ProgressBarProps {
  /** 남은 시간 (초) */
  remainingTime: number;
  /** 전체 시간 (초) */
  totalTime: number;
  /** 현재 감정 단계 */
  emotionStage: EmotionStage;
  /** 진행 바 높이 (px) */
  height?: number;
  /** 애니메이션 활성화 */
  animated?: boolean;
}

/**
 * 게임 진행 바 컴포넌트
 *
 * 기능:
 * - 시간 경과에 따라 진행 바 감소
 * - 감정 아이콘이 진행 바를 따라 이동
 * - 남은 시간이 적을수록 색상 변화 (녹색 → 노랑 → 빨강)
 *
 * 사용 예시:
 * <ProgressBar
 *   remainingTime={7}
 *   totalTime={10}
 *   emotionStage="S2"
 * />
 */
export default function ProgressBar({
  remainingTime,
  totalTime,
  emotionStage,
  height = 24,
  animated = true,
}: ProgressBarProps) {
  // 진행률 계산 (0~100%)
  const progress = Math.max(0, Math.min(100, (remainingTime / totalTime) * 100));

  // 감정 정보 가져오기
  const emotion = EMOTION_STAGES[emotionStage];

  // 진행 바 색상 (남은 시간에 따라 변화)
  const getBarColor = (): string => {
    if (progress > 50) {
      return "bg-gradient-to-r from-green-400 to-green-500";
    } else if (progress > 25) {
      return "bg-gradient-to-r from-yellow-400 to-yellow-500";
    } else {
      return "bg-gradient-to-r from-red-400 to-red-500 animate-pulse";
    }
  };

  return (
    <div className="w-full">
      {/* 진행 바 컨테이너 */}
      <div
        className="relative w-full bg-gray-200 rounded-full overflow-hidden shadow-inner"
        style={{ height: `${height}px` }}
      >
        {/* 진행 바 */}
        <div
          className={`
            h-full
            ${getBarColor()}
            ${animated ? "transition-all duration-300 ease-linear" : ""}
          `}
          style={{ width: `${progress}%` }}
        >
          {/* 진행 바 하이라이트 효과 */}
          <div className="h-full w-full bg-gradient-to-b from-white/30 to-transparent" />
        </div>

        {/* 감정 아이콘 (진행 바 위 이동) */}
        <div
          className={`
            absolute top-1/2
            flex items-center justify-center
            w-10 h-10
            bg-white
            rounded-full
            shadow-lg
            border-2 border-pink-300
            ${animated ? "transition-all duration-300 ease-linear" : ""}
          `}
          style={{
            left: `${Math.max(0, Math.min(100, progress))}%`,
            transform: `translate(-50%, -50%)`,
          }}
        >
          <span className="text-2xl" role="img" aria-label={emotion.name}>
            {emotion.icon}
          </span>
        </div>
      </div>

      {/* 시간 표시 (아래) */}
      <div className="mt-2 flex justify-between items-center text-sm">
        <span className="text-gray-600 font-medium">
          {emotion.icon} {emotion.name}
        </span>
        <span
          className={`
            font-bold
            ${progress > 50 ? "text-green-600" : progress > 25 ? "text-yellow-600" : "text-red-600"}
          `}
        >
          {remainingTime.toFixed(1)}초
        </span>
      </div>
    </div>
  );
}
