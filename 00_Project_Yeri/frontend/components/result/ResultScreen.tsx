/**
 * ResultScreen.tsx
 * 게임 결과 화면 컴포넌트
 * 참조: docs/05_UI_UX_Design.md
 */

"use client";

import React from "react";
import { Button } from "@/components/ui";
import EndingMessage from "./EndingMessage";
import ScoreBreakdown from "./ScoreBreakdown";
import ShareButton from "./ShareButton";
import type { FinalScore } from "@/types";

export interface ResultScreenProps {
  /** 플레이어 닉네임 */
  nickname: string;
  /** 최종 점수 */
  finalScore: FinalScore;
  /** 다시하기 콜백 */
  onRestart: () => void;
}

/**
 * 게임 결과 화면 컴포넌트
 *
 * 사용 예시:
 * <ResultScreen
 *   nickname="루비"
 *   finalScore={session.finalScore}
 *   onRestart={() => resetGame()}
 * />
 */
export default function ResultScreen({
  nickname,
  finalScore,
  onRestart,
}: ResultScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* 타이틀 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-2">
            게임 결과
          </h1>
          <p className="text-xl text-gray-700">{nickname}님의 결과입니다</p>
        </div>

        {/* 엔딩 메시지 */}
        <EndingMessage
          endingType={finalScore.endingType}
          message={finalScore.endingMessage}
          totalScore={finalScore.totalScore}
        />

        {/* 점수 분석 */}
        <ScoreBreakdown
          turnScores={finalScore.turnScores}
          totalScore={finalScore.totalScore}
        />

        {/* SNS 공유 */}
        <ShareButton
          nickname={nickname}
          totalScore={finalScore.totalScore}
          endingType={finalScore.endingType}
        />

        {/* 다시하기 버튼 */}
        <div className="flex gap-4">
          <Button variant="secondary" fullWidth size="lg" onClick={onRestart}>
            🔄 다시하기
          </Button>
        </div>

        {/* 푸터 */}
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>예리는 못 말려 - 감정 관찰 게임</p>
          <p className="mt-1">Red Velvet 예리와 함께하는 데이트 시뮬레이션</p>
        </div>
      </div>
    </div>
  );
}
