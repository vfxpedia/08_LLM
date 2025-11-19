/**
 * ShareButton.tsx
 * SNS 공유 버튼 컴포넌트
 * 참조: docs/07_Social_Sharing.md
 */

"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui";
import type { EndingType } from "@/types";

export interface ShareButtonProps {
  /** 플레이어 닉네임 */
  nickname: string;
  /** 최종 점수 */
  totalScore: number;
  /** 엔딩 타입 */
  endingType: EndingType;
}

/**
 * SNS 공유 버튼 컴포넌트
 *
 * 사용 예시:
 * <ShareButton
 *   nickname="루비"
 *   totalScore={95}
 *   endingType="love"
 * />
 */
export default function ShareButton({
  nickname,
  totalScore,
  endingType,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  // 공유 텍스트 생성 (연령대 제외)
  const getShareText = () => {
    const endingText =
      endingType === "love"
        ? "완벽한 데이트 성공! 💕"
        : endingType === "cute_upset"
        ? "아쉽지만 괜찮아! 😤"
        : "다음엔 더 잘할 수 있어! 💔";

    return `나는 예리와의 데이트에서 ${totalScore}점을 받았어! ${endingText}\n\n#예리는못말려 #감정관찰게임`;
  };

  // 클립보드 복사
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("복사 실패:", error);
    }
  };

  // 트위터 공유
  const handleTwitterShare = () => {
    const text = encodeURIComponent(getShareText());
    const url = `https://twitter.com/intent/tweet?text=${text}`;
    window.open(url, "_blank", "width=600,height=400");
  };

  // 인스타그램 공유 (스토리)
  const handleInstagramShare = () => {
    // 인스타그램은 직접 공유 API가 없으므로 텍스트를 클립보드에 복사하고 안내
    handleCopyLink();
    alert(
      "텍스트가 복사되었습니다!\n인스타그램 앱을 열어서 스토리에 붙여넣어 주세요 📸"
    );
  };

  // 카카오톡 공유
  const handleKakaoShare = () => {
    // 카카오톡 공유는 Kakao SDK 필요
    // 현재는 텍스트 복사로 대체
    handleCopyLink();
    alert(
      "텍스트가 복사되었습니다!\n카카오톡에서 친구에게 붙여넣어 주세요 💬"
    );
  };

  // 페이스북 공유
  const handleFacebookShare = () => {
    const url = encodeURIComponent(window.location.href);
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
        결과 공유하기
      </h3>

      <div className="space-y-3">
        {/* 인스타그램 */}
        <Button
          variant="primary"
          fullWidth
          onClick={handleInstagramShare}
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          }
        >
          인스타그램 스토리
        </Button>

        {/* 카카오톡 */}
        <Button
          variant="primary"
          fullWidth
          onClick={handleKakaoShare}
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 3c5.799 0 10.5 3.664 10.5 8.185 0 4.52-4.701 8.184-10.5 8.184a13.5 13.5 0 0 1-1.727-.11l-4.408 2.883c-.501.265-.678.236-.472-.413l.892-3.678c-2.88-1.46-4.785-3.99-4.785-6.866C1.5 6.665 6.201 3 12 3zm5.907 8.06l1.47-1.424a.472.472 0 0 0-.656-.678l-1.928 1.866V9.282a.472.472 0 0 0-.944 0v2.557a.471.471 0 0 0 0 .222V13.5a.472.472 0 0 0 .944 0v-1.363l.427-.413 1.428 2.033a.472.472 0 1 0 .773-.543l-1.514-2.155zm-2.958 1.924h-1.46V9.297a.472.472 0 0 0-.943 0v4.159c0 .26.21.472.471.472h1.932a.472.472 0 1 0 0-.944zm-5.857-1.092l.696-1.707.638 1.707H9.092zm2.523.488l.002-.016a.469.469 0 0 0-.127-.32l-1.046-2.8a.69.69 0 0 0-.627-.474.696.696 0 0 0-.653.447l-1.661 4.075a.472.472 0 0 0 .874.357l.33-.813h2.07l.293.801a.472.472 0 1 0 .886-.325l-.341-.932zM8.293 9.302a.472.472 0 0 0-.471-.472H4.577a.472.472 0 1 0 0 .944h1.16v3.736a.472.472 0 0 0 .944 0V9.774h1.14c.261 0 .472-.212.472-.472z" />
            </svg>
          }
        >
          카카오톡 공유
        </Button>

        {/* 트위터 */}
        <Button
          variant="secondary"
          fullWidth
          onClick={handleTwitterShare}
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
            </svg>
          }
        >
          트위터에 공유
        </Button>

        {/* 페이스북 */}
        <Button
          variant="secondary"
          fullWidth
          onClick={handleFacebookShare}
          icon={
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
            </svg>
          }
        >
          페이스북에 공유
        </Button>

        {/* 링크 복사 */}
        <Button
          variant={copied ? "hint" : "secondary"}
          fullWidth
          onClick={handleCopyLink}
          icon={
            copied ? (
              <span>✓</span>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )
          }
        >
          {copied ? "복사 완료!" : "결과 텍스트 복사"}
        </Button>
      </div>

      {/* 공유 텍스트 미리보기 */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">미리보기:</p>
        <p className="text-sm text-gray-800 whitespace-pre-line">
          {getShareText()}
        </p>
      </div>
    </div>
  );
}
