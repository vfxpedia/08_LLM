/**
 * game.ts
 * 게임 상태 및 턴 관련 TypeScript 타입 정의
 * 참조: docs/01_Game_Structure.md, docs/02_Score_System_Detail.md, docs/12_Game_Core_Design_Final.md
 */

import { EmotionStage, EmotionScore } from "./emotion";
import { PlayerInfo } from "./player";

/**
 * 게임 난이도
 */
export type Difficulty = "easy" | "medium" | "hard";

/**
 * 게임 모드
 */
export type GameMode = "quick_date" | "long_date";

/**
 * 이미지 표시 모드 (턴별 다름)
 */
export type ImageDisplayMode = "after_only" | "before_after_split";

/**
 * 게임 세션 상태
 */
export type SessionStatus = "playing" | "finished" | "timeout" | "error";

/**
 * 턴 번호 (1, 2, 3)
 */
export type TurnIndex = 1 | 2 | 3;

/**
 * 입력 유형 (텍스트 or 음성)
 */
export type InputType = "text" | "voice";

/**
 * 플레이어 답변 (연속 입력 저장용)
 * 참조: docs/12_Game_Core_Design_Final.md Section 2
 */
export interface PlayerAnswer {
  /** 어느 턴의 답변인지 */
  turnIndex: TurnIndex;
  /** 해당 턴 내 답변 순서 (1, 2, 3...) */
  answerIndex: number;
  /** 답변 내용 (텍스트 또는 STT 변환 결과) */
  content: string;
  /** 입력 방식 */
  inputType: InputType;
  /** 답변 시각 (타임스탬프) */
  timestamp: number;
  /** 정답 여부 (판정 전: null, 판정 후: true/false) */
  isCorrect: boolean | null;
  /** VectorDB 유사도 점수 (0.0~1.0, 판정 전: null) */
  similarity: number | null;
  /** EEVE 감정 분석 점수 (0~100) */
  emotionalScore: number;
  /** 피드백 메시지 (EEVE 생성, 예: "오빠 센스있다~!") */
  feedback?: string;
}

/**
 * 정답 세트 (게임 데이터 구조)
 * 참조: docs/12_Game_Core_Design_Final.md Section 4
 */
export interface AnswerSet {
  /** 핵심 키워드 리스트 (예: ["머리 가르마", "왼쪽", "오른쪽"]) */
  keywords: string[];
  /** 감정 표현 키워드 (예: ["예쁘다", "잘 어울린다", "달라졌다"]) */
  emotionalKeywords: string[];
  /** 정답 판정 임계값 (0.7 = 70% 유사도) */
  threshold: number;
}

/**
 * 게임 데이터 (이미지 쌍 + 정답 세트)
 * 참조: docs/12_Game_Core_Design_Final.md Section 4
 */
export interface GameData {
  /** 게임 ID */
  id: string;
  /** Before 이미지 경로 */
  beforeImage: string;
  /** After 이미지 경로 */
  afterImage: string;
  /** 정답 세트 */
  correctAnswers: AnswerSet;
  /** 난이도 */
  difficulty: Difficulty;
  /** 총 변화 개수 (Easy: 2, Medium: 3, Hard: 5) */
  totalChanges: number;
  /** 변화 포인트 설명 (관리용) */
  changeDescription: string;
}

/**
 * Before/After 이미지 세트
 */
export interface ImagePair {
  pairId: string;
  beforeUrl: string;
  afterUrl: string;
  differences: string[];   // 변화 포인트 리스트 (예: 헤어스타일, 립스틱)
  difficulty: Difficulty;
}

/**
 * 콤보 상태
 */
export interface ComboState {
  currentCombo: number;    // 현재 콤보 수 (0~3)
  maxCombo: number;        // 최대 콤보 수
  lastAnswerCorrect: boolean;
}

/**
 * 턴별 점수 스냅샷
 */
export interface ScoreSnapshot {
  turnIndex: TurnIndex;
  emotionalSense: number;  // 감정센스 점수 (0~100)
  observation: number;     // 관찰력 점수 (0~100)
  reflex: number;          // 순발력 점수 (0~100)
  emotionMultiplier: number; // 감정 계수 (0.8~1.2)
  comboBonus: number;      // 콤보 보너스 (0~6)
  turnScore: number;       // 턴 최종 점수
}

/**
 * 턴 상태
 */
export interface TurnState {
  turnIndex: TurnIndex;
  timeLimitSec: number;    // 제한 시간 (3, 10, 40/60초)
  remainingSec: number;    // 남은 시간
  startTime: Date;
  answers: PlayerAnswer[]; // 플레이어 답변 리스트 (연속 입력 지원)
  emotionScores: EmotionScore[]; // EEVE 감정 평가 결과 리스트
  comboState: ComboState;
  isFinished: boolean;
  isPaused: boolean;       // 타이머 일시정지 여부 (힌트 사용 시)
}

/**
 * 엔딩 타입
 */
export type EndingType = "love" | "cute_upset" | "breakup";

/**
 * 최종 점수 및 엔딩
 */
export interface FinalScore {
  totalScore: number;      // 최종 점수 (0~120)
  turnScores: ScoreSnapshot[]; // 턴별 점수 리스트
  endingType: EndingType;
  endingMessage: string;
}

/**
 * 게임 세션 상태 (클라이언트)
 */
export interface GameSession {
  sessionId: string;
  player: PlayerInfo;
  currentTurn: TurnIndex;
  turns: TurnState[];
  emotionStage: EmotionStage;
  finalScore?: FinalScore;
  status: SessionStatus;
  imagePair: ImagePair;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * 게임 진행 상태 (UI용)
 */
export interface GameState {
  session: GameSession | null;
  isLoading: boolean;
  error: string | null;
  currentDialogue: string;     // 현재 예리 대사
  currentVoiceUrl?: string;    // 현재 음성 URL
}
