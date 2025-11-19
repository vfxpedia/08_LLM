/**
 * usePlayerAnswers.ts
 * 플레이어 연속 답변 관리 훅
 * 참조: docs/12_Game_Core_Design_Final.md Section 2
 */

"use client";

import { useState, useCallback } from "react";
import type { PlayerAnswer, TurnIndex, InputType } from "@/types";

export interface UsePlayerAnswersReturn {
  /** 현재 턴의 모든 답변 */
  answers: PlayerAnswer[];
  /** 새 답변 추가 */
  addAnswer: (content: string, inputType: InputType, turnIndex: TurnIndex) => void;
  /** 답변 판정 결과 업데이트 */
  updateAnswerResult: (
    answerIndex: number,
    isCorrect: boolean,
    similarity: number,
    emotionalScore: number,
    feedback?: string
  ) => void;
  /** 특정 턴의 답변만 필터링 */
  getAnswersByTurn: (turnIndex: TurnIndex) => PlayerAnswer[];
  /** 정답 개수 카운트 */
  getCorrectCount: (turnIndex?: TurnIndex) => number;
  /** 모든 답변 초기화 */
  clearAnswers: () => void;
}

/**
 * 플레이어 연속 답변 관리 훅
 *
 * 기능:
 * - 턴별 답변 저장 및 관리
 * - 답변 인덱스 자동 증가
 * - 정답 판정 결과 업데이트
 * - 턴별 필터링 및 통계
 *
 * 사용 예시:
 * const { answers, addAnswer, updateAnswerResult } = usePlayerAnswers();
 *
 * // 텍스트 답변 추가
 * addAnswer("예리 머리 가르마 바뀐 것 같아!", "text", 2);
 *
 * // 음성 답변 추가
 * addAnswer("립스틱 색깔 바뀌었어?", "voice", 2);
 *
 * // 답변 판정 결과 업데이트
 * updateAnswerResult(0, true, 0.85, 75, "오빠 센스 대박!");
 */
export function usePlayerAnswers(): UsePlayerAnswersReturn {
  const [answers, setAnswers] = useState<PlayerAnswer[]>([]);

  /**
   * 새 답변 추가
   */
  const addAnswer = useCallback(
    (content: string, inputType: InputType, turnIndex: TurnIndex) => {
      const newAnswer: PlayerAnswer = {
        turnIndex,
        answerIndex: answers.filter((a) => a.turnIndex === turnIndex).length + 1,
        content,
        inputType,
        timestamp: Date.now(),
        isCorrect: null,
        similarity: null,
        emotionalScore: 0,
      };

      setAnswers((prev) => [...prev, newAnswer]);
    },
    [answers]
  );

  /**
   * 답변 판정 결과 업데이트
   */
  const updateAnswerResult = useCallback(
    (
      answerIndex: number,
      isCorrect: boolean,
      similarity: number,
      emotionalScore: number,
      feedback?: string
    ) => {
      setAnswers((prev) =>
        prev.map((answer, idx) =>
          idx === answerIndex
            ? {
                ...answer,
                isCorrect,
                similarity,
                emotionalScore,
                feedback,
              }
            : answer
        )
      );
    },
    []
  );

  /**
   * 특정 턴의 답변만 필터링
   */
  const getAnswersByTurn = useCallback(
    (turnIndex: TurnIndex): PlayerAnswer[] => {
      return answers.filter((a) => a.turnIndex === turnIndex);
    },
    [answers]
  );

  /**
   * 정답 개수 카운트
   */
  const getCorrectCount = useCallback(
    (turnIndex?: TurnIndex): number => {
      const targetAnswers = turnIndex
        ? answers.filter((a) => a.turnIndex === turnIndex)
        : answers;

      return targetAnswers.filter((a) => a.isCorrect === true).length;
    },
    [answers]
  );

  /**
   * 모든 답변 초기화
   */
  const clearAnswers = useCallback(() => {
    setAnswers([]);
  }, []);

  return {
    answers,
    addAnswer,
    updateAnswerResult,
    getAnswersByTurn,
    getCorrectCount,
    clearAnswers,
  };
}
