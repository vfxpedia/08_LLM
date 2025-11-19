/**
 * ModeSelector.tsx
 * 게임 모드 선택 컴포넌트
 * 참조: docs/01_Game_Structure.md
 */

"use client";

import React from "react";
import { GameMode } from "@/types";
import { GAME_MODES } from "@/lib/constants";

export interface ModeSelectorProps {
  /** 선택된 모드 */
  selectedMode: GameMode;
  /** 모드 선택 콜백 */
  onSelectMode: (mode: GameMode) => void;
}

/**
 * 게임 모드 선택 컴포넌트
 *
 * 사용 예시:
 * <ModeSelector
 *   selectedMode="quick_date"
 *   onSelectMode={(mode) => setGameMode(mode)}
 * />
 */
export default function ModeSelector({
  selectedMode,
  onSelectMode,
}: ModeSelectorProps) {
  const modes = [GAME_MODES.QUICK_DATE, GAME_MODES.LONG_DATE];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 text-center">
        게임 모드 선택
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modes.map((mode) => {
          const isSelected = selectedMode === mode.id;

          return (
            <button
              key={mode.id}
              onClick={() => onSelectMode(mode.id as GameMode)}
              className={`
                p-6 rounded-2xl
                border-4 transition-all duration-300
                ${
                  isSelected
                    ? "border-pink-500 bg-pink-50 shadow-xl scale-105"
                    : "border-gray-200 bg-white hover:border-pink-300 hover:shadow-lg"
                }
              `}
            >
              {/* 아이콘 */}
              <div className="text-5xl mb-3">{mode.icon}</div>

              {/* 모드 이름 */}
              <h3
                className={`text-xl font-bold mb-2 ${
                  isSelected ? "text-pink-600" : "text-gray-800"
                }`}
              >
                {mode.name}
              </h3>

              {/* 설명 */}
              <p className="text-gray-600 text-sm mb-3">{mode.displayText}</p>

              {/* 턴 정보 */}
              <div className="text-xs text-gray-500 bg-gray-100 rounded-lg p-2">
                {mode.turnLimits[1]}초 → {mode.turnLimits[2]}초 →{" "}
                {mode.turnLimits[3]}초
              </div>

              {/* 선택 표시 */}
              {isSelected && (
                <div className="mt-3 text-pink-600 font-bold flex items-center justify-center gap-2">
                  <span>✓</span>
                  <span>선택됨</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
