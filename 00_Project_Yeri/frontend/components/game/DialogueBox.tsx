/**
 * DialogueBox.tsx
 * 예리 대사 박스 컴포넌트
 * 참조: docs/05_UI_UX_Design.md, docs/03_Emotion_Stages.md
 */

"use client";

import React, { useEffect, useState } from "react";
import { EmotionStage } from "@/types";
import { EMOTION_STAGES } from "@/lib/constants";

export interface DialogueBoxProps {
  /** 예리 대사 */
  dialogue: string;
  /** 현재 감정 단계 */
  emotionStage: EmotionStage;
  /** 음성 URL (선택) */
  voiceUrl?: string;
  /** 타이핑 효과 활성화 */
  enableTyping?: boolean;
  /** 타이핑 속도 (ms) */
  typingSpeed?: number;
}

/**
 * 예리 대사 박스 컴포넌트
 *
 * 기능:
 * - 예리 대사 표시
 * - 감정 단계에 따른 아이콘/색상 변화
 * - 타이핑 효과 (선택)
 * - 음성 재생 (선택)
 *
 * 사용 예시:
 * <DialogueBox
 *   dialogue="오 뭔가 다른데? 뭐가 바뀐 거 같아!"
 *   emotionStage="S2"
 *   enableTyping={true}
 * />
 */
export default function DialogueBox({
  dialogue,
  emotionStage,
  voiceUrl,
  enableTyping = false,
  typingSpeed = 50,
}: DialogueBoxProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(!enableTyping);

  // 감정 정보 가져오기
  const emotion = EMOTION_STAGES[emotionStage];

  // 타이핑 효과
  useEffect(() => {
    if (!enableTyping) {
      setDisplayedText(dialogue);
      setIsTypingComplete(true);
      return;
    }

    setDisplayedText("");
    setIsTypingComplete(false);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= dialogue.length) {
        setDisplayedText(dialogue.slice(0, currentIndex));
        currentIndex++;
      } else {
        setIsTypingComplete(true);
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => clearInterval(interval);
  }, [dialogue, enableTyping, typingSpeed]);

  // 감정 단계별 배경색
  const emotionColors: Record<EmotionStage, string> = {
    S0: "from-gray-500 to-gray-600",
    S1: "from-blue-400 to-blue-500",
    S2: "from-green-400 to-green-500",
    S3: "from-yellow-400 to-orange-500",
    S4: "from-pink-500 to-red-500",
  };

  return (
    <div className="w-full px-4 py-3">
      <div
        className={`
          bg-gradient-to-r ${emotionColors[emotionStage]}
          text-white
          rounded-2xl
          shadow-lg
          p-5
          relative
          animate-slideInUp
        `}
      >
        {/* 예리 프로필 */}
        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-md">
            {emotion.icon}
          </div>
          <div>
            <div className="font-bold text-lg">예리</div>
            <div className="text-sm text-white/80">{emotion.name}</div>
          </div>

          {/* 음성 재생 버튼 (음성 URL이 있을 때) */}
          {voiceUrl && (
            <button
              className="ml-auto bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors"
              onClick={() => {
                const audio = new Audio(voiceUrl);
                audio.play();
              }}
              aria-label="음성 재생"
            >
              <span className="text-xl">🔊</span>
            </button>
          )}
        </div>

        {/* 대사 */}
        <div className="text-lg leading-relaxed">
          {displayedText}
          {!isTypingComplete && (
            <span className="inline-block w-1 h-5 bg-white ml-1 animate-pulse" />
          )}
        </div>

        {/* 말풍선 꼬리 */}
        <div
          className={`
            absolute -bottom-3 left-8
            w-0 h-0
            border-l-[15px] border-l-transparent
            border-r-[15px] border-r-transparent
            border-t-[15px]
          `}
          style={{
            borderTopColor:
              emotionStage === "S4"
                ? "#ef4444"
                : emotionStage === "S3"
                ? "#f97316"
                : emotionStage === "S2"
                ? "#22c55e"
                : emotionStage === "S1"
                ? "#3b82f6"
                : "#6b7280",
          }}
        />
      </div>
    </div>
  );
}
