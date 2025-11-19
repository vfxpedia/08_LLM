/**
 * Popup.tsx
 * 게임 피드백 팝업 컴포넌트
 * 참조: docs/05_UI_UX_Design.md
 */

"use client";

import React, { useEffect, useState } from "react";

export type PopupType = "correct" | "wrong" | "combo" | "hint" | "info";

export interface PopupProps {
  /** 표시할 메시지 */
  message: string;
  /** 팝업 타입 */
  type: PopupType;
  /** 표시 여부 */
  isVisible: boolean;
  /** 자동 닫기 시간 (ms, 0이면 수동 닫기) */
  duration?: number;
  /** 닫기 콜백 */
  onClose?: () => void;
  /** 추가 아이콘 */
  icon?: React.ReactNode;
}

/**
 * 게임 피드백 팝업 컴포넌트
 *
 * 기능:
 * - 정답/오답/콤보 피드백
 * - 힌트 표시
 * - 팡! 애니메이션 효과
 *
 * 사용 예시:
 * <Popup
 *   message="정답! +15점"
 *   type="correct"
 *   isVisible={true}
 *   duration={2000}
 *   onClose={() => setShowPopup(false)}
 * />
 */
export default function Popup({
  message,
  type,
  isVisible,
  duration = 2000,
  onClose,
  icon,
}: PopupProps) {
  const [shouldRender, setShouldRender] = useState(isVisible);

  // 자동 닫기
  useEffect(() => {
    if (!isVisible) {
      // 애니메이션 후 언마운트
      const timeout = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timeout);
    }

    setShouldRender(true);

    if (duration > 0) {
      const timer = setTimeout(() => {
        if (onClose) {
          onClose();
        }
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  // 렌더링하지 않음
  if (!shouldRender) return null;

  // 타입별 스타일
  const typeStyles: Record<PopupType, { bg: string; icon: string; border: string }> = {
    correct: {
      bg: "bg-gradient-to-br from-green-400 to-green-500",
      icon: "✅",
      border: "border-green-300",
    },
    wrong: {
      bg: "bg-gradient-to-br from-red-400 to-red-500",
      icon: "❌",
      border: "border-red-300",
    },
    combo: {
      bg: "bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500",
      icon: "🔥",
      border: "border-yellow-300",
    },
    hint: {
      bg: "bg-gradient-to-br from-purple-400 to-purple-500",
      icon: "💡",
      border: "border-purple-300",
    },
    info: {
      bg: "bg-gradient-to-br from-blue-400 to-blue-500",
      icon: "ℹ️",
      border: "border-blue-300",
    },
  };

  const style = typeStyles[type];

  return (
    <div
      className={`
        fixed top-32 left-1/2 -translate-x-1/2 z-50
        ${isVisible ? "animate-popIn" : "animate-popOut"}
      `}
    >
      <div
        className={`
          ${style.bg}
          text-white
          px-6 py-4
          rounded-2xl
          shadow-2xl
          border-2 ${style.border}
          transform
          min-w-[200px]
          max-w-[400px]
          flex items-center gap-3
        `}
        onClick={onClose}
      >
        {/* 아이콘 */}
        <div className="text-3xl animate-bounce">
          {icon || style.icon}
        </div>

        {/* 메시지 */}
        <p className="text-lg font-bold whitespace-pre-line flex-1">
          {message}
        </p>
      </div>
    </div>
  );
}

/**
 * 팝업 훅 (선택적)
 * 팝업 상태 관리를 간편하게
 */
export function usePopup() {
  const [popupState, setPopupState] = useState<{
    isVisible: boolean;
    message: string;
    type: PopupType;
    icon?: React.ReactNode;
  }>({
    isVisible: false,
    message: "",
    type: "info",
  });

  const showPopup = (
    message: string,
    type: PopupType = "info",
    icon?: React.ReactNode
  ) => {
    setPopupState({ isVisible: true, message, type, icon });
  };

  const hidePopup = () => {
    setPopupState((prev) => ({ ...prev, isVisible: false }));
  };

  return { popupState, showPopup, hidePopup };
}
