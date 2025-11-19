/**
 * app/game-new/page.tsx
 * 새로 재작성된 게임 페이지 (연속 입력 + 카드 플립 + 진행 상황 UI)
 * 참조: docs/12_Game_Core_Design_Final.md, docs/13_Core_Implementation_Guide.md
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  GameHeader,
  ImageComparison,
  DialogueBox,
  HybridInput,
} from "@/components/game";
import { ProgressBar, Timer, Popup, usePopup } from "@/components/ui";
import { usePlayerAnswers } from "@/hooks/usePlayerAnswers";
import { getRandomGameData } from "@/data/gameData";
import type { TurnIndex, EmotionStage, GameMode } from "@/types";
import { GAME_MODES } from "@/lib/constants";

export default function GameNewPage() {
  const router = useRouter();
  const { popupState, showPopup, hidePopup } = usePopup();
  const { answers, addAnswer, getCorrectCount, getAnswersByTurn } = usePlayerAnswers();

  // 게임 데이터
  const [gameData] = useState(() => getRandomGameData());
  const totalChanges = gameData.totalChanges;

  // 게임 상태
  const [currentTurn, setCurrentTurn] = useState<TurnIndex>(1);
  const [currentScore, setCurrentScore] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [emotionStage, setEmotionStage] = useState<EmotionStage>("S0");

  // 타이머 상태
  const gameMode: GameMode = "quick_date"; // TODO: 실제로는 전달받아야 함
  const turnTimeLimit = GAME_MODES.QUICK_DATE.turnLimits[currentTurn];
  const [remainingTime, setRemainingTime] = useState(turnTimeLimit);
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [timerResetTrigger, setTimerResetTrigger] = useState(0);

  // 힌트 상태 (2턴만)
  const [hintUsed, setHintUsed] = useState(false);

  // 현재 대사
  const [currentDialogue, setCurrentDialogue] = useState(
    "안녕! 나 예리야. 뭔가 달라진 거 알아챌 수 있을까?"
  );

  // 턴별 정답 개수
  const correctInTurn = getCorrectCount(currentTurn);

  // 턴 시작 시 타이머 리셋
  useEffect(() => {
    setRemainingTime(turnTimeLimit);
    setTimerResetTrigger((prev) => prev + 1);
    setIsTimerActive(true);
    setIsPaused(false);
    setHintUsed(false);

    // 턴별 대사 설정
    const dialogues: Record<TurnIndex, string> = {
      1: `오빠~ 3초 안에 빨리 맞춰봐!`,
      2: `음... 어려웠지? 이번엔 힌트도 줄게~ (${totalChanges}개 변화가 있어!)`,
      3: `마지막 기회야! 정확히 뭐가 바뀌었는지 말해줘! (${totalChanges}개 모두 찾아야 해)`,
    };
    setCurrentDialogue(dialogues[currentTurn]);
  }, [currentTurn, turnTimeLimit, totalChanges]);

  // 답변 제출 처리 (연속 입력 지원)
  const handleAnswerSubmit = (answer: string, inputType: "text" | "voice") => {
    console.log(`답변 제출: ${answer} (${inputType})`);

    // 답변 저장
    addAnswer(answer, inputType, currentTurn);

    // TODO: 실제로는 EEVE API 호출
    // 임시로 랜덤 점수 계산
    const isCorrect = Math.random() > 0.5;

    // 피드백 표시
    if (isCorrect) {
      const correctMessages = [
        "맞았어! 잘했어~!",
        "오빠 센스있다!",
        "역시! 우리 오빠 최고!",
        "완전 똑똑해! 설레는데?",
      ];
      const randomMessage = correctMessages[Math.floor(Math.random() * correctMessages.length)];
      showPopup(randomMessage, "correct");

      setComboCount((prev) => prev + 1);
    } else {
      const wrongMessages = [
        "음... 그건 아닌데?",
        "다시 생각해봐!",
        "아쉬워! 다시 도전!",
      ];
      const randomMessage = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
      showPopup(randomMessage, "wrong");

      setComboCount(0);
    }

    // 1초 후 팝업 닫기
    setTimeout(() => {
      hidePopup();
    }, 1000);

    // 모든 정답 맞추면 턴 조기 종료
    const updatedCorrectCount = correctInTurn + (isCorrect ? 1 : 0);
    if (updatedCorrectCount >= totalChanges) {
      setIsTimerActive(false);
      showPopup(`모든 정답을 찾았어! ${totalChanges}/${totalChanges} 🎉`, "combo");

      setTimeout(() => {
        hidePopup();
        moveToNextTurn();
      }, 2000);
    }
  };

  // 힌트 요청 (타이머 일시정지)
  const handleHintStart = () => {
    setIsPaused(true);
    setIsTimerActive(false);
  };

  // 힌트 종료 (타이머 재개)
  const handleHintEnd = () => {
    setIsPaused(false);
    setIsTimerActive(true);
  };

  // 다음 턴으로 이동
  const moveToNextTurn = () => {
    if (currentTurn < 3) {
      setCurrentTurn((prev) => (prev + 1) as TurnIndex);
    } else {
      // 게임 종료 - 결과 화면으로
      router.push("/result");
    }
  };

  // 타임아웃 처리
  const handleTimeout = () => {
    setIsTimerActive(false);

    const foundCount = correctInTurn;
    if (foundCount >= totalChanges) {
      showPopup("완벽해! 모든 정답을 찾았어!", "combo");
    } else {
      showPopup(`시간 초과! ${foundCount}/${totalChanges}개 찾았어요`, "info");
    }

    setComboCount(0);

    setTimeout(() => {
      hidePopup();
      moveToNextTurn();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* 게임 헤더 */}
      <GameHeader
        currentTurn={currentTurn}
        currentScore={currentScore}
        comboCount={comboCount}
      />

      {/* 메인 게임 영역 */}
      <div className="flex-1 flex flex-col">
        {/* 이미지 비교 영역 */}
        <div className="flex-1 relative">
          <ImageComparison
            beforeUrl={gameData.beforeImage}
            afterUrl={gameData.afterImage}
            turnIndex={currentTurn}
            canUseHint={currentTurn === 2 && !hintUsed}
            onHintStart={handleHintStart}
            onHintEnd={handleHintEnd}
          />

          {/* 진행 바 (이미지 위에 오버레이) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <ProgressBar
              remainingTime={remainingTime}
              totalTime={turnTimeLimit}
              emotionStage={emotionStage}
            />
          </div>

          {/* 진행 상황 UI (우측 상단) */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl px-6 py-4">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-1">찾은 변화</p>
              <p className="text-4xl font-bold">
                <span className="text-pink-600">{correctInTurn}</span>
                <span className="text-gray-400 mx-1">/</span>
                <span className="text-gray-700">{totalChanges}</span>
              </p>
              {correctInTurn < totalChanges && (
                <p className="text-xs text-gray-500 mt-1">
                  {totalChanges - correctInTurn}개 더 찾아야 해요!
                </p>
              )}
              {correctInTurn >= totalChanges && (
                <p className="text-xs text-green-600 mt-1 font-bold">
                  완벽! 🎉
                </p>
              )}
            </div>
          </div>
        </div>

        {/* 대사 박스 */}
        <DialogueBox
          dialogue={currentDialogue}
          emotionStage={emotionStage}
          enableTyping={false}
        />

        {/* 하이브리드 입력 */}
        <HybridInput
          currentTurn={currentTurn}
          onSubmit={handleAnswerSubmit}
          autoActivateVoice={currentTurn >= 2}
          disabled={!isTimerActive || isPaused}
        />
      </div>

      {/* 타이머 (UI 없음 - 로직만) */}
      <Timer
        totalTime={turnTimeLimit}
        isActive={isTimerActive && !isPaused}
        onTick={setRemainingTime}
        onComplete={handleTimeout}
        resetTrigger={timerResetTrigger}
      />

      {/* 팝업 */}
      <Popup
        message={popupState.message}
        type={popupState.type}
        isVisible={popupState.isVisible}
        onClose={hidePopup}
      />
    </div>
  );
}
