/**
 * emotion.ts
 * 감정 시스템 관련 TypeScript 타입 정의
 * 참조: docs/03_Character_Design.md
 */

/**
 * 감정 단계 (Emotion Stage)
 * S0: 기본 (Neutral)
 * S1: 장난스러움 (Playful)
 * S2: 호기심/짜증 (Curious)
 * S3: 실망 (Upset)
 * S4: 감동 (Affectionate)
 */
export type EmotionStage = "S0" | "S1" | "S2" | "S3" | "S4";

/**
 * 감정 단계 정보
 */
export interface EmotionStageInfo {
  stage: EmotionStage;
  emotionName: string;
  name?: string;               // UI 표시용 이름 (선택적)
  description: string;
  expressionFile: string;
  emotionMultiplier: number;   // 점수 계산에 사용되는 감정 계수 (0.8 ~ 1.2)
  icon?: string;               // UI 아이콘 (선택적)
}

/**
 * EEVE LLM 감정 평가 결과
 */
export interface EmotionScore {
  emotionDepth: number;    // 감정 표현의 강도 (0.0 ~ 1.0)
  empathyScore: number;    // 예리의 감정에 대한 이해도 (0.0 ~ 1.0)
  senseScore: number;      // 대사나 표현의 센스/매력도 (0.0 ~ 1.0)
  overallStage: EmotionStage; // 전체 감정 단계
}

/**
 * 감정 전환 로직
 */
export interface EmotionTransition {
  fromStage: EmotionStage;
  toStage: EmotionStage;
  trigger: string;         // 전환 트리거 (예: 콤보 발생, 시간 초과)
  condition: string;       // 전환 조건 (예: EEVE 공감도 >= 0.8)
}

/**
 * 예리의 대사 데이터
 */
export interface YeriDialogue {
  emotionStage: EmotionStage;
  text: string;
  tone: string;            // 음성 톤
  cacheFile?: string;      // 캐시 파일명
  isCached: boolean;
  weight: number;          // 선택 가중치 (0.0 ~ 1.0)
}
