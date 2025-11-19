/**
 * GameHeader.tsx
 * 게임 헤더 컴포넌트 (턴 표시 + 점수)
 * 참조: docs/05_UI_UX_Design.md
 */

import React from "react";
import { TurnIndex } from "@/types";

export interface GameHeaderProps {
  /** 현재 턴 (1, 2, 3) */
  currentTurn: TurnIndex;
  /** 현재 점수 */
  currentScore: number;
  /** 현재 콤보 수 */
  comboCount: number;
}

/**
 * 게임 헤더 컴포넌트
 *
 * 기능:
 * - 현재 턴 표시 (1/3, 2/3, 3/3)
 * - 누적 점수 표시
 * - 콤보 표시 (2콤보 이상일 때)
 *
 * 사용 예시:
 * <GameHeader
 *   currentTurn={2}
 *   currentScore={45}
 *   comboCount={2}
 * />
 */
export default function GameHeader({
  currentTurn,
  currentScore,
  comboCount,
}: GameHeaderProps) {
  return (
    <header className="w-full bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500 shadow-lg">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* 턴 표시 */}
        <div className="flex items-center gap-2">
          <span className="text-white font-bold text-lg">
            턴 {currentTurn}/3
          </span>

          {/* 턴 인디케이터 */}
          <div className="flex gap-1.5">
            {[1, 2, 3].map((turn) => (
              <div
                key={turn}
                className={`
                  w-3 h-3 rounded-full
                  transition-all duration-300
                  ${
                    turn <= currentTurn
                      ? "bg-white scale-110"
                      : "bg-white/30 scale-90"
                  }
                `}
              />
            ))}
          </div>
        </div>

        {/* 점수 표시 */}
        <div className="flex items-center gap-4">
          {/* 콤보 (2콤보 이상일 때만 표시) */}
          {comboCount >= 2 && (
            <div className="flex items-center gap-1 animate-pulseScale">
              <span className="text-2xl">🔥</span>
              <span className="text-yellow-300 font-bold text-lg">
                {comboCount} COMBO!
              </span>
            </div>
          )}

          {/* 현재 점수 */}
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 border-2 border-white/50">
            <span className="text-white font-bold text-xl">
              {currentScore}점
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
