/**
 * AnswerInput.tsx
 * 플레이어 답변 입력 컴포넌트 (텍스트/음성)
 * 참조: docs/05_UI_UX_Design.md
 */

"use client";

import React, { useState, useRef } from "react";
import { Button } from "@/components/ui";
import { InputType } from "@/types";

export interface AnswerInputProps {
  /** 입력 제출 콜백 */
  onSubmit: (answer: string, inputType: InputType) => void;
  /** 힌트 요청 콜백 */
  onHintRequest?: () => void;
  /** 입력 비활성화 */
  disabled?: boolean;
  /** 힌트 사용 가능 여부 */
  hintAvailable?: boolean;
  /** 플레이스홀더 텍스트 */
  placeholder?: string;
}

/**
 * 답변 입력 컴포넌트
 *
 * 기능:
 * - 텍스트 입력
 * - 음성 녹음 (Web Speech API)
 * - 힌트 요청
 *
 * 사용 예시:
 * <AnswerInput
 *   onSubmit={(answer, type) => handleSubmit(answer, type)}
 *   onHintRequest={() => showHint()}
 *   hintAvailable={true}
 * />
 */
export default function AnswerInput({
  onSubmit,
  onHintRequest,
  disabled = false,
  hintAvailable = true,
  placeholder = "뭐가 바뀌었을까요? 입력해보세요!",
}: AnswerInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingError, setRecordingError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);

  // 텍스트 제출
  const handleTextSubmit = () => {
    if (!inputValue.trim()) return;

    onSubmit(inputValue.trim(), "text");
    setInputValue("");
  };

  // 음성 녹음 시작/중지
  const toggleRecording = () => {
    // Web Speech API 지원 확인
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setRecordingError("음성 인식이 지원되지 않는 브라우저입니다.");
      return;
    }

    if (isRecording) {
      // 녹음 중지
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // 녹음 시작
      setRecordingError(null);
      const recognition = new SpeechRecognition();
      recognition.lang = "ko-KR";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsRecording(false);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error:", event.error);
        setRecordingError("음성 인식 오류가 발생했습니다.");
        setIsRecording(false);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    }
  };

  // Enter 키 처리
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) {
      handleTextSubmit();
    }
  };

  return (
    <div className="w-full px-4 py-3 bg-white shadow-lg">
      <div className="max-w-4xl mx-auto">
        {/* 입력 영역 */}
        <div className="flex gap-2 mb-3">
          {/* 텍스트 입력 */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled || isRecording}
              className={`
                w-full px-4 py-3
                border-2 border-pink-300
                rounded-xl
                focus:outline-none focus:border-pink-500
                transition-colors
                ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}
                ${isRecording ? "bg-red-50 border-red-400" : ""}
              `}
            />

            {/* 녹음 중 표시 */}
            {isRecording && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <span className="text-red-500 text-sm font-bold animate-pulse">
                  녹음 중...
                </span>
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              </div>
            )}
          </div>

          {/* 음성 녹음 버튼 */}
          <Button
            variant={isRecording ? "danger" : "secondary"}
            onClick={toggleRecording}
            disabled={disabled}
            icon={<span className="text-xl">{isRecording ? "⏹️" : "🎤"}</span>}
            aria-label={isRecording ? "녹음 중지" : "음성 녹음"}
          >
            {isRecording ? "중지" : "녹음"}
          </Button>

          {/* 제출 버튼 */}
          <Button
            variant="primary"
            onClick={handleTextSubmit}
            disabled={disabled || !inputValue.trim()}
            icon={<span className="text-xl">📝</span>}
          >
            제출
          </Button>
        </div>

        {/* 하단 버튼 영역 */}
        <div className="flex justify-between items-center">
          {/* 힌트 버튼 */}
          {onHintRequest && (
            <Button
              variant="hint"
              size="sm"
              onClick={onHintRequest}
              disabled={disabled || !hintAvailable}
              icon={<span className="text-lg">💡</span>}
            >
              힌트 보기
            </Button>
          )}

          {/* 에러 메시지 */}
          {recordingError && (
            <div className="text-red-500 text-sm">{recordingError}</div>
          )}

          {/* 입력 가이드 */}
          {!recordingError && (
            <div className="text-gray-500 text-sm ml-auto">
              텍스트 입력 또는 음성 녹음으로 답변하세요
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
