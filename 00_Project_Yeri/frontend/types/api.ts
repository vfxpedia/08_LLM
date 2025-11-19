/**
 * api.ts
 * 백엔드 API 요청/응답 TypeScript 타입 정의
 * 참조: backend/app/models/session.py
 */

import { Difficulty, ImagePair, TurnIndex, InputType, EndingType } from "./game";
import { EmotionStage } from "./emotion";

/**
 * API 응답 기본 구조
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// ==================== 세션 시작 ====================

/**
 * POST /api/session/start - 요청
 */
export interface SessionStartRequest {
  player_id?: string;
  difficulty?: Difficulty;
}

/**
 * POST /api/session/start - 응답
 */
export interface SessionStartResponse {
  session_id: string;
  image_pair: ImagePair;
  current_turn: number;
  emotion_stage: EmotionStage;
  time_limit_sec: number;
  yeri_opening_text: string;
  yeri_opening_voice_url?: string;
}

// ==================== 답변 제출 ====================

/**
 * POST /api/session/answer - 요청
 */
export interface PlayerAnswerRequest {
  session_id: string;
  turn_index: TurnIndex;
  input_type: InputType;
  content: string;         // 텍스트 또는 오디오 base64
}

/**
 * POST /api/session/answer - 응답
 */
export interface PlayerAnswerResponse {
  yeri_text: string;
  yeri_voice_url?: string;
  emotion_stage: EmotionStage;
  updated_scores: {
    turn_score?: number;
    combo?: number;
  };
  remaining_sec: number;
  combo_count: number;
  is_turn_finished: boolean;
}

// ==================== 세션 종료 ====================

/**
 * POST /api/session/finish - 요청
 */
export interface SessionFinishRequest {
  session_id: string;
}

/**
 * POST /api/session/finish - 응답
 */
export interface SessionFinishResponse {
  session_id: string;
  final_score: number;
  ending_type: EndingType;
  yeri_ending_text: string;
  yeri_ending_voice_url?: string;
  can_retry: boolean;
  score_breakdown: {
    emotional_sense: number;
    observation: number;
    reflex: number;
  };
}

// ==================== Health Check ====================

/**
 * GET /api/health - 응답
 */
export interface HealthCheckResponse {
  status: string;
  app_name: string;
  version: string;
  environment: string;
  timestamp: string;
}
