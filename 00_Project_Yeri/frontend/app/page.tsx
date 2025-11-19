/**
 * app/page.tsx
 * 메인 페이지 - 전체 게임 플로우 관리
 */

"use client";

import { useState } from "react";
import { StartScreen } from "@/components/start";
import { ResultScreen } from "@/components/result";
import type { GameMode, AgeGroup, FinalScore } from "@/types";

type GameState = "start" | "playing" | "result";

export default function Home() {
  // 전체 게임 상태
  const [gameState, setGameState] = useState<GameState>("start");

  // 플레이어 정보
  const [playerInfo, setPlayerInfo] = useState<{
    nickname: string;
    ageGroup: AgeGroup;
    gameMode: GameMode;
  } | null>(null);

  // 최종 결과 (임시 Mock 데이터)
  const [finalScore] = useState<FinalScore>({
    totalScore: 85,
    turnScores: [
      {
        turnIndex: 1,
        emotionalSense: 20,
        observation: 8,
        reflex: 5,
        emotionMultiplier: 1.0,
        comboBonus: 0,
        turnScore: 33,
      },
      {
        turnIndex: 2,
        emotionalSense: 18,
        observation: 7,
        reflex: 4,
        emotionMultiplier: 1.1,
        comboBonus: 2,
        turnScore: 31,
      },
      {
        turnIndex: 3,
        emotionalSense: 15,
        observation: 6,
        reflex: 3,
        emotionMultiplier: 0.9,
        comboBonus: 0,
        turnScore: 21,
      },
    ],
    endingType: "love",
    endingMessage: "완벽해! 우리 완전 찰떡궁합이야! 💕",
  });

  // 게임 시작
  const handleGameStart = (config: {
    gameMode: GameMode;
    nickname: string;
    ageGroup: AgeGroup;
  }) => {
    setPlayerInfo(config);
    // TODO: 실제로는 /game 페이지로 이동하고 데이터 전달
    // 현재는 임시로 바로 결과 화면으로
    setGameState("result");
  };

  // 다시하기
  const handleRestart = () => {
    setGameState("start");
    setPlayerInfo(null);
  };

  return (
    <>
      {/* 시작 화면 */}
      {gameState === "start" && <StartScreen onStart={handleGameStart} />}

      {/* 게임 진행 화면 */}
      {gameState === "playing" && (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">게임 진행 중...</h1>
            <p>게임 페이지는 /game 경로에서 확인 가능합니다</p>
          </div>
        </div>
      )}

      {/* 결과 화면 */}
      {gameState === "result" && playerInfo && (
        <ResultScreen
          nickname={playerInfo.nickname}
          finalScore={finalScore}
          onRestart={handleRestart}
        />
      )}

      {/* 개발용 네비게이션 */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        <a
          href="/test"
          className="px-4 py-2 bg-purple-500 text-white rounded-lg shadow-lg hover:bg-purple-600 text-sm font-bold"
        >
          🧪 테스트 페이지
        </a>
        <a
          href="/game"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 text-sm font-bold"
        >
          🎮 게임 페이지
        </a>
      </div>
    </>
  );
}
