/**
 * Button.tsx
 * 공통 버튼 컴포넌트
 * 참조: docs/05_UI_UX_Design.md
 */

import React from "react";

export type ButtonVariant = "primary" | "secondary" | "hint" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  isLoading?: boolean;
}

/**
 * 공통 버튼 컴포넌트
 *
 * 사용 예시:
 * <Button variant="primary" icon={<MicIcon />}>녹음 시작</Button>
 * <Button variant="hint" onClick={handleHint}>힌트 보기</Button>
 */
export default function Button({
  variant = "primary",
  size = "md",
  icon,
  fullWidth = false,
  isLoading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  // 스타일 매핑
  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-gradient-to-r from-pink-500 to-pink-600 text-white hover:from-pink-600 hover:to-pink-700 shadow-lg hover:shadow-xl active:scale-95",
    secondary:
      "bg-white text-pink-600 border-2 border-pink-500 hover:bg-pink-50 active:scale-95",
    hint:
      "bg-gradient-to-r from-purple-400 to-purple-500 text-white hover:from-purple-500 hover:to-purple-600 shadow-md hover:shadow-lg active:scale-95",
    danger:
      "bg-gray-400 text-white hover:bg-gray-500 active:scale-95",
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed hover:shadow-none";

  return (
    <button
      className={`
        font-bold
        transition-all duration-200
        flex items-center justify-center gap-2
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${disabled || isLoading ? disabledStyles : ""}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="flex-shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
