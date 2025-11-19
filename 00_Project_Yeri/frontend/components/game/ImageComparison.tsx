/**
 * ImageComparison.tsx
 * Before/After 이미지 비교 컴포넌트 (하이브리드 방식)
 * 참조: docs/05_UI_UX_Design.md, docs/12_Game_Core_Design_Final.md
 */

"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ImageDisplayMode, TurnIndex } from "@/types";

export interface ImageComparisonProps {
  /** Before 이미지 URL */
  beforeUrl: string;
  /** After 이미지 URL */
  afterUrl: string;
  /** 현재 턴 */
  turnIndex: TurnIndex;
  /** 이미지 표시 모드 (턴별 자동 결정) */
  displayMode?: ImageDisplayMode;
  /** 힌트 사용 가능 여부 */
  canUseHint?: boolean;
  /** 힌트 사용 콜백 (타이머 일시정지 요청) */
  onHintStart?: () => void;
  /** 힌트 종료 콜백 (타이머 재개 요청) */
  onHintEnd?: () => void;
}

/**
 * 이미지 비교 컴포넌트
 *
 * 하이브리드 방식:
 * - 1턴 (3초): After만 전체 화면 표시
 * - 2턴 (10초): After만 표시 + 힌트 버튼 (카드 플립으로 Before 확인)
 * - 3턴 (40초/60초): Before/After 좌우 분할
 *
 * 사용 예시:
 * <ImageComparison
 *   beforeUrl="/images/before.jpg"
 *   afterUrl="/images/after.jpg"
 *   turnIndex={2}
 *   canUseHint={true}
 *   onHintStart={() => pauseTimer()}
 *   onHintEnd={() => resumeTimer()}
 * />
 */
export default function ImageComparison({
  beforeUrl,
  afterUrl,
  turnIndex,
  displayMode,
  canUseHint = false,
  onHintStart,
  onHintEnd,
}: ImageComparisonProps) {
  // 턴에 따라 표시 모드 자동 결정
  const mode: ImageDisplayMode =
    displayMode || (turnIndex === 1 ? "after_only" : turnIndex === 2 ? "after_only" : "before_after_split");

  const [imageError, setImageError] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);
  const [autoFlipCountdown, setAutoFlipCountdown] = useState<number | null>(null);

  // 힌트 버튼 클릭 핸들러
  const handleHintClick = () => {
    if (hintUsed || !canUseHint) return;

    setIsFlipped(true);
    setHintUsed(true);

    // 타이머 일시정지 요청
    if (onHintStart) {
      onHintStart();
    }

    // 5초 카운트다운 시작
    setAutoFlipCountdown(5);
  };

  // 5초 자동 복귀 카운트다운
  useEffect(() => {
    if (autoFlipCountdown === null || autoFlipCountdown <= 0) {
      if (autoFlipCountdown === 0) {
        // 카운트다운 종료 - After로 복귀
        setIsFlipped(false);
        setAutoFlipCountdown(null);

        // 타이머 재개 요청
        if (onHintEnd) {
          onHintEnd();
        }
      }
      return;
    }

    const timer = setTimeout(() => {
      setAutoFlipCountdown(autoFlipCountdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [autoFlipCountdown, onHintEnd]);

  // After만 표시 (1턴 또는 2턴)
  if (mode === "after_only") {
    return (
      <div className="relative w-full h-full min-h-[500px] bg-gray-900 flex items-center justify-center">
        {/* 3D 카드 플립 컨테이너 */}
        <div
          className="relative w-full h-full min-h-[500px]"
          style={{
            perspective: "1000px",
          }}
        >
          <div
            className="relative w-full h-full transition-transform duration-700"
            style={{
              transformStyle: "preserve-3d",
              transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            {/* 앞면 - After 이미지 */}
            <div
              className="absolute w-full h-full"
              style={{
                backfaceVisibility: "hidden",
              }}
            >
              {!imageError ? (
                <Image
                  src={afterUrl}
                  alt="변화 후 이미지"
                  fill
                  className="object-contain"
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
            </div>

            {/* 뒷면 - Before 이미지 */}
            <div
              className="absolute w-full h-full"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {!imageError ? (
                <Image
                  src={beforeUrl}
                  alt="변화 전 이미지"
                  fill
                  className="object-contain"
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
            </div>
          </div>
        </div>

        {/* 턴별 안내 텍스트 */}
        {turnIndex === 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-pink-500 text-white px-6 py-2 rounded-full shadow-lg animate-slideInDown">
            <span className="font-bold">⚡ 첫인상 집중!</span>
          </div>
        )}

        {/* 2턴 힌트 버튼 */}
        {turnIndex === 2 && canUseHint && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
            {/* 카운트다운 표시 */}
            {autoFlipCountdown !== null && autoFlipCountdown > 0 && (
              <div className="bg-purple-600 text-white px-6 py-3 rounded-full shadow-lg text-2xl font-bold animate-pulse">
                {autoFlipCountdown}초 후 자동 복귀
              </div>
            )}

            {/* 힌트 버튼 */}
            <button
              onClick={handleHintClick}
              disabled={hintUsed || !canUseHint}
              className={`
                px-8 py-4 rounded-full text-lg font-bold shadow-2xl
                transition-all duration-300 transform
                ${
                  hintUsed
                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:scale-110 hover:shadow-purple-500/50 active:scale-95"
                }
              `}
            >
              {hintUsed ? "💡 힌트 사용 완료" : "💡 힌트 보기 (1회)"}
            </button>

            {!hintUsed && (
              <p className="text-white text-sm bg-black/50 px-4 py-2 rounded-full">
                클릭하면 이전 모습을 5초간 볼 수 있어요!
              </p>
            )}
          </div>
        )}

        {/* 플립 상태 표시 */}
        {isFlipped && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-blue-500 text-white px-6 py-2 rounded-full shadow-lg">
            <span className="font-bold">🔄 이전 모습 (BEFORE)</span>
          </div>
        )}
      </div>
    );
  }

  // Before/After 분할 (2-3턴)
  return (
    <div className="relative w-full h-full min-h-[500px] bg-gray-900 flex gap-2 p-2">
      {/* Before 이미지 */}
      <div className="relative flex-1 min-h-[500px] bg-gray-800 rounded-lg overflow-hidden">
        <div className="absolute top-3 left-3 z-10 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          BEFORE
        </div>

        {!imageError ? (
          <Image
            src={beforeUrl}
            alt="변화 전 이미지"
            fill
            className="object-contain p-2"
            priority
            sizes="50vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <span className="text-4xl">🖼️</span>
              <p className="mt-2 text-sm">이미지 로딩 실패</p>
            </div>
          </div>
        )}
      </div>

      {/* 구분선 */}
      <div className="w-1 bg-gradient-to-b from-pink-500 via-purple-500 to-pink-500 rounded-full shadow-lg" />

      {/* After 이미지 */}
      <div className="relative flex-1 min-h-[500px] bg-gray-800 rounded-lg overflow-hidden">
        <div className="absolute top-3 right-3 z-10 bg-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
          AFTER
        </div>

        {!imageError ? (
          <Image
            src={afterUrl}
            alt="변화 후 이미지"
            fill
            className="object-contain p-2"
            priority
            sizes="50vw"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-white">
              <span className="text-4xl">🖼️</span>
              <p className="mt-2 text-sm">이미지 로딩 실패</p>
            </div>
          </div>
        )}
      </div>

      {/* 비교 안내 텍스트 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-6 py-2 rounded-full shadow-lg animate-slideInDown">
        <span className="font-bold">🔄 비교해서 찾아보세요!</span>
      </div>
    </div>
  );
}
