/**
 * 컴포넌트 테스트 페이지
 * URL: http://localhost:3000/test
 */

"use client";

import { useState } from "react";
import Image from "next/image";
import { Button, ProgressBar, Timer, Popup, usePopup } from "@/components/ui";
import { GameHeader, ImageComparison, DialogueBox, AnswerInput } from "@/components/game";
import type { EmotionStage, TurnIndex } from "@/types";
import testBefore from "@/src/assets/yeri/test01_before.png";
import testAfter from "@/src/assets/yeri/test01_after.png";

export default function TestPage() {
  const [selectedTest, setSelectedTest] = useState<string>("ui");

  // UI 컴포넌트 테스트 상태
  const [remainingTime, setRemainingTime] = useState(10);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timerResetTrigger, setTimerResetTrigger] = useState(0);
  const { popupState, showPopup, hidePopup } = usePopup();

  // 게임 컴포넌트 테스트 상태
  const [currentTurn, setCurrentTurn] = useState<TurnIndex>(1);
  const [currentScore, setCurrentScore] = useState(0);
  const [comboCount, setComboCount] = useState(0);
  const [emotionStage, setEmotionStage] = useState<EmotionStage>("S2");

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        {/* 헤더 */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-pink-600 mb-2">
            🧪 컴포넌트 테스트 페이지
          </h1>
          <p className="text-gray-600">
            Phase 5-6 컴포넌트들을 실제로 테스트해볼 수 있습니다.
          </p>
        </div>

        {/* 탭 선택 */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setSelectedTest("ui")}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              selectedTest === "ui"
                ? "bg-pink-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            UI 컴포넌트 (Phase 5)
          </button>
          <button
            onClick={() => setSelectedTest("game")}
            className={`px-6 py-3 rounded-lg font-bold transition-all ${
              selectedTest === "game"
                ? "bg-pink-500 text-white shadow-lg"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            게임 컴포넌트 (Phase 6)
          </button>
        </div>

        {/* UI 컴포넌트 테스트 */}
        {selectedTest === "ui" && (
          <div className="space-y-6">
            {/* Button 테스트 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">1. Button 컴포넌트</h2>
              <div className="flex flex-wrap gap-4">
                <Button variant="primary">Primary 버튼</Button>
                <Button variant="secondary">Secondary 버튼</Button>
                <Button variant="hint" icon="💡">Hint 버튼</Button>
                <Button variant="danger">Danger 버튼</Button>
                <Button variant="primary" size="sm">Small</Button>
                <Button variant="primary" size="lg">Large</Button>
                <Button variant="primary" isLoading>로딩 중...</Button>
                <Button variant="primary" disabled>비활성화</Button>
              </div>
            </div>

            {/* ProgressBar 테스트 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">2. ProgressBar 컴포넌트</h2>
              <div className="space-y-4">
                <ProgressBar
                  remainingTime={remainingTime}
                  totalTime={10}
                  emotionStage="S2"
                />
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setRemainingTime(Math.max(0, remainingTime - 1))}
                  >
                    -1초
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setRemainingTime(Math.min(10, remainingTime + 1))}
                  >
                    +1초
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => setRemainingTime(10)}
                  >
                    리셋
                  </Button>
                </div>
              </div>
            </div>

            {/* Timer 테스트 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">3. Timer 컴포넌트</h2>
              <div className="space-y-4">
                <div className="text-lg font-bold">
                  남은 시간: {remainingTime.toFixed(1)}초
                </div>
                <Timer
                  totalTime={10}
                  isActive={isTimerActive}
                  onTick={(time) => setRemainingTime(time)}
                  onComplete={() => {
                    setIsTimerActive(false);
                    showPopup("시간 종료!", "info");
                  }}
                  resetTrigger={timerResetTrigger}
                />
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={() => setIsTimerActive(true)}
                    disabled={isTimerActive}
                  >
                    시작
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => setIsTimerActive(false)}
                    disabled={!isTimerActive}
                  >
                    중지
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setIsTimerActive(false);
                      setRemainingTime(10);
                      setTimerResetTrigger(prev => prev + 1);
                    }}
                  >
                    리셋
                  </Button>
                </div>
              </div>
            </div>

            {/* Popup 테스트 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">4. Popup 컴포넌트</h2>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="primary"
                  onClick={() => showPopup("정답입니다! +15점", "correct")}
                >
                  정답 팝업
                </Button>
                <Button
                  variant="danger"
                  onClick={() => showPopup("틀렸습니다!", "wrong")}
                >
                  오답 팝업
                </Button>
                <Button
                  variant="primary"
                  onClick={() => showPopup("🔥 3 COMBO!", "combo")}
                >
                  콤보 팝업
                </Button>
                <Button
                  variant="hint"
                  onClick={() => showPopup("힌트: 헤어스타일을 확인해보세요!", "hint")}
                >
                  힌트 팝업
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => showPopup("게임 정보입니다", "info")}
                >
                  정보 팝업
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* 게임 컴포넌트 테스트 */}
        {selectedTest === "game" && (
          <div className="space-y-6">
            {/* 컨트롤 패널 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">컨트롤 패널</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2">턴</label>
                  <div className="flex gap-2">
                    {[1, 2, 3].map((turn) => (
                      <Button
                        key={turn}
                        variant={currentTurn === turn ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setCurrentTurn(turn as TurnIndex)}
                      >
                        {turn}턴
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">감정 단계</label>
                  <div className="flex gap-2">
                    {["S0", "S1", "S2", "S3", "S4"].map((stage) => (
                      <Button
                        key={stage}
                        variant={emotionStage === stage ? "primary" : "secondary"}
                        size="sm"
                        onClick={() => setEmotionStage(stage as EmotionStage)}
                      >
                        {stage}
                      </Button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">점수</label>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setCurrentScore(Math.max(0, currentScore - 10))}
                    >
                      -10
                    </Button>
                    <span className="px-4 py-2 bg-gray-100 rounded font-bold">
                      {currentScore}점
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setCurrentScore(currentScore + 10)}
                    >
                      +10
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2">콤보</label>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setComboCount(Math.max(0, comboCount - 1))}
                    >
                      -1
                    </Button>
                    <span className="px-4 py-2 bg-gray-100 rounded font-bold">
                      {comboCount}콤보
                    </span>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setComboCount(comboCount + 1)}
                    >
                      +1
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* GameHeader 테스트 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold">1. GameHeader 컴포넌트</h2>
              </div>
              <GameHeader
                currentTurn={currentTurn}
                currentScore={currentScore}
                comboCount={comboCount}
              />
            </div>

            {/* ImageComparison 테스트 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">2. ImageComparison 컴포넌트</h2>
              <p className="text-gray-600 mb-4">
                현재 턴: {currentTurn}턴 - {currentTurn === 1 ? "After만 표시" : "Before/After 분할"}
              </p>
              <div className="h-96 bg-gray-900 rounded-lg overflow-hidden">
                <ImageComparison
                  beforeUrl={testBefore.src}
                  afterUrl={testAfter.src}
                  turnIndex={currentTurn}
                />
              </div>
              <p className="text-sm text-green-600 mt-2">
                ✅ 실제 테스트 이미지 사용 중 (test01_before.png, test01_after.png)
              </p>
            </div>

            {/* DialogueBox 테스트 */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4">3. DialogueBox 컴포넌트</h2>
              <DialogueBox
                dialogue="오 뭔가 다른데? 뭐가 바뀐 거 같아! 힌트를 줄까?"
                emotionStage={emotionStage}
                enableTyping={false}
              />
              <div className="mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    // 타이핑 효과를 보려면 컴포넌트를 다시 마운트해야 함
                    alert("타이핑 효과는 페이지 새로고침 시 enableTyping={true}로 테스트 가능");
                  }}
                >
                  타이핑 효과 테스트
                </Button>
              </div>
            </div>

            {/* AnswerInput 테스트 */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold">4. AnswerInput 컴포넌트</h2>
              </div>
              <AnswerInput
                onSubmit={(answer, type) => {
                  showPopup(`답변: "${answer}" (${type === "text" ? "텍스트" : "음성"})`, "info");
                }}
                onHintRequest={() => {
                  showPopup("힌트: 헤어스타일을 확인해보세요!", "hint");
                }}
                hintAvailable={true}
              />
            </div>
          </div>
        )}

        {/* Popup 렌더링 */}
        <Popup
          message={popupState.message}
          type={popupState.type}
          isVisible={popupState.isVisible}
          onClose={hidePopup}
          icon={popupState.icon}
        />
      </div>
    </div>
  );
}
