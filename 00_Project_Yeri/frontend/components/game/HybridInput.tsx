/**
 * HybridInput.tsx
 * 텍스트 + 음성 하이브리드 입력 컴포넌트
 * 참조: docs/12_Game_Core_Design_Final.md Section 3
 */

"use client";

import React, { useState, useEffect, useRef } from "react";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import type { TurnIndex, InputType } from "@/types";

export interface HybridInputProps {
  /** 현재 턴 */
  currentTurn: TurnIndex;
  /** 입력 제출 콜백 */
  onSubmit: (content: string, inputType: InputType) => void;
  /** 음성 자동 활성화 여부 (턴 2-3) */
  autoActivateVoice?: boolean;
  /** 입력 비활성화 여부 */
  disabled?: boolean;
}

/**
 * 하이브리드 입력 컴포넌트
 *
 * 기능:
 * - 텍스트 입력 (채팅 형식)
 * - 음성 입력 (Web Speech API)
 * - 턴 2-3에서 음성 자동 활성화
 * - 실시간 음성→텍스트 변환 표시
 * - 연속 입력 지원
 *
 * 사용 예시:
 * <HybridInput
 *   currentTurn={2}
 *   onSubmit={(content, type) => addAnswer(content, type, 2)}
 *   autoActivateVoice={true}
 * />
 */
export default function HybridInput({
  currentTurn,
  onSubmit,
  autoActivateVoice = false,
  disabled = false,
}: HybridInputProps) {
  const [textInput, setTextInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  // 음성 입력 훅
  const {
    isListening,
    interimTranscript,
    finalTranscript,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
    isSupported: voiceSupported,
    error: voiceError,
  } = useVoiceInput({
    autoActivate: autoActivateVoice && currentTurn >= 2,
    continuous: true,
    onResult: (transcript) => {
      // 음성 인식 결과를 자동 제출
      if (transcript.trim().length > 0) {
        onSubmit(transcript.trim(), "voice");
      }
    },
  });

  // 텍스트 제출 핸들러
  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (textInput.trim().length === 0 || disabled) return;

    onSubmit(textInput.trim(), "text");
    setTextInput("");

    // 제출 후 즉시 포커스 복원
    setTimeout(() => {
      inputRef.current?.focus();
    }, 50);
  };

  // 음성 인식 결과 초기화
  useEffect(() => {
    resetTranscript();
  }, [currentTurn, resetTranscript]);

  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* 음성 인식 상태 표시 */}
      {voiceSupported && (
        <div className="mb-4 flex items-center justify-between bg-gray-800 rounded-xl px-6 py-4">
          <div className="flex items-center gap-3">
            {/* 마이크 아이콘 */}
            <div
              className={`
                text-3xl transition-all duration-300
                ${isListening ? "animate-pulse scale-110" : ""}
              `}
            >
              {isListening ? "🎤" : "🎙️"}
            </div>

            {/* 상태 텍스트 */}
            <div>
              <p className="text-white font-bold">
                {isListening ? "음성 인식 중..." : "음성 입력 대기"}
              </p>
              {interimTranscript && (
                <p className="text-gray-400 text-sm italic">
                  "{interimTranscript}"
                </p>
              )}
            </div>
          </div>

          {/* 음성 토글 버튼 */}
          <button
            onClick={toggleListening}
            disabled={disabled}
            className={`
              px-6 py-2 rounded-full font-bold
              transition-all duration-300
              ${
                isListening
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }
              ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105"}
            `}
          >
            {isListening ? "음성 중지" : "음성 시작"}
          </button>
        </div>
      )}

      {/* 음성 에러 표시 */}
      {voiceError && (
        <div className="mb-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg">
          <p className="text-sm">⚠️ {voiceError}</p>
        </div>
      )}

      {/* 텍스트 입력 */}
      <form onSubmit={handleTextSubmit} className="flex gap-3">
        <input
          ref={inputRef}
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          disabled={disabled}
          placeholder="예리에게 말해보세요... (예: 예리 가르마 바뀐 것 같아!)"
          autoFocus
          className="
            flex-1 px-6 py-4
            bg-white border-2 border-pink-300
            rounded-full
            text-gray-800 text-lg
            placeholder-gray-400
            focus:outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-300
            disabled:bg-gray-200 disabled:cursor-not-allowed
            transition-all duration-200
          "
          maxLength={100}
        />

        <button
          type="submit"
          disabled={disabled || textInput.trim().length === 0}
          className={`
            px-8 py-4
            bg-gradient-to-r from-pink-500 to-purple-500
            text-white text-lg font-bold
            rounded-full shadow-lg
            transition-all duration-300
            ${
              disabled || textInput.trim().length === 0
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105 hover:shadow-pink-500/50 active:scale-95"
            }
          `}
        >
          전송
        </button>
      </form>

      {/* 안내 문구 */}
      <div className="mt-4 text-center">
        <p className="text-gray-400 text-sm">
          {currentTurn === 1 && "⚡ 3초 안에 빠르게 말해보세요!"}
          {currentTurn === 2 && "💡 힌트를 사용하면 이전 모습을 볼 수 있어요!"}
          {currentTurn === 3 && "🔍 충분히 시간이 있어요. 자세히 비교해보세요!"}
        </p>

        {voiceSupported && currentTurn >= 2 && (
          <p className="text-pink-400 text-xs mt-2">
            💬 텍스트 입력과 음성 입력을 동시에 사용할 수 있어요!
          </p>
        )}
      </div>
    </div>
  );
}
