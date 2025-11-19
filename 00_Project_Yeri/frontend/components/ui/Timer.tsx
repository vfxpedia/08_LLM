/**
 * Timer.tsx
 * 타이머 로직 컴포넌트
 * 참조: docs/05_UI_UX_Design.md
 */

"use client";

import { useEffect, useRef, useState } from "react";

export interface TimerProps {
  /** 전체 시간 (초) */
  totalTime: number;
  /** 타이머 시작 여부 */
  isActive: boolean;
  /** 타이머 콜백 함수 (100ms마다 호출) */
  onTick?: (remainingTime: number) => void;
  /** 타이머 종료 콜백 */
  onComplete?: () => void;
  /** 타이머 리셋 트리거 */
  resetTrigger?: number;
}

/**
 * 타이머 로직 컴포넌트
 *
 * 기능:
 * - 100ms 간격으로 남은 시간 업데이트
 * - 0초 도달 시 자동 종료
 * - 일시정지/재개 지원
 *
 * 사용 예시:
 * <Timer
 *   totalTime={10}
 *   isActive={true}
 *   onTick={(remaining) => setRemainingTime(remaining)}
 *   onComplete={() => handleTimeout()}
 * />
 */
export default function Timer({
  totalTime,
  isActive,
  onTick,
  onComplete,
  resetTrigger = 0,
}: TimerProps) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef<number>(0);
  const onTickRef = useRef(onTick);
  const onCompleteRef = useRef(onComplete);

  // 콜백 ref 업데이트
  useEffect(() => {
    onTickRef.current = onTick;
    onCompleteRef.current = onComplete;
  });

  // 타이머 리셋
  useEffect(() => {
    elapsedRef.current = 0;
    startTimeRef.current = null;
    if (onTickRef.current) {
      onTickRef.current(totalTime);
    }
  }, [totalTime, resetTrigger]);

  // 타이머 로직
  useEffect(() => {
    // 정리 함수
    const cleanup = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (!isActive) {
      // 일시정지: 경과 시간 저장
      if (startTimeRef.current !== null) {
        elapsedRef.current += (Date.now() - startTimeRef.current) / 1000;
        startTimeRef.current = null;
      }
      cleanup();
      return;
    }

    // 시작/재개
    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current === null) return;

      const currentElapsed = elapsedRef.current + (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, totalTime - currentElapsed);

      // 콜백 호출
      if (onTickRef.current) {
        onTickRef.current(remaining);
      }

      // 종료 처리
      if (remaining <= 0) {
        cleanup();
        if (onCompleteRef.current) {
          onCompleteRef.current();
        }
      }
    }, 100);

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, totalTime]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return null; // UI 없음 - 로직 컴포넌트
}

/**
 * 타이머 훅 (선택적)
 * 타이머를 컴포넌트 대신 훅으로 사용하고 싶을 때
 */
export function useTimer(
  totalTime: number,
  isActive: boolean,
  onComplete?: () => void
) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedRef = useRef<number>(0);
  const [remainingTime, setRemainingTime] = useState(totalTime);

  useEffect(() => {
    const cleanup = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    if (!isActive) {
      if (startTimeRef.current !== null) {
        elapsedRef.current += (Date.now() - startTimeRef.current) / 1000;
        startTimeRef.current = null;
      }
      cleanup();
      return;
    }

    startTimeRef.current = Date.now();

    intervalRef.current = setInterval(() => {
      if (startTimeRef.current === null) return;

      const currentElapsed = elapsedRef.current + (Date.now() - startTimeRef.current) / 1000;
      const remaining = Math.max(0, totalTime - currentElapsed);

      setRemainingTime(remaining);

      if (remaining <= 0) {
        cleanup();
        if (onComplete) {
          onComplete();
        }
      }
    }, 100);

    return cleanup;
  }, [isActive, totalTime, onComplete]);

  const reset = () => {
    elapsedRef.current = 0;
    startTimeRef.current = null;
    setRemainingTime(totalTime);
  };

  return { remainingTime, reset };
}
