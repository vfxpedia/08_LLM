/**
 * StartScreen.tsx
 * 게임 시작 화면 컴포넌트
 * 참조: docs/05_UI_UX_Design.md
 */

"use client";

import React, { useState } from "react";
import { GameMode, AgeGroup } from "@/types";
import { Button } from "@/components/ui";
import ModeSelector from "./ModeSelector";
import PlayerSetup from "./PlayerSetup";

export interface StartScreenProps {
  /** 게임 시작 콜백 */
  onStart: (config: {
    gameMode: GameMode;
    nickname: string;
    ageGroup: AgeGroup;
  }) => void;
}

/**
 * 게임 시작 화면 컴포넌트
 *
 * 진행 단계:
 * 1. 게임 모드 선택
 * 2. 플레이어 정보 입력
 * 3. 게임 시작
 *
 * 사용 예시:
 * <StartScreen
 *   onStart={({gameMode, nickname, ageGroup}) => startGame(...)}
 * />
 */
export default function StartScreen({ onStart }: StartScreenProps) {
  // 상태 관리
  const [gameMode, setGameMode] = useState<GameMode>("quick_date");
  const [nickname, setNickname] = useState<string>("");
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(null);
  const [step, setStep] = useState<1 | 2>(1); // 1: 모드 선택, 2: 정보 입력

  // 시작 가능 여부
  const canStart = nickname.trim().length > 0 && ageGroup !== null;

  // 게임 시작
  const handleStart = () => {
    if (!canStart) return;

    onStart({
      gameMode,
      nickname: nickname.trim(),
      ageGroup: ageGroup!,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-2xl p-8">
        {/* 타이틀 */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-pink-600 mb-3">
            예리는 못 말려 🎮
          </h1>
          <p className="text-xl text-gray-600">감정 관찰 게임</p>
        </div>

        {/* 진행 단계 표시 */}
        <div className="flex items-center justify-center gap-4 mb-8">
          <div
            className={`
            flex items-center gap-2
            ${step === 1 ? "text-pink-600" : "text-gray-400"}
          `}
          >
            <div
              className={`
              w-8 h-8 rounded-full flex items-center justify-center font-bold
              ${
                step === 1
                  ? "bg-pink-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }
            `}
            >
              1
            </div>
            <span className="font-bold">모드 선택</span>
          </div>

          <div className="w-12 h-1 bg-gray-200 rounded"></div>

          <div
            className={`
            flex items-center gap-2
            ${step === 2 ? "text-pink-600" : "text-gray-400"}
          `}
          >
            <div
              className={`
              w-8 h-8 rounded-full flex items-center justify-center font-bold
              ${
                step === 2
                  ? "bg-pink-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }
            `}
            >
              2
            </div>
            <span className="font-bold">정보 입력</span>
          </div>
        </div>

        {/* Step 1: 모드 선택 */}
        {step === 1 && (
          <div className="space-y-6">
            <ModeSelector
              selectedMode={gameMode}
              onSelectMode={setGameMode}
            />

            <Button
              variant="primary"
              fullWidth
              size="lg"
              onClick={() => setStep(2)}
            >
              다음 단계 →
            </Button>
          </div>
        )}

        {/* Step 2: 정보 입력 */}
        {step === 2 && (
          <div className="space-y-6">
            <PlayerSetup
              nickname={nickname}
              ageGroup={ageGroup}
              onNicknameChange={setNickname}
              onAgeGroupChange={setAgeGroup}
            />

            <div className="flex gap-3">
              <Button
                variant="secondary"
                fullWidth
                size="lg"
                onClick={() => setStep(1)}
              >
                ← 이전
              </Button>

              <Button
                variant="primary"
                fullWidth
                size="lg"
                onClick={handleStart}
                disabled={!canStart}
              >
                게임 시작! 🎮
              </Button>
            </div>

            {!canStart && (
              <p className="text-sm text-gray-500 text-center">
                닉네임과 연령대를 모두 입력해주세요
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
