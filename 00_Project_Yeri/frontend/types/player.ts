/**
 * player.ts
 * 플레이어 정보 관련 TypeScript 타입 정의
 */

/**
 * 연령대 선택지
 * 40대+ 제거: 타겟층을 MZ세대 + 3040으로 집중
 */
export type AgeGroup = "10대" | "20대" | "30대";

/**
 * 플레이어 정보
 */
export interface PlayerInfo {
  playerId?: string;       // 선택적 플레이어 ID
  name: string;            // 플레이어 이름 (닉네임)
  ageGroup: AgeGroup;      // 연령대
  createdAt?: Date;        // 생성 시간
}

/**
 * 시작 화면 폼 데이터
 */
export interface StartFormData {
  name: string;
  ageGroup: AgeGroup;
}
