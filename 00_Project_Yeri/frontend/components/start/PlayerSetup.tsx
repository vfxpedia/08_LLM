/**
 * PlayerSetup.tsx
 * 플레이어 정보 입력 컴포넌트
 * 참조: docs/02_Score_System_Detail.md
 */

"use client";

import React, { useState } from "react";
import { AgeGroup } from "@/types";

export interface PlayerSetupProps {
  /** 플레이어 닉네임 */
  nickname: string;
  /** 연령대 */
  ageGroup: AgeGroup | null;
  /** 닉네임 변경 콜백 */
  onNicknameChange: (nickname: string) => void;
  /** 연령대 변경 콜백 */
  onAgeGroupChange: (ageGroup: AgeGroup) => void;
}

/**
 * 플레이어 정보 입력 컴포넌트
 *
 * 사용 예시:
 * <PlayerSetup
 *   nickname={nickname}
 *   ageGroup={ageGroup}
 *   onNicknameChange={setNickname}
 *   onAgeGroupChange={setAgeGroup}
 * />
 */
export default function PlayerSetup({
  nickname,
  ageGroup,
  onNicknameChange,
  onAgeGroupChange,
}: PlayerSetupProps) {
  const [nicknameError, setNicknameError] = useState<string | null>(null);

  const ageGroups: AgeGroup[] = ["10대", "20대", "30대"];

  // 닉네임 검증
  const handleNicknameChange = (value: string) => {
    // 우선 상태 업데이트 (한글 입력 즉시 반영)
    onNicknameChange(value);

    // 10자 제한
    if (value.length > 10) {
      setNicknameError("닉네임은 최대 10자까지 입력 가능합니다");
      return;
    }

    // 특수문자 제한
    const regex = /^[가-힣a-zA-Z0-9\s]*$/;
    if (value.length > 0 && !regex.test(value)) {
      setNicknameError("한글, 영문, 숫자만 입력 가능합니다");
      return;
    }

    setNicknameError(null);
  };

  return (
    <div className="space-y-6">
      {/* 닉네임 입력 */}
      <div>
        <label className="block text-lg font-bold text-gray-800 mb-3">
          닉네임
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => handleNicknameChange(e.target.value)}
          placeholder="닉네임을 입력하세요 (최대 10자)"
          maxLength={10}
          className={`
            w-full px-4 py-3
            border-2 rounded-xl
            text-lg
            transition-colors
            ${
              nicknameError
                ? "border-red-400 focus:border-red-500"
                : "border-gray-300 focus:border-pink-500"
            }
            focus:outline-none
          `}
        />

        {/* 에러 메시지 */}
        {nicknameError && (
          <p className="mt-2 text-sm text-red-500">{nicknameError}</p>
        )}

        {/* 글자 수 표시 */}
        <p className="mt-2 text-sm text-gray-500 text-right">
          {nickname.length}/10자
        </p>
      </div>

      {/* 연령대 선택 */}
      <div>
        <label className="block text-lg font-bold text-gray-800 mb-3">
          연령대
        </label>
        <div className="grid grid-cols-3 gap-3">
          {ageGroups.map((age) => {
            const isSelected = ageGroup === age;

            return (
              <button
                key={age}
                onClick={() => onAgeGroupChange(age)}
                className={`
                  py-3 px-4
                  rounded-xl
                  font-bold
                  transition-all duration-200
                  ${
                    isSelected
                      ? "bg-pink-500 text-white shadow-lg scale-105"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }
                `}
              >
                {age}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
