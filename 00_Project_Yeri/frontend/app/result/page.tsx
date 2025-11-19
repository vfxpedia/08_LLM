/**
 * app/result/page.tsx
 * 결과 페이지 (독립 라우트)
 */

"use client";

import { useRouter } from "next/navigation";
import { ResultScreen } from "@/components/result";
import type { FinalScore } from "@/types";

export default function ResultPage() {
  const router = useRouter();

  // TODO: 실제로는 게임 완료 시 전달받은 데이터 사용
  // 현재는 Mock 데이터로 테스트
  const mockFinalScore: FinalScore = {
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
  };

  const handleRestart = () => {
    router.push("/");
  };

  return (
    <ResultScreen
      nickname="플레이어"
      finalScore={mockFinalScore}
      onRestart={handleRestart}
    />
  );
}
