/**
 * IntroScreen.tsx
 * 게임 시작 전 인트로 화면 (예리 등장 + Before 이미지 관찰)
 * 참조: docs/11_Game_Flow_Redesign.md, docs/12_Game_Core_Design_Final.md Section 1
 */

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";

export interface IntroScreenProps {
  /** 플레이어 닉네임 */
  nickname: string;
  /** Before 이미지 URL */
  beforeImageUrl: string;
  /** 게임 시작 콜백 */
  onStart: () => void;
}

type IntroStep = "greeting" | "observation";

/**
 * 인트로 화면 컴포넌트
 *
 * 흐름:
 * 1. 예리 등장 + 인사 대사 + TTS 재생
 * 2. Before 이미지 관찰 화면
 * 3. 플레이어가 "시작하기" 버튼 클릭 → 게임 시작
 *
 * 사용 예시:
 * <IntroScreen
 *   nickname="플레이어"
 *   beforeImageUrl="/images/before.png"
 *   onStart={() => startGame()}
 * />
 */
export default function IntroScreen({
  nickname,
  beforeImageUrl,
  onStart,
}: IntroScreenProps) {
  const [step, setStep] = useState<IntroStep>("greeting");
  const [imageError, setImageError] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [currentDialogue, setCurrentDialogue] = useState("");

  // 인사 대사 (랜덤 선택 - 클라이언트에서만)
  useEffect(() => {
    const greetingDialogues = [
      `${nickname} 오빠~ 왜 이렇게 빨리 왔어? 예리 아직 준비 다 못했는데... 나 얼른 준비하고 올게~~~`,
      `${nickname} 오빠~ 기다렸지? 조금만 기다려줘~♡`,
      `${nickname} 오빠, 벌써 왔어? 예리 아직 화장 다 안 했는데...`,
    ];
    setCurrentDialogue(
      greetingDialogues[Math.floor(Math.random() * greetingDialogues.length)]
    );
  }, [nickname]);

  // 인사 단계 자동 진행 (3초 후)
  useEffect(() => {
    if (step === "greeting") {
      // TODO: TTS 재생 로직 추가 (예정)
      // playTTS(currentDialogue);

      const timer = setTimeout(() => {
        setStep("observation");
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [step]);

  // 인사 단계
  if (step === "greeting") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-50 to-pink-100 flex flex-col items-center justify-center p-8">
        {/* 예리 캐릭터 이미지 */}
        <div className="relative w-64 h-64 mb-8 animate-slideInDown">
          <Image
            src="/images/YERI_S0_default.png"
            alt="예리"
            fill
            className="object-contain"
            priority
            onError={() => {
              // 폴백: 이모지
            }}
          />
        </div>

        {/* 대사 박스 */}
        <div className="bg-white rounded-3xl shadow-2xl px-8 py-6 max-w-xl text-center animate-popIn">
          <p className="text-xl font-bold text-gray-800 leading-relaxed">
            {currentDialogue}
          </p>

          {/* 음성 재생 중 표시 */}
          {audioPlaying && (
            <div className="mt-4 flex items-center justify-center gap-2 text-pink-500">
              <span className="animate-pulse">🔊</span>
              <span className="text-sm">음성 재생 중...</span>
            </div>
          )}
        </div>

        {/* 로딩 애니메이션 */}
        <div className="mt-8 flex gap-2">
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <div className="w-3 h-3 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    );
  }

  // 관찰 단계
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-8">
      {/* 안내 텍스트 */}
      <div className="mb-6 text-center animate-slideInDown">
        <h2 className="text-3xl font-bold text-white mb-2">
          잘 기억해둬!
        </h2>
        <p className="text-gray-300 text-lg">
          예리의 모습을 집중해서 봐두세요 👀
        </p>
      </div>

      {/* Before 이미지 */}
      <div className="relative w-full max-w-3xl h-[500px] bg-gray-800 rounded-2xl overflow-hidden shadow-2xl mb-8">
        {!imageError ? (
          <Image
            src={beforeImageUrl}
            alt="예리 Before"
            fill
            className="object-contain p-4"
            priority
            sizes="100vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <span className="text-6xl">🖼️</span>
              <p className="mt-4 text-lg">이미지를 불러올 수 없습니다</p>
            </div>
          </div>
        )}

        {/* BEFORE 라벨 */}
        <div className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
          BEFORE
        </div>
      </div>

      {/* 시작 버튼 */}
      <button
        onClick={onStart}
        className="
          px-12 py-5
          bg-gradient-to-r from-pink-500 to-purple-500
          text-white text-xl font-bold
          rounded-full shadow-2xl
          hover:scale-110 hover:shadow-pink-500/50
          active:scale-95
          transition-all duration-300
          transform
          animate-pulse
        "
      >
        🚀 게임 시작하기!
      </button>

      {/* 안내 문구 */}
      <p className="mt-6 text-gray-400 text-sm">
        버튼을 누르면 바로 1턴이 시작됩니다!
      </p>
    </div>
  );
}
