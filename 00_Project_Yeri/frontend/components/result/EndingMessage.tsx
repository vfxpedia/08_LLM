/**
 * EndingMessage.tsx
 * 엔딩 메시지 컴포넌트
 * 참조: docs/04_Ending_Types.md
 */

"use client";

import React from "react";
import type { EndingType } from "@/types";

export interface EndingMessageProps {
  /** 엔딩 타입 */
  endingType: EndingType;
  /** 엔딩 메시지 */
  message: string;
  /** 최종 점수 */
  totalScore: number;
}

/**
 * 엔딩 메시지 컴포넌트
 *
 * 사용 예시:
 * <EndingMessage
 *   endingType="love"
 *   message="완벽해! 우리 완전 찰떡궁합이야! 💕"
 *   totalScore={95}
 * />
 */
export default function EndingMessage({
  endingType,
  message,
  totalScore,
}: EndingMessageProps) {
  // 엔딩별 스타일 정의
  const endingStyles: Record<
    EndingType,
    {
      gradient: string;
      icon: string;
      title: string;
      titleColor: string;
    }
  > = {
    love: {
      gradient: "from-pink-400 via-red-400 to-pink-500",
      icon: "💕",
      title: "LOVE",
      titleColor: "text-pink-600",
    },
    cute_upset: {
      gradient: "from-yellow-400 via-orange-400 to-yellow-500",
      icon: "😤",
      title: "UPSET",
      titleColor: "text-orange-600",
    },
    breakup: {
      gradient: "from-gray-400 via-gray-500 to-gray-600",
      icon: "💔",
      title: "BREAKUP",
      titleColor: "text-gray-600",
    },
  };

  const style = endingStyles[endingType];

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* 헤더 그라데이션 */}
      <div className={`bg-gradient-to-r ${style.gradient} p-8 text-center`}>
        <div className="text-7xl mb-4">{style.icon}</div>
        <h2 className={`text-4xl font-bold text-white mb-2`}>
          {style.title}
        </h2>
        <p className="text-white text-lg opacity-90">
          당신의 점수: {totalScore}점
        </p>
      </div>

      {/* 예리 프로필 */}
      <div className="p-6 bg-gray-50">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-pink-200 rounded-full flex items-center justify-center text-4xl">
            {style.icon}
          </div>
          <div>
            <div className="font-bold text-xl text-gray-800">예리</div>
            <div className="text-sm text-gray-600">Red Velvet</div>
          </div>
        </div>

        {/* 말풍선 */}
        <div className="relative bg-white rounded-2xl p-6 shadow-md">
          {/* 말풍선 꼬리 */}
          <div className="absolute -top-3 left-8 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-b-[15px] border-b-white"></div>

          <p className="text-lg leading-relaxed text-gray-800">{message}</p>
        </div>
      </div>

      {/* 엔딩별 추가 메시지 */}
      <div className="p-6 bg-gradient-to-r from-pink-50 to-purple-50">
        {endingType === "love" && (
          <p className="text-center text-gray-700">
            🎉 완벽한 감정 관찰력! 예리와의 데이트 성공!
          </p>
        )}
        {endingType === "cute_upset" && (
          <p className="text-center text-gray-700">
            😅 아쉽지만 괜찮아요! 다음엔 더 잘할 수 있어요!
          </p>
        )}
        {endingType === "breakup" && (
          <p className="text-center text-gray-700">
            💔 이번엔 아쉽네요... 다시 도전해보세요!
          </p>
        )}
      </div>
    </div>
  );
}
