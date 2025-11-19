/**
 * ScoreBreakdown.tsx
 * 점수 상세 분석 컴포넌트
 * 참조: docs/02_Score_System_Detail.md
 */

"use client";

import React from "react";
import type { ScoreSnapshot } from "@/types";

export interface ScoreBreakdownProps {
  /** 턴별 점수 리스트 */
  turnScores: ScoreSnapshot[];
  /** 최종 점수 */
  totalScore: number;
}

/**
 * 점수 상세 분석 컴포넌트
 *
 * 사용 예시:
 * <ScoreBreakdown
 *   turnScores={session.finalScore.turnScores}
 *   totalScore={session.finalScore.totalScore}
 * />
 */
export default function ScoreBreakdown({
  turnScores,
  totalScore,
}: ScoreBreakdownProps) {
  // 전체 턴의 점수를 합산
  const totalEmotionalSense = turnScores.reduce(
    (sum, turn) => sum + turn.emotionalSense,
    0
  );
  const totalObservation = turnScores.reduce(
    (sum, turn) => sum + turn.observation,
    0
  );
  const totalReflex = turnScores.reduce((sum, turn) => sum + turn.reflex, 0);
  const totalComboBonus = turnScores.reduce(
    (sum, turn) => sum + turn.comboBonus,
    0
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        📊 점수 분석
      </h2>

      {/* 합산 점수 표시 */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6 mb-6">
        {/* 점수 세부 사항 */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {/* 감정센스 */}
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-gray-600 text-sm mb-2">💕 감정센스</div>
            <div className="text-3xl font-bold text-pink-600">
              {totalEmotionalSense}
            </div>
            <div className="text-xs text-gray-500 mt-1">점</div>
          </div>

          {/* 관찰력 */}
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-gray-600 text-sm mb-2">👀 관찰력</div>
            <div className="text-3xl font-bold text-blue-600">
              {totalObservation}
            </div>
            <div className="text-xs text-gray-500 mt-1">점</div>
          </div>

          {/* 순발력 */}
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-gray-600 text-sm mb-2">⚡ 순발력</div>
            <div className="text-3xl font-bold text-green-600">
              {totalReflex}
            </div>
            <div className="text-xs text-gray-500 mt-1">점</div>
          </div>
        </div>

        {/* 콤보 보너스 */}
        {totalComboBonus > 0 && (
          <div className="bg-yellow-100 rounded-lg p-3 flex items-center justify-center gap-2">
            <span className="text-2xl">🔥</span>
            <span className="font-bold text-yellow-700 text-lg">
              콤보 보너스 +{totalComboBonus}점
            </span>
          </div>
        )}
      </div>

      {/* 최종 점수 */}
      <div className="bg-gradient-to-r from-pink-500 to-purple-500 rounded-2xl p-6 text-white text-center">
        <div className="text-sm mb-2">최종 점수</div>
        <div className="text-5xl font-bold">{totalScore}점</div>
        <div className="text-sm mt-2 opacity-90">(최대 100점)</div>
      </div>
    </div>
  );
}
