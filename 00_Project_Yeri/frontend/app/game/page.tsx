/**
 * app/game/page.tsx
 * 게임 진행 페이지
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  GameHeader,
  ImageComparison,
  DialogueBox,
  AnswerInput,
} from "@/components/game";
import { ProgressBar, Timer, Popup, usePopup, Button } from "@/components/ui";
import type { TurnIndex, EmotionStage, GameMode, InputType } from "@/types";
import { GAME_MODES } from "@/lib/constants";

export default function GamePage() {
  const router = useRouter();
  const { popupState, showPopup, hidePopup } = usePopup();

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
  const [timerResetTrigger, setTimerResetTrigger] = useState(0);

  // 현재 대사
  const [currentDialogue, setCurrentDialogue] = useState(
    "안녕! 나 예리야. 뭔가 달라진 거 알아챌 수 있을까?"
  );

  // 턴 시작 시 타이머 리셋
  useEffect(() => {
    setRemainingTime(turnTimeLimit);
    setTimerResetTrigger((prev) => prev + 1);
    setIsTimerActive(true);

    // 턴별 대사 설정
    const dialogues: Record<TurnIndex, string> = {
      1: "안녕! 나 예리야. 뭔가 달라진 거 알아챌 수 있을까?",
      2: "어? 뭔가 눈치챈 것 같은데? 더 자세히 봐봐!",
      3: "마지막 기회야! 정확히 뭐가 바뀌었는지 말해줘!",
    };
    setCurrentDialogue(dialogues[currentTurn]);
  }, [currentTurn, turnTimeLimit]);

  // 답변 제출 처리
  const handleAnswerSubmit = (answer: string, inputType: InputType) => {
    console.log(`답변 제출: ${answer} (${inputType})`);

    // 타이머 중지
    setIsTimerActive(false);

    // TODO: 실제로는 EEVE API 호출
    // 임시로 랜덤 점수 계산
    const isCorrect = Math.random() > 0.3;
    const turnScore = isCorrect ? 15 : 5;

    // 예리스러운 메시지 랜덤 선택
    const correctMessages = [
      "역시 우리 오빠 최고~! 💕",
      "내 사랑~ 완전 똑똑해! 😍",
      "알라뷰~ 오빠! 💖",
      "오빠 감각 대박! 설레는데? 💓",
      "와! 진짜 센스있다! 😘",
      "오빠만 믿어~ 💕",
      "완전 찰떡이야! 🥰",
    ];

    const wrongMessages = [
      "앗.. 아쉬운데? 😢",
      "음.. 그건 아닌 것 같은데! 🤔",
      "오빠 집중해봐! 💭",
      "헉, 다시 한번 생각해봐! 😅",
      "아쉽다~ 다음엔 잘할 수 있어! 😊",
      "어머.. 오빠 괜찮아? 😮",
    ];

    if (isCorrect) {
      setCurrentScore((prev) => prev + turnScore);
      setComboCount((prev) => prev + 1);
      const randomMessage =
        correctMessages[Math.floor(Math.random() * correctMessages.length)];
      showPopup(randomMessage, "correct");

      // 감정 단계 상승
      if (emotionStage === "S0") setEmotionStage("S1");
      else if (emotionStage === "S1") setEmotionStage("S2");
      else if (emotionStage === "S2") setEmotionStage("S3");
    } else {
      setCurrentScore((prev) => prev + turnScore);
      setComboCount(0);
      const randomMessage =
        wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
      showPopup(randomMessage, "wrong");
    }

    // 1.5초 후 팝업 닫기
    setTimeout(() => {
      hidePopup();
    }, 1500);

    // 2초 후 다음 턴 또는 종료
    setTimeout(() => {
      if (currentTurn < 3) {
        setCurrentTurn((prev) => (prev + 1) as TurnIndex);
      } else {
        // 게임 종료 - 메인 페이지로 이동 (결과 화면으로)
        router.push("/");
      }
    }, 2000);
  };

  // 힌트 요청
  const handleHintRequest = () => {
    showPopup("힌트: 헤어스타일을 자세히 봐봐!", "hint");
  };

  // 타임아웃 처리
  const handleTimeout = () => {
    showPopup("시간 초과! 다음 턴으로 넘어갑니다.", "info");
    setComboCount(0);

    // 1.5초 후 팝업 닫기
    setTimeout(() => {
      hidePopup();
    }, 1500);

    // 2초 후 다음 턴 또는 종료
    setTimeout(() => {
      if (currentTurn < 3) {
        setCurrentTurn((prev) => (prev + 1) as TurnIndex);
      } else {
        // 게임 종료 - 메인 페이지로 이동
        router.push("/");
      }
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
            beforeUrl="/images/test01_before.png"
            afterUrl="/images/test01_after.png"
            turnIndex={currentTurn}
          />

          {/* 진행 바 (이미지 위에 오버레이) */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <ProgressBar
              remainingTime={remainingTime}
              totalTime={turnTimeLimit}
              emotionStage={emotionStage}
            />
          </div>
        </div>

        {/* 대사 박스 */}
        <DialogueBox
          dialogue={currentDialogue}
          emotionStage={emotionStage}
          enableTyping={false}
        />

        {/* 답변 입력 */}
        <AnswerInput
          onSubmit={handleAnswerSubmit}
          onHintRequest={handleHintRequest}
          disabled={!isTimerActive}
          hintAvailable={true}
        />
      </div>

      {/* 타이머 (UI 없음 - 로직만) */}
      <Timer
        totalTime={turnTimeLimit}
        isActive={isTimerActive}
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

      {/* 디버그 버튼 (임시) */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => router.push("/")}
        >
          홈으로
        </Button>
      </div>
    </div>
  );
}
