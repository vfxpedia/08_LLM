/**
 * index.ts
 * 모든 타입을 한 곳에서 export
 */

// Emotion Types
export type {
  EmotionStage,
  EmotionStageInfo,
  EmotionScore,
  EmotionTransition,
  YeriDialogue,
} from "./emotion";

// Player Types
export type {
  AgeGroup,
  PlayerInfo,
  StartFormData,
} from "./player";

// Game Types
export type {
  Difficulty,
  GameMode,
  ImageDisplayMode,
  SessionStatus,
  TurnIndex,
  InputType,
  PlayerAnswer,
  AnswerSet,
  GameData,
  ImagePair,
  ComboState,
  ScoreSnapshot,
  TurnState,
  EndingType,
  FinalScore,
  GameSession,
  GameState,
} from "./game";

// API Types
export type {
  ApiResponse,
  SessionStartRequest,
  SessionStartResponse,
  PlayerAnswerRequest,
  PlayerAnswerResponse,
  SessionFinishRequest,
  SessionFinishResponse,
  HealthCheckResponse,
} from "./api";
